"use client";
import { Search } from "lucide-react";
import { ChangeEvent, KeyboardEvent, useState, useRef, useEffect } from "react";
export interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

declare global {
  interface Window {
    google: any;
  }
}

interface SearchInputProps {
  onLocationSelect: (location: string) => void;
  placeholder?: string;
  initialValue?: string;
  onSubmit?: (value: string) => void;
  onChange?: (value: string) => void;
  onPlaceSelect?: (place: PlacePrediction) => void;
  className?: string;
  inputClassName?: string;
  iconSize?: number;
  countryRestrictions?: string[];
  googleApiKey?: string;
}

const SearchInput = ({
  placeholder = "Search location",
  initialValue = "",
  onSubmit,
  onChange,
  onPlaceSelect,
  className = "max-w-2xl mx-auto mb-6",
  inputClassName = "w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10 text-sm sm:text-base",
  iconSize = 18,

  googleApiKey,
}: SearchInputProps) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const initializeGooglePlaces = () => {
    if (typeof window !== "undefined" && window.google) {
      const service = new window.google.maps.places.AutocompleteService();
      return service;
    }
    return null;
  };

  const fetchPlaceSuggestions = async (
    query: string
  ): Promise<PlacePrediction[]> => {
    return new Promise((resolve, reject) => {
      const service = initializeGooglePlaces();
      if (!service) {
        reject(new Error("Google Places service not available"));
        return;
      }

      service.getPlacePredictions(
        {
          input: query,
        },
        (
          predictions: PlacePrediction[] | PromiseLike<PlacePrediction[]>,
          status: any
        ) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            resolve(predictions);
          } else {
            resolve([]);
          }
        }
      );
    });
  };
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onChange?.(value);
    setActiveSuggestionIndex(-1);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (value.trim()) {
        setLoading(true);
        try {
          const results = await fetchPlaceSuggestions(value);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
  };

  const handleSearchSubmit = () => {
    onSubmit?.(searchQuery);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: PlacePrediction) => {
    setSearchQuery(suggestion.description);
    setSuggestions([]);
    setShowSuggestions(false);
    onPlaceSelect?.(suggestion);
    onChange?.(suggestion.description);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) {
      if (e.key === "Enter") {
        handleSearchSubmit();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveSuggestionIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
          handleSuggestionClick(suggestions[activeSuggestionIndex]);
        } else {
          handleSearchSubmit();
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className={className}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className={inputClassName}
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={iconSize}
        />

        {/* Autocomplete Dropdown */}
        {showSuggestions && (suggestions.length > 0 || loading) && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto mt-1"
          >
            {loading && (
              <div className="px-4 py-3 text-gray-500 text-sm">
                Loading suggestions...
              </div>
            )}

            {!loading &&
              suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.place_id}
                  className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                    index === activeSuggestionIndex
                      ? "bg-orange-50 text-orange-800"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setActiveSuggestionIndex(index)}
                >
                  <div className="text-sm  text-start font-medium text-gray-900">
                    {suggestion.structured_formatting.main_text}
                  </div>
                  <div className="text-xs text-start text-gray-500 mt-1">
                    {suggestion.structured_formatting.secondary_text}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
