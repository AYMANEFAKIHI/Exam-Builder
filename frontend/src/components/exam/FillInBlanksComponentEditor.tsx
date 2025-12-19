import { FillInBlanksComponent } from '../../../../shared/src/types';
import { Trash2, Info, Copy } from 'lucide-react';

interface Props {
  data: FillInBlanksComponent;
  onChange: (data: FillInBlanksComponent) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function FillInBlanksComponentEditor({ data, onChange, onDelete, onDuplicate }: Props) {
  // Function to convert [word] to blank line for preview
  const convertToBlanks = (text: string): string => {
    return text.replace(/\[([^\]]+)\]/g, '___________');
  };

  return (
    <div className="card border-2 border-purple-200 bg-purple-50/30">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-purple-800">Bloc Texte à Trous</h3>
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
        {/* Info Box */}
        <div className="flex items-start space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            <strong>Astuce :</strong> Entourez les mots à masquer par des crochets. Exemple : "La capitale de la France est [Paris]." 
            Ils seront remplacés par des lignes dans le PDF.
          </p>
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

        {/* LaTeX Support */}
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.latex || false}
              onChange={(e) => onChange({ ...data, latex: e.target.checked })}
              className="form-checkbox text-purple-600"
            />
            <span className="text-sm font-medium text-gray-700">Support LaTeX</span>
          </label>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Texte (utilisez [mot] pour créer un trou)
          </label>
          <textarea
            value={data.content}
            onChange={(e) => onChange({ ...data, content: e.target.value })}
            placeholder="La capitale de la France est [Paris]. Elle compte environ [2 millions] d'habitants."
            className="form-textarea w-full h-32 font-mono text-sm"
          />
        </div>

        {/* Preview */}
        <div className="p-4 bg-white border border-gray-200 rounded">
          <h4 className="text-sm font-semibold mb-3">Aperçu (comme dans le PDF)</h4>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {data.content ? convertToBlanks(data.content) : 'Tapez votre texte ci-dessus...'}
          </p>
        </div>
      </div>
    </div>
  );
}
