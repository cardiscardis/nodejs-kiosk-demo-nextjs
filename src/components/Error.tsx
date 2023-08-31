import { ReactNode } from 'react';

const Error = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="mt-4 bg-red-700 py-2 px-4">
      <span data-testid="error-text" className="text-slate-50">
        {children ? children : 'Error'}
      </span>
    </div>
  );
};

export default Error;
