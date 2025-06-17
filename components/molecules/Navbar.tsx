
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Menu, Phone, User, X } from 'lucide-react';
import UserDropdownMenu from '@/components/molecules/DropdownMenu';
import SwitchProfileModal from '@/components/molecules/ProfileModal';
import ListingsDropdown from '@/components//molecules/ListingsDropdown';
import Image from 'next/image';
import logo from "@/public/aparteyLogo.png"
import { TokenManager } from '@/utils/tokenManager';
import { useGetUserRoleQuery } from "@/Hooks/use-getUserRole.query";

interface NavbarProps {
  
}

const Navbar: React.FC<NavbarProps> = () => {
  const pathname = usePathname();
  const router = useRouter()
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isListingsDropdownOpen, setIsListingsDropdownOpen] = useState(false);
  const [isSwitchProfileModalOpen, setIsSwitchProfileModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Fetch user role data
  const { data: userRoleData, isLoading, error } = useGetUserRoleQuery();
  const [selectedRole, setSelectedRole] = useState();

  useEffect(() => {
    if (userRoleData) {
      setSelectedRole(userRoleData?.currentUserRole?.role);
    }
  }, [userRoleData]);

  const navItems = [
    { label: 'Home', href: '/', active: pathname === '/', hasDropdown: false },
    { label: 'Listings', href: '/listings', active: pathname?.startsWith('/listings'), hasDropdown: true },
    { label: 'Insights', href: '/insights', active: pathname === '/insights', hasDropdown: false },
    { label: 'About', href: '/about', active: pathname === '/about', hasDropdown: false },
    { label: 'Blog', href: '/blog', active: pathname === '/blog', hasDropdown: false }
  ];

  const handleUserIconClick = () => {
    // validate if has token (is authenticated)
    if (TokenManager.hasToken()){
      setIsUserDropdownOpen(true)
    }else{
      router.push('/signin')
    }
  }
  
  const handleSwitchProfile = () => {
    setIsSwitchProfileModalOpen(true);
    setIsUserDropdownOpen(false);
  };
  const handleCloseUserDropdown = () => setIsUserDropdownOpen(false);
  const handleCloseSwitchProfileModal = () => setIsSwitchProfileModalOpen(false);
  const handleCloseListingsDropdown = () => setIsListingsDropdownOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
 
  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src={logo}
                alt="Logo"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
              />
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <div 
                  key={item.label} 
                  className="relative"
                  onMouseEnter={() => {
                    if (item.hasDropdown && item.label === 'Listings') {
                      setIsListingsDropdownOpen(true);
                    }
                  }}
                  onMouseLeave={() => {
                    if (item.hasDropdown && item.label === 'Listings') {
                      setIsListingsDropdownOpen(false);
                    }
                  }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${
                      item.active ? 'text-[#C85212]' : 'text-gray-700 hover:text-[#C85212]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.hasDropdown && (
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isListingsDropdownOpen && item.label === 'Listings' ? 'rotate-180' : ''
                        }`} 
                      />
                    )}
                  </Link>
                  
                  {/* Listings Dropdown */}
                  {item.label === 'Listings' && (
                    <ListingsDropdown
                      isOpen={isListingsDropdownOpen}
                      onClose={handleCloseListingsDropdown}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <div className='flex gap-4 items-center'>
              <Link href="/signin" className="text-gray-700 hover:text-gray-900 font-medium text-sm">
                Login
              </Link>
              <Link
                href="/contact"
                className=" text-white bg-orange-200  px-4 py-2 rounded-lg font-medium text-sm transition-colors "
              >
                <span className=' '>Contact us</span>
              </Link>
                <Phone className="w-10 h-9 rounded-md bg-[#C85212] text-white" />
              </div>
              <div className="">
                <button
                  onClick={handleUserIconClick}
                  className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                >
                  <User className="w-5 h-5 text-gray-600" />
                </button>

                </div>
                </div>
                <UserDropdownMenu
                  isOpen={isUserDropdownOpen}
                  onClose={handleCloseUserDropdown}
                  onSwitchProfile={handleSwitchProfile}
                  userName="John Doe"
                  userEmail="john@example.com"
                  favoriteCount={3}
                />

            <div className="flex md:hidden items-center space-x-2">
              <div className="relative">
                <button
                  onClick={handleUserIconClick}
                  className="w-9 h-9 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                >
                  <User className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-base font-medium ${
                    item.active ? 'text-[#C85212] bg-orange-50' : 'text-gray-700 hover:text-[#C85212] hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              </div>
            ))}
            
            {/* Mobile Menu Actions */}
            <div className="px-3 py-4 space-y-3 border-t border-gray-200">
      
              <div className='flex items-center space-x-2'>
              <Link href="/signin" className="text-gray-700 hover:text-gray-900 font-medium text-sm">
                Login
              </Link>
                <Link
                  href="/contact"
                  className="flex-1 text-center text-white bg-orange-200 px-4 py-2 rounded-lg font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact us
                </Link>
                <Phone className="w-10 h-9 rounded-md bg-[#C85212] text-white" />
              </div>
              
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Switch Modal - Now uses userData instead of hardcoded currentProfile */}
      <SwitchProfileModal
        isOpen={isSwitchProfileModalOpen}
        onClose={handleCloseSwitchProfileModal}
        userData={userRoleData ? { currentUserRole: { role: userRoleData.currentUserRole.role } } : undefined}
      />

    </>
  );
};

export default Navbar;