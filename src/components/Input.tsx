import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  width?: string;
  height?: string;
  placeholder?: string;
}

const Input = ({
  width = 'w-full',
  height = 'h-12',
  placeholder = '',
  className = '',
  ...props
}: InputProps) => {
  return (
    <input
      className={`${width} ${height} px-3.5 py-1.5 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-300 text-gray-900 text-lg font-medium font-['Roboto'] placeholder:text-gray-300 ${className}`}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default Input;
