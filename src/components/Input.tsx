import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  width?: string;
  height?: string;
  rounded?: string;
  placeholder?: string;
}

const Input = ({
  width = 'w-full',
  height = 'h-12',
  rounded = 'rounded-xl',
  placeholder = '',
  className = '',
  ...props
}: InputProps) => {
  return (
    <input
      className={`${width} ${height} ${rounded} placeholder:text-neutral-60 bg-white px-3.5 py-1.5 font-['Roboto'] text-lg font-medium text-black outline-1 -outline-offset-1 outline-neutral-50 transition-all focus:placeholder:text-transparent focus:outline-orange-500 ${className}`}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default Input;
