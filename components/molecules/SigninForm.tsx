
"use clients";
import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import SignInButton from '@/components/atoms/Buttons/SignInButton';
import { SignInFormProps } from '@/types/generated';

const SignInForm: React.FC<SignInFormProps> = ({ isSubmitting, onSubmit, register, errors }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
      <div className="space-y-4 shadow-xl">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="mt-1">
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="example@email.com"
              className={`block w-full rounded-md border ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              } px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm`}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-500 hover:text-blue-400">
                Forgot password?
              </a>
            </div>
          </div>
          <div className="mt-1 relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter password"
              className={`block w-full rounded-md border ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              } px-3 py-2 pr-10 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm`}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              )}
            </button>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* ==== Sign In Button ========= */}
      <div>
        <SignInButton isSubmitting={isSubmitting}/>
      </div>
    </form>
  );
};

export default SignInForm;



