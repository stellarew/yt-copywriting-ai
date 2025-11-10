
import React from 'react';

export type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  ...props
}) => {
  const baseClasses =
    'h-full w-full rounded-lg p-3 text-sm flex flex-col items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 shadow',
    secondary: 'bg-white text-blue-700 border border-blue-400 hover:bg-blue-50 focus:ring-blue-500 shadow-sm',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {children}
    </button>
  );
};
