import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamStore } from '../store/examStore';
import { Plus, FileText, Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { exams, loading, fetchExams, deleteExam } = useExamStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const handleCreateNew = () => {
    navigate('/exam/new');
  };

  const handleExamClick = (id: string) => {
    navigate(`/exam/${id}`);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this exam?')) {
      await deleteExam(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Exams</h1>
          <p className="text-gray-600 mt-2">Create and manage your exam papers</p>
        </div>
        <button onClick={handleCreateNew} className="btn btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Create New Exam</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading exams...</p>
        </div>
      ) : exams.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No exams yet</h3>
          <p className="text-gray-600 mb-6">Create your first exam to get started</p>
          <button onClick={handleCreateNew} className="btn btn-primary">
            Create Exam
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div
              key={exam.id}
              onClick={() => handleExamClick(exam.id)}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{exam.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <FileText className="w-4 h-4" />
                      <span>{exam.components.length} components</span>
                    </span>
                    <span>{exam.totalPoints} pts</span>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(e, exam.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {exam.tags && exam.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {exam.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-2 text-xs text-gray-500 pt-4 border-t">
                <Calendar className="w-4 h-4" />
                <span>Updated {format(new Date(exam.updatedAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
