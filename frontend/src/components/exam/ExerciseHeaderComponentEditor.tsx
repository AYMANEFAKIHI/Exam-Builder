import { ExerciseHeaderComponent } from '../../../../shared/src/types';
import { Trash2, Copy } from 'lucide-react';

interface Props {
  data: ExerciseHeaderComponent;
  onChange: (data: ExerciseHeaderComponent) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function ExerciseHeaderComponentEditor({ data, onChange, onDelete, onDuplicate }: Props) {
  return (
    <div className="card border-2 border-indigo-200 bg-indigo-50/30">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-indigo-800">Exercice avec Barème</h3>
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
        {/* Exercise Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de l'exercice
          </label>
          <input
            type="number"
            value={data.exerciseNumber}
            onChange={(e) => onChange({ ...data, exerciseNumber: parseInt(e.target.value) || 1 })}
            className="form-input w-24"
            min="1"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre de l'exercice
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            placeholder="Analyse de circuit"
            className="form-input w-full"
          />
        </div>

        {/* Points */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Points
          </label>
          <input
            type="number"
            value={data.points}
            onChange={(e) => onChange({ ...data, points: parseFloat(e.target.value) || 0 })}
            className="form-input w-24"
            min="0"
            step="0.5"
          />
        </div>

        {/* Preview */}
        <div className="mt-4 p-4 bg-white border-2 border-indigo-200 rounded">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">
              Exercice {data.exerciseNumber}{data.title && ` : ${data.title}`}
            </h3>
            <div className="px-4 py-2 bg-indigo-100 rounded-lg">
              <span className="text-lg font-bold text-indigo-900">
                / {data.points} pts
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
