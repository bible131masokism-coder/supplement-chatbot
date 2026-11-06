/* =========================================================
   แชทบอทขายสินค้า (Prototype) — อาหารเสริม
   ระบบ: rule-based / keyword intent matching
   แก้ไขง่าย: ข้อมูลสินค้าอยู่ใน PROVIDER / KNOWLEDGE_BASE ด้านล่าง
   ========================================================= */

/* ---------- ข้อมูลผู้ขาย (แก้ได้ที่นี่) ---------- */
const PROVIDER = {
  name: "ทีมขายออนไลน์",
  productShort: "แคลเซียม+วิตามินดี ซอฟต์เจล",
  productFull: "แคลเซียม+วิตามินดี ซอฟต์เจล (30 แคปซูล)",
  price: "฿590/กล่อง",
  promo: "โปรโมชัน: ซื้อ 2 กล่อง ฿990 (ประหยัด ฿190) + ฟรีค่าจัดส่ง",
  shipping: "ค่าจัดส่งเริ่มต้น ฿40 — ฟรีค่าจัดส่งเมื่อสั่ง 2 กล่องขึ้นไป",
  deliveryTime: "จัดส่งภายใน 1-3 วันทำการ (ได้รับสินค้าภายใน 3-5 วัน)",
  orderHow: [
    "แจ้งชื่อ-นามสกุล และที่อยู่จัดส่ง",
    "เราส่งเลขบัญชีให้โอนเงิน",
    "โอนเสร็จส่งสลิปในแชท",
    "เรายืนยันออเดอร์และจัดส่งทันที"
  ],
  payment: "ชำระผ่านโอนเงิน โปรโมชันผ่อน 0% ผ่านบัตรเครดิต (บางธนาคาร)",
  refund: "รับประกันเปลี่ยนสินค้าใหม่ หากสินค้าชำรุด/แตกหักระหว่างขนส่ง ภายใน 7 วัน",
  hours: "เปิดรับออเดอร์ทุกวัน 09.00-22.00 น."
};

