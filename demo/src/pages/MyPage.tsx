import { Link } from 'react-router-dom';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Card } from '@ds/composites/Card/Card';
import { Badge } from '@ds/composites/Badge/Badge';
import { Icon } from '@ds/primitives/Icon';

export const MyPage = () => {
  // mock data
  const user = { name: '山田 太郎', email: 'taro@example.com', memberSince: '2024-01-15' };
  const stats = [
    { label: '今後の予約', value: '3', icon: 'calendar_today' as const },
    { label: '過去の予約', value: '47', icon: 'history' as const },
    { label: 'お気に入り経路', value: '5', icon: 'favorite' as const },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Profile header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-surface-primary flex items-center justify-center text-onSurface-inverse text-2xl font-semibold">
          {user.name.charAt(0)}
        </div>
        <div className="flex-1">
          <Typography variant="h3" as="h1">{user.name}</Typography>
          <Typography variant="body-sm" color="muted">{user.email}</Typography>
          <Typography variant="caption" color="subtle" className="mt-1 block">
            {user.memberSince} から利用中
          </Typography>
        </div>
        <Link to="/settings" className="text-sm text-onSurface-primary self-center">
          設定 →
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label} variant="outlined">
            <Card.Body>
              <div className="flex items-center gap-3">
                <Icon name={s.icon} size="lg" color="primary" />
                <div>
                  <Typography variant="caption" color="muted">{s.label}</Typography>
                  <Typography variant="h4">{s.value}</Typography>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <Typography variant="h4" className="mb-3">クイックアクション</Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card variant="outlined" clickable>
          <Card.Body>
            <div className="flex items-start gap-3">
              <Icon name="search" size="md" color="primary" />
              <div className="flex-1">
                <Typography variant="body" weight="semibold">列車を検索</Typography>
                <Typography variant="body-sm" color="muted">新しい予約を始める</Typography>
              </div>
              <Icon name="chevron_right" size="sm" color="inherit" />
            </div>
          </Card.Body>
        </Card>
        <Card variant="outlined" clickable>
          <Card.Body>
            <div className="flex items-start gap-3">
              <Icon name="list_alt" size="md" color="primary" />
              <div className="flex-1">
                <Typography variant="body" weight="semibold">予約一覧</Typography>
                <Typography variant="body-sm" color="muted">予約状況の確認・変更</Typography>
              </div>
              <Badge variant="info" appearance="soft" size="small">3</Badge>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};
