import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { 
  FileText, 
  BookOpen, 
  Layout as LayoutIcon, 
  LogOut, 
  User,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import Footer from './Footer';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8 rtl:space-x-reverse">
              <Link to="/dashboard" className="flex items-center space-x-2 rtl:space-x-reverse group">
                <div className="relative">
                  <GraduationCap className="w-8 h-8 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                  <Sparkles className="w-3 h-3 text-violet-500 absolute -top-1 -right-1 rtl:-left-1 rtl:right-auto animate-pulse" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  ExamBuilder
                </span>
              </Link>

              <nav className="hidden md:flex space-x-4 rtl:space-x-reverse">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <LayoutIcon className="w-4 h-4" />
                  <span>{t('nav.dashboard')}</span>
                </Link>
                <Link
                  to="/question-bank"
                  className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{t('features.questionBank')}</span>
                </Link>
                <Link
                  to="/templates"
                  className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Templates</span>
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <LanguageSwitcher />
              <ThemeToggle />
              <div className="hidden sm:flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-700 dark:text-gray-200">
                <User className="w-5 h-5" />
                <span>{user?.firstName} {user?.lastName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t('nav.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
