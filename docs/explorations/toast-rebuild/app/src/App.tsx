import React from 'react';
import { AppShell } from '../../../../../components/composites/AppShell';
import { Alert } from '../../../../../components/composites/Alert';
import { Button } from '../../../../../components/primitives/Button';
import { Icon } from '../../../../../components/primitives/Icon';
import { Typography } from '../../../../../components/primitives/Typography';
import { OptionsBand } from './OptionsBand';
import { readLook, writeLook, type Look } from './options';
import { ToastProvider, useToast } from './toast/useToast';
import type { DismissReason, ToastEntry, ToastInput } from './toast/types';

const NAV = [
  { key: 'list', label: '予約', icon: 'list_alt' },
  { key: 'search', label: 'さがす', icon: 'search' },
  { key: 'ticket', label: 'きっぷ', icon: 'confirmation_number' },
  { key: 'me', label: 'マイページ', icon: 'person' },
] as const;
type NavKey = (typeof NAV)[number]['key'];

/** 下のナビ (狭い幅だけ。AppShell が shell 以上で隠す)。Toast がこの上に重なるのを確かめる */
const BottomNav: React.FC<{ current: NavKey; onPick: (key: NavKey, label: string) => void }> = ({ current, onPick }) => (
  <nav aria-label="下のナビ" className="fixed inset-x-0 bottom-0 z-sticky border-t border-border-subtle bg-surface shadow-sm">
    <div className="grid h-16 grid-cols-4">
      {NAV.map((n) => (
        <Button
          key={n.key}
          variant="tertiary"
          size="sm"
          aria-current={current === n.key ? 'page' : undefined}
          className={[
            'h-full min-w-0 flex-col gap-0.5 rounded-none px-1 type-caption whitespace-nowrap',
            current === n.key ? 'font-bold' : 'text-onSurface-subtle font-regular',
          ].join(' ')}
          onClick={() => onPick(n.key, n.label)}
        >
          <Icon name={n.icon} size="sm" />
          {n.label}
        </Button>
      ))}
    </div>
  </nav>
);

const Sidebar: React.FC<{ current: NavKey; onPick: (key: NavKey, label: string) => void }> = ({ current, onPick }) => (
  <div className="sticky top-0 flex h-screen w-64 shrink-0 flex-col gap-1 border-r border-border-subtle bg-surface px-2 py-4">
    <div className="px-3 pb-3 type-item-title">Rail Demo</div>
    {NAV.map((n) => (
      <Button
        key={n.key}
        variant="tertiary"
        size="sm"
        aria-current={current === n.key ? 'page' : undefined}
        className={['justify-start', current === n.key ? 'font-bold' : 'text-onSurface-subtle font-regular'].join(' ')}
        icon={<Icon name={n.icon} size="sm" />}
        onClick={() => onPick(n.key, n.label)}
      >
        {n.label}
      </Button>
    ))}
  </div>
);

const Header: React.FC = () => (
  <header className="flex h-12 items-center border-b border-border-subtle bg-surface px-4 type-item-title">Rail Demo</header>
);

interface Scene {
  id: string;
  label: string;
  run: (toast: (input: ToastInput) => string, log: (text: string) => void) => void;
}

const SCENES: Scene[] = [
  {
    id: 'ok-1',
    label: 'できた・1 行',
    run: (toast) => toast({ variant: 'success', message: '予約を保存しました' }),
  },
  {
    id: 'ok-2',
    label: 'できた・2 行になる文',
    run: (toast) =>
      toast({ variant: 'success', message: '予約を確定しました。確認のメールを登録のアドレスに送りました' }),
  },
  {
    id: 'undo-1',
    label: '元に戻すつき・1 行',
    run: (toast, log) =>
      toast({ variant: 'success', message: 'アーカイブしました', action: { label: '元に戻す', onClick: () => log('元に戻しました') } }),
  },
  {
    id: 'undo',
    label: '元に戻すつき・2〜3 行',
    run: (toast, log) =>
      toast({
        variant: 'success',
        message: '12月24日 東京 → 新大阪 のぞみ 21 号（2 名）の予約をアーカイブしました',
        action: { label: '元に戻す', onClick: () => log('元に戻しました') },
      }),
  },
  {
    id: 'long-action',
    label: '長い操作名＋2 行',
    run: (toast, log) =>
      toast({
        variant: 'success',
        message: '2 名分の座席を仮に押さえました（15 分のあいだ有効です）',
        action: { label: 'お支払いに進む', onClick: () => log('「お支払いに進む」を押しました') },
      }),
  },
  {
    id: 'ng-1',
    label: 'できなかった・1 行',
    run: (toast) => toast({ variant: 'error', message: '保存できませんでした' }),
  },
  {
    id: 'retry',
    label: 'できなかった・再試行つき・2 行',
    run: (toast, log) =>
      toast({
        variant: 'error',
        message: '通信が切れたため、予約の変更を受け付けられませんでした',
        action: { label: 'もう一度試す', onClick: () => log('「もう一度試す」を押しました') },
      }),
  },
  {
    id: 'two',
    label: 'できなかった → 続けて できた',
    run: (toast) => {
      toast({ variant: 'error', message: 'お支払いを完了できませんでした' });
      window.setTimeout(() => toast({ variant: 'success', message: '入力した内容を下書きに保存しました' }), 400);
    },
  },
];

