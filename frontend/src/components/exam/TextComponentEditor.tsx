import { TextComponent } from '../../../../shared/src/types';
import { X, Type, Copy, Sigma } from 'lucide-react';
import LatexRenderer from './LatexRenderer';

interface TextComponentEditorProps {
  data: TextComponent;
  onChange: (data: TextComponent) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function TextComponentEditor({ data, onChange, onDelete, onDuplicate }: TextComponentEditorProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const insertLatexSample = () => {
    const sample = data.content + (data.content ? '\n' : '') + 
      'Exemples LaTeX:\n' +
      'Inline: $x^2 + y^2 = z^2$\n' +
      'Display: $$\\int_0^1 x^2 dx = \\frac{1}{3}$$';
    handleChange('content', sample);
  };

  return (
    <div className="border-2 border-gray-300 rounded-lg p-6 bg-white">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <Type className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Text Field</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onDuplicate}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
            title="Dupliquer"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="text-red-600 hover:bg-red-50 p-2 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            value={data.content}
            onChange={(e) => handleChange('content', e.target.value)}
            className="input min-h-[100px] font-mono text-sm"
            placeholder="Enter your question or instruction..."
          />
        </div>

        {data.latex && data.content && (
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-indigo-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-indigo-800 flex items-center gap-2">
                <Sigma className="w-4 h-4" />
                Prévisualisation LaTeX
              </p>
            </div>
            <div className="bg-white p-3 rounded border border-indigo-100">
              <LatexRenderer content={data.content} className="text-gray-800" />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={data.latex || false}
                onChange={(e) => handleChange('latex', e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span className="text-sm font-medium">Enable LaTeX</span>
            </label>
            {data.latex && (
              <button
                onClick={insertLatexSample}
                className="text-xs text-indigo-600 hover:text-indigo-800 underline flex items-center gap-1"
              >
                <Sigma className="w-3 h-3" />
                Insérer exemples
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Points:</label>
            <input
              type="number"
              value={data.points || 0}
              onChange={(e) => handleChange('points', parseFloat(e.target.value) || 0)}
              className="input w-20"
              min="0"
              step="0.5"
            />
          </div>
        </div>
        
        {data.latex && (
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            💡 Utilisez $ pour les équations inline et $$ pour les équations display
          </div>
        )}
      </div>
    </div>
  );
}
