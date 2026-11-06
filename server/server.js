/* =========================================================
   แชทบอทขายสินค้า — Backend (DeepSeek API)
   เก็บ API key ไว้ที่ env var DEEPSEEK_API_KEY ห้ามวางในหน้าเว็บ
   ========================================================= */
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // อนุญาตทุก origin (สำหรับ prototype)
app.use(express.json());

/* fallback key ชั่วคราว (ใส่ใน env/มีค่าเหนือกว่าจะใช้ env ก่อน)
   ⚠️ ผู้ใช้จะลบ key นี้เองหลังใช้งานเสร็จ อย่าใช้ถาวร */
const FALLBACK_API_KEY = "tm_live_kryIxohsnSyX_Or3jX-wvQeDuKbaupAe7pUn1sydZvEEJXV81Z_lLZ2U";

const API_KEY = process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY || FALLBACK_API_KEY;
// base URL ของ API (OpenAI-compatible) — เปลี่ยนตาม provider
//   - DeepSeek:            https://api.deepseek.com
//   - OpenAI:              https://api.openai.com/v1
//   - เจ้าอื่นที่บอก URL มา: ใส่ URL นั้น
const API_BASE = (process.env.API_BASE_URL || "https://api.tokenme.limited/api/v1").replace(/\/+$/, "");
// ชื่อโมเดล
//   - DeepSeek:  deepseek-chat
//   - OpenAI:    gpt-4o-mini / gpt-4o
//   - เจ้าอื่น:    ตามที่ให้มา
const MODEL = process.env.OPENAI_MODEL || process.env.DEEPSEEK_MODEL || "deepseek-ai/deepseek-v4-flash-0731";
const PORT = process.env.PORT || 3000;

/* ข้อมูลสินค้าที่ให้ AI ใช้เป็น "พนักงานขาย" */
const SYSTEM_PROMPT = [
  "คุณคือพนักงานขายสินค้าออนไลน์ของร้านเรา เป็นมิตร พูดภาษาไทย เว้นวรรคสวยงาม",
  "ขายสินค้า: แคลเซียม+วิตามินดี ซอฟต์เจล (30 แคปซูล)",
  "ข้อมูลสินค้า:",
  "- ราคา ฿xxx/กล่อง, โปรโมชัน ซื้อ 2 กล่อง ฿xxx (ลด ฿xxx) + ฟรีค่าจัดส่ง",
  "- เหมาะกับผู้ใหญ่ทั่วไปและผู้สูงอายุ ช่วยเสริมสร้างกระดูกและฟัน",
  "- วิธีทาน: ครั้งละ 1-2 แคปซูล หลังอาหาร วันละ 1 ครั้ง หรือตามแพทย์/เภสัชกร",
  "- ส่วนประกอบ: แคลเซียมคาร์บอเนต + วิตามินดี3, ไม่มีสารกันบูดและน้ำตาล",
  "- ค่าจัดส่งเริ่ม ฿xxx, ฟรีเมื่อสั่ง 2 กล่องขึ้นไป, จัดส่ง 1-3 วันทำการ",
  "- ชำระแบบโอนเงิน (ส่งสลิปยืนยัน) หรือบัตรเครดิตผ่อน 0% (บางธนาคาร)",
  "- รับประกันเปลี่ยนสินค้าใหม่ภายใน 7 วัน หากชำรุด/แตกหักระหว่างขนส่ง",
  "- เปิดรับออเดอร์ทุกวัน 09.00-22.00 น.",
  "ข้อปฏิบัติ:",
  "- ตอบสั้น กระชับ เป็นมิตร ไม่เยิ่นเย้อ",
  "- ถ้าลูกค้าถามเรื่องคนท้อง/ตั้งครรภ์/ให้นมบุตร ให้ตอบด้วยความสุภาพว่าแนะนำให้ปรึกษาแพทย์ก่อนทาน",
  "- ถ้าลูกค้าถามขั้นตอนสั่งซื้อ ให้บอกขั้นตอนสั้นๆ: แจ้งชื่อ/ที่อยู่ -> เราส่งเลขบัญชี -> โอนเงินส่งสลิป -> จัดส่ง",
  "- ถ้าไม่แน่ใจหรือถามนอกเหนือสินค้า ให้แนะนำอย่างสุภาพและชวนกลับมาเรื่องสินค้า",
].join("\n");

/* การ์ดสำหรับกรอก request ให้เป็นรูปแบบที่ DeepSeek ใช้ */
async function callDeepSeek(messages) {
  const res = await fetch(`${API_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 700,
      stream: false,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    const msg =
      (data && data.error && data.error.message) ||
      (data && data.error) ||
      `DeepSeek API error (HTTP ${res.status})`;
    throw new Error(msg);
  }
  const reply = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  return reply;
}

/* endpoint เช็คสถานะ */
app.get("/health", (_req, res) => {
  res.json({ ok: true, hasKey: Boolean(API_KEY), apiBase: API_BASE, model: MODEL });
});

/* endpoint หลักสำหรับแชท */
app.post("/api/chat", async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ error: "SERVER_MISSING_KEY: ยังไม่ได้ตั้งค่า OPENAI_API_KEY หรือ DEEPSEEK_API_KEY" });
  }

  const history = Array.isArray(req.body && req.body.history) ? req.body.history : [];
  // จำกัดให้ไม่ยิง token เยอะเกิน
  const recent = history.slice(-20);

  const messages = [{ role: "system", content: SYSTEM_PROMPT }].concat(recent);

  try {
    const reply = await callDeepSeek(messages);
    res.json({ reply });
  } catch (err) {
    console.error("DeepSeek error:", err && err.message);
    res.status(502).json({ error: String((err && err.message) || "unknown") });
  }
});

app.listen(PORT, () => {
  console.log(`Chatbot server running on http://localhost:${PORT}`);
});
