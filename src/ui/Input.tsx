import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    id,
    name,
    value,
    onChange,
    type = 'text',
    placeholder,
    ...rest
}) => {
    const inputId = id || name;

    return (
        <div>
            <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                id={inputId}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-1 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'}`}
                {...rest}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default Input;