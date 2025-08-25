"use client";

import { useState, useEffect, useCallback } from "react";
import { PropertyListingFormState, Currency, OfferType } from "@/types/propertyListing";
import { User, Building } from "lucide-react";

interface PriceFormProps {
  formData: PropertyListingFormState;
  setFormData: React.Dispatch<React.SetStateAction<PropertyListingFormState>>;
}

const PriceForm = ({ formData, setFormData }: PriceFormProps) => {
  const [selectedCategory, setSelectedCategory] = useState("Rent");
  const [localData, setLocalData] = useState({
    price: formData.price || "",
    currency: formData.currency || "EUR" as Currency,
    isNegotiated: formData.isNegotiated || false,
    offerType: formData.offerType || "private" as OfferType,
    rentType: formData.rentType || "Monthly",
    notForCreditSale: formData.notForCreditSale || false,
    readyToCooperateWithAgents: formData.readyToCooperateWithAgents || false,
    possibleExchange: formData.possibleExchange || false,
  });

  // Track category changes from PropertyTypeStep
  useEffect(() => {
    if (formData.category) {
      setSelectedCategory(formData.category);
    }
  }, [formData.category]);

  const updateFormData = useCallback(() => {
    setFormData((prev) => ({ ...prev, ...localData }));
  }, [localData, setFormData]);

  useEffect(() => {
    updateFormData();
  }, [updateFormData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: keyof typeof localData) => {
    setLocalData((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleOfferTypeChange = (type: OfferType) => {
    setLocalData((prev) => ({ ...prev, offerType: type }));
  };

  const handleRentTypeChange = (rentType: string) => {
    setLocalData((prev) => ({ ...prev, rentType }));
  };

  return (
    <div className="w-full space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Price</h1>

      {/* Price Input Section - Conditional Rendering */}
      {selectedCategory === "Rent" ? (
        // Rent Home Price Input Section
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Rent</h3>
          <p className="text-sm text-gray-600 mb-4">Enter your rent amount</p>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="yearly"
                name="rentType"
                checked={localData.rentType === "Yearly"}
                onChange={() => handleRentTypeChange("Yearly")}
                className="w-4 h-4 text-orange-600"
              />
              <label htmlFor="yearly" className="text-sm text-gray-700">
                Yearly
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="monthly"
                name="rentType"
                checked={localData.rentType === "Monthly"}
                onChange={() => handleRentTypeChange("Monthly")}
                className="w-4 h-4 text-orange-600"
              />
              <label htmlFor="monthly" className="text-sm text-gray-700">
                Monthly
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {localData.rentType} Rent <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-orange-500">
              <select
                value={localData.currency}
                onChange={(e) =>
                  setLocalData((p) => ({ ...p, currency: e.target.value as Currency }))
                }
                className="w-20 px-2 py-2 border-r border-gray-300 rounded-l-md focus:outline-none appearance-none bg-white text-sm text-gray-700"
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="NGN">NGN</option>
              </select>
              <input
                type="text"
                name="price"
                value={localData.price}
                onChange={handleInputChange}
                placeholder={`${localData.currency} 300,000`}
                className="w-full px-3 py-2 border-0 rounded-r-md focus:outline-none focus:ring-0 text-sm text-gray-700"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter your {localData.rentType.toLowerCase()} rent amount
            </p>
          </div>
        </div>
      ) : (
        // Swap Home Price Input Section (Simple)
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 flex gap-2 w-full max-w-sm">
            <select
              id="currency"
              name="currency"
              value={localData.currency}
              onChange={(e) =>
                setLocalData((p) => ({ ...p, currency: e.target.value as Currency }))
              }
              className="rounded-md border border-gray-300 bg-white py-2 px-3 text-base text-gray-700 focus:border-gray-500 focus:ring-gray-500 outline-none"
              style={{ minWidth: 60 }}
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="NGN">NGN</option>
            </select>
            <input
              type="text"
              name="price"
              id="price"
              value={localData.price}
              onChange={handleInputChange}
              className="block w-full rounded-md border border-gray-300 focus:border-gray-500 focus:ring-gray-500 text-base py-2 px-4 outline-none"
              placeholder=""
              style={{ minWidth: 0 }}
            />
          </div>
        </div>
      )}

      {/* Negotiated Price Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Negotiated price
        </span>
        <button
          onClick={() => handleToggleChange("isNegotiated")}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            localData.isNegotiated ? "bg-gray-800" : "bg-gray-200"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              localData.isNegotiated ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Type of Offer Section */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Type of offer <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => handleOfferTypeChange("private")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
              localData.offerType === "private"
                ? "border-gray-600 bg-gray-100 text-gray-800"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
            }`}
          >
            <User className="w-4 h-4" />
            Private person
          </button>
          <button
            onClick={() => handleOfferTypeChange("agent")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
              localData.offerType === "agent"
                ? "border-gray-600 bg-gray-100 text-gray-800"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
            }`}
          >
            <Building className="w-4 h-4" />
            Real estate agent
          </button>
        </div>
      </div>

      {/* Additional Options Section */}
      <div className="space-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="notForCreditSale"
            name="notForCreditSale"
            checked={localData.notForCreditSale}
            onChange={() => handleToggleChange("notForCreditSale")}
            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
          />
          <label htmlFor="notForCreditSale" className="ml-2 text-sm text-gray-700">
            Not available for sale on credit
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="readyToCooperateWithAgents"
            name="readyToCooperateWithAgents"
            checked={localData.readyToCooperateWithAgents}
            onChange={() => handleToggleChange("readyToCooperateWithAgents")}
            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
          />
          <label htmlFor="readyToCooperateWithAgents" className="ml-2 text-sm text-gray-700">
            Ready to cooperate with real estate agents
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="possibleExchange"
            name="possibleExchange"
            checked={localData.possibleExchange}
            onChange={() => handleToggleChange("possibleExchange")}
            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
          />
          <label htmlFor="possibleExchange" className="ml-2 text-sm text-gray-700">
            The possibility of exchange
          </label>
        </div>
      </div>
    </div>
  );
};

export default PriceForm;
