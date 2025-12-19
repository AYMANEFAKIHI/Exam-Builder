import { QCMComponent, QCMOption } from '../../../../shared/src/types';
import { X, CheckSquare, Plus, Trash2, Copy, Sigma } from 'lucide-react';
import LatexRenderer from './LatexRenderer';

interface QCMComponentEditorProps {
  data: QCMComponent;
  onChange: (data: QCMComponent) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function QCMComponentEditor({ data, onChange, onDelete, onDuplicate }: QCMComponentEditorProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleOptionChange = (index: number, field: keyof QCMOption, value: any) => {
    const newOptions = [...data.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    handleChange('options', newOptions);
  };

  const addOption = () => {
    const newOption: QCMOption = {
      id: `option-${Date.now()}`,
      text: '',
      isCorrect: false,
      latex: false
    };
    handleChange('options', [...data.options, newOption]);
  };

  const removeOption = (index: number) => {
    if (data.options.length > 2) {
      const newOptions = data.options.filter((_, i) => i !== index);
      handleChange('options', newOptions);
    }
  };

  return (
    <div className="border-2 border-gray-300 rounded-lg p-6 bg-white">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <CheckSquare className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Multiple Choice Question</h3>
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
        {/* Question */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question
          </label>
          <textarea
            value={data.question}
            onChange={(e) => handleChange('question', e.target.value)}
            className="input min-h-[80px] font-mono text-sm"
            placeholder="Enter your question..."
          />
          <label className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              checked={data.latex || false}
              onChange={(e) => handleChange('latex', e.target.checked)}
              className="rounded text-indigo-600"
            />
            <span className="text-sm font-medium">Enable LaTeX in question</span>
          </label>
          
          {data.latex && data.question && (
            <div className="mt-3 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-indigo-200">
              <p className="text-xs font-semibold text-indigo-800 mb-2 flex items-center gap-1">
                <Sigma className="w-3 h-3" />
                Prévisualisation
              </p>
              <div className="bg-white p-2 rounded border border-indigo-100">
                <LatexRenderer content={data.question} className="text-gray-800" />
              </div>
            </div>
          )}
        </div>

        {/* Options */}
        <div>
          <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
            <label className="block text-sm font-medium text-gray-700">
              Answer Options
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={data.multipleAnswers}
                  onChange={(e) => handleChange('multipleAnswers', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Multiple correct answers</span>
              </label>
              <label className="flex items-center space-x-2">
                <select
                  value={data.columns || 1}
                  onChange={(e) => handleChange('columns', parseInt(e.target.value) as 1 | 2)}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value={1}>1 colonne</option>
                  <option value={2}>2 colonnes</option>
                </select>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            {data.options.map((option, index) => (
              <div key={option.id} className="flex items-start space-x-2 p-3 bg-gray-50 rounded border border-gray-200">
                <input
                  type={data.multipleAnswers ? 'checkbox' : 'radio'}
                  checked={option.isCorrect || false}
                  onChange={(e) => {
                    if (data.multipleAnswers) {
                      handleOptionChange(index, 'isCorrect', e.target.checked);
                    } else {
                      // For radio, uncheck all others
                      const newOptions = data.options.map((opt, i) => ({
                        ...opt,
                        isCorrect: i === index
                      }));
                      handleChange('options', newOptions);
                    }
                  }}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                    className="input font-mono text-sm"
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  />
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={option.latex || false}
                      onChange={(e) => handleOptionChange(index, 'latex', e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span className="text-xs font-medium">LaTeX</span>
                  </label>
                  {option.latex && option.text && (
                    <div className="p-2 bg-indigo-50 rounded border border-indigo-200">
                      <LatexRenderer content={option.text} className="text-sm" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeOption(index)}
                  className="text-red-600 hover:bg-red-50 p-1 rounded"
                  disabled={data.options.length <= 2}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button onClick={addOption} className="btn btn-secondary mt-3 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Option</span>
          </button>
        </div>

        {/* Points */}
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
    </div>
  );
}
