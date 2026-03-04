/**
 * Icon Registry
 *
 * Material Symbols Outlined の SVG パスデータをキュレーションしたレジストリ。
 * ライセンス: Apache 2.0 (Google Material Design Icons)
 *
 * アイコン追加手順:
 * 1. https://fonts.google.com/icons?icon.style=Outlined で目的のアイコンを探す
 * 2. SVG をダウンロードし、<path d="..."> の d 属性値をコピー
 * 3. 下記 iconRegistry に追加（viewBox は 0 0 24 24）
 */

export type IconRenderMode = 'stroke' | 'fill';

export interface IconDefinition {
  /** アイコンの説明ラベル */
  label: string;
  /** SVG viewBox（デフォルト: "0 0 24 24"） */
  viewBox?: string;
  /** レンダリングモード: fill=Material Icons, stroke=Heroicons系 */
  mode: IconRenderMode;
  /** <path d="..."/> の d 属性値の配列 */
  paths: string[];
}

export const iconRegistry: Record<string, IconDefinition> = {
  search: {
    label: '検索',
    mode: 'fill',
    paths: [
      'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
    ],
  },
  close: {
    label: '閉じる',
    mode: 'fill',
    paths: [
      'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z',
    ],
  },
  check_circle: {
    label: '成功',
    mode: 'fill',
    paths: [
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z',
    ],
  },
  info: {
    label: '情報',
    mode: 'fill',
    paths: [
      'M11 7h2v2h-2zm0 4h2v6h-2z',
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
    ],
  },
  warning: {
    label: '警告',
    mode: 'fill',
    paths: [
      'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
    ],
  },
  error: {
    label: 'エラー',
    mode: 'fill',
    paths: [
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
    ],
  },
  chevron_left: {
    label: '前へ',
    mode: 'fill',
    paths: [
      'M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z',
    ],
  },
  chevron_right: {
    label: '次へ',
    mode: 'fill',
    paths: [
      'M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z',
    ],
  },
  first_page: {
    label: '最初のページ',
    mode: 'fill',
    paths: [
      'M18.41 16.59 13.82 12l4.59-4.59L17 6l-6 6 6 6 1.41-1.41z',
      'M6 6h2v12H6V6z',
    ],
  },
  last_page: {
    label: '最後のページ',
    mode: 'fill',
    paths: [
      'M5.59 7.41 10.18 12l-4.59 4.59L7 18l6-6-6-6-1.41 1.41zM16 6h2v12h-2V6z',
    ],
  },
  expand_more: {
    label: '展開',
    mode: 'fill',
    paths: [
      'M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z',
    ],
  },
  person: {
    label: 'ユーザー',
    mode: 'fill',
    paths: [
      'M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
    ],
  },
  image: {
    label: '画像',
    mode: 'fill',
    paths: [
      'M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86-3 3.87L9 13.14 6 17h12l-3.86-5.14z',
    ],
  },
  open_in_new: {
    label: '外部リンク',
    mode: 'fill',
    paths: [
      'M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z',
    ],
  },
  train: {
    label: '鉄道',
    mode: 'fill',
    paths: [
      'M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2l2-2h4l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-6H6V6h5v5zm2 0V6h5v5h-5zm3.5 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
    ],
  },
  swap_horiz: {
    label: '入れ替え',
    mode: 'fill',
    paths: [
      'M6.99 11 3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z',
    ],
  },
  schedule: {
    label: '時刻',
    mode: 'fill',
    paths: [
      'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z',
    ],
  },
  arrow_forward: {
    label: '次へ',
    mode: 'fill',
    paths: [
      'M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z',
    ],
  },
  home: {
    label: 'ホーム',
    mode: 'fill',
    paths: [
      'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
    ],
  },
  list_alt: {
    label: 'リスト',
    mode: 'fill',
    paths: [
      'M19 5v14H5V5h14m1.1-2H3.9c-.5 0-.9.4-.9.9v16.2c0 .4.4.9.9.9h16.2c.4 0 .9-.5.9-.9V3.9c0-.5-.5-.9-.9-.9zM11 7h6v2h-6V7zm0 4h6v2h-6v-2zm0 4h6v2h-6v-2zM7 7h2v2H7V7zm0 4h2v2H7v-2zm0 4h2v2H7v-2z',
    ],
  },
};

/** レジストリからアイコン定義を取得 */
export function getIconDef(name: string): IconDefinition | undefined {
  return iconRegistry[name];
}

/** レジストリに登録された全アイコン名を取得 */
export function getIconNames(): string[] {
  return Object.keys(iconRegistry);
}
