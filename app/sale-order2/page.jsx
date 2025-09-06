"use client";

import { useState } from "react";

export default function SalesOrderPage() {
  const [cardCode, setCardCode] = useState("");
  const [docDate, setDocDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [lines, setLines] = useState([{ itemCode: "", quantity: 1, price: 0 }]);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  const addLine = () => setLines(prev => [...prev, { itemCode: "", quantity: 1, price: 0 }]);
  const updateLine = (i, key, val) => {
    setLines(prev => prev.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)));
  };
  const removeLine = (i) => setLines(prev => prev.filter((_, idx) => idx !== i));

  const submit = async () => {
    setErr(""); setResult(null);
    try {
      const res = await fetch("/api/b1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardCode, docDate, remarks, lines }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(typeof data === "string" ? data : JSON.stringify(data));
      setResult(data);
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 p-6">
      <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow p-5 space-y-4">
        <h1 className="text-2xl font-bold text-indigo-700">إنشاء أمر بيع (Sales Order)</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="p-3 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="رمز الزبون (CardCode)"
            value={cardCode}
            onChange={e => setCardCode(e.target.value)}
          />
          <input
            type="date"
            className="p-3 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-300"
            value={docDate}
            onChange={e => setDocDate(e.target.value)}
          />
          <input
            className="p-3 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="ملاحظات (Comments)"
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="font-semibold text-gray-700">السطور (DocumentLines)</div>
          {lines.map((l, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input
                className="col-span-5 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="ItemCode"
                value={l.itemCode}
                onChange={e => updateLine(i, "itemCode", e.target.value)}
              />
              <input
                type="number"
                min={1}
                className="col-span-3 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Quantity"
                value={l.quantity}
                onChange={e => updateLine(i, "quantity", Number(e.target.value))}
              />
              <input
                type="number"
                min={0}
                className="col-span-3 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Unit Price"
                value={l.price}
                onChange={e => updateLine(i, "price", Number(e.target.value))}
              />
              <button
                type="button"
                className="col-span-1 px-3 py-2 rounded bg-rose-500 hover:bg-rose-600 text-white"
                onClick={() => removeLine(i)}
                title="حذف السطر"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={addLine}
          >
            + إضافة سطر
          </button>
        </div>

        <div className="pt-2">
          <button
            onClick={submit}
            className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            إنشاء أمر البيع
          </button>
        </div>

        {err && (
          <pre className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded">{err}</pre>
        )}
        {result && (
          <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
            <div className="font-bold mb-1">تم الإنشاء:</div>
            <pre className="overflow-auto">{JSON.stringify(result, null, 2)}</pre>
            {/* غالبًا يرجع DocEntry و DocNum */}
          </div>
        )}
      </div>
    </div>
  );
}
