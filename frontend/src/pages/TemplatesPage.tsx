import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FileText, Plus, Trash2, Copy, Globe, Lock } from 'lucide-react';
import { Template } from '../../../shared/src/types';
import { toast } from 'react-toastify';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from Supabase
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase error:', error);
        // Fallback to localStorage
        const localTemplates = localStorage.getItem('templates');
        if (localTemplates) {
          setTemplates(JSON.parse(localTemplates));
        }
      } else {
        // Transform from DB format to app format
        const transformedTemplates: Template[] = (data || []).map((t: any) => ({
          id: t.id,
          userId: t.user_id || '',
          name: t.name,
          description: t.description,
          headerComponent: t.header_component,
          isPublic: t.is_public,
          usageCount: t.usage_count || 0,
          createdAt: t.created_at,
          updatedAt: t.updated_at,
        }));
        setTemplates(transformedTemplates);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      // Fallback to localStorage
      const localTemplates = localStorage.getItem('templates');
      if (localTemplates) {
        setTemplates(JSON.parse(localTemplates));
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Supabase delete error:', error);
        // Fallback to localStorage
        const localTemplates = templates.filter((t) => t.id !== id);
        localStorage.setItem('templates', JSON.stringify(localTemplates));
      }
      
      setTemplates(templates.filter((t) => t.id !== id));
      toast.success('Template deleted successfully');
    } catch (error) {
      console.error('Failed to delete template:', error);
      toast.error('Failed to delete template');
    }
  };

  const useTemplate = async (template: Template) => {
    try {
      // Increment usage count in Supabase
      await supabase
        .from('templates')
        .update({ usage_count: (template.usageCount || 0) + 1 })
        .eq('id', template.id);
      
      localStorage.setItem('templateHeader', JSON.stringify(template.headerComponent));
      toast.success('Template copied! Use it in your next exam.');
      
      // Update local state
      setTemplates(templates.map(t => 
        t.id === template.id 
          ? { ...t, usageCount: (t.usageCount || 0) + 1 }
          : t
      ));
    } catch (error) {
      console.error('Failed to use template:', error);
      // Still save to localStorage even if DB update fails
      localStorage.setItem('templateHeader', JSON.stringify(template.headerComponent));
      toast.success('Template copied! Use it in your next exam.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exam Templates</h1>
          <p className="text-gray-600 mt-2">
            {templates.length} templates available • Reusable headers for quick exam creation
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Template</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading templates...</p>
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates yet</h3>
          <p className="text-gray-600 mb-6">
            Create templates to save exam headers and reuse them across multiple exams
          </p>
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
            Create Your First Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                  {template.description && (
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  )}
                </div>
                {template.isPublic ? (
                  <Globe className="w-5 h-5 text-green-600" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {/* Template Preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm">
                <div className="space-y-2">
                  {template.headerComponent?.examTitle && (
                    <p>
                      <span className="font-medium">Title:</span> {template.headerComponent.examTitle}
                    </p>
                  )}
                  {template.headerComponent?.academicYear && (
                    <p>
                      <span className="font-medium">Year:</span> {template.headerComponent.academicYear}
                    </p>
                  )}
                  {template.headerComponent?.semester && (
                    <p>
                      <span className="font-medium">Semester:</span> {template.headerComponent.semester}
                    </p>
                  )}
                  {template.headerComponent?.duration && (
                    <p>
                      <span className="font-medium">Duration:</span> {template.headerComponent.duration}
                    </p>
                  )}
                  {template.headerComponent?.studentFields && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t">
                      {template.headerComponent.studentFields.name && (
                        <span className="px-2 py-1 bg-white rounded text-xs">Name</span>
                      )}
                      {template.headerComponent.studentFields.firstName && (
                        <span className="px-2 py-1 bg-white rounded text-xs">First Name</span>
                      )}
                      {template.headerComponent.studentFields.classGroup && (
                        <span className="px-2 py-1 bg-white rounded text-xs">Class/Group</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-xs text-gray-500">
                  Used {template.usageCount || 0} {(template.usageCount || 0) === 1 ? 'time' : 'times'}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => useTemplate(template)}
                    className="text-primary-600 hover:bg-primary-50 p-2 rounded"
                    title="Use template"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteTemplate(template.id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Template Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Create Template</h3>
            <p className="text-gray-600 mb-6">
              Create an exam header first in the exam builder, then save it as a template from there.
            </p>
            <button
              onClick={() => setShowCreateModal(false)}
              className="btn btn-secondary w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
