import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@ds/primitives/Button/Button';
import { Input } from '@ds/primitives/Input/Input';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Alert } from '@ds/composites/Alert/Alert';

export const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <Typography variant="h2" as="h1" className="text-center">パスワード再設定</Typography>
      <Typography variant="body" color="muted" className="text-center mt-2">
        登録時のメールアドレスを入力してください。<br />
        パスワード再設定リンクをお送りします。
      </Typography>

      {sent ? (
        <div className="mt-8">
          <Alert variant="success" title="送信しました">
            {email} にメールを送信しました。受信トレイをご確認ください。
            10 分以内に届かない場合は迷惑メールフォルダもチェックしてください。
          </Alert>
          <Link to="/login" className="block mt-4 text-center text-onSurface-primary text-sm">
            ← ログイン画面に戻る
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Input
            label="メールアドレス"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <Button variant="primary" size="medium" fullWidth>
            再設定リンクを送信
          </Button>
          <div className="text-center">
            <Link to="/login" className="text-sm text-onSurface-primary">
              ← ログイン画面に戻る
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};
