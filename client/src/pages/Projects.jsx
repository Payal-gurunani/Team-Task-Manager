import { useState } from 'react';
import { Plus, FolderKanban, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../hooks/useProjects';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectForm from '../components/projects/ProjectForm';
import MemberManager from '../components/projects/MemberManager';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import Spinner from '../components/common/Spinner';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Projects = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { projects, loading, createProject, deleteProject, updateProject, addMember, removeMember } = useProjects();
  const [showCreate, setShowCreate] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [memberProject, setMemberProject] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm('Delete this project and all its tasks? This cannot be undone.')) return;
    try { await deleteProject(id); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to delete'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            <Plus size={16} /> New Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects yet"
          description="Create your first project to start organizing tasks and collaborating with your team."
          action={isAdmin && <button onClick={() => setShowCreate(true)} className="btn-primary"><Plus size={16} /> Create Project</button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map(project => (
            <ProjectCard key={project._id} project={project}
              onDelete={handleDelete}
              onEdit={setEditProject}
              onClick={() => navigate(`/tasks?projectId=${project._id}`)} />
          ))}
          {isAdmin && (
            <button onClick={() => setShowCreate(true)}
              className="card border-2 border-dashed border-surface-300 hover:border-brand-300 flex items-center justify-center p-8 text-gray-400 hover:text-brand-500 transition-all hover:-translate-y-1 min-h-48">
              <div className="text-center">
                <Plus size={28} className="mx-auto mb-2" />
                <p className="text-sm font-medium">New Project</p>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Project">
        <ProjectForm onSubmit={async (d) => { await createProject(d); setShowCreate(false); }} onCancel={() => setShowCreate(false)} />
      </Modal>

      <Modal isOpen={!!editProject} onClose={() => setEditProject(null)} title="Edit Project" size="lg">
        {editProject && (
          <div className="space-y-6">
            <ProjectForm initial={editProject}
              onSubmit={async (d) => { await updateProject(editProject._id, d); setEditProject(null); }}
              onCancel={() => setEditProject(null)} />
            <div className="border-t border-surface-100 pt-5">
              <div className="flex items-center gap-2 mb-4">
                <Users size={16} className="text-gray-500" />
                <h3 className="font-semibold text-gray-900">Manage Members</h3>
              </div>
              <MemberManager project={editProject}
                onAddMember={async (uid) => { const p = await addMember(editProject._id, uid); setEditProject(p); }}
                onRemoveMember={async (uid) => { const p = await removeMember(editProject._id, uid); setEditProject(p); }} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Projects;
