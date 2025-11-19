'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Links = [
  {href:"/teams", text:"Teams"},
  {href:"/position", text:"Position"},
  {href:"/search", text:"Search"},
  
];

const NavBar = () => {
  const pathname = usePathname();

  const getLinkClass = (href: string) => {
    const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return `
      text-xl font-bold transition duration-150 border-b-4
      ${isActive ? "border-[#0693e3]" : "text-white border-transparent"}
      hover:text-[#0693e3]
    `;
  };

  return (
    <nav className="flex justify-center bg-black p-9">
      <div className='absolute top-2 left-10'>
        <Link
          href="/"
        >
              <Image
                src='/fantasy-NBA-logo-black.png'
                alt='navbar NBA Logo'
                width={120}
                height={80}
              />
        </Link>
      </div>
      <div className="flex justify-center sm:justify-between items-center mx-auto max-w-6xl gap-75">
        <Link
          href="/"
          className={getLinkClass("/")}
        >
          Home
        </Link>
        <ul className="flex gap-75">
          { Links.map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href} 
                  className={getLinkClass(link.href)}
                >
                  {link.text}
                </Link>
              </li>
          ))}
        </ul>
      </div>
    </nav>
  )
};

export default NavBar;