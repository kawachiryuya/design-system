import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Accordion,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  FilterChip,
  Icon,
  Link,
  Pagination,
  Radio,
  Switch,
  Tabs,
} from '../../index';

/**
 * 試作 (DDR-1) の「決めた記録」。論点ごとに 1 story = 写真 1 枚。
 *
 * - 作業中に全体を見比べる story は Hover.stories.tsx (今のまま / 作り分け)。こちらは決めた後に残す写真の元
 * - 1 枚で読めるように、写真の中に 問い / DDR の番号 / 決めた日 / 列の意味 / 採った・捨てた の印を持つ
 * - 載せるのは、その論点で差が出る部品だけ。幅は固定 (PR の中やスマホで読める大きさ)
 * - 部品本体は触らず、案の列に上書き CSS を当てて見せる。写真は shots/ に置き、検討の PR (閉じた PR) で残す
 */
const meta: Meta = {
  title: '検討/DDR-1 ホバー/決めた記録',
  parameters: {
    layout: 'padded',
    chromatic: { disableSnapshot: true },
    pseudo: { hover: ['[data-force-hover] *'] },
  },
};

export default meta;
type Story = StoryObj;

const noop = () => {};

// ── 案の上書き CSS ───────────────────────────────────────────────────────────
// [セレクタ (hover 抜き), 宣言]。`:hover` 版と `.pseudo-hover` 版を別々のルールで出す
// (1 つにまとめると pseudo-states addon の書き換えが壊れる)。
const BRAND = (pct: number) => `color-mix(in srgb, var(--color-surface-primary) ${pct}%, transparent)`;
const WHITE_SURFACES = (v: string) => [
  `[data-v="${v}"][data-part="button"] button`,
  `[data-v="${v}"][data-part="pagination"] button:not([aria-current])`,
  `[data-v="${v}"][data-part="accordion"] button`,
  `[data-v="${v}"][data-part="chip"] button`,
];
const fill = (v: string, color: string): [string[], string][] => [
  [[`[data-v="${v}"][data-part="button"] button`], `box-shadow: inset 0 0 0 9999px ${color} !important;`],
  [
    WHITE_SURFACES(v).slice(1),
    `background-color: ${color} !important; border-color: var(--color-border-default) !important; box-shadow: none !important;`,
  ],
  [[`[data-v="${v}"][data-part="card"] [role="button"]`], `box-shadow: inset 0 0 0 9999px ${color} !important;`],
  [
    [
      `[data-v="${v}"][data-part="checkbox"] input:not(:checked)`,
      `[data-v="${v}"][data-part="radio"] input:not(:checked)`,
      `[data-v="${v}"][data-part="switch"] [role="switch"]`,
    ],
    `box-shadow: 0 0 0 4px ${color} !important;`,
  ],
];

const RULES: [string[], string][] = [
  ...fill('brand8', BRAND(8)),
  ...fill('brand6', BRAND(6)),
  ...fill('brand4', BRAND(4)),
  // 捨てた案 A / B: 色を前景の役割で決める → 白地の面のうち中性の文字のものは黒 8%
  ...fill('black8', 'var(--color-state-hover)'),
  // 押せる文字 (採った案): 文字色は変えず、ブランド 8% の面
  [['[data-v="pill"][data-part="link"] a', '[data-v="pill"][data-part="breadcrumb"] a'], `color: inherit; background-color: ${BRAND(8)} !important; box-shadow: 0 0 0 4px ${BRAND(8)} !important; border-radius: 4px;`],
  [['[data-v="pill"][data-part="breadcrumb"] a'], 'color: var(--color-on-surface-default) !important;'],
  [['[data-v="pill"][data-part="tabs"] [role="tab"]:not([aria-selected="true"])'], `background-color: ${BRAND(8)} !important; color: var(--color-on-surface-subtle) !important;`],
  // 押せる文字 (捨てた案 B): 面は重ねず、下線だけ
  [['[data-v="textonly"][data-part="link"] a'], 'background-color: transparent !important; text-decoration-line: underline !important;'],
  [['[data-v="textonly"][data-part="breadcrumb"] a'], 'color: var(--color-on-surface-default) !important; text-decoration-line: underline !important;'],
  // 小さい部品 (捨てた案): 輪ではなく中を塗る
  [
    ['[data-v="inner"][data-part="checkbox"] input:not(:checked)', '[data-v="inner"][data-part="radio"] input:not(:checked)'],
    `background-color: ${BRAND(8)} !important;`,
  ],
  [['[data-v="inner"][data-part="switch"] [role="switch"]'], `box-shadow: inset 0 0 0 9999px ${BRAND(8)} !important;`],
];

