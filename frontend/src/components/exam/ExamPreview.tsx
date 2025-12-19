import { ExamComponent } from '../../../../shared/src/types';
import LatexRenderer from './LatexRenderer';

interface ExamPreviewProps {
  title: string;
  components: ExamComponent[];
}

export default function ExamPreview({ components }: ExamPreviewProps) {
  const renderComponent = (component: ExamComponent) => {
    switch (component.type) {
      case 'header':
        return (
          <div className="border-b-2 border-gray-800 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-center mb-4">{component.examTitle}</h1>
            <div className="flex justify-between text-sm">
              <div>
                <p><strong>Année académique:</strong> {component.academicYear}</p>
                <p><strong>Semestre:</strong> {component.semester}</p>
              </div>
              <div>
                <p><strong>Durée:</strong> {component.duration}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-4 text-sm">
              {component.studentFields.name && <span>Nom: _____________</span>}
              {component.studentFields.firstName && <span>Prénom: _____________</span>}
              {component.studentFields.classGroup && <span>Classe: _____________</span>}
            </div>
          </div>
        );

      case 'exerciseHeader':
        return (
          <div className="mt-6 mb-3">
            <h2 className="text-xl font-bold flex items-center justify-between">
              <span>Exercice {component.exerciseNumber}: {component.title}</span>
              <span className="text-indigo-600">({component.points} pts)</span>
            </h2>
          </div>
        );

      case 'text':
        return (
          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              {component.latex ? (
                <div className="flex-1">
                  <LatexRenderer content={component.content} />
                </div>
              ) : (
                <p className="flex-1 whitespace-pre-wrap">{component.content}</p>
              )}
              {component.points && component.points > 0 && (
                <span className="ml-4 text-sm font-semibold text-indigo-600">
                  ({component.points} pts)
                </span>
              )}
            </div>
          </div>
        );

      case 'qcm':
        return (
          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              {component.latex ? (
                <div className="flex-1 font-semibold">
                  <LatexRenderer content={component.question} />
                </div>
              ) : (
                <p className="flex-1 font-semibold">{component.question}</p>
              )}
              {component.points && component.points > 0 && (
                <span className="ml-4 text-sm font-semibold text-indigo-600">
                  ({component.points} pts)
                </span>
              )}
            </div>
            <div className="ml-4 space-y-2">
              {component.options.map((option, optIndex) => (
                <div key={option.id} className="flex items-start gap-2">
                  <span className="font-medium">{String.fromCharCode(65 + optIndex)})</span>
                  {option.latex ? (
                    <LatexRenderer content={option.text} />
                  ) : (
                    <span>{option.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'trueFalse':
        return (
          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold">Vrai ou Faux</p>
              {component.points && component.points > 0 && (
                <span className="text-sm font-semibold text-indigo-600">
                  ({component.points} pts)
                </span>
              )}
            </div>
            <div className="space-y-2">
              {component.statements.map((stmt, stmtIndex) => (
                <div key={stmt.id} className="flex items-start gap-3">
                  <span className="font-medium">{stmtIndex + 1}.</span>
                  {stmt.latex ? (
                    <div className="flex-1">
                      <LatexRenderer content={stmt.text} />
                    </div>
                  ) : (
                    <span className="flex-1">{stmt.text}</span>
                  )}
                  {component.displayStyle === 'circles' ? (
                    <div className="flex gap-2">
                      <span className="border border-gray-400 rounded-full w-6 h-6"></span>
                      <span className="border border-gray-400 rounded-full w-6 h-6"></span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <span className="border border-gray-400 px-2 py-1">V</span>
                      <span className="border border-gray-400 px-2 py-1">F</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'fillInBlanks':
        return (
          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              {component.latex ? (
                <div className="flex-1">
                  <LatexRenderer 
                    content={component.content.replace(/\[([^\]]+)\]/g, '___________')} 
                  />
                </div>
              ) : (
                <p className="flex-1">
                  {component.content.replace(/\[([^\]]+)\]/g, '___________')}
                </p>
              )}
              {component.points && component.points > 0 && (
                <span className="ml-4 text-sm font-semibold text-indigo-600">
                  ({component.points} pts)
                </span>
              )}
            </div>
          </div>
        );

      case 'writingArea':
        return (
          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold">Zone de rédaction</p>
              {component.points && component.points > 0 && (
                <span className="text-sm font-semibold text-indigo-600">
                  ({component.points} pts)
                </span>
              )}
            </div>
            <div className="border border-gray-300 p-4 min-h-[200px]">
              {component.lineStyle === 'ruled' ? (
                <div className="space-y-4">
                  {Array.from({ length: component.lineCount }).map((_, i) => (
                    <div key={i} className="border-b border-gray-300 h-6"></div>
                  ))}
                </div>
              ) : (
                <div 
                  className="grid gap-0" 
                  style={{ 
                    gridTemplateRows: `repeat(${component.lineCount}, 1.5rem)`,
                    backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(to right, #e5e7eb 1px, transparent 1px)',
                    backgroundSize: '1.5rem 1.5rem'
                  }}
                >
                </div>
              )}
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              {component.points && component.points > 0 && (
                <span className="text-sm font-semibold text-indigo-600">
                  ({component.points} pts)
                </span>
              )}
            </div>
            <table className="w-full border-collapse border border-gray-400">
              <thead>
                <tr>
                  {component.headers.map((header, i) => (
                    <th key={i} className="border border-gray-400 p-2 bg-gray-100">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {component.data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border border-gray-400 p-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'image':
        return (
          <div className="mb-4">
            {component.imageUrl && (
              <div className="flex flex-col items-center">
                <img 
                  src={component.imageUrl} 
                  alt={component.caption || 'Exam image'} 
                  style={{ 
                    width: component.width ? `${component.width}px` : 'auto',
                    height: component.height ? `${component.height}px` : 'auto',
                    maxWidth: '100%'
                  }}
                  className="border border-gray-300"
                />
                {component.caption && (
                  <p className="text-sm text-gray-600 mt-2 italic">{component.caption}</p>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-8 shadow-lg rounded-lg max-w-4xl mx-auto">
      <div className="prose max-w-none">
        {components.map((component) => (
          <div key={component.id}>
            {renderComponent(component)}
          </div>
        ))}
      </div>
    </div>
  );
}
