import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Accordion,
  Alert,
  Button,
  Checkbox,
  DropdownMenu,
  FilterChip,
  Icon,
  Input,
  NumberInput,
  Popover,
  SegmentedControl,
  Select,
  SplitPane,
  Tabs,
} from '../../index';
import { DECISION_CSS, PLAN_CSS } from './plan';

/**
 * 検討 (DDR-2) の「決めた記録」。論点ごとに 1 story = 写真 1 枚 (#131 の決定、2026-11-15)。
 *
 * - 作業中に全体を見比べる story は Focus.stories.tsx (今のまま / 案)。こちらは決めた後に残す写真の元
 * - 1 枚で読めるように、写真の中に 問い / DDR の番号 / 決めた日 / 列の意味 / 採った・捨てた の印を持つ
 * - 載せるのは、その論点で差が出る部品だけ。幅は 760px まで (PR の中やスマホで読める大きさ)。狭い幅では列を縦に積む
 * - 部品本体は触らず、案の列に上書き CSS (plan.ts) を当てて見せる。写真は shots/decisions/ に置き、検討の PR (閉じた PR) で残す
 */
const meta: Meta = {
  title: '検討/DDR-2 フォーカス/決めた記録',
  parameters: {
    layout: 'padded',
    chromatic: { disableSnapshot: true },
    pseudo: {
      focusVisible: [
        '[data-force-focus="visible"] *',
        '[data-force-focus="tab2"] [role="tab"]:nth-of-type(2)',
        '[data-force-focus="tabpanel"] [role="tabpanel"]',
        '[data-force-focus="pane"] [tabindex="0"]:first-child',
        '[data-force-focus="dialog"] [role="dialog"]',
        '[data-force-focus="menu"] [role="menuitem"]:nth-of-type(1)',
      ],
      focus: ['[data-force-focus="field"] input', '[data-force-focus="field"] select', '[data-force-focus="menu"] [role="menuitem"]:nth-of-type(1)'],
      hover: ['[data-force-focus="menu"] [role="menuitem"]:nth-of-type(2)'],
    },
  },
};

export default meta;
type Story = StoryObj;

const noop = () => {};

// ── 写真の枠 ─────────────────────────────────────────────────────────────────
/** 列。`v` が無く `plan` も false なら「決める前」(当時の実装そのまま)。 */
type Col = { label: string; mark?: 'kept' | 'dropped'; plan?: 'p' | 'b'; v?: string; corner?: boolean };
type Force = 'visible' | 'tab2' | 'tabpanel' | 'pane' | 'dialog' | 'menu' | 'field';
type RowDef = { part?: string; name: string; force?: Force; clip?: boolean; render: () => React.ReactNode };

const Mark: React.FC<{ mark?: Col['mark'] }> = ({ mark }) =>
  mark === 'kept' ? (
    <span className="inline-block rounded-sm bg-surface-success px-2 py-0.5 text-xs font-bold text-onSurface-inverse">採った</span>
  ) : mark === 'dropped' ? (
    <span className="inline-block rounded-sm border border-border-default px-2 py-0.5 text-xs font-bold text-onSurface-subtle">捨てた</span>
  ) : (
    <span className="inline-block px-0 py-0.5 text-xs font-bold text-onSurface-subtle">決める前</span>
  );

const keptLine = (c: Col) => (c.mark === 'kept' ? 'md:border-l-2 md:border-border-success-strong md:pl-2' : 'md:pl-2');

