"use client";

import { FaHome } from "react-icons/fa";
import { Pacifico, Courgette, Rubik } from "next/font/google";

// استدعاء الخطوط
const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });
const courgette = Courgette({ subsets: ["latin"], weight: "400" });
const rubik = Rubik({ subsets: ["arabic"], weight: ["400", "500", "700"] });

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/40 backdrop-blur-xl border-b border-white/50 shadow-md w-full">
      <div
        className="
          w-full
          grid grid-cols-3
          items-center
          px-6 h-16
        "
      >
        {/* يسار: SPC + النص */}
        <div className="flex flex-col items-start whitespace-nowrap">
          <span
            className={` text-indigo-700 font-bold text-2xl drop-shadow-sm`}
          >
            SPC
          </span>
          <span
            className={` font-bold text-gray-500 text-sm`}
          >
            Developed by SPC team
          </span>
        </div>

        {/* وسط: العنوان */}
          <div
          className="
            flex justify-center items-center gap-3 whitespace-nowrap 
            text-indigo-600 font-extrabold text-xl sm:text-2xl drop-shadow-sm
            -mt-2 md:mt-0
          "
        >
          <FaHome className="text-xl sm:text-2xl" />
          <span className={rubik.className}>المنزل الحديث</span>
        </div>

        {/* يمين: فراغ للموازنة */}
        <div></div>
      </div>
    </header>
  );
}
