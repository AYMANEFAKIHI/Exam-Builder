import { useMemo, useState } from 'react';
import { ExamComponent } from '../../../../shared/src/types';
import { Calculator, Award, ChevronUp, ChevronDown, X } from 'lucide-react';

interface ExamSummaryProps {
  components: ExamComponent[];
}

export default function ExamSummary({ components }: ExamSummaryProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const totalPoints = useMemo(() => {
    return components.reduce((sum, component) => {
      if ('points' in component && typeof component.points === 'number') {
        return sum + component.points;
      }
      return sum;
    }, 0);
  }, [components]);

  const exerciseCount = useMemo(() => {
    return components.filter(c => c.type === 'exerciseHeader').length;
  }, [components]);

  const componentBreakdown = useMemo(() => {
    const breakdown: { [key: string]: { count: number; points: number } } = {};
    
    components.forEach((component) => {
      const type = component.type;
      const points = ('points' in component && typeof component.points === 'number') 
        ? component.points 
        : 0;
      
      if (!breakdown[type]) {
        breakdown[type] = { count: 0, points: 0 };
      }
      
      breakdown[type].count++;
      breakdown[type].points += points;
    });
    
    return breakdown;
  }, [components]);

  const typeLabels: { [key: string]: string } = {
    text: 'Text',
    qcm: 'QCM',
    trueFalse: 'Vrai/Faux',
    fillInBlanks: 'Texte à trous',
    writingArea: 'Zone rédaction',
    table: 'Tableau',
    exerciseHeader: 'Exercices',
    timeline: 'Frise',
    geometry: 'Géométrie',
    matching: 'Correspondance',
    pageBreak: 'Saut de page',
  };

  if (components.length === 0) {
    return null;
  }

  // Floating button when closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 z-50 flex items-center space-x-2 rtl:space-x-reverse"
      >
        <Calculator className="w-5 h-5" />
        <span className="font-semibold">{totalPoints.toFixed(1)} pts</span>
        <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
          {components.length}
        </span>
      </button>
    );
  }

  return (
    <div 
      className={`fixed bottom-6 right-6 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border-2 border-indigo-200 dark:border-indigo-700 overflow-hidden z-50 transition-all duration-300 ${
        isMinimized ? 'h-auto' : ''
      }`}
    >
      {/* Header - Always visible */}
      <div 
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Calculator className="w-4 h-4" />
            <h3 className="font-bold text-sm">Résumé</h3>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {totalPoints.toFixed(1)} pts
            </span>
          </div>
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(!isMinimized);
              }}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Body */}
      {!isMinimized && (
        <div className="p-3 space-y-3 max-h-80 overflow-y-auto">
          {/* Total Points - Compact Display */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg p-3 border border-indigo-200 dark:border-indigo-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Total</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
                  {totalPoints.toFixed(1)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">pts</span>
              </div>
            </div>
          </div>

          {/* Exercise Count */}
          {exerciseCount > 0 && (
            <div className="flex justify-between items-center py-1.5 px-2 bg-gray-50 dark:bg-slate-700 rounded text-sm">
              <span className="text-gray-600 dark:text-gray-400">Exercices</span>
              <span className="font-semibold text-gray-900 dark:text-white">{exerciseCount}</span>
            </div>
          )}

          {/* Component Breakdown - Compact */}
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Détails
            </h4>
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(componentBreakdown)
                .filter(([type]) => type !== 'header' && type !== 'image' && type !== 'pageBreak')
                .map(([type, { count }]) => (
                  <div
                    key={type}
                    className="flex items-center justify-between py-1 px-2 rounded bg-gray-50 dark:bg-slate-700 text-xs"
                  >
                    <span className="text-gray-700 dark:text-gray-300 truncate">
                      {typeLabels[type] || type}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white ml-1">
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Total Components */}
          <div className="pt-2 border-t border-gray-200 dark:border-slate-600">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600 dark:text-gray-400">Composants</span>
              <span className="font-semibold text-gray-900 dark:text-white">{components.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
