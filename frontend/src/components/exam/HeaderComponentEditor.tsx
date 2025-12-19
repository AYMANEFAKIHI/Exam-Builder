
import { HeaderComponent } from '../../../../shared/src/types';
import { Upload, X, Copy } from 'lucide-react';

interface HeaderComponentEditorProps {
  data: HeaderComponent;
  onChange: (data: HeaderComponent) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function HeaderComponentEditor({ data, onChange, onDelete, onDuplicate }: HeaderComponentEditorProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleStudentFieldChange = (field: string, value: boolean) => {
    onChange({
      ...data,
      studentFields: { ...data.studentFields, [field]: value }
    });
  };

  return (
    <div className="border-2 border-gray-300 rounded-lg p-6 bg-white">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Exam Header</h3>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Logo Upload */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            School Logo
          </label>
          {data.logo ? (
            <div className="relative w-32 h-32 border rounded">
              <img src={data.logo} alt="Logo" className="w-full h-full object-contain" />
              <button
                onClick={() => handleChange('logo', '')}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      handleChange('logo', event.target?.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="text-sm"
              />
            </div>
          )}
        </div>

        {/* Exam Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exam Title
          </label>
          <input
            type="text"
            value={data.examTitle}
            onChange={(e) => handleChange('examTitle', e.target.value)}
            className="input"
            placeholder="Mathematics Final Exam"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Academic Year
          </label>
          <input
            type="text"
            value={data.academicYear}
            onChange={(e) => handleChange('academicYear', e.target.value)}
            className="input"
            placeholder="2024-2025"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Semester
          </label>
          <input
            type="text"
            value={data.semester}
            onChange={(e) => handleChange('semester', e.target.value)}
            className="input"
            placeholder="Fall 2024"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <input
            type="text"
            value={data.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
            className="input"
            placeholder="2 hours"
          />
        </div>

        {/* Student Fields */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student Information Fields
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={data.studentFields.name}
                onChange={(e) => handleStudentFieldChange('name', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Name</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={data.studentFields.firstName}
                onChange={(e) => handleStudentFieldChange('firstName', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">First Name</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={data.studentFields.classGroup}
                onChange={(e) => handleStudentFieldChange('classGroup', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Class/Group</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
