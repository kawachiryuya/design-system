import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
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
  Popover,
  Radio,
  SearchBar,
  SegmentedControl,
  Select,
  SplitPane,
  Switch,
  Tabs,
  Textarea,
  Toast,
  ToggleButton,
} from '../../index';

/**
 * 試作 (DDR-2): フォーカスの表現は、どの種類の部品にどれを使うか (#131)。
 *
 * このファイルは検討用で、main には入れない前提 (出荷物でも規約の対象でもない)。
 * 本体の部品には一切手を入れず、今のフォーカスを 1 ページに並べて見比べるためだけにある。
 * - 「今のまま」= 比べる基準。案の story を足すときも、これは変えない・複製しない。
 * - 見本用にクラスを書き写さない。本物の部品をそのまま置き、フォーカスは
 *   storybook-addon-pseudo-states で強制表示する (入力欄と DropdownMenu の項目は `focus`、ほかは `focusVisible`)。
 * - Chromatic の撮影対象外 (検討用の画面で、視覚回帰の基準にしない)。
 */
const meta: Meta = {
  title: '検討/DDR-2 フォーカス',
  parameters: {
    layout: 'padded',
    chromatic: { disableSnapshot: true },
  },
};

export default meta;
type Story = StoryObj;

const noop = () => {};

/**
 * フォーカス列の強制のしかた。addon は一致した要素そのものにだけ擬似状態を当てる (子孫には伝わらない) ので、
 * 列の内側の全要素を指定する。
 * - visible: `:focus-visible` を強制 (キーボードのときだけ出る指定の部品)
 * - focus:   `:focus` を強制 (クリックでも出る指定の部品。入力欄・メニューの項目)
 * - tab1 / tab2 / tabpanel / pane: 特定の要素だけ `:focus-visible` を強制 (1 つ目のタブ / 2 つ目のタブ / パネル / SplitPane の領域)
 */
type Force = 'visible' | 'focus' | 'tab1' | 'tab2' | 'tabpanel' | 'pane';

const PSEUDO = {
  focusVisible: [
    '[data-force-focus="visible"] *',
    '[data-force-focus="tab1"] [role="tab"]:nth-of-type(1)',
    '[data-force-focus="tab2"] [role="tab"]:nth-of-type(2)',
    '[data-force-focus="tabpanel"] [role="tabpanel"]',
    '[data-force-focus="pane"] [tabindex="0"]',
  ],
  focus: ['[data-force-focus="focus"] *'],
  hover: ['[data-force-hover] *'],
};

const Section: React.FC<{ title: string; note?: React.ReactNode; children: React.ReactNode }> = ({
  title,
  note,
  children,
}) => (
  <section className="flex flex-col gap-3">
    <div>
      <h2 className="type-body font-bold text-onSurface">{title}</h2>
      {note && <p className="text-xs text-onSurface-subtle mt-1">{note}</p>}
    </div>
    <div className="flex flex-col divide-y divide-border-subtle border-y border-border-subtle">{children}</div>
  </section>
);

/**
 * 1 行 = 1 部品 (または 1 variant)。左から 名前とコード上の指定 / 通常 / フォーカス。
 * `surface` を渡すと、通常・フォーカスの両列をその下地の上に置く。
 */
const Row: React.FC<{
  name: string;
  how?: string;
  force?: Force;
  surface?: string;
  render: () => React.ReactNode;
}> = ({ name, how, force = 'visible', surface = '', render }) => (
  <div className="grid grid-cols-[240px_1fr_1fr] gap-6 items-center py-4">
    <div className="flex flex-col gap-1">
      <div className="text-sm font-bold text-onSurface">{name}</div>
      {how && <div className="text-xs text-onSurface-subtle">{how}</div>}
    </div>
    <div className={['min-w-0 p-3 rounded-sm', surface].join(' ')}>{render()}</div>
    <div className={['min-w-0 p-3 rounded-sm', surface].join(' ')} data-force-focus={force}>
      {render()}
    </div>
  </div>
);

const Header: React.FC<{ third?: string }> = ({ third = 'フォーカス (強制表示)' }) => (
  <div className="grid grid-cols-[240px_1fr_1fr] gap-6 text-xs font-bold text-onSurface-subtle">
    <div>部品と、コード上の指定</div>
    <div>通常</div>
    <div>{third}</div>
  </div>
);

const TABS = [
  { id: 'a', label: '概要', content: <p className="text-sm text-onSurface">概要のパネル。Tab キーで止まる。</p> },
  { id: 'b', label: 'メンバー', content: null },
  { id: 'c', label: '設定', content: null },
];

