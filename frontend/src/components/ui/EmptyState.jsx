import { HiClipboardList } from 'react-icons/hi';

const EmptyState = ({ title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
        <HiClipboardList className="w-8 h-8 text-brand-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-xs mb-6">{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;
