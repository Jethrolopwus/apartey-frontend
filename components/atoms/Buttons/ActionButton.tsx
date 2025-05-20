import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  className?: string;
}

const Button = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}: ButtonProps) => {
  const baseClasses = "py-3 px-8 rounded-md transition-colors";
  
  const variantClasses = {
    primary: "bg-orange-500 hover:bg-orange-600 cursor-pointer text-white",
    secondary: "border border-orange-500 text-orange-500 cursor-pointer hover:bg-orange-50"
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`;
  
  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;