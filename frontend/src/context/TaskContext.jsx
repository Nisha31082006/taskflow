import { createContext, useContext, useState, useCallback, useRef } from 'react';
import taskService from '../services/taskService';
import toast from 'react-hot-toast';

const TaskContext = createContext(null);

const initialFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  sort: 'newest',
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, completionRate: 0 });
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fetchRef = useRef(null);

  const fetchTasks = useCallback(async (overrideFilters) => {
    setLoading(true);
    const params = overrideFilters || filters;
    const token = Symbol();
    fetchRef.current = token;
    try {
      const data = await taskService.getTasks({
        search: params.search || undefined,
        status: params.status !== 'all' ? params.status : undefined,
        priority: params.priority !== 'all' ? params.priority : undefined,
        sort: params.sort,
      });
      if (fetchRef.current !== token) return;
      setTasks(data.tasks);
      setStats(data.stats);
    } catch (err) {
      if (fetchRef.current === token) {
        toast.error(err.response?.data?.message || 'Failed to load tasks');
      }
    } finally {
      if (fetchRef.current === token) setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((updates) => {
    setFilters((prev) => {
      const next = { ...prev, ...updates };
      return next;
    });
  }, []);

  const createTask = useCallback(async (data) => {
    setSubmitting(true);
    try {
      const res = await taskService.createTask(data);
      toast.success('Task created');
      await fetchTasks();
      return { success: true, task: res.task };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  }, [fetchTasks]);

  const updateTask = useCallback(async (id, data) => {
    setSubmitting(true);
    try {
      const res = await taskService.updateTask(id, data);
      toast.success('Task updated');
      setTasks((prev) => prev.map((t) => (t._id === id ? res.task : t)));
      await fetchTasks();
      return { success: true, task: res.task };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  }, [fetchTasks]);

  const deleteTask = useCallback(async (id) => {
    try {
      await taskService.deleteTask(id);
      toast.success('Task deleted');
      setTasks((prev) => prev.filter((t) => t._id !== id));
      await fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    }
  }, [fetchTasks]);

  const toggleStatus = useCallback(async (id) => {
    try {
      const res = await taskService.toggleStatus(id);
      setTasks((prev) => prev.map((t) => (t._id === id ? res.task : t)));
      // Update stats optimistically then refetch
      await fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  }, [fetchTasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        filters,
        loading,
        submitting,
        fetchTasks,
        updateFilters,
        createTask,
        updateTask,
        deleteTask,
        toggleStatus,
        resetFilters: () => setFilters(initialFilters),
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};
