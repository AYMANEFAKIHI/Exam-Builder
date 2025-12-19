import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  GraduationCap, 
  Menu, 
  X, 
  Sparkles,
  FileText,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  
  const isEditorPage = location.pathname.includes('/exam');
  const isLandingPage = location.pathname === '/';

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100/50 dark:border-slate-700/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <div className="relative">
              <GraduationCap className="w-8 h-8 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
              <Sparkles className="w-3 h-3 text-violet-500 absolute -top-1 -right-1 rtl:-left-1 rtl:right-auto animate-pulse" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              ExamBuilder
            </span>
          </Link>

          {/* Desktop Navigation - Only show on landing page */}
          {isLandingPage && (
            <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors relative group"
              >
                {t('nav.features')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 group-hover:w-full transition-all"></span>
              </button>
              <button
                onClick={() => scrollToSection('tutorial')}
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors relative group"
              >
                {t('nav.tutorial')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 group-hover:w-full transition-all"></span>
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors relative group"
              >
                {t('nav.about')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 group-hover:w-full transition-all"></span>
              </button>
            </div>
          )}

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-3 rtl:space-x-reverse">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Theme Toggle */}
            <ThemeToggle />

            {user ? (
              <>
                {isEditorPage ? (
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{t('nav.myDocuments')}</span>
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                  >
                    {t('nav.dashboard')}
                  </Link>
                )}
                <Link
                  to="/exam/new"
                  className="group relative inline-flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105 transition-all"
                >
                  <span>{t('nav.createExam')}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180 transition-transform" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="group relative inline-flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105 transition-all"
                >
                  <span>{t('nav.register')}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180 transition-transform" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2 rtl:space-x-reverse">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden fixed inset-0 top-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full'
        }`}
      >
        <div className="flex flex-col p-6 space-y-6">
          {isLandingPage && (
            <>
              <button
                onClick={() => scrollToSection('features')}
                className="text-left rtl:text-right text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-2 border-b border-gray-100 dark:border-slate-700"
              >
                {t('nav.features')}
              </button>
              <button
                onClick={() => scrollToSection('tutorial')}
                className="text-left rtl:text-right text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-2 border-b border-gray-100 dark:border-slate-700"
              >
                {t('nav.tutorial')}
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-left rtl:text-right text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-2 border-b border-gray-100 dark:border-slate-700"
              >
                {t('nav.about')}
              </button>
            </>
          )}

          <div className="pt-6 space-y-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 rtl:space-x-reverse w-full py-3 text-gray-700 dark:text-gray-200 font-medium border border-gray-200 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  <span>{t('nav.myDocuments')}</span>
                </Link>
                <Link
                  to="/exam/new"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 rtl:space-x-reverse w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl shadow-lg"
                >
                  <span>{t('nav.createExam')}</span>
                  <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full py-3 text-center text-gray-700 dark:text-gray-200 font-medium border border-gray-200 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 rtl:space-x-reverse w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl shadow-lg"
                >
                  <span>{t('nav.register')}</span>
                  <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
