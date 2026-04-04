const axios = require("axios");
const { BACKEND_URL } = require("../config");

async function emitTrigger(payload) {
  try {
    await axios.post(BACKEND_URL, payload);
    console.log("✅ Trigger sent:", payload);
  } catch (err) {
    console.error("❌ Failed to send trigger", err.message);
  }
}

module.exports = { emitTrigger };