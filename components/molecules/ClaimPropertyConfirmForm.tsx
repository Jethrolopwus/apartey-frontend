import React from 'react';

interface PropertyInfo {
  address: string;
  location: string;
  propertyType: string;
}

interface OwnerInfo {
  name: string;
  email: string;
  phone: string;
}

interface ClaimPropertyConfirmFormProps {
  propertyInfo: PropertyInfo;
  ownerInfo: OwnerInfo;
  onBack: () => void;
  onSubmit: () => void;
  submitting?: boolean;
}

const ClaimPropertyConfirmForm: React.FC<ClaimPropertyConfirmFormProps> = ({
  propertyInfo,
  ownerInfo,
  onBack,
  onSubmit,
  submitting,
}) => (
  <div className="w-full max-w-xl bg-white rounded-lg shadow p-8">
    <h2 className="text-xl font-semibold text-teal-800 mb-1">Review & Submit</h2>
    <p className="text-gray-500 mb-6">Review your information and submit your claim</p>
    {/* Property Information */}
    <div className="mb-4 rounded bg-[#F9FAFC] p-4">
      <h3 className="text-base font-semibold text-teal-800 mb-2">Property Information</h3>
      <div className="flex flex-wrap gap-8">
        <div className="text-sm text-gray-700">
          <div className="font-medium">Address:</div>
          <div>{propertyInfo.address}</div>
        </div>
        <div className="text-sm text-gray-700">
          <div className="font-medium">Location:</div>
          <div>{propertyInfo.location}</div>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-700">
        <div className="font-medium">Property Type:</div>
        <div>{propertyInfo.propertyType}</div>
      </div>
    </div>
    {/* Owner Information */}
    <div className="mb-4 rounded bg-[#F9FAFC] p-4">
      <h3 className="text-base font-semibold text-teal-800 mb-2">Owner Information</h3>
      <div className="flex flex-wrap gap-8">
        <div className="text-sm text-gray-700">
          <div className="font-medium">Name:</div>
          <div>{ownerInfo.name}</div>
        </div>
        <div className="text-sm text-gray-700">
          <div className="font-medium">Email:</div>
          <div>{ownerInfo.email}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-8 mt-2">
        <div className="text-sm text-gray-700">
          <div className="font-medium">Phone:</div>
          <div>{ownerInfo.phone}</div>
        </div>
      </div>
    </div>
    {/* Warning Section */}
    <div className="mb-6 bg-[#F8DFD2] border-l-4 border-[#C85212] p-4 text-sm text-gray-700">
      By submitting this claim, you confirm that you are the legal owner or authorized representative of this property. <br />
      <span className="text-xs text-gray-600">False claims may result in account termination.</span>
    </div>
    <div className="flex justify-between gap-4">
      <button
        type="button"
        onClick={onBack}
        className="px-6 py-2 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-100"
        disabled={submitting}
      >
        Back
      </button>
      <button
        type="button"
        onClick={onSubmit}
        className="px-6 py-2 rounded text-white bg-[#C85212] hover:bg-orange-700 disabled:opacity-60"
        disabled={submitting}
      >
        {submitting ? 'Submitting...' : 'Submit Claim'}
      </button>
    </div>
  </div>
);

export default ClaimPropertyConfirmForm; 