import React from 'react';
import { SignInButtonProps } from '@/types/generated';


const SignInButton: React.FC<SignInButtonProps> = ({ isSubmitting }) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="flex w-full justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-75"
    >
      {isSubmitting ? 'Signing in...' : 'Sign in'}
    </button>
  );
};

export default SignInButton;