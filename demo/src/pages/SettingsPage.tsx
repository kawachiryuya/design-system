import { useState } from 'react';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Input } from '@ds/primitives/Input/Input';
import { Button } from '@ds/primitives/Button/Button';
import { Tabs } from '@ds/composites/Tabs/Tabs';
import { Switch } from '@ds/composites/Switch/Switch';
import { Card } from '@ds/composites/Card/Card';
import { Divider } from '@ds/primitives/Divider/Divider';

export const SettingsPage = () => {
  const [name, setName] = useState('山田 太郎');
  const [email, setEmail] = useState('taro@example.com');
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [smsNotif, setSmsNotif] = useState(false);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Typography variant="h2" as="h1">設定</Typography>
      <Typography variant="body" color="muted" className="mt-2 mb-6">
        アカウント情報、通知、セキュリティの管理
      </Typography>

      <Tabs
        defaultActiveId="profile"
        tabs={[
          {
            id: 'profile',
            label: 'プロフィール',
            content: (
              <Card variant="outlined" padding="lg">
                <div className="space-y-4">
                  <Typography variant="h5">基本情報</Typography>
                  <Input
                    label="お名前"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                  />
                  <Input
                    label="メールアドレス"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    helpText="変更時は確認メールが送信されます"
                  />
                  <Button variant="primary">保存する</Button>
                </div>
              </Card>
            ),
          },
          {
            id: 'notifications',
            label: '通知',
            content: (
              <Card variant="outlined" padding="lg">
                <div className="space-y-4">
                  <Typography variant="h5">通知設定</Typography>
                  <Typography variant="body-sm" color="muted">
                    予約確認・出発時刻リマインダー等の通知方法を選択
                  </Typography>
                  <Divider />
                  <Switch
                    label="メール通知"
                    description="予約確認、出発前リマインダー等"
                    checked={emailNotif}
                    onChange={setEmailNotif}
                  />
                  <Switch
                    label="プッシュ通知"
                    description="モバイルアプリでのプッシュ通知"
                    checked={pushNotif}
                    onChange={setPushNotif}
                  />
                  <Switch
                    label="SMS 通知"
                    description="緊急時のみ送信されます"
                    checked={smsNotif}
                    onChange={setSmsNotif}
                  />
                </div>
              </Card>
            ),
          },
          {
            id: 'security',
            label: 'セキュリティ',
            content: (
              <Card variant="outlined" padding="lg">
                <div className="space-y-4">
                  <Typography variant="h5">パスワード</Typography>
                  <Typography variant="body-sm" color="muted">
                    最終変更: 2024-12-15
                  </Typography>
                  <Button variant="secondary">パスワードを変更する</Button>
                  <Divider />
                  <Typography variant="h5">2 段階認証</Typography>
                  <Typography variant="body-sm" color="muted">
                    SMS または認証アプリで追加のセキュリティを設定
                  </Typography>
                  <Button variant="secondary">2 段階認証を有効にする</Button>
                </div>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
};
