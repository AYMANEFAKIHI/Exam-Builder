
import { TableComponent } from '../../../../shared/src/types';
import { X, Table as TableIcon, Plus, Minus, Copy } from 'lucide-react';

interface TableComponentEditorProps {
  data: TableComponent;
  onChange: (data: TableComponent) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function TableComponentEditor({ data, onChange, onDelete, onDuplicate }: TableComponentEditorProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleHeaderChange = (index: number, value: string) => {
    const newHeaders = [...data.headers];
    newHeaders[index] = value;
    handleChange('headers', newHeaders);
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...data.data];
    if (!newData[rowIndex]) {
      newData[rowIndex] = [];
    }
    newData[rowIndex][colIndex] = value;
    handleChange('data', newData);
  };

  const addRow = () => {
    const newData = [...data.data, new Array(data.columns).fill('')];
    handleChange('data', newData);
    handleChange('rows', data.rows + 1);
  };

  const removeRow = () => {
    if (data.rows > 1) {
      const newData = data.data.slice(0, -1);
      handleChange('data', newData);
      handleChange('rows', data.rows - 1);
    }
  };

  const addColumn = () => {
    const newHeaders = [...data.headers, `Column ${data.columns + 1}`];
    const newData = data.data.map(row => [...row, '']);
    handleChange('headers', newHeaders);
    handleChange('data', newData);
    handleChange('columns', data.columns + 1);
  };

  const removeColumn = () => {
    if (data.columns > 1) {
      const newHeaders = data.headers.slice(0, -1);
      const newData = data.data.map(row => row.slice(0, -1));
      handleChange('headers', newHeaders);
      handleChange('data', newData);
      handleChange('columns', data.columns - 1);
    }
  };

  return (
    <div className="border-2 border-gray-300 rounded-lg p-6 bg-white">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <TableIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Table</h3>
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
        {/* Table Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Rows:</span>
              <button onClick={removeRow} className="btn btn-secondary p-1">
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm">{data.rows}</span>
              <button onClick={addRow} className="btn btn-primary p-1">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Columns:</span>
              <button onClick={removeColumn} className="btn btn-secondary p-1">
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm">{data.columns}</span>
              <button onClick={addColumn} className="btn btn-primary p-1">
                <Plus className="w-4 h-4" />
              </button>
            </div>
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                {data.headers.map((header, index) => (
                  <th key={index} className="border border-gray-300 p-2">
                    <input
                      type="text"
                      value={header}
                      onChange={(e) => handleHeaderChange(index, e.target.value)}
                      className="input text-center"
                      placeholder={`Header ${index + 1}`}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: data.rows }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array.from({ length: data.columns }).map((_, colIndex) => (
                    <td key={colIndex} className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={data.data[rowIndex]?.[colIndex] || ''}
                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                        className="input"
                        placeholder=""
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
