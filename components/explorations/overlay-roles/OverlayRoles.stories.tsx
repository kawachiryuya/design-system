import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ActionBar,
  Badge,
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
  Cluster,
  DropdownMenu,
  FilterChip,
  Icon,
  Modal,
  Popover,
  Radio,
  RadioGroup,
  Stack,
  VisuallyHidden,
} from '../../index';
import { Sheet, SheetOption } from './Sheet';
import {
  CHOICES,
  DEFAULTS,
  FORM_LABEL,
  ROLES,
  ROLE_LABEL,
  ROLE_NOTE,
  WIDE,
  WIDE_QUERY,
  parseHash,
  summary,
  toHash,
  type Form,
  type Role,
  type Settings,
} from './options';

/**
 * 検討 (Issue #157): 重なる部品の役割と出方。
 *
 * このファイルは検討用で、main には入れない前提 (出荷物でも規約の対象でもない)。
 * 出荷する部品には手を入れず、鉄道の予約アプリ風の 1 画面に 4 つの役割 (確認・選ぶ・補足・作業) の入口を置き、
 * 狭い幅 (640px 未満) での出方を上の帯から切り替えて、スマホの実機で触って比べる。
 * - 使う側が選ぶのは「役割」。出方は幅から決まる。広い幅 (640px 以上) では切り替えによらず固定
 * - 切り替えの状態は URL の hash に持つ (同じ状態をリンクで配れる)
 * - 下から出る形・画面いっぱいは検討用の部品 (./Sheet.tsx)。ほかは design-system の既存の部品そのまま
 * - Chromatic の撮影対象外 (検討用の画面で、視覚回帰の基準にしない)
 */
const meta: Meta = {
  title: '検討/重なる部品の役割と出方',
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true },
  },
};

export default meta;
type Story = StoryObj;

// ───────────────────────── 状態 (hash と幅) ─────────────────────────

