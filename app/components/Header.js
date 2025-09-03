"use client";

import Link from "next/link";
import { FaClipboardList } from "react-icons/fa";
import { Pacifico, Courgette } from "next/font/google";
import { FaHome } from "react-icons/fa";
import { Rubik } from "next/font/google"


// استدعاء الخطوط
const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
});

const courgette = Courgette({
  subsets: ["latin"],
  weight: "400",
});
const rubik = Rubik({
  subsets: ["arabic"],
  weight: ["400", "500", "700"], // تختار الأوزان اللي تحتاجها
});

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/40 backdrop-blur-xl border-b border-white/50 shadow-md">
  <div className="relative max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
    {/* يسار: SPC + النص */}
    <div className="flex flex-col items-start">
      <span className="font-pacifico text-indigo-700 font-bold text-2xl drop-shadow-sm">
        SPC
      </span>
      <span className="font-courgette font-bold text-gray-500 text-sm">
        Developed by SPC team
      </span>
    </div>

    {/* وسط: Smart Home */}
    <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 text-indigo-600 font-extrabold text-2xl drop-shadow-sm">
      <FaHome className="text-2xl" />
      <span>المنزل الحديث</span>
    </div>

    {/* يمين: placeholder للاتزان */}
    <div className="w-24"></div>
  </div>
</header>

  );
}
