import { SAP_CONFIG } from "@/lib/sapConfig";

export async function POST(req) {
  try {
    const body = await req.json();

    // ✅ 1. Login to SAP Service Layer
    const loginRes = await fetch(`${SAP_CONFIG.baseUrl}/Login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        CompanyDB: SAP_CONFIG.companyDB,
        UserName: SAP_CONFIG.username,
        Password: SAP_CONFIG.password,
      }),
    });

    if (!loginRes.ok) {
      const errData = await loginRes.text();
      return new Response(JSON.stringify({ error: "SAP Login failed", details: errData }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const cookies = loginRes.headers.get("set-cookie"); // نخزن الـ session cookie

    // ✅ 2. Create Sales Order in SAP
    const soRes = await fetch(`${SAP_CONFIG.baseUrl}/Orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies, // session
      },
      body: JSON.stringify({
        CardCode: body.customerCode, // كود العميل
        DocDate: body.docDate,       // تاريخ المستند
        DocDueDate: body.deliveryDate, // تاريخ التسليم
        DocumentLines: body.items.map((item) => ({
          ItemCode: item.itemCode,
          Quantity: Number(item.quantity),
          UnitPrice: Number(item.price),
        })),
      }),
    });

    if (!soRes.ok) {
      const errData = await soRes.text();
      return new Response(JSON.stringify({ error: "Failed to create Sales Order", details: errData }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await soRes.json();

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
