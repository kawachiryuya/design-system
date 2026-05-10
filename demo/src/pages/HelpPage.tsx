import { Link } from 'react-router-dom';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Card } from '@ds/composites/Card/Card';
import { Icon } from '@ds/primitives/Icon';

export const HelpPage = () => {
  const categories = [
    { icon: 'search' as const, title: '予約・検索', count: 12, href: '/faq' },
    { icon: 'credit_card' as const, title: '支払い・キャンセル', count: 8, href: '/faq' },
    { icon: 'person' as const, title: 'アカウント・会員情報', count: 6, href: '/faq' },
    { icon: 'help' as const, title: 'その他', count: 4, href: '/faq' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Typography variant="h2" as="h1">ヘルプセンター</Typography>
      <Typography variant="body" color="muted" className="mt-2">
        ご利用ガイド、よくある質問、お問い合わせはこちらから
      </Typography>

      {/* カテゴリ */}
      <Typography variant="h4" className="mt-8 mb-3">カテゴリから探す</Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {categories.map((c) => (
          <Link key={c.title} to={c.href}>
            <Card variant="outlined" clickable>
              <Card.Body>
                <div className="flex items-start gap-3">
                  <Icon name={c.icon} size="lg" color="primary" />
                  <div className="flex-1">
                    <Typography variant="body" weight="semibold">{c.title}</Typography>
                    <Typography variant="caption" color="muted">{c.count} 件の質問</Typography>
                  </div>
                  <Icon name="chevron_right" size="sm" color="inherit" />
                </div>
              </Card.Body>
            </Card>
          </Link>
        ))}
      </div>

      {/* お問い合わせ */}
      <Typography variant="h4" className="mt-12 mb-3">解決しない場合</Typography>
      <Card variant="filled" padding="lg">
        <div className="text-center">
          <Typography variant="body">お問い合わせフォームから直接ご連絡ください</Typography>
          <Typography variant="body-sm" color="muted" className="mt-1">
            通常 1〜2 営業日以内にご返信いたします
          </Typography>
          <div className="mt-4">
            <Link to="/contact" className="text-onSurface-primary text-sm">
              お問い合わせフォームへ →
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};
