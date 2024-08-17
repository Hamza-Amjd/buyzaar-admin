"use client"

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { navLinks } from "@/lib/constants";

const TopBar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-20 w-full flex justify-between items-center px-8 py-4 bg-orange-50 shadow-xl lg:hidden">
      <Image src="/logo.png" alt="logo" width={150} height={70} />

      <div className="flex gap-8 max-md:hidden">
        {navLinks.map((link) => (
          <Link
            href={link.url}
            key={link.label}
            className={`flex gap-4 text-body-medium ${pathname === link.url ? "text-red-700" : "text-grey-1"}`}
          >
            <p>{link.label}</p>
          </Link>
        ))}
      </div>

      <div className="relative flex gap-4 items-center">
        <button onClick={() => setDropdownMenu(!dropdownMenu)} className="flex md:hidden cursor-pointer items-center justify-center flex-col">
        <span className={`h-0.5 rounded-sm  transition-all duration-300 ease-out w-5 bg-black ${dropdownMenu?"rotate-45 translate-y-1":"-translate-y-0.5"}`}></span>
        <span className={`h-0.5 rounded-sm  transition-all duration-300 ease-out w-5 bg-black my-0.5 ${dropdownMenu?"opacity-0":"opacity-100"}`}></span>
        <span className={`h-0.5 rounded-sm  transition-all duration-300 ease-out w-5 bg-black ${dropdownMenu?"-rotate-45 -translate-y-1":"translate-y-0.5"}`}></span>
      </button>
        {dropdownMenu && (
          <div className="absolute top-10 right-6 flex flex-col gap-8 p-5 bg-white shadow-xl rounded-lg">
            {navLinks.map((link) => (
              <Link
                href={link.url}
                key={link.label}
                className="flex gap-4 text-body-medium"
              >
                {link.icon} <p>{link.label}</p>
              </Link>
            ))}
          </div>
        )}
        <UserButton />
      </div>
    </div>
  );
};

export default TopBar;
