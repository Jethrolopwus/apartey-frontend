import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { Home, ArrowRightLeft, ShoppingBag } from "lucide-react";

interface ListingsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (href: string) => void;
}

const ListingsDropdown: React.FC<ListingsDropdownProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const listingItems = [
    {
      id: "rent-home",
      label: "Rent a Home",
      description: "Find rental properties",
      icon: Home,
      href: "/listings?category=Rent",
    },
    {
      id: "bsale-home",
      label: "Sell a Home",
      description: "Find properties for sale",
      icon: ShoppingBag,
      href: "/listings?category=Sale",
    },
    {
      id: "swap-home",
      label: "Swap a Home",
      description: "Exchange properties",
      icon: ArrowRightLeft,
      href: "/listings?category=Swap",
    },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute left-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50"
    >
      {listingItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={(e) => {
              onClose();
              if (onNavigate) {
                e.preventDefault();
                onNavigate(item.href);
              }
            }}
            className="block px-4 py-3 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                <Icon className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                  {item.label}
                </p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ListingsDropdown;
