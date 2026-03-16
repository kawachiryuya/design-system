/**
 * 購入フロー — 4ステップ全画面
 * initial(チケット概要) → auth(ログイン) → confirm(確認+マイナンバー割引) → complete(完了)
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Button } from '@ds/primitives/Button/Button';
import { useTicketStore } from '../store/ticketStore';

type Step = 'initial' | 'auth' | 'confirm' | 'complete';

export const TicketModal = () => {
  const navigate = useNavigate();
  const { detailTicket, setDetailTicket, purchaseTicket } = useTicketStore();
  const [step, setStep] = useState<Step>('initial');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mynumberRegistered, setMynumberRegistered] = useState(false);
  const [showMynumberFlow, setShowMynumberFlow] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  if (!detailTicket) return null;

  const hasDiscount = !mynumberRegistered; // simplified
  const discountPrice = '¥360';
  const finalPrice = mynumberRegistered ? discountPrice : detailTicket.price;

  const handleClose = () => {
    setDetailTicket(null);
    setStep('initial');
    setIsLoggedIn(false);
    setMynumberRegistered(false);
    setShowMynumberFlow(false);
  };

  const handlePurchase = () => {
    purchaseTicket(detailTicket);
    setStep('complete');
  };

  const Header = ({ showBack, onBack }: { showBack?: boolean; onBack?: () => void }) => (
    <div className="bg-surface border-b border-border-muted px-4 py-3 flex items-center justify-between flex-shrink-0">
      {showBack ? (
        <button onClick={onBack} className="bg-transparent border-none text-[14px] font-semibold cursor-pointer p-0" style={{ color: '#2D6A4F' }}>
          ← 戻る
        </button>
      ) : <div />}
      <Typography variant="body-sm" as="div" weight="bold">チケット購入</Typography>
      <button
        onClick={handleClose}
        className="rounded-full w-[30px] h-[30px] cursor-pointer flex items-center justify-center text-[12px] text-onSurface-subtle bg-transparent"
        style={{ border: '2px solid #CBD5E1' }}
      >
        ✕
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 max-w-[420px] mx-auto bg-background z-[400] flex flex-col">
      {/* ── Step 1: Initial (ticket overview) ── */}
      {step === 'initial' && (
        <>
          <Header />
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 pt-5 pb-6">
              <Typography variant="h5" as="div" weight="bold" className="mb-1">
                {detailTicket.name}
              </Typography>
              <Typography variant="body-sm" color="muted" as="div" className="leading-relaxed mb-4">
                {detailTicket.desc}
              </Typography>

              <div className="flex justify-between items-baseline p-4 bg-background rounded-sm mb-4">
                <Typography variant="body-sm" color="muted" as="span">金額</Typography>
                <span className="text-[24px] font-black" style={{ color: '#2D6A4F' }}>{detailTicket.price}</span>
              </div>

              {detailTicket.days !== '—' && (
                <Typography variant="caption" color="muted" as="div" className="mb-5">
                  有効期間: {detailTicket.days}
                </Typography>
              )}

              <button
                onClick={() => setStep(isLoggedIn ? 'confirm' : 'auth')}
                className="w-full border-none rounded-lg py-4 text-[15px] font-bold cursor-pointer text-white"
                style={{ background: 'linear-gradient(135deg, #E07A5F, #C4623F)' }}
              >
                {isLoggedIn ? '購入手続きへ' : 'ログインして購入する'}
              </button>
              <button onClick={handleClose} className="w-full bg-transparent border-none py-3 text-[13px] text-onSurface-subtle cursor-pointer mt-1">
                キャンセル
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Step 2: Auth (dummy login) ── */}
      {step === 'auth' && (
        <>
          <Header showBack onBack={() => setStep('initial')} />
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 pt-5 pb-6">
              <Typography variant="body" as="div" weight="bold" className="mb-4">
                JRE IDでログイン
              </Typography>

              <div className="mb-3">
                <Typography variant="caption" color="muted" as="div" weight="semibold" className="mb-1">
                  メールアドレス
                </Typography>
                <input
                  type="email"
                  placeholder="example@email.com"
                  defaultValue="mitsuki.t@email.com"
                  className="w-full py-3 px-3 rounded-sm text-[14px] outline-none"
                  style={{ border: '1.5px solid var(--color-border-muted, #E2EDE6)', boxSizing: 'border-box' }}
                />
              </div>
              <div className="mb-5">
                <Typography variant="caption" color="muted" as="div" weight="semibold" className="mb-1">
                  パスワード
                </Typography>
                <input
                  type="password"
                  placeholder="••••••••"
                  defaultValue="password123"
                  className="w-full py-3 px-3 rounded-sm text-[14px] outline-none"
                  style={{ border: '1.5px solid var(--color-border-muted, #E2EDE6)', boxSizing: 'border-box' }}
                />
              </div>

              <button
                onClick={() => { setIsLoggedIn(true); setStep('confirm'); }}
                className="w-full border-none rounded-lg py-4 text-[15px] font-bold cursor-pointer text-white"
                style={{ background: 'linear-gradient(135deg, #E07A5F, #C4623F)' }}
              >
                ログイン
              </button>
              <div className="text-center mt-3">
                <Typography variant="body-sm" color="muted" as="span">アカウントをお持ちでない方 </Typography>
                <span
                  onClick={() => { setIsLoggedIn(true); setStep('confirm'); }}
                  className="text-[13px] font-semibold cursor-pointer"
                  style={{ color: '#2D6A4F' }}
                >
                  新規登録
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Step 3: Confirm (payment + IC card + mynumber discount) ── */}
      {step === 'confirm' && (
        <>
          <Header showBack onBack={() => setStep('initial')} />
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 pt-5 pb-6">
              <Typography variant="body" as="div" weight="bold" className="mb-4">
                購入内容の確認
              </Typography>

              {/* Ticket info card */}
              <div className="rounded-lg p-4 mb-3" style={{ background: '#F0FAF4', border: '1.5px solid rgba(45,106,79,0.15)' }}>
                <Typography variant="body" as="div" weight="bold">{detailTicket.name}</Typography>
                {detailTicket.days !== '—' && (
                  <Typography variant="caption" color="muted" as="div" className="mt-1">
                    有効期間: {detailTicket.days}
                  </Typography>
                )}
              </div>

              {/* Mynumber discount banner */}
              {hasDiscount && !showMynumberFlow && !mynumberRegistered && (
                <div className="rounded-lg p-3 mb-3" style={{ background: '#FDF6E8', border: '1px solid #F2CC8F' }}>
                  <div className="flex gap-2 items-start">
                    <span className="text-[16px] flex-shrink-0">💡</span>
                    <div className="flex-1">
                      <Typography variant="body-sm" as="div" weight="bold">
                        マイナンバーカードを登録すると割引
                      </Typography>
                      <div className="text-[12px] text-onSurface-subtle mt-1">
                        {detailTicket.price} → <span className="font-black" style={{ color: '#E07A5F' }}>{discountPrice}</span>（市民割引）
                      </div>
                      <button
                        onClick={() => setShowMynumberFlow(true)}
                        className="mt-2 bg-surface border rounded-sm px-3 py-2 text-[12px] font-bold cursor-pointer"
                        style={{ borderColor: '#2D6A4F', color: '#2D6A4F' }}
                      >
                        今すぐ登録して割引を適用
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Mynumber inline registration */}
              {showMynumberFlow && !mynumberRegistered && (
                <div className="rounded-lg p-4 mb-3" style={{ border: '1.5px solid #2D6A4F' }}>
                  <Typography variant="body-sm" as="div" weight="bold" className="mb-2">
                    🪪 マイナンバーカード登録
                  </Typography>
                  <Typography variant="caption" color="muted" as="div" className="leading-relaxed mb-3">
                    スマートフォンでマイナンバーカードを読み取ります。NFC対応端末が必要です。
                  </Typography>
                  <div className="bg-background rounded-sm p-5 text-center mb-3">
                    <div className="text-[32px]">📱</div>
                    <Typography variant="body-sm" color="muted" as="div" className="mt-2">
                      カードをスマートフォンの背面にかざしてください
                    </Typography>
                  </div>
                  <button
                    onClick={() => { setMynumberRegistered(true); setShowMynumberFlow(false); }}
                    className="w-full border-none rounded-sm py-3 text-[13px] font-bold cursor-pointer text-white"
                    style={{ background: 'linear-gradient(135deg, #2D6A4F, #40916C)' }}
                  >
                    読み取り完了（デモ）
                  </button>
                </div>
              )}

              {/* Mynumber registered confirmation */}
              {mynumberRegistered && (
                <div className="rounded-lg p-3 mb-3 flex gap-2 items-center" style={{ background: '#F0FDF4', border: '1.5px solid rgba(22,163,74,0.19)' }}>
                  <span className="text-[16px]">✅</span>
                  <div>
                    <div className="text-[13px] font-bold" style={{ color: '#16A34A' }}>市民割引が適用されました</div>
                    <Typography variant="caption" color="muted" as="div">
                      {detailTicket.price} → {discountPrice}
                    </Typography>
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="flex justify-between items-baseline p-4 bg-background rounded-sm mb-4">
                <Typography variant="body-sm" color="muted" as="span">お支払い金額</Typography>
                <div className="text-right">
                  {mynumberRegistered && (
                    <div className="text-[12px] text-onSurface-subtle line-through">{detailTicket.price}</div>
                  )}
                  <span className="text-[24px] font-black" style={{ color: '#2D6A4F' }}>{finalPrice}</span>
                </div>
              </div>

              {/* Payment method */}
              <Typography variant="body-sm" as="div" weight="bold" className="mb-2">決済方法</Typography>
              <div className="flex flex-col gap-2 mb-4">
                {[
                  { id: 'card', icon: '💳', label: 'クレジットカード', sub: 'Visa ****-4242' },
                  { id: 'applepay', icon: '🍎', label: 'Apple Pay', sub: null },
                ].map((pm) => (
                  <div
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer"
                    style={{
                      background: paymentMethod === pm.id ? '#F0FAF4' : 'white',
                      border: paymentMethod === pm.id ? '1.5px solid #2D6A4F' : '1px solid var(--color-border-muted, #E2EDE6)',
                    }}
                  >
                    <span className="text-[18px]">{pm.icon}</span>
                    <div className="flex-1">
                      <Typography variant="body-sm" as="div" weight="semibold">{pm.label}</Typography>
                      {pm.sub && <Typography variant="caption" color="muted" as="div">{pm.sub}</Typography>}
                    </div>
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ border: `2px solid ${paymentMethod === pm.id ? '#2D6A4F' : '#CBD5E1'}` }}
                    >
                      {paymentMethod === pm.id && (
                        <div className="w-[10px] h-[10px] rounded-full" style={{ background: '#2D6A4F' }} />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* IC card */}
              <Typography variant="body-sm" as="div" weight="bold" className="mb-2">利用するICカード</Typography>
              <div className="bg-surface rounded-lg p-3 border border-border-muted mb-5 flex items-center gap-3">
                <span className="text-[18px]">💳</span>
                <div className="flex-1">
                  <Typography variant="body-sm" as="div" weight="semibold">Suica ****-1234</Typography>
                  <Typography variant="caption" color="muted" as="div">登録済み</Typography>
                </div>
                <span className="text-[12px] font-semibold cursor-pointer" style={{ color: '#2D6A4F' }}>変更</span>
              </div>

              {/* Confirm button */}
              <button
                onClick={handlePurchase}
                className="w-full border-none rounded-lg py-4 text-[15px] font-bold cursor-pointer text-white"
                style={{ background: 'linear-gradient(135deg, #E07A5F, #C4623F)' }}
              >
                購入を確定する
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Step 4: Complete ── */}
      {step === 'complete' && (
        <>
          <Header />
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 pt-10 pb-8 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-[32px]" style={{ background: '#F0FDF4' }}>
                ✅
              </div>
              <Typography variant="h5" as="div" weight="bold" className="mb-1">
                購入が完了しました
              </Typography>
              <Typography variant="body-sm" color="muted" as="div" className="mb-5">
                チケットタブに追加されました
              </Typography>

              {/* Purchased ticket card */}
              <div className="rounded-lg p-4 mb-5 text-left" style={{ background: '#F0FAF4', border: '1.5px solid rgba(45,106,79,0.15)' }}>
                <Typography variant="body" as="div" weight="bold">{detailTicket.name}</Typography>
                <div className="flex justify-between mt-2">
                  <div>
                    <Typography variant="caption" color="muted" as="div">金額</Typography>
                    <span className="text-[16px] font-black" style={{ color: '#2D6A4F' }}>{finalPrice}</span>
                  </div>
                  <div className="text-right">
                    <Typography variant="caption" color="muted" as="div">有効期間</Typography>
                    <Typography variant="body-sm" as="div" weight="bold">{detailTicket.days}</Typography>
                  </div>
                </div>
                {mynumberRegistered && (
                  <div className="text-[11px] font-semibold mt-2" style={{ color: '#16A34A' }}>
                    ✓ 市民割引適用済み
                  </div>
                )}
              </div>

              <Button
                fullWidth
                onClick={handleClose}
                style={{ background: 'linear-gradient(135deg, #2D6A4F, #40916C)' }}
                className="mb-2"
              >
                ルート詳細に戻る
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => { handleClose(); navigate('/my-tickets'); }}
              >
                チケットを確認する
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
