import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Accordion,
  Alert,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  DropdownMenu,
  FilterChip,
  Icon,
  Input,
  Link,
  NumberInput,
  Pagination,
  Radio,
  SearchBar,
  SegmentedControl,
  Select,
  Switch,
  Tabs,
  Textarea,
  ToggleButton,
} from '../../index';

/**
 * 試作 (DDR-1): ホバーの適用範囲はどこまでで、どんな表現パターンが必要か。
 *
 * このファイルは検討用で、main には入れない前提 (出荷物でも規約の対象でもない)。
 * 本体の部品には一切手を入れず、今のホバーを 1 ページに並べて見比べるためだけにある。
 * - 「今のまま」= 比べる基準。案の story を足すときも、これは変えない・複製しない。
 * - ホバーは storybook-addon-pseudo-states で強制表示 (マウス操作なしで見える)。
 * - Chromatic の撮影対象外 (検討用の画面で、視覚回帰の基準にしない)。
 */
const meta: Meta = {
  title: 'Trials/DDR-1 Hover',
  parameters: {
    layout: 'padded',
    chromatic: { disableSnapshot: true },
  },
};

export default meta;
type Story = StoryObj;

const noop = () => {};

/** 表現の種類 (DDR-1「現在の形」の 7 種類 + 指定なし)。 */
const KIND = {
  black: '黒 8% を重ねる',
  brand: 'ブランド色 8% を重ねる',
  error: 'エラー色 8% を重ねる',
  border: '枠線を濃くする',
  text: '文字色を濃くする',
  shadow: '影を付ける',
  underline: '下線を出す',
  none: '指定なし',
} as const;

type Kind = keyof typeof KIND;

const Section: React.FC<{ title: string; note?: string; children: React.ReactNode }> = ({ title, note, children }) => (
  <section className="flex flex-col gap-3">
    <div>
      <h2 className="type-body font-bold text-onSurface">{title}</h2>
      {note && <p className="text-xs text-onSurface-subtle mt-1">{note}</p>}
    </div>
    <div className="flex flex-col divide-y divide-border-subtle border-y border-border-subtle">{children}</div>
  </section>
);

/**
 * 1 行 = 1 部品 (または 1 variant)。左から 名前と表現 / 通常 / ホバー。
 * ホバー列は `data-force-hover` の内側の全要素を pseudo-states で hover にする。
 */
const Row: React.FC<{ name: string; kinds: Kind[]; how?: string; render: () => React.ReactNode }> = ({
  name,
  kinds,
  how,
  render,
}) => (
  <div className="grid grid-cols-[220px_1fr_1fr] gap-6 items-center py-4">
    <div className="flex flex-col gap-1">
      <div className="text-sm font-bold text-onSurface">{name}</div>
      <ul className="text-xs text-onSurface-subtle list-none p-0 m-0">
        {kinds.map((k) => (
          <li key={k}>{KIND[k]}</li>
        ))}
      </ul>
      {how && <div className="text-xs text-onSurface-subtle">{how}</div>}
    </div>
    <div className="min-w-0">{render()}</div>
    <div className="min-w-0" data-force-hover>
      {render()}
    </div>
  </div>
);

const Header: React.FC = () => (
  <div className="grid grid-cols-[220px_1fr_1fr] gap-6 text-xs font-bold text-onSurface-subtle">
    <div>部品と、コード上の表現</div>
    <div>通常</div>
    <div>ホバー (強制表示)</div>
  </div>
);

