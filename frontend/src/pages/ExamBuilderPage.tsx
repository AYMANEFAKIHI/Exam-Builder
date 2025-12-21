import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useExamStore } from '../store/examStore';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
// import ExamPreview from '../components/exam/ExamPreview';
import TextComponentEditor from '../components/exam/TextComponentEditor';
import TableComponentEditor from '../components/exam/TableComponentEditor';
import QCMComponentEditor from '../components/exam/QCMComponentEditor';
import ImageComponentEditor from '../components/exam/ImageComponentEditor';
import TrueFalseComponentEditor from '../components/exam/TrueFalseComponentEditor';
import FillInBlanksComponentEditor from '../components/exam/FillInBlanksComponentEditor';
import WritingAreaComponentEditor from '../components/exam/WritingAreaComponentEditor';
import ExerciseHeaderComponentEditor from '../components/exam/ExerciseHeaderComponentEditor';
import HeaderComponentEditor from '../components/exam/HeaderComponentEditor';
import PageBreakComponentEditor from '../components/exam/PageBreakComponentEditor';
import GeometryComponentEditor from '../components/exam/GeometryComponentEditor';
import TimelineComponentEditor from '../components/exam/TimelineComponentEditor';
import MatchingComponentEditor from '../components/exam/MatchingComponentEditor';
import type { ExamComponent, ComponentType } from '../../../shared/src/types';
import { Save, Download, Plus, Scissors, Grid3X3, Clock, Link2 } from 'lucide-react';
// Suppression des imports inutilisés
import ExamSummary from '../components/exam/ExamSummary';
import { generatePDF } from '../utils/pdfGenerator';
import { toast } from 'react-toastify';

// Auto-save key for localStorage
const AUTO_SAVE_KEY = 'exam_builder_autosave';

