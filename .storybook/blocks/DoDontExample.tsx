import React from 'react';
import { SBDOCS_CLASS } from './classNames';

/**
 * DoDontExample — Storybook Guideline 用の DO / DON'T 視覚対比ブロック
 *
 * `.guideline.mdx` の「利用ガイド」セクションで、重要な NG パターンを視覚的に伝えるために使う。
 * 表 (NG パターン一覧) では伝わりづらい "見え方の問題" をピックアップで補強する補助 UI。
 *
 * @example
 *   <DoDontExample
 *     label="VARIANT の使い分け"
 *     doExample={<><Button>保存する</Button><Button variant="secondary">キャンセル</Button></>}
 *     doCaption="Primary は1画面につき1つのメインアクションに使う"
 *     dontExample={<><Button>保存する</Button><Button>削除する</Button></>}
 *     dontCaption="同じ画面に Primary を複数並べると優先度が伝わらない"
 *   />
 */
export interface DoDontExampleProps {
  /** 上部の小見出し (例: "VARIANT の使い分け")。省略可。 */
  label?: string;
  /** DO 側のサンプル UI。 */
  doExample: React.ReactNode;
  /** DO 側の説明文。 */
  doCaption: React.ReactNode;
  /** DON'T 側のサンプル UI。 */
  dontExample: React.ReactNode;
  /** DON'T 側の説明文。 */
  dontCaption: React.ReactNode;
}

export const DoDontExample: React.FC<DoDontExampleProps> = ({
  label,
  doExample,
  doCaption,
  dontExample,
  dontCaption,
}) => (
  <div className={`${SBDOCS_CLASS.doDontExample} my-10`}>
    {label && (
      <div className={`${SBDOCS_CLASS.doDontExampleLabel} text-xs font-semibold tracking-wider uppercase mb-4`}>
        {label}
      </div>
    )}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <DoDontPane variant="do" example={doExample} caption={doCaption} />
      <DoDontPane variant="dont" example={dontExample} caption={dontCaption} />
    </div>
  </div>
);

const DoDontPane: React.FC<{
  variant: 'do' | 'dont';
  example: React.ReactNode;
  caption: React.ReactNode;
}> = ({ variant, example, caption }) => {
  const isDo = variant === 'do';
  const barColor = isDo ? 'bg-success-500' : 'bg-error-500';
  const labelColor = isDo ? 'text-success-700' : 'text-error-700';
  const labelText = isDo ? 'DO' : "DON'T";

  return (
    <div className="flex flex-col">
      <div className={`h-1 rounded-t ${barColor}`} />
      {/*
        sb-unstyled: Storybook docs theme の内部クラス (.css-xxxx)が
        全 span に font-size 等を上書きするのを escape するための公式 hatch。
        これがないと example 内の <span> に当てた Tailwind class が
        emotion 生成 CSS に specificity で負ける。
      */}
      <div className="sb-unstyled border border-t-0 border-border-muted rounded-b p-6 flex flex-wrap items-center justify-center gap-3 min-h-[110px] bg-surface">
        {example}
      </div>
      {/*
        SBDOCS_CLASS.doDontCaption は .storybook/tailwind.css で 14px と上余白を明示。
        Storybook の sbdocs 標準テキスト (16px) との specificity 競合を専用クラスで解決。
        Flexbox + gap-2 で DO/DON'T ラベルと caption の間に 8px の余白。
      */}
      <div className={`${SBDOCS_CLASS.doDontCaption} flex items-baseline gap-2 mt-2 text-onSurface`}>
        <span className={`font-bold flex-shrink-0 ${labelColor}`}>{labelText}</span>
        <span>{caption}</span>
      </div>
    </div>
  );
};
