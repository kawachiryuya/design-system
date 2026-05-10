import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@ds/primitives/Button/Button';
import { Input } from '@ds/primitives/Input/Input';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Checkbox } from '@ds/composites/Checkbox/Checkbox';
import { Divider } from '@ds/primitives/Divider/Divider';
import { Icon } from '@ds/primitives/Icon';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // mock
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <Typography variant="h2" as="h1" className="text-center">ログイン</Typography>
      <Typography variant="body" color="muted" className="text-center mt-2">
        会員アカウントでログインしてください
      </Typography>

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
        <Input
          label="パスワード"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
        />
        <div className="flex items-center justify-between">
          <Checkbox
            label="ログイン状態を保持する"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <Link to="/reset-password" className="text-sm text-onSurface-primary">
            パスワード忘れた？
          </Link>
        </div>
        <Button variant="primary" size="medium" fullWidth>
          ログイン
        </Button>
      </form>

      <Divider label="または" className="my-6" />

      <div className="space-y-2">
        <Button variant="secondary" fullWidth icon={<Icon name="g_translate" size="sm" />}>
          Google でログイン
        </Button>
      </div>

      <Typography variant="body-sm" color="muted" className="text-center mt-6">
        アカウントをお持ちでない方は <Link to="/signup" className="text-onSurface-primary">会員登録</Link>
      </Typography>
    </div>
  );
};