/* ---------- ฐานความรู้: intent -> คำตอบ ---------- */
/* แต่ละ intent มี:
   - keywords: คำสำคัญที่ใช้จับคู่ (ค้นหาแบบ includes)
   - reply: ข้อความตอบ (ฟังก์ชันหรือข้อความ)
*/
const KNOWLEDGE_BASE = [
  {
    intent: "greeting",
    keywords: ["สวัสดี", "ดีจ้า", "ดีครับ", "ว่าไง", "hello", "hi", "หวัดดี", "ทัก"],
    reply: () =>
      `สวัสดีค่ะ 🙏 ยินดีต้อนรับสู่ร้านของเรา\n\n` +
      `ทางเรามีสินค้า **${PROVIDER.productFull}** ค่ะ\n` +
      `พิมพ์ถามได้เลย หรือกดปุ่มลัดด้านล่างก็ได้นะคะ:\n` +
      `• ราคาเท่าไหร่\n` +
      `• คนท้องกินได้ไหม\n` +
      `• สั่งยังไง`
  },
  {
    intent: "price",
    keywords: ["ราคา", "กี่บาท", "แพง", "ถูกกว่ามั้ย", "price", "ราคาเท่าไร"],
    reply: () =>
      `${PROVIDER.productShort} ราคา ${PROVIDER.price} ค่ะ\n\n` +
      `${PROVIDER.promo}\n\n` +
      `สนใจจัดเลยไหมคะ กดถาม "สั่งยังไง" ได้เลย หรือพิมพ์สอบถามเพิ่มได้ค่ะ`
  },
  {
    intent: "pregnant",
    keywords: ["ท้อง", "ตั้งครรภ์", "คุณแม่ตั้งครรภ์", "ให้นม", "ให้นมบุตร", "แม่ให้นม"],
    reply: () =>
      `**คำตอบสำหรับคุณแม่ตั้งครรภ์/ให้นมบุตร:**\n\n` +
      `ผลิตภัณฑ์ตัวนี้มีปริมาณวิตามินดีและแคลเซียม เหมาะกับผู้ใหญ่ทั่วไปและผู้สูงอายุค่ะ\n\n` +
      `⚠️ อย่างไรก็ตาม สำหรับ **หญิงตั้งครรภ์และคุณแม่ที่ให้นมบุตร** แนะนำให้ **ปรึกษาแพทย์หรือเภสัชกร** ก่อนรับประทานทุกครั้ง เพื่อความปลอดภัยของแม่และลูกน้อยนะคะ\n\n` +
      `มีข้อสงสัยอื่นไหมคะ เช่น "ราคา" หรือ "วิธีสั่ง"`
  },
  {
    intent: "order",
    keywords: ["สั่ง", "ซื้อ", "ซื้อที่ไหน", "จอง", "ซื้อเลย", "อยากได้", "เอาค่ะ", "สั่งซื้อ"],
    reply: () =>
      `ขั้นตอนการสั่งซื้อง่ายมากค่ะ 🛒\n\n` +
      `${PROVIDER.orderHow.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n` +
      `ค่าใช้จ่าย: ${PROVIDER.shipping}\n` +
      `${PROVIDER.payment}`
  },
  {
    intent: "dose",
    keywords: ["ทาน", "กิน", "วิธีทาน", "ปริมาณ", "เม็ด", "แคปซูล", "ก่อนอาหาร", "วันละ"],
    reply: () =>
      `**วิธีรับประทาน:** ครั้งละ 1-2 แคปซูล หลังอาหาร วันละ 1 ครั้ง หรือตามคำแนะนำของแพทย์/เภสัชกรค่ะ\n\n` +
      `ตัวสำหรับผู้ใหญ่ทั่วไปและผู้สูงอายุโดยเฉพาะเลยค่ะ`
  },
  {
    intent: "ingredient",
    keywords: ["ส่วนผสม", "ส่วนประกอบ", "สารอาหาร", "อะไรบ้าง", "วิตามิน", "มีอะไร", "ตัวยา", "กรด", "สารสกัด"],
    reply: () =>
      `**ส่วนประกอบหลัก:** แคลเซียม (จากแคลเซียมคาร์บอเนต) ร่วมกับวิตามินดี3 ซึ่งช่วยการดูดซึมแคลเซียม จึงเหมาะกับผู้ที่ต้องการเสริมสร้างกระดูกและฟันให้แข็งแรงค่ะ\n\n` +
      `ไม่มีสารกันบูดและน้ำตาลในสูตรค่ะ`
  },

  {
    intent: "shipping",
    keywords: ["ส่ง", "ค่าส่ง", "จัดส่ง", "ค่าขนส่ง", "ส่งที่ไหน", "ems", "kerry", "flash", "ไปรษณีย์", "จัดส่งนาน"],
    reply: () =>
      `**ค่าจัดส่ง:** ${PROVIDER.shipping}\n` +
      `**ระยะเวลา:** ${PROVIDER.deliveryTime}\n\n` +
      `จัดส่งแบบห่อกันกระแทกอย่างดี พร้อมเลขพัสดุแจ้งในแชทหลังส่งค่ะ`
  },
  {
    intent: "payment",
    keywords: ["จ่าย", "ชำระเงิน", "โอน", "บัตร", "เครดิต", "ผ่อน", "สแกน", "พร้อมเพย์", "บัญชี"],
    reply: () =>
      `ชำระเงินได้ 2 แบบค่ะ:\n\n` +
      `• **โอนเงิน** ผ่านบัญชีที่เราส่งให้ (ส่งสลิปในแชทเพื่อยืนยัน)\n` +
      `• **บัตรเครดิต** ผ่อน 0% นาน 3 เดือน (บางธนาคาร)\n\n` +
      `${PROVIDER.promo}`
  },
  {
    intent: "warranty",
    keywords: ["เปลี่ยน", "คืน", "รับประกัน", "ของเสีย", "ชำรุด", "แตก", "หมดอายุ", "เอ็กไพร์"],
    reply: () =>
      `${PROVIDER.refund}\n\n` +
      `สินค้าทุกชิ้นใหม่สด ตรวจสอบวันหมดอายุก่อนจัดส่งให้เสมอค่ะ`
  },
  {
    intent: "availability",
    keywords: ["มีของ", "มีสต็อก", "หมด", "ของหมด", "พร้อมส่ง", "มีสินค้า"],
    reply: () =>
      `มีของพร้อมส่งค่ะ ✅\n\n` +
      `${PROVIDER.productShort} — ราคา ${PROVIDER.price}\n\n` +
      `รับออเดอร์ทุกวัน 09.00-22.00 น. (${PROVIDER.deliveryTime})`
  },
  {
    intent: "human",
    keywords: ["พนักงาน", "คุยกับคน", "แอดมิน", "เจ้าหน้าที่", "คนจริง", "human", "agent", "ติดต่อ"],
    reply: () =>
      `เข้าใจค่ะ 🙏 ต้องการพูดคุยกับเจ้าหน้าที่จริงใช่ไหมคะ?\n\n` +
      `ตอนนี้ระบบยังเป็นโปรโตไทป์ จึงยังเชื่อมต่อทีมงานจริงไม่ได้ค่ะ แต่สำหรับพรีเซนต์ คุณสลับถามคำถามอื่นได้เลย เช่น "ราคา" หรือ "วิธีสั่ง" นะคะ`
  }
];



