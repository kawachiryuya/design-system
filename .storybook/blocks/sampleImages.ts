/// <reference types="vite/client" />
/**
 * Storybook (story / guideline) 用のサンプル画像。
 *
 * 外部の画像サービス (unsplash / pravatar) を読むと、視覚回帰の結果が外部の都合で揺れるため、
 * 自作の SVG を同梱して使う (#125 F-1)。人物写真は使わず、Avatar 等の顔の位置には人型のシルエットを置く。
 * 実体は `.storybook/samples/*.svg`。Vite の asset import なので、差し替えると依存する story が撮り直される。
 */
import landscape from '../samples/landscape.svg';
import avatar1 from '../samples/avatar-1.svg';
import avatar2 from '../samples/avatar-2.svg';
import avatar3 from '../samples/avatar-3.svg';

/** 横長 (16:9、1600×900) の風景。雪を頂いた山並み */
export const SAMPLE_LANDSCAPE: string = landscape;

/** 正方形 (300×300) の人型シルエット。背景色違いで 3 種 */
export const SAMPLE_AVATARS: readonly [string, string, string] = [avatar1, avatar2, avatar3];
