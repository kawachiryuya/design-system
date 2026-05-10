import { useState } from 'react';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Icon } from '@ds/primitives/Icon';
import { Input } from '@ds/primitives/Input/Input';

const FAQ_ITEMS = [
  { q: '予約のキャンセルはいつまで可能ですか？', a: '出発時刻の 1 時間前までキャンセル可能です。それ以降はキャンセル料が発生する場合があります。' },
  { q: '会員登録は無料ですか？', a: 'はい、完全に無料でご利用いただけます。クレジットカード情報の登録は予約時のみ必要です。' },
  { q: '予約確認メールが届きません', a: '迷惑メールフォルダをご確認ください。それでも見つからない場合はお問い合わせフォームからご連絡ください。' },
  { q: '座席の変更はできますか？', a: '予約完了後でも、出発時刻の 30 分前までは座席変更が可能です（同一列車内）。' },
  { q: '領収書の発行は可能ですか？', a: 'マイページの予約詳細画面から PDF でダウンロード可能です。法人向け請求書の発行も対応しています。' },
];

export const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState('');

  const filtered = FAQ_ITEMS.filter(
    (item) =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Typography variant="h2" as="h1">よくある質問</Typography>
      <Typography variant="body" color="muted" className="mt-2 mb-6">
        多く寄せられる質問とその回答をまとめました
      </Typography>

      <Input
        label="質問を検索"
        placeholder="キーワードで絞り込み..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        leadingIcon={<Icon name="search" size="sm" />}
      />

      <div className="mt-6 space-y-2">
        {filtered.length === 0 ? (
          <Typography variant="body" color="muted" className="text-center py-8">
            検索結果がありません
          </Typography>
        ) : (
          filtered.map((item, i) => (
            <div key={i} className="border border-border-muted rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-state-hover transition-colors"
                aria-expanded={openIndex === i}
              >
                <Icon
                  name={openIndex === i ? 'expand_less' : 'expand_more'}
                  size="sm"
                  color="inherit"
                />
                <Typography variant="body" weight="semibold" className="flex-1">
                  {item.q}
                </Typography>
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4 pl-11">
                  <Typography variant="body-sm" color="muted">{item.a}</Typography>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
