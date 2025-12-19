import { useMemo } from 'react';
import { ExamComponent } from '../../../../shared/src/types';
import { Calculator, Award } from 'lucide-react';

interface ExamSummaryProps {
  components: ExamComponent[];
}

export default function ExamSummary({ components }: ExamSummaryProps) {
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
  };

  if (components.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-lg shadow-2xl border-2 border-indigo-200 overflow-hidden z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5" />
            <h3 className="font-bold text-lg">Résumé de l'examen</h3>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Total Points - Large Display */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border-2 border-indigo-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="w-6 h-6 text-indigo-600" />
              <span className="text-gray-700 font-medium">Total de l'examen</span>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-700">
                {totalPoints.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">points</div>
            </div>
          </div>
        </div>

        {/* Exercise Count */}
        {exerciseCount > 0 && (
          <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">Nombre d'exercices</span>
            <span className="font-semibold text-gray-900">{exerciseCount}</span>
          </div>
        )}

        {/* Component Breakdown */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Détails par type
          </h4>
          <div className="space-y-1">
            {Object.entries(componentBreakdown)
              .filter(([type]) => type !== 'header' && type !== 'image')
              .map(([type, { count, points }]) => (
                <div
                  key={type}
                  className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                    <span className="text-sm text-gray-700">
                      {typeLabels[type] || type}
                    </span>
                    <span className="text-xs text-gray-400">({count})</span>
                  </div>
                  {points > 0 && (
                    <span className="text-sm font-medium text-gray-900">
                      {points.toFixed(1)} pts
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Total Components Count */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Total de composants</span>
            <span className="font-semibold text-gray-900">{components.length}</span>
          </div>
        </div>
      </div>

      {/* Footer Tip */}
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          💡 Les points sont calculés automatiquement
        </p>
      </div>
    </div>
  );
}
