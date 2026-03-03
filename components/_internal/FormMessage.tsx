import React from 'react';

/**
 * FormMessage — 内部ユーティリティ
 *
 * フォームコンポーネント共通の helpText / errorMessage 描画を統一する。
 * 外部に公開しない（各コンポーネント内部で使用）。
 */
export interface FormMessageProps {
  /** ヘルプテキスト（error=false 時のみ表示） */
  helpText?: string;
  /** helpText 要素の id（aria-describedby 用） */
  helpId?: string;
  /** エラー状態 */
  error?: boolean;
  /** エラーメッセージ（error=true 時のみ表示） */
  errorMessage?: string;
  /** errorMessage 要素の id（aria-describedby 用） */
  errorId?: string;
}

export const FormMessage: React.FC<FormMessageProps> = ({
  helpText,
  helpId,
  error,
  errorMessage,
  errorId,
}) => (
  <>
    {error && errorMessage && (
      <p id={errorId} className="text-sm text-onSurface-error" role="alert">
        {errorMessage}
      </p>
    )}
    {!error && helpText && (
      <p id={helpId} className="text-sm text-onSurface-muted">
        {helpText}
      </p>
    )}
  </>
);
