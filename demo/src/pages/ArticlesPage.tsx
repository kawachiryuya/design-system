import { Link } from 'react-router-dom';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Card } from '@ds/composites/Card/Card';
import { Badge } from '@ds/composites/Badge/Badge';
import { Icon } from '@ds/primitives/Icon';

const ARTICLES = [
  { id: '1', title: '京都 春の桜名所 5 選', excerpt: '春の京都を満喫する観光ルート。新幹線でのアクセスも詳しく紹介。', category: '観光', date: '2026-04-10', readTime: '5 分' },
  { id: '2', title: '出張時に知っておきたい 領収書の発行手順', excerpt: 'マイページから簡単に領収書を発行する方法を解説。', category: '使い方', date: '2026-04-05', readTime: '3 分' },
  { id: '3', title: '【特集】 GW のおすすめ旅行先トップ 10', excerpt: '混雑を避けつつ楽しめる、編集部おすすめの旅行先を紹介。', category: '観光', date: '2026-03-28', readTime: '8 分' },
  { id: '4', title: '会員特典まとめ — マイル・割引・優待', excerpt: '会員になると受けられる特典を一覧でご紹介。', category: '会員', date: '2026-03-20', readTime: '4 分' },
  { id: '5', title: '初めての新幹線予約 完全ガイド', excerpt: '駅・列車・座席の選び方から決済までを丁寧に解説。', category: '使い方', date: '2026-03-15', readTime: '10 分' },
];

const CATEGORIES = ['すべて', '観光', '使い方', '会員', 'お知らせ'];

export const ArticlesPage = () => {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <Typography variant="h2" as="h1">記事一覧</Typography>
      <Typography variant="body" color="muted" className="mt-2 mb-6">
        旅のヒント、サービスの使い方、お得情報をお届けします
      </Typography>

      {/* カテゴリ */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat}
            type="button"
            className={[
              'px-4 py-1.5 rounded-xs text-sm font-medium transition-colors',
              i === 0
                ? 'bg-surface-primary text-onSurface-inverse'
                : 'bg-surface border border-border-muted text-onSurface hover:border-border-strong',
            ].join(' ')}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 記事グリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ARTICLES.map((article) => (
          <Link key={article.id} to={`/articles/${article.id}`}>
            <Card variant="outlined" clickable>
              <div className="aspect-video bg-surface-skeleton" />
              <Card.Body>
                <Badge variant="primary" appearance="soft" size="small">{article.category}</Badge>
                <Typography variant="h5" className="mt-2">{article.title}</Typography>
                <Typography variant="body-sm" color="muted" className="mt-1 line-clamp-2">
                  {article.excerpt}
                </Typography>
                <div className="mt-3 flex items-center gap-3 text-xs text-onSurface-muted">
                  <span>{article.date}</span>
                  <span className="flex items-center gap-1">
                    <Icon name="schedule" size="sm" color="inherit" />
                    {article.readTime}
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
