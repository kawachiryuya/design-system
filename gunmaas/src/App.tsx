import { Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { TopPage } from './pages/TopPage';
import { PlacePage } from './pages/PlacePage';
import { SearchPage } from './pages/SearchPage';
import { MyTicketsPage } from './pages/MyTicketsPage';
import { MyPage } from './pages/MyPage';

export const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<TopPage />} />
        <Route path="place/:placeId" element={<PlacePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="my-tickets" element={<MyTicketsPage />} />
        <Route path="mypage" element={<MyPage />} />
      </Route>
    </Routes>
  );
};
