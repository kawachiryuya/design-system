// 帯で切り替える案 (2 回目)。選んだ組は URL の hash に持つ (例 #error=A2&close=text&place=auto)。
// 1 回目で決まったこと (11-27): 形は A「濃い面」がベース／アイコンは 1 行目に固定／広い幅は下の中央。これらは切り替えない。

/** 「できなかった」の色 (できた、はどれも A の濃い面) */
export type ErrorColor = 'A1' | 'A2' | 'A3';
/** 閉じるの形 */
export type CloseShape = 'icon' | 'text';
/** ボタンの位置 */
export type ButtonPlace = 'right' | 'below' | 'auto';

export interface Look {
  error: ErrorColor;
  close: CloseShape;
  place: ButtonPlace;
}

export const DEFAULT_LOOK: Look = { error: 'A2', close: 'text', place: 'auto' };

interface Choice<T extends string> {
  value: T;
  /** 帯の中の選択肢の名前 */
  label: string;
  /** 畳んだ帯の 1 行に出す短い名前 */
  short: string;
}

export const ERROR_CHOICES: Choice<ErrorColor>[] = [
  { value: 'A1', label: 'A1 濃い面のまま', short: 'A1' },
  { value: 'A2', label: 'A2 できなかった、は赤い面', short: 'A2' },
  { value: 'A3', label: 'A3 濃い面＋赤い印', short: 'A3' },
];

export const CLOSE_CHOICES: Choice<CloseShape>[] = [
  { value: 'icon', label: '×', short: '×' },
  { value: 'text', label: '閉じる（文字）', short: '文字' },
];

export const PLACE_CHOICES: Choice<ButtonPlace>[] = [
  { value: 'right', label: '右端', short: '右端' },
  { value: 'below', label: '下の段', short: '下の段' },
  { value: 'auto', label: '1 つなら右端、2 つなら下の段', short: '1 つなら右端' },
];

function pick<T extends string>(choices: Choice<T>[], raw: string | null, fallback: T): T {
  return choices.find((c) => c.value === raw)?.value ?? fallback;
}

export function readLook(hash: string): Look {
  const p = new URLSearchParams(hash.replace(/^#/, ''));
  return {
    error: pick(ERROR_CHOICES, p.get('error'), DEFAULT_LOOK.error),
    close: pick(CLOSE_CHOICES, p.get('close'), DEFAULT_LOOK.close),
    place: pick(PLACE_CHOICES, p.get('place'), DEFAULT_LOOK.place),
  };
}

export function writeLook(look: Look): string {
  return `#${new URLSearchParams({ ...look }).toString()}`;
}

function shortOf<T extends string>(choices: Choice<T>[], value: T): string {
  return choices.find((c) => c.value === value)?.short ?? value;
}

/** 畳んだ帯の 1 行 (例「できなかった A2／閉じる 文字／ボタン 1 つなら右端」) */
export function summaryOf(look: Look): string {
  return [
    `できなかった ${shortOf(ERROR_CHOICES, look.error)}`,
    `閉じる ${shortOf(CLOSE_CHOICES, look.close)}`,
    `ボタン ${shortOf(PLACE_CHOICES, look.place)}`,
  ].join('／');
}
