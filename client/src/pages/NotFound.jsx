import { Link } from 'react-router-dom';
import { Zap, ArrowLeft } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center p-8">
    <div className="text-center">
      <div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <Zap size={36} className="text-brand-400" />
      </div>
      <h1 className="text-7xl font-black text-gray-100 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Page not found</h2>
      <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/dashboard" className="btn-primary inline-flex">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
    </div>
  </div>
);

export default NotFound;
