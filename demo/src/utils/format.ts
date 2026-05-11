const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

export const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日(${weekdays[d.getDay()]})`;
};

/**
 * 出発・到着時刻（HH:mm）から所要時間を 'X時間Y分' 形式で返す。
 * 到着が出発より早い場合（日跨ぎ）は 24h 加算で吸収。
 */
export const calcDuration = (departure: string, arrival: string): string => {
  const [dh, dm] = departure.split(':').map(Number);
  const [ah, am] = arrival.split(':').map(Number);
  let mins = (ah * 60 + am) - (dh * 60 + dm);
  if (mins < 0) mins += 24 * 60;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}分`;
  if (m === 0) return `${h}時間`;
  return `${h}時間${m}分`;
};
