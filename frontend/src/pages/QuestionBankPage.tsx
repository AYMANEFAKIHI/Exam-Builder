import { useState, useEffect } from 'react';
import api from '../lib/api';
import { BookOpen, Search, Trash2, Copy, Tag } from 'lucide-react';
import { QuestionBankItem, ExamComponent } from '../../../shared/src/types';
import { toast } from 'react-toastify';

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionBankItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  // Modal functionality can be added later

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, searchTerm, selectedDifficulty, selectedSubject]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/question-bank');
      setQuestions(response.data.data);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = [...questions];

    if (searchTerm) {
      filtered = filtered.filter((q) => {
        const component = q.component;
        const searchLower = searchTerm.toLowerCase();
        
        if ('content' in component && component.content?.toLowerCase().includes(searchLower)) return true;
        if ('question' in component && component.question?.toLowerCase().includes(searchLower)) return true;
        if (q.tags.some(tag => tag.toLowerCase().includes(searchLower))) return true;
        if (q.subject?.toLowerCase().includes(searchLower)) return true;
        
        return false;
      });
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter((q) => q.difficulty === selectedDifficulty);
    }

    if (selectedSubject !== 'all') {
      filtered = filtered.filter((q) => q.subject === selectedSubject);
    }

    setFilteredQuestions(filtered);
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      await api.delete(`/question-bank/${id}`);
      setQuestions(questions.filter((q) => q.id !== id));
      toast.success('Question deleted successfully');
    } catch (error) {
      console.error('Failed to delete question:', error);
      toast.error('Failed to delete question');
    }
  };

  const copyToClipboard = (component: ExamComponent) => {
    localStorage.setItem('copiedComponent', JSON.stringify(component));
    toast.success('Component copied! Paste it in the exam builder.');
  };

  const incrementUsage = async (id: string) => {
    try {
      await api.post(`/question-bank/${id}/use`);
    } catch (error) {
      console.error('Failed to increment usage:', error);
    }
  };

  const renderComponentPreview = (component: ExamComponent) => {
    switch (component.type) {
      case 'text':
        return (
          <div>
            <p className="text-sm text-gray-600 line-clamp-3">{component.content}</p>
            {component.points && (
              <span className="text-xs text-gray-500 mt-2 block">{component.points} points</span>
            )}
          </div>
        );
      case 'qcm':
        return (
          <div>
            <p className="font-medium text-sm mb-2">{component.question}</p>
            <div className="space-y-1">
              {component.options.slice(0, 2).map((opt, idx) => (
                <p key={idx} className="text-xs text-gray-600">
                  {String.fromCharCode(65 + idx)}. {opt.text.slice(0, 50)}
                  {opt.text.length > 50 ? '...' : ''}
                </p>
              ))}
              {component.options.length > 2 && (
                <p className="text-xs text-gray-400">
                  +{component.options.length - 2} more options
                </p>
              )}
            </div>
            {component.points && (
              <span className="text-xs text-gray-500 mt-2 block">{component.points} points</span>
            )}
          </div>
        );
      case 'table':
        return (
          <div>
            <p className="text-sm text-gray-600">
              Table: {component.rows}x{component.columns}
            </p>
            {component.points && (
              <span className="text-xs text-gray-500 mt-2 block">{component.points} points</span>
            )}
          </div>
        );
      case 'image':
        return (
          <div>
            <p className="text-sm text-gray-600">Image component</p>
            {component.caption && (
              <p className="text-xs text-gray-500 mt-1">{component.caption}</p>
            )}
          </div>
        );
      default:
        return <p className="text-sm text-gray-600">Component</p>;
    }
  };

  const uniqueSubjects = Array.from(new Set(questions.map((q) => q.subject).filter(Boolean)));

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Question Bank</h1>
          <p className="text-gray-600 mt-2">
            {questions.length} questions saved • Reuse across multiple exams
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by content, tags, or subject..."
            className="input pl-10 w-full"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="input flex-1"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="input flex-1"
          >
            <option value="all">All Subjects</option>
            {uniqueSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading questions...</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {questions.length === 0 ? 'No questions yet' : 'No matching questions'}
          </h3>
          <p className="text-gray-600 mb-4">
            {questions.length === 0
              ? 'Save questions from your exams to build your question bank'
              : 'Try adjusting your filters'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredQuestions.map((question) => (
            <div key={question.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium uppercase">
                    {question.component.type}
                  </span>
                  {question.difficulty && (
                    <span
                      className={`px-2 py-1 text-xs rounded font-medium ${
                        question.difficulty === 'easy'
                          ? 'bg-green-100 text-green-700'
                          : question.difficulty === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {question.difficulty}
                    </span>
                  )}
                  {question.subject && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {question.subject}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      copyToClipboard(question.component);
                      incrementUsage(question.id);
                    }}
                    className="text-primary-600 hover:bg-primary-50 p-2 rounded"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteQuestion(question.id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {renderComponentPreview(question.component)}

              <div className="mt-4 pt-3 border-t flex flex-wrap gap-2 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded flex items-center space-x-1"
                    >
                      <Tag className="w-3 h-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  Used {question.usageCount} {question.usageCount === 1 ? 'time' : 'times'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
