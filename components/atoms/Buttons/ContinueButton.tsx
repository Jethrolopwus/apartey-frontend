
import React from 'react';

interface SubmitButtonProps {
  label: string;
  disabled?: boolean;
}

const ContinueButton: React.FC<SubmitButtonProps> = ({ label , disabled}) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full bg-orange-600 mt-4 cursor-pointer text-white py-2 rounded-md hover:bg-orange-700 transition-colors"
    >
      {label}
    </button>
  );
};

export default ContinueButton;
