const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8', xl: 'w-12 h-12' };
  return (
    <div
      className={`${sizes[size]} border-2 border-surface-200 border-t-brand-600 rounded-full animate-spin ${className}`}
    />
  );
};

export default Spinner;
