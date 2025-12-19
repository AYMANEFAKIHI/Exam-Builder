import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExamStore } from '../store/examStore';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { ExamComponent, ComponentType } from '../../../shared/src/types';
import { Save, Download, Plus, GripVertical, Scissors, Sparkles, X, Loader2 } from 'lucide-react';
import HeaderComponentEditor from '../components/exam/HeaderComponentEditor';
import TextComponentEditor from '../components/exam/TextComponentEditor';
import TableComponentEditor from '../components/exam/TableComponentEditor';
import QCMComponentEditor from '../components/exam/QCMComponentEditor';
import ImageComponentEditor from '../components/exam/ImageComponentEditor';
import TrueFalseComponentEditor from '../components/exam/TrueFalseComponentEditor';
import FillInBlanksComponentEditor from '../components/exam/FillInBlanksComponentEditor';
import WritingAreaComponentEditor from '../components/exam/WritingAreaComponentEditor';
import ExerciseHeaderComponentEditor from '../components/exam/ExerciseHeaderComponentEditor';
import PageBreakComponentEditor from '../components/exam/PageBreakComponentEditor';
import ExamSummary from '../components/exam/ExamSummary';
import { generatePDF } from '../utils/pdfGenerator';
import { toast } from 'react-toastify';

// Auto-save key for localStorage
const AUTO_SAVE_KEY = 'exam_builder_autosave';

