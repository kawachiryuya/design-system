/**
 * マイページ — QRプロフィール + 展開型3ステップカード + サポート/法務
 */
import { useState } from 'react';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Divider } from '@ds/primitives/Divider/Divider';
import { useTicketStore, type UserProfile } from '../store/ticketStore';

type RegStateKey = 'none' | 'jre_only' | 'jre_ic' | 'all';
const REG_STATES: Record<RegStateKey, { jre: boolean; ic: boolean; mynumber: boolean }> = {
  none: { jre: false, ic: false, mynumber: false },
  jre_only: { jre: true, ic: false, mynumber: false },
  jre_ic: { jre: true, ic: true, mynumber: false },
  all: { jre: true, ic: true, mynumber: true },
};

interface StepDef {
  key: string;
  done: boolean;
  icon: string;
  title: string;
  benefit: string;
  action: string;
  requires: string | null;
  registered: {
    detail: string;
    subDetail?: string;
    actions: { label: string; icon: string; danger?: boolean }[];
  } | null;
}

export const MyPage = () => {
  const { updateProfile } = useTicketStore();
  const [regState, setRegState] = useState<RegStateKey>('none');
  const [expanded, setExpanded] = useState<string | null>(null);

  const reg = REG_STATES[regState];
  const cc = [reg.jre, reg.ic, reg.mynumber].filter(Boolean).length;

  const handleRegSwitch = (key: RegStateKey) => {
    setRegState(key);
    setExpanded(null);
    const r = REG_STATES[key];
    updateProfile({
      step: ([r.jre, r.ic, r.mynumber].filter(Boolean).length) as UserProfile['step'],
      city: r.mynumber ? '中央市' : '',
      email: r.jre ? 'mitsuki.t@email.com' : '',
    });
  };

  const steps: StepDef[] = [
    {
      key: 'jre', done: reg.jre, icon: '👤', title: 'JRE ID',
      benefit: 'チケットの購入・管理ができるようになります', action: 'ログイン / 新規登録',
      requires: null,
      registered: reg.jre ? {
        detail: 'mitsuki.t@email.com',
        actions: [
          { label: 'メールアドレスの変更', icon: '✉️' },
          { label: 'パスワードの変更', icon: '🔑' },
          { label: '電話番号の登録・変更', icon: '📞' },
          { label: 'クレジットカード情報', icon: '💳' },
          { label: '退会', icon: '🚪', danger: true },
        ],
      } : null,
    },
    {
      key: 'ic', done: reg.ic, icon: '💳', title: '交通系ICカード',
      benefit: 'チケットをICカードで利用できます', action: '登録',
      requires: !reg.jre ? 'JRE IDログインが必要です' : null,
      registered: reg.ic ? {
        detail: 'Suica  ****-****-****-1234',
        actions: [
          { label: 'カードを変更', icon: '🔄' },
          { label: 'カードを追加', icon: '➕' },
          { label: '登録を解除', icon: '🗑', danger: true },
        ],
      } : null,
    },
    {
      key: 'mynumber', done: reg.mynumber, icon: '🪪', title: 'マイナンバーカード',
      benefit: '地域の割引が自動で適用されます', action: '登録',
      requires: !reg.jre ? 'JRE IDログインが必要です' : null,
      registered: reg.mynumber ? {
        detail: '中央市民（つなぐパス県中央市）',
        subDetail: '敬老割引: 対象（65歳以上）',
        actions: [
          { label: '登録情報を確認', icon: '📋' },
          { label: '登録を解除', icon: '🗑', danger: true },
        ],
      } : null,
    },
  ];

  return (
    <div className="bg-background pb-6" style={{ minHeight: 'calc(100dvh - 42px - 64px)' }}>
      {/* Demo switcher */}
      <div className="px-4 pt-3">
        <div className="bg-surface rounded-lg p-3" style={{ border: '1.5px dashed #CBD5E1' }}>
          <Typography variant="caption" color="muted" as="div" weight="semibold" className="mb-2">
            🔧 デモ用: 登録状態を切り替え
          </Typography>
          <div className="flex gap-1 flex-wrap">
            {([
              { key: 'none' as const, label: '未登録' },
              { key: 'jre_only' as const, label: 'JRE IDのみ' },
              { key: 'jre_ic' as const, label: '+ICカード' },
              { key: 'all' as const, label: '全て完了' },
            ]).map((s) => (
              <button
                key={s.key}
                onClick={() => handleRegSwitch(s.key)}
                className="py-1 px-3 rounded-sm text-[11px] font-semibold cursor-pointer"
                style={{
                  border: regState === s.key ? '1.5px solid #2D6A4F' : '1px solid var(--color-border-muted, #E2EDE6)',
                  background: regState === s.key ? '#F0FAF4' : 'white',
                  color: regState === s.key ? '#2D6A4F' : '#94A3B8',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Profile card with QR */}
      <div className="px-4 pt-4">
        <div className="bg-surface rounded-lg p-5 border border-border-muted">
          <div className="flex gap-3 items-center">
            {reg.jre ? (
              <div
                className="w-[100px] h-[100px] rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{ border: '1.5px solid var(--color-border-muted, #E2EDE6)' }}
              >
                <svg width="82" height="82" viewBox="0 0 48 48">
                  <rect width="48" height="48" fill="white"/>
                  <rect x="4" y="4" width="12" height="12" rx="2" fill="#1B4332"/>
                  <rect x="6" y="6" width="8" height="8" rx="1" fill="white"/>
                  <rect x="8" y="8" width="4" height="4" fill="#1B4332"/>
                  <rect x="32" y="4" width="12" height="12" rx="2" fill="#1B4332"/>
                  <rect x="34" y="6" width="8" height="8" rx="1" fill="white"/>
                  <rect x="36" y="8" width="4" height="4" fill="#1B4332"/>
                  <rect x="4" y="32" width="12" height="12" rx="2" fill="#1B4332"/>
                  <rect x="6" y="34" width="8" height="8" rx="1" fill="white"/>
                  <rect x="8" y="36" width="4" height="4" fill="#1B4332"/>
                  <rect x="20" y="4" width="3" height="3" fill="#1B4332"/>
                  <rect x="20" y="10" width="3" height="3" fill="#1B4332"/>
                  <rect x="24" y="8" width="3" height="3" fill="#1B4332"/>
                  <rect x="20" y="20" width="3" height="3" fill="#1B4332"/>
                  <rect x="24" y="20" width="3" height="3" fill="#1B4332"/>
                  <rect x="32" y="32" width="3" height="3" fill="#1B4332"/>
                  <rect x="36" y="36" width="3" height="3" fill="#1B4332"/>
                  <rect x="40" y="40" width="3" height="3" fill="#1B4332"/>
                </svg>
              </div>
            ) : (
              <div
                className="w-[60px] h-[60px] rounded-full bg-background flex items-center justify-center text-[22px] flex-shrink-0"
                style={{ border: '2px dashed #CBD5E1' }}
              >
                👤
              </div>
            )}
            <div className="flex-1">
              {reg.jre ? (
                <>
                  <div className="text-[18px] font-black text-onSurface-primary">田中 美月</div>
                  <Typography variant="caption" color="muted" as="div">ID: D2503-2846</Typography>
                </>
              ) : (
                <>
                  <Typography variant="body" as="div" weight="bold">ゲスト</Typography>
                  <Typography variant="caption" color="muted" as="div">
                    ログインするとチケットが購入できます
                  </Typography>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Registration steps */}
      <div className="px-4 pt-4">
        <div className="flex justify-between items-center mb-1">
          <Typography variant="body-sm" as="div" weight="bold">
            {cc === 3 ? '登録済みの情報' : 'つなぐパスをもっと便利に使おう'}
          </Typography>
          <span className="text-[11px] font-semibold" style={{ color: cc === 3 ? '#2D6A4F' : '#94A3B8' }}>
            {cc === 3 ? '✓ すべて完了' : `${cc} / 3`}
          </span>
        </div>
        {cc < 3 && (
          <Typography variant="caption" color="muted" as="div" className="mb-2 leading-relaxed">
            登録を進めると、チケット購入や割引が使えるようになります
          </Typography>
        )}

        <div className="flex gap-1 mb-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex-1 h-1 rounded-[2px]" style={{ background: i < cc ? '#2D6A4F' : 'var(--color-border-muted, #E2EDE6)' }} />
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {steps.map((step, i) => {
            const isExp = expanded === step.key;
            return (
              <div key={step.key} className="bg-surface rounded-lg overflow-hidden border border-border-muted" style={{ opacity: step.requires ? 0.55 : 1 }}>
                <div
                  onClick={() => step.done && !step.requires && setExpanded((prev) => prev === step.key ? null : step.key)}
                  className="flex gap-3 items-center px-4 py-3"
                  style={{ cursor: step.done ? 'pointer' : 'default' }}
                >
                  <div className="w-[36px] h-[36px] rounded-sm flex-shrink-0 bg-background flex items-center justify-center" style={{ color: step.done ? '#2D6A4F' : '#1C2833', fontSize: step.done ? 14 : 18 }}>
                    {step.done ? '✓' : step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Typography variant="body-sm" as="span" weight="bold">{step.title}</Typography>
                      {step.done && <span className="text-[10px] font-semibold" style={{ color: '#2D6A4F' }}>登録済み</span>}
                    </div>
                    {step.done && step.registered && <Typography variant="caption" color="muted" as="div">{step.registered.detail}</Typography>}
                    {!step.done && !step.requires && <Typography variant="caption" color="muted" as="div">{step.benefit}</Typography>}
                    {step.requires && <Typography variant="caption" color="muted" as="div">🔒 {step.requires}</Typography>}
                  </div>
                  {step.done ? (
                    <span className="text-[12px] text-onSurface-subtle transition-transform" style={{ transform: isExp ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                  ) : !step.requires ? (
                    <button
                      className="rounded-sm px-3 py-1 text-[11px] font-bold cursor-pointer flex-shrink-0"
                      style={{
                        background: i === 0 && !reg.jre ? 'linear-gradient(135deg, #E07A5F, #C4623F)' : 'white',
                        color: i === 0 && !reg.jre ? 'white' : '#2D6A4F',
                        border: i === 0 && !reg.jre ? 'none' : '1.5px solid #2D6A4F',
                      }}
                    >
                      {step.action}
                    </button>
                  ) : null}
                </div>

                {step.done && isExp && step.registered && (
                  <div className="border-t border-border-muted">
                    {step.registered.subDetail && (
                      <div className="px-4 py-3 text-[12px] font-semibold" style={{ background: '#FDF6E8', color: '#E07A5F' }}>
                        💡 {step.registered.subDetail}
                      </div>
                    )}
                    {step.registered.actions.map((act, ai) => (
                      <div key={ai}>
                        <div className="flex items-center gap-3 py-3 cursor-pointer" style={{ paddingLeft: 64, paddingRight: 16 }}>
                          <span className="text-[14px]">{act.icon}</span>
                          <span className="text-[13px] font-semibold flex-1" style={{ color: act.danger ? '#E07A5F' : '#1C2833' }}>{act.label}</span>
                          <span className="text-[12px] text-onSurface-disabled">›</span>
                        </div>
                        {ai < step.registered!.actions.length - 1 && <div className="h-[1px] bg-border-muted" style={{ marginLeft: 64 }} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Other registration */}
      <div className="px-4 pt-4">
        <Typography variant="body-sm" as="div" weight="bold" className="mb-3">その他の登録</Typography>
        <div className="bg-surface rounded-lg overflow-hidden border border-border-muted">
          <MenuRow icon="👶" label="こどもデマンド利用登録・変更" sub={reg.jre ? 'お子さまのデマンド交通利用を登録' : '🔒 JRE IDログインが必要です'} disabled={!reg.jre} />
        </div>
      </div>

      {/* Support */}
      <div className="px-4 pt-4">
        <Typography variant="body-sm" as="div" weight="bold" className="mb-3">サポート</Typography>
        <div className="bg-surface rounded-lg overflow-hidden border border-border-muted">
          <MenuRow icon="📖" label="はじめ方ガイド" sub="つなぐパスの使い方をステップで紹介" highlight={!reg.jre} />
          <Divider />
          <MenuRow icon="❓" label="よくある質問" />
          <Divider />
          <MenuRow icon="💬" label="お問い合わせ" />
        </div>
      </div>

      {/* Legal */}
      <div className="px-4 pt-4">
        <Typography variant="body-sm" as="div" weight="bold" className="mb-3">その他</Typography>
        <div className="bg-surface rounded-lg overflow-hidden border border-border-muted">
          <MenuRow icon="📄" label="利用規約" />
          <Divider />
          <MenuRow icon="🔒" label="プライバシーポリシー" />
          <Divider />
          <MenuRow icon="🏛" label="運営情報" sub="つなぐパス県新モビリティサービス推進協議会" />
        </div>
      </div>

      {/* Logout */}
      {reg.jre && (
        <div className="px-4 pt-4">
          <button className="w-full bg-surface rounded-lg py-4 text-[14px] font-semibold cursor-pointer" style={{ color: '#E07A5F', border: '1px solid var(--color-border-muted, #E2EDE6)' }}>
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
};

const MenuRow = ({ icon, label, sub, highlight, danger, disabled }: {
  icon: string; label: string; sub?: string; highlight?: boolean; danger?: boolean; disabled?: boolean;
}) => (
  <div className="flex items-center gap-3 px-4 py-3 cursor-pointer" style={{ background: highlight ? '#FDF6E8' : 'transparent', opacity: disabled ? 0.55 : 1 }}>
    <span className="text-[17px] flex-shrink-0">{icon}</span>
    <div className="flex-1">
      <Typography variant="body-sm" as="div" weight="semibold" style={danger ? { color: '#E07A5F' } : undefined}>{label}</Typography>
      {sub && <Typography variant="caption" color="muted" as="div">{sub}</Typography>}
    </div>
    <span className="text-[14px] text-onSurface-disabled">›</span>
  </div>
);
