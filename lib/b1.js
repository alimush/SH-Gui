import axios from "axios";
import https from "https";

const baseURL = process.env.B1_URL;
const loginData = {
  CompanyDB: process.env.B1_COMPANYDB,
  UserName: process.env.B1_USERNAME,
  Password: process.env.B1_PASSWORD,
};

// نتعامل مع شهادة self-signed
const agent = new https.Agent({ rejectUnauthorized: false });

// نخزّن السشن والكوكي داخليًا
let sessionId = null;
let routeId = null; // أحيانًا SL يرسل ROUTEID ويجب نمرره مع الكوكي

export async function b1Login() {
  const res = await axios.post(`${baseURL}/Login`, loginData, { httpsAgent: agent });
  // SessionId يجي بالـ body، والكوكي بالـ headers['set-cookie']
  sessionId = res.data?.SessionId;
  const setCookie = res.headers["set-cookie"] || [];
  // نلتقط ROUTEID إن وجد
  const routeCookie = setCookie.find(c => c.startsWith("ROUTEID="));
  if (routeCookie) {
    routeId = routeCookie.split(";")[0].split("=")[1];
  }
  if (!sessionId) throw new Error("Login failed: no SessionId");
  return sessionId;
}

function buildHeaders() {
  const cookies = [];
  if (sessionId) cookies.push(`B1SESSION=${sessionId}`);
  if (routeId)   cookies.push(`ROUTEID=${routeId}`);
  return {
    "Content-Type": "application/json",
    "B1S-CaseInsensitive": "true",
    Cookie: cookies.join("; "),
  };
}

// استدعاء عام مع إعادة تسجيل الدخول إذا انتهت الجلسة
export async function b1Request(config) {
  try {
    const headers = { ...(config.headers || {}), ...buildHeaders() };
    return await axios({ ...config, baseURL, httpsAgent: agent, headers });
  } catch (err) {
    const status = err?.response?.status;
    // إذا 401 نحاول نعيد تسجيل الدخول مرة وحدة
    if (status === 401 || status === 403) {
      await b1Login();
      const headers = { ...(config.headers || {}), ...buildHeaders() };
      return await axios({ ...config, baseURL, httpsAgent: agent, headers });
    }
    throw err;
  }
}
