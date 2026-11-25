import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext } from '@storybook/test-runner';
import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';
import { findFocusRingViolations } from './focus-ring-check';

/**
 * Storybook test-runner 設定。
 *
 * 全 Story に対して (1) smoke render + play 関数の実行 (test-runner 標準) と
 * (2) axe による a11y 自動監査 (postVisit) と (3) フォーカスの輪の検査 (postVisit、focus-ring-check.ts) を行う。
 * CI の Run Storybook tests ステップで実行。
 *
 * 幅 (#165、AGENTS §8-4「幅で構造が変わる story」):
 *   - 走る幅: story が Storybook の viewport の global (`globals.viewport.value = '375-667'`) で幅を決めていると、
 *     描く前 (preVisit) にその幅にして、play・axe・輪の検査をその幅で走らせる。終わったら (postVisit の最後に) 元の幅に戻す。
 *     宣言の無い story は既定の幅 (1280) のまま。1 つの story は 1 つの幅で play を走らせる (幅ごとに story を分ける)
 *   - 見る幅: axe と輪の検査は、既定の幅で見た後、`parameters.chromatic.viewports` (撮影の幅) で宣言している残りの幅でも見る
 *
 * a11y 例外: AGENTS §8 のとおり、意図的に許容する違反は Story の
 * `parameters.a11y` で個別に制御する (理由コメント必須):
 *   - `parameters.a11y.disable = true`            … その Story の axe 監査をスキップ
 *   - `parameters.a11y.config.rules = [{ id, enabled:false }]` … 特定ルールのみ無効化
 */

// 孤立した component story では当然成立しない「ページ全体 / 単一ランドマーク」前提の
// best-practice ルールはグローバルで無効化する。理由:
//  - region / landmark-one-main / page-has-heading-one: story は landmark 外の素片
//  - landmark-unique / landmark-no-duplicate-*: 1 story 内に複数デモ (AppShell 等) を並べると
//    <header>/<nav>/<main> が重複するが、これは story 構成の都合でコンポーネントの欠陥ではない
const PAGE_LEVEL_RULES_DISABLED = [
  { id: 'region', enabled: false },
  { id: 'landmark-one-main', enabled: false },
  { id: 'page-has-heading-one', enabled: false },
  { id: 'landmark-unique', enabled: false },
  { id: 'landmark-no-duplicate-main', enabled: false },
  { id: 'landmark-no-duplicate-banner', enabled: false },
  { id: 'landmark-no-duplicate-contentinfo', enabled: false },
];

// color-contrast を component 単位で免除する (理由付き)。AGENTS §8 の方針に従い、ここに集約する。
//  - disabled/placeholder 状態のデモ: WCAG 1.4.3 は disabled UI を contrast 要件から免除 (恒久)
//  - 「TODO(contrast)」付き: 既知 finding。token contrast 見直し PR で解消後にエントリを削除する
const COLOR_CONTRAST_EXEMPT: Record<string, string> = {
  'Primitives/Label': 'disabled 状態ラベルの意図的低コントラスト (WCAG 1.4.3 は disabled を免除)',
  'Primitives/Typography': 'disabled variant デモの意図的低コントラスト (WCAG 免除)',
  'Primitives/Image': 'empty/error placeholder の disabled 色テキスト (WCAG 免除)',
  'Composites/Tabs': 'disabled タブの件数 badge (disabled 状態、WCAG 免除)',
  'Composites/Popover': 'TODO(contrast): muted text が layered 背景上で AA 4.5 未満。contrast 見直しで対応予定',
  'Composites/SplitPane': 'TODO(contrast): muted text が layered 背景上で AA 4.5 未満。contrast 見直しで対応予定',
};

// フォーカスの輪の検査 (focus-ring-check.ts、DDR-2 #131 / #139) を story 単位で免除する (理由付き)。
// 対象は出荷する部品の story (Primitives/* と Composites/*) だけ。Tokens / Principles は UI ではないので見ない。
//  - 「TODO(focus)」付き: 既知 finding。直したらエントリを削除する
// story 単位で外すときは `parameters.focusRing = { disable: true }` (理由コメント必須)。
const FOCUS_RING_EXEMPT: Record<string, string> = {};

