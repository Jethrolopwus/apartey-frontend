import React from 'react';

interface ClaimPropertyVerificationFormProps {
  form: {
    fullName: string;
    email: string;
    phone: string;
    additionalDetails: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleContinue: (e: React.FormEvent) => void;
  handleCancel: () => void;
  readOnlyFields?: string[];
}

const ClaimPropertyVerificationForm: React.FC<ClaimPropertyVerificationFormProps> = ({
  form,
  handleChange,
  handleContinue,
  handleCancel,
  readOnlyFields = [],
}) => (
  <form onSubmit={handleContinue} className="w-full max-w-xl bg-white rounded-lg shadow p-8">
    <h2 className="text-xl font-semibold text-gray-800 mb-1">Ownership Verification</h2>
    <p className="text-gray-500 mb-6">Provide verification that you own this property</p>
    <div className="mb-4">
      <label className="block text-gray-700 mb-1" htmlFor="fullName">Full Legal Name</label>
      <input
        id="fullName"
        name="fullName"
        type="text"
        value={form.fullName}
        onChange={handleChange}
        placeholder="Andrew Abba"
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-800"
        required
        readOnly={readOnlyFields.includes('fullName')}
      />
    </div>
    <div className="flex gap-4 mb-4">
      <div className="flex-1">
        <label className="block text-gray-700 mb-1" htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="example@email.com"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-800"
          required
          readOnly={readOnlyFields.includes('email')}
        />
      </div>
      <div className="flex-1">
        <label className="block text-gray-700 mb-1" htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="(234) 555 1234"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-800"
          required
          readOnly={readOnlyFields.includes('phone')}
        />
      </div>
    </div>
    <div className="mb-6">
      <label className="block text-gray-700 mb-1" htmlFor="additionalDetails">Any additional details about your property ownership?</label>
      <textarea
        id="additionalDetails"
        name="additionalDetails"
        value={form.additionalDetails}
        onChange={handleChange}
        placeholder="Any additional details about your property ownership?"
        className="w-full border border-gray-300 rounded px-3 py-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-teal-800"
        readOnly={readOnlyFields.includes('additionalDetails')}
      />
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

export default ClaimPropertyVerificationForm; 