export default function ExamBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentExam, fetchExam, createExam, updateExam, setCurrentExam, updateComponents } = useExamStore();
  const [title, setTitle] = useState('Untitled Exam');
  const [components, setComponents] = useState<ExamComponent[]>([]);
  
  // Export options state
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [hidePoints, setHidePoints] = useState(false);
  const [watermark, setWatermark] = useState('');
  const [autoNumbering, setAutoNumbering] = useState(true);
  
  // Auto-save indicator
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // AI Generator state
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiSubject, setAiSubject] = useState('');
  const [aiCount, setAiCount] = useState(5);
  const [aiLoading, setAiLoading] = useState(false);

  // Auto-save to localStorage
  const autoSave = useCallback(() => {
    const autoSaveData = {
      id: id || 'new',
      title,
      components,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(autoSaveData));
    setLastSaved(new Date());
  }, [id, title, components]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [autoSave]);

  // Save on component/title change (debounced)
  useEffect(() => {
    const timeout = setTimeout(autoSave, 2000);
    return () => clearTimeout(timeout);
  }, [title, components, autoSave]);

  // Restore from auto-save on mount
  useEffect(() => {
    const savedData = localStorage.getItem(AUTO_SAVE_KEY);
    if (savedData && (!id || id === 'new')) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.id === (id || 'new') && parsed.components?.length > 0) {
          const savedTime = new Date(parsed.savedAt);
          const timeDiff = Date.now() - savedTime.getTime();
          // Only restore if saved within last 24 hours
          if (timeDiff < 24 * 60 * 60 * 1000) {
            const restore = window.confirm(
              `Une sauvegarde automatique a été trouvée (${savedTime.toLocaleString()}). Voulez-vous la restaurer ?`
            );
            if (restore) {
              setTitle(parsed.title);
              setComponents(parsed.components);
              toast.info('Brouillon restauré');
            }
          }
        }
      } catch (e) {
        console.error('Failed to parse auto-save data:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (id && id !== 'new') {
      fetchExam(id);
    } else {
      setCurrentExam(null);
      setComponents([]);
      setTitle('Untitled Exam');
    }
  }, [id]);

  useEffect(() => {
    if (currentExam) {
      setTitle(currentExam.title);
      setComponents(currentExam.components || []);
    }
  }, [currentExam]);

  const handleSave = async () => {
    try {
      if (!currentExam || id === 'new') {
        const exam = await createExam({
          title,
          components,
        });
        navigate(`/exam/${exam.id}`);
      } else {
        await updateExam(currentExam.id, {
          title,
          components,
        });
      }
    } catch (error) {
      console.error('Failed to save exam:', error);
    }
  };

  const handleExportPDF = async () => {
    if (components.length === 0) {
      alert('Add components to your exam before exporting');
      return;
    }
    await generatePDF(title, components, { hidePoints, watermark, autoNumbering });
  };

  // AI Question Generator
  const handleGenerateWithAI = async () => {
    if (!aiSubject.trim()) {
      toast.error('Veuillez entrer un sujet');
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: aiSubject, count: aiCount, language: 'fr' }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || error.error || 'Erreur lors de la génération');
      }

      const data = await response.json();
      
      if (data.questions && Array.isArray(data.questions)) {
        // Convert AI questions to QCM components
        const newComponents: ExamComponent[] = data.questions.map((q: any, index: number) => ({
          id: `qcm-ai-${Date.now()}-${index}`,
          type: 'qcm' as const,
          order: components.length + index,
          question: q.question,
          options: q.options.map((opt: string, i: number) => ({
            id: `opt-${Date.now()}-${index}-${i}`,
            text: opt,
            isCorrect: q.correctAnswer === String.fromCharCode(65 + i),
            latex: false,
          })),
          multipleAnswers: false,
          points: q.points || 2,
          latex: false,
          columns: 1,
        }));

        setComponents([...components, ...newComponents]);
        updateComponents([...components, ...newComponents]);
        toast.success(`${newComponents.length} questions générées avec succès !`);
        setShowAIModal(false);
        setAiSubject('');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la génération');
    } finally {
      setAiLoading(false);
    }
  };

  const addComponent = (type: ComponentType) => {
    const newComponent: ExamComponent = createDefaultComponent(type);
    setComponents([...components, newComponent]);
    updateComponents([...components, newComponent]);
  };

  const createDefaultComponent = (type: ComponentType): ExamComponent => {
    const baseComponent = {
      id: `${type}-${Date.now()}`,
      type,
      order: components.length,
    };

    switch (type) {
      case 'header':
        return {
          ...baseComponent,
          type: 'header',
          examTitle: '',
          academicYear: '',
          semester: '',
          duration: '',
          studentFields: { name: true, firstName: true, classGroup: true },
        };
      case 'text':
        return {
          ...baseComponent,
          type: 'text',
          content: '',
          points: 0,
          latex: false,
        };
      case 'table':
        return {
          ...baseComponent,
          type: 'table',
          rows: 3,
          columns: 3,
          headers: ['Column 1', 'Column 2', 'Column 3'],
          data: [['', '', ''], ['', '', ''], ['', '', '']],
          points: 0,
        };
      case 'qcm':
        return {
          ...baseComponent,
          type: 'qcm',
          question: '',
          options: [
            { id: 'opt-1', text: '', isCorrect: false },
            { id: 'opt-2', text: '', isCorrect: false },
            { id: 'opt-3', text: '', isCorrect: false },
            { id: 'opt-4', text: '', isCorrect: false },
          ],
          multipleAnswers: false,
          points: 0,
          latex: false,
          columns: 1,
        };
      case 'image':
        return {
          ...baseComponent,
          type: 'image',
          imageUrl: '',
          caption: '',
        };
      case 'trueFalse':
        return {
          ...baseComponent,
          type: 'trueFalse',
          statements: [
            { id: 'stmt-1', text: '', latex: false },
            { id: 'stmt-2', text: '', latex: false },
            { id: 'stmt-3', text: '', latex: false },
          ],
          displayStyle: 'circles',
          points: 0,
        };
      case 'fillInBlanks':
        return {
          ...baseComponent,
          type: 'fillInBlanks',
          content: '',
          points: 0,
          latex: false,
        };
      case 'writingArea':
        return {
          ...baseComponent,
          type: 'writingArea',
          lineCount: 10,
          lineStyle: 'ruled',
          points: 0,
        };
      case 'exerciseHeader':
        return {
          ...baseComponent,
          type: 'exerciseHeader',
          exerciseNumber: 1,
          title: '',
          points: 0,
        };
      case 'pageBreak':
        return {
          ...baseComponent,
          type: 'pageBreak',
        };
      default:
        throw new Error(`Unknown component type: ${type}`);
    }
  };

  const updateComponent = (index: number, updatedComponent: ExamComponent) => {
    const newComponents = [...components];
    newComponents[index] = updatedComponent;
    setComponents(newComponents);
    updateComponents(newComponents);
  };

  const deleteComponent = (index: number) => {
    const newComponents = components.filter((_, i) => i !== index);
    setComponents(newComponents);
    updateComponents(newComponents);
  };

  const duplicateComponent = (index: number) => {
    const componentToDuplicate = components[index];
    const newComponent = {
      ...componentToDuplicate,
      id: `${componentToDuplicate.type}-${Date.now()}`,
      order: components.length,
    };
    const newComponents = [...components, newComponent];
    setComponents(newComponents);
    updateComponents(newComponents);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setComponents(updatedItems);
    updateComponents(updatedItems);
  };

  const renderComponent = (component: ExamComponent, index: number) => {
    switch (component.type) {
      case 'header':
        return (
          <HeaderComponentEditor
            data={component}
            onChange={(data) => updateComponent(index, data)}
            onDelete={() => deleteComponent(index)}
            onDuplicate={() => duplicateComponent(index)}
          />
        );
      case 'text':
        return (
          <TextComponentEditor
            data={component}
            onChange={(data) => updateComponent(index, data)}
            onDelete={() => deleteComponent(index)}
            onDuplicate={() => duplicateComponent(index)}
          />
        );
      case 'table':
        return (
          <TableComponentEditor
            data={component}
            onChange={(data) => updateComponent(index, data)}
            onDelete={() => deleteComponent(index)}
            onDuplicate={() => duplicateComponent(index)}
          />
        );
      case 'qcm':
        return (
          <QCMComponentEditor
            data={component}
            onChange={(data) => updateComponent(index, data)}
            onDelete={() => deleteComponent(index)}
            onDuplicate={() => duplicateComponent(index)}
          />
        );
      case 'image':
        return (
          <ImageComponentEditor
            data={component}
            onChange={(data) => updateComponent(index, data)}
            onDelete={() => deleteComponent(index)}
            onDuplicate={() => duplicateComponent(index)}
          />
        );
      case 'trueFalse':
        return (
          <TrueFalseComponentEditor
            data={component}
            onChange={(data) => updateComponent(index, data)}
            onDelete={() => deleteComponent(index)}
            onDuplicate={() => duplicateComponent(index)}
          />
        );
      case 'fillInBlanks':
        return (
          <FillInBlanksComponentEditor
            data={component}
            onChange={(data) => updateComponent(index, data)}
            onDelete={() => deleteComponent(index)}
            onDuplicate={() => duplicateComponent(index)}
          />
        );
      case 'writingArea':
        return (
          <WritingAreaComponentEditor
            data={component}
            onChange={(data) => updateComponent(index, data)}
            onDelete={() => deleteComponent(index)}
            onDuplicate={() => duplicateComponent(index)}
          />
        );
      case 'exerciseHeader':
        return (
          <ExerciseHeaderComponentEditor
            data={component}
            onChange={(data) => updateComponent(index, data)}
            onDelete={() => deleteComponent(index)}
            onDuplicate={() => duplicateComponent(index)}
          />
        );
      case 'pageBreak':
        return (
          <PageBreakComponentEditor
            data={component}
            onChange={(data) => updateComponent(index, data)}
            onDelete={() => deleteComponent(index)}
            onDuplicate={() => duplicateComponent(index)}
          />
        );
      default:
        return null;
    }
  };

  const totalPoints = components.reduce((sum, comp) => {
    return sum + (('points' in comp && comp.points) ? comp.points : 0);
  }, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex-1 mr-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl font-bold text-gray-900 border-b-2 border-transparent hover:border-gray-300 focus:border-primary-500 outline-none w-full"
            placeholder="Exam Title"
          />
          <div className="flex items-center space-x-4 mt-2">
            <p className="text-sm text-gray-600">
              Total Points: <span className="font-semibold">{totalPoints}</span>
            </p>
            {lastSaved && (
              <p className="text-xs text-green-600">
                ✓ Auto-saved at {lastSaved.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleSave} className="btn btn-primary flex items-center space-x-2">
            <Save className="w-5 h-5" />
            <span>Save</span>
          </button>
          
          {/* Export with Options */}
          <div className="relative">
            <button 
              onClick={() => setShowExportOptions(!showExportOptions)} 
              className="btn btn-secondary flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Export PDF</span>
            </button>
            
            {showExportOptions && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border p-4 z-50">
                <h4 className="font-semibold mb-3">Options d'Export</h4>
                
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={autoNumbering}
                      onChange={(e) => setAutoNumbering(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Numérotation automatique</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={hidePoints}
                      onChange={(e) => setHidePoints(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Mode Examen Blanc (masquer points)</span>
                  </label>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Filigrane</label>
                    <select
                      value={watermark}
                      onChange={(e) => setWatermark(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 text-sm"
                    >
                      <option value="">Aucun</option>
                      <option value="BROUILLON">BROUILLON</option>
                      <option value="CONFIDENTIEL">CONFIDENTIEL</option>
                      <option value="COPIE">COPIE</option>
                      <option value="NE PAS DIFFUSER">NE PAS DIFFUSER</option>
                    </select>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => {
                        handleExportPDF();
                        setShowExportOptions(false);
                      }}
                      className="btn btn-primary flex-1 text-sm"
                    >
                      Exporter
                    </button>
                    <button
                      onClick={() => setShowExportOptions(false)}
                      className="btn btn-secondary text-sm"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={async () => {
              const { generateCorrectionGrid } = await import('../utils/pdfGenerator');
              await generateCorrectionGrid(title, components);
            }}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Grille Correction</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Component Toolbar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Add Components</h3>
            <div className="space-y-2">
              <button
                onClick={() => addComponent('header')}
                className="w-full btn btn-secondary text-left flex items-center space-x-2 hover:bg-primary-50"
              >
                <Plus className="w-4 h-4" />
                <span>Header</span>
              </button>
              <button
                onClick={() => addComponent('text')}
                className="w-full btn btn-secondary text-left flex items-center space-x-2 hover:bg-primary-50"
              >
                <Plus className="w-4 h-4" />
                <span>Text Field</span>
              </button>
              <button
                onClick={() => addComponent('table')}
                className="w-full btn btn-secondary text-left flex items-center space-x-2 hover:bg-primary-50"
              >
                <Plus className="w-4 h-4" />
                <span>Table</span>
              </button>
              <button
                onClick={() => addComponent('qcm')}
                className="w-full btn btn-secondary text-left flex items-center space-x-2 hover:bg-primary-50"
              >
                <Plus className="w-4 h-4" />
                <span>QCM</span>
              </button>
              <button
                onClick={() => addComponent('image')}
                className="w-full btn btn-secondary text-left flex items-center space-x-2 hover:bg-primary-50"
              >
                <Plus className="w-4 h-4" />
                <span>Image</span>
              </button>
              <hr className="my-3 border-gray-300" />
              <p className="text-xs font-semibold text-gray-600 mb-2 px-2">Blocs Avancés</p>
              <button
                onClick={() => addComponent('exerciseHeader')}
                className="w-full btn btn-secondary text-left flex items-center space-x-2 hover:bg-primary-50"
              >
                <Plus className="w-4 h-4" />
                <span>Exercice avec Barème</span>
              </button>
              <button
                onClick={() => addComponent('trueFalse')}
                className="w-full btn btn-secondary text-left flex items-center space-x-2 hover:bg-primary-50"
              >
                <Plus className="w-4 h-4" />
                <span>Vrai/Faux</span>
              </button>
              <button
                onClick={() => addComponent('fillInBlanks')}
                className="w-full btn btn-secondary text-left flex items-center space-x-2 hover:bg-primary-50"
              >
                <Plus className="w-4 h-4" />
                <span>Texte à Trous</span>
              </button>
              <button
                onClick={() => addComponent('writingArea')}
                className="w-full btn btn-secondary text-left flex items-center space-x-2 hover:bg-primary-50"
              >
                <Plus className="w-4 h-4" />
                <span>Zone de Rédaction</span>
              </button>
              
              <hr className="my-3 border-gray-300" />
              <p className="text-xs font-semibold text-gray-600 mb-2 px-2">Mise en Page</p>
              <button
                onClick={() => addComponent('pageBreak')}
                className="w-full btn btn-secondary text-left flex items-center space-x-2 hover:bg-orange-50 text-orange-700"
              >
                <Scissors className="w-4 h-4" />
                <span>Saut de Page</span>
              </button>
              
              <hr className="my-3 border-gray-300" />
              <p className="text-xs font-semibold text-purple-600 mb-2 px-2">✨ Intelligence Artificielle</p>
              <button
                onClick={() => setShowAIModal(true)}
                className="w-full btn text-left flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>Générer avec l'IA</span>
              </button>
            </div>
          </div>
        </div>

        {/* Exam Canvas */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-lg p-8 min-h-screen">
            {components.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">
                  Your exam is empty. Add components to get started.
                </p>
                <p className="text-gray-400 text-sm">
                  Click on the components in the left sidebar to add them to your exam.
                </p>
              </div>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="exam-components">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`space-y-4 ${snapshot.isDraggingOver ? 'drop-zone-active' : ''}`}
                    >
                      {components.map((component, index) => (
                        <Draggable key={component.id} draggableId={component.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`relative ${snapshot.isDragging ? 'dragging' : ''}`}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="absolute -left-8 top-1/2 -translate-y-1/2 cursor-move text-gray-400 hover:text-gray-600"
                              >
                                <GripVertical className="w-6 h-6" />
                              </div>
                              {renderComponent(component, index)}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
            
          </div>
        </div>
      </div>
      
      {/* Floating Exam Summary */}
      <ExamSummary components={components} />
      
      {/* AI Generator Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Générateur de Questions IA
              </h3>
              <button
                onClick={() => setShowAIModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet ou Thème
                </label>
                <textarea
                  value={aiSubject}
                  onChange={(e) => setAiSubject(e.target.value)}
                  placeholder="Ex: Les équations du second degré, La Révolution française, Les cellules animales..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de questions
                </label>
                <select
                  value={aiCount}
                  onChange={(e) => setAiCount(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value={3}>3 questions</option>
                  <option value={5}>5 questions</option>
                  <option value={10}>10 questions</option>
                </select>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-xs text-purple-700">
                  💡 <strong>Conseil :</strong> Soyez précis dans votre sujet pour obtenir des questions plus pertinentes. 
                  Exemple : "Les fonctions dérivées niveau Terminale S" plutôt que juste "Mathématiques".
                </p>
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handleGenerateWithAI}
                  disabled={aiLoading || !aiSubject.trim()}
                  className="flex-1 btn bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Générer
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowAIModal(false)}
                  className="btn btn-secondary"
                  disabled={aiLoading}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
