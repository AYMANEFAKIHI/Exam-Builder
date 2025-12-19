import { Trash2, Copy, Clock, Plus, Calendar, Eye, EyeOff } from 'lucide-react';
import { TimelineComponent, TimelineEvent } from '../../../../shared/src/types';

interface Props {
  data: TimelineComponent;
  onChange: (data: TimelineComponent) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function TimelineComponentEditor({ data, onChange, onDelete, onDuplicate }: Props) {
  const handleChange = (field: keyof TimelineComponent, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const addEvent = () => {
    const newEvent: TimelineEvent = {
      id: `event-${Date.now()}`,
      date: '',
      label: '',
      showDate: true,
      showLabel: true,
    };
    handleChange('events', [...data.events, newEvent]);
  };

  const updateEvent = (index: number, field: keyof TimelineEvent, value: any) => {
    const newEvents = [...data.events];
    newEvents[index] = { ...newEvents[index], [field]: value };
    handleChange('events', newEvents);
  };

  const removeEvent = (index: number) => {
    const newEvents = data.events.filter((_, i) => i !== index);
    handleChange('events', newEvents);
  };

  // Calculate position of event on timeline
  const getEventPosition = (date: string): number => {
    const year = parseInt(date) || data.startYear;
    const range = data.endYear - data.startYear;
    if (range === 0) return 50;
    return ((year - data.startYear) / range) * 100;
  };

  return (
    <div className="card border-2 border-amber-200 bg-amber-50">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-amber-600" />
          <span className="font-semibold text-amber-800">Frise Chronologique</span>
          <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded">Histoire-Géo</span>
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
            Titre de la frise
          </label>
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            className="input"
            placeholder="Ex: Les grandes dates de la Révolution française"
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Année de début
            </label>
            <input
              type="number"
              value={data.startYear}
              onChange={(e) => handleChange('startYear', parseInt(e.target.value) || 0)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Année de fin
            </label>
            <input
              type="number"
              value={data.endYear}
              onChange={(e) => handleChange('endYear', parseInt(e.target.value) || 0)}
              className="input"
            />
          </div>
        </div>

        {/* Events */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Événements ({data.events.length})
            </label>
            <button
              onClick={addEvent}
              className="btn btn-secondary text-sm flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter</span>
            </button>
          </div>

          <div className="space-y-3">
            {data.events.map((event, index) => (
              <div key={event.id} className="bg-white rounded-lg p-3 border border-amber-200">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={event.date}
                      onChange={(e) => updateEvent(index, 'date', e.target.value)}
                      className="input text-sm"
                      placeholder="Date"
                    />
                  </div>
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={event.label}
                      onChange={(e) => updateEvent(index, 'label', e.target.value)}
                      className="input text-sm"
                      placeholder="Événement"
                    />
                  </div>
                  <div className="col-span-3 flex items-center space-x-2">
                    <button
                      onClick={() => updateEvent(index, 'showDate', !event.showDate)}
                      className={`p-1 rounded ${event.showDate ? 'text-amber-600 bg-amber-100' : 'text-gray-400'}`}
                      title={event.showDate ? "Date visible (cliquez pour masquer)" : "Date masquée (l'élève doit la trouver)"}
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateEvent(index, 'showLabel', !event.showLabel)}
                      className={`p-1 rounded ${event.showLabel ? 'text-amber-600 bg-amber-100' : 'text-gray-400'}`}
                      title={event.showLabel ? "Label visible (cliquez pour masquer)" : "Label masqué (l'élève doit le trouver)"}
                    >
                      {event.showLabel ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="col-span-1">
                    <button
                      onClick={() => removeEvent(index)}
                      className="text-red-500 hover:bg-red-100 p-1 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-1 text-xs text-gray-500 flex gap-2">
                  {!event.showDate && <span className="text-amber-600">📝 Date à trouver</span>}
                  {!event.showLabel && <span className="text-amber-600">📝 Événement à trouver</span>}
                </div>
              </div>
            ))}
          </div>
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
          {data.title && <h4 className="text-center font-semibold mb-4">{data.title}</h4>}
          
          <div className="relative py-8">
            {/* Timeline line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-amber-400 transform -translate-y-1/2"></div>
            
            {/* Start/End markers */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 text-xs font-bold text-amber-700">
              {data.startYear}
            </div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-xs font-bold text-amber-700">
              {data.endYear}
            </div>

            {/* Events */}
            {data.events.map((event, index) => {
              const position = getEventPosition(event.date);
              const isTop = index % 2 === 0;
              
              return (
                <div
                  key={event.id}
                  className="absolute transform -translate-x-1/2"
                  style={{ 
                    left: `${Math.min(Math.max(position, 5), 95)}%`,
                    top: isTop ? '0' : '50%',
                  }}
                >
                  <div className={`flex flex-col items-center ${isTop ? '' : 'flex-col-reverse'}`}>
                    <div className={`text-xs text-center max-w-20 ${isTop ? 'mb-1' : 'mt-1'}`}>
                      <div className={`font-semibold ${event.showDate ? '' : 'border-b border-dashed border-gray-400 text-gray-400'}`}>
                        {event.showDate ? event.date : '____'}
                      </div>
                      <div className={`${event.showLabel ? '' : 'border-b border-dashed border-gray-400 text-gray-400'}`}>
                        {event.showLabel ? event.label : '________'}
                      </div>
                    </div>
                    <div className="w-3 h-3 bg-amber-500 rounded-full border-2 border-white shadow"></div>
                    <div className={`w-0.5 ${isTop ? 'h-4' : 'h-4'} bg-amber-400`}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
