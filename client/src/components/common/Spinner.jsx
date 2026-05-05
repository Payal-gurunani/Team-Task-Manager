const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10', xl: 'w-14 h-14' };
  return (
    <div className={`${sizes[size]} border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin ${className}`} />
  );
};

export const FullPageSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
    <div className="text-center space-y-4">
      <Spinner size="xl" />
      <p className="text-sm text-gray-500 font-medium">Loading...</p>
    </div>
  </div>
);

export default Spinner;
