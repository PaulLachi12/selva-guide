import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import GuideProfilePage from './pages/GuideProfilePage';
import TourDetailPage from './pages/TourDetailPage';
import BookingPage from './pages/BookingPage';
import MyTripsPage from './pages/MyTripsPage';
import DashboardGuidePage from './pages/DashboardGuidePage';
import ReviewsPage from './pages/ReviewsPage';
import ChatPage from './pages/ChatPage';
import AdminDashboard from './pages/AdminDashboard';
import TrackingPage from './pages/TrackingPage';
import RateTourPage from './pages/RateTourPage';
import ConversationsPage from './pages/ConversationsPage';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
};

const GuestRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/" /> : children;
};

function AppRoutes() {
  const { usuario } = useAuth();

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6 min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/registro" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/guia/:id" element={<GuideProfilePage />} />
          <Route path="/tour/:id" element={<TourDetailPage />} />
          <Route path="/reservar/:paqueteId" element={<PrivateRoute><BookingPage /></PrivateRoute>} />
          <Route path="/mis-viajes" element={<PrivateRoute><MyTripsPage /></PrivateRoute>} />
          <Route path="/conversaciones" element={<PrivateRoute><ConversationsPage /></PrivateRoute>} />
          <Route path="/tracking/:id" element={<PrivateRoute><TrackingPage /></PrivateRoute>} />
          <Route path="/valorar/:id" element={<PrivateRoute><RateTourPage /></PrivateRoute>} />
          <Route path="/dashboard-guia" element={<PrivateRoute><DashboardGuidePage /></PrivateRoute>} />
          <Route path="/valoraciones/:guiaId" element={<ReviewsPage />} />
          <Route path="/chat/:otroId" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}