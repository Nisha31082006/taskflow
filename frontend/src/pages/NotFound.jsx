import { Link } from 'react-router-dom';
import { HiHome, HiLightningBolt } from 'react-icons/hi';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center">
            <HiLightningBolt className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-800">TaskFlow</span>
        </div>
        <h1 className="text-7xl font-bold text-brand-600 mb-4">404</h1>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Page not found</h2>
        <p className="text-slate-500 text-sm mb-8 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard" className="btn-primary">
          <HiHome className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
