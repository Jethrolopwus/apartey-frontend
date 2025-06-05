"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const sortOptions = [
    {
        label: 'Most Recent',
        value: 'mostRecent',
        sortBy: 'mostRecent',
        sortOrder: undefined
    },
    {
        label: 'Highest Rating',
        value: 'highestRating',
        sortBy: 'highestRating',
        sortOrder: 'desc'
    }
];

const SortingComponent = () => {
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [sortOption, setSortOption] = useState('Most Recent');

    const handleSortChange = (option: typeof sortOptions[0]) => {
        setSortOption(option.label);
        setIsDropdownOpen(false);
        
        // Build query parameters
        const params = new URLSearchParams();
        params.append('sortBy', option.sortBy);
        if (option.sortOrder) {
            params.append('sortOrder', option.sortOrder);
        }
        
        // Navigate to reviews page with sort parameters
        router.push(`/reviews?${params.toString()}`);
    };

    return (
        <div className="absolute top-0 right-0 flex justify-end mb-4 z-10">
            <div className="relative">
                <div className="flex items-center gap-2 bg-white rounded-md shadow px-4 py-2">
                    <span className="text-gray-600 text-sm">Sort by</span>
                    <div className="relative">
                        <button
                            className="flex items-center gap-2 text-gray-800"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            aria-expanded={isDropdownOpen}
                            aria-haspopup="listbox"
                        >
                            {sortOption}
                            <ChevronDown size={16} />
                        </button>

                        {isDropdownOpen && (
                            <ul
                                className="absolute right-0 mt-1 w-40 bg-white shadow-lg rounded-md py-1 z-20"
                                role="listbox"
                            >
                                {sortOptions.map((option) => (
                                    <li
                                        key={option.value}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                                        onClick={() => handleSortChange(option)}
                                        role="option"
                                        aria-selected={sortOption === option.label}
                                    >
                                        {option.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SortingComponent;