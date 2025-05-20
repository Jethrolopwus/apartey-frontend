import { Search } from 'lucide-react';
import { ChangeEvent, KeyboardEvent, useState } from 'react';

interface SearchInputProps {
  placeholder?: string;
  initialValue?: string;
  onSubmit?: (value: string) => void;
  onChange?: (value: string) => void;
  className?: string;
  inputClassName?: string;
  iconSize?: number;
}

const SearchInput = ({
  placeholder = "Search by address, neighborhoods, or city",
  initialValue = "",
  onSubmit,
  onChange,
  className = "max-w-2xl mx-auto mb-6",
  inputClassName = "w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10",
  iconSize = 18
}: SearchInputProps) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onChange?.(value);
  };

  const handleSearchSubmit = () => {
    onSubmit?.(searchQuery);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  return (
    <div className={className}>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          className={inputClassName}
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
        />
        <Search className="absolute left-3 top-3.5 text-gray-400" size={iconSize} />
      </div>
    </div>
  );
};

export default SearchInput;