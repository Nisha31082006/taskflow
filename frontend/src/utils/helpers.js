export const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const isOverdue = (dateStr, status) => {
  if (!dateStr || status === 'completed') return false;
  return new Date(dateStr) < new Date();
};

export const isDueSoon = (dateStr, status) => {
  if (!dateStr || status === 'completed') return false;
  const diff = new Date(dateStr) - new Date();
  return diff > 0 && diff < 2 * 24 * 60 * 60 * 1000;
};

export const getPriorityOrder = (priority) => {
  return { high: 3, medium: 2, low: 1 }[priority] || 0;
};

export const formatDateInput = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0];
};
