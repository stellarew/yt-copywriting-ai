import React from 'react';

export type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  className,
  ...props
}) => {
  const baseClasses =
    'w-full rounded-lg px-4 py-2 text-sm font-semibold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-md';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-purple-500',
    secondary: 'bg-gray-700 text-gray-300 border border-transparent hover:bg-gray-600 hover:border-gray-500 focus:ring-blue-500',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};