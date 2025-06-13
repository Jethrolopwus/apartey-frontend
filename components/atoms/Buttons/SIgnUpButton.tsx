import React from 'react';

import { SignUpButtonProps } from '@/types/generated';

const SignUpButton: React.FC<SignUpButtonProps> = ({ isSubmitting }) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="flex w-full justify-center cursor-pointer rounded-md bg-[#C85212] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-75"
    >
      {isSubmitting ? 'Creating account...' : 'Create account'}
    </button>
  );
};

export default SignUpButton;