// (File deleted for build cleanup)
import { useState } from 'react';
import { Sparkles, X, Loader2, Wand2, AlertCircle, CheckCircle } from 'lucide-react';
import { generateQuestionsViaAPI, GeneratedQuestion } from '../services/geminiService';
import { ExamComponent } from '../../../shared/src/types';
import { toast } from 'react-toastify';

interface AiMagicButtonProps {
  onQuestionsGenerated: (components: ExamComponent[]) => void;
  currentComponentCount: number;
}

export default function AiMagicButton({ onQuestionsGenerated, currentComponentCount }: AiMagicButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [count, setCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!subject.trim()) {
      setError('Veuillez entrer un sujet');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const questions = await generateQuestionsViaAPI(subject, count, 'fr');
      
      // Convert AI questions to ExamComponent format
      const newComponents: ExamComponent[] = questions.map((q: GeneratedQuestion, index: number) => ({
        id: `qcm-ai-${Date.now()}-${index}`,
        type: 'qcm' as const,
        order: currentComponentCount + index,
        question: q.content,
        options: q.options.map((opt: string, i: number) => ({
          id: `opt-${Date.now()}-${index}-${i}`,
          text: opt,
          isCorrect: q.answer === String.fromCharCode(65 + i),
          latex: false,
        })),
        multipleAnswers: false,
        points: q.points,
        latex: false,
        columns: 1,
      }));

      onQuestionsGenerated(newComponents);
      toast.success(`🎉 ${newComponents.length} questions générées avec succès !`);
      setIsOpen(false);
      setSubject('');
      setError(null);
    } catch (err) {
      console.error('Generation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setIsOpen(false);
      setError(null);
    }
  };

  return (
    <>
      {/* Magic Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full btn text-left flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
      >
        <Sparkles className="w-4 h-4 animate-pulse" />
        <span className="font-medium">Générer avec l'IA</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 p-5">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                    <Wand2 className="w-6 h-6" />
                  </div>
                  Générateur IA Magique
                </h3>
                <button
                  onClick={handleClose}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                  disabled={isLoading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-purple-100 text-sm mt-2">
                Propulsé par Google Gemini 1.5 Flash ⚡
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Subject Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📚 Sujet ou Thème
                </label>
                <textarea
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex: Les équations du second degré niveau 3ème, La photosynthèse, Les guerres napoléoniennes..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              {/* Question Count */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🔢 Nombre de questions
                </label>
                <div className="flex gap-2">
                  {[3, 5, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => setCount(num)}
                      disabled={isLoading}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                        count === num
                          ? 'bg-purple-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {num} questions
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Erreur de génération</p>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
                <p className="text-sm text-purple-800">
                  <strong>💡 Conseils :</strong>
                </p>
                <ul className="text-xs text-purple-700 mt-2 space-y-1">
                  <li>• Précisez le niveau scolaire pour des questions adaptées</li>
                  <li>• Vous pouvez coller un extrait de cours pour des questions ciblées</li>
                  <li>• Les questions générées sont modifiables après import</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !subject.trim()}
                  className="flex-1 btn bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Générer les Questions
                    </>
                  )}
                </button>
                <button
                  onClick={handleClose}
                  className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 py-3 px-6 rounded-xl font-medium transition-all"
                  disabled={isLoading}
                >
                  Annuler
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t">
              <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Gratuit et illimité • Réponses en ~3 secondes
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
