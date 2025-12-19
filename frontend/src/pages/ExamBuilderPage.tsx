import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExamStore } from '../store/examStore';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { ExamComponent, ComponentType } from '../../../shared/src/types';
import { Save, Download, Plus, GripVertical } from 'lucide-react';
import HeaderComponentEditor from '../components/exam/HeaderComponentEditor';
import TextComponentEditor from '../components/exam/TextComponentEditor';
import TableComponentEditor from '../components/exam/TableComponentEditor';
import QCMComponentEditor from '../components/exam/QCMComponentEditor';
import ImageComponentEditor from '../components/exam/ImageComponentEditor';
import TrueFalseComponentEditor from '../components/exam/TrueFalseComponentEditor';
import FillInBlanksComponentEditor from '../components/exam/FillInBlanksComponentEditor';
import WritingAreaComponentEditor from '../components/exam/WritingAreaComponentEditor';
import ExerciseHeaderComponentEditor from '../components/exam/ExerciseHeaderComponentEditor';
import ExamSummary from '../components/exam/ExamSummary';
import { generatePDF } from '../utils/pdfGenerator';

export default function ExamBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentExam, fetchExam, createExam, updateExam, setCurrentExam, updateComponents } = useExamStore();
  const [title, setTitle] = useState('Untitled Exam');
  const [components, setComponents] = useState<ExamComponent[]>([]);

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
    await generatePDF(title, components);
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
          <p className="text-sm text-gray-600 mt-2">
            Total Points: <span className="font-semibold">{totalPoints}</span>
          </p>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleSave} className="btn btn-primary flex items-center space-x-2">
            <Save className="w-5 h-5" />
            <span>Save</span>
          </button>
          <button onClick={handleExportPDF} className="btn btn-secondary flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={async () => {
              const { generateCorrectionGrid } = await import('../utils/pdfGenerator');
              await generateCorrectionGrid(title, components);
            }}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Correction Grid</span>
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
    </div>
  );
}
