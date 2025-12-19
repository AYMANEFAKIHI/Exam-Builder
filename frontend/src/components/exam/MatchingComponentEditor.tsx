import { Trash2, Copy, Link2, Plus, Shuffle } from 'lucide-react';
import { MatchingComponent, MatchingItem } from '../../../../shared/src/types';

interface Props {
  data: MatchingComponent;
  onChange: (data: MatchingComponent) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function MatchingComponentEditor({ data, onChange, onDelete, onDuplicate }: Props) {
  const handleChange = (field: keyof MatchingComponent, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const addPair = () => {
    const id = `item-${Date.now()}`;
    const newLeftItem: MatchingItem = { id: `left-${id}`, text: '' };
    const newRightItem: MatchingItem = { id: `right-${id}`, text: '' };
    
    handleChange('leftColumn', [...data.leftColumn, newLeftItem]);
    onChange({
      ...data,
      leftColumn: [...data.leftColumn, newLeftItem],
      rightColumn: [...data.rightColumn, newRightItem],
    });
  };

  const updateLeftItem = (index: number, text: string) => {
    const newItems = [...data.leftColumn];
    newItems[index] = { ...newItems[index], text };
    handleChange('leftColumn', newItems);
  };

  const updateRightItem = (index: number, text: string) => {
    const newItems = [...data.rightColumn];
    newItems[index] = { ...newItems[index], text };
    handleChange('rightColumn', newItems);
  };

  const removePair = (index: number) => {
    const newLeftColumn = data.leftColumn.filter((_, i) => i !== index);
    const newRightColumn = data.rightColumn.filter((_, i) => i !== index);
    onChange({
      ...data,
      leftColumn: newLeftColumn,
      rightColumn: newRightColumn,
    });
  };

  return (
    <div className="card border-2 border-purple-200 bg-purple-50">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <Link2 className="w-5 h-5 text-purple-600" />
          <span className="font-semibold text-purple-800">Mise en Correspondance</span>
          <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">Langues</span>
        </div>
        <div className="flex space-x-2">
          <button onClick={onDuplicate} className="text-gray-600 hover:bg-gray-200 p-1 rounded" title="Duplicate">
            <Copy className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="text-red-600 hover:bg-red-100 p-1 rounded" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre (optionnel)
          </label>
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            className="input"
            placeholder="Ex: Reliez chaque mot à sa définition"
          />
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Consigne
          </label>
          <input
            type="text"
            value={data.instructions || ''}
            onChange={(e) => handleChange('instructions', e.target.value)}
            className="input"
            placeholder="Ex: Reliez les éléments de la colonne de gauche à ceux de droite"
          />
        </div>

        {/* Column Headers and Items */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Paires ({data.leftColumn.length})
            </label>
            <button
              onClick={addPair}
              className="btn btn-secondary text-sm flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une paire</span>
            </button>
          </div>

          {/* Headers */}
          <div className="grid grid-cols-12 gap-2 mb-2">
            <div className="col-span-1 text-center text-xs font-bold text-gray-500">#</div>
            <div className="col-span-5 text-sm font-medium text-gray-700">Colonne Gauche</div>
            <div className="col-span-5 text-sm font-medium text-gray-700">Colonne Droite</div>
            <div className="col-span-1"></div>
          </div>

          {/* Items */}
          <div className="space-y-2">
            {data.leftColumn.map((leftItem, index) => (
              <div key={leftItem.id} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-1 text-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-200 text-purple-800 rounded-full text-sm font-bold">
                    {index + 1}
                  </span>
                </div>
                <div className="col-span-5">
                  <input
                    type="text"
                    value={leftItem.text}
                    onChange={(e) => updateLeftItem(index, e.target.value)}
                    className="input text-sm"
                    placeholder={`Élément ${index + 1}`}
                  />
                </div>
                <div className="col-span-5">
                  <input
                    type="text"
                    value={data.rightColumn[index]?.text || ''}
                    onChange={(e) => updateRightItem(index, e.target.value)}
                    className="input text-sm"
                    placeholder={`Correspondance ${index + 1}`}
                  />
                </div>
                <div className="col-span-1">
                  <button
                    onClick={() => removePair(index)}
                    className="text-red-500 hover:bg-red-100 p-1 rounded"
                    disabled={data.leftColumn.length <= 2}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shuffle Option */}
        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
          <Shuffle className="w-5 h-5 text-purple-600" />
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.shuffleRight}
              onChange={(e) => handleChange('shuffleRight', e.target.checked)}
              className="rounded text-purple-600"
            />
            <span className="text-sm">Mélanger automatiquement la colonne de droite dans le PDF</span>
          </label>
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

        {/* Preview */}
        <div className="mt-4 p-4 bg-white rounded-lg border">
          <p className="text-sm font-medium text-gray-700 mb-3">Aperçu:</p>
          
          {data.title && <h4 className="font-semibold mb-2">{data.title}</h4>}
          {data.instructions && <p className="text-sm text-gray-600 mb-4 italic">{data.instructions}</p>}
          
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-3">
              {data.leftColumn.map((item, index) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-sm">{item.text || '...'}</span>
                  <span className="flex-1 border-b border-dotted border-gray-300"></span>
                </div>
              ))}
            </div>

            {/* Right Column (potentially shuffled) */}
            <div className="space-y-3">
              {data.rightColumn.map((item, index) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-700 rounded-full text-sm font-bold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-sm">{item.text || '...'}</span>
                </div>
              ))}
            </div>
          </div>
          
          {data.shuffleRight && (
            <p className="text-xs text-purple-600 mt-3 italic">
              ⚠️ L'ordre de la colonne de droite sera mélangé dans le PDF final
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
