const StatCard = ({ label, value, icon: Icon, color, subLabel }) => {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        {subLabel && <p className="text-xs text-slate-400 mt-0.5">{subLabel}</p>}
      </div>
    </div>
  );
};

export default StatCard;
