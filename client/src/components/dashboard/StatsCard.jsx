const StatsCard = ({ title, value, icon: Icon, color, sub }) => {
  const colors = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-500', border: 'border-blue-100', val: 'text-blue-700' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-500', border: 'border-emerald-100', val: 'text-emerald-700' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-500', border: 'border-amber-100', val: 'text-amber-700' },
    red: { bg: 'bg-red-50', icon: 'text-red-500', border: 'border-red-100', val: 'text-red-700' },
    brand: { bg: 'bg-brand-50', icon: 'text-brand-500', border: 'border-brand-100', val: 'text-brand-700' },
  };
  const c = colors[color] || colors.brand;

  return (
    <div className={`card p-5 border ${c.border} ${c.bg} hover:-translate-y-0.5 transition-transform duration-200`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${c.val}`}>{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
          <Icon size={18} className={c.icon} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
