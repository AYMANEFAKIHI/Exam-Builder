import { Linkedin, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <GraduationCap className="w-6 h-6 text-indigo-400" />
            <span className="text-lg font-semibold text-white">ExamBuilder</span>
          </div>

          {/* Developer Credit */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
            <span>{t('footer.developedBy')}</span>
            <a
              href="https://www.linkedin.com/in/aymane-fakihi-9a3435335/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 rtl:space-x-reverse text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
            >
              <span>AYMANE FAKIHI</span>
              <Linkedin className="w-4 h-4" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-sm text-slate-400">
            © {new Date().getFullYear()} ExamBuilder - {t('footer.rights')}
          </div>
        </div>

        {/* Bottom bar with gradient */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 rtl:sm:space-x-reverse text-xs text-slate-500">
            <span>🎓 {t('footer.education')}</span>
            <span className="hidden sm:block">•</span>
            <span>📄 {t('footer.pdfExport')}</span>
            <span className="hidden sm:block">•</span>
            {/* AI-powered text removed */}
          </div>
        </div>
      </div>
    </footer>
  );
}
