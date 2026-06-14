import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/tasks/StatCard';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import Spinner from '../components/ui/Spinner';
import Navbar from '../components/layout/Navbar';
import {
  HiClipboardList,
  HiCheckCircle,
  HiClock,
  HiTrendingUp,
  HiPlus,
  HiArrowRight,
} from 'react-icons/hi';

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, stats, loading, fetchTasks } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    fetchTasks({ search: '', status: 'all', priority: 'all', sort: 'newest' });
  }, []);

  const recentTasks = tasks.slice(0, 5);
  const pendingHighPriority = tasks.filter((t) => t.status === 'pending' && t.priority === 'high');

  const handleEdit = (task) => setEditTask(task);
  const handleCloseForm = () => { setShowForm(false); setEditTask(null); };

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-sm text-slate-500 mt-1">Here's what's happening with your tasks today.</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <HiPlus className="w-4 h-4" />
            New Task
          </button>
        </div>

        {/* Stats Grid */}
        {loading && tasks.length === 0 ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Total Tasks"
                value={stats.total}
                icon={HiClipboardList}
                color="bg-brand-50 text-brand-600"
              />
              <StatCard
                label="Completed"
                value={stats.completed}
                icon={HiCheckCircle}
                color="bg-green-50 text-green-600"
              />
              <StatCard
                label="Pending"
                value={stats.pending}
                icon={HiClock}
                color="bg-amber-50 text-amber-600"
              />
              <StatCard
                label="Completion Rate"
                value={`${stats.completionRate}%`}
                icon={HiTrendingUp}
                color="bg-purple-50 text-purple-600"
                subLabel={stats.total > 0 ? `${stats.completed} of ${stats.total} done` : 'No tasks yet'}
              />
            </div>

            {/* Progress bar */}
            {stats.total > 0 && (
              <div className="card p-5 mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-700">Overall Progress</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{stats.pending} tasks remaining</p>
                  </div>
                  <span className="text-2xl font-bold text-brand-600">{stats.completionRate}%</span>
                </div>
                <div className="w-full bg-surface-200 rounded-full h-2.5">
                  <div
                    className="bg-brand-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${stats.completionRate}%` }}
                  />
                </div>
              </div>
            )}

            {/* High priority alert */}
            {pendingHighPriority.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <HiClock className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-800">
                    {pendingHighPriority.length} high-priority task{pendingHighPriority.length > 1 ? 's' : ''} need attention
                  </p>
                  <p className="text-xs text-red-600 mt-0.5">
                    {pendingHighPriority.map((t) => t.title).join(', ')}
                  </p>
                </div>
              </div>
            )}

            {/* Recent Tasks */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800">Recent Tasks</h2>
              <Link to="/tasks" className="text-sm text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1">
                View all <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {recentTasks.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-slate-400 text-sm mb-3">No tasks yet. Create your first task to get started.</p>
                <button onClick={() => setShowForm(true)} className="btn-primary mx-auto">
                  <HiPlus className="w-4 h-4" />
                  Create first task
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <TaskCard key={task._id} task={task} onEdit={handleEdit} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <TaskForm isOpen={showForm || !!editTask} onClose={handleCloseForm} task={editTask} />
    </div>
  );
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
};

export default Dashboard;
