/**
 * 画像アセットのパス定義
 *
 * 画像は public/images/ に配置し、ここでパスを管理する。
 * 空文字の間は Placeholder が表示される。
 * 画像を配置したら対応するパスを設定する。
 *
 * 例: logo: '/site/images/logo.png',
 *
 * ※ パスの先頭は vite.config.ts の base（'/site/'）に合わせること
 */

const BASE = '/site/';

export const assets = {
  /** ロゴ画像（ヘッダー・About・TrialCTA・Desktop で共通使用） */
  logo: '',

  /** 利用の流れ ステップイラスト（3枚） */
  usageSteps: ['', '', ''] as string[],

  /** 応募の流れ ステップイラスト（4枚） */
  applicationSteps: ['', '', '', ''] as string[],

  /** 注意事項イラスト（4枚） */
  cautionIllustrations: ['', '', '', ''] as string[],

  /** favicon */
  favicon: '',
} as const;

/** public/images/ のパスを生成するヘルパー */
export function img(filename: string): string {
  return `${BASE}images/${filename}`;
}

/**
 * 外部リンク URL の定義
 *
 * 空文字の間はリンクが無効化される（Button のみ表示）。
 * URL を設定すると自動で <a> タグでラップされる。
 */
export const urls = {
  /** 申し込みフォーム（HeroSection, TrialCtaSection, CtaBand で共通） */
  apply: '',

  /** 利用の流れセクションのボタン */
  usageFlow: '',

  /** リンクセクションのボタン（各リンク個別） */
  links: ['', '', ''] as string[],
};
