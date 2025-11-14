export const LoadingSpinner = ({ size = 'large' }: { size?: 'small' | 'large' }) => {
  const spinnerSize = size === 'small' ? 'h-4 w-4' : 'h-12 w-12';
  const containerClass = size === 'small' 
    ? 'flex justify-center items-center' 
    : 'flex justify-center items-center p-8';

  return (
    <div className={containerClass}>
      <div className={`animate-spin rounded-full ${spinnerSize} border-b-2 border-blue-600`}></div>
    </div>
  );
};

