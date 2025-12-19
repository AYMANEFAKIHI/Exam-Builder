import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Sparkles, 
  FileText, 
  Languages, 
  Calculator, 
  FlaskConical,
  Download,
  CheckCircle2,
  ArrowRight,
  Linkedin,
  Github,
  Zap,
  Clock,
  Shield
} from 'lucide-react';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">ExamBuilder</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25"
              >
                Commencer gratuitement
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Propulsé par l'Intelligence Artificielle</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Créez des examens professionnels en{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
                quelques minutes
              </span>
              , pas en quelques heures
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              L'outil ultime pour les enseignants. Générez des questions avec l'IA, 
              ajoutez des formules LaTeX, et exportez des PDF prêts à imprimer.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center space-x-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/30 hover:shadow-2xl hover:shadow-primary-600/40 hover:-translate-y-0.5"
              >
                <span>Créer mon premier examen</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center space-x-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-primary-300 hover:text-primary-600 transition-all"
              >
                <span>Découvrir les fonctionnalités</span>
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>100% Gratuit</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <span>Données sécurisées</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>IA Gemini intégrée</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin pour créer des examens parfaits
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des outils puissants conçus spécifiquement pour les enseignants
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* AI Feature */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">IA Générative</h3>
              <p className="text-gray-600 mb-4">
                Laissez l'intelligence artificielle Google Gemini rédiger vos questions. 
                QCM, Vrai/Faux, textes à trous... en un clic.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500" />
                  <span>Questions adaptées au niveau</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500" />
                  <span>Plusieurs types de questions</span>
                </li>
              </ul>
            </div>

            {/* Multi-subject Feature */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Languages className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-matières</h3>
              <p className="text-gray-600 mb-4">
                Des outils spécialisés pour chaque discipline : grilles géométriques, 
                frises chronologiques, exercices de correspondance.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">
                  <Calculator className="w-3 h-3" />
                  <span>Maths</span>
                </span>
                <span className="inline-flex items-center space-x-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  <Languages className="w-3 h-3" />
                  <span>Langues</span>
                </span>
                <span className="inline-flex items-center space-x-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                  <FlaskConical className="w-3 h-3" />
                  <span>Sciences</span>
                </span>
              </div>
            </div>

            {/* PDF Export Feature */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Download className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Export PDF</h3>
              <p className="text-gray-600 mb-4">
                Un rendu propre et professionnel au format A4. 
                Prêt à imprimer avec numérotation automatique et filigrane.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-500" />
                  <span>Format A4 optimisé</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-500" />
                  <span>Grille de correction</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* More Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <FileText className="w-10 h-10 text-primary-600 mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Support LaTeX</h4>
              <p className="text-sm text-gray-600">Formules mathématiques avec rendu KaTeX professionnel</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <Clock className="w-10 h-10 text-primary-600 mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Sauvegarde auto</h4>
              <p className="text-sm text-gray-600">Vos examens sont sauvegardés automatiquement</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <GraduationCap className="w-10 h-10 text-primary-600 mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Banque de questions</h4>
              <p className="text-sm text-gray-600">Organisez et réutilisez vos questions</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <Zap className="w-10 h-10 text-primary-600 mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Drag & Drop</h4>
              <p className="text-sm text-gray-600">Interface intuitive par glisser-déposer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Screenshot Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Une interface intuitive et moderne
            </h2>
            <p className="text-xl text-gray-600">
              Construisez vos examens visuellement avec un aperçu en temps réel
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl transform rotate-1 scale-[1.02] opacity-20"></div>
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="bg-gray-100 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <GraduationCap className="w-20 h-20 text-primary-600 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Éditeur d'examens avec aperçu A4 en temps réel</p>
                  <p className="text-gray-400 mt-2">Glissez-déposez vos composants pour construire l'examen parfait</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Developer Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">À propos du développeur</h2>
          
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold">AF</span>
            </div>
            
            <h3 className="text-2xl font-bold mb-2">AYMANE FAKIHI</h3>
            <p className="text-primary-400 mb-4">Développeur Full-Stack & Passionné d'EdTech</p>
            
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto leading-relaxed">
              Convaincu que la technologie peut transformer l'éducation, j'ai créé ExamBuilder 
              pour aider les enseignants à se concentrer sur ce qui compte vraiment : 
              l'accompagnement de leurs élèves. Cet outil est le fruit de ma passion pour 
              le développement web et mon respect profond pour le métier d'enseignant.
            </p>
            
            <div className="flex justify-center space-x-4">
              <a
                href="https://www.linkedin.com/in/aymane-fakihi-9a3435335/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-[#0077B5] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#006396] transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com/AYMANEFAKIHI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-slate-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-600 transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à révolutionner la création de vos examens ?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Rejoignez les enseignants qui gagnent du temps avec ExamBuilder
          </p>
          <Link
            to="/register"
            className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-xl"
          >
            <span>Commencer maintenant</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
