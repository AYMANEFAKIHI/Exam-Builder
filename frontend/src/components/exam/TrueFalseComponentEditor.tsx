import { TrueFalseComponent, TrueFalseStatement } from '../../../../shared/src/types';
import { Trash2, Plus, Copy } from 'lucide-react';

interface Props {
  data: TrueFalseComponent;
  onChange: (data: TrueFalseComponent) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function TrueFalseComponentEditor({ data, onChange, onDelete, onDuplicate }: Props) {
  const addStatement = () => {
    const newStatement: TrueFalseStatement = {
      id: `stmt-${Date.now()}`,
      text: '',
      latex: false,
    };
    onChange({
      ...data,
      statements: [...data.statements, newStatement],
    });
  };

  const updateStatement = (index: number, field: keyof TrueFalseStatement, value: any) => {
    const newStatements = [...data.statements];
    newStatements[index] = {
      ...newStatements[index],
      [field]: value,
    };
    onChange({
      ...data,
      statements: newStatements,
    });
  };

  const deleteStatement = (index: number) => {
    onChange({
      ...data,
      statements: data.statements.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="card border-2 border-green-200 bg-green-50/30">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-green-800">Bloc Vrai/Faux</h3>
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
        {/* Display Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Style d'affichage
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={data.displayStyle === 'circles'}
                onChange={() => onChange({ ...data, displayStyle: 'circles' })}
                className="form-radio text-green-600"
              />
              <span className="text-sm">Cercles (○)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={data.displayStyle === 'letters'}
                onChange={() => onChange({ ...data, displayStyle: 'letters' })}
                className="form-radio text-green-600"
              />
              <span className="text-sm">Lettres (V/F)</span>
            </label>
          </div>
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

        {/* Statements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Énoncés
          </label>
          <div className="space-y-2">
            {data.statements.map((statement, index) => (
              <div key={statement.id} className="flex items-start space-x-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={statement.text}
                    onChange={(e) => updateStatement(index, 'text', e.target.value)}
                    placeholder={`Énoncé ${index + 1}`}
                    className="form-input w-full"
                  />
                </div>
                <label className="flex items-center space-x-1 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={statement.latex || false}
                    onChange={(e) => updateStatement(index, 'latex', e.target.checked)}
                    className="form-checkbox h-4 w-4 text-green-600"
                  />
                  <span>LaTeX</span>
                </label>
                <button
                  onClick={() => deleteStatement(index)}
                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addStatement}
            className="mt-2 flex items-center space-x-1 text-sm text-green-600 hover:text-green-700"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un énoncé</span>
          </button>
        </div>

        {/* Preview */}
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded">
          <h4 className="text-sm font-semibold mb-3">Aperçu</h4>
          <div className="space-y-2">
            {data.statements.map((statement, index) => (
              <div key={statement.id} className="flex items-center justify-between">
                <span className="text-sm flex-1">{statement.text || `Énoncé ${index + 1}`}</span>
                <div className="flex items-center space-x-4 ml-4">
                  {data.displayStyle === 'circles' ? (
                    <>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-600">V</span>
                        <div className="w-5 h-5 border-2 border-gray-400 rounded-full"></div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-600">F</span>
                        <div className="w-5 h-5 border-2 border-gray-400 rounded-full"></div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 border-2 border-gray-400 flex items-center justify-center font-semibold text-sm">
                        V
                      </div>
                      <div className="w-8 h-8 border-2 border-gray-400 flex items-center justify-center font-semibold text-sm">
                        F
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
