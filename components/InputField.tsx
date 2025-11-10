import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  labelDetail?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ id, label, labelDetail, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
        {labelDetail && <span className="text-gray-400 font-normal ml-2">— {labelDetail}</span>}
      </label>
      <input
        id={id}
        type="text"
        className="block w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-md shadow-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition"
        {...props}
      />
    </div>
  );
};