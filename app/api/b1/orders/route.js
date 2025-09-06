
import { b1Login, b1Request } from "@/lib/b1";

export async function POST(req) {
  try {
    const body = await req.json();
    const { cardCode, docDate, remarks, lines } = body || {};

    if (!cardCode || !Array.isArray(lines) || lines.length === 0) {
      return new Response("cardCode & lines are required", { status: 400 });
    }

    // تأكد من السشن
    await b1Login();

    // بناء البوديلود حسب SL (وثيقة Orders = Sales Order)
    const payload = {
      CardCode: cardCode,
      DocDate: docDate || new Date().toISOString().slice(0, 10),
      Comments: remarks || "",
      DocumentLines: lines.map(l => ({
        ItemCode: l.itemCode,
        Quantity: Number(l.quantity || 0),
        UnitPrice: l.price != null ? Number(l.price) : undefined,
      })),
    };

    const res = await b1Request({
      method: "POST",
      url: `/Orders`,
      data: payload,
    });

    // SL يرجّع DocEntry/DocNum بالردّ
    return new Response(JSON.stringify(res.data), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e?.response?.data || e.message;
    return new Response(typeof msg === "string" ? msg : JSON.stringify(msg), {
      status: e?.response?.status || 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
