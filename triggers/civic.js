const axios = require("axios");
const cron = require("node-cron");
const { GEMINI_API, DEMO_MODE } = require("../config");
const { emitTrigger } = require("../utils/emitter");
const { logTrigger } = require("../utils/logger");

function startCivicTrigger() {
  if (DEMO_MODE) {
    setTimeout(() => emitTrigger({ trigger_type: "civic" }), 10000);
    return;
  }

  cron.schedule("*/30 * * * *", async () => {
    const prompt = `
You are a risk assessment AI.
Return ONLY JSON: { "p_civic": number }
Headlines: ["city bandh announced", "major protest blocks roads"]
`;

    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API}`,
        {
          contents: [{ parts: [{ text: prompt }] }]
        }
      );

      const text = res.data.candidates[0].content.parts[0].text;
      const parsed = JSON.parse(text);

      logTrigger({ type: "civic_check", value: parsed.p_civic });

      if (parsed.p_civic > 0.7) {
        emitTrigger({ trigger_type: "civic" });
      }
    } catch (err) {
      console.error("Civic error:", err.message);
    }
  });
}

module.exports = { startCivicTrigger };