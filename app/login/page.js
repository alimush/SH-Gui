"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserAlt, FaLock, FaClipboardList } from "react-icons/fa";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        setMessage("");
        router.push("/home");
      } else {
        const errData = await res.json();
        setMessage("❌ " + errData.error);
        console.log(errData.error)
      }
    } catch (err) {
      setMessage("❌ Error: " + err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-200">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 20px 35px rgba(0,0,0,0.15)",
        }}
        className="bg-white/50 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl mb-16 w-full max-w-md border border-white/40 text-center"
      >
        {/* أيقونة */}
        {/* <div className="flex justify-center text-indigo-600 text-6xl mb-6 drop-shadow-lg">
          <FaClipboardList />
        </div> */}

        {/* العنوان */}
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 tracking-wide">
          تسجيل الدخول
        </h2>

        {/* النموذج */}
        <form onSubmit={handleLogin} className="space-y-6 text-left">
          {/* Username */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              اسم المستخدم
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-400 bg-white/70">
              <span className="px-3 text-indigo-600 text-lg">
                <FaUserAlt />
              </span>
              <input
                type="text"
                className="w-full p-3 rounded-r-lg focus:outline-none text-gray-800 bg-transparent focus:scale-105 transition-transform duration-200"
                placeholder="اكتب اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              كلمة المرور
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-400 bg-white/70">
              <span className="px-3 text-indigo-600 text-lg">
                <FaLock />
              </span>
              <input
                type="password"
                className="w-full p-3 rounded-r-lg focus:outline-none text-gray-800 bg-transparent focus:scale-105 transition-transform duration-200"
                placeholder="اكتب كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* زر */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold text-lg shadow-md  hover:from-indigo-700 hover:via-blue-700 hover:to-cyan-700 "
          >
            تسجيل دخول
          </button>
        </form>

        {/* رسالة */}
        {message && (
          <p className="text-center mt-6 text-base font-medium text-gray-700">
            {message}
          </p>
        )}
      </motion.div>
    </div>
  );
}
