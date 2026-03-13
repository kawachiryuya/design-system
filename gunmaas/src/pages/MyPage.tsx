import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon/Icon';
import { Card } from '@ds/composites/Card/Card';
import { Badge } from '@ds/composites/Badge/Badge';
import { Switch } from '@ds/composites/Switch/Switch';
import { Divider } from '@ds/primitives/Divider/Divider';
import { ProgressBar } from '@ds/composites/ProgressBar/ProgressBar';
import { FadeIn } from '../components/FadeIn';
import { useTicketStore } from '../store/ticketStore';

export const MyPage = () => {
  const navigate = useNavigate();
  const { tickets, userProfile } = useTicketStore();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [discountAuto, setDiscountAuto] = useState(true);

  const recentTickets = tickets.slice(0, 3);
  const setupComplete = userProfile.step >= 3;

  return (
    <div>
      {/* Hero */}
      <div
        className="px-4 pt-5 pb-6 text-white"
        style={{ background: 'linear-gradient(160deg, #1B4332, #2D6A4F)' }}
      >
        <Typography variant="h3" as="div" color="inherit" className="mt-1">
          マイページ
        </Typography>
      </div>

      {/* Onboarding guide banner */}
      {!setupComplete && (
        <div className="px-4 pt-5">
          <FadeIn>
            <Card variant="outlined" clickable onClick={() => navigate('/start')}>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center flex-shrink-0">
                    <Icon name="arrow_forward" size="sm" color="primary" />
                  </div>
                  <div className="flex-1">
                    <Typography variant="body-sm" as="div" weight="bold">
                      はじめ方ガイド
                    </Typography>
                    <Typography variant="caption" color="muted" as="div">
                      {userProfile.step === 0
                        ? '3ステップで全機能を使えるようになります'
                        : `ステップ ${userProfile.step} / 3 完了`}
                    </Typography>
                  </div>
                </div>
                <ProgressBar value={userProfile.step} max={3} size="sm" />
              </div>
            </Card>
          </FadeIn>
        </div>
      )}

      {/* Profile */}
      <div className="px-4 pt-5">
        <FadeIn delay={setupComplete ? 0 : 50}>
          <Card variant="outlined">
            <div className="p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-surface-secondary flex items-center justify-center flex-shrink-0">
                <Typography variant="h3" as="span" color="primary">
                  田
                </Typography>
              </div>
              <div className="flex-1">
                <Typography variant="body-sm" as="div" weight="bold">
                  田中 太郎
                </Typography>
                <Typography variant="caption" color="muted" as="div" className="mt-1">
                  {userProfile.step >= 2 && userProfile.email ? userProfile.email : 'tanaka@example.com'}
                </Typography>
                <div className="flex items-center gap-2 mt-2">
                  {userProfile.step >= 2 ? (
                    <Badge variant="success" dot size="small">
                      プレミアム会員
                    </Badge>
                  ) : (
                    <Badge variant="neutral" size="small">
                      未登録
                    </Badge>
                  )}
                  {userProfile.step >= 3 ? (
                    <Badge variant="primary" size="small">
                      マイナンバー連携済
                    </Badge>
                  ) : (
                    <Badge variant="neutral" size="small">
                      マイナンバー未連携
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </FadeIn>
      </div>

      {/* Discount conditions */}
      <div className="px-4 pt-5">
        <FadeIn delay={100}>
          <Typography variant="body-sm" as="div" weight="bold" className="mb-3">
            割引条件
          </Typography>
          {userProfile.step < 2 ? (
            <Card variant="outlined" clickable onClick={() => navigate('/start')}>
              <div className="p-4 flex items-center gap-3">
                <Icon name="info" size="sm" color="disabled" />
                <div>
                  <Typography variant="body-sm" as="div" color="muted">
                    アカウント登録で割引条件を確認
                  </Typography>
                  <Typography variant="caption" color="subtle" as="div">
                    はじめ方ガイドから登録できます
                  </Typography>
                </div>
              </div>
            </Card>
          ) : (
            <Card variant="outlined">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  {userProfile.step >= 3 && userProfile.city === '中央市' ? (
                    <Icon name="check_circle" size="sm" color="primary" />
                  ) : (
                    <Icon name="info" size="sm" color="disabled" />
                  )}
                  <div>
                    <Typography variant="body-sm" as="div" weight={userProfile.step >= 3 && userProfile.city === '中央市' ? 'bold' : 'normal'}>
                      中央市民割引
                    </Typography>
                    <Typography variant="caption" color="muted" as="div">
                      {userProfile.step >= 3 && userProfile.city === '中央市'
                        ? '✅ 適用済み — 中心市街地乗り放題券 ¥500 → ¥360'
                        : userProfile.city === '中央市'
                          ? 'マイナンバー連携で自動適用されます'
                          : '対象外（中央市民の方が対象）'}
                    </Typography>
                  </div>
                </div>
                <Divider />
                <div className="flex items-center gap-3 mt-3">
                  <Icon name="info" size="sm" color="disabled" />
                  <div>
                    <Typography variant="body-sm" as="div" color="muted">
                      65歳以上の割引
                    </Typography>
                    <Typography variant="caption" color="subtle" as="div">
                      条件を満たしていません
                    </Typography>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </FadeIn>
      </div>

      {/* Recent tickets */}
      <div className="px-4 pt-5">
        <FadeIn delay={200}>
          <div className="flex justify-between items-baseline mb-3">
            <Typography variant="body-sm" as="div" weight="bold">
              最近のチケット
            </Typography>
            <Typography
              variant="caption"
              color="primary"
              as="span"
              weight="semibold"
              className="cursor-pointer"
              onClick={() => navigate('/my-tickets')}
            >
              すべて見る →
            </Typography>
          </div>
          {recentTickets.length === 0 ? (
            <div className="text-center py-6">
              <Icon name="confirmation_number" size="lg" color="disabled" />
              <Typography variant="caption" color="muted" as="div" className="mt-2">
                まだチケットがありません
              </Typography>
            </div>
          ) : (
            recentTickets.map((t) => (
              <Card
                key={t.id}
                variant="outlined"
                clickable
                onClick={() => navigate('/my-tickets')}
                className="mb-2"
              >
                <div className="p-3 flex justify-between items-center">
                  <div className="min-w-0 flex-1">
                    <Typography variant="body-sm" as="div" weight="bold">
                      {t.name}
                    </Typography>
                    <Typography variant="caption" color="muted" as="div">
                      {t.destName} · {t.purchasedAt}
                    </Typography>
                  </div>
                  <Badge
                    variant={t.status === 'active' ? 'success' : t.status === 'expired' ? 'error' : 'neutral'}
                    size="small"
                  >
                    {t.status === 'active' ? '有効' : t.status === 'used' ? '使用済み' : '期限切れ'}
                  </Badge>
                </div>
              </Card>
            ))
          )}
        </FadeIn>
      </div>

      {/* Settings */}
      <div className="px-4 pt-5 pb-10">
        <FadeIn delay={300}>
          <Typography variant="body-sm" as="div" weight="bold" className="mb-3">
            設定
          </Typography>
          <Card variant="outlined">
            <div className="p-4 flex flex-col gap-4">
              <Switch
                label="プッシュ通知"
                description="チケットの有効期限や運行情報をお知らせ"
                checked={pushEnabled}
                onChange={setPushEnabled}
                size="small"
              />
              <Divider />
              <Switch
                label="割引の自動適用"
                description="条件を満たす場合、割引価格を自動表示"
                checked={discountAuto}
                onChange={setDiscountAuto}
                size="small"
              />
            </div>
          </Card>

          <div className="mt-4 flex flex-col gap-2">
            <Button variant="secondary" fullWidth size="small">
              ヘルプ・FAQ
            </Button>
            <Button variant="tertiary" fullWidth size="small" className="text-onSurface-error">
              ログアウト
            </Button>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};
