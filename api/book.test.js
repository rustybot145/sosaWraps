/* node api/book.test.js — no network, no key needed. Checks the handler's
   guards and the shape of what it hands to Resend. */
const assert = require("assert");

const run = async (env, body, method = "POST") => {
  for (const k of Object.keys(process.env)) if (/resend|booking/i.test(k)) delete process.env[k];
  Object.assign(process.env, env);
  delete require.cache[require.resolve("./book.js")];
  const handler = require("./book.js");

  let sent = null;
  const realFetch = global.fetch;
  global.fetch = async (_url, opts) => ((sent = JSON.parse(opts.body)), { ok: true, status: 200, text: async () => "" });

  let code = 0, payload = null;
  const res = { status(c) { code = c; return this; }, json(p) { payload = p; return this; } };
  await handler({ method, body }, res);
  global.fetch = realFetch;
  return { code, payload, sent };
};

(async () => {
  const good = { RESEND_API_KEY: "NOT-A-REAL-KEY-fixture", BOOKING_TO: "shop@example.com" };
  const rows = [["Name", "Jordan"], ["Wants", "Chrome delete"], ["Vehicle", "2019 Toyota Camry"]];

  assert.strictEqual((await run(good, {}, "GET")).code, 405, "GET is rejected");
  const noKey = await run({ BOOKING_TO: "a@b.c" }, { rows });
  assert.strictEqual(noKey.code, 500, "missing key is a 500");
  assert.strictEqual(noKey.payload.error, "Could not send.", "and says nothing about why");
  assert.strictEqual((await run({ RESEND_API_KEY: "NOT-A-REAL-KEY-fixture" }, { rows })).code, 500, "missing BOOKING_TO is a 500");
  assert.strictEqual((await run(good, { rows: [] })).code, 400, "empty form is a 400");

  const hp = await run(good, { rows, website: "spam" });
  assert.strictEqual(hp.code, 200, "honeypot answers 200");
  assert.strictEqual(hp.sent, null, "honeypot sends no mail");

  const ok = await run(good, { name: "Jordan", email: "jordan@example.com", rows });
  assert.strictEqual(ok.code, 200);
  assert.strictEqual(ok.sent.to, "shop@example.com");
  assert.strictEqual(ok.sent.reply_to, "jordan@example.com", "replies go back to the customer");
  assert.match(ok.sent.subject, /Jordan/);
  for (const [, v] of rows) assert.ok(ok.sent.html.includes(v), `row "${v}" made it into the email`);

  const xss = await run(good, { name: "x", rows: [["Notes", '<script>alert("x")</script>']] });
  assert.ok(!xss.sent.html.includes("<script>"), "form input is escaped");

  console.log("api/book.js — all checks passed");
})();
