import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
  Menu, 
  X, 
  Sparkles,
  FileText,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();
  
  const isEditorPage = location.pathname.includes('/exam');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <div className="relative">
              <GraduationCap className="w-8 h-8 text-indigo-600 group-hover:scale-110 transition-transform" />
              <Sparkles className="w-3 h-3 text-violet-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              ExamBuilder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors relative group"
            >
              Fonctionnalités
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all"></span>
            </button>
            <button
              onClick={() => scrollToSection('tutorial')}
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors relative group"
            >
              Tutoriel
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all"></span>
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors relative group"
            >
              À propos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all"></span>
            </button>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {isEditorPage ? (
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Mes Documents</span>
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  to="/exam/new"
                  className="group relative inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105 transition-all"
                >
                  <span>Créer un examen</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="group relative inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105 transition-all"
                >
                  <span>Commencer</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden fixed inset-0 top-16 bg-white/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col p-6 space-y-6">
          <button
            onClick={() => scrollToSection('features')}
            className="text-left text-lg font-medium text-gray-700 hover:text-indigo-600 transition-colors py-2 border-b border-gray-100"
          >
            Fonctionnalités
          </button>
          <button
            onClick={() => scrollToSection('tutorial')}
            className="text-left text-lg font-medium text-gray-700 hover:text-indigo-600 transition-colors py-2 border-b border-gray-100"
          >
            Tutoriel
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="text-left text-lg font-medium text-gray-700 hover:text-indigo-600 transition-colors py-2 border-b border-gray-100"
          >
            À propos
          </button>

          <div className="pt-6 space-y-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full py-3 text-gray-700 font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  <span>Mes Documents</span>
                </Link>
                <Link
                  to="/exam/new"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl shadow-lg"
                >
                  <span>Créer un examen</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full py-3 text-center text-gray-700 font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl shadow-lg"
                >
                  <span>Commencer gratuitement</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
