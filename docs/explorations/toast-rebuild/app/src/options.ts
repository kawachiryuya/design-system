// 帯で切り替える案 (3 回目)。選んだ組は URL の hash に持つ (例 #close=text&place=fit)。
// 決まったこと (11-27): 形は A「濃い面」がベース／アイコンは 1 行目に固定／広い幅は下の中央／
// 「できなかった」は A2 (赤い面)。これらは切り替えない。

/** 閉じるの形 */
export type CloseShape = 'icon' | 'text';

/**
 * ボタン (群) の位置。× は並びに数えず、いつも右上 (1 行目)
 * - below: いつも下の段
 * - count: 1 つなら右端、2 つなら下の段
 * - chars: 2 つなら下の段。1 つのとき、ラベルが 5 文字以上なら下の段、4 文字以下なら右端
 * - fit:   ボタンを文の右に置いても文が 1 行に収まるときだけ右端 (CSS の flex-wrap で決まる)
 */
export type ButtonPlace = 'below' | 'count' | 'chars' | 'fit';

export interface Look {
  close: CloseShape;
  place: ButtonPlace;
}

export const DEFAULT_LOOK: Look = { close: 'text', place: 'fit' };

interface Choice<T extends string> {
  value: T;
  /** 帯の中の選択肢の名前 */
  label: string;
  /** 畳んだ帯の 1 行に出す短い名前 */
  short: string;
}

export const CLOSE_CHOICES: Choice<CloseShape>[] = [
  { value: 'icon', label: '×', short: '×' },
  { value: 'text', label: '閉じる（文字）', short: '文字' },
];

export const PLACE_CHOICES: Choice<ButtonPlace>[] = [
  { value: 'below', label: 'いつも下の段', short: 'いつも下の段' },
  { value: 'count', label: '1 つなら右端、2 つなら下の段', short: '1 つなら右端' },
  { value: 'chars', label: '文字数で分ける（1 つのとき 4 文字以下なら右端）', short: '文字数で分ける' },
  { value: 'fit', label: '1 行に収まるなら右端', short: '1 行に収まるなら右端' },
];

function pick<T extends string>(choices: Choice<T>[], raw: string | null, fallback: T): T {
  return choices.find((c) => c.value === raw)?.value ?? fallback;
}

export function readLook(hash: string): Look {
  const p = new URLSearchParams(hash.replace(/^#/, ''));
  return {
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

/** 畳んだ帯の 1 行 (例「閉じる 文字／ボタン：1 行に収まるなら右端」) */
export function summaryOf(look: Look): string {
  return `閉じる ${shortOf(CLOSE_CHOICES, look.close)}／ボタン：${shortOf(PLACE_CHOICES, look.place)}`;
}
