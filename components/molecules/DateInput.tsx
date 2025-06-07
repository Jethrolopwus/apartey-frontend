"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function DateLeftInput({ value, onChange }: Props) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Date Left
      </label>
      <input
        type="date"
        value={value?.slice(0, 10) || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
  );
}