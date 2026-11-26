// 帯で切り替える案。選んだ組は URL の hash に持つ (例 #form=A&icon=first&action=right&wide=center)。
// 共有した URL を開けば、同じ組で開く。

export type FormKey = 'current' | 'A' | 'B' | 'C';
export type IconPos = 'first' | 'middle';
export type ActionPos = 'right' | 'below';
export type WidePos = 'center' | 'right';

export interface Look {
  form: FormKey;
  icon: IconPos;
  action: ActionPos;
  wide: WidePos;
}

export const DEFAULT_LOOK: Look = { form: 'A', icon: 'first', action: 'right', wide: 'center' };

interface Choice<T extends string> {
  value: T;
  /** 帯の中の選択肢の名前 */
  label: string;
  /** 畳んだ帯の 1 行に出す短い名前 */
  short: string;
}

export const FORM_CHOICES: Choice<FormKey>[] = [
  { value: 'current', label: '今のまま（見比べる用）', short: '今のまま' },
  { value: 'A', label: 'A 濃い面', short: 'A' },
  { value: 'B', label: 'B 白い面＋影', short: 'B' },
  { value: 'C', label: 'C 役割色で塗った面', short: 'C' },
];

export const ICON_CHOICES: Choice<IconPos>[] = [
  { value: 'first', label: '1 行目に固定（勧め）', short: '1 行目' },
  { value: 'middle', label: '上下の真ん中', short: '真ん中' },
];

export const ACTION_CHOICES: Choice<ActionPos>[] = [
  { value: 'right', label: '右端で上下の真ん中（勧め）', short: '右端' },
  { value: 'below', label: '文の下の段（右寄せ）', short: '下の段' },
];

export const WIDE_CHOICES: Choice<WidePos>[] = [
  { value: 'center', label: '下の中央', short: '中央' },
  { value: 'right', label: '右下', short: '右下' },
];

function pick<T extends string>(choices: Choice<T>[], raw: string | null, fallback: T): T {
  return choices.find((c) => c.value === raw)?.value ?? fallback;
}

export function readLook(hash: string): Look {
  const p = new URLSearchParams(hash.replace(/^#/, ''));
  return {
    form: pick(FORM_CHOICES, p.get('form'), DEFAULT_LOOK.form),
    icon: pick(ICON_CHOICES, p.get('icon'), DEFAULT_LOOK.icon),
    action: pick(ACTION_CHOICES, p.get('action'), DEFAULT_LOOK.action),
    wide: pick(WIDE_CHOICES, p.get('wide'), DEFAULT_LOOK.wide),
  };
}

export function writeLook(look: Look): string {
  return `#${new URLSearchParams({ ...look }).toString()}`;
}

export function shortOf<T extends string>(choices: Choice<T>[], value: T): string {
  return choices.find((c) => c.value === value)?.short ?? value;
}

/** 畳んだ帯の 1 行 (例「形 A／アイコン 1 行目／操作 右端／広い幅 中央」) */
export function summaryOf(look: Look): string {
  return [
    `形 ${shortOf(FORM_CHOICES, look.form)}`,
    `アイコン ${shortOf(ICON_CHOICES, look.icon)}`,
    `操作 ${shortOf(ACTION_CHOICES, look.action)}`,
    `広い幅 ${shortOf(WIDE_CHOICES, look.wide)}`,
  ].join('／');
}
