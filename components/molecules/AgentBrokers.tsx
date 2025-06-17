import React from "react";
import {
  AgentBrokerFeesData,
  AgentBrokerFeesToggleProps,
} from "@/types/generated";

const AgentBrokerFeesToggle: React.FC<AgentBrokerFeesToggleProps> = ({
  data,
  onChange,
  className = "",
  title = "Agent/Broker Fees",
  description = "Information about any agent or broker fees",
  questionText = "Was an agent/broker fee required?",
}) => {
  return (
    <div className={`border border-gray-200 rounded-lg p-4 ${className}`}>
      <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">{questionText}</span>
        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
          <input
            type="checkbox"
            checked={data.agentFeeRequired || false}
            onChange={(e) => onChange("agentFeeRequired", e.target.checked)}
            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
          />
          <label
            className={`toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
              data.agentFeeRequired ? "bg-orange-500" : ""
            }`}
          ></label>
        </div>
      </div>
    </div>
  );
};

export default AgentBrokerFeesToggle;
