import React from 'react';
import { ImageComponent } from '../../../../shared/src/types';
import { X, Image as ImageIcon, Upload, Copy } from 'lucide-react';

interface ImageComponentEditorProps {
  data: ImageComponent;
  onChange: (data: ImageComponent) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function ImageComponentEditor({ data, onChange, onDelete, onDuplicate }: ImageComponentEditorProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleChange('imageUrl', event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border-2 border-gray-300 rounded-lg p-6 bg-white">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <ImageIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Image</h3>
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
        {/* Image Upload/Display */}
        {data.imageUrl ? (
          <div className="space-y-3">
            <div className="relative border rounded-lg overflow-hidden bg-gray-50">
              <img
                src={data.imageUrl}
                alt={data.caption || 'Exam image'}
                style={{
                  width: data.width ? `${data.width}px` : 'auto',
                  height: data.height ? `${data.height}px` : 'auto',
                  maxWidth: '100%'
                }}
                className="mx-auto"
              />
              <button
                onClick={() => handleChange('imageUrl', '')}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Width (px)
                </label>
                <input
                  type="number"
                  value={data.width || ''}
                  onChange={(e) => handleChange('width', parseInt(e.target.value) || undefined)}
                  className="input"
                  placeholder="Auto"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (px)
                </label>
                <input
                  type="number"
                  value={data.height || ''}
                  onChange={(e) => handleChange('height', parseInt(e.target.value) || undefined)}
                  className="input"
                  placeholder="Auto"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-3">Upload an image</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm"
            />
          </div>
        )}

        {/* Caption */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Caption (optional)
          </label>
          <input
            type="text"
            value={data.caption || ''}
            onChange={(e) => handleChange('caption', e.target.value)}
            className="input"
            placeholder="Figure 1: Description of the image"
          />
        </div>
      </div>
    </div>
  );
}
