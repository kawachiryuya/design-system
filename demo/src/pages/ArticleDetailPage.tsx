import { Link, useParams } from 'react-router-dom';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Badge } from '@ds/composites/Badge/Badge';
import { Card } from '@ds/composites/Card/Card';
import { Icon } from '@ds/primitives/Icon';
import { Button } from '@ds/primitives/Button/Button';

export const ArticleDetailPage = () => {
  const { id } = useParams();

  return (
    <article className="max-w-3xl mx-auto py-8">
      {/* breadcrumb-like nav */}
      <Link to="/articles" className="inline-flex items-center gap-1 text-sm text-onSurface-muted mb-4 hover:text-onSurface">
        <Icon name="arrow_back" size="sm" color="inherit" />
        記事一覧に戻る
      </Link>

      {/* header */}
      <div className="mb-6">
        <Badge variant="primary" appearance="soft" size="small">観光</Badge>
        <Typography variant="h1" as="h1" className="mt-3">
          京都 春の桜名所 5 選 (記事 #{id})
        </Typography>
        <div className="mt-3 flex items-center gap-3 text-sm text-onSurface-muted">
          <span>2026-04-10</span>
          <span>・</span>
          <span className="flex items-center gap-1">
            <Icon name="schedule" size="sm" color="inherit" />
            5 分で読める
          </span>
          <span>・</span>
          <span className="flex items-center gap-1">
            <Icon name="visibility" size="sm" color="inherit" />
            1,234 views
          </span>
        </div>
      </div>

      {/* hero image */}
      <div className="aspect-video bg-surface-skeleton rounded-md mb-6" />

      {/* body */}
      <div className="space-y-4">
        <Typography variant="body-lg">
          春の京都は一年で最も美しい季節と言われています。この記事では、新幹線でアクセスしやすい桜の名所を 5 つ厳選してご紹介します。
        </Typography>

        <Typography variant="h3" as="h2" className="mt-8">1. 円山公園</Typography>
        <Typography variant="body">
          京都を代表する桜の名所。シダレザクラの「祇園しだれ」が有名で、夜間ライトアップも実施されます。
          京都駅から地下鉄烏丸線で 10 分とアクセス良好。
        </Typography>

        <Typography variant="h3" as="h2" className="mt-8">2. 哲学の道</Typography>
        <Typography variant="body">
          約 2km の散策路に約 500 本の桜が並ぶ。銀閣寺〜南禅寺をつなぐ静かな小径で、
          地元の方々に長年愛されてきた花見スポット。
        </Typography>

        <Typography variant="h3" as="h2" className="mt-8">3. 清水寺</Typography>
        <Typography variant="body">
          世界遺産にも登録される名刹。境内全体が桜に包まれ、本堂からの眺めは絶景。
          夜間特別拝観も春の恒例行事。
        </Typography>

        {/* CTA */}
        <Card variant="filled" padding="lg" className="mt-12">
          <div className="text-center">
            <Typography variant="h5">京都への新幹線予約は今すぐ</Typography>
            <Typography variant="body-sm" color="muted" className="mt-1">
              桜シーズンは混雑が予想されます。早めの予約をおすすめします。
            </Typography>
            <div className="mt-4">
              <Link to="/">
                <Button variant="primary">列車を検索する</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </article>
  );
};