const SEGMENTS = [
  { value: 'list', label: 'リスト' },
  { value: 'grid', label: 'グリッド' },
];

/** 下地の種類 (5 の節)。 */
const SURFACES: { label: string; className: string }[] = [
  { label: '白地 (surface.default)', className: 'bg-surface' },
  { label: 'bg.default (neutral.50)', className: 'bg-background' },
  { label: 'surface.subtle', className: 'bg-surface-subtle' },
  { label: 'surface.info-muted (Alert info の面)', className: 'bg-surface-info-muted' },
  { label: 'surface.warning-muted (Alert warning の面)', className: 'bg-surface-warning-muted' },
];

const TOAST_VARIANTS = ['success', 'error', 'warning', 'info', 'neutral'] as const;
const ALERT_VARIANTS = ['success', 'error', 'warning', 'info', 'neutral'] as const;

/**
 * Toast は `position: fixed` で画面の隅に出る。transform を持つ箱の中に置くと、その箱が fixed の基準になるので、
 * 行の中に収まる (部品には手を入れていない)。duration=0 で自動では消えない。
 */
const InlineToast: React.FC<{ variant: (typeof TOAST_VARIANTS)[number]; action?: boolean }> = ({ variant, action }) => (
  <div className={['relative translate-x-0', action ? 'h-[136px]' : 'h-[88px]'].join(' ')}>
    <Toast
      open
      onClose={noop}
      variant={variant}
      position="top-right"
      duration={0}
      description="保存しました"
      action={action ? { label: '元に戻す', onClick: noop } : undefined}
    />
  </div>
);

