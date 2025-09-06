import { b1Login } from "@/lib/b1";

export async function GET() {
  try {
    await b1Login();
    return new Response("✅ Connected to SAP B1 Service Layer", { status: 200 });
  } catch (e) {
    return new Response("❌ Login failed: " + e.message, { status: 500 });
  }
}