const FOCUS_RING_TARGET = /^(Primitives|Composites)\//;

/** 走る幅を変えた story の、元の幅 (postVisit の最後に戻す)。null = 変えていない */
let viewportToRestore: { width: number; height: number } | null = null;

const config: TestRunnerConfig = {
  async preVisit(page, context) {
    // 決定性のため reduced-motion を常時強制する。CI の Playwright は既定で
    // prefers-reduced-motion をエミュレートせず、transition / animation が play・axe の
    // タイミング flake を生む。flake はエージェントに誤った自己修正を誘発するため排除する。
    // (reduced-motion 対応自体の検証は別途手動)
    // 例外: 動きがあるときにだけ通る道 (下から出る面が閉じる動きの間に、次の dialog が開く等) を守る play は、
    // story の `parameters.reducedMotion = { disable: true }` (理由コメント必須) で強制を外す。待ち方は条件 (waitFor) で書く
    const storyContext = await getStoryContext(page, context);
    await page.emulateMedia({ reducedMotion: storyContext.parameters?.reducedMotion?.disable ? 'no-preference' : 'reduce' });
    await injectAxe(page);
    await applyStoryViewport(page, storyContext);
  },
  async postVisit(page, context) {
    try {
      const storyContext = await getStoryContext(page, context);
      await runAxe(page, storyContext);
      // フォーカスを動かすので、axe の後に走らせる
      await runFocusRingCheck(page, storyContext);
    } finally {
      // 走る幅を変えた story の後は元の幅に戻す (次の story に持ち越さない)。play・axe が落ちても戻す
      if (viewportToRestore) {
        await page.setViewportSize(viewportToRestore);
        viewportToRestore = null;
      }
    }
  },
};

type StoryContext = Awaited<ReturnType<typeof getStoryContext>>;
type Page = Parameters<NonNullable<TestRunnerConfig['postVisit']>>[0];

/**
 * story が宣言した走る幅 (Storybook の viewport の global、`'375-667'` の形)。宣言が無ければ null。
 * 読めない値は落とす (宣言が黙って無視され、既定の幅で走って通るのを防ぐ)
 */
function declaredRunViewport(storyContext: StoryContext): { width: number; height: number } | null {
  const raw: unknown = (storyContext as { storyGlobals?: Record<string, unknown> }).storyGlobals?.viewport;
  const value = typeof raw === 'object' && raw !== null ? (raw as { value?: unknown }).value : raw;
  if (value === undefined || value === null || value === '') return null;
  const m = typeof value === 'string' ? /^(\d{2,4})-(\d{2,4})$/.exec(value) : null;
  if (!m) {
    throw new Error(
      `story の viewport の global (${JSON.stringify(value)}) を読めない。走る幅は '375-667' (幅-高さ、px) の形で書く (AGENTS §8-4)`,
    );
  }
  return { width: Number(m[1]), height: Number(m[2]) };
}

/** 走る幅の宣言がある story は、描く前にその幅にする (#165) */
async function applyStoryViewport(page: Page, storyContext: StoryContext) {
  const declared = declaredRunViewport(storyContext);
  if (!declared) return;
  const original = page.viewportSize();
  if (original && original.width === declared.width && original.height === declared.height) return;
  if (original && !viewportToRestore) viewportToRestore = original;
  await page.setViewportSize(declared);
  await settleLayout(page);
}

/**
 * 「この幅では別の見え方になる」の宣言 (`parameters.chromatic.viewports`、§9-4) のうち、今の幅以外。
 * axe と輪の検査が、今の幅で見た後に見る幅
 */
function declaredExtraWidths(page: Page, storyContext: StoryContext): number[] {
  const current = page.viewportSize()?.width;
  const declared: unknown = storyContext.parameters?.chromatic?.viewports;
  return Array.isArray(declared)
    ? [...new Set(declared.filter((w): w is number => typeof w === 'number' && w !== current))]
    : [];
}

