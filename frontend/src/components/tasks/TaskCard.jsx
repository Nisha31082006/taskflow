import { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import ConfirmDialog from '../ui/ConfirmDialog';
import { formatDate, isOverdue, isDueSoon } from '../../utils/helpers';
import {
  HiPencil,
  HiTrash,
  HiCheck,
  HiClock,
  HiCalendar,
  HiFlag,
  HiExclamation,
} from 'react-icons/hi';

const PriorityBadge = ({ priority }) => {
  const map = {
    low: <span className="badge-low"><HiFlag className="w-3 h-3" />Low</span>,
    medium: <span className="badge-medium"><HiFlag className="w-3 h-3" />Medium</span>,
    high: <span className="badge-high"><HiFlag className="w-3 h-3" />High</span>,
  };
  return map[priority] || null;
};

const StatusBadge = ({ status }) => {
  return status === 'completed'
    ? <span className="badge-completed"><HiCheck className="w-3 h-3" />Completed</span>
    : <span className="badge-pending"><HiClock className="w-3 h-3" />Pending</span>;
};

const TaskCard = ({ task, onEdit }) => {
  const { toggleStatus, deleteTask } = useTasks();
  const [showConfirm, setShowConfirm] = useState(false);
  const [toggling, setToggling] = useState(false);

  const overdue = isOverdue(task.dueDate, task.status);
  const dueSoon = isDueSoon(task.dueDate, task.status);

  const handleToggle = async () => {
    setToggling(true);
    await toggleStatus(task._id);
    setToggling(false);
  };

  return (
    <>
      <div
        className={`card p-5 hover:shadow-md transition-all duration-200 group ${
          task.status === 'completed' ? 'opacity-75' : ''
        } ${overdue ? 'border-red-200' : ''}`}
      >
        <div className="flex items-start gap-3">
          {/* Toggle checkbox */}
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              task.status === 'completed'
                ? 'bg-brand-600 border-brand-600'
                : 'border-surface-300 hover:border-brand-500'
            } ${toggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            title={task.status === 'completed' ? 'Mark as pending' : 'Mark as complete'}
          >
            {task.status === 'completed' && <HiCheck className="w-3 h-3 text-white" />}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={`text-sm font-semibold leading-snug ${
                  task.status === 'completed'
                    ? 'line-through text-slate-400'
                    : 'text-slate-800'
                }`}
              >
                {task.title}
              </h3>

              {/* Actions - visible on hover */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => onEdit(task)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                  title="Edit task"
                >
                  <HiPencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete task"
                >
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            </div>

            {task.description && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />

              {task.dueDate && (
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium ${
                    overdue
                      ? 'text-red-600'
                      : dueSoon
                      ? 'text-amber-600'
                      : 'text-slate-500'
                  }`}
                >
                  {overdue ? (
                    <HiExclamation className="w-3 h-3" />
                  ) : (
                    <HiCalendar className="w-3 h-3" />
                  )}
                  {overdue ? 'Overdue · ' : dueSoon ? 'Due soon · ' : ''}
                  {formatDate(task.dueDate)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => deleteTask(task._id)}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmLabel="Delete task"
      />
    </>
  );
};

export default TaskCard;
