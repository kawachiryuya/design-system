import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { myTickets as initialTickets, type MyTicket, type TicketStatus } from '../data/myTickets';
import type { TicketWithDest } from '../data/destinations';

const TICKETS_KEY = 'tsunagu-my-tickets';
const PROFILE_KEY = 'tsunagu-user-profile';

export interface UserProfile {
  /** 0=未開始, 1=閲覧のみ, 2=ID登録済, 3=マイナンバー連携済 */
  step: 0 | 1 | 2 | 3;
  city: string;
  email: string;
}

const defaultProfile: UserProfile = { step: 0, city: '', email: '' };

function loadTickets(): MyTicket[] {
  try {
    const stored = localStorage.getItem(TICKETS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return initialTickets;
}

function saveTickets(tickets: MyTicket[]) {
  localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
}

function loadProfile(): UserProfile {
  try {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return defaultProfile;
}

function saveProfile(profile: UserProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

interface TicketStoreContextValue {
  tickets: MyTicket[];
  purchaseTicket: (ticket: TicketWithDest) => MyTicket;
  detailTicket: TicketWithDest | null;
  setDetailTicket: (t: TicketWithDest | null) => void;
  userProfile: UserProfile;
  updateProfile: (patch: Partial<UserProfile>) => void;
}

const TicketStoreContext = createContext<TicketStoreContextValue | null>(null);

export const TicketStoreProvider = ({ children }: { children: ReactNode }) => {
  const [tickets, setTickets] = useState<MyTicket[]>(loadTickets);
  const [detailTicket, setDetailTicket] = useState<TicketWithDest | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(loadProfile);

  const purchaseTicket = useCallback(
    (ticket: TicketWithDest): MyTicket => {
      const today = new Date().toISOString().slice(0, 10);
      const newTicket: MyTicket = {
        id: `mt-${Date.now()}`,
        name: ticket.name,
        destName: ticket.destName,
        destId: ticket.destId,
        price: ticket.price,
        days: ticket.days,
        status: 'active' as TicketStatus,
        purchasedAt: today,
        validUntil: today,
      };
      const updated = [newTicket, ...tickets];
      setTickets(updated);
      saveTickets(updated);
      return newTicket;
    },
    [tickets]
  );

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const next = { ...prev, ...patch };
      saveProfile(next);
      return next;
    });
  }, []);

  return (
    <TicketStoreContext.Provider
      value={{
        tickets,
        purchaseTicket,
        detailTicket,
        setDetailTicket,
        userProfile,
        updateProfile,
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
