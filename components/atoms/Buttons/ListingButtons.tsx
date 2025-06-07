
'use client';

import { LucideIcon } from 'lucide-react';
import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
  className?: string;
}

export default function ListingsButtons({
  icon: Icon,
  children,
  variant = 'primary',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'flex items-center gap-2 px-4 py-2 rounded font-medium transition',
        variant === 'primary'
          ? 'bg-orange-500 text-white hover:bg-orange-600'
          : 'border border-gray-300 text-gray-700 hover:bg-gray-100',
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}
