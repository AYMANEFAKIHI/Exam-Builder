import { Trash2, Copy, Grid3X3 } from 'lucide-react';
import { GeometryComponent } from '../../../../shared/src/types';

interface Props {
  data: GeometryComponent;
  onChange: (data: GeometryComponent) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function GeometryComponentEditor({ data, onChange, onDelete, onDuplicate }: Props) {
  const handleChange = (field: keyof GeometryComponent, value: any) => {
    onChange({ ...data, [field]: value });
  };

  // Generate SVG grid pattern based on type
  const renderGridPreview = () => {
    const scale = 0.5; // Scale for preview
    const width = Math.min(data.width * scale, 300);
    const height = Math.min(data.height * scale, 200);
    
    switch (data.gridType) {
      case 'millimeter':
        return (
          <svg width={width} height={height} className="border border-gray-300 bg-white">
            <defs>
              <pattern id="smallGrid" width="2" height="2" patternUnits="userSpaceOnUse">
                <path d="M 2 0 L 0 0 0 2" fill="none" stroke="#cce5ff" strokeWidth="0.3"/>
              </pattern>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <rect width="10" height="10" fill="url(#smallGrid)"/>
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#99ccff" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        );
      
      case 'dots':
        return (
          <svg width={width} height={height} className="border border-gray-300 bg-white">
            <defs>
              <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="5" cy="5" r="0.8" fill="#666"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        );
      
      case 'squares':
        return (
          <svg width={width} height={height} className="border border-gray-300 bg-white">
            <defs>
              <pattern id="squares" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#ddd" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#squares)" />
          </svg>
        );
      
      case 'isometric':
        return (
          <svg width={width} height={height} className="border border-gray-300 bg-white">
            <defs>
              <pattern id="isometric" width="20" height="17.32" patternUnits="userSpaceOnUse">
                <path d="M 0 8.66 L 10 0 L 20 8.66 M 10 17.32 L 10 0" fill="none" stroke="#ddd" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#isometric)" />
          </svg>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="card border-2 border-green-200 bg-green-50">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <Grid3X3 className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-green-800">Zone de Géométrie</span>
          <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Sciences</span>
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
        {/* Grid Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de grille
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: 'millimeter', label: 'Millimétré', desc: 'Pour tracés précis' },
              { value: 'dots', label: 'Points', desc: 'Grille de points' },
              { value: 'squares', label: 'Carreaux', desc: 'Grands carreaux' },
              { value: 'isometric', label: 'Isométrique', desc: 'Perspective 3D' },
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => handleChange('gridType', type.value)}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  data.gridType === type.value
                    ? 'border-green-500 bg-green-100'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="text-sm font-medium">{type.label}</div>
                <div className="text-xs text-gray-500">{type.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Dimensions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Largeur (mm)
            </label>
            <input
              type="number"
              value={data.width}
              onChange={(e) => handleChange('width', parseInt(e.target.value) || 100)}
              className="input"
              min="50"
              max="180"
              step="10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hauteur (mm)
            </label>
            <input
              type="number"
              value={data.height}
              onChange={(e) => handleChange('height', parseInt(e.target.value) || 100)}
              className="input"
              min="30"
              max="250"
              step="10"
            />
          </div>
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Consigne (optionnel)
          </label>
          <input
            type="text"
            value={data.instructions || ''}
            onChange={(e) => handleChange('instructions', e.target.value)}
            className="input"
            placeholder="Ex: Tracer le triangle ABC avec A(0,0), B(3,0), C(1,2)"
          />
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
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Aperçu:</p>
          <div className="flex justify-center p-4 bg-white rounded-lg border">
            {renderGridPreview()}
          </div>
        </div>
      </div>
    </div>
  );
}
