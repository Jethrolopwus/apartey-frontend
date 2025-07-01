"use client";
import React from "react";

interface SecurityDepositToggleProps {
  securityDepositRequired: boolean;
  onSecurityDepositChange: (required: boolean) => void;
}

const SecurityDepositToggle: React.FC<SecurityDepositToggleProps> = ({
  securityDepositRequired,
  onSecurityDepositChange,
}) => {
  return (
    <div className={`border border-gray-200 rounded-lg p-4`}>
      <h3 className="font-medium text-gray-900 mb-2">Security Deposit</h3>
      <p className="text-sm text-gray-600 mb-4">
        Information about your security deposit
      </p>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">
          Was a security deposit required?
        </span>
        <div className="relative inline-block w-10 mr-3 align-middle select-none transition duration-200 ease-in">
          <input
            type="checkbox"
            checked={securityDepositRequired}
            onChange={(e) => {
              onSecurityDepositChange(e.target.checked);
              console.log('Security Deposit Required:', e.target.checked);
            }}
            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-white appearance-none cursor-pointer"
          />
          <label
            className={`toggle-label block overflow-hidden h-6 rounded-full bg-[#D9D9D9] cursor-pointer ${
              securityDepositRequired ? "bg-orange-500" : ""
            }`}
          ></label>
        </div>
      </div>
    </div>
  );
};

export default SecurityDepositToggle;
