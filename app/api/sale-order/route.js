// api/sale-order/route.js
import axios from "axios";
import https from "https";

export async function GET() {
  try {
    const baseURL = "https://192.168.68.50:50000/b1s/v1";
    const loginData = {
      CompanyDB: "MH_TEST04092025",
      UserName: "manager",
      Password: "1@@@",
    };

    // SSL self-signed certificates bypass
    const agent = new https.Agent({ rejectUnauthorized: false });

    const res = await axios.post(`${baseURL}/Login`, loginData, {
      httpsAgent: agent,
    });

    if (res.data && res.data.SessionId) {
      console.log("connected to DB");
      return new Response("connected to DB ✅", { status: 200 });
    } else {
      console.log("failed");
      return new Response("failed ❌", { status: 500 });
    }
  } catch (err) {
    console.error("Login error:", err.message);
    return new Response("failed ❌", { status: 500 });
  }
}
