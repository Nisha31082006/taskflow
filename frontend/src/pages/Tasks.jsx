import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import TaskCard from '../components/tasks/TaskCard';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskForm from '../components/tasks/TaskForm';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import { useTasks } from '../context/TaskContext';
import { HiPlus, HiRefresh } from 'react-icons/hi';

const Tasks = () => {
  const { tasks, stats, loading, fetchTasks, filters } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const handleEdit = (task) => setEditTask(task);
  const handleCloseForm = () => { setShowForm(false); setEditTask(null); };

  const hasFilters = filters.search || filters.status !== 'all' || filters.priority !== 'all';

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">All Tasks</h1>
            <p className="text-sm text-slate-500 mt-1">
              {loading ? 'Loading...' : `${stats.total} total · ${stats.pending} pending · ${stats.completed} done`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchTasks()}
              className="btn-ghost"
              title="Refresh tasks"
            >
              <HiRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              <HiPlus className="w-4 h-4" />
              <span className="hidden sm:inline">New Task</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <TaskFilters />

        {/* Task list */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Spinner size="lg" />
            <p className="text-sm text-slate-400">Loading your tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            title={hasFilters ? 'No tasks match your filters' : 'No tasks yet'}
            description={
              hasFilters
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Create your first task to start tracking your work and staying organized.'
            }
            action={
              !hasFilters && (
                <button onClick={() => setShowForm(true)} className="btn-primary">
                  <HiPlus className="w-4 h-4" />
                  Create first task
                </button>
              )
            }
          />
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} onEdit={handleEdit} />
            ))}
            <p className="text-center text-xs text-slate-400 py-4">
              Showing {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </main>

      <TaskForm isOpen={showForm || !!editTask} onClose={handleCloseForm} task={editTask} />
    </div>
  );
};

export default Tasks;