export default function ExamBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentExam, fetchExam, createExam, updateExam, setCurrentExam, updateComponents } = useExamStore();
  const [title, setTitle] = useState(t('editor.untitled'));
  const [components, setComponents] = useState<ExamComponent[]>([]);
  
  // Export options state
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [hidePoints, setHidePoints] = useState(false);
  const [watermark, setWatermark] = useState('');
  const [autoNumbering, setAutoNumbering] = useState(true);
  
  // Auto-save indicator
  const [lastSaved, setLastSaved] = useState<Date | null>(null);


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
              `${t('editor.restoreTitle')} (${savedTime.toLocaleString()}). ${t('editor.restoreConfirm')}`
            );
            if (restore) {
              setTitle(parsed.title);
              setComponents(parsed.components);
              toast.info(t('editor.draftRestored'));
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
      setTitle(t('editor.untitled'));
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
      alert(t('editor.addComponentsAlert'));
      return;
    }
    await generatePDF(title, components, { hidePoints, watermark, autoNumbering });
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
      case 'geometry':
        return {
          ...baseComponent,
          type: 'geometry',
          gridType: 'millimeter',
          width: 150,
          height: 100,
          instructions: '',
          points: 0,
        };
      case 'timeline':
        return {
          ...baseComponent,
          type: 'timeline',
          title: '',
          startYear: 1789,
          endYear: 1815,
          events: [
            { id: 'event-1', date: '1789', label: '', showDate: true, showLabel: false },
            { id: 'event-2', date: '1799', label: '', showDate: false, showLabel: true },
          ],
          points: 0,
        };
      case 'matching':
        return {
          ...baseComponent,
          type: 'matching',
          title: '',
          instructions: 'Reliez les éléments de gauche à ceux de droite',
          leftColumn: [
            { id: 'left-1', text: '' },
            { id: 'left-2', text: '' },
            { id: 'left-3', text: '' },
          ],
          rightColumn: [
            { id: 'right-1', text: '' },
            { id: 'right-2', text: '' },
            { id: 'right-3', text: '' },
          ],
          shuffleRight: true,
          points: 0,
        };
      default:
        throw new Error(`Unknown component type: ${type}`);
    }
  };

  // Suppression des fonctions utilitaires non utilisées

  // (fin des fonctions utilitaires, le code continue normalement)

  const totalPoints = components.reduce((sum, comp) => {
    return sum + (('points' in comp && comp.points) ? comp.points : 0);
  }, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex-1 mr-4 rtl:mr-0 rtl:ml-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl font-bold text-gray-900 dark:text-white border-b-2 border-transparent hover:border-gray-300 dark:hover:border-slate-600 focus:border-primary-500 outline-none w-full bg-transparent"
            placeholder={t('editor.examTitle')}
          />
          <div className="flex items-center space-x-4 rtl:space-x-reverse mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('editor.totalPoints')}: <span className="font-semibold">{totalPoints}</span>
            </p>
            {lastSaved && (
              <p className="text-xs text-green-600 dark:text-green-400">
                ✓ {t('editor.autoSaved')} {lastSaved.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-3 rtl:space-x-reverse">
          <button onClick={handleSave} className="btn btn-primary flex items-center space-x-2 rtl:space-x-reverse">
            <Save className="w-5 h-5" />
            <span>{t('editor.save')}</span>
          </button>
          
          {/* Export with Options */}
          <div className="relative">
            <button 
              onClick={() => setShowExportOptions(!showExportOptions)} 
              className="btn btn-secondary flex items-center space-x-2 rtl:space-x-reverse"
            >
              <Download className="w-5 h-5" />
              <span>{t('editor.export')}</span>
            </button>
            
            {showExportOptions && (
              <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-xl border dark:border-slate-700 p-4 z-50">
                <h4 className="font-semibold mb-3 dark:text-white">{t('editor.exportOptions')}</h4>
                
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 rtl:space-x-reverse">
                    <input
                      type="checkbox"
                      checked={autoNumbering}
                      onChange={(e) => setAutoNumbering(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm dark:text-gray-300">{t('editor.autoNumbering')}</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 rtl:space-x-reverse">
                    <input
                      type="checkbox"
                      checked={hidePoints}
                      onChange={(e) => setHidePoints(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm dark:text-gray-300">{t('editor.practiceMode')}</span>
                  </label>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('editor.watermark')}</label>
                    <select
                      value={watermark}
                      onChange={(e) => setWatermark(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm"
                    >
                      <option value="">{t('editor.watermarkNone')}</option>
                      <option value="BROUILLON">{t('editor.watermarkDraft')}</option>
                      <option value="CONFIDENTIEL">{t('editor.watermarkConfidential')}</option>
                      <option value="COPIE">{t('editor.watermarkCopy')}</option>
                      <option value="NE PAS DIFFUSER">{t('editor.watermarkNoShare')}</option>
                    </select>
                  </div>
                  
                  <div className="flex space-x-2 rtl:space-x-reverse pt-2">
                    <button
                      onClick={() => {
                        handleExportPDF();
                        setShowExportOptions(false);
                      }}
                      className="btn btn-primary flex-1 text-sm"
                    >
                      {t('editor.exportBtn')}
                    </button>
                    <button
                      onClick={() => setShowExportOptions(false)}
                      className="btn btn-secondary text-sm"
                    >
                      {t('common.cancel')}
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
            className="btn btn-secondary flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Download className="w-5 h-5" />
            <span>{t('editor.correctionGrid')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Component Toolbar */}
        <div className="lg:col-span-1">
          <div className="card dark:bg-slate-800 sticky top-4">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">{t('editor.addComponents')}</h3>
            <div className="space-y-2">
              <button
                onClick={() => addComponent('header')}
                className="w-full btn btn-secondary text-left flex items-center space-x-2 rtl:space-x-reverse hover:bg-primary-50 dark:hover:bg-slate-700"
              >
                <Plus className="w-4 h-4" />
                <span>{t('editor.header')}</span>
              </button>
              <button
                onClick={() => addComponent('text')}
                className="w-full btn btn-secondary text-left flex items-center space-x-2 rtl:space-x-reverse hover:bg-primary-50 dark:hover:bg-slate-700"
              >
                <Plus className="w-4 h-4" />
                <span>{t('editor.text')}</span>
              </button>
              <button
                onClick={() => addComponent('table')}
                className="w-full btn btn-secondary text-left flex items-center space-x-2 rtl:space-x-reverse hover:bg-primary-50 dark:hover:bg-slate-700"
              >
                <Plus className="w-4 h-4" />
                <span>{t('editor.table')}</span>
              </button>
              <button
                onClick={() => addComponent('qcm')}
                className="w-full btn btn-secondary text-left flex items-center space-x-2 rtl:space-x-reverse hover:bg-primary-50 dark:hover:bg-slate-700"
              >
                <Plus className="w-4 h-4" />
                <span>{t('editor.qcm')}</span>
              </button>
              <button
                onClick={() => addComponent('image')}
                className="w-full btn btn-secondary text-left flex items-center space-x-2 rtl:space-x-reverse hover:bg-primary-50 dark:hover:bg-slate-700"
              >
                <Plus className="w-4 h-4" />
                <span>{t('editor.image')}</span>
              </button>
              <hr className="my-3 border-gray-300 dark:border-slate-600" />
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 px-2">{t('editor.advancedBlocks')}</p>
              <button
                onClick={() => addComponent('exerciseHeader')}
                className="w-full btn btn-secondary text-left flex items-center space-x-2 rtl:space-x-reverse hover:bg-primary-50 dark:hover:bg-slate-700"
              >
                <Plus className="w-4 h-4" />
                <span>{t('editor.exerciseHeader')}</span>
              </button>
              <button
                onClick={() => addComponent('trueFalse')}
                className="w-full btn btn-secondary text-left flex items-center space-x-2 rtl:space-x-reverse hover:bg-primary-50 dark:hover:bg-slate-700"
              >
                <Plus className="w-4 h-4" />
                <span>{t('editor.trueFalse')}</span>
              </button>
              <button
                onClick={() => addComponent('fillInBlanks')}
                className="w-full btn btn-secondary text-left flex items-center space-x-2 rtl:space-x-reverse hover:bg-primary-50 dark:hover:bg-slate-700"
              >
                <Plus className="w-4 h-4" />
                <span>{t('editor.fillBlanks')}</span>
              </button>
              <button
                onClick={() => addComponent('writingArea')}
                className="w-full btn btn-secondary text-left flex items-center space-x-2 rtl:space-x-reverse hover:bg-primary-50 dark:hover:bg-slate-700"
              >
                <Plus className="w-4 h-4" />
                <span>{t('editor.writingArea')}</span>
              </button>
              <button
                onClick={() => addComponent('matching')}
                className="w-full btn btn-secondary text-left flex items-center space-x-2 rtl:space-x-reverse hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-400"
              >
                <Link2 className="w-4 h-4" />
                <span>{t('editor.matching')}</span>
              </button>
              
              <hr className="my-3 border-gray-300 dark:border-slate-600" />
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2 px-2">📐 {t('editor.sciences')}</p>
              <button
                onClick={() => addComponent('geometry')}
                className="w-full btn btn-secondary text-left flex items-center space-x-2 rtl:space-x-reverse hover:bg-green-50 dark:hover:bg-green-900/20 text-green-700 dark:text-green-400"
              >
                <Grid3X3 className="w-4 h-4" />
                <span>{t('editor.geometry')}</span>
              </button>
              
              <hr className="my-3 border-gray-300 dark:border-slate-600" />
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2 px-2">📜 {t('editor.historyGeo')}</p>
              <button
                onClick={() => addComponent('timeline')}
                className="w-full btn btn-secondary text-left flex items-center space-x-2 rtl:space-x-reverse hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-700 dark:text-amber-400"
              >
                <Clock className="w-4 h-4" />
                <span>{t('editor.timeline')}</span>
              </button>
              
              <hr className="my-3 border-gray-300 dark:border-slate-600" />
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 px-2">{t('editor.layout')}</p>
              <button
                onClick={() => addComponent('pageBreak')}
                className="w-full btn btn-secondary text-left flex items-center space-x-2 rtl:space-x-reverse hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-700 dark:text-orange-400"
              >
                <Scissors className="w-4 h-4" />
                <span>{t('editor.pageBreak')}</span>
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
                  {t('editor.emptyExam')}
                </p>
                <p className="text-gray-400 text-sm">
                  {t('editor.emptyExamHint')}
                </p>
              </div>
            ) : (
              <DndContext collisionDetection={closestCenter} onDragEnd={({active, over}) => {
                if (over && active.id !== over.id) {
                  const oldIndex = components.findIndex(i => i.id === active.id);
                  const newIndex = components.findIndex(i => i.id === over.id);
                  const newItems = arrayMove(components, oldIndex, newIndex);
                  setComponents(newItems);
                  updateComponents(newItems);
                }
              }}>
                <SortableContext items={components.map(i => i.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-4">
                    {components.map((component, index) => (
                      <SortableEditorItem
                        key={component.id}
                        component={component}
                        // index={index} (removed, not needed)
                        updateComponent={(updated: ExamComponent) => {
                          const newComps = [...components];
                          newComps[index] = updated;
                          setComponents(newComps);
                          updateComponents(newComps);
                        }}
                        deleteComponent={() => {
                          const newComps = components.filter((_, i) => i !== index);
                          setComponents(newComps);
                          updateComponents(newComps);
                        }}
                        duplicateComponent={() => {
                          const c = components[index];
                          const newC = {...c, id: `${c.type}-${Date.now()}`};
                          const newComps = [...components, newC];
                          setComponents(newComps);
                          updateComponents(newComps);
                        }}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </div>
      {/* Floating Exam Summary */}
      <ExamSummary components={components} />
    </div>
  );
}

// Sortable editor item wrapper (déplacé hors du composant principal)
// import type { ExamComponent } from '../../../shared/src/types';

interface SortableEditorItemProps {
  component: ExamComponent;
  updateComponent: (updated: ExamComponent) => void;
  deleteComponent: () => void;
  duplicateComponent: () => void;
}

function SortableEditorItem({ component, updateComponent, deleteComponent, duplicateComponent }: SortableEditorItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: component.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    background: isDragging ? '#f3f4f6' : undefined,
  };
  function renderEditor() {
    if (component.type === 'header') {
      return (
        <HeaderComponentEditor
          data={component}
          onChange={updateComponent}
          onDelete={deleteComponent}
          onDuplicate={duplicateComponent}
        />
      );
    }
    if (component.type === 'exerciseHeader') {
      return <ExerciseHeaderComponentEditor data={component} onChange={updateComponent} onDelete={deleteComponent} onDuplicate={duplicateComponent} />;
    }
    if (component.type === 'text') {
      return <TextComponentEditor data={component} onChange={updateComponent} onDelete={deleteComponent} onDuplicate={duplicateComponent} />;
    }
    if (component.type === 'table') {
      return <TableComponentEditor data={component} onChange={updateComponent} onDelete={deleteComponent} onDuplicate={duplicateComponent} />;
    }
    if (component.type === 'qcm') {
      return <QCMComponentEditor data={component} onChange={updateComponent} onDelete={deleteComponent} onDuplicate={duplicateComponent} />;
    }
    if (component.type === 'image') {
      return <ImageComponentEditor data={component} onChange={updateComponent} onDelete={deleteComponent} onDuplicate={duplicateComponent} />;
    }
    if (component.type === 'trueFalse') {
      return <TrueFalseComponentEditor data={component} onChange={updateComponent} onDelete={deleteComponent} onDuplicate={duplicateComponent} />;
    }
    if (component.type === 'fillInBlanks') {
      return <FillInBlanksComponentEditor data={component} onChange={updateComponent} onDelete={deleteComponent} onDuplicate={duplicateComponent} />;
    }
    if (component.type === 'writingArea') {
      return <WritingAreaComponentEditor data={component} onChange={updateComponent} onDelete={deleteComponent} onDuplicate={duplicateComponent} />;
    }
    if (component.type === 'pageBreak') {
      return <PageBreakComponentEditor data={component} onChange={updateComponent} onDelete={deleteComponent} onDuplicate={duplicateComponent} />;
    }
    if (component.type === 'geometry') {
      return <GeometryComponentEditor data={component} onChange={updateComponent} onDelete={deleteComponent} onDuplicate={duplicateComponent} />;
    }
    if (component.type === 'timeline') {
      return <TimelineComponentEditor data={component} onChange={updateComponent} onDelete={deleteComponent} onDuplicate={duplicateComponent} />;
    }
    if (component.type === 'matching') {
      return <MatchingComponentEditor data={component} onChange={updateComponent} onDelete={deleteComponent} onDuplicate={duplicateComponent} />;
    }
    return <div />;
  }
  return (
    <div ref={setNodeRef} style={style} {...attributes} className="mb-2">
      <div {...listeners} className="absolute -left-8 top-4 cursor-move text-gray-400 hover:text-gray-600">
        <span>::</span>
      </div>
      {renderEditor()}
    </div>
  );
}
