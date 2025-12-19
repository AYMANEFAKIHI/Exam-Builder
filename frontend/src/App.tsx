import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ExamBuilderPage from './pages/ExamBuilderPage';
import QuestionBankPage from './pages/QuestionBankPage';
import TemplatesPage from './pages/TemplatesPage';
import Layout from './components/Layout';

function App() {
  const { user } = useAuthStore();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />
      
      {/* Protected routes */}
      <Route path="/app" element={user ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Navigate to="/dashboard" />} />
      </Route>
      
      <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="exam/new" element={<ExamBuilderPage />} />
        <Route path="exam/:id" element={<ExamBuilderPage />} />
        <Route path="question-bank" element={<QuestionBankPage />} />
        <Route path="templates" element={<TemplatesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
