
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = 'px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 transition-all duration-200 ease-in-out flex items-center justify-center gap-2';

  const variantStyles = {
    primary: 'bg-brand-primary hover:bg-brand-secondary text-white focus:ring-brand-secondary',
    secondary: 'bg-base-300 hover:bg-slate-500 text-slate-100 focus:ring-slate-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-700',
  };

  return (
    <button className={`${baseStyle} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
