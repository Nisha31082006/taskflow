import { useEffect, useRef } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useDebounce } from '../../hooks/useDebounce';
import { HiSearch, HiX, HiFilter } from 'react-icons/hi';

const TaskFilters = () => {
  const { filters, updateFilters, fetchTasks, resetFilters } = useTasks();
  const debouncedSearch = useDebounce(filters.search, 400);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      fetchTasks();
      return;
    }
    fetchTasks({ ...filters, search: debouncedSearch });
  }, [debouncedSearch, filters.status, filters.priority, filters.sort]);

  const hasActiveFilters =
    filters.search || filters.status !== 'all' || filters.priority !== 'all' || filters.sort !== 'newest';

  return (
    <div className="card p-4 mb-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="input-field pl-9 pr-8"
          />
          {filters.search && (
            <button
              onClick={() => updateFilters({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <HiX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters row */}
        <div className="flex items-center gap-2 flex-wrap">
          <HiFilter className="w-4 h-4 text-slate-400 hidden sm:block" />

          <select
            value={filters.status}
            onChange={(e) => updateFilters({ status: e.target.value })}
            className="input-field w-auto text-xs py-2"
          >
            <option value="all">All status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => updateFilters({ priority: e.target.value })}
            className="input-field w-auto text-xs py-2"
          >
            <option value="all">All priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filters.sort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="input-field w-auto text-xs py-2"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="dueDate">By due date</option>
            <option value="priority">By priority</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={() => {
                resetFilters();
                fetchTasks({ search: '', status: 'all', priority: 'all', sort: 'newest' });
              }}
              className="btn-ghost text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <HiX className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
