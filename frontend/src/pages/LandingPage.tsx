import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  FileText, 
  Download,
  CheckCircle2,
  ArrowRight,
  Linkedin,
  Github,
  Zap,
  Clock,
  Shield,
  Play,
  BookOpen,
  PenTool,
  Grid3X3,
  MousePointerClick
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Premium Navbar */}
      <Navbar />

      {/* Hero Section - New Copy */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-indigo-50 via-white to-violet-50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-indigo-200">
              <Sparkles className="w-4 h-4" />
              <span>Propulsé par l'IA Gemini de Google</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              L'Examen Parfait,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                en quelques clics.
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Gagnez des heures de préparation grâce à notre éditeur intelligent. 
              <strong className="text-gray-800"> Conçu pour les professeurs exigeants</strong>, propulsé par l'IA.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all"
              >
                <span>Commencer à créer</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#tutorial"
                className="inline-flex items-center justify-center space-x-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-all hover:shadow-lg"
              >
                <Play className="w-5 h-5" />
                <span>Voir la démo</span>
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
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
                <span>Export PDF instantané</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Updated Sales Arguments */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Fonctionnalités</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Pourquoi choisir ExamBuilder ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Les outils dont vous avez toujours rêvé, enfin réunis en un seul endroit.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Maths & Sciences Feature */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 hover:shadow-2xl transition-all hover:-translate-y-2 duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-emerald-500/25">
                <Grid3X3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mathématiques & Sciences</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Intégration native de <strong>LaTeX</strong> et grilles millimétrées pour des sujets 
                de sciences <strong>impeccables</strong>.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Rendu KaTeX professionnel</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>4 types de grilles (mm, points, carrés, iso)</span>
                </li>
              </ul>
            </div>

            {/* AI Feature */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 hover:shadow-2xl transition-all hover:-translate-y-2 duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-violet-500/25">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Assistant IA Gratuit</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Générez des <strong>QCM</strong> et des exercices structurés instantanément 
                grâce à l'intelligence artificielle de <strong>Google Gemini</strong>.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-500 flex-shrink-0" />
                  <span>Questions adaptées au niveau</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-500 flex-shrink-0" />
                  <span>Vrai/Faux, QCM, Textes à trous</span>
                </li>
              </ul>
            </div>

            {/* PDF Export Feature */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 hover:shadow-2xl transition-all hover:-translate-y-2 duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-rose-500/25">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Format Standard PDF</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Exportez vos sujets au format <strong>A4</strong> avec une mise en page 
                académique fixe (Logo, En-tête, Zone Étudiant).
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>Prêt à imprimer</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>Grille de correction incluse</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* More Features Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Support LaTeX</h4>
              <p className="text-sm text-gray-600">Formules mathématiques avec rendu KaTeX professionnel</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Sauvegarde auto</h4>
              <p className="text-sm text-gray-600">Vos examens sont sauvegardés automatiquement</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Banque de questions</h4>
              <p className="text-sm text-gray-600">Organisez et réutilisez vos questions</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <MousePointerClick className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Drag & Drop</h4>
              <p className="text-sm text-gray-600">Interface intuitive par glisser-déposer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tutorial / Demo Section */}
      <section id="tutorial" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Tutoriel</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Créez votre premier examen en 3 étapes
            </h2>
            <p className="text-xl text-gray-600">
              Une interface pensée pour la simplicité et l'efficacité
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Choisissez vos composants</h3>
              <p className="text-gray-600">QCM, Vrai/Faux, Textes, Grilles... glissez-déposez dans votre examen</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Personnalisez le contenu</h3>
              <p className="text-gray-600">Utilisez l'IA pour générer des questions ou rédigez manuellement</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Exportez en PDF</h3>
              <p className="text-gray-600">Un clic et votre examen est prêt à imprimer au format A4</p>
            </div>
          </div>
          
          {/* Demo Preview */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl transform rotate-1 scale-[1.02] opacity-20"></div>
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-4 text-gray-400 text-sm">ExamBuilder - Éditeur</span>
              </div>
              <div className="bg-gray-100 rounded-xl p-8 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <PenTool className="w-8 h-8 text-indigo-600" />
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                    <div className="w-16 h-16 bg-violet-100 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-violet-600" />
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                    <div className="w-16 h-16 bg-rose-100 rounded-xl flex items-center justify-center">
                      <Download className="w-8 h-8 text-rose-600" />
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg font-medium">Éditeur d'examens avec aperçu A4 en temps réel</p>
                  <p className="text-gray-400 mt-2">Glissez-déposez vos composants pour construire l'examen parfait</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Developer Section - Personal Brand */}
      <section id="about" className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">Derrière le projet</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-8">Le Développeur</h2>
          
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl p-10 border border-slate-700/50 shadow-2xl">
            <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30 ring-4 ring-indigo-500/20">
              <span className="text-4xl font-bold">AF</span>
            </div>
            
            <h3 className="text-2xl font-bold mb-2">AYMANE FAKIHI</h3>
            <p className="text-indigo-400 font-medium mb-6">Développeur Full-Stack & Passionné d'EdTech</p>
            
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed text-lg">
              Je suis un développeur passionné par la création d'outils numériques qui simplifient 
              le quotidien des professionnels. Avec <strong className="text-white">ExamBuilder</strong>, mon objectif est de mettre 
              la puissance de l'<strong className="text-indigo-400">IA</strong> et du <strong className="text-indigo-400">développement web moderne</strong> au service de l'éducation.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://www.linkedin.com/in/aymane-fakihi-9a3435335/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 bg-[#0077B5] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#006396] transition-all hover:scale-105 shadow-lg"
              >
                <Linkedin className="w-5 h-5" />
                <span>Me contacter sur LinkedIn</span>
              </a>
              <a
                href="https://github.com/AYMANEFAKIHI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 bg-slate-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-600 transition-all hover:scale-105"
              >
                <Github className="w-5 h-5" />
                <span>Voir mes projets</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtNHY2aDR2LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Prêt à gagner du temps ?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Rejoignez les enseignants qui ont déjà simplifié la création de leurs examens avec ExamBuilder
          </p>
          <Link
            to="/register"
            className="group inline-flex items-center space-x-3 bg-white text-indigo-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:scale-105"
          >
            <span>Créer mon premier examen</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
