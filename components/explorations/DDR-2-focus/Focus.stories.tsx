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
 * 検討 (DDR-2): フォーカスの表現は、どの種類の部品にどれを使うか (#131)。
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
 * - tab1 / tab2 / tabpanel / pane / link: 特定の要素だけ `:focus-visible` を強制 (1 つ目のタブ / 2 つ目のタブ / パネル / SplitPane の領域 / リンク)
 */
type Force = 'visible' | 'focus' | 'tab1' | 'tab2' | 'tabpanel' | 'pane' | 'link';

const PSEUDO = {
  focusVisible: [
    '[data-force-focus="visible"] *',
    '[data-force-focus="tab1"] [role="tab"]:nth-of-type(1)',
    '[data-force-focus="tab2"] [role="tab"]:nth-of-type(2)',
    '[data-force-focus="tabpanel"] [role="tabpanel"]',
    '[data-force-focus="pane"] [tabindex="0"]',
    '[data-force-focus="link"] a',
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
        <Row
          name="Alert の本文の中の Link"
          how="形は 1 と同じ。白いすき間が色の面の上に出る (リンクだけにフォーカス)"
          force="link"
          render={() => (
            <Alert variant="info">
              ベータ版を公開しました。<Link href="#">詳細を見る</Link>
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

// ─────────────────────────────────────────────────────────────────────────────
// 作り分ける: 案 (#131 「作り分ける案」の表の 1・2・4・5・6・7)。
//
// 規則: 輪は必ず 2px 以上。外側に輪を出す余地があれば「外側 2px＋すき間 2px」、無ければ「内側 2px」。
// 輪の色は border.focus の一色 (濃い塗りの内側に出す輪だけ白)。すき間は塗らず、下の面の色が見える。
// フォーカスは輪だけ、ホバーは塗りだけ。フォーカスが来る所には必ず輪を出す。
//
// 本体の部品には手を入れず、案の列に <style> で上書き CSS を当てて見せる (DDR-1 #123 と同じ、検討用の仮実装)。
// 輪は box-shadow (ring) でなく outline で描く: outline のすき間は塗られない (下の面が見える) ので
// 「すき間を塗らない」がそのまま実現でき、box-shadow のホバー (小さい部品の外側 4px) とも別の層になる。
// 部品が付けている ring は --tw-ring-* を空にして消す (ホバーの影 --tw-shadow は残る)。
// ─────────────────────────────────────────────────────────────────────────────

/** 状態セレクタを、本物の擬似クラス版と addon の強制クラス版の両方に展開する。 */
const on = (sels: string[], state: 'focus-visible' | 'focus', suffix = '') =>
  [...sels.map((s) => `${s}:${state}${suffix}`), ...sels.map((s) => `${s}.pseudo-${state}${suffix}`)].join(',\n');

const NO_RING = '--tw-ring-shadow: 0 0 #0000 !important; --tw-ring-offset-shadow: 0 0 #0000 !important;';
const OUTER = `outline: 2px solid var(--plan-ring) !important; outline-offset: 2px !important; ${NO_RING}`;
const INNER = `outline: 2px solid var(--plan-ring) !important; outline-offset: -2px !important; ${NO_RING}`;

/** 文字を入力する欄 (Checkbox / Radio を除く)。 */
const FIELDS = (scope: string) => [
  `${scope} input:not([type="checkbox"]):not([type="radio"])`,
  `${scope} textarea`,
  `${scope} select`,
];

const PLAN_CSS = [
  // 輪の色。既定は border.focus。エラーの色の比較列だけ赤に戻す
  `[data-plan] { --plan-ring: var(--color-border-focus); }`,
  `[data-plan][data-plan-color="red"] { --plan-ring: var(--color-border-error-strong); }`,

  // ── 外側に余地がある → 外側 2px＋すき間 2px (キーボードのときだけ) ──
  `${on(['[data-plan] a', '[data-plan] button', '[data-plan] input[type="checkbox"]', '[data-plan] input[type="radio"]', '[data-plan] [role="button"]'], 'focus-visible')} { ${OUTER} }`,

  // ── 外側に余地が無い (枠の中に詰まっている・端で切れる) → 内側 2px (キーボードのときだけ) ──
  `${on(
    [
      '[data-plan][data-part="number"] button',
      '[data-plan][data-part="accordion"] button',
      '[data-plan][data-part="search"] button',
      '[data-plan] [role="radiogroup"] [role="radio"]',
      '[data-plan] [role="tab"]',
      '[data-plan] [role="menuitem"]',
    ],
    'focus-visible'
  )} { ${INNER} }`,
  // フォーカスが来るだけの領域にも輪 (内側 2px、キーボードのときだけ)
  `${on(['[data-plan] [role="tabpanel"]', '[data-plan][data-part="splitpane"] [tabindex="0"]', '[data-plan] [role="dialog"]'], 'focus-visible')} { ${INNER} }`,
  // 濃い塗りの内側に出す輪だけ白 (SegmentedControl の選択中)。-2px だと輪が部品の端に乗り、白地と溶けて
  // 「部品が小さくなった」ように見えるので、塗りが外側に 2px 残るよう -4px に下げる
  `${on(['[data-plan] [role="radiogroup"] [role="radio"][aria-checked="true"]'], 'focus-visible')} { outline-color: var(--color-surface-default) !important; outline-offset: -4px !important; }`,

  // ── メニューの項目: フォーカスの塗りを外す (塗りはホバーだけ) ──
  `[data-plan] [role="menuitem"]:focus:not(:hover), [data-plan] [role="menuitem"].pseudo-focus:not(.pseudo-hover) { background-color: transparent !important; }`,

  // ── 入力欄 案 A: 軸どおり外側 2px＋すき間 2px。クリックでも出す (:focus)。枠線は変えない ──
  `${on([...FIELDS('[data-plan="p"]'), ...FIELDS('[data-plan="a"]')], 'focus')} { ${OUTER} border-color: var(--color-border-default) !important; }`,
  `${on([...FIELDS('[data-plan="p"]'), ...FIELDS('[data-plan="a"]')], 'focus', '[aria-invalid="true"]')} { border-color: var(--color-border-error-strong) !important; }`,

  // ── 入力欄 案 B: 入力欄だけ例外。内側 2px＋枠線の色 (エラーのときは枠線は赤のまま) ──
  `${on(FIELDS('[data-plan="b"]'), 'focus')} { outline: none !important; ${NO_RING} box-shadow: inset 0 0 0 2px var(--plan-ring) !important; border-color: var(--plan-ring) !important; }`,
  `${on(FIELDS('[data-plan="b"]'), 'focus', '[aria-invalid="true"]')} { border-color: var(--color-border-error-strong) !important; }`,

  // ── 内側の輪の角を、枠の角丸に合わせる版 (data-corner="round") ──
  // Accordion: 項目の枠は rounded-md (8px) + overflow-hidden。見出しの button を 8 - 1 (枠線) = 7px に
  `[data-corner="round"][data-part="accordion"] button[data-state="closed"] { border-radius: calc(var(--radius-md) - 1px); }`,
  `[data-corner="round"][data-part="accordion"] button[data-state="open"] { border-radius: calc(var(--radius-md) - 1px) calc(var(--radius-md) - 1px) 0 0; }`,
  // NumberInput: 枠は rounded-sm (4px)。左端・右端の button を 4 - 1 = 3px に
  `[data-corner="round"][data-part="number"] button:first-of-type { border-radius: calc(var(--radius-sm) - 1px) 0 0 calc(var(--radius-sm) - 1px); }`,
  `[data-corner="round"][data-part="number"] button:last-of-type { border-radius: 0 calc(var(--radius-sm) - 1px) calc(var(--radius-sm) - 1px) 0; }`,
  // Tabs のパネル: 枠は無い。輪だけ rounded-sm に
  `[data-corner="round"] [role="tabpanel"] { border-radius: var(--radius-sm); }`,
].join('\n');

const PlanStyle: React.FC = () => <style>{PLAN_CSS}</style>;

const PLAN_PSEUDO = {
  focusVisible: [
    '[data-force-focus="visible"] *',
    '[data-force-focus="tab1"] [role="tab"]:nth-of-type(1)',
    '[data-force-focus="tab2"] [role="tab"]:nth-of-type(2)',
    '[data-force-focus="tabpanel"] [role="tabpanel"]',
    '[data-force-focus="pane"] [tabindex="0"]:first-child',
    '[data-force-focus="link"] a',
  ],
  focus: [
    '[data-force-focus="focus"] *',
    '[data-focus-target] input',
    '[data-focus-target] select',
    '[data-focus-target] textarea',
  ],
  hover: ['[data-force-hover] *'],
};

type Change = '変わる' | '変わらない';

/**
 * 1 行 = 1 部品。左から 名前と案の説明 / 通常 / 今のフォーカス / 案のフォーカス。
 * 案の列だけ `data-plan` (上書き CSS の適用範囲) を持つ。
 */
const PlanRow: React.FC<{
  name: string;
  change: Change;
  how?: string;
  force?: Force;
  part?: string;
  plan?: 'p' | 'a' | 'b';
  surface?: string;
  render: () => React.ReactNode;
}> = ({ name, change, how, force = 'visible', part, plan = 'p', surface = '', render }) => (
  <div className="grid grid-cols-[220px_1fr_1fr_1fr] gap-6 items-center py-4">
    <div className="flex flex-col gap-1">
      <div className="text-sm font-bold text-onSurface">{name}</div>
      <div className={['text-xs font-bold', change === '変わる' ? 'text-onSurface-primary' : 'text-onSurface-subtle'].join(' ')}>
        {change}
      </div>
      {how && <div className="text-xs text-onSurface-subtle">{how}</div>}
    </div>
    <div className={['min-w-0 p-3 rounded-sm', surface].join(' ')}>{render()}</div>
    <div className={['min-w-0 p-3 rounded-sm', surface].join(' ')} data-force-focus={force}>
      {render()}
    </div>
    <div className={['min-w-0 p-3 rounded-sm', surface].join(' ')} data-plan={plan} data-part={part} data-force-focus={force}>
      {render()}
    </div>
  </div>
);

const PlanHeader: React.FC<{ cols?: [string, string, string] }> = ({ cols = ['通常', '今のフォーカス', '案のフォーカス'] }) => (
  <div className="grid grid-cols-[220px_1fr_1fr_1fr] gap-6 text-xs font-bold text-onSurface-subtle">
    <div>部品と、案での変化</div>
    {cols.map((c) => (
      <div key={c}>{c}</div>
    ))}
  </div>
);

const LONG_LIST = (
  <ul className="text-sm text-onSurface list-none p-2 m-0 flex flex-col gap-2">
    {['のぞみ 12 号', 'のぞみ 14 号', 'ひかり 503 号', 'こだま 701 号', 'のぞみ 16 号', 'のぞみ 18 号', 'ひかり 505 号'].map((t) => (
      <li key={t}>{t}</li>
    ))}
  </ul>
);

/** 下地の節で使う面。#131 の「見たい点」の success / error / neutral の薄い面も足した。 */
const PLAN_SURFACES: { label: string; className: string }[] = [
  ...SURFACES,
  { label: 'surface.success-muted', className: 'bg-surface-success-muted' },
  { label: 'surface.error-muted', className: 'bg-surface-error-muted' },
  { label: 'surface.neutral-muted (neutral.100)', className: 'bg-surface-neutral-muted' },
];

export const Plan: Story = {
  name: '案',
  parameters: {
    docs: {
      description: {
        story:
          '#131 の作り分ける案 (表の 1・2・4・5・6・7) を当てた姿。列は 通常 / 今のフォーカス / 案のフォーカス。案の列だけ、検討用の上書き CSS で見せている (部品は変えていない)。',
      },
    },
    pseudo: PLAN_PSEUDO,
  },
  render: () => (
    <div className="flex flex-col gap-10 max-w-[1240px] bg-surface p-6">
      <PlanStyle />
      <div className="flex flex-col gap-2">
        <h1 className="type-item-title text-onSurface">DDR-2 フォーカス：案</h1>
        <p className="text-sm text-onSurface-subtle">
          規則：輪は必ず 2px 以上。外側に輪を出す余地があれば「外側 2px＋すき間 2px」、無ければ「内側 2px」。色は border.focus の一色 (濃い塗りの内側だけ白)。すき間は塗らない。フォーカスは輪だけ、ホバーは塗りだけ。フォーカスが来る所には必ず輪を出す。
          輪は outline で描いている (すき間が塗られず、下の面が見える)。入力欄はこのページでは案 A (外側) で、案 B との比較は「案 (入力欄)」。メニューの項目は「案 (メニュー)」、Popover のパネルは「案 (パネル)」、エラーの色の比較は「案 (エラーの色)」。
        </p>
        <PlanHeader />
      </div>

      <Section title="1. 外側に余地がある → 外側 2px＋すき間 2px (キーボードのときだけ)" note="すき間は塗らない。色は border.focus の一色。">
        <PlanRow name="Button primary" change="変わる" how="すき間が白 → 下の面の色" render={() => <Button variant="primary">予約する</Button>} />
        <PlanRow name="Button secondary" change="変わる" how="すき間" render={() => <Button variant="secondary">戻る</Button>} />
        <PlanRow name="Button tertiary" change="変わる" how="すき間" render={() => <Button variant="tertiary">キャンセル</Button>} />
        <PlanRow name="Button destructive" change="変わる" how="輪の色 赤 → border.focus" render={() => <Button variant="destructive">削除する</Button>} />
        <PlanRow name="Link primary" change="変わる" how="すき間" render={() => <Link href="#">会社概要</Link>} />
        <PlanRow
          name="Link neutral"
          change="変わる"
          how="すき間"
          render={() => (
            <Link href="#" color="neutral">
              利用規約
            </Link>
          )}
        />
        <PlanRow
          name="Alert の本文の中の Link"
          change="変わる"
          how="すき間が白い帯 → 面の色"
          force="link"
          render={() => (
            <Alert variant="info">
              ベータ版を公開しました。<Link href="#">詳細を見る</Link>
            </Alert>
          )}
        />
        <PlanRow name="Checkbox" change="変わる" how="すき間" render={() => <Checkbox label="利用規約に同意する" />} />
        <PlanRow name="Checkbox (チェック済み)" change="変わる" how="すき間" render={() => <Checkbox label="利用規約に同意する" defaultChecked />} />
        <PlanRow
          name="Checkbox (エラー)"
          change="変わる"
          how="輪の色 赤 → border.focus"
          render={() => <Checkbox label="利用規約に同意する" error errorMessage="同意が必要です" />}
        />
        <PlanRow name="Radio" change="変わる" how="すき間" render={() => <Radio name="ddr2-plan-radio" value="card" label="クレジットカード" />} />
        <PlanRow name="Switch" change="変わる" how="すき間" render={() => <Switch label="メール通知" checked={false} onChange={noop} />} />
        <PlanRow name="Switch (オン)" change="変わる" how="すき間" render={() => <Switch label="メール通知" checked onChange={noop} />} />
        <PlanRow
          name="Card (押せるもの)"
          change="変わる"
          how="すき間"
          render={() => (
            <Card variant="outlined" clickable onClick={noop}>
              <Card.Body>
                <p className="text-sm text-onSurface">のぞみ 12 号</p>
              </Card.Body>
            </Card>
          )}
        />
        <PlanRow
          name="Pagination"
          change="変わる"
          how="すき間。全ボタンを同時にフォーカスにしている (隣どうしの重なりを見る)"
          render={() => <Pagination currentPage={2} totalPages={5} onPageChange={noop} />}
        />
        <PlanRow
          name="Breadcrumb のリンク"
          change="変わる"
          how="すき間 (「>」との近さを見る)"
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
        <PlanRow
          name="ToggleButton 未選択"
          change="変わる"
          how="すき間"
          render={() => (
            <ToggleButton selected={false} onClick={noop}>
              13
            </ToggleButton>
          )}
        />
        <PlanRow
          name="ToggleButton 選択中"
          change="変わる"
          how="すき間"
          render={() => (
            <ToggleButton selected onClick={noop}>
              12
            </ToggleButton>
          )}
        />
        <PlanRow
          name="FilterChip"
          change="変わる"
          how="内側 1px → 外側 2px＋すき間"
          render={() => (
            <FilterChip iconRight={<Icon name="expand_more" size="sm" />} onClick={noop}>
              並び順: 出発時刻順
            </FilterChip>
          )}
        />
        <PlanRow
          name="FilterChip (選択中)"
          change="変わる"
          how="内側 1px → 外側 2px＋すき間"
          render={() => (
            <FilterChip active onClick={noop}>
              指定席のみ
            </FilterChip>
          )}
        />
        {(['info', 'error', 'neutral'] as const).map((v) => (
          <PlanRow
            key={`plan-alert-${v}`}
            name={`Alert ${v} の閉じる`}
            change="変わる"
            how="輪の色 文字色 → border.focus、すき間"
            render={() => (
              <Alert variant={v} onClose={noop}>
                お知らせの本文。
              </Alert>
            )}
          />
        ))}
        <PlanRow
          name="Toast info の閉じる・操作ボタン"
          change="変わる"
          how="輪の色 文字色 → border.focus、すき間"
          render={() => <InlineToast variant="info" action />}
        />
      </Section>

      <Section title="2. 外側に余地が無い (枠の中に詰まっている・端で切れる) → 内側 2px (キーボードのときだけ)" note="角は四角のまま。角丸に合わせた版は下の「内側の輪の角」。">
        <PlanRow
          name="NumberInput の ±"
          change="変わる"
          how="形は同じ。描き方が ring → outline (枠の角は四角のまま)"
          part="number"
          render={() => <NumberInput value={2} onChange={noop} min={0} max={9} label="人数" />}
        />
        <PlanRow
          name="SegmentedControl"
          change="変わらない"
          how="未選択は border.focus、選択中は白 (濃い塗りの内側)。描き方だけ outline"
          render={() => <SegmentedControl items={SEGMENTS} value="list" onChange={noop} aria-label="表示モード" />}
        />
        <PlanRow
          name="SearchBar のクリアボタン"
          change="変わらない"
          how="描き方だけ outline"
          part="search"
          render={() => <SearchBar value="新大阪" onChange={noop} placeholder="駅名を検索" />}
        />
        <PlanRow
          name="Accordion の見出し"
          change="変わる"
          how="白 2px＋2px → 内側 2px (すき間なし)"
          part="accordion"
          render={() => <Accordion items={[{ id: 'a', title: 'よくある質問', content: '中身' }]} />}
        />
        <PlanRow
          name="Tabs のタブ (選択中)"
          change="変わる"
          how="外側 (上下が切れる) → 内側 2px"
          force="tab1"
          render={() => <Tabs ariaLabel="Tabs" defaultActiveId="a" tabs={TABS.map((t) => ({ ...t, content: null }))} />}
        />
        <PlanRow
          name="Tabs のタブ (未選択)"
          change="変わる"
          how="外側 (上下が切れる) → 内側 2px"
          force="tab2"
          render={() => <Tabs ariaLabel="Tabs" defaultActiveId="a" tabs={TABS.map((t) => ({ ...t, content: null }))} />}
        />
      </Section>

      <Section
        title="3. 入力欄 (このページは案 A：外側 2px＋すき間、クリックでも出る)"
        note="枠線の色は変えない。エラーのときも輪は border.focus、枠線は赤のまま。案 B との比較は「案 (入力欄)」。"
      >
        <PlanRow name="Input" change="変わる" force="focus" render={() => <Input label="メールアドレス" placeholder="example@email.com" />} />
        <PlanRow
          name="Input (エラー)"
          change="変わる"
          force="focus"
          render={() => <Input label="メールアドレス" defaultValue="example@" error errorMessage="形式が正しくありません" />}
        />
        <PlanRow name="Textarea" change="変わる" force="focus" render={() => <Textarea label="お問い合わせ内容" rows={2} />} />
        <PlanRow
          name="Select"
          change="変わる"
          force="focus"
          render={() => (
            <Select label="都道府県">
              <option value="osaka">大阪府</option>
              <option value="tokyo">東京都</option>
            </Select>
          )}
        />
        <PlanRow name="SearchBar の入力欄" change="変わる" force="focus" render={() => <SearchBar value="新大阪" onChange={noop} placeholder="駅名を検索" />} />
      </Section>

      <Section
        title="4. フォーカスが来るだけの領域 → 内側 2px (キーボードのときだけ)"
        note="Tabs のパネルは文章だけのパネル、SplitPane はスクロールが出ている状態 (#136 を直した後もフォーカスが来る状態)。SplitPane は左の領域だけにフォーカス。Popover のパネルは「案 (パネル)」。今の SplitPane はブラウザ既定の outline で、ここでは再現できない (「今のまま (SplitPane)」)。"
      >
        <PlanRow
          name="Tabs のパネル"
          change="変わる"
          how="何も出ない → 内側 2px"
          force="tabpanel"
          render={() => <Tabs ariaLabel="Tabs" defaultActiveId="a" tabs={TABS} />}
        />
        <PlanRow
          name="SplitPane の領域"
          change="変わる"
          how="ブラウザ任せ → 内側 2px"
          force="pane"
          part="splitpane"
          render={() => (
            <SplitPane list={LONG_LIST} listWidth="140px" height="120px">
              <p className="text-sm text-onSurface p-2">詳細</p>
            </SplitPane>
          )}
        />
      </Section>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="type-body font-bold text-onSurface">内側の輪の角</h2>
          <p className="text-xs text-onSurface-subtle mt-1">
            丸い枠の中の内側の輪。左は四角のまま、右は枠の角丸に合わせた版 (Accordion は 8 - 1 = 7px、NumberInput は 4 - 1 = 3px を、その部品にだけ当てた)。どちらもフォーカスを強制。
          </p>
        </div>
        <div className="flex flex-col divide-y divide-border-subtle border-y border-border-subtle">
          {[
            { name: 'Accordion の見出し', part: 'accordion', force: 'visible' as Force, render: () => <Accordion items={[{ id: 'c', title: 'よくある質問', content: '中身' }]} /> },
            { name: 'NumberInput の ±', part: 'number', force: 'visible' as Force, render: () => <NumberInput value={2} onChange={noop} min={0} max={9} label="人数" /> },
            {
              name: 'SegmentedControl',
              part: undefined,
              force: 'visible' as Force,
              render: () => <SegmentedControl items={SEGMENTS} value="list" onChange={noop} aria-label="表示モード" />,
            },
            { name: 'Tabs のパネル', part: undefined, force: 'tabpanel' as Force, render: () => <Tabs ariaLabel="Tabs" defaultActiveId="a" tabs={TABS} /> },
          ].map((r) => (
            <div key={r.name} className="grid grid-cols-[220px_1fr_1fr] gap-6 items-center py-4">
              <div className="text-sm font-bold text-onSurface">{r.name}</div>
              <div className="flex flex-col gap-2">
                <div className="text-xs text-onSurface-subtle">四角のまま</div>
                <div className="p-3" data-plan="p" data-part={r.part} data-force-focus={r.force}>
                  {r.render()}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-xs text-onSurface-subtle">角丸に合わせる</div>
                <div className="p-3" data-plan="p" data-part={r.part} data-corner="round" data-force-focus={r.force}>
                  {r.render()}
                </div>
              </div>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="flex flex-col gap-2">
              <div className="text-xs font-bold text-onSurface-subtle">Accordion 四角のまま (左上の角を 4 倍)</div>
              <div className="w-[480px] h-[160px] overflow-hidden border border-border-subtle">
                <div className="w-[220px]" style={{ zoom: 4 }} data-plan="p" data-part="accordion" data-force-focus="visible">
                  <Accordion items={[{ id: 'z', title: 'よくある質問', content: '中身' }]} />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-xs font-bold text-onSurface-subtle">Accordion 角丸に合わせる (左上の角を 4 倍)</div>
              <div className="w-[480px] h-[160px] overflow-hidden border border-border-subtle">
                <div className="w-[220px]" style={{ zoom: 4 }} data-plan="p" data-part="accordion" data-corner="round" data-force-focus="visible">
                  <Accordion items={[{ id: 'z', title: 'よくある質問', content: '中身' }]} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section
        title="下地による違い (案)"
        note="すき間を塗らないので、すき間には下の面の色が見える。border.focus と各面の差はすべて 5.6:1 以上 (白 6.42 / neutral.50 6.15 / neutral.100 5.88 / success 5.93 / error 5.63 / warning 5.83 / info 5.86)。"
      >
        <PlanHeader />
        {PLAN_SURFACES.map((s) => (
          <PlanRow
            key={s.className}
            name={s.label}
            change="変わる"
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
        title="ホバーとの重なり (案)"
        note="何も足さない。フォーカスの輪 (outline) が上。すき間を塗らないので、すき間にホバーの薄い色 (外側 4px の輪の内側 2px) が見える。"
      >
        <div className="grid grid-cols-[220px_1fr_1fr_1fr_1fr] gap-6 items-center py-4 text-xs font-bold text-onSurface-subtle">
          <div />
          <div>今：ホバー＋フォーカス</div>
          <div>案：ホバーだけ</div>
          <div>案：フォーカスだけ</div>
          <div>案：ホバー＋フォーカス</div>
        </div>
        {[
          { name: 'Checkbox', render: () => <Checkbox label="同意する" /> },
          { name: 'Radio', render: () => <Radio name="ddr2-plan-radio-hover" value="a" label="選択肢" /> },
          { name: 'Switch', render: () => <Switch label="通知" checked={false} onChange={noop} /> },
        ].map((r) => (
          <div key={r.name} className="grid grid-cols-[220px_1fr_1fr_1fr_1fr] gap-6 items-center py-4">
            <div className="text-sm font-bold text-onSurface">{r.name}</div>
            <div className="p-3" data-force-hover data-force-focus="visible">
              {r.render()}
            </div>
            <div className="p-3" data-plan="p" data-force-hover>
              {r.render()}
            </div>
            <div className="p-3" data-plan="p" data-force-focus="visible">
              {r.render()}
            </div>
            <div className="p-3" data-plan="p" data-force-hover data-force-focus="visible">
              {r.render()}
            </div>
          </div>
        ))}
      </Section>
    </div>
  ),
};

export const PlanMenu: Story = {
  name: '案 (メニュー)',
  parameters: {
    docs: {
      description: {
        story:
          '案の DropdownMenu の項目。フォーカスは内側 2px の輪だけ (塗りを外す)、ホバーは塗りだけ。1 つ目はフォーカス、2 つ目はホバー、3 つ目 (削除) はフォーカス。今の姿は「今のまま (メニュー)」。',
      },
    },
    pseudo: {
      focusVisible: ['[role="menuitem"]:nth-of-type(1)', '[role="menuitem"]:nth-of-type(3)'],
      hover: ['[role="menuitem"]:nth-of-type(2)'],
    },
  },
  render: () => (
    <div className="p-8 pb-48 flex flex-col items-center gap-4" data-plan="p">
      <PlanStyle />
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

export const PlanPanel: Story = {
  name: '案 (パネル)',
  parameters: {
    docs: {
      description: {
        story:
          '案の Popover のパネル。中に押せるものが無く、パネル自体にフォーカスがあるとき、内側 2px の輪を出す (キーボードのときだけ)。今の姿は「今のまま (パネル)」。',
      },
    },
    pseudo: { focusVisible: ['[role="dialog"]'] },
  },
  render: () => (
    <div className="p-8 pb-48 flex flex-col items-center gap-4" data-plan="p">
      <PlanStyle />
      <p className="text-xs text-onSurface-subtle">パネルにフォーカスがある状態</p>
      <Popover trigger={<Button variant="secondary">詳細</Button>} open onOpenChange={noop} placement="bottom" aria-label="補足情報">
        押せるものが無いパネル。開くとパネル自体にフォーカスが移る。
      </Popover>
    </div>
  ),
};

/** 案 (入力欄) のフォーム。`target` の欄だけにフォーカスを当てる。 */
const PlanForm: React.FC<{ target: 'name' | 'email' }> = ({ target }) => {
  const wrap = (key: 'name' | 'email', node: React.ReactNode) =>
    key === target ? <div data-focus-target>{node}</div> : <div>{node}</div>;
  return (
    <div className="flex flex-col gap-6">
      <SearchBar value="" onChange={noop} placeholder="駅名を検索" />
      {wrap('name', <Input label="氏名" placeholder="山田 太郎" />)}
      {wrap('email', <Input label="メールアドレス" defaultValue="example@" error errorMessage="形式が正しくありません" />)}
      <Select label="都道府県">
        <option value="osaka">大阪府</option>
        <option value="tokyo">東京都</option>
      </Select>
      <Textarea label="お問い合わせ内容" rows={3} />
    </div>
  );
};

export const PlanFields: Story = {
  name: '案 (入力欄)',
  parameters: {
    docs: {
      description: {
        story:
          '入力欄の案 A (外側 2px＋すき間、枠線は変えない) と案 B (入力欄だけ例外：内側 2px＋枠線の色) を、ふつうのフォームに並べて見比べる。上段はふつうの欄 (氏名)、下段はエラーの欄 (メールアドレス) にフォーカス。どちらもクリックでも出る (:focus)。',
      },
    },
    pseudo: PLAN_PSEUDO,
  },
  render: () => (
    <div className="flex flex-col gap-10 max-w-[960px] bg-surface p-6">
      <PlanStyle />
      {(['name', 'email'] as const).map((target) => (
        <section key={target} className="flex flex-col gap-4">
          <h2 className="type-body font-bold text-onSurface">
            {target === 'name' ? 'ふつうの欄 (氏名) にフォーカス' : 'エラーの欄 (メールアドレス) にフォーカス'}
          </h2>
          <div className="grid grid-cols-2 gap-12">
            <div className="flex flex-col gap-3">
              <div className="text-xs font-bold text-onSurface-subtle">案 A：外側 2px＋すき間 2px (枠線は変えない)</div>
              <div data-plan="a">
                <PlanForm target={target} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xs font-bold text-onSurface-subtle">案 B：内側 2px＋枠線の色 (エラーのときは枠線は赤のまま)</div>
              <div data-plan="b">
                <PlanForm target={target} />
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  ),
};

export const PlanErrorColor: Story = {
  name: '案 (エラーの色)',
  parameters: {
    docs: {
      description: {
        story:
          'エラー時の輪の色の比較。左から 今のまま (赤) / 案の形で赤 / 案の形で border.focus。形と色を分けて見るために、真ん中に「形だけ案」の列を置いた。入力欄の形は案 A と案 B の両方。',
      },
    },
    pseudo: PLAN_PSEUDO,
  },
  render: () => {
    const rows: { name: string; force: Force; plan: 'p' | 'b'; render: () => React.ReactNode }[] = [
      { name: 'Button destructive', force: 'visible', plan: 'p', render: () => <Button variant="destructive">削除する</Button> },
      { name: 'Checkbox (エラー)', force: 'visible', plan: 'p', render: () => <Checkbox label="利用規約に同意する" error errorMessage="同意が必要です" /> },
      { name: 'Radio (エラー)', force: 'visible', plan: 'p', render: () => <Radio name="ddr2-plan-radio-error" value="card" label="クレジットカード" error /> },
      {
        name: 'Input (エラー) 案 A',
        force: 'focus',
        plan: 'p',
        render: () => <Input label="メールアドレス" defaultValue="example@" error errorMessage="形式が正しくありません" />,
      },
      {
        name: 'Input (エラー) 案 B',
        force: 'focus',
        plan: 'b',
        render: () => <Input label="メールアドレス" defaultValue="example@" error errorMessage="形式が正しくありません" />,
      },
      {
        name: 'Textarea (エラー) 案 A',
        force: 'focus',
        plan: 'p',
        render: () => <Textarea label="お問い合わせ内容" rows={2} error errorMessage="入力してください" />,
      },
      {
        name: 'Select (エラー) 案 A',
        force: 'focus',
        plan: 'p',
        render: () => (
          <Select label="都道府県" error errorMessage="選択してください">
            <option value="">選択してください</option>
            <option value="osaka">大阪府</option>
          </Select>
        ),
      },
    ];
    return (
      <div className="flex flex-col gap-4 max-w-[1240px] bg-surface p-6">
        <PlanStyle />
        <PlanHeader cols={['今のまま (赤)', '案の形・赤', '案の形・border.focus']} />
        <div className="flex flex-col divide-y divide-border-subtle border-y border-border-subtle">
          {rows.map((r) => (
            <div key={r.name} className="grid grid-cols-[220px_1fr_1fr_1fr] gap-6 items-center py-4">
              <div className="text-sm font-bold text-onSurface">{r.name}</div>
              <div className="p-3" data-force-focus={r.force}>
                {r.render()}
              </div>
              <div className="p-3" data-plan={r.plan} data-plan-color="red" data-force-focus={r.force}>
                {r.render()}
              </div>
              <div className="p-3" data-plan={r.plan} data-force-focus={r.force}>
                {r.render()}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};
