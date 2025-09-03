"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";




export default function SaleOrderPage() {
  const [items, setItems] = useState([
    { itemCode: "", description: "", quantity: 1, price: 0 },
  ]

);
const router = useRouter();


  // فورماتر لفواصل الآلاف
  const nf = new Intl.NumberFormat("en-US");

  // مبالغ (مو نسب): الخصم + المنصة (تُحسب كضريبة مبلغ ثابت)
  const [discountAmt, setDiscountAmt] = useState(0);
  const [platformAmt, setPlatformAmt] = useState(0);

  // helpers للـ inputs المبلغية مع فواصل آلاف
  const parseMoney = (v) => Number(String(v).replace(/,/g, "")) || 0;
  const formatMoney = (n) => nf.format(Number(n) || 0);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  };

  const inputsRef = useRef([]);

  const addItem = () => {
    setItems([...items, { itemCode: "", description: "", quantity: 1, price: 0 }]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const total = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0),
    0
  );

  const handleKeyDown = (e, i, j) => {
    if (e.key === "Enter" || e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = i * 4 + j + 1;
      if (inputsRef.current[nextIndex]) {
        inputsRef.current[nextIndex].focus();
      }
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = i * 4 + j - 1;
      if (inputsRef.current[prevIndex]) {
        inputsRef.current[prevIndex].focus();
      }
    }
  };

  // حسابات: خصم مبلغ ثابت + منصة كمبلغ ضريبة ثابت
  const safeDiscount = Math.min(discountAmt, total);     // لا يزيد الخصم عن المجموع
  const afterDiscount = Math.max(total - safeDiscount, 0);
  const taxAmount = platformAmt;                          // المنصة = مبلغ ضريبة
  const grandTotal = afterDiscount + taxAmount;

  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-white to-blue-200"
      dir="rtl"
    >
      <main className="flex flex-1 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="bg-white/50 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-xl p-8 sm:p-12 w-full max-w-5xl"
        >

{/* 🔹 الهيدر مع زر الرجوع */}
<div className="flex justify-between items-center mb-8">
  <h2 className="text-3xl font-extrabold text-gray-800">
    إنشاء أمر بيع
  </h2>

  <button
    onClick={() => router.back()}
    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition"
  >
    رجوع
  </button>
