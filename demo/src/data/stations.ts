export const stations = [
  '東京', '品川', '新横浜', '名古屋', '京都', '新大阪', '広島', '博多',
  '仙台', '盛岡', '新青森', '大宮', '上野', '新潟', '金沢', '長野',
] as const;

export type Station = (typeof stations)[number];