function useSettings(): [Settings, (next: Settings) => void] {
  const [s, setS] = React.useState<Settings>(() =>
    typeof window === 'undefined' ? DEFAULTS : parseHash(window.location.hash),
  );
  React.useEffect(() => {
    const onHash = () => setS(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const update = React.useCallback((next: Settings) => {
    setS(next);
    // 履歴を増やさずに hash だけ書き換える (戻るボタンで切り替えをさかのぼらない)
    window.history.replaceState(null, '', toHash(next));
  }, []);
  return [s, update];
}

function useIsWide(): boolean {
  const [wide, setWide] = React.useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(WIDE_QUERY).matches,
  );
  React.useEffect(() => {
    const mq = window.matchMedia(WIDE_QUERY);
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
}

// ───────────────────────── 切り替えの帯 ─────────────────────────

const SwitchBand: React.FC<{ settings: Settings; onChange: (s: Settings) => void; wide: boolean }> = ({
  settings,
  onChange,
  wide,
}) => {
  const [open, setOpen] = React.useState(false);
  const bandRef = React.useRef<HTMLButtonElement | null>(null);
  const headingRef = React.useRef<HTMLHeadingElement | null>(null);

  React.useEffect(() => {
    if (open) headingRef.current?.focus();
  }, [open]);

  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => bandRef.current?.focus());
  };

  return (
    <>
      {/* 帯: 検討用だと分かるよう、題材の画面に無い色 (warning の薄い面) と破線で区切る */}
      <div className="sticky top-0 z-sticky bg-surface-warning-muted border-b-2 border-dashed border-border-warning-strong">
        <button
          ref={bandRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          className="flex w-full min-h-12 items-center gap-2 px-3 text-left text-onSurface-warning focus-ring-inset hover:bg-state-hover"
        >
          <Icon name="tune" size="sm" aria-hidden />
          <span className="type-label shrink-0">検討用</span>
          <span className="type-caption flex-1 min-w-0 truncate">
            {wide ? '広い幅では固定（狭い幅で切り替え）' : summary(settings)}
          </span>
          <Icon name="expand_more" size="sm" aria-hidden />
        </button>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="x-switch-title"
          onKeyDown={(e) => {
            if (e.key === 'Escape') close();
          }}
          className="fixed inset-0 z-tooltip overflow-y-auto bg-surface-warning-muted text-onSurface"
        >
          <div className="mx-auto max-w-lg p-4">
            <div className="flex items-center justify-between gap-3 border-b-2 border-dashed border-border-warning-strong pb-2">
              <h2 id="x-switch-title" ref={headingRef} tabIndex={-1} className="type-section-title text-onSurface-warning focus-ring-inset rounded-sm">
                切り替え（検討用）
              </h2>
              <Button variant="secondary" size="md" onClick={close}>
                閉じる
              </Button>
            </div>
            <p className="type-supporting text-onSurface mt-3">
              狭い幅（640px 未満）での出方を役割ごとに選びます。初期値は「今の形」。状態は URL に入るので、このページのリンクを送ると同じ状態で開きます。
            </p>
            {wide && (
              <p className="type-label text-onSurface-warning mt-2">
                いまは広い幅です。広い幅では固定（確認＝中央のカード、選ぶ＝押した要素の近く、補足＝押した要素の近く、作業＝中央の大きいカード）で、ここでの切り替えは狭い幅にだけ効きます。
              </p>
            )}
            <Stack gap="lg" className="mt-4">
              {ROLES.map((role) => (
                <RadioGroup key={role} legend={`${ROLE_LABEL[role]}（${ROLE_NOTE[role]}）`}>
                  {CHOICES[role].map((form, i) => (
                    <Radio
                      key={form}
                      name={`x-${role}`}
                      value={form}
                      label={i === 0 ? `${FORM_LABEL[form]}（今）` : FORM_LABEL[form]}
                      checked={settings[role] === form}
                      onChange={() => onChange({ ...settings, [role]: form })}
                    />
                  ))}
                </RadioGroup>
              ))}
              <RadioGroup legend="「下から出る形」のつまみ（上端の短い横棒。見た目だけ）" inline>
                <Radio
                  name="x-handle"
                  value="0"
                  label="なし"
                  checked={!settings.handle}
                  onChange={() => onChange({ ...settings, handle: false })}
                />
                <Radio
                  name="x-handle"
                  value="1"
                  label="あり"
                  checked={settings.handle}
                  onChange={() => onChange({ ...settings, handle: true })}
                />
              </RadioGroup>
            </Stack>
          </div>
        </div>
      )}
    </>
  );
};

// ───────────────────────── 題材のデータ ─────────────────────────

type SortKey = 'departure' | 'arrival';
const SORT_LABEL: Record<SortKey, string> = { departure: '出発時刻順', arrival: '到着時刻順' };
const SORTS: SortKey[] = ['departure', 'arrival'];

const CHANGES = ['列車を変更', '座席を変更', '人数を変更', '区間を変更'];

interface Train {
  name: string;
  dep: string;
  arr: string;
  mins: number;
  seats: { label: string; state: '空席あり' | '残りわずか' | '満席' }[];
  free?: boolean;
}

const TRAINS: Train[] = [
  { name: 'のぞみ 21号', dep: '9:00', arr: '11:27', mins: 147, seats: [{ label: '指定席', state: '空席あり' }, { label: 'グリーン車', state: '残りわずか' }], free: true },
  { name: 'ひかり 637号', dep: '9:03', arr: '11:56', mins: 173, seats: [{ label: '指定席', state: '空席あり' }, { label: 'グリーン車', state: '空席あり' }], free: true },
  { name: 'のぞみ 23号', dep: '9:09', arr: '11:33', mins: 144, seats: [{ label: '指定席', state: '満席' }, { label: 'グリーン車', state: '空席あり' }], free: true },
  { name: 'のぞみ 211号', dep: '9:21', arr: '11:51', mins: 150, seats: [{ label: '指定席', state: '残りわずか' }, { label: 'グリーン車', state: '空席あり' }], free: true },
  { name: 'こだま 715号', dep: '9:27', arr: '13:21', mins: 234, seats: [{ label: '指定席', state: '空席あり' }, { label: 'グリーン車', state: '空席あり' }], free: true },
  { name: 'のぞみ 25号', dep: '9:30', arr: '11:57', mins: 147, seats: [{ label: '指定席', state: '空席あり' }, { label: 'グリーン車', state: '満席' }], free: true },
];

const SEAT_BADGE = { 空席あり: 'success', 残りわずか: 'warning', 満席: 'neutral' } as const;

interface Filter {
  time: string[];
  kind: string[];
  seat: string;
  transfer: string;
  facility: string[];
  vacantOnly: boolean;
}
const EMPTY_FILTER: Filter = { time: [], kind: [], seat: '指定なし', transfer: '指定なし', facility: [], vacantOnly: false };
const countFilter = (f: Filter) =>
  f.time.length + f.kind.length + f.facility.length + (f.seat !== '指定なし' ? 1 : 0) + (f.transfer !== '指定なし' ? 1 : 0) + (f.vacantOnly ? 1 : 0);

const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

const FREE_SEAT_TEXT = [
  '自由席は 1〜3 号車です。座席の指定はなく、空いている席に座れます。',
  '連休や朝夕の混み合う時間帯は座れないことがあります。確実に座りたいときは指定席をお選びください。',
];

// ───────────────────────── 絞り込みの中身 (作業) ─────────────────────────

const FilterForm: React.FC<{ value: Filter; onChange: (f: Filter) => void }> = ({ value: f, onChange }) => (
  <Stack gap="lg">
    <CheckboxGroup legend="出発時刻の帯">
      {['早朝（〜7時）', '午前（7〜12時）', '午後（12〜17時）', '夜（17時〜）'].map((v) => (
        <Checkbox key={v} label={v} checked={f.time.includes(v)} onChange={() => onChange({ ...f, time: toggle(f.time, v) })} />
      ))}
    </CheckboxGroup>
    <CheckboxGroup legend="種別">
      {['のぞみ', 'ひかり', 'こだま'].map((v) => (
        <Checkbox key={v} label={v} checked={f.kind.includes(v)} onChange={() => onChange({ ...f, kind: toggle(f.kind, v) })} />
      ))}
    </CheckboxGroup>
    <RadioGroup legend="席種">
      {['指定なし', '普通車指定席', 'グリーン車', '自由席'].map((v) => (
        <Radio key={v} name="x-filter-seat" value={v} label={v} checked={f.seat === v} onChange={() => onChange({ ...f, seat: v })} />
      ))}
    </RadioGroup>
    <RadioGroup legend="乗り換え">
      {['指定なし', '乗り換えなし', '1 回まで'].map((v) => (
        <Radio key={v} name="x-filter-transfer" value={v} label={v} checked={f.transfer === v} onChange={() => onChange({ ...f, transfer: v })} />
      ))}
    </RadioGroup>
    <CheckboxGroup legend="設備">
      {['電源コンセントあり', '多目的室の近く', '喫煙ルームの近く', '荷物置き場つきの席'].map((v) => (
        <Checkbox key={v} label={v} checked={f.facility.includes(v)} onChange={() => onChange({ ...f, facility: toggle(f.facility, v) })} />
      ))}
    </CheckboxGroup>
    <Checkbox
      label="空席のある列車だけ"
      description="満席の列車を一覧から外します"
      checked={f.vacantOnly}
      onChange={() => onChange({ ...f, vacantOnly: !f.vacantOnly })}
    />
  </Stack>
);

// ───────────────────────── 題材の画面 ─────────────────────────

type OpenKey = null | 'sort' | 'filter' | 'info' | 'change' | 'cancel';

const RailDemo: React.FC = () => {
  const [settings, setSettings] = useSettings();
  const wide = useIsWide();
  /** その役割の、今の幅での出方 */
  const formOf = (role: Role): Form => (wide ? WIDE[role] : settings[role]);

  const [open, setOpen] = React.useState<OpenKey>(null);
  const close = () => setOpen(null);
  const [sort, setSort] = React.useState<SortKey>('departure');
  const [sortDraft, setSortDraft] = React.useState<SortKey>('departure');
  const [filter, setFilter] = React.useState<Filter>(EMPTY_FILTER);
  const [filterDraft, setFilterDraft] = React.useState<Filter>(EMPTY_FILTER);
  const [status, setStatus] = React.useState('');

  const chooseSort = (k: SortKey) => {
    setSort(k);
    close();
    setStatus(`並び順を「${SORT_LABEL[k]}」にしました`);
  };
  const chooseChange = (label: string) => {
    close();
    setStatus(`「${label}」を選びました（検討用の表示。先の画面はありません）`);
  };

  const trains = [...TRAINS].sort((a, b) =>
    sort === 'departure' ? a.dep.localeCompare(b.dep, 'ja', { numeric: true }) : a.arr.localeCompare(b.arr, 'ja', { numeric: true }),
  );
  const filterCount = countFilter(filter);

  // ── 入口: 並び順 (選ぶ) ──
  const sortLabel = `並び順：${SORT_LABEL[sort]}`;
  const sortChip = (
    <FilterChip iconRight={<Icon name="expand_more" size="sm" aria-hidden />}>{sortLabel}</FilterChip>
  );
  const sortEntry =
    formOf('choose') === 'anchor' ? (
      <DropdownMenu
        trigger={sortChip}
        aria-label="並び順"
        items={SORTS.map((k) => ({
          // DropdownMenu に「選択中」を持たせる仕組みが無いので、label の中に印と読み上げ用の文字を入れる
          label: (
            <span className="flex items-center justify-between gap-3">
              <span>{SORT_LABEL[k]}</span>
              {sort === k && (
                <>
                  <Icon size="sm" color="primary">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </Icon>
                  <VisuallyHidden>（選択中）</VisuallyHidden>
                </>
              )}
            </span>
          ),
          textValue: SORT_LABEL[k],
          onSelect: () => chooseSort(k),
        }))}
      />
    ) : (
      React.cloneElement(sortChip, {
        onClick: () => {
          setSortDraft(sort);
          setOpen('sort');
        },
        'aria-haspopup': 'dialog',
      })
    );

  // ── 入口: 予約を変更 (選ぶ・操作の一覧) ──
  const changeButton = (
    <Button variant="secondary" icon={<Icon name="swap_horiz" aria-hidden />}>
      予約を変更
    </Button>
  );
  const changeEntry =
    formOf('choose') === 'anchor' ? (
      <DropdownMenu
        trigger={changeButton}
        aria-label="予約を変更"
        placement="top-start"
        items={CHANGES.map((label) => ({ label, onSelect: () => chooseChange(label) }))}
      />
    ) : (
      React.cloneElement(changeButton, { onClick: () => setOpen('change'), 'aria-haspopup': 'dialog' })
    );

  // ── 入口: 自由席について (補足) ──
  const infoButton = (
    <Button variant="tertiary" size="sm" icon={<Icon name="help" size="sm" aria-hidden />}>
      自由席について
    </Button>
  );
  const infoEntry =
    formOf('info') === 'anchor' ? (
      <Popover trigger={infoButton} aria-label="自由席について" placement="bottom-start">
        <div className="flex flex-col gap-2">
          {FREE_SEAT_TEXT.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      </Popover>
    ) : (
      React.cloneElement(infoButton, { onClick: () => setOpen('info'), 'aria-haspopup': 'dialog' })
    );

  // ── 入口: 絞り込み (作業) ──
  const filterEntry = (
    <Button
      variant="secondary"
      size="sm"
      icon={<Icon name="tune" size="sm" aria-hidden />}
      aria-haspopup="dialog"
      onClick={() => {
        setFilterDraft(filter);
        setOpen('filter');
      }}
    >
      {filterCount > 0 ? `絞り込み（${filterCount}）` : '絞り込み'}
    </Button>
  );
  // ActionBar は container query で縦横を決めるので、Modal.Footer (flex) の中では幅を持たせる (w-full)
  const filterFooter = (
    <ActionBar className="w-full">
      <Button variant="tertiary" onClick={close}>
        取り消し
      </Button>
      <Button
        variant="primary"
        onClick={() => {
          setFilter(filterDraft);
          close();
          setStatus(`絞り込みを適用しました（${countFilter(filterDraft)} 件の条件）`);
        }}
      >
        適用
      </Button>
    </ActionBar>
  );

  // ── 入口: 予約をキャンセル (確認) ──
  const cancelEntry = (
    <Button variant="destructive" icon={<Icon name="remove" aria-hidden />} aria-haspopup="dialog" onClick={() => setOpen('cancel')}>
      予約をキャンセル
    </Button>
  );
  const cancelText = (
    <p>
      のぞみ 21号（11月30日 9:00 東京発）の予約を取り消します。払い戻しの手数料は 340円です。取り消した予約は元に戻せません。
    </p>
  );
  const cancelFooter = (
    <ActionBar className="w-full">
      <Button variant="secondary" onClick={close}>
        戻る
      </Button>
      <Button
        variant="destructive"
        icon={<Icon name="remove" aria-hidden />}
        onClick={() => {
          close();
          setStatus('予約をキャンセルしました（検討用の表示）');
        }}
      >
        キャンセルする
      </Button>
    </ActionBar>
  );

  const sheetForm = (f: Form): 'sheet' | 'full' => (f === 'full' ? 'full' : 'sheet');

  return (
    <div className="min-h-screen bg-background text-onSurface">
      <SwitchBand settings={settings} onChange={setSettings} wide={wide} />

      {/* ── 題材: 鉄道の予約アプリ風の 1 画面 ── */}
      <header className="bg-surface border-b border-border-subtle px-4 py-3">
        <p className="type-caption text-onSurface-subtle">11月30日（日）・大人 1 人</p>
        <h1 className="type-page-title text-onSurface">東京 → 新大阪</h1>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-8">
        <div className="flex flex-wrap items-center gap-2 py-3">
          {sortEntry}
          {filterEntry}
        </div>

        <h2 className="type-item-title text-onSurface mb-2">列車を選ぶ（{trains.length} 本）</h2>
        <Stack gap="sm">
          {trains.map((t, i) => (
            <Card key={t.name} variant="outlined" padding="md">
              <div className="flex items-baseline justify-between gap-3">
                <span className="type-item-title text-onSurface">
                  {t.dep} → {t.arr}
                </span>
                <span className="type-supporting text-onSurface-subtle">
                  {Math.floor(t.mins / 60)}時間{t.mins % 60}分
                </span>
              </div>
              <p className="type-supporting text-onSurface mt-1">{t.name}</p>
              <Cluster gap="xs" className="mt-2">
                {t.seats.map((s) => (
                  <Badge key={s.label} variant={SEAT_BADGE[s.state]} appearance="soft">
                    {s.label}：{s.state}
                  </Badge>
                ))}
                {t.free && (
                  <Badge variant="neutral" appearance="soft">
                    自由席あり
                  </Badge>
                )}
              </Cluster>
              {/* 補足の入口は 1 本目のカードにだけ置く (同じ入口が 6 個並ぶと比べにくい) */}
              {i === 0 && <div className="mt-2 -ml-3">{infoEntry}</div>}
            </Card>
          ))}
        </Stack>

        <h2 className="type-item-title text-onSurface mt-8 mb-2">お持ちの予約</h2>
        <Card variant="outlined" padding="md">
          <p className="type-supporting text-onSurface-subtle">予約番号 4821-0937</p>
          <p className="type-item-title text-onSurface mt-1">のぞみ 21号　東京 9:00 → 新大阪 11:27</p>
          <p className="type-supporting text-onSurface mt-1">11月30日（日）・7 号車 12 番 A 席・大人 1 人</p>
          <div className="mt-4">
            <ActionBar align="start">
              {changeEntry}
              {cancelEntry}
            </ActionBar>
          </div>
        </Card>

        <p role="status" aria-live="polite" className="type-supporting text-onSurface-subtle mt-4 min-h-6">
          {status}
        </p>

        <p className="type-caption text-onSurface-subtle mt-8">
          ご案内：きっぷの払い戻しは、出発時刻の前までなら手数料 340円でできます。出発後の払い戻しはできません。
          乗り遅れた場合は、当日の後続の列車の自由席に乗れます。
        </p>
      </main>

      {/* ───── 重なる部品 (中央のカード / 下から / 画面いっぱい)。「押した要素の近く」は入口と一緒に上で描いている ───── */}

      {/* 選ぶ: 並び順 */}
      {formOf('choose') === 'center' && (
        <Modal open={open === 'sort'} onClose={close} title="並び順" size="sm">
          <Modal.Body>
            <RadioGroup legend="並べ替えの基準">
              {SORTS.map((k) => (
                <Radio
                  key={k}
                  name="x-sort-modal"
                  value={k}
                  label={SORT_LABEL[k]}
                  checked={sortDraft === k}
                  onChange={() => setSortDraft(k)}
                />
              ))}
            </RadioGroup>
          </Modal.Body>
          <Modal.Footer>
            <ActionBar className="w-full">
              <Button variant="tertiary" onClick={close}>
                取り消し
              </Button>
              <Button variant="primary" onClick={() => chooseSort(sortDraft)}>
                決定
              </Button>
            </ActionBar>
          </Modal.Footer>
        </Modal>
      )}
      {formOf('choose') === 'sheet' && (
        <Sheet open={open === 'sort'} onClose={close} title="並び順" handle={settings.handle} padded={false}>
          {SORTS.map((k) => (
            <SheetOption key={k} label={SORT_LABEL[k]} selected={sort === k} onSelect={() => chooseSort(k)} />
          ))}
        </Sheet>
      )}

      {/* 選ぶ: 予約を変更 (操作の一覧、印なし) */}
      {formOf('choose') === 'center' && (
        <Modal open={open === 'change'} onClose={close} title="予約を変更" size="sm">
          <Modal.Body>
            <Stack gap="sm">
              {CHANGES.map((label) => (
                <Button key={label} variant="secondary" fullWidth onClick={() => chooseChange(label)}>
                  {label}
                </Button>
              ))}
            </Stack>
          </Modal.Body>
        </Modal>
      )}
      {formOf('choose') === 'sheet' && (
        <Sheet open={open === 'change'} onClose={close} title="予約を変更" handle={settings.handle} padded={false}>
          {CHANGES.map((label) => (
            <SheetOption key={label} label={label} onSelect={() => chooseChange(label)} />
          ))}
        </Sheet>
      )}

      {/* 補足: 自由席について */}
      {formOf('info') === 'sheet' && (
        <Sheet open={open === 'info'} onClose={close} title="自由席について" handle={settings.handle}>
          <div className="flex flex-col gap-2">
            {FREE_SEAT_TEXT.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
        </Sheet>
      )}

      {/* 作業: 絞り込み */}
      {formOf('task') === 'center' ? (
        <Modal open={open === 'filter'} onClose={close} title="絞り込み" size="lg">
          <Modal.Body>
            <FilterForm value={filterDraft} onChange={setFilterDraft} />
          </Modal.Body>
          <Modal.Footer className="border-t border-border-subtle">{filterFooter}</Modal.Footer>
        </Modal>
      ) : (
        <Sheet
          open={open === 'filter'}
          onClose={close}
          title="絞り込み"
          form={sheetForm(formOf('task'))}
          handle={settings.handle}
          footer={filterFooter}
        >
          <FilterForm value={filterDraft} onChange={setFilterDraft} />
        </Sheet>
      )}

      {/* 確認: 予約をキャンセル。背景を押しても閉じない */}
      {formOf('confirm') === 'center' ? (
        <Modal open={open === 'cancel'} onClose={close} title="予約をキャンセルしますか？" size="sm" closeOnOverlayClick={false}>
          <Modal.Body>{cancelText}</Modal.Body>
          <Modal.Footer>{cancelFooter}</Modal.Footer>
        </Modal>
      ) : (
        <Sheet
          open={open === 'cancel'}
          onClose={close}
          title="予約をキャンセルしますか？"
          closeOnBackdrop={false}
          handle={settings.handle}
          footer={cancelFooter}
        >
          {cancelText}
        </Sheet>
      )}
    </div>
  );
};

export const OnRailApp: Story = {
  name: '鉄道の予約画面で試す',
  render: () => <RailDemo />,
  parameters: {
    docs: {
      description: {
        story:
          '上の帯から、役割ごとに狭い幅での出方を切り替えて触る。状態は URL の hash に入る (例 #confirm=sheet&choose=sheet&info=sheet&task=sheet&handle=1)。',
      },
    },
  },
};