export const AsIs: Story = {
  name: '今のまま',
  parameters: {
    docs: {
      description: {
        story:
          '今のホバーを全部品ぶん 1 ページに並べた、比べるための基準。ホバー列は、その部品の中でホバーに反応する箇所をすべて同時に反応させている。',
      },
    },
    // addon は一致した要素そのものにだけ hover を当てる (子孫には伝わらない) ので、内側の全要素を指定する。
    pseudo: { hover: ['[data-force-hover] *'] },
  },
  render: () => (
    <div className="flex flex-col gap-10 max-w-[1040px] bg-surface p-6">
      <div className="flex flex-col gap-2">
        <h1 className="type-item-title text-onSurface">DDR-1 ホバー：今のまま</h1>
        <p className="text-sm text-onSurface-subtle">
          コミット 6380631 (Color / Typography 更新後の main、#119 マージ時点) の部品をそのまま並べている。部品には手を入れていない。Toast
          の閉じるボタンは Alert と同じ指定 (黒 8%) のため省いた。
        </p>
        <Header />
      </div>

      <Section title="1. 色を重ねる" note="重ね方は 2 通り：内側の影として重ねる (Button・ToggleButton) / 背景色として重ねる (その他)。">
        <Row name="Button primary" kinds={['black']} how="内側の影" render={() => <Button variant="primary">予約する</Button>} />
        <Row name="Button secondary" kinds={['brand']} how="内側の影" render={() => <Button variant="secondary">戻る</Button>} />
        <Row name="Button tertiary" kinds={['brand']} how="内側の影" render={() => <Button variant="tertiary">キャンセル</Button>} />
        <Row name="Button destructive" kinds={['error']} how="内側の影" render={() => <Button variant="destructive">削除する</Button>} />
        <Row
          name="ToggleButton 選択中"
          kinds={['black']}
          how="内側の影"
          render={() => (
            <ToggleButton selected onClick={noop}>
              12
            </ToggleButton>
          )}
        />
        <Row
          name="ToggleButton 未選択"
          kinds={['brand', 'border']}
          how="内側の影"
          render={() => (
            <ToggleButton selected={false} onClick={noop}>
              13
            </ToggleButton>
          )}
        />
        <Row
          name="Link primary"
          kinds={['brand', 'underline']}
          how="背景色"
          render={() => <Link href="#">会社概要</Link>}
        />
        <Row
          name="Link neutral"
          kinds={['black', 'underline']}
          how="背景色"
          render={() => (
            <Link href="#" color="neutral">
              利用規約
            </Link>
          )}
        />
        <Row
          name="Link subtle"
          kinds={['black', 'underline']}
          how="背景色"
          render={() => (
            <Link href="#" color="subtle">
              プライバシーポリシー
            </Link>
          )}
        />
        <Row
          name="Alert の閉じるボタン"
          kinds={['black']}
          how="背景色"
          render={() => (
            <Alert variant="info" onClose={noop}>
              お知らせの本文。
            </Alert>
          )}
        />
        <Row
          name="Accordion の見出し"
          kinds={['brand']}
          how="背景色"
          render={() => <Accordion items={[{ id: 'a', title: 'よくある質問', content: '中身' }]} />}
        />
        <Row
          name="Pagination"
          kinds={['brand']}
          how="背景色"
          render={() => <Pagination currentPage={2} totalPages={5} onPageChange={noop} />}
        />
        <Row
          name="FilterChip"
          kinds={['brand', 'border']}
          how="背景色"
          render={() => (
            <FilterChip iconRight={<Icon name="expand_more" size="sm" />} onClick={noop}>
              並び順: 出発時刻順
            </FilterChip>
          )}
        />
        <Row
          name="SegmentedControl 未選択"
          kinds={['brand', 'border']}
          how="背景色"
          render={() => (
            <SegmentedControl
              items={[
                { value: 'list', label: 'リスト' },
                { value: 'grid', label: 'グリッド' },
              ]}
              value="list"
              onChange={noop}
              aria-label="表示モード"
            />
          )}
        />
        <Row
          name="NumberInput"
          kinds={['brand', 'text', 'border']}
          how="増減ボタン：背景色と文字色 / 枠：枠線"
          render={() => <NumberInput value={2} onChange={noop} min={0} max={9} label="人数" />}
        />
        <Row
          name="SearchBar"
          kinds={['brand', 'text', 'border']}
          how="クリアボタン：背景色と文字色 / 枠：枠線"
          render={() => <SearchBar value="新大阪" onChange={noop} placeholder="駅名を検索" />}
        />
      </Section>

      <Section title="2. 枠線を濃くする (だけ)">
        <Row name="Input" kinds={['border']} render={() => <Input label="メールアドレス" placeholder="example@email.com" />} />
        <Row name="Textarea" kinds={['border']} render={() => <Textarea label="お問い合わせ内容" rows={2} />} />
        <Row
          name="Select"
          kinds={['border']}
          render={() => (
            <Select label="都道府県">
              <option value="osaka">大阪府</option>
              <option value="tokyo">東京都</option>
            </Select>
          )}
        />
      </Section>

      <Section title="3. 文字色・下線">
        <Row
          name="Tabs 未選択"
          kinds={['text']}
          render={() => (
            <Tabs
              ariaLabel="Tabs"
              defaultActiveId="a"
              tabs={[
                { id: 'a', label: '概要', content: null },
                { id: 'b', label: 'メンバー', content: null },
                { id: 'c', label: '設定', content: null },
              ]}
            />
          )}
        />
        <Row
          name="Breadcrumb のリンク"
          kinds={['text', 'underline']}
          how="文字色はブランド色に変わる"
          render={() => (
            <Breadcrumb
              items={[
                { label: 'ホーム', href: '#' },
                { label: '予約一覧', href: '#' },
                { label: '予約詳細' },
              ]}
            />
          )}
        />
      </Section>

      <Section title="4. 影を付ける">
        <Row
          name="Card (押せるもの)"
          kinds={['shadow']}
          render={() => (
            <Card variant="outlined" clickable onClick={noop}>
              <Card.Body>
                <p className="text-sm text-onSurface">のぞみ 12 号</p>
              </Card.Body>
            </Card>
          )}
        />
      </Section>

      <Section title="5. ホバーの指定が見つからない操作部品">
        <Row name="Checkbox" kinds={['none']} render={() => <Checkbox label="利用規約に同意する" />} />
        <Row name="Radio" kinds={['none']} render={() => <Radio name="asis-radio" value="card" label="クレジットカード" />} />
        <Row name="Switch" kinds={['none']} render={() => <Switch label="メール通知" checked={false} onChange={noop} />} />
      </Section>
    </div>
  ),
};

export const AsIsMenu: Story = {
  name: '今のまま (メニュー)',
  parameters: {
    docs: {
      description: {
        story:
          'DropdownMenu の項目のホバー。メニューは最前面に重なって開くため、一覧とは別の story にした。全項目を同時にホバーにしている (通常：黒 8% / 削除：エラー色 8%)。',
      },
    },
    pseudo: { hover: ['[role="menuitem"]'] },
  },
  render: () => (
    <div className="p-8 pb-56 flex justify-center">
      <DropdownMenu
        trigger={<Button variant="secondary">操作</Button>}
        placement="bottom"
        open
        onOpenChange={noop}
        aria-label="操作メニュー"
        items={[
          { label: 'お気に入りに追加', icon: <Icon name="favorite" size="sm" />, onSelect: noop },
          { label: '新しいタブで開く', icon: <Icon name="open_in_new" size="sm" />, onSelect: noop },
          { label: '削除', icon: <Icon name="remove" size="sm" />, destructive: true, onSelect: noop },
        ]}
      />
    </div>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// 作り分ける: 今のまま / 案 C を 1 ページに並べる (#109 順番 5)。
//
// 案 C = 「薄緑で揃える」。規則は 1 文: 白地 → ブランド 8% / エラー系 → エラー 8% / 濃い塗り・役割色の面 → 黒 8%。
// 入力欄 (Input / Select / Textarea) だけは「枠線を一段濃く」。小さい部品 (Checkbox / Radio / Switch) は
// ブランド 8% の輪 (比較用に「中を塗る」も並べる)。Card は影をやめてブランド 8% (比較用に 4% も並べる)。
// リンクは下線を常時に (比較列に通常状態を置く)。
// 本体の部品には手を入れず、案の列に <style> で上書き CSS を当てて見せる (検討用の仮実装)。
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 案ごとの上書き CSS。書き方: [セレクタ (hover 抜き) の配列, 宣言]。`:hover` 版と `.pseudo-hover` 版
 * (addon が強制時に付けるクラス) を別々のルールとして出す。`:is(:hover, .pseudo-hover)` のように
 * 1 つにまとめると addon の書き換えが壊れる。
 * [data-plan="c"] が案 C、[data-plan="c2"] は比較列 (別の作り方)、[data-plan="c-rest"] は案 C の通常状態。
 */
const PLAN_RULES: [string[], string][] = [
  // ── 白地の面: ブランド 8% (primary = teal.600 由来。今の state.hover-primary は 700 由来) ──
  [
    [
      '[data-plan^="c"][data-part="button-brand"] button',
    ],
    'box-shadow: inset 0 0 0 9999px var(--c-hover) !important;',
  ],
  [
    [
      '[data-plan^="c"][data-part="pagination"] button:not([aria-current])',
      '[data-plan^="c"][data-part="accordion"] button',
      '[data-plan^="c"][data-part="number"] button',
      '[data-plan^="c"][data-part="search"] button',
    ],
    'background-color: var(--c-hover) !important; color: var(--color-on-surface-subtle) !important;',
  ],
  [
    [
      '[data-plan^="c"][data-part="chip"] button',
      '[data-plan^="c"][data-part="segmented"] button[aria-checked="false"]',
      '[data-plan^="c"][data-part="toggle"] button[aria-pressed="false"]',
    ],
    // 枠線は変えない (1 部品 1 表現)
    'background-color: var(--c-hover) !important; border-color: var(--color-border-default) !important; box-shadow: none !important;',
  ],
  // ── 濃い塗り: 黒 8% (選択中にも反応を付ける) ──
  [
    ['[data-plan^="c"][data-part="pagination"] button[aria-current]', '[data-plan^="c"][data-part="segmented"] button[aria-checked="true"]'],
    'box-shadow: inset 0 0 0 9999px var(--color-state-hover) !important;',
  ],
  // ── 押せる文字: 文字色は変えず、ブランド 8% の pill。下線はリンクの既定 (常時) ──
  [['[data-plan^="c"][data-part="link"] a'], 'background-color: var(--c-hover) !important;'],
  [
    ['[data-plan^="c"][data-part="breadcrumb"] a'],
    'color: var(--color-on-surface-default) !important; background-color: var(--c-hover) !important; box-shadow: 0 0 0 4px var(--c-hover) !important; border-radius: 4px;',
  ],
  [
    ['[data-plan^="c"][data-part="tabs"] [role="tab"]:not([aria-selected="true"])'],
    'background-color: var(--c-hover) !important; color: var(--color-on-surface-subtle) !important;',
  ],
  // ── 小さい部品: 案 C = ブランド 8% の輪 (外側 4px) / 比較 c2 = 中を塗る ──
  [
    [
      '[data-plan="c"][data-part="checkbox"] input:not(:checked)',
      '[data-plan="c"][data-part="radio"] input:not(:checked)',
      '[data-plan="c"][data-part="switch"] [role="switch"]',
    ],
    'box-shadow: 0 0 0 4px var(--c-hover) !important;',
  ],
  [
    ['[data-plan="c2"][data-part="checkbox"] input:not(:checked)', '[data-plan="c2"][data-part="radio"] input:not(:checked)'],
    'background-color: var(--c-hover) !important;',
  ],
  [['[data-plan="c2"][data-part="switch"] [role="switch"]'], 'box-shadow: inset 0 0 0 9999px var(--c-hover) !important;'],
  // ── 大きい面: 影をやめてブランド 8% (案 C) / 4% (比較 c2) ──
  [['[data-plan="c"][data-part="card"] [role="button"]'], 'box-shadow: inset 0 0 0 9999px var(--c-hover) !important;'],
  [['[data-plan="c2"][data-part="card"] [role="button"]'], 'box-shadow: inset 0 0 0 9999px var(--c-hover-half) !important;'],
];

const PLAN_CSS = [
  // 案 C の色: primary (teal.600) 由来の 8% / 4%
  `[data-plan] { --c-hover: color-mix(in srgb, var(--color-surface-primary) 8%, transparent); --c-hover-half: color-mix(in srgb, var(--color-surface-primary) 4%, transparent); }`,
  // 比較列「案 C の通常」: リンクの下線を常時に (ホバー無し)
  `[data-plan="c-rest"][data-part="link"] a, [data-plan="c-rest"][data-part="breadcrumb"] a { text-decoration-line: underline !important; text-underline-offset: 2px; }`,
  ...PLAN_RULES.map(([sels, decl]) =>
    [`${sels.map((s) => `${s}:hover`).join(', ')} { ${decl} }`, `${sels.map((s) => `${s}.pseudo-hover`).join(', ')} { ${decl} }`].join('\n')
  ),
].join('\n');

/** 比較列の種類: 無し / 別の作り方 (c2、ホバー) / 案 C の通常状態 (c-rest、ホバー無し)。 */
type Compare = { plan: 'c2' | 'c-rest'; label: string } | undefined;
type PlanRow = { part: string; name: string; compare?: Compare; render: () => React.ReactNode };

const PLAN_ROWS: { title: string; rule: string; rows: PlanRow[] }[] = [
  {
    title: '1. 白地の面 → ブランド 8% / 濃い塗り・役割色の面 → 黒 8% / エラー系 → エラー 8%',
    rule:
      '色を重ねる 1 本に統一。白地の上はすべてブランド 8% (primary = teal.600 由来。今の state.hover-primary は 700 由来なので少し明るくなる)。枠線や文字色は同時に変えない (1 部品 1 表現)。選択中の濃い塗りにも黒 8% で反応を付ける。',
    rows: [
      { part: 'button-dark', name: 'Button primary (黒 8%、変更なし)', render: () => <Button variant="primary">予約する</Button> },
      { part: 'button-brand', name: 'Button secondary (ブランド 8%、600 由来に)', render: () => <Button variant="secondary">戻る</Button> },
      { part: 'button-brand', name: 'Button tertiary (同上)', render: () => <Button variant="tertiary">キャンセル</Button> },
      { part: 'button-error', name: 'Button destructive (エラー 8%、変更なし)', render: () => <Button variant="destructive">削除する</Button> },
      {
        part: 'toggle',
        name: 'ToggleButton 未選択 (枠線は変えない)',
        render: () => (
          <ToggleButton selected={false} onClick={noop}>
            13
          </ToggleButton>
        ),
      },
      {
        part: 'pagination',
        name: 'Pagination (選択中にも黒 8%)',
        render: () => <Pagination currentPage={2} totalPages={5} onPageChange={noop} />,
      },
      {
        part: 'accordion',
        name: 'Accordion の見出し',
        render: () => <Accordion items={[{ id: 'p', title: 'よくある質問', content: '中身' }]} />,
      },
      {
        part: 'chip',
        name: 'FilterChip (枠線は変えない)',
        render: () => (
          <FilterChip iconRight={<Icon name="expand_more" size="sm" />} onClick={noop}>
            並び順: 出発時刻順
          </FilterChip>
        ),
      },
      {
        part: 'segmented',
        name: 'SegmentedControl (未選択は枠線を変えない、選択中は黒 8%)',
        render: () => (
          <SegmentedControl
            items={[
              { value: 'list', label: 'リスト' },
              { value: 'grid', label: 'グリッド' },
            ]}
            value="list"
            onChange={noop}
            aria-label="表示モード"
          />
        ),
      },
      {
        part: 'number',
        name: 'NumberInput の増減ボタン (文字色は変えない / 枠は入力欄の規則)',
        render: () => <NumberInput value={2} onChange={noop} min={0} max={9} label="人数" />,
      },
      {
        part: 'search',
        name: 'SearchBar のクリアボタン (文字色は変えない)',
        render: () => <SearchBar value="新大阪" onChange={noop} placeholder="駅名を検索" />,
      },
      {
        part: 'alert',
        name: 'Alert の閉じるボタン (役割色の面なので黒 8%、変更なし)',
        render: () => (
          <Alert variant="info" onClose={noop}>
            お知らせの本文。
          </Alert>
        ),
      },
    ],
  },
  {
    title: '2. 押せる文字 → 下線は常時、ホバーは白地の面と同じブランド 8%',
    rule:
      'リンクの下線を既定で常時に (Link の underline 既定を hover → always、Breadcrumb も。現在地は下線なしで区別)。ホバーは文字色を変えず、面と同じブランド 8% の pill。Tabs も文字色でなく pill。比較列はホバー無しの通常状態 (下線が常時出ている見え方)。',
    rows: [
      { part: 'link', name: 'Link primary', compare: { plan: 'c-rest', label: '通常 (下線常時)' }, render: () => <Link href="#">会社概要</Link> },
      {
        part: 'link',
        name: 'Link neutral (黒 8% → ブランド 8%)',
        compare: { plan: 'c-rest', label: '通常 (下線常時)' },
        render: () => (
          <Link href="#" color="neutral">
            利用規約
          </Link>
        ),
      },
      {
        part: 'link',
        name: 'Link subtle (黒 8% → ブランド 8%)',
        compare: { plan: 'c-rest', label: '通常 (下線常時)' },
        render: () => (
          <Link href="#" color="subtle">
            プライバシーポリシー
          </Link>
        ),
      },
      {
        part: 'breadcrumb',
        name: 'Breadcrumb のリンク (ブランド色に変えず pill)',
        compare: { plan: 'c-rest', label: '通常 (下線常時)' },
        render: () => (
          <Breadcrumb
            items={[
              { label: 'ホーム', href: '#' },
              { label: '予約一覧', href: '#' },
              { label: '予約詳細' },
            ]}
          />
        ),
      },
      {
        part: 'tabs',
        name: 'Tabs 未選択 (文字色 → pill)',
        render: () => (
          <Tabs
            ariaLabel="Tabs"
            defaultActiveId="a"
            tabs={[
              { id: 'a', label: '概要', content: null },
              { id: 'b', label: 'メンバー', content: null },
              { id: 'c', label: '設定', content: null },
            ]}
          />
        ),
      },
    ],
  },
  {
    title: '3. 入力欄 → 枠線を一段濃く (変更なし) / 小さい部品 → ブランド 8% の輪',
    rule:
      'Input / Select / Textarea は「入力できる場所」の表現として枠線のまま (塗ると選択済みに見える)。無反応だった Checkbox / Radio / Switch は、箱が小さく中に重ねられないので外側 4px の輪で重ねる。比較列は「中を塗る」(Switch の灰色 track では見えない)。',
    rows: [
      { part: 'input', name: 'Input (変更なし)', render: () => <Input label="メールアドレス" placeholder="example@email.com" /> },
      {
        part: 'select',
        name: 'Select (変更なし)',
        render: () => (
          <Select label="都道府県">
            <option value="osaka">大阪府</option>
            <option value="tokyo">東京都</option>
          </Select>
        ),
      },
      {
        part: 'checkbox',
        name: 'Checkbox',
        compare: { plan: 'c2', label: '比較: 中を塗る' },
        render: () => <Checkbox label="利用規約に同意する" />,
      },
      {
        part: 'radio',
        name: 'Radio',
        compare: { plan: 'c2', label: '比較: 中を塗る' },
        render: () => <Radio name="plan-radio" value="card" label="クレジットカード" />,
      },
      {
        part: 'switch',
        name: 'Switch',
        compare: { plan: 'c2', label: '比較: track の中を塗る' },
        render: () => <Switch label="メール通知" checked={false} onChange={noop} />,
      },
    ],
  },
  {
    title: '4. 大きい面 (Card) → 影をやめてブランド 8%',
    rule:
      '影は浮いている層 (Modal / Popover / Menu / Tooltip / Toast、Card elevated) の高さの表現にだけ使い、ホバーには使わない。広い面で 8% が強ければ「大きい面は半分」の token を足す選択肢として 4% を比較列に置く。',
    rows: [
      {
        part: 'card',
        name: 'Card (押せるもの)',
        compare: { plan: 'c2', label: '比較: 4%' },
        render: () => (
          <Card variant="outlined" clickable onClick={noop}>
            <Card.Body>
              <p className="type-supporting text-onSurface">のぞみ 12 号</p>
            </Card.Body>
          </Card>
        ),
      },
    ],
  },
];

const PlanHeader: React.FC = () => (
  <div className="grid grid-cols-[200px_repeat(4,1fr)] gap-3 text-xs font-bold text-onSurface-subtle">
    <div>部品</div>
    <div>通常</div>
    <div>今のまま (ホバー)</div>
    <div className="text-onSurface">案 C (ホバー)</div>
    <div>比較 (行ごとに内容が違う)</div>
  </div>
);

const PlanRowView: React.FC<PlanRow> = ({ part, name, compare, render }) => (
  <div className="grid grid-cols-[200px_repeat(4,1fr)] gap-3 items-center py-4">
    <div className="text-xs font-bold text-onSurface">{name}</div>
    <div className="min-w-0" data-part={part}>
      {render()}
    </div>
    <div className="min-w-0" data-part={part} data-force-hover>
      {render()}
    </div>
    <div className="min-w-0 border-l border-border-subtle pl-3" data-part={part} data-plan="c" data-force-hover>
      {render()}
    </div>
    <div className="min-w-0 border-l border-border-subtle pl-3 flex flex-col gap-1">
      {compare ? (
        <>
          <div className="text-xs text-onSurface-subtle">{compare.label}</div>
          <div data-part={part} data-plan={compare.plan} {...(compare.plan === 'c-rest' ? {} : { 'data-force-hover': true })}>
            {render()}
          </div>
        </>
      ) : null}
    </div>
  </div>
);

export const Plans: Story = {
  name: '作り分け (案 C)',
  parameters: {
    docs: {
      description: {
        story:
          '案 C = 薄緑で揃える。規則は「白地 → ブランド 8% / エラー系 → エラー 8% / 濃い塗り・役割色の面 → 黒 8%」の 1 文。入力欄だけ枠線、小さい部品は輪、Card は影をやめる、リンクは下線常時。部品本体は触らず、案の列に上書き CSS を当てて見せている。比較列には別の作り方 (中を塗る / 4%) と案 C の通常状態 (下線常時) を置く。',
      },
    },
    pseudo: { hover: ['[data-force-hover] *'] },
  },
  render: () => (
    <div className="flex flex-col gap-10 max-w-[1440px] bg-surface p-6">
      <style>{PLAN_CSS}</style>
      <div className="flex flex-col gap-2">
        <h1 className="type-item-title text-onSurface">DDR-1 ホバー：作り分け (案 C「薄緑で揃える」)</h1>
        <p className="type-supporting text-onSurface-subtle">
          規則は 1 文: <strong>白地 → ブランド 8% / エラー系 → エラー 8% / 濃い塗り・役割色の面 → 黒 8%</strong>。
          例外は入力欄 (枠線を一段濃く) だけ。小さい部品は輪で、Card は影をやめて同じ規則に入れる。リンクの下線は常時にする。
          縦線の右側が案 C と比較列。
        </p>
        <PlanHeader />
      </div>
      {PLAN_ROWS.map((sec) => (
        <section key={sec.title} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="type-body font-bold text-onSurface">{sec.title}</h2>
            <p className="text-xs text-onSurface-subtle m-0">{sec.rule}</p>
          </div>
          <div className="flex flex-col divide-y divide-border-subtle border-y border-border-subtle">
            {sec.rows.map((r) => (
              <PlanRowView key={`${r.part}-${r.name}`} {...r} />
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};
