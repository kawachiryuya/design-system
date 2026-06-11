import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext } from '@storybook/test-runner';
import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';

/**
 * Storybook test-runner 設定。
 *
 * 全 Story に対して (1) smoke render + play 関数の実行 (test-runner 標準) と
 * (2) axe による a11y 自動監査 (postVisit) を行う。CI の Run Storybook tests ステップで実行。
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
  'Primitives/Badge': 'TODO(contrast): solid role 色 (success/error/warning/info) + 白文字が AA 4.5 未満。token ダーク化 PR で解消予定',
  'Composites/Avatar': 'TODO(contrast): 色付き avatar 背景 + 白文字が AA 4.5 未満。token ダーク化 PR で解消予定',
  'Composites/Popover': 'TODO(contrast): muted text が layered 背景上で AA 4.5 未満。contrast 見直しで対応予定',
  'Composites/SplitPane': 'TODO(contrast): muted text が layered 背景上で AA 4.5 未満。contrast 見直しで対応予定',
};

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);

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

    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  },
};

export default config;
