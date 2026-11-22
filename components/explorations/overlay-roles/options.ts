/**
 * 検討 (Issue #157): 重なる部品の役割と出方 — 切り替えの値と、URL の hash への出し入れ。
 *
 * このファイルは検討用で、main には入れない前提 (出荷物でも規約の対象でもない)。
 * 使う側が選ぶのは「役割」で、出方は部品が幅から決める、という前提で、
 * 狭い幅 (640px 未満) での出方を役割ごとに切り替えて比べる。
 */

/** 役割 */
export type Role = 'confirm' | 'choose' | 'info' | 'task';

/** 出方 */
export type Form = 'center' | 'anchor' | 'sheet' | 'full';

export interface Settings {
  confirm: Form;
  choose: Form;
  info: Form;
  task: Form;
  /** 下から出る形の上端の短い横棒 (見た目だけ) */
  handle: boolean;
}

export const FORM_LABEL: Record<Form, string> = {
  center: '中央のカード',
  anchor: '押した要素の近く',
  sheet: '下から',
  full: '画面いっぱい',
};

export const ROLE_LABEL: Record<Role, string> = {
  confirm: '確認',
  choose: '選ぶ',
  info: '補足',
  task: '作業',
};

/** 役割ごとの説明 (切り替えの中に出す) */
export const ROLE_NOTE: Record<Role, string> = {
  confirm: '先に進む前に答えさせる。背景を止める。例「予約をキャンセル」',
  choose: '押した要素に属する選択肢・操作から 1 つ。選んだら閉じる。例「並び順」「予約を変更」',
  info: '押した要素についての説明や軽い操作。読み流せる。例「自由席について」',
  task: '画面を離れずに済ませる、ひとまとまりの入力。確定と取り消しがある。例「絞り込み」',
};

/** 狭い幅で選べる値。先頭が「今の形」で初期値 */
export const CHOICES: Record<Role, Form[]> = {
  confirm: ['center', 'sheet'],
  choose: ['center', 'anchor', 'sheet'],
  info: ['anchor', 'sheet'],
  task: ['center', 'sheet', 'full'],
};

export const ROLES: Role[] = ['confirm', 'choose', 'info', 'task'];

/** 広い幅 (640px 以上) では切り替えによらず固定 */
export const WIDE: Record<Role, Form> = {
  confirm: 'center',
  choose: 'anchor',
  info: 'anchor',
  task: 'center',
};

export const DEFAULTS: Settings = {
  confirm: CHOICES.confirm[0],
  choose: CHOICES.choose[0],
  info: CHOICES.info[0],
  task: CHOICES.task[0],
  handle: false,
};

/** 狭い幅と広い幅の境目 (Tailwind の sm と同じ) */
export const WIDE_QUERY = '(min-width: 640px)';

/** hash (例 `#confirm=sheet&choose=anchor&info=sheet&task=full&handle=1`) から読む。知らない値は初期値に戻す */
export function parseHash(hash: string): Settings {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const next: Settings = { ...DEFAULTS };
  for (const role of ROLES) {
    const v = params.get(role) as Form | null;
    if (v && CHOICES[role].includes(v)) next[role] = v;
  }
  next.handle = params.get('handle') === '1';
  return next;
}

/** hash に書く。初期値と同じものも書く (リンクを見ただけで状態が分かるように) */
export function toHash(s: Settings): string {
  const params = new URLSearchParams();
  for (const role of ROLES) params.set(role, s[role]);
  params.set('handle', s.handle ? '1' : '0');
  return `#${params.toString()}`;
}

/** 帯に出す短い呼び名 (スマホの 1 行に収めるため) */
export const FORM_SHORT: Record<Form, string> = {
  center: '中央',
  anchor: '近く',
  sheet: '下から',
  full: '全画面',
};

/** 帯に出す短い表示 (例「確認:中央 選ぶ:近く 補足:近く 作業:下から」) */
export function summary(s: Settings): string {
  return ROLES.map((r) => `${ROLE_LABEL[r]}:${FORM_SHORT[s[r]]}`).join(' ') + (s.handle ? ' つまみ' : '');
}