const Frame: React.FC<{
  no: string;
  question: string;
  decided: string;
  why: string;
  dropped?: string;
  cols: Col[];
  rows: RowDef[];
  note?: string;
}> = ({ no, question, decided, why, dropped, cols, rows, note }) => {
  // 列の幅は CSS 変数で渡し、md 以上でだけ横に並べる (狭い幅では縦に積む)
  const grid = { '--cols': `130px repeat(${cols.length}, minmax(0, 1fr))` } as React.CSSProperties;
  return (
    <div id="shot" className="flex w-full max-w-[760px] flex-col gap-4 bg-surface p-4 md:p-6">
      <style>{PLAN_CSS + '\n' + DECISION_CSS}</style>
      <div className="flex flex-col gap-1">
        <div className="text-xs font-bold text-onSurface-subtle">DDR-2 フォーカス ／ 論点 {no} ／ 2026-11-15 決定</div>
        <h1 className="m-0 text-lg font-bold text-onSurface">{question}</h1>
        <p className="m-0 text-sm text-onSurface">
          <strong>決めたこと：</strong>
          {decided}
        </p>
        <p className="m-0 text-xs text-onSurface-subtle">{why}</p>
        {dropped && <p className="m-0 text-xs text-onSurface-subtle">捨てた案：{dropped}</p>}
      </div>
      <div className="flex flex-col divide-y divide-border-subtle border-y border-border-subtle">
        <div className="hidden items-end gap-3 py-2 md:grid md:grid-cols-[var(--cols)]" style={grid}>
          <div className="text-xs text-onSurface-subtle">部品</div>
          {cols.map((c) => (
            <div key={c.label} className={`flex flex-col gap-1 ${keptLine(c)}`}>
              <Mark mark={c.mark} />
              <div className="text-xs font-bold text-onSurface">{c.label}</div>
            </div>
          ))}
        </div>
        {rows.map((r) => (
          <div key={r.name} className="grid grid-cols-1 items-center gap-3 py-3 md:grid-cols-[var(--cols)]" style={grid}>
            <div className="text-xs font-bold text-onSurface">{r.name}</div>
            {cols.map((c) => (
              <div key={c.label} className={`flex min-w-0 flex-col gap-1 ${keptLine(c)}`}>
                {/* 狭い幅では列の見出しを各セルの上に出す */}
                <div className="flex items-center gap-2 md:hidden">
                  <Mark mark={c.mark} />
                  <span className="text-xs text-onSurface-subtle">{c.label}</span>
                </div>
                <div
                  className={['min-w-0', r.clip ? 'overflow-hidden' : 'p-1'].join(' ')}
                  data-plan={c.plan ?? (c.v ? 'p' : undefined)}
                  data-v={c.v}
                  data-part={r.part}
                  data-corner={c.corner ? 'round' : undefined}
                  data-force-focus={r.force ?? 'visible'}
                >
                  {r.render()}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="text-xs text-onSurface-subtle">
        {note ?? '列はどれもキーボードでフォーカスしたときの見え方 (強制表示)。'}「決める前」は当時の実装。規則の正本は実装の PR で AGENTS.md に置く。
      </div>
    </div>
  );
};

const desc = (story: string) => ({ docs: { description: { story } } });

const TABS_SHORT = [
  { id: 'a', label: '概要', content: null },
  { id: 'b', label: 'メンバー', content: null },
  { id: 'c', label: '設定', content: null },
];
const TABS_PANEL = [
  { id: 'a', label: '概要', content: <p className="m-0 text-sm text-onSurface">概要のパネル。Tab キーで止まる。</p> },
  { id: 'b', label: '設定', content: null },
];
const SEGMENTS = [
  { value: 'list', label: 'リスト' },
  { value: 'grid', label: 'グリッド' },
];
const LIST = (
  <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm text-onSurface">
    {['12 号', '14 号', '16 号', '18 号', '20 号'].map((t) => (
      <li key={t}>{t}</li>
    ))}
  </ul>
);

export const Axis: Story = {
  name: '2 形を分ける軸',
  parameters: desc('論点 2: 外側と内側の輪を、何で分けるか。'),
  render: () => (
    <Frame
      no="2"
      question="外側の輪と内側の輪を、何で分けるか"
      decided="「外側に輪を出す余地があるか」の一つだけ。ある → 外側 2px＋すき間 2px。無い (枠の中に詰まっている・端で切れる) → 内側 2px。"
      why="外側の輪は部品を隠さず、いちばん見つけやすい。出せる所では必ず外側。"
      dropped="「枠線を持つか」も軸にする。枠線の有無は輪を出せるかと関係が無く、枠の中の Accordion や端で切れる Tabs に外側の輪が出て切れる。"
      cols={[
        { label: '当時の実装' },
        { label: '外側に出す余地で分ける', mark: 'kept', v: 'kept' },
        { label: '枠線の有無で分ける (枠線あり → 内側)', mark: 'dropped', v: 'axis-border' },
      ]}
      rows={[
        {
          part: 'chip',
          name: 'FilterChip (枠線あり・余地あり)',
          render: () => (
            <FilterChip iconRight={<Icon name="expand_more" size="sm" />} onClick={noop}>
              出発時刻順
            </FilterChip>
          ),
        },
        { part: 'secondary', name: 'Button secondary (枠線あり・余地あり)', render: () => <Button variant="secondary">戻る</Button> },
        {
          part: 'accordion',
          name: 'Accordion (枠線なし・枠の中)',
          render: () => <Accordion items={[{ id: 'a', title: 'よくある質問', content: '中身' }]} />,
        },
        { name: 'Tabs のタブ (枠線なし・端で切れる)', force: 'tab2', render: () => <Tabs ariaLabel="Tabs" defaultActiveId="a" tabs={TABS_SHORT} /> },
      ]}
    />
  ),
};

export const Fields: Story = {
  name: '3 入力欄',
  parameters: desc('論点 3: 入力欄のフォーカス。'),
  render: () => (
    <Frame
      no="3"
      question="入力欄も、軸どおり外側の輪にするか"
      decided="軸どおり外側 2px＋すき間 2px。枠線の色は変えない。クリックでも出る (ブラウザの挙動)。"
      why="例外が無くなる。エラーの赤い枠線と輪が別々に見える。"
      dropped="入力欄だけ例外で「内側 2px＋枠線の色」。エラーの欄で赤がほぼ見えなくなり、見た目が 3px になって他より太い。"
      cols={[
        { label: '当時の実装 (内側 1px＋枠線の色)' },
        { label: '外側 2px＋すき間 (枠線は変えない)', mark: 'kept', plan: 'p', v: 'kept' },
        { label: '内側 2px＋枠線の色', mark: 'dropped', plan: 'b', v: 'b' },
      ]}
      rows={[
        { name: 'Input', force: 'field', render: () => <Input fullWidth label="氏名" placeholder="山田 太郎" /> },
        {
          name: 'Input (エラー)',
          force: 'field',
          render: () => <Input fullWidth label="メールアドレス" defaultValue="example@" error errorMessage="形式が正しくありません" />,
        },
        {
          name: 'Select',
          force: 'field',
          render: () => (
            <Select label="都道府県">
              <option value="osaka">大阪府</option>
            </Select>
          ),
        },
      ]}
    />
  ),
};

export const Color: Story = {
  name: '4 色',
  parameters: desc('論点 4: 輪の色とすき間。'),
  render: () => (
    <Frame
      no="4"
      question="輪の色を何にするか。すき間を塗るか"
      decided="border.focus の一色。エラー時も、Alert・Toast の閉じるも同じ。すき間は塗らない (下の面の色が見える)。"
      why="輪は「今ここ」だけを表し、エラーは枠線と文言で表す。すき間を白で塗ると、白でない面の上で白い帯になる。"
      dropped="部品の色に合わせる (エラーは赤、閉じるは文字色)。色が増えるたびに輪の色も決めることになり、赤い枠に赤い輪は見分けにくい。"
      cols={[
        { label: '当時の実装 (部品の色＋白いすき間)' },
        { label: 'border.focus の一色・すき間は塗らない', mark: 'kept', v: 'kept' },
        { label: '部品の色に合わせる', mark: 'dropped', v: 'match' },
      ]}
      rows={[
        { name: 'Button destructive', render: () => <Button variant="destructive">削除する</Button> },
        { name: 'Checkbox (エラー)', render: () => <Checkbox label="同意する" error errorMessage="同意が必要です" /> },
        {
          part: 'alert',
          name: 'Alert error の閉じる',
          render: () => (
            <Alert variant="error" onClose={noop}>
              エラー
            </Alert>
          ),
        },
        {
          name: 'Input (エラー)',
          force: 'field',
          render: () => <Input fullWidth label="メール" defaultValue="example@" error errorMessage="形式が正しくありません" />,
        },
      ]}
    />
  ),
};

export const OnFill: Story = {
  name: '5 濃い塗りの内側の輪',
  parameters: desc('論点 5: 濃い塗り (SegmentedControl の選択中) の内側に出す輪。'),
  render: () => (
    <Frame
      no="5"
      question="濃い塗りの内側に出す輪を、どう描くか"
      decided="白。縁から 2px 内側に置く (塗り → 白い輪 → 塗り)。今は SegmentedControl の選択中だけ。"
      why="白い輪は、塗りに挟まれないと輪に見えない。縁ぴったりだと白地に溶け、部品が小さくなったように見える。"
      dropped="縁に border.focus＋内側に白の二重。太さが 4px になり「輪は 2px」が崩れる。"
      cols={[
        { label: '当時の実装' },
        { label: '白・縁から 2px 内側', mark: 'kept', v: 'kept' },
        { label: '白・縁ぴったり', mark: 'dropped', v: 'fill-edge' },
        { label: '縁に border.focus＋内側に白', mark: 'dropped', v: 'fill-double' },
      ]}
      rows={[
        {
          name: 'SegmentedControl 選択中',
          render: () => <SegmentedControl items={SEGMENTS} value="list" onChange={noop} aria-label="表示モード" />,
        },
        {
          name: '同 (3 倍)',
          clip: true,
          render: () => (
            <div className="h-[44px]" style={{ zoom: 3 }}>
              <SegmentedControl items={SEGMENTS} value="list" onChange={noop} aria-label="表示モード (拡大)" />
            </div>
          ),
        },
      ]}
      note="列はどれもキーボードでフォーカスしたときの見え方 (強制表示)。未選択の「グリッド」にも同時にフォーカスを当てている。"
    />
  ),
};

const MENU_ITEMS = [
  { label: 'お気に入りに追加', icon: <Icon name="favorite" size="sm" />, onSelect: noop },
  { label: '新しいタブで開く', icon: <Icon name="open_in_new" size="sm" />, onSelect: noop },
  { label: '削除', icon: <Icon name="remove" size="sm" />, destructive: true, onSelect: noop },
];

export const Menu: Story = {
  name: '6 メニューの項目',
  parameters: desc('論点 6: DropdownMenu の項目のフォーカス。'),
  render: () => (
    <Frame
      no="6"
      question="メニューの項目のフォーカスを、輪にするか塗りにするか"
      decided="フォーカスは輪だけ (内側 2px、キーボードのときだけ)。ホバーは塗りだけ。"
      why="DDR-1 でホバーを「塗り 8%」と決めた。塗り＝ポインタ、輪＝キーボードの現在地、と役割を分ける。"
      dropped="輪＋塗り。塗りが二つの意味を持ち続ける。"
      cols={[
        { label: '当時の実装 (塗りだけ)' },
        { label: '輪だけ', mark: 'kept', v: 'kept' },
        { label: '輪＋塗り', mark: 'dropped', v: 'ringfill' },
      ]}
      rows={[
        {
          name: '1 つ目＝フォーカス、2 つ目＝ホバー',
          force: 'menu',
          render: () => (
            <div data-static-panel>
              <DropdownMenu trigger={<span className="hidden" />} aria-label="操作メニュー" items={MENU_ITEMS} />
            </div>
          ),
        },
      ]}
      note="メニューは写真のために、開いたパネルをその場に並べている (実際は最前面に重なって開く)。"
    />
  ),
};

export const Areas: Story = {
  name: '7・8 フォーカスが来るだけの領域',
  parameters: desc('論点 7・8: Tabs のパネル・SplitPane の領域・Popover のパネルにフォーカスが来たとき。'),
  render: () => (
    <Frame
      no="7・8"
      question="フォーカスが来るだけの領域に、何を出すか。輪と文字が重なるのをどうするか"
      decided="内側 2px を出す (キーボードのときだけ)。領域の内側に、輪が入るだけの余白を持たせる (量は実装の PR の写真で決める。写真は Tabs 16px、SplitPane 8px)。"
      why="フォーカスが来る所には必ず輪を出す。余白を中に持てば、どんな配置でも輪が切れない。代償 (中身の位置が動く) は一度きり。"
      dropped="輪なし (今どこにいるかを見失う)。中身は動かさず箱だけ広げる (画面の端に置くと輪が切れる・横スクロールが出るおそれ)。"
      cols={[
        { label: '当時の実装' },
        { label: '内側 2px＋内側に余白', mark: 'kept', v: 'pad' },
        { label: '内側 2px・余白なし', mark: 'dropped', v: 'kept' },
        { label: '中身は動かさず箱だけ広げる', mark: 'dropped', v: 'expand' },
      ]}
      rows={[
        {
          name: 'Tabs のパネル',
          force: 'tabpanel',
          clip: true,
          render: () => <Tabs ariaLabel="Tabs" defaultActiveId="a" tabs={TABS_PANEL} />,
        },
        {
          part: 'splitpane',
          name: 'SplitPane の領域 (スクロールが出ている)',
          force: 'pane',
          clip: true,
          render: () => (
            <SplitPane list={LIST} listWidth="104px" height="96px">
              <p className="m-0 text-sm text-onSurface">詳細</p>
            </SplitPane>
          ),
        },
        {
          name: 'Popover のパネル (押せるものが無い)',
          force: 'dialog',
          render: () => (
            <div data-static-panel>
              <Popover trigger={<span className="hidden" />} aria-label="補足情報">
                補足の文章。
              </Popover>
            </div>
          ),
        },
      ]}
      note="各セルの左端を画面の端に見立てて切っている (Tabs・SplitPane)。当時の SplitPane はブラウザ既定の outline で、強制表示では出ない。Popover は写真のために、パネルをその場に並べている。"
    />
  ),
};

export const Corner: Story = {
  name: '9 内側の輪の角',
  parameters: desc('論点 9: 丸い枠の中に出す内側の輪の角。'),
  render: () => (
    <Frame
      no="9"
      question="丸い枠の中に出す内側の輪の角を、どうするか"
      decided="接している枠の角丸に沿わせる (Accordion、NumberInput の ±)。"
      why="四角のままだと、Accordion で輪の角が枠の丸みに切り取られて欠ける。"
      dropped="四角のまま。"
      cols={[
        { label: '当時の実装' },
        { label: '枠の角丸に沿わせる', mark: 'kept', v: 'kept', corner: true },
        { label: '四角のまま', mark: 'dropped', v: 'kept' },
      ]}
      rows={[
        { part: 'accordion', name: 'Accordion', render: () => <Accordion items={[{ id: 'a', title: 'よくある質問', content: '中身' }]} /> },
        {
          part: 'accordion',
          name: 'Accordion の左上 (4 倍)',
          clip: true,
          render: () => (
            <div className="h-[36px] w-[180px]" style={{ zoom: 4 }}>
              <Accordion items={[{ id: 'z', title: 'よくある質問', content: '中身' }]} />
            </div>
          ),
        },
        { part: 'number', name: 'NumberInput の ±', render: () => <NumberInput value={2} onChange={noop} min={0} max={9} label="人数" /> },
      ]}
    />
  ),
};
