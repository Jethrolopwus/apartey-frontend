import React from 'react';
import { GoogleAuthButtonProps } from '@/types/generated';

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ mode, onClick }) => {
  const buttonText = mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google';
  
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
    >
      <img
        className="mr-2 h-5 w-5"
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google logo"
      />
      {buttonText}
    </button>
  );
};

export default GoogleAuthButton;