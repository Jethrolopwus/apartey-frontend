"use client";

interface CountSelectorProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
}

const CountSelector: React.FC<CountSelectorProps> = ({ label, value, onChange }) => {
  const options = [null, 1, 2, 3, 4, 5]; // null represents "Any"

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center space-x-2">
        {options.map((option, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onChange(option)}
            className={`py-2 text-sm font-medium rounded-md transition-colors text-center ${
                option === null ? 'px-4' : 'w-12'
              } ${
              value === option
                ? 'bg-gray-800 text-white border border-gray-800'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {option === null ? 'Any' : option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CountSelector; 