"use client";

import Link from "next/link";
import { FaClipboardList } from "react-icons/fa";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-white to-blue-200">
      <main className="flex flex-1 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          whileHover={{
            scale: 1.04,
            boxShadow: "0 20px 35px rgba(0,0,0,0.2)",
          }}
          className="bg-white/50 backdrop-blur-2xl border border-white/40 mb-16 rounded-3xl shadow-xl p-12 w-[420px] text-center"
        >
          {/* أيقونة */}
          <div className="flex justify-center text-indigo-600 text-7xl mb-6 drop-shadow-lg">
            <FaClipboardList />
          </div>

          {/* العنوان */}
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4 tracking-wide">
            أمر البيع 
          </h2>
          <p className="text-gray-500 mb-8 text-sm">
            Sale Order
          </p>

          {/* الزر */}
          <Link href="/sale-order">
            <button className="w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white py-3.5 text-lg rounded-xl font-semibold shadow-md hover:from-indigo-700 hover:via-blue-700 hover:to-cyan-700 ">
              Open 
            </button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
