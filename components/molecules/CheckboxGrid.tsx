"use client";

interface CheckboxGridProps {
  title: string;
  subtitle?: string;
  options: string[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
}

const CheckboxGrid: React.FC<CheckboxGridProps> = ({ title, subtitle, options, selectedOptions, onChange }) => {
  const handleCheckboxChange = (option: string) => {
    const newSelection = selectedOptions.includes(option)
      ? selectedOptions.filter(item => item !== option)
      : [...selectedOptions, option];
    onChange(newSelection);
  };

  return (
    <div>
      <h3 className="text-md font-medium text-gray-900">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
      <div className="grid grid-cols-3 gap-x-6 gap-y-4 mt-4">
        {options.map(option => (
          <label key={option} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-gray-800 focus:ring-gray-700"
              checked={selectedOptions.includes(option)}
              onChange={() => handleCheckboxChange(option)}
            />
            <span className="text-sm text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGrid; 