/** 幅を順に変えて fn を走らせ、最後に元の幅に戻す */
async function atWidths(page: Page, widths: number[], fn: (width: number) => Promise<void>) {
  const original = page.viewportSize();
  if (!original || widths.length === 0) return;
  try {
    for (const width of widths) {
      await page.setViewportSize({ width, height: original.height });
      await settleLayout(page);
      await fn(width);
    }
  } finally {
    await page.setViewportSize(original);
    await settleLayout(page);
  }
}

async function runAxe(page: Page, storyContext: StoryContext) {
  // 個別に a11y を無効化した Story はスキップ。
  if (storyContext.parameters?.a11y?.disable) return;

  // Tokens/* カテゴリは「色・値そのものの可視化」であり UI ではない (色見本の contrast や
  // デモ markup の aria は監査対象外)。カタログ全体を axe からスキップする。
  if (storyContext.title?.startsWith('Tokens/')) return;

  const rules = [
    ...PAGE_LEVEL_RULES_DISABLED,
    ...(storyContext.parameters?.a11y?.config?.rules ?? []),
  ];
  if (storyContext.title && COLOR_CONTRAST_EXEMPT[storyContext.title]) {
    rules.push({ id: 'color-contrast', enabled: false });
  }

  await configureAxe(page, { rules });

  const check = () =>
    checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  // まず今の幅 (既定の 1280、または story が宣言した走る幅) で見る
  await check();
  // 幅で構造が変わる story は、撮影の幅の宣言 (`chromatic.viewports`) の残りの幅でも見る (#165)。
  // 輪の検査と同じ宣言を読む: 狭い幅でだけ出る面 (下から出る面・画面いっぱいの FormDialog) は既定の幅では描かれない
  await atWidths(page, declaredExtraWidths(page, storyContext), async (width) => {
    try {
      await check();
    } catch (e) {
      throw new Error(`[幅 ${width}px] ${e instanceof Error ? e.message : String(e)}`);
    }
  });
}

/** 幅を変えた後、レイアウトが落ち着くのを待つ (media query の切り替え → 描画 2 回ぶん) */
async function settleLayout(page: Page) {
  await page.evaluate(() => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))));
}

async function runFocusRingCheck(page: Page, storyContext: StoryContext) {
  if (!FOCUS_RING_TARGET.test(storyContext.title ?? '')) return;
  if (storyContext.parameters?.focusRing?.disable) return;
  if (FOCUS_RING_EXEMPT[storyContext.title]) return;

  // まず今の幅 (test-runner の既定) で見る
  const findings = (await findFocusRingViolations(page)).map((f) => ({ ...f, width: null as number | null }));

  // 幅で構造が変わると story が宣言している幅でも見る (#152)。宣言は Chromatic の撮影の幅
  // (`parameters.chromatic.viewports`、§9-4) をそのまま読む: 「この幅では別の見え方になる」と
  // 書いてある story だけが対象で、検査のための宣言を別に持たない (axe も同じ宣言を読む、#165)。
  // 狭い幅でだけ出る要素 (AppShell の下のナビ等) は、既定の幅では Tab が来ないので、ここでしか見えない。
  await atWidths(page, declaredExtraWidths(page, storyContext), async (width) => {
    for (const f of await findFocusRingViolations(page)) findings.push({ ...f, width });
  });

  if (findings.length === 0) return;
  const lines = findings.map(
    (f) => `  - ${f.width ? `[幅 ${f.width}px] ` : ''}${f.element}: ${f.reason} [outline: ${f.outline}]`,
  );
  throw new Error(
    `フォーカスの輪が規則 (AGENTS §3-2「フォーカスの規則」) に合わない要素が ${findings.length} 件:\n` +
      lines.join('\n') +
      '\nfocus-ring / focus-ring-inset / focus-ring-on-fill のどれかを付ける。意図的な例外は .storybook/test-runner.ts の FOCUS_RING_EXEMPT に理由付きで。',
  );
}

export default config;
