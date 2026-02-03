import type { InputHTMLAttributes } from 'react';

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
      className={`${width} ${height} placeholder:text-neutral-60 rounded-xl bg-white px-3.5 py-1.5 font-['Roboto'] text-lg font-medium text-black outline-1 -outline-offset-1 outline-neutral-50 ${className}`}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default Input;
