import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon/Icon';
import { Input } from '@ds/primitives/Input/Input';
import { Select } from '@ds/composites/Select/Select';
import { Checkbox } from '@ds/composites/Checkbox/Checkbox';
import { ProgressBar } from '@ds/composites/ProgressBar/ProgressBar';
import { Card } from '@ds/composites/Card/Card';
import { Divider } from '@ds/primitives/Divider/Divider';
import { useTicketStore } from '../store/ticketStore';
import { FadeIn } from '../components/FadeIn';

type Step = 1 | 2 | 3 | 4; // 4 = 完了

export const StartPage = () => {
  const navigate = useNavigate();
  const { userProfile, updateProfile } = useTicketStore();

  // 既にステップが進んでいる場合、そこから開始
  const initialStep = userProfile.step >= 2 ? 3 : userProfile.step >= 1 ? 2 : 1;
  const [currentStep, setCurrentStep] = useState<Step>(initialStep as Step);
  const [city, setCity] = useState(userProfile.city);
  const [email, setEmail] = useState(userProfile.email);
  const [agreed, setAgreed] = useState(false);

  return (
    <div>
      {/* Hero */}
      <div
        className="px-4 pt-5 pb-6 text-white"
        style={{ background: 'linear-gradient(160deg, #1B4332, #2D6A4F)' }}
      >
        <Button
          variant="tertiary"
          size="small"
          icon={<Icon name="arrow_back" size="sm" color="inherit" />}
          onClick={() => navigate('/mypage')}
          className="!text-white !bg-white/15 backdrop-blur-sm"
        >
          戻る
        </Button>
        <Typography variant="h3" as="div" color="inherit" className="mt-3">
          はじめ方ガイド
        </Typography>
        <Typography variant="body-sm" color="inherit" as="div" className="opacity-75 mt-1">
          3ステップで、すべての機能を使えるようになります
        </Typography>
      </div>

      {/* Progress */}
      <div className="px-4 pt-5">
        <ProgressBar
          value={currentStep >= 4 ? 3 : currentStep}
          max={3}
          label={currentStep >= 4 ? '完了' : `ステップ ${currentStep} / 3`}
          color={currentStep >= 4 ? 'success' : 'primary'}
        />
      </div>

      {/* Steps */}
      <div className="px-4 pt-5 pb-10">
        {currentStep === 1 && (
          <WelcomeStep onNext={() => { updateProfile({ step: 1 }); setCurrentStep(2); }} />
        )}
        {currentStep === 2 && (
          <RegisterStep
            city={city}
            setCity={setCity}
            email={email}
            setEmail={setEmail}
            onSubmit={() => { updateProfile({ step: 2, city, email }); setCurrentStep(3); }}
            onBack={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 3 && (
          <MyNumberStep
            agreed={agreed}
            setAgreed={setAgreed}
            onSubmit={() => { updateProfile({ step: 3 }); setCurrentStep(4); }}
            onBack={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 4 && (
          <CompleteStep onGoMyPage={() => navigate('/mypage')} />
        )}
      </div>
    </div>
  );
};

/* ── Step 1: ようこそ ── */

const WelcomeStep = ({ onNext }: { onNext: () => void }) => (
  <FadeIn>
    <Card variant="outlined">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-surface-secondary flex items-center justify-center">
            <Icon name="waving_hand" size="md" color="primary" />
          </div>
          <div>
            <Typography variant="body-sm" as="div" weight="bold">
              ようこそ！
            </Typography>
            <Typography variant="caption" color="muted" as="div">
              まずは登録なしで使える機能をご紹介
            </Typography>
          </div>
        </div>

        <Divider className="mb-4" />

        <div className="flex flex-col gap-3">
          <FeatureItem icon="search" text="経路検索で行き方を調べる" />
          <FeatureItem icon="confirmation_number" text="チケットの種類・料金を確認" />
          <FeatureItem icon="place" text="行き先の周辺情報をチェック" />
        </div>

        <Typography variant="caption" color="muted" as="div" className="mt-4 leading-relaxed">
          これらの機能は登録なしで今すぐ利用できます。
          次のステップでアカウント登録すると、チケットの購入も可能になります。
        </Typography>
      </div>
    </Card>

    <Button
      fullWidth
      className="mt-4"
      onClick={onNext}
      style={{ background: 'linear-gradient(135deg, var(--gm-accent), var(--gm-accent-dark))' }}
    >
      次へ
    </Button>
  </FadeIn>
);

const FeatureItem = ({ icon, text }: { icon: string; text: string }) => (
  <div className="flex items-center gap-3">
    <Icon name={icon} size="sm" color="primary" />
    <Typography variant="body-sm" as="span">
      {text}
    </Typography>
  </div>
);

/* ── Step 2: アカウント登録 ── */

const RegisterStep = ({
  city,
  setCity,
  email,
  setEmail,
  onSubmit,
  onBack,
}: {
  city: string;
  setCity: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}) => (
  <FadeIn>
    <Card variant="outlined">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-surface-secondary flex items-center justify-center">
            <Icon name="person_add" size="md" color="primary" />
          </div>
          <div>
            <Typography variant="body-sm" as="div" weight="bold">
              アカウント登録
            </Typography>
            <Typography variant="caption" color="muted" as="div">
              チケットの購入が可能になります
            </Typography>
          </div>
        </div>

        <Divider className="mb-4" />

        <div className="flex flex-col gap-4">
          <Select
            label="お住まいの地域"
            placeholder="選択してください"
            size="small"
            fullWidth
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="中央市">中央市</option>
            <option value="北川市">北川市</option>
            <option value="その他">その他の地域</option>
          </Select>

          <Input
            label="メールアドレス"
            type="email"
            placeholder="example@email.com"
            size="small"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
    </Card>

    <div className="mt-4 flex gap-2">
      <Button variant="secondary" fullWidth onClick={onBack}>
        戻る
      </Button>
      <Button
        fullWidth
        disabled={!city || !email}
        onClick={onSubmit}
        style={{ background: 'linear-gradient(135deg, var(--gm-accent), var(--gm-accent-dark))' }}
      >
        登録する
      </Button>
    </div>
  </FadeIn>
);

/* ── Step 3: マイナンバー連携 ── */

const MyNumberStep = ({
  agreed,
  setAgreed,
  onSubmit,
  onBack,
}: {
  agreed: boolean;
  setAgreed: (v: boolean) => void;
  onSubmit: () => void;
  onBack: () => void;
}) => (
  <FadeIn>
    <Card variant="outlined">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-surface-secondary flex items-center justify-center">
            <Icon name="verified_user" size="md" color="primary" />
          </div>
          <div>
            <Typography variant="body-sm" as="div" weight="bold">
              マイナンバーカード連携
            </Typography>
            <Typography variant="caption" color="muted" as="div">
              割引が自動で適用されます
            </Typography>
          </div>
        </div>

        <Divider className="mb-4" />

        <Typography variant="caption" color="muted" as="div" className="leading-relaxed mb-4">
          マイナンバーカードを連携すると、お住まいの地域や年齢に応じた
          割引が自動的に適用されます。連携は任意です。後からマイページで
          いつでも設定できます。
        </Typography>

        <div className="rounded-sm bg-surface-info-muted p-3 mb-4">
          <Typography variant="caption" as="div" weight="bold" className="mb-1">
            連携で使える割引の例
          </Typography>
          <Typography variant="caption" color="muted" as="div">
            ・中央市民: 乗り放題券 ¥500 → ¥360
          </Typography>
          <Typography variant="caption" color="muted" as="div">
            ・65歳以上: バス50%OFF、タクシー30〜50%OFF
          </Typography>
        </div>

        <Checkbox
          label="利用規約・個人情報の取扱いに同意する"
          size="small"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
      </div>
    </Card>

    <div className="mt-4 flex gap-2">
      <Button variant="secondary" fullWidth onClick={onBack}>
        戻る
      </Button>
      <Button
        fullWidth
        disabled={!agreed}
        onClick={onSubmit}
        style={{ background: 'linear-gradient(135deg, var(--gm-accent), var(--gm-accent-dark))' }}
      >
        連携する
      </Button>
    </div>
  </FadeIn>
);

/* ── Step 4: 完了 ── */

const CompleteStep = ({ onGoMyPage }: { onGoMyPage: () => void }) => (
  <FadeIn>
    <div className="text-center py-8">
      <div className="w-20 h-20 rounded-full bg-surface-success-muted flex items-center justify-center mx-auto mb-4">
        <Icon name="check_circle" size="lg" color="primary" />
      </div>
      <Typography variant="h4" as="div" weight="bold">
        セットアップ完了！
      </Typography>
      <Typography variant="body-sm" color="muted" as="div" className="mt-2 leading-relaxed">
        すべての機能が利用可能になりました。
        <br />
        割引もチケット購入時に自動で適用されます。
      </Typography>
    </div>

    <Button
      fullWidth
      onClick={onGoMyPage}
      style={{ background: 'linear-gradient(135deg, var(--gm-accent), var(--gm-accent-dark))' }}
    >
      マイページへ
    </Button>
  </FadeIn>
);
