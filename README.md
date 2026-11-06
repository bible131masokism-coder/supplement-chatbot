# แชทบอทขายสินค้า (อาหารเสริม) — Prototype + AI จริง

แชทบอทขายสินค้าแบบ **เว็บแชท UI** + เชื่อม **AI จริง** (OpenAI-compatible ผ่าน
[tokenme.limited](https://api.tokenme.limited/api/v1)) เพื่อวิเคราะห์คำถามลูกค้า
แล้วตอบเป็นพนักงานขายตามสคริปต์/ข้อมูลสินค้า

## โครงสร้าง
- `index.html` / `style.css` / `script.js` — หน้าแชท (โฮสต์บน GitHub Pages)
- `server/` — Backend (Node/Express) เก็บ key + เชื่อม AI
  - `server.js` — API endpoint `/api/chat`
  - `server/.env` — ตั้งค่า key/endpoint/โมเดล (**โดน gitignore ไม่ขึ้น GitHub**)
  - `Dockerfile` — สำหรับขึ้น Render/Docker

## วิธีรันในเครื่อง (ทดสอบ)
```powershell
# 1. เปิด server (อย่าลืมตั้งค่า server/.env ก่อน)
cd server
npm install
npm start          # เปิดที่ http://localhost:3000

# 2. เปิดหน้าแชท
#    เปิด index.html ในเบราว์เซอร์ (script.js ชี้ AI_API_BASE=http://localhost:3000)
```

### ตั้งค่า `server/.env`
```env
OPENAI_API_KEY=tm_live_xxxxxxxx           # หรือ DEEPSEEK_API_KEY
API_BASE_URL=https://api.tokenme.limited/api/v1   # endpoint ของ provider
OPENAI_MODEL=deepseek-ai/deepseek-v4-flash-0731   # ชื่อโมเดล
```

## วิธีขึ้นเว็บให้คนอื่นใช้
### 1) Frontend บน GitHub Pages (ทำแล้ว)
repo: `bible131masokism-coder/supplement-chatbot`
เปิด Pages (Settings → Pages → main / root) → ลิงก์
`https://bible131masokism-coder.github.io/supplement-chatbot/`

### 2) Backend บน Render (ต้องทำเพื่อให้ AI ทำงานผ่านลิงก์)
1. ไปที่ **render.com** → สมัคร/login ด้วย **GitHub** (ฟรี)
2. **New → Web Service** → เลือก repo `supplement-chatbot`
3. ตั้งค่า:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Runtime:** Node  (หรือเลือก Docker)
4. ใน **Environment** เพิ่มตัวแปร:
   - `OPENAI_API_KEY` = `tm_live_...`
   - `API_BASE_URL` = `https://api.tokenme.limited/api/v1`
   - `OPENAI_MODEL` = `deepseek-ai/deepseek-v4-flash-0731`
5. Deploy → จะได้ URL เช่น `https://supplement-chatbot.onrender.com`

### 3) โยงหน้าแชทไปหา backend
- เปิด `script.js` → แก้
  ```js
  const AI_API_BASE = "https://supplement-chatbot.onrender.com"; // เปลี่ยนเป็น URL ของ Render
  ```
- push ขึ้น GitHub อีกครั้ง (Pages อัปเดตอัตโนมัติ) → ทุกคนที่เปิดลิงก์จะได้แชท AI จริง

> หมายเหตุ: Render free tier จะหลับเมื่อไม่มีการใช้งาน (cold start ~50 วินาทีครั้งแรก)
> ถ้าเปิดลิงก์แล้วรอสักครู่ก็ทำงานปกติ

## โฟลว์การทำงาน
1. ลูกค้าพิมพ์คำถามในแชท
2. หน้าแชทส่ง `{ history: [...] }` ไป `/api/chat` ของ backend
3. Backend ต่อ system prompt (สคริปต์พนักงานขาย + ข้อมูลสินค้า) + ประวัติ แล้วยิง AI
4. AI วิเคราะห์คำถามตอบเป็นภาษาไทยตามสคริปต์ → แสดงในแชท
5. ถ้า backend ไม่พร้อม → fallback ใช้สคริปต์ keyword ในเครื่องแทน

## ทดสอบ
```powershell
cd supplement-chatbot
node test.js     # ทดสอบ keyword matching (17 cases)
```
