"use client";

type CostDetailsData = {
  rent: number;
  rentType: "Monthly" | "Yearly";
  securityDepositRequired: boolean;
  agentBrokerFeeRequired: boolean;
  fixedUtilityCost: boolean;
  julySummerUtilities: number;
  januaryWinterUtilities: number;
};

type Props = {
  costDetails: CostDetailsData;
  onInputChange: (field: keyof CostDetailsData, value: number | boolean | 'Monthly' | 'Yearly') => void;
};

export default function CostDetails({ costDetails, onInputChange }: Props) {
  const handleNumberChange = (field: keyof CostDetailsData, value: string) => {
    const numValue = parseFloat(value) || 0;
    onInputChange(field, numValue);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Cost Details
      </h2>

      {/* Rent Amount and Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rent Amount
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={costDetails.rent ?? ""}
            onChange={(e) => handleNumberChange("rent", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rent Type
          </label>
          <select
            value={costDetails.rentType}
            onChange={(e) => onInputChange("rentType", e.target.value as "Monthly" | "Yearly")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={costDetails.securityDepositRequired}
            onChange={(e) => onInputChange("securityDepositRequired", e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">
            Security Deposit Required
          </span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={costDetails.agentBrokerFeeRequired}
            onChange={(e) => onInputChange("agentBrokerFeeRequired", e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">
            Agent/Broker Fee Required
          </span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={costDetails.fixedUtilityCost}
            onChange={(e) => onInputChange("fixedUtilityCost", e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">
            Fixed Utility Cost
          </span>
        </label>
      </div>

      {/* Utility Costs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            July Summer Utilities (€)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={costDetails.julySummerUtilities}
            onChange={(e) => handleNumberChange("julySummerUtilities", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            January Winter Utilities (€)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={costDetails.januaryWinterUtilities}
            onChange={(e) => handleNumberChange("januaryWinterUtilities", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}