const CSS = [
  // 採った案: リンクの下線は通常時から常時
  `[data-v="pill"][data-part="link"] a, [data-v="pill"][data-part="breadcrumb"] a { text-decoration-line: underline !important; text-underline-offset: 2px; }`,
  ...RULES.map(([sels, decl]) =>
    [`${sels.map((s) => `${s}:hover`).join(', ')} { ${decl} }`, `${sels.map((s) => `${s}.pseudo-hover`).join(', ')} { ${decl} }`].join('\n')
  ),
].join('\n');

// ── 写真の枠 ─────────────────────────────────────────────────────────────────
type Col = { label: string; mark?: 'kept' | 'dropped'; v?: string; hover?: boolean };
type RowDef = { part: string; name: string; render: () => React.ReactNode };

const Mark: React.FC<{ mark?: Col['mark'] }> = ({ mark }) =>
  mark === 'kept' ? (
    <span className="inline-block rounded-sm bg-surface-success px-2 py-0.5 text-xs font-bold text-onSurface-inverse">採った</span>
  ) : mark === 'dropped' ? (
    <span className="inline-block rounded-sm border border-border-default px-2 py-0.5 text-xs font-bold text-onSurface-subtle">捨てた</span>
  ) : (
    <span className="inline-block px-0 py-0.5 text-xs font-bold text-onSurface-subtle">決める前</span>
  );