</div>



          {/* 🔹 الهيدر */}
          <motion.section
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8"
          >
            <motion.div variants={item}>
              <label className="block text-xs font-medium text-gray-600 mb-1">كود العميل</label>
              <input
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white/70 
                           focus:ring-2 focus:ring-indigo-400 focus:scale-105 transition-transform duration-200"
                placeholder="C0001"
              />
            </motion.div>

            <motion.div variants={item}>
              <label className="block text-xs font-medium text-gray-600 mb-1">اسم العميل</label>
              <input
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white/70 
                           focus:ring-2 focus:ring-indigo-400 focus:scale-105 transition-transform duration-200"
                placeholder="اسم العميل"
              />
            </motion.div>

            <motion.div variants={item}>
              <label className="block text-xs font-medium text-gray-600 mb-1">تاريخ المستند</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white/70 
                           focus:ring-2 focus:ring-indigo-400 focus:scale-105 transition-transform duration-200"
              />
            </motion.div>

            <motion.div variants={item}>
              <label className="block text-xs font-medium text-gray-600 mb-1">الوزارة</label>
              <input
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white/70 
                           focus:ring-2 focus:ring-indigo-400 focus:scale-105 transition-transform duration-200"
                placeholder="اسم الوزارة"
              />
            </motion.div>

            <motion.div variants={item}>
              <label className="block text-xs font-medium text-gray-600 mb-1">الدائرة</label>
              <input
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white/70 
                           focus:ring-2 focus:ring-indigo-400 focus:scale-105 transition-transform duration-200"
                placeholder="اسم الدائرة"
              />
            </motion.div>

            <motion.div variants={item}>
              <label className="block text-xs font-medium text-gray-600 mb-1">عدد الأقساط</label>
              <input
                type="number"
                min={1}
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white/70 
                           focus:ring-2 focus:ring-indigo-400 focus:scale-105 transition-transform duration-200"
                placeholder="0"
              />
            </motion.div>

            <motion.div variants={item}>
              <label className="block text-xs font-medium text-gray-600 mb-1">رقم الهاتف</label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white/70 
                           focus:ring-2 focus:ring-indigo-400 focus:scale-105 transition-transform duration-200"
                placeholder="0770XXXXXXX"
              />
            </motion.div>

            <motion.div variants={item}>
              <label className="block text-xs font-medium text-gray-600 mb-1">نوع الدفع</label>
              <select
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white/70 
                           focus:ring-2 focus:ring-indigo-400 focus:scale-105 transition-transform duration-200"
              >
                <option>الكتروني</option>
                <option>منصة</option>
                <option>يدوي</option>
              </select>
            </motion.div>

            <motion.div variants={item}>
              <label className="block text-xs font-medium text-gray-600 mb-1">المديرية</label>
              <input
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white/70 
                           focus:ring-2 focus:ring-indigo-400 focus:scale-105 transition-transform duration-200"
                placeholder="اسم المديرية"
              />
            </motion.div>

            {/* المنصة = مبلغ الضريبة (مبلغ ثابت) */}
            <motion.div variants={item}>
              <label className="block text-xs font-medium text-gray-600 mb-1">المنصة </label>
              <input
                inputMode="numeric"
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white/70 
                           focus:ring-2 focus:ring-indigo-400 focus:scale-105 transition-transform duration-200"
                placeholder="0"
                
                onChange={(e) => setPlatformAmt(parseMoney(e.target.value))}
              />
            </motion.div>

            {/* الخصم = مبلغ ثابت */}
            <motion.div variants={item}>
              <label className="block text-xs font-medium text-gray-600 mb-1">الخصم (مبلغ)</label>
              <input
                inputMode="numeric"
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white/70 
                           focus:ring-2 focus:ring-indigo-400 focus:scale-105 transition-transform duration-200"
                placeholder="0"

                onChange={(e) => setDiscountAmt(parseMoney(e.target.value))}
              />
            </motion.div>

            <motion.div variants={item}>
              <label className="block text-xs font-medium text-gray-600 mb-1">الجهة</label>
              <select
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white/70 
                           focus:ring-2 focus:ring-indigo-400 focus:scale-105 transition-transform duration-200"
              >
                <option>قسم العلاقات العامة</option>
                <option>زبون قديم</option>
                <option>تواصل اجتماعي</option>
              </select>
            </motion.div>
          </motion.section>

          {/* 🔹 جدول الأصناف */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              تفاصيل الأصناف
            </h3>
            <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white/70">
              <table className="w-full text-sm text-gray-700">
                <thead className="bg-indigo-100">
                  <tr>
                    <th className="p-2 border">رمز الصنف</th>
                    <th className="p-2 border">الوصف</th>
                    <th className="p-2 border">الكمية</th>
                    <th className="p-2 border">سعر الوحدة</th>
                    <th className="p-2 border">الإجمالي</th>
                    <th className="p-2 border">إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {items.map((item, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td className="p-2 border">
                          <input
                            ref={(el) => (inputsRef.current[i * 4] = el)}
                            className="w-full p-1 border rounded focus:scale-105 transition-transform duration-200 focus:ring-1 focus:ring-purple-300  focus:outline-none"
                            value={item.itemCode}
                            onChange={(e) => updateItem(i, "itemCode", e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, i, 0)}
                          />
                        </td>
                        <td className="p-2 border">
                          <input
                            ref={(el) => (inputsRef.current[i * 4 + 1] = el)}
                            className="w-full p-1 border rounded focus:scale-105 transition-transform duration-200 focus:ring-1 focus:ring-purple-300  focus:outline-none"
                            value={item.description}
                            onChange={(e) => updateItem(i, "description", e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, i, 1)}
                          />
                        </td>
                        <td className="p-2 border">
                          <input
                            ref={(el) => (inputsRef.current[i * 4 + 2] = el)}
                            type="number"
                            min={1}
                            className="w-full p-1 border rounded focus:scale-105 transition-transform duration-200 focus:ring-1 focus:ring-purple-300 focus:outline-none"
                            value={item.quantity}
                            onChange={(e) => updateItem(i, "quantity", Number(e.target.value))}
                            onKeyDown={(e) => handleKeyDown(e, i, 2)}
                          />
                        </td>
                        <td className="p-2 border">
                          <input
                            ref={(el) => (inputsRef.current[i * 4 + 3] = el)}
                            type="number"
                            min={0}
                            className="w-full p-1 border rounded focus:scale-105 transition-transform duration-200 focus:ring-1 focus:ring-purple-300 focus:outline-none"
                            value={item.price}
                            onChange={(e) => updateItem(i, "price", Number(e.target.value))}
                            onKeyDown={(e) => handleKeyDown(e, i, 3)}
                          />
                        </td>
                        <td className="p-2 border text-right">
                          {nf.format((Number(item.quantity) || 0) * (Number(item.price) || 0))} د.ع
                        </td>
                        <td className="p-2 border text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(i)}
                            className="text-red-500 font-semibold"
                          >
                            حذف
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={addItem}
              className="mt-3 text-indigo-600 font-semibold"
            >
              + إضافة صنف
            </button>
          </section>

          {/* 🔹 الفوتر */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ">
                ملاحظات
              </label>
              <textarea
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-2 bg-white/70 focus:ring-2 focus:ring-indigo-400"
                placeholder="ملاحظات إضافية..."
              />
            </div>

            <div 
  className="bg-white/70 rounded-xl border border-gray-300 p-4 space-y-2 text-sm"
  dir="rtl"
>
  <div className="flex justify-between">
    <span>المجموع قبل الخصم:</span>
    <span className="font-semibold">{nf.format(total)} د.ع</span>
  </div>

  <div className="flex justify-between">
    <span>الخصم (مبلغ):</span>
    <span className="font-semibold">{nf.format(safeDiscount)} د.ع</span>
  </div>

  <div className="flex justify-between">
    <span>المجموع بعد الخصم:</span>
    <span className="font-semibold">{nf.format(afterDiscount)} د.ع</span>
  </div>

  <div className="flex justify-between">
    <span>الضريبة (المنصة كمبلغ):</span>
    <span className="font-semibold">{nf.format(taxAmount)} د.ع</span>
  </div>

  <div className="flex justify-between text-lg font-bold border-t pt-2">
    <span>الإجمالي:</span>
    <span>{nf.format(grandTotal)} د.ع</span>
  </div>
</div>

          </section>

          {/* 🔹 الأزرار */}
          <div className="mt-8 flex justify-end gap-4">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700">
              حفظ
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
            >
              إلغاء
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