const REASON_TEXT: Record<DismissReason, (e: ToastEntry) => string> = {
  timeout: (e) => `${e.action ? 7 : 5} 秒たって、自動で消えました`,
  swipe: () => '下へ払って消しました',
  close: () => '× で閉じました',
  action: () => '操作を押して消えました',
};

const RESERVATIONS = Array.from({ length: 14 }, (_, i) => {
  const day = 3 + i * 2;
  return {
    id: i,
    date: `12月${day}日`,
    route: i % 3 === 0 ? '東京 → 新大阪' : i % 3 === 1 ? '品川 → 名古屋' : '新横浜 → 京都',
    train: `のぞみ ${11 + i * 4} 号`,
  };
});

const Page: React.FC<{ log: (text: string) => void; lastLog: string }> = ({ log, lastLog }) => {
  const { toast } = useToast();
  return (
    <div className="flex flex-col gap-6">
      <Typography variant="pageTitle">予約一覧</Typography>

      <section className="flex flex-col gap-3" aria-labelledby="scenes-title">
        <Typography variant="sectionTitle" id="scenes-title">場面（押すと Toast が出る）</Typography>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SCENES.map((s) => (
            <Button key={s.id} variant="secondary" size="md" fullWidth data-scene={s.id} onClick={() => s.run(toast, log)}>
              {s.label}
            </Button>
          ))}
        </div>
        <p className="type-supporting text-onSurface-subtle" data-testid="log">
          {lastLog || '場面のボタンを押すと Toast が出ます。下へ払っても消えます'}
        </p>
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="alerts-title">
        <Typography variant="sectionTitle" id="alerts-title">見比べる用の Alert（本物）</Typography>
        <Alert variant="success" title="予約を確定しました">確認のメールを登録のアドレスに送りました。</Alert>
        <Alert variant="error" title="お支払いを完了できませんでした">カードの有効期限を確かめてから、もう一度お試しください。</Alert>
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="list-title">
        <Typography variant="sectionTitle" id="list-title">これからの予約</Typography>
        <ul className="flex flex-col divide-y divide-border-subtle rounded-md border border-border-subtle bg-surface">
          {RESERVATIONS.map((r) => (
            <li key={r.id} className="flex items-center gap-3 px-4 py-3">
              <Icon name="train" size="sm" className="text-onSurface-subtle" />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="type-body">{r.route}</span>
                <span className="type-supporting text-onSurface-subtle">{r.date}・{r.train}</span>
              </div>
              <Button
                variant="tertiary"
                size="sm"
                onClick={() =>
                  toast({
                    variant: 'success',
                    message: `${r.date}の予約をアーカイブしました`,
                    action: { label: '元に戻す', onClick: () => log('元に戻しました') },
                  })
                }
              >
                アーカイブ
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export const App: React.FC = () => {
  const [look, setLook] = React.useState<Look>(() => readLook(window.location.hash));
  const [nav, setNav] = React.useState<NavKey>('list');
  const [lastLog, setLastLog] = React.useState('');

  React.useEffect(() => {
    const onHash = () => setLook(readLook(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const changeLook = (next: Look) => {
    setLook(next);
    try {
      window.history.replaceState(null, '', writeLook(next));
    } catch {
      // file:// などで history が使えないときは state だけで持つ
    }
  };

  const pickNav = (key: NavKey, label: string) => {
    setNav(key);
    setLastLog(`下のナビ「${label}」を押せました`);
  };

  return (
    <ToastProvider look={look} onDismissed={(e, reason) => setLastLog(REASON_TEXT[reason](e))}>
      <OptionsBand look={look} onChange={changeLook} />
      <AppShell
        header={<Header />}
        sidebar={<Sidebar current={nav} onPick={pickNav} />}
        bottomNav={<BottomNav current={nav} onPick={pickNav} />}
      >
        <Page log={setLastLog} lastLog={lastLog} />
      </AppShell>
    </ToastProvider>
  );
};
