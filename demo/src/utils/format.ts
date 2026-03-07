const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

export const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日(${weekdays[d.getDay()]})`;
};
