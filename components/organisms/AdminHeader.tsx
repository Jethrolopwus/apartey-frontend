import { Search } from "lucide-react";
import Image from "next/image";
export default function Header() {
  return (
    <header className="flex items-center justify-between bg-white px-8 py-4 mt-2 min-h-[72px] shadow-md w-full max-w-full border-b border-gray-100">
      <h1 className="text-2xl font-bold">DashBoard</h1>
      <div className="relative w-[320px]">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </span>
        <input
          type="text"
          placeholder="Search here..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none shadow-sm placeholder-gray-400 text-base font-medium bg-[#F8F9FB]"
        />
      </div>
      <div className="flex items-center gap-8">
        <span className="text-sm text-gray-500 font-medium">Eng (US)</span>
        <div className="flex items-center gap-3 bg-[#F8F9FB] px-3 py-1.5 rounded-xl">
          <Image
            src="/Ellipse-1.png"
            alt="User"
            width={20}
            height={20}
            className="w-9 h-9 rounded-full border-2 border-white shadow"
          />
          <div className="flex flex-col items-start">
            <span className="font-semibold text-gray-900 text-base leading-tight">
              Andrew
            </span>
            <span className="text-xs text-gray-500 font-medium">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
