import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@kawachiryuya/design-system';
import { Icon } from '@kawachiryuya/design-system';
import { Typography } from '@kawachiryuya/design-system';
import { Card } from '@kawachiryuya/design-system';
import { Badge } from '@kawachiryuya/design-system';

/**
 * LandingPage — 「Rail Demo」サービスの LP
 * Week 0 ドラフト: hero + 機能紹介 + 利用シーン + CTA
 */
export const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="-mx-4 sm:-mx-6 md:-mx-8">
      {/* Hero */}
      <section className="bg-surface-secondary py-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <Badge variant="primary" appearance="soft" size="small" dot>新機能リリース中</Badge>
          <Typography variant="display" className="mt-4">
            高速鉄道予約を、<br />もっと簡単に。
          </Typography>
          <Typography variant="body-lg" color="muted" className="mt-4 max-w-2xl mx-auto">
            駅・日付・人数を選ぶだけで、最適な列車を提案。
            会員登録するとお気に入り経路の保存や、過去の予約履歴管理も可能です。
          </Typography>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Button variant="primary" size="large" onClick={() => navigate('/')}>
              さっそく検索する
            </Button>
            <Button variant="secondary" size="large" onClick={() => navigate('/signup')}>
              会員登録（無料）
            </Button>
          </div>
        </div>
      </section>

      {/* 機能紹介 */}
      <section className="py-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <Typography variant="h2" className="text-center">主な機能</Typography>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: 'search' as const, title: '簡単検索', desc: '駅と日付だけで検索開始。座席クラスも絞り込み可能' },
              { icon: 'list_alt' as const, title: '予約管理', desc: '過去・今後の予約を一覧で。詳細表示やキャンセルもワンタップ' },
              { icon: 'person' as const, title: 'プロフィール', desc: 'お気に入り駅・通常人数を保存して、次回検索を高速化' },
            ].map((f) => (
              <Card key={f.title} variant="outlined">
                <Card.Body>
                  <Icon name={f.icon} size="lg" color="primary" />
                  <Typography variant="h5" className="mt-2">{f.title}</Typography>
                  <Typography variant="body-sm" color="muted" className="mt-1">{f.desc}</Typography>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 利用シーン */}
      <section className="bg-surface-inset py-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <Typography variant="h2" className="text-center">利用シーン</Typography>
          <Typography variant="body" color="muted" className="text-center mt-2">
            ビジネスから家族旅行まで、あらゆるシーンで活用いただけます
          </Typography>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {['出張・通勤', '帰省・家族旅行', '観光・週末旅行', '法人・団体予約'].map((scene) => (
              <Card key={scene} variant="filled" padding="md">
                <Typography variant="body" weight="semibold">{scene}</Typography>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 sm:px-6 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <Typography variant="h3">今すぐ始める</Typography>
          <Typography variant="body" color="muted" className="mt-2">
            会員登録は 1 分で完了。すぐに予約検索を始められます。
          </Typography>
          <div className="mt-6 flex gap-3 justify-center">
            <Button variant="primary" size="large" onClick={() => navigate('/signup')}>
              無料で始める
            </Button>
            <Link to="/help" className="text-onSurface-primary text-sm self-center">
              詳しい使い方を見る →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
