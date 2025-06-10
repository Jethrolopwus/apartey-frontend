"use  client";

import React from 'react';

type AddressInputProps = {
  value: string;
  onChange: (value: string) => void;
};

const AddressInput: React.FC<AddressInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Address <span className="text-gray-400 text-xs ml-1">ⓘ</span>
      </label>
      <input
        type="text"
        placeholder="Enter Billing Address"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default AddressInput;
