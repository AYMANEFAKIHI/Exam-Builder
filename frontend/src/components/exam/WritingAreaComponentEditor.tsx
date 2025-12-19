import { WritingAreaComponent } from '../../../../shared/src/types';
import { Trash2, Copy } from 'lucide-react';

interface Props {
  data: WritingAreaComponent;
  onChange: (data: WritingAreaComponent) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function WritingAreaComponentEditor({ data, onChange, onDelete, onDuplicate }: Props) {
  return (
    <div className="card border-2 border-orange-200 bg-orange-50/30">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-orange-800">Zone de Rédaction Scannée</h3>
        <div className="flex space-x-2">
          <button
            onClick={onDuplicate}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
            title="Dupliquer"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Line Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Style de lignes
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={data.lineStyle === 'ruled'}
                onChange={() => onChange({ ...data, lineStyle: 'ruled' })}
                className="form-radio text-orange-600"
              />
              <span className="text-sm">Lignes (type cahier)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={data.lineStyle === 'grid'}
                onChange={() => onChange({ ...data, lineStyle: 'grid' })}
                className="form-radio text-orange-600"
              />
              <span className="text-sm">Petits carreaux</span>
            </label>
          </div>
        </div>

        {/* Line Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de lignes
          </label>
          <select
            value={data.lineCount}
            onChange={(e) => onChange({ ...data, lineCount: parseInt(e.target.value) })}
            className="form-select w-48"
          >
            <option value={5}>5 lignes</option>
            <option value={10}>10 lignes</option>
            <option value={15}>15 lignes</option>
            <option value={20}>20 lignes</option>
            <option value={25}>25 lignes</option>
            <option value={30}>30 lignes</option>
          </select>
        </div>

        {/* Points */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Points
          </label>
          <input
            type="number"
            value={data.points || 0}
            onChange={(e) => onChange({ ...data, points: parseFloat(e.target.value) || 0 })}
            className="form-input w-24"
            min="0"
            step="0.5"
          />
        </div>

        {/* Preview */}
        <div className="p-4 bg-white border border-gray-200 rounded overflow-hidden">
          <h4 className="text-sm font-semibold mb-3">Aperçu</h4>
          <div 
            className="border-2 border-gray-300 rounded"
            style={{
              minHeight: `${data.lineCount * 24}px`,
              background: data.lineStyle === 'ruled' 
                ? `repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 23px,
                    #e5e7eb 23px,
                    #e5e7eb 24px
                  )`
                : `repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 19px,
                    #e5e7eb 19px,
                    #e5e7eb 20px
                  ),
                  repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 19px,
                    #e5e7eb 19px,
                    #e5e7eb 20px
                  )`,
            }}
          >
            {data.lineStyle === 'ruled' ? (
              <div className="p-4 text-xs text-gray-400">
                Zone de réponse avec {data.lineCount} lignes
              </div>
            ) : (
              <div className="p-4 text-xs text-gray-400">
                Zone de réponse avec {data.lineCount} lignes (carreaux)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
