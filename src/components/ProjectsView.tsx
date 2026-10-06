// Planzo Projects View (/projects) — User-Isolated Project Workspace
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FolderKanban,
  Plus,
  Calendar,
  CheckCircle2,
  Trash2,
  X,
  Layers,
  Target,
  Clock,
} from 'lucide-react';
import { playTaskCompleteSound } from '../utils/audioSynth';
import { fireConfetti } from '../utils/audioVibes';

export const ProjectsView: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date(Date.now() + 7 * 86400000);
    return d.toISOString().split('T')[0];
  });
  const [color, setColor] = useState('#6C4DFF');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addProject({
      name: name.trim(),
      description: description.trim() || 'Structured project roadmap and deliverable milestones.',
      status: 'active',
      progress: 15,
      dueDate,
      color,
    });
    playTaskCompleteSound();
    setName('');
    setDescription('');
    setIsAddOpen(false);
  };

  const handleProgressChange = (id: string, nextProgress: number) => {
    const clamped = Math.max(0, Math.min(100, nextProgress));
    if (clamped === 100) {
      playTaskCompleteSound();
      fireConfetti(40);
    }
    updateProject(id, {
      progress: clamped,
      status: clamped === 100 ? 'completed' : 'active',
    });
  };

  const filteredProjects = projects.filter((p) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return p.status !== 'completed';
    return p.status === 'completed';
  });

  const activeCount = projects.filter((p) => p.status !== 'completed').length;
  const completedCount = projects.filter((p) => p.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-stone-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Active Projects & Roadmaps
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-slate-400 mt-0.5">
            {activeCount} active · {completedCount} completed in your personal Planzo workspace
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-100 dark:bg-[#0B1324] border border-stone-200/80 dark:border-slate-800">
            {(['all', 'active', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                  filterStatus === tab
                    ? 'bg-white dark:bg-[#16223B] text-stone-900 dark:text-white shadow-2xs'
                    : 'text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#3B9CFF] hover:from-[#5B3DF5] hover:to-[#2B8CEB] text-white text-xs font-semibold shadow-md shadow-[#6C4DFF]/20 flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Project</span>
          </button>
        </div>
      </div>

      {/* Add Project Modal / Inline Drawer */}
      {isAddOpen && (
        <div className="rounded-2xl bg-white dark:bg-[#0B1324] border border-stone-200 dark:border-slate-800 p-5 sm:p-6 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-[#6C4DFF]" />
              <span>Create New Project</span>
            </h3>
            <button
              onClick={() => setIsAddOpen(false)}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreateProject} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6 space-y-1">
              <label className="block text-xs font-medium text-stone-600 dark:text-slate-300">
                Project Title
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AI Research Paper & Prototype"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-[#07111F] border border-stone-200 dark:border-slate-700 text-stone-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:border-[#3B9CFF]"
              />
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="block text-xs font-medium text-stone-600 dark:text-slate-300">
                Target Deadline
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-[#07111F] border border-stone-200 dark:border-slate-700 text-stone-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:border-[#3B9CFF]"
              />
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="block text-xs font-medium text-stone-600 dark:text-slate-300">
                Accent Theme
              </label>
              <div className="flex items-center gap-2 pt-1.5">
                {['#6C4DFF', '#3B9CFF', '#10B981', '#F59E0B', '#EC4899'].map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => setColor(hex)}
                    className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                      color === hex ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#07111F]' : ''
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>

            <div className="sm:col-span-12 space-y-1">
              <label className="block text-xs font-medium text-stone-600 dark:text-slate-300">
                Key Objectives & Notes
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is the primary outcome of this project?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-[#07111F] border border-stone-200 dark:border-slate-700 text-stone-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:border-[#3B9CFF]"
              />
            </div>

            <div className="sm:col-span-12 flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 rounded-xl border border-stone-200 dark:border-slate-700 text-xs font-medium text-stone-600 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#3B9CFF] text-white text-xs font-semibold cursor-pointer"
              >
                Save Project
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl bg-white dark:bg-[#0B1324] border border-stone-200/80 dark:border-slate-800 p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#6C4DFF]/15 text-[#6C4DFF] flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900 dark:text-white">
            No projects in this view yet
          </h3>
          <p className="text-xs text-stone-500 dark:text-slate-400 max-w-sm mx-auto">
            Create your first project to track milestones, deadlines, and completion progress in your Planzo workspace.
          </p>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#3B9CFF] text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProjects.map((project) => {
            const isCompleted = project.status === 'completed' || project.progress >= 100;
            return (
              <div
                key={project.id}
                className="rounded-2xl bg-white dark:bg-[#0B1324] border border-stone-200/80 dark:border-slate-800/90 p-5 shadow-xs hover:border-[#6C4DFF]/50 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: project.color || '#6C4DFF' }}
                      />
                      <h3
                        className={`text-base font-bold truncate ${
                          isCompleted
                            ? 'line-through text-stone-400 dark:text-slate-500'
                            : 'text-stone-900 dark:text-white'
                        }`}
                      >
                        {project.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono text-stone-500 dark:text-slate-400 tabular-nums">
                        {isCompleted ? 'Completed' : 'Active'}
                      </span>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="p-1 rounded-lg text-stone-400 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-stone-500 dark:text-slate-400 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-slate-800/80">
                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500 dark:text-slate-400 font-medium">
                        Completion Progress
                      </span>
                      <span className="font-mono font-bold text-[#3B9CFF] tabular-nums">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-stone-100 dark:bg-[#07111F] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${project.progress}%`,
                          background: 'linear-gradient(90deg, #6C4DFF 0%, #3B9CFF 100%)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Quick Progress Controls & Deadline */}
                  <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                    <div className="flex items-center gap-1.5 text-stone-500 dark:text-slate-400 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-[#3B9CFF]" />
                      <span>Due {project.dueDate}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleProgressChange(project.id, project.progress + 25)}
                        disabled={isCompleted}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#131F38] hover:bg-stone-200 dark:hover:bg-[#1B2B4B] disabled:opacity-40 text-stone-700 dark:text-slate-200 text-[11px] font-semibold cursor-pointer transition-colors"
                      >
                        +25%
                      </button>
                      <button
                        onClick={() =>
                          handleProgressChange(project.id, isCompleted ? 50 : 100)
                        }
                        className="px-2.5 py-1 rounded-lg bg-[#6C4DFF]/15 hover:bg-[#6C4DFF]/25 text-[#8C75FF] text-[11px] font-semibold cursor-pointer transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{isCompleted ? 'Reopen' : 'Complete'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
