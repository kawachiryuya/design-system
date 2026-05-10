import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@ds/primitives/Button/Button';
import { Input } from '@ds/primitives/Input/Input';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Checkbox } from '@ds/composites/Checkbox/Checkbox';

export const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    // mock
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <Typography variant="h2" as="h1" className="text-center">会員登録</Typography>
      <Typography variant="body" color="muted" className="text-center mt-2">
        1 分で完了します。すぐに予約検索を始められます。
      </Typography>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input
          label="お名前"
          placeholder="山田 太郎"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
        />
        <Input
          label="メールアドレス"
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          helpText="ログイン時のID として使用します"
        />
        <Input
          label="パスワード"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          helpText="8 文字以上、英数字を含めてください"
        />
        <Checkbox
          label="利用規約とプライバシーポリシーに同意する"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <Button variant="primary" size="medium" fullWidth disabled={!agreed}>
          会員登録する
        </Button>
      </form>

      <Typography variant="body-sm" color="muted" className="text-center mt-6">
        すでにアカウントをお持ちの方は <Link to="/login" className="text-onSurface-primary">ログイン</Link>
      </Typography>
    </div>
  );
};
