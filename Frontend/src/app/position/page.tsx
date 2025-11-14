"use client";

import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-black text-white p-20">
      <h1 className="text-5xl font-extrabold ml-30 mb-15 self-start">Select a position</h1>

      <div className="flex gap-8 justify-center w-full">
        <Link
          href="/position/guards"
          className="relative group overflow-hidden rounded-3xl cursor-default"
        >
          <Image
              src="/poole-rs.png"
              alt="jordan poole photo"
              width={450}
              height={100}
              className="transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0693e3]/10 to-[#0693e3] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="absolute bottom-[15px] right-[15px] flex flex-col items-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-black text-2xl font-bold">
              Guards
            </p>
            <button className="bg-transparent border-2 border-black text-black px-6 py-2 rounded-lg font-semibold cursor-pointer 
                              hover:bg-black hover:text-white">
              View
            </button>
          </div>
        </Link>


        <Link
          href="/position/guards"
          className="relative group overflow-hidden rounded-3xl cursor-default"
        >
          <Image
              src="/lebron-rs1.png"
              alt="lebron james photo"
              width={450}
              height={100}
              className="transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0693e3]/10 to-[#0693e3] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="absolute bottom-[15px] right-[15px] flex flex-col items-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-black text-2xl font-bold">
              Forwards
            </p>
            <button className="bg-transparent border-2 border-black text-black px-6 py-2 rounded-lg font-semibold cursor-pointer 
                              hover:bg-black hover:text-white">
              View
            </button>
          </div>
        </Link>


        <Link
          href="/position/guards"
          className="relative group overflow-hidden rounded-3xl cursor-default"
        >
          <Image
              src="/jokic-rs.png"
              alt="nikola jokic photo"
              width={450}
              height={100}
              className="transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0693e3]/10 to-[#0693e3] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="absolute bottom-[15px] right-[15px] flex flex-col items-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-black text-2xl font-bold">
              Centers
            </p>
            <button className="bg-transparent border-2 border-black text-black px-6 py-2 rounded-lg font-semibold cursor-pointer 
                              hover:bg-black hover:text-white">
              View
            </button>
          </div>
        </Link>
      </div>
    </main>
  );
}     