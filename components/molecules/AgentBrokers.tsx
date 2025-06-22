import React from "react";
import { useReviewForm } from "@/app/context/RevievFormContext";

const AgentBrokerFeesToggle: React.FC = () => {
  const { location, setLocation } = useReviewForm();
  const agentFeeRequired = location?.agentFeeRequired || false;

  return (
    <div className={`border border-gray-200 rounded-lg p-4`}>
      <h3 className="font-medium text-gray-900 mb-2">Agent/Broker Fees</h3>
      <p className="text-sm text-gray-600 mb-4">
        Information about any agent or broker fees
      </p>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">
          Was an agent/broker fee required?
        </span>
        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
          <input
            type="checkbox"
            checked={agentFeeRequired}
            onChange={(e) =>
              setLocation({ ...location, agentFeeRequired: e.target.checked })
            }
            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4  border-white appearance-none cursor-pointer"
          />
          <label
            className={`toggle-label block overflow-hidden h-6 rounded-full bg-[#D9D9D9] cursor-pointer ${
              agentFeeRequired ? "bg-orange-500" : ""
            }`}
          ></label>
        </div>
      </div>
    </div>
  );
};

export default AgentBrokerFeesToggle;