const Frame: React.FC<{ no: number; question: string; decided: string; why: string; cols: Col[]; rows: RowDef[] }> = ({
  no,
  question,
  decided,
  why,
  cols,
  rows,
}) => {
  const grid = { gridTemplateColumns: `150px repeat(${cols.length}, 1fr)` };
  return (
    <div id="shot" className="flex w-[760px] flex-col gap-4 bg-surface p-6">
      <style>{CSS}</style>
      <div className="flex flex-col gap-1">
        <div className="text-xs font-bold text-onSurface-subtle">DDR-1 ホバー ／ 論点 {no} ／ 2026-11-14 決定</div>
        <h1 className="m-0 text-lg font-bold text-onSurface">{question}</h1>
        <p className="m-0 text-sm text-onSurface">
          <strong>決めたこと：</strong>
          {decided}
        </p>
        <p className="m-0 text-xs text-onSurface-subtle">{why}</p>
      </div>
      <div className="flex flex-col divide-y divide-border-subtle border-y border-border-subtle">
        <div className="grid items-end gap-3 py-2" style={grid}>
          <div className="text-xs text-onSurface-subtle">部品</div>
          {cols.map((c) => (
            <div key={c.label} className={`flex flex-col gap-1 ${c.mark === 'kept' ? 'border-l-2 border-border-success-strong pl-2' : 'pl-2'}`}>
              <Mark mark={c.mark} />
              <div className="text-xs font-bold text-onSurface">{c.label}</div>
            </div>
          ))}
        </div>
        {rows.map((r) => (
          <div key={r.name} className="grid items-center gap-3 py-3" style={grid}>
            <div className="text-xs font-bold text-onSurface">{r.name}</div>
            {cols.map((c) => (
              <div
                key={c.label}
                className={`min-w-0 ${c.mark === 'kept' ? 'border-l-2 border-border-success-strong pl-2' : 'pl-2'}`}
                data-part={r.part}
                data-v={c.v}
                {...(c.hover === false ? {} : { 'data-force-hover': true })}
              >
                {r.render()}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="text-xs text-onSurface-subtle">
        列はどれもホバー中の見え方 (強制表示)。「決める前」は当時の実装。規則の正本は AGENTS.md §3-2、実装は PR #120。
      </div>
    </div>
  );
};

const desc = (story: string) => ({ docs: { description: { story } } });

const R = {
  secondary: { part: 'button', name: 'Button secondary', render: () => <Button variant="secondary">戻る</Button> },
  pagination: { part: 'pagination', name: 'Pagination', render: () => <Pagination currentPage={2} totalPages={5} onPageChange={noop} /> },
  accordion: { part: 'accordion', name: 'Accordion', render: () => <Accordion items={[{ id: 'p', title: 'よくある質問', content: '中身' }]} /> },
  chip: {
    part: 'chip',
    name: 'FilterChip',
    render: () => (
      <FilterChip iconRight={<Icon name="expand_more" size="sm" />} onClick={noop}>
        出発時刻順
      </FilterChip>
    ),
  },
  checkbox: { part: 'checkbox', name: 'Checkbox', render: () => <Checkbox label="同意する" /> },
  radio: { part: 'radio', name: 'Radio', render: () => <Radio name="dec-radio" value="card" label="カード" /> },
  switch: { part: 'switch', name: 'Switch', render: () => <Switch label="通知" checked={false} onChange={noop} /> },
  card: {
    part: 'card',
    name: 'Card (押せる)',
    render: () => (
      <Card variant="outlined" clickable onClick={noop}>
        <Card.Body>
          <p className="m-0 text-sm text-onSurface">のぞみ 12 号</p>
        </Card.Body>
      </Card>
    ),
  },
} satisfies Record<string, RowDef>;

export const Color: Story = {
  name: '1 色の決め方',
  parameters: desc('論点 1: 重ねる色を何で決めるか。'),
  render: () => (
    <Frame
      no={1}
      question="重ねる色を、何で決めるか"
      decided="下地で決める。白地の面はブランド色 8%。(濃い塗りは黒 8%、エラー系はエラー色 8%)"
      why="ホバーはシステム全体で足並みを揃え、薄緑を基調にする。規則が 1 文になる。あわせて、枠線や文字色は同時に変えない (1 部品 1 表現)。"
      cols={[
        { label: '当時の実装' },
        { label: '下地で決める (白地 → ブランド 8%)', mark: 'kept', v: 'brand8' },
        { label: '前景の役割で決める (中性の文字 → 黒 8%)', mark: 'dropped', v: 'black8' },
      ]}
      rows={[R.pagination, R.accordion, R.chip]}
    />
  ),
};

export const Text: Story = {
  name: '2 押せる文字',
  parameters: desc('論点 2: 押せる文字 (Link / Breadcrumb / Tabs) のホバー。'),
  render: () => (
    <Frame
      no={2}
      question="押せる文字のホバーを、面と揃えるか"
      decided="揃える。文字色は変えず、面と同じブランド色 8% を重ねる。下線はホバーで足さず、通常時から常時出す。"
      why="「押せる文字」は下線で通常時から示し、ホバーは面の規則 1 本にする。Breadcrumb のブランド色化、Tabs の文字色の変化はやめる。"
      cols={[
        { label: '当時の実装' },
        { label: '面と揃える (ブランド 8% + 下線常時)', mark: 'kept', v: 'pill' },
        { label: '文字は文字で反応 (下線だけ)', mark: 'dropped', v: 'textonly' },
      ]}
      rows={[
        { part: 'link', name: 'Link', render: () => <Link href="#">会社概要</Link> },
        {
          part: 'breadcrumb',
          name: 'Breadcrumb',
          render: () => <Breadcrumb items={[{ label: 'ホーム', href: '#' }, { label: '予約一覧', href: '#' }, { label: '詳細' }]} />,
        },
        {
          part: 'tabs',
          name: 'Tabs (未選択)',
          render: () => (
            <Tabs
              ariaLabel="Tabs"
              defaultActiveId="a"
              tabs={[
                { id: 'a', label: '概要', content: null },
                { id: 'b', label: '設定', content: null },
              ]}
            />
          ),
        },
      ]}
    />
  ),
};

export const Small: Story = {
  name: '3 小さい部品',
  parameters: desc('論点 3: Checkbox / Radio / Switch のホバー。'),
  render: () => (
    <Frame
      no={3}
      question="小さい部品のホバーを、どこに出すか"
      decided="外側に 4px の輪を出す (ブランド色 8%)。"
      why="当時はホバーで何も変わらなかった。中に重ねる案は、面が小さく、Switch の灰色の上ではほとんど見えない。"
      cols={[
        { label: '当時の実装 (反応なし)' },
        { label: '外側 4px の輪', mark: 'kept', v: 'brand8' },
        { label: '中を塗る', mark: 'dropped', v: 'inner' },
      ]}
      rows={[R.checkbox, R.radio, R.switch]}
    />
  ),
};

export const Large: Story = {
  name: '4 大きい面',
  parameters: desc('論点 4: Card のホバー。'),
  render: () => (
    <Frame
      no={4}
      question="大きい面 (Card) のホバーを、影にするか面にするか"
      decided="面にする。ほかの白地と同じブランド色 8%。影はホバーに使わない。"
      why="影は Modal / Popover / Toast など「浮いている層」の高さの表現に限る。ホバーで影を使っていたのは Card だけだった。大きい面だけ薄くする 4% は、token を増やさないために採らなかった。"
      cols={[
        { label: '当時の実装 (影)' },
        { label: '面 (ブランド 8%)', mark: 'kept', v: 'brand8' },
        { label: '面 (4%。大きい面だけ薄く)', mark: 'dropped', v: 'brand4' },
      ]}
      rows={[R.card]}
    />
  ),
};

export const Strength: Story = {
  name: '5 濃さ',
  parameters: desc('論点 5: 重ねる濃さ。'),
  render: () => (
    <Frame
      no={5}
      question="重ねる濃さを、何 % にするか"
      decided="8% のまま (押下は 12%)。色は primary と同じ teal.600 由来に揃える。"
      why="6% と並べて見比べ、8% を残した。当時の実装は teal.700 由来の 8% で、primary の塗り (teal.600) と色が揃っていなかった。"
      cols={[
        { label: '当時の実装 (700 由来の 8%)' },
        { label: '8% (600 由来)', mark: 'kept', v: 'brand8' },
        { label: '6% (600 由来)', mark: 'dropped', v: 'brand6' },
      ]}
      rows={[R.secondary, R.pagination, R.card, R.checkbox]}
    />
  ),
};
