import { Trash2, Scissors } from 'lucide-react';
import { PageBreakComponent } from '../../../../shared/src/types';

interface PageBreakComponentEditorProps {
  data: PageBreakComponent;
  onChange: (data: PageBreakComponent) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function PageBreakComponentEditor({
  onDelete,
}: PageBreakComponentEditorProps) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Scissors className="w-5 h-5 text-gray-500" />
          <span className="text-gray-600 font-medium">Saut de Page</span>
          <span className="text-xs text-gray-400">(Le contenu suivant commencera sur une nouvelle page)</span>
        </div>
        <button
          onClick={onDelete}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Supprimer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
