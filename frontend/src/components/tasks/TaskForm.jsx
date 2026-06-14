import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';
import { useTasks } from '../../context/TaskContext';
import { formatDateInput } from '../../utils/helpers';

const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'text-emerald-600' },
  { value: 'medium', label: 'Medium', color: 'text-amber-600' },
  { value: 'high', label: 'High', color: 'text-red-600' },
];

const STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

const defaultForm = { title: '', description: '', priority: 'medium', status: 'pending', dueDate: '' };

const TaskForm = ({ isOpen, onClose, task = null }) => {
  const { createTask, updateTask, submitting } = useTasks();
  const isEdit = !!task;

  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        dueDate: formatDateInput(task.dueDate) || '',
      });
    } else {
      setForm(defaultForm);
    }
  }, [task, isOpen]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      dueDate: form.dueDate || null,
    };

    const result = isEdit
      ? await updateTask(task._id, payload)
      : await createTask(payload);

    if (result.success) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Task' : 'New Task'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            name="title"
            type="text"
            placeholder="What needs to be done?"
            value={form.title}
            onChange={handleChange}
            className="input-field"
            required
            maxLength={100}
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
          <textarea
            name="description"
            placeholder="Add any details or notes..."
            value={form.description}
            onChange={handleChange}
            rows={3}
            maxLength={500}
            className="input-field resize-none"
          />
          <p className="text-xs text-slate-400 mt-1 text-right">{form.description.length}/500</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Status (only for edit) */}
          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-field">
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Due Date */}
          <div className={isEdit ? 'col-span-2' : ''}>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Due Date</label>
            <input
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
              className="input-field"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1">
            {submitting ? (
              <><Spinner size="sm" /> {isEdit ? 'Saving...' : 'Creating...'}</>
            ) : (
              isEdit ? 'Save changes' : 'Create task'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;
