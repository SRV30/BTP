import { Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import PredictionPage from './pages/PredictionPage';
import InsightsPage from './pages/InsightsPage';
import ProfilePage from './pages/ProfilePage';
import ConnectionsPage from './pages/ConnectionsPage';
import DepressionPage from './pages/DepressionPage';
import DoctorsPage from './pages/DoctorsPage';

function AuthenticatedLayout({ children }) {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="content">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element={<ProtectedRoute><AuthenticatedLayout><DashboardPage /></AuthenticatedLayout></ProtectedRoute>} />
      <Route path="/prediction" element={<ProtectedRoute><AuthenticatedLayout><PredictionPage /></AuthenticatedLayout></ProtectedRoute>} />
      <Route path="/insights" element={<ProtectedRoute><AuthenticatedLayout><InsightsPage /></AuthenticatedLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><AuthenticatedLayout><ProfilePage /></AuthenticatedLayout></ProtectedRoute>} />
      <Route path="/connections" element={<ProtectedRoute><AuthenticatedLayout><ConnectionsPage /></AuthenticatedLayout></ProtectedRoute>} />
      <Route path="/depression" element={<ProtectedRoute><AuthenticatedLayout><DepressionPage /></AuthenticatedLayout></ProtectedRoute>} />
      <Route path="/doctors" element={<ProtectedRoute><AuthenticatedLayout><DoctorsPage /></AuthenticatedLayout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
