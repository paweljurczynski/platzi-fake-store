interface ErrorMessageProps {
  message?: string;
  title?: string;
}

export const ErrorMessage = ({
  message = 'Something went wrong',
  title = 'Error',
}: ErrorMessageProps) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <h3 className="text-red-800 font-semibold mb-2">{title}</h3>
      <p className="text-red-600">{message}</p>
    </div>
  );
};

