import React from 'react';

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  options: { value: string; label: string }[];
}

export const SelectField: React.FC<SelectFieldProps> = ({ id, label, options, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <select
        id={id}
        className="block w-full pl-3 pr-10 py-3 text-base bg-gray-800/50 border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md shadow-sm transition"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-gray-800 text-white">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};