export const AsIs: Story = {
  name: '今のまま',
  parameters: {
    docs: {
      description: {
        story:
          '今のフォーカスを全部品ぶん 1 ページに並べた、比べるための基準。フォーカス列は、その部品の中でフォーカスに反応する箇所をすべて同時に反応させている (実際には 1 つだけ)。',
      },
    },
    pseudo: PSEUDO,
  },
  render: () => (
    <div className="flex flex-col gap-10 max-w-[1080px] bg-surface p-6">
      <div className="flex flex-col gap-2">
        <h1 className="type-item-title text-onSurface">DDR-2 フォーカス：今のまま</h1>
        <p className="text-sm text-onSurface-subtle">
          main 7e8f05a の部品をそのまま並べている。部品には手を入れていない。番号は #131 本文の表の 1〜8。フォーカス列の中の押せる要素は、すべて同時にフォーカス状態にしている
          (Pagination・Tabs・SegmentedControl などは、実際には 1 つにだけ出る)。DropdownMenu の項目 (6) と Popover / DropdownMenu のパネルは、最前面に重なって開くので別の
          story「今のまま (メニュー)」「今のまま (パネル)」に、SplitPane (8) は「今のまま (SplitPane)」に置いた。
        </p>
        <Header />
      </div>

      <Section title="1. 外側に 2px、すき間 2px — キーボードのときだけ" note="ring-focus + ring-offset-focus。すき間の色は指定が無く、Tailwind 既定の白。">
        <Row name="Button primary" render={() => <Button variant="primary">予約する</Button>} />
        <Row name="Button secondary" render={() => <Button variant="secondary">戻る</Button>} />
        <Row name="Button tertiary" render={() => <Button variant="tertiary">キャンセル</Button>} />
        <Row name="Link primary" render={() => <Link href="#">会社概要</Link>} />
        <Row
          name="Link neutral"
          render={() => (
            <Link href="#" color="neutral">
              利用規約
            </Link>
          )}
        />
        <Row
          name="Link subtle"
          render={() => (
            <Link href="#" color="subtle">
              プライバシーポリシー
            </Link>
          )}
        />
        <Row name="Checkbox" render={() => <Checkbox label="利用規約に同意する" />} />
        <Row name="Checkbox (チェック済み)" render={() => <Checkbox label="利用規約に同意する" defaultChecked />} />
        <Row name="Radio" render={() => <Radio name="ddr2-radio" value="card" label="クレジットカード" />} />
        <Row name="Switch" render={() => <Switch label="メール通知" checked={false} onChange={noop} />} />
        <Row name="Switch (オン)" render={() => <Switch label="メール通知" checked onChange={noop} />} />
        <Row
          name="Tabs のタブ (選択中)"
          how="1 つ目のタブだけにフォーカス"
          force="tab1"
          render={() => <Tabs ariaLabel="Tabs" defaultActiveId="a" tabs={TABS.map((t) => ({ ...t, content: null }))} />}
        />
        <Row
          name="Tabs のタブ (未選択)"
          how="2 つ目のタブだけにフォーカス"
          force="tab2"
          render={() => <Tabs ariaLabel="Tabs" defaultActiveId="a" tabs={TABS.map((t) => ({ ...t, content: null }))} />}
        />
        <Row
          name="Card (押せるもの)"
          render={() => (
            <Card variant="outlined" clickable onClick={noop}>
              <Card.Body>
                <p className="text-sm text-onSurface">のぞみ 12 号</p>
              </Card.Body>
            </Card>
          )}
        />
        <Row name="Pagination" how="現在のページ (塗り) も含む" render={() => <Pagination currentPage={2} totalPages={5} onPageChange={noop} />} />
        <Row
          name="Breadcrumb のリンク"
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
        <Row
          name="ToggleButton 未選択"
          render={() => (
            <ToggleButton selected={false} onClick={noop}>
              13
            </ToggleButton>
          )}
        />
        <Row
          name="ToggleButton 選択中"
          render={() => (
            <ToggleButton selected onClick={noop}>
              12
            </ToggleButton>
          )}
        />
        <Row
          name="Alert / Toast の閉じる"
          how="形は 1 と同じ。色が文字色なので「色の例外」の節に並べた"
          render={() => (
            <Alert variant="info" onClose={noop}>
              お知らせの本文。
            </Alert>
          )}
        />
      </Section>

      <Section title="2. 内側に 2px — キーボードのときだけ" note="ring-focus + ring-inset。">
        <Row name="NumberInput の ±" render={() => <NumberInput value={2} onChange={noop} min={0} max={9} label="人数" />} />
        <Row
          name="SegmentedControl"
          how="未選択は border.focus、選択中は白 (色の例外の節にも再掲)"
          render={() => <SegmentedControl items={SEGMENTS} value="list" onChange={noop} aria-label="表示モード" />}
        />
        <Row name="SearchBar のクリアボタン" render={() => <SearchBar value="新大阪" onChange={noop} placeholder="駅名を検索" />} />
      </Section>

      <Section
        title="3. 内側に 2px ＋「すき間 2px」の指定 — キーボードのときだけ"
        note="Accordion の見出し。ring-focus + ring-offset-focus + ring-inset。下の「Accordion の拡大」で形を確かめる。"
      >
        <Row name="Accordion の見出し" render={() => <Accordion items={[{ id: 'a', title: 'よくある質問', content: '中身' }]} />} />
      </Section>

      <Section
        title="4. 内側に 1px ＋ 枠線の色を変える — クリックでも出る"
        note="focus:border-border-focus + focus:ring-1 + focus:ring-inset。フォーカス列は :focus を強制。"
      >
        <Row name="Input" force="focus" render={() => <Input label="メールアドレス" placeholder="example@email.com" />} />
        <Row name="Textarea" force="focus" render={() => <Textarea label="お問い合わせ内容" rows={2} />} />
        <Row
          name="Select"
          force="focus"
          render={() => (
            <Select label="都道府県">
              <option value="osaka">大阪府</option>
              <option value="tokyo">東京都</option>
            </Select>
          )}
        />
        <Row name="SearchBar の入力欄" force="focus" render={() => <SearchBar value="新大阪" onChange={noop} placeholder="駅名を検索" />} />
      </Section>

      <Section title="5. 内側に 1px だけ (枠線の色は変えない) — キーボードのときだけ" note="focus-visible:ring-1 + ring-inset。">
        <Row
          name="FilterChip"
          render={() => (
            <FilterChip iconRight={<Icon name="expand_more" size="sm" />} onClick={noop}>
              並び順: 出発時刻順
            </FilterChip>
          )}
        />
        <Row
          name="FilterChip (選択中)"
          render={() => (
            <FilterChip active onClick={noop}>
              指定席のみ
            </FilterChip>
          )}
        />
      </Section>

      <Section title="6. 輪は無く、ホバーと同じ塗り (8%) だけ — クリックでも出る" note="DropdownMenu の項目。最前面に重なって開くため、別の story「今のまま (メニュー)」に置いた。" >
        <div className="py-4 text-sm text-onSurface-subtle">→ 「今のまま (メニュー)」</div>
      </Section>

      <Section
        title="7. 何も出ない"
        note="Tabs のパネル (tabIndex=0、focus:outline-none のみ)。Tab キーで止まるのに、輪を消したまま代わりが無い。フォーカス列はパネルだけに :focus-visible を強制している (タブには当てていない)。何も変わらないのが「今」の姿。"
      >
        <Row name="Tabs のパネル" force="tabpanel" render={() => <Tabs ariaLabel="Tabs" defaultActiveId="a" tabs={TABS} />} />
      </Section>

      <Section
        title="8. ブラウザ任せ (指定なし)"
        note="SplitPane の左右の領域 (tabIndex=0、クラスの指定なし)。出るのはブラウザ標準の outline で、pseudo-states は自前の CSS しか書き換えないため、ここでは再現できない (フォーカス列も通常と同じに見える)。実際に Tab キーで止めた姿は「今のまま (SplitPane)」。"
      >
        <Row
          name="SplitPane の左右の領域"
          force="pane"
          render={() => (
            <SplitPane list={<p className="text-sm text-onSurface p-2">一覧</p>} listWidth="120px" height="120px">
              <p className="text-sm text-onSurface p-2">詳細</p>
            </SplitPane>
          )}
        />
      </Section>

      <Section
        title="色の例外 — エラー"
        note="border.error (red.600)。Button destructive とエラー時の Checkbox・Radio は外側 2px＋すき間、Input・Textarea・Select は内側 1px＋枠線。"
      >
        <Row name="Button destructive" render={() => <Button variant="destructive">削除する</Button>} />
        <Row name="Checkbox (エラー)" render={() => <Checkbox label="利用規約に同意する" error errorMessage="同意が必要です" />} />
        <Row name="Radio (エラー)" render={() => <Radio name="ddr2-radio-error" value="card" label="クレジットカード" error />} />
        <Row
          name="Input (エラー)"
          force="focus"
          render={() => <Input label="メールアドレス" defaultValue="example@" error errorMessage="形式が正しくありません" />}
        />
        <Row
          name="Textarea (エラー)"
          force="focus"
          render={() => <Textarea label="お問い合わせ内容" rows={2} error errorMessage="入力してください" />}
        />
        <Row
          name="Select (エラー)"
          force="focus"
          render={() => (
            <Select label="都道府県" error errorMessage="選択してください">
              <option value="">選択してください</option>
              <option value="osaka">大阪府</option>
            </Select>
          )}
        />
      </Section>

      <Section title="色の例外 — 文字色 (ring-current)" note="Alert と Toast の閉じる。輪の色は面ごとの文字色、すき間は白。Toast の info には操作ボタン (Button tertiary) も入れた。">
        {ALERT_VARIANTS.map((v) => (
          <Row
            key={`alert-${v}`}
            name={`Alert ${v} の閉じる`}
            render={() => (
              <Alert variant={v} onClose={noop}>
                お知らせの本文。
              </Alert>
            )}
          />
        ))}
        {TOAST_VARIANTS.map((v) => (
          <Row
            key={`toast-${v}`}
            name={`Toast ${v} の閉じる`}
            how={v === 'info' ? '操作ボタン「元に戻す」付き' : undefined}
            render={() => <InlineToast variant={v} action={v === 'info'} />}
          />
        ))}
      </Section>

      <Section title="色の例外 — 白 (ring-surface)" note="SegmentedControl の選択中。塗り (surface.primary = teal.600) の内側に白 2px。">
        <Row
          name="SegmentedControl 選択中"
          render={() => <SegmentedControl items={SEGMENTS} value="grid" onChange={noop} aria-label="表示モード" />}
        />
      </Section>

      <Section
        title="下地による違い (1 の部品を代表に)"
        note="すき間の色は常に白。白でない面の上では白い帯になる。各行の両列を同じ下地の上に置いている。"
      >
        {SURFACES.map((s) => (
          <Row
            key={s.className}
            name={s.label}
            surface={s.className}
            render={() => (
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary">予約する</Button>
                <Button variant="secondary">戻る</Button>
                <Link href="#">会社概要</Link>
                <Checkbox label="同意する" />
                <Switch label="通知" checked onChange={noop} />
              </div>
            )}
          />
        ))}
      </Section>

      <Section
        title="ホバーとの重なり"
        note="DDR-1 で決めた「小さい部品のホバーは外側 4px の輪」と、フォーカスの輪が同時に出たとき。右の列はホバーとフォーカスを同時に強制している。"
      >
        <div className="grid grid-cols-[240px_1fr_1fr_1fr] gap-6 items-center py-4 text-xs font-bold text-onSurface-subtle">
          <div />
          <div>ホバーだけ</div>
          <div>フォーカスだけ</div>
          <div>ホバー＋フォーカス</div>
        </div>
        {[
          { name: 'Checkbox', render: () => <Checkbox label="同意する" /> },
          { name: 'Radio', render: () => <Radio name="ddr2-radio-hover" value="a" label="選択肢" /> },
          { name: 'Switch', render: () => <Switch label="通知" checked={false} onChange={noop} /> },
        ].map((r) => (
          <div key={r.name} className="grid grid-cols-[240px_1fr_1fr_1fr] gap-6 items-center py-4">
            <div className="text-sm font-bold text-onSurface">{r.name}</div>
            <div className="p-3" data-force-hover>
              {r.render()}
            </div>
            <div className="p-3" data-force-focus="visible">
              {r.render()}
            </div>
            <div className="p-3" data-force-hover data-force-focus="visible">
              {r.render()}
            </div>
          </div>
        ))}
      </Section>

      <Section
        title="Accordion の拡大 (3 の形を確かめる)"
        note="CSS の zoom で拡大している (上段 2 倍、下段 4 倍)。コードどおりなら「内側に白 2px、そのさらに内側に 2px」。"
      >
        <div className="grid grid-cols-2 gap-6 py-4">
          <div className="flex flex-col gap-2">
            <div className="text-xs font-bold text-onSurface-subtle">通常</div>
            <div className="w-[220px]" style={{ zoom: 2 }}>
              <Accordion items={[{ id: 'z', title: 'よくある質問', content: '中身' }]} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-xs font-bold text-onSurface-subtle">フォーカス (強制表示)</div>
            <div className="w-[220px]" style={{ zoom: 2 }} data-force-focus="visible">
              <Accordion items={[{ id: 'z', title: 'よくある質問', content: '中身' }]} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 py-4">
          <div className="text-xs font-bold text-onSurface-subtle">フォーカス (左上の角を 4 倍)</div>
          <div className="w-[480px] h-[160px] overflow-hidden border border-border-subtle">
            <div className="w-[220px]" style={{ zoom: 4 }} data-force-focus="visible">
              <Accordion items={[{ id: 'z', title: 'よくある質問', content: '中身' }]} />
            </div>
          </div>
        </div>
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
          'DropdownMenu の項目 (6)。1 つ目はフォーカス、2 つ目はホバー、3 つ目 (削除) はフォーカス。フォーカスは輪を持たず、ホバーと同じ塗り (8%) になる。パネル自体 (role=menu) は focus:outline-none で何も出さない。',
      },
    },
    pseudo: {
      focus: ['[role="menuitem"]:nth-of-type(1)', '[role="menuitem"]:nth-of-type(3)'],
      hover: ['[role="menuitem"]:nth-of-type(2)'],
    },
  },
  render: () => (
    <div className="p-8 pb-48 flex flex-col items-center gap-4">
      <p className="text-xs text-onSurface-subtle">1 つ目 = フォーカス / 2 つ目 = ホバー / 3 つ目 (削除) = フォーカス</p>
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

export const AsIsPanel: Story = {
  name: '今のまま (パネル)',
  parameters: {
    docs: {
      description: {
        story:
          'Popover のパネル。中に押せるものが無いと、開いたときにパネル自体 (tabIndex=-1) にフォーカスが移る。focus:outline-none のみで何も出ない (:focus も強制している)。',
      },
    },
    pseudo: { focus: ['[role="dialog"]'] },
  },
  render: () => (
    <div className="p-8 pb-48 flex flex-col items-center gap-4">
      <p className="text-xs text-onSurface-subtle">パネルにフォーカスがある状態</p>
      <Popover trigger={<Button variant="secondary">詳細</Button>} open onOpenChange={noop} placement="bottom" aria-label="補足情報">
        押せるものが無いパネル。開くとパネル自体にフォーカスが移る。
      </Popover>
    </div>
  ),
};

export const AsIsSplitPane: Story = {
  name: '今のまま (SplitPane)',
  parameters: {
    docs: {
      description: {
        story:
          'SplitPane の左の領域 (8)。指定が無くブラウザ標準の outline が出るので、pseudo-states では再現できない。play で実際に Tab キーを 1 回押して止めている (ブラウザによって見え方が違う)。',
      },
    },
  },
  render: () => (
    <div className="max-w-[720px] bg-surface p-6 flex flex-col gap-3">
      <p className="text-xs text-onSurface-subtle">左の領域に Tab キーで止まっている状態 (play で Tab を 1 回押している)</p>
      <SplitPane
        list={
          <ul className="text-sm text-onSurface list-none p-0 m-0 flex flex-col gap-2">
            <li>のぞみ 12 号</li>
            <li>のぞみ 14 号</li>
            <li>ひかり 503 号</li>
          </ul>
        }
        listWidth="200px"
        height="240px"
      >
        <p className="text-sm text-onSurface">詳細の領域。</p>
      </SplitPane>
    </div>
  ),
  play: async () => {
    await userEvent.tab();
  },
};
