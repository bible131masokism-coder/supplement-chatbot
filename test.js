// Temporary test harness: stub a minimal DOM, load script.js, and validate
// the intent-matching logic against expected topics.

function makeEl() {
  return {
    innerHTML: "",
    textContent: "",
    className: "",
    value: "",
    scrollTop: 0,
    scrollHeight: 500,
    children: [],
    appendChild(c) { this.children.push(c); return c; },
    addEventListener() {},
    remove() {},
  };
}

const els = {
  chatBox: makeEl(),
  userInput: makeEl(),
  sendBtn: makeEl(),
  restartBtn: makeEl(),
  quickReplies: makeEl(),
};

global.document = {
  getElementById: (id) => els[id],
  createElement: () => makeEl(),
};
global.Date = Date; // keep real Date

const { matchIntent, getReply } = require("./script.js");

const tests = [
  ["ราคาเท่าไหร่", "price"],
  ["ซื้อ 2 กล่องราคาเท่าไร", "price"],
  ["คนท้องกินได้ไหม", "pregnant"],
  ["แม่ที่ให้นมบุตรทานได้ไหม", "pregnant"],
  ["สั่งยังไงครับ", "order"],
  ["อยากซื้อ", "order"],
  ["ทานยังไง วันละกี่เม็ด", "dose"],
  ["มีส่วนผสมอะไรบ้าง", "ingredient"],
  ["ค่าส่งเท่าไหร่", "shipping"],
  ["ราคาเท่าไหร่", "price"],
  ["มีของพร้อมส่งไหม", "availability"],
  ["จ่ายด้วยบัตรเครดิตได้ไหม", "payment"],
  ["รับประกันไหมถ้าสินค้าแตก", "warranty"],
  ["มีของในสต็อกไหม", "availability"],
  ["ขอคุยกับแอดมิน", "human"],
  ["สวัสดีจ้า", "greeting"],
  ["blah blah ไม่เกี่ยวกับสินค้า", null], // expect fallback
];

setTimeout(() => {
  let pass = 0, fail = 0;
  for (const [input, expected] of tests) {
    const intent = matchIntent(input);
    const got = intent ? intent.intent : null;
    const ok = got === expected;
    if (ok) pass++; else fail++;
    console.log(`${ok ? "PASS" : "FAIL"}  "${input}" -> ${got} (expect ${expected})`);
  }
  const fb = getReply(null);
  console.log(`Fallback reply length: ${fb.length} chars, contains "ขอโทษ": ${fb.includes("ขอโทษ")}`);
  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
}, 500);

