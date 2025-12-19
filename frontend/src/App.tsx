import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
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
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />
      
      <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Navigate to="/dashboard" />} />
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
