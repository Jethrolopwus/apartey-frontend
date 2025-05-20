"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';
import logo from '@/public/logo.png';

interface NavbarProps {
  logoSrc?: string;
}

export default function Navbar({ logoSrc = '/logo.svg' }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isListingsDropdownOpen, setIsListingsDropdownOpen] = useState(false);
  const [isMobileListingsOpen, setIsMobileListingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleMobileListings = () => {
    setIsMobileListingsOpen(!isMobileListingsOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsListingsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full bg-white py-4 px-4 md:px-8 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="h-18 w-40 relative">
              <div className="flex items-center space-x-2">
                <Image
                  src={logo}
                  alt="Logo"
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
                />
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-orange-500 font-medium">Home</Link>
          
          {/* Listings Dropdown */}
          <div 
            className="relative" 
            ref={dropdownRef}
            onMouseEnter={() => setIsListingsDropdownOpen(true)}
            onMouseLeave={() => setIsListingsDropdownOpen(false)}
          >
            <button 
              className="flex items-center text-gray-600 hover:text-orange-500 transition"
              onClick={() => setIsListingsDropdownOpen(!isListingsDropdownOpen)}
            >
              Listings
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            
            {/* Dropdown Menu */}
            {isListingsDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded shadow-lg z-50">
                <div className="py-2">
                  <Link href="/listings/rent-a-home" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-100 hover:text-orange-500">
                    Rent a Home
                  </Link>
                  <Link href="/listings/swap-a-home" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-100 hover:text-orange-500">
                    Swap a Home
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          <Link href="/insights" className="text-gray-600 hover:text-orange-500 transition">Insights</Link>
          <Link href="/blog" className="text-gray-600 hover:text-orange-500 transition">Blog</Link>
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/signin" className="text-gray-600 hover:text-orange-500 transition">Login</Link>
          <Link href="/contact" className="bg-orange-100 text-orange-500 hover:bg-orange-200 transition px-4 py-2 rounded">
            Contact us
          </Link>
          <button className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
          </button>
          <div className="bg-gray-200 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <button className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
          </button>
          <div className="bg-gray-200 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <button
            onClick={toggleMenu}
            className="text-gray-700 focus:outline-none"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white mt-4 py-2 px-4 shadow-lg rounded-lg">
          <div className="flex flex-col space-y-3">
            <Link href="/" className="text-orange-500 font-medium py-2">Home</Link>
            
            {/* Mobile Listings Dropdown */}
            <div>
              <button 
                onClick={toggleMobileListings}
                className="flex items-center justify-between w-full text-gray-600 hover:text-orange-500 transition py-2"
              >
                <span>Listings</span>
                <ChevronDown className={`h-4 w-4 transform ${isMobileListingsOpen ? 'rotate-180' : ''} transition-transform`} />
              </button>
              
              {/* Mobile Dropdown Items */}
              {isMobileListingsOpen && (
                <div className="pl-4 pt-2 pb-1 space-y-2">
                  <Link href="/listings/rent-a-home" className="block py-2 text-sm text-gray-600 hover:text-orange-500">
                    Rent a Home
                  </Link>
                  <Link href="/listings/swap-a-home" className="block py-2 text-sm text-gray-600 hover:text-orange-500">
                    Swap a Home
                  </Link>
                </div>
              )}
            </div>
            
            <Link href="/insights" className="text-gray-600 hover:text-orange-500 transition py-2">Insights</Link>
            <Link href="/blog" className="text-gray-600 hover:text-orange-500 transition py-2">Blog</Link>
            <Link href="/signin" className="text-gray-600 hover:text-orange-500 transition py-2">Login</Link>
            <Link href="/contact" className="bg-orange-100 text-orange-500 hover:bg-orange-200 transition px-4 py-2 rounded text-center">Contact us</Link>
          </div>
        </div>
      )}
    </nav>
  );
}