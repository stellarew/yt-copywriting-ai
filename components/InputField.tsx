
import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  labelDetail?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ id, label, labelDetail, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
        {labelDetail && <span className="text-gray-400 font-normal ml-2">— {labelDetail}</span>}
      </label>
      <input
        id={id}
        type="text"
        className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        {...props}
      />
    </div>
  );
};
