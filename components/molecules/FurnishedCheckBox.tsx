"use client";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function FurnishedCheckbox({ checked, onChange }: Props) {
  return (
    <div className="mb-4">
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mr-2"
        />
        <span className="text-sm font-medium text-gray-700">Furnished</span>
      </label>
    </div>
  );
}