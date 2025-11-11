'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// array of links
const Links = [
  {href:"/search", text:"search"},
  {href:"/position", text:"position"},
  {href:"/teams", text:"teams"},
];

// nav bar components
const NavBar = () => {
  return (
    <nav className="flex justify-center bg-black p-6">
      <div className='absolute top-5 left-5'>
              <Image
                src='/nba-logo.png'
                alt='navbar NBA Logo'
                width={80}
                height={20}
              />
            </div>
      <div className="flex justify-center sm:justify-between items-center mx-auto max-w-6xl gap-6">
        <Link
          href="/"
          className="text-3xl text-white font-bold hover:text-red-600 transition duration-150"
        >
          Home
        </Link>
        <ul className="flex gap-6">
          { Links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="capitalize">
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