'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Links = [
  {href:"/search", text:"Search"},
  {href:"/position", text:"Position"},
  {href:"/teams", text:"Teams"},
];

const NavBar = () => {
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
          className="text-xl text-white font-bold hover:text-[#0693e3] transition duration-150"
        >
          Home
        </Link>
        <ul className="flex gap-75">
          { Links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-xl text-white font-bold hover:text-[#0693e3] transition duration-150">
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