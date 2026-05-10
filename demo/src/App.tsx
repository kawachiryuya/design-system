import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { SearchPage } from './pages/SearchPage';
import { ResultsPage } from './pages/ResultsPage';
import { SeatPage } from './pages/SeatPage';
import { SeatMapPage } from './pages/SeatMapPage';
import { ConfirmPage } from './pages/ConfirmPage';
import { CompletePage } from './pages/CompletePage';
import { ReservationsPage } from './pages/ReservationsPage';
import { ReservationDetailPage } from './pages/ReservationDetailPage';
import { ICRegisterPage } from './pages/ICRegisterPage';
import { TokensPage } from './pages/TokensPage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { MyPage } from './pages/MyPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';
import { FAQPage } from './pages/FAQPage';
import { ArticlesPage } from './pages/ArticlesPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        {/* 公開 */}
        <Route path="/" element={<SearchPage />} />
        <Route path="/lp" element={<LandingPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />

        {/* 認証 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* 予約フロー */}
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/seat" element={<SeatPage />} />
        <Route path="/seatmap" element={<SeatMapPage />} />
        <Route path="/confirm" element={<ConfirmPage />} />
        <Route path="/complete" element={<CompletePage />} />

        {/* マイページ */}
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
        <Route path="/reservations/:id" element={<ReservationDetailPage />} />
        <Route path="/reservations/:id/ic-register" element={<ICRegisterPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* デザインシステム */}
        <Route path="/tokens" element={<TokensPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
