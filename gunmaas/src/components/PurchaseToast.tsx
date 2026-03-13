import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@ds/composites/Alert/Alert';
import { useTicketStore } from '../store/ticketStore';

export const PurchaseToast = () => {
  const { purchaseComplete, clearPurchaseComplete } = useTicketStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (purchaseComplete) {
      const timer = setTimeout(clearPurchaseComplete, 4000);
      return () => clearTimeout(timer);
    }
  }, [purchaseComplete, clearPurchaseComplete]);

  if (!purchaseComplete) return null;

  return (
    <div
      className="fixed top-12 left-1/2 -translate-x-1/2 z-[110] w-[calc(100%-32px)] max-w-[388px] cursor-pointer"
      onClick={() => {
        clearPurchaseComplete();
        navigate('/my-tickets');
      }}
    >
      <Alert variant="success" title="購入完了" onClose={clearPurchaseComplete}>
        {purchaseComplete.name}を購入しました。タップしてマイチケットを確認
      </Alert>
    </div>
  );
};
