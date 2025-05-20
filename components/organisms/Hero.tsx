"use client";
import { useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import eclipse from '@/public/Ellipse-2.png';
import eclipse2 from '@/public/Ellipse-1.png';


export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    // Implement search functionality here
    // router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    console.log('Search query:', searchQuery);
  };

  return (
    <div className="relative py-12 bg-gray-50 md:py-12  overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-center object-cover mt-32  opacity-100"
        style={{ 
          backgroundImage: `url('/Herobg.png')`,
           
          
    
        }}
      />
      
      {/* Main Content Container */}
      <div className="relative  z-10 max-w-5xl mx-auto px-4">
        <div className=" ">
          <div className="text-center px-16 mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-teal-800 mb-4">
              Find your perfect rental with confidence
            </h1>
            <p className="text-gray-500  text-lg mb-8">
              Discover what real tenants and homeowners are saying about local properties around you
            </p>
            
            {/* Search Input */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by address, neighborhoods, or city"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                />
                <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
              <button 
                className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-md transition-colors"
                onClick={handleSearchSubmit}
              >
                Search Reviews
              </button>
              <button 
                className="border border-orange-500 text-orange-500 hover:bg-orange-50 py-3 px-8 rounded-md transition-colors"
              >
                Share your experience
              </button>
            </div>
            
            {/* Testimonial Section */}
            <div className="flex items-center justify-center">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                  <img src="/api/placeholder/32/32" alt="User avatar" className="w-full h-full object-cover" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                  <Image src={eclipse} alt="User avatar" className="w-full h-full object-cover" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                  <Image src={eclipse2} alt="User avatar" className="w-full h-full object-cover" />
                </div>
              </div>
              <span className="ml-3 text-gray-600">
                Over 30,000 trusted reviews from real renters
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}