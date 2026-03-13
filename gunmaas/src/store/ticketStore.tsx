import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { myTickets as initialTickets, type MyTicket, type TicketStatus } from '../data/myTickets';
import type { Ticket } from '../data/destinations';

const STORAGE_KEY = 'gunmaas-my-tickets';

function loadTickets(): MyTicket[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return initialTickets;
}

function saveTickets(tickets: MyTicket[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

interface TicketStoreContextValue {
  tickets: MyTicket[];
  purchaseTicket: (ticket: Ticket, destName: string, destId: string) => MyTicket;
  /** 購入確認用の一時データ */
  pendingPurchase: PendingPurchase | null;
  setPendingPurchase: (p: PendingPurchase | null) => void;
  /** 購入完了通知 */
  purchaseComplete: MyTicket | null;
  clearPurchaseComplete: () => void;
}

export interface PendingPurchase {
  ticket: Ticket;
  destName: string;
  destId: string;
}

const TicketStoreContext = createContext<TicketStoreContextValue | null>(null);

export const TicketStoreProvider = ({ children }: { children: ReactNode }) => {
  const [tickets, setTickets] = useState<MyTicket[]>(loadTickets);
  const [pendingPurchase, setPendingPurchase] = useState<PendingPurchase | null>(null);
  const [purchaseComplete, setPurchaseComplete] = useState<MyTicket | null>(null);

  const purchaseTicket = useCallback(
    (ticket: Ticket, destName: string, destId: string): MyTicket => {
      const today = new Date().toISOString().slice(0, 10);
      const newTicket: MyTicket = {
        id: `mt-${Date.now()}`,
        name: ticket.name,
        destName,
        destId,
        price: ticket.price,
        days: ticket.days,
        status: 'active' as TicketStatus,
        purchasedAt: today,
        validUntil: today, // simplified for demo
      };
      const updated = [newTicket, ...tickets];
      setTickets(updated);
      saveTickets(updated);
      setPendingPurchase(null);
      setPurchaseComplete(newTicket);
      return newTicket;
    },
    [tickets]
  );

  const clearPurchaseComplete = useCallback(() => setPurchaseComplete(null), []);

  return (
    <TicketStoreContext.Provider
      value={{
        tickets,
        purchaseTicket,
        pendingPurchase,
        setPendingPurchase,
        purchaseComplete,
        clearPurchaseComplete,
      }}
    >
      {children}
    </TicketStoreContext.Provider>
  );
};

export const useTicketStore = () => {
  const ctx = useContext(TicketStoreContext);
  if (!ctx) throw new Error('useTicketStore must be used within TicketStoreProvider');
  return ctx;
};
