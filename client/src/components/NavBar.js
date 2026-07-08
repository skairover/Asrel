import Link from "next/link";
import { GoHomeFill } from "react-icons/go";
import { MdAccountCircle, MdBookmark, MdAddBox } from "react-icons/md";
import { IoMdHeart } from "react-icons/io";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { IoSearch } from "react-icons/io5";


export default function NavBar() {
  const navItems = [
    { icon: GoHomeFill, href: "/posts", label:'Home'},
    { icon: IoSearch, href: "/search", label: 'Search' },
    { icon: IoMdHeart, href: "/favorites", label: 'Favourites' },
    { icon: HiChatBubbleLeftRight, href: "/chat", label: 'Chats' },
    { icon: MdAddBox, href: "/posts/create", label: 'New Post' },
    { icon: MdAccountCircle, href: "/profile", label: 'Profile' },
    { icon: MdBookmark, href: "/bookmarks", label: 'Saved' },
  ];

  return (
  <div className="flex flex-col items-center justify-between w-[60px] h-screen bg-[var(--bg)] border border-gray-300 fixed">

    <div className="flex flex-col justify-center gap-8 h-full">
      {navItems.map(({ icon: Icon, href, label }, index) => (
        <Link
          key={index}
          href={href}
          title={label}
          className="p-2 rounded-lg hover:bg-[#AEBDCA]/50 transition"
        >
          <Icon size={24} className="text-[var(--text)] mx-auto" />
        </Link>
      ))}
    </div>
  </div>
);

}
