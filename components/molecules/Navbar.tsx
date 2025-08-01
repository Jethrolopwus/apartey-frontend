"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, Phone, User, X } from "lucide-react";
import UserDropdownMenu from "@/components/molecules/DropdownMenu";
import SwitchProfileModal from "@/components/molecules/ProfileModal";
import ListingsDropdown from "@/components/molecules/ListingsDropdown";
import Image from "next/image";
import logo from "@/public/aparteyLogo.png";
import { useAuthStatusQuery } from "@/Hooks/use-getAuthStatus.query";
import { useGetUserProfileQuery } from "@/Hooks/use-getuserProfile.query";

type NavbarProps = object;

const Navbar: React.FC<NavbarProps> = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isListingsDropdownOpen, setIsListingsDropdownOpen] = useState(false);
  const [isSwitchProfileModalOpen, setIsSwitchProfileModalOpen] =
    useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Use auth status for authentication and role
  const { data: authData } = useAuthStatusQuery();
  const { data: userProfileData } = useGetUserProfileQuery();
  const [selectedRole, setSelectedRole] = useState<string | undefined>();

  useEffect(() => {
    if (authData) {
      setSelectedRole(
        authData.user?.role || authData.role || authData.currentUserRole?.role
      );
    }
  }, [authData]);

  // Early return for admin paths after all hooks
  if (pathname?.startsWith("/admin")) return null;

  const navItems = [
    {
      label: "Home",
      href: "/",
      active: pathname === "/",
      hasDropdown: false,
      isDynamic: true,
    },
    {
      label: "Listings",
      href: "/listings",
      active: pathname?.startsWith("/listings"),
      hasDropdown: true,
    },
    {
      label: "Insights",
      href: "/insights",
      active: pathname === "/insights",
      hasDropdown: false,
    },
    {
      label: "About",
      href: "/about",
      active: pathname === "/about",
      hasDropdown: false,
    },
    {
      label: "Blog",
      href: "/blog",
      active: pathname === "/blog",
      hasDropdown: false,
    },
  ];

  const handleLogoOrHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Logo/Home clicked, authData:", authData);
    if (!authData) {
      router.push("/");
      return;
    }
    const userRole =
      authData.user?.role ||
      authData.role ||
      authData.currentUserRole?.role ||
      "renter";
    console.log("User role:", userRole);
    let homepage = "/";
    if (userRole.toLowerCase() === "homeowner") homepage = "/landlord";
    else if (userRole.toLowerCase() === "agent") homepage = "/agent";
    console.log("Routing to homepage:", homepage);
    router.push(homepage);
  };

  const handleUserIconClick = () => {
    console.log("User icon clicked, authData:", authData);
    if (!authData) {
      router.push("/signin");
      return;
    }
    console.log("Setting dropdown to true");
    setIsUserDropdownOpen(true);
  };

  const handleSwitchProfile = () => {
    setIsSwitchProfileModalOpen(true);
    setIsUserDropdownOpen(false);
  };
  const handleCloseUserDropdown = () => setIsUserDropdownOpen(false);
  const handleCloseSwitchProfileModal = () =>
    setIsSwitchProfileModalOpen(false);
  const handleCloseListingsDropdown = () => setIsListingsDropdownOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a
              href="#"
              className="flex items-center"
              onClick={handleLogoOrHomeClick}
            >
              <Image
                src={logo}
                alt="Logo"
                className="object-contain w-24 md:w-32 lg:w-36 h-8 md:h-10 lg:h-12"
                width={144}
                height={48}
                sizes="(max-width: 768px) 96px, (max-width: 1024px) 128px, 144px"
                priority
                quality={100}
              />
            </a>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => {
                    if (item.hasDropdown && item.label === "Listings") {
                      setIsListingsDropdownOpen(true);
                    }
                  }}
                  onMouseLeave={() => {
                    if (item.hasDropdown && item.label === "Listings") {
                      setIsListingsDropdownOpen(false);
                    }
                  }}
                >
                  {item.hasDropdown && item.label === "Listings" ? (
                    <button
                      type="button"
                      className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${
                        item.active
                          ? "text-[#C85212]"
                          : "text-gray-700 hover:text-[#C85212]"
                      }`}
                      onClick={() =>
                        setIsListingsDropdownOpen(!isListingsDropdownOpen)
                      }
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isListingsDropdownOpen && item.label === "Listings"
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${
                        item.active
                          ? "text-[#C85212]"
                          : "text-gray-700 hover:text-[#C85212]"
                      }`}
                      onClick={(e) => {
                        if (item.isDynamic && item.label === "Home") {
                          e.preventDefault();
                          handleLogoOrHomeClick(e);
                        }
                      }}
                    >
                      <span>{item.label}</span>
                    </Link>
                  )}

                  {/* Listings Dropdown */}
                  {item.label === "Listings" && (
                    <ListingsDropdown
                      isOpen={isListingsDropdownOpen}
                      onClose={handleCloseListingsDropdown}
                      onNavigate={(href: string) => {
                        setIsListingsDropdownOpen(false);
                        router.push(href);
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex space-x-4 items-center">
                <Link
                  href="/contact"
                  className="text-gray-700 bg-[#FFF4F0] hover:bg-[#FFE8E0] flex justify-center items-center gap-2  rounded-lg font-medium text-md transition-colors"
                >
                  <span className="px-2">Contact us</span>
                  <div className="w-8 h-8 rounded-r-lg bg-[#C85212] flex items-center justify-center">
                    <Phone className="w-5 h-4 text-white" />
                  </div>
                </Link>
              </div>
              <div className="">
                <button
                  onClick={handleUserIconClick}
                  className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors overflow-hidden"
                >
                  {userProfileData?.currentUser?.profilePicture ? (
                    <Image
                      src={userProfileData.currentUser.profilePicture}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
            {authData && (
              <UserDropdownMenu
                isOpen={isUserDropdownOpen}
                onClose={handleCloseUserDropdown}
                onSwitchProfile={handleSwitchProfile}
              />
            )}

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
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    if (item.isDynamic && item.label === "Home") {
                      e.preventDefault();
                      handleLogoOrHomeClick(e);
                    }
                  }}
                  className={`block px-3 py-2 text-base font-medium ${
                    item.active
                      ? "text-[#C85212] bg-orange-50"
                      : "text-gray-700 hover:text-[#C85212] hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              </div>
            ))}

            {/* Mobile Menu Actions */}
            <div className="px-3 py-4 space-y-3 border-t border-gray-200">
              <div className="flex items-center space-x-2">
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

      {/* Profile Switch Modal */}
      <SwitchProfileModal
        isOpen={isSwitchProfileModalOpen}
        onClose={handleCloseSwitchProfileModal}
        userData={
          authData && typeof selectedRole === "string"
            ? { currentUserRole: { role: selectedRole } }
            : undefined
        }
      />
    </>
  );
};

export default Navbar;
