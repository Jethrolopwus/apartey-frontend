import React, { useState } from "react";

const FLAG_OPTIONS = [
  "Spam or fake review",
  "Inappropriate Language",
  "Discriminatory Content",
  "Misleading Information",
  "Hate Speech",
  "Other",
];

interface FlagModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details?: string) => void;
  loading?: boolean;
}

const FlagModalForm: React.FC<FlagModalFormProps> = ({ isOpen, onClose, onSubmit, loading }) => {
  const [selected, setSelected] = useState<string>("");
  const [otherText, setOtherText] = useState("");
  const [touched, setTouched] = useState(false);

  const isOther = selected === "Other";
  const isOtherValid = !isOther || (otherText.trim().length >= 5 && otherText.trim().length <= 300);
  const canSubmit = selected && isOtherValid && !loading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;
    onSubmit(selected, isOther ? otherText.trim() : undefined);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black opacity-60" onClick={onClose} />
      {/* Modal */}
      <div className="relative bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl z-10">
        <h2 className="text-2xl font-bold mb-2 text-gray-900">Flag Review</h2>
        <p className="text-gray-600 mb-4 text-sm">
          Help us maintain quality by reporting inappropriate content.<br />What's wrong with this review?
        </p>
        <form onSubmit={handleSubmit}>
          <div className="space-y-3 mb-6">
            {FLAG_OPTIONS.map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer text-gray-800">
                <input
                  type="radio"
                  name="flagReason"
                  value={option}
                  checked={selected === option}
                  onChange={() => { setSelected(option); setTouched(false); }}
                  className="w-5 h-5 accent-orange-600"
                />
                <span className="text-base">{option}</span>
              </label>
            ))}
          </div>
          {isOther && (
            <div className="mb-4">
              <textarea
                className="w-full border rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[60px]"
                placeholder="Please provide details (5-300 characters)"
                value={otherText}
                onChange={e => setOtherText(e.target.value)}
                minLength={5}
                maxLength={300}
                required
              />
              {touched && (!isOtherValid) && (
                <p className="text-xs text-red-500 mt-1">Please enter between 5 and 300 characters.</p>
              )}
            </div>
          )}
          <div className="flex justify-between gap-4 mt-6">
            <button
              type="button"
              className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 font-medium"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-2 rounded-lg text-white font-medium bg-[#C85212] hover:bg-orange-700 transition-colors ${!canSubmit ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={!canSubmit}
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlagModalForm; 