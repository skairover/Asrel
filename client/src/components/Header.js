
import { IoSearch } from "react-icons/io5";


export default function Header() {
    return (
  <div className="w-full h-14 flex justify-start gap-4 items-center px-6  ml-[60px] bg-[var(--bg)]">
    <div className="flex items-center">
      <p className="text-[#1A1A1A] text-3xl font-black font-ThinkBold -ml-1 mt-[0.25rem]">SREL</p>
    </div>
    <div className="relative w-64 max-w-sm">
        <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
            type="text"
            placeholder="Search..."
            className="pl-10 w-full rounded-full border border-[#1A1A1A] bg-[#F5EFE6] focus:outline-none focus:ring-2 focus:ring-[#7895B2] focus:border-[#7895b2]"
        />
    </div>
  </div>
);

}