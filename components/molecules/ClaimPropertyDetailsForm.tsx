import React from 'react';

interface ClaimPropertyDetailsFormProps {
  form: {
    streetAddress: string;
    district: string;
    state: string;
    postalCode: string;
    propertyType: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleContinue: (e: React.FormEvent) => void;
  handleCancel: () => void;
  readOnlyFields?: string[];
}

const ClaimPropertyDetailsForm: React.FC<ClaimPropertyDetailsFormProps> = ({
  form,
  handleChange,
  handleContinue,
  handleCancel,
  readOnlyFields = [],
}) => (
  <form onSubmit={handleContinue} className="w-full max-w-xl bg-white rounded-lg shadow p-8">
    <h2 className="text-xl font-semibold text-gray-800 mb-1">Property Details</h2>
    <p className="text-gray-500 mb-6">Enter the details of your property</p>
    <div className="mb-4">
      <label className="block text-gray-700 mb-1" htmlFor="streetAddress">Street Address</label>
      <input
        id="streetAddress"
        name="streetAddress"
        type="text"
        value={form.streetAddress}
        onChange={handleChange}
        placeholder="e.g. No 12 wuse street, Abuja"
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-800"
        required
        readOnly={readOnlyFields.includes('streetAddress')}
      />
    </div>
    <div className="flex gap-4 mb-4">
      <div className="flex-1">
        <label className="block text-gray-700 mb-1" htmlFor="district">District</label>
        <input
          id="district"
          name="district"
          type="text"
          value={form.district}
          onChange={handleChange}
          placeholder="e.g. Wuse II"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-800"
          required
          readOnly={readOnlyFields.includes('district')}
        />
      </div>
      <div className="flex-1">
        <label className="block text-gray-700 mb-1" htmlFor="state">State</label>
        <select
          id="state"
          name="state"
          value={form.state}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-800"
          required
          disabled={readOnlyFields.includes('state')}
        >
          <option value="">Select state</option>
          <option value="Abuja">Abuja</option>
          <option value="Lagos">Lagos</option>
          <option value="Kano">Kano</option>
          {/* Add more states as needed */}
        </select>
      </div>
    </div>
    <div className="flex gap-4 mb-6">
      <div className="flex-1">
        <label className="block text-gray-700 mb-1" htmlFor="postalCode">Postal Code</label>
        <input
          id="postalCode"
          name="postalCode"
          type="text"
          value={form.postalCode}
          onChange={handleChange}
          placeholder="e.g. 17245"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-800"
          required
          readOnly={readOnlyFields.includes('postalCode')}
        />
      </div>
      <div className="flex-1">
        <label className="block text-gray-700 mb-1" htmlFor="propertyType">Property Type</label>
        <select
          id="propertyType"
          name="propertyType"
          value={form.propertyType}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-800"
          required
        >
          <option value="">Select type</option>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Condo">Commercial</option>
          <option value="Condo">Room</option>
          <option value="Condo">Garage</option>
          {/* Add more types as needed */}
        </select>
      </div>
    </div>
    <div className="flex justify-between gap-4">
      <button
        type="button"
        onClick={handleCancel}
        className="px-6 py-2 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-100"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-6 py-2 rounded text-white bg-[#C85212] hover:bg-orange-700"
      >
        Continue
      </button>
    </div>
  </form>
);

export default ClaimPropertyDetailsForm; 