/* intent สำรองเมื่อไม่ตรงชุดคำ */
const FALLBACK_REPLY =
  `ขอโทษค่ะ ยังไม่ค่อยเข้าใจคำถามของคุณ 🙇‍♀️\n\n` +
  `ลองพิมพ์ถามใหม่ด้วยคำง่ายๆ หรือกดหัวข้อด้านล่างนะคะ:\n` +
  `• "ราคาเท่าไหร่"\n` +
  `• "คนท้องกินได้ไหม"\n` +
  `• "สั่งยังไง"\n` +
  `• "ส่งช้าหรือเปล่า"`;

/* ปุ่มลัดสำหรับสาธิต */
const QUICK_REPLIES = [
  "ราคาเท่าไหร่",
  "คนท้องกินได้ไหม",
  "สั่งยังไง",
  "ทานยังไง",
  "ค่าส่งเท่าไหร่"
];

/* ---------- ฟังก์ชันจับคู่ intent ---------- */
// ใช้การให้คะแนนตาม "ความจำเพาะ" ของคีย์เวิร์ดที่ตรงกัน
// (คีย์เวิร์ดที่ยาว/เจาะจงได้คะแนนมากกว่า) เพื่อให้คำถามที่มีหลายหัวข้อ
// อย่าง "ค่าส่งเท่าไหร่" ตอบเรื่องค่าส่ง มากกว่าตอบราคาสินค้า
function matchIntent(rawInput) {
  const text = rawInput.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const item of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of item.keywords) {
      if (text.includes(kw.toLowerCase())) {
        score += kw.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }
  return best; // null เมื่อไม่ตรงกับคีย์เวิร์ดใดเลย
}

function getReply(intentObj) {
  return (intentObj && intentObj.reply) ? intentObj.reply() : FALLBACK_REPLY;
}

/* ---------- อ้างอิง DOM ---------- */
const chatBox = document.getElementById("chatBox");
const inputEl = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const restartBtn = document.getElementById("restartBtn");
const quickRepliesEl = document.getElementById("quickReplies");

/* ---------- ตัวช่วย UI ---------- */
function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function addMessage(text, who) {
  const div = document.createElement("div");
  div.className = `msg ${who}`;
  const body = document.createElement("div");
  body.textContent = text;
  const time = document.createElement("span");
  time.className = "time";
  time.textContent = nowTime();
  div.appendChild(body);
  div.appendChild(time);
  chatBox.appendChild(div);
  scrollToBottom();
  return div;
}

function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
  const t = document.createElement("div");
  t.className = "typing";
  t.innerHTML = "<span></span><span></span><span></span>";
  chatBox.appendChild(t);
  scrollToBottom();
  return t;
}

/* จำลองดีเลย์การพิมพ์ -> บอทตอบ */
function botReply(inputText) {
  const typingEl = showTyping();
  const delay = 900 + Math.random() * 600;
  setTimeout(() => {
    typingEl.remove();
    const intent = matchIntent(inputText);
    addMessage(getReply(intent), "bot");
    scrollToBottom();
  }, delay);
}

function handleUserMessage(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  addMessage(trimmed, "user");
  inputEl.value = "";
  botReply(trimmed);
}

/* ---------- เหตุการณ์ ---------- */
sendBtn.addEventListener("click", () => handleUserMessage(inputEl.value));
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleUserMessage(inputEl.value);
});

function renderQuickReplies() {
  quickRepliesEl.innerHTML = "";
  QUICK_REPLIES.forEach((label) => {
    const btn = document.createElement("button");
    btn.className = "quick-reply";
    btn.textContent = label;
    btn.addEventListener("click", () => handleUserMessage(label));
    quickRepliesEl.appendChild(btn);
  });
}

/* เริ่มบทสนทนาใหม่ */
function startConversation() {
  chatBox.innerHTML = "";
  inputEl.value = "";
  const greeting = getReply(KNOWLEDGE_BASE.find((i) => i.intent === "greeting"));
  setTimeout(() => {
    addMessage(greeting, "bot");
    renderQuickReplies();
    scrollToBottom();
  }, 400);
}

restartBtn.addEventListener("click", startConversation);

/* ---------- เริ่มต้น ---------- */
startConversation();

/* ส่งออกสำหรับการทดสอบ (Node) — ไม่มีผลในเบราว์เซอร์ */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { matchIntent, getReply, KNOWLEDGE_BASE, PROVIDER };
}

