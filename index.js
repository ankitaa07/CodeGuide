const { startRainTrigger } = require("./triggers/rain");
const { startTrafficTrigger } = require("./triggers/traffic");
const { startAQITrigger } = require("./triggers/aqi");
const { startConnectivityTrigger } = require("./triggers/connectivity");
const { startCivicTrigger } = require("./triggers/civic");

console.log("🚀 RiderShield Trigger Service Running...");

startRainTrigger();
startTrafficTrigger();
startAQITrigger();
startConnectivityTrigger();
startCivicTrigger();