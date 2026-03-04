import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { SearchPage } from './pages/SearchPage';
import { ResultsPage } from './pages/ResultsPage';
import { SeatPage } from './pages/SeatPage';
import { SeatMapPage } from './pages/SeatMapPage';
import { ConfirmPage } from './pages/ConfirmPage';
import { CompletePage } from './pages/CompletePage';

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<SearchPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/seat" element={<SeatPage />} />
        <Route path="/seatmap" element={<SeatMapPage />} />
        <Route path="/confirm" element={<ConfirmPage />} />
        <Route path="/complete" element={<CompletePage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
