"use client";

import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { motion } from "framer-motion";

const zones = [
  { name: "Chennai - Central", risk: 0.6 },
  { name: "Chennai - North", risk: 0.7 },
  { name: "Chennai - South", risk: 0.5 },
  { name: "Chennai - OMR", risk: 0.65 },
  { name: "Chennai - Velachery", risk: 0.75 },
];

export default function Coverage() {
  const [ratio, setRatio] = useState(60);
  const [zone, setZone] = useState(zones[0]);
  const [payout, setPayout] = useState(1000);

  // 🔥 Dynamic Calculations
  const basePremium = 20;
  const premium = Math.round(basePremium + (ratio * zone.risk * payout) / 1000);

  const riskLevel =
    zone.risk > 0.7 ? "High" : zone.risk > 0.6 ? "Medium" : "Low";

  const riskColor =
    riskLevel === "High"
      ? "bg-red-500"
      : riskLevel === "Medium"
      ? "bg-yellow-400"
      : "bg-green-400";

  return (
    <div className="flex bg-[#0B0F1A] text-white min-h-screen">

      <Sidebar />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 w-full flex flex-col gap-6"
      >

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Activate Coverage</h1>
          <p className="text-gray-400">
            Customize your AI-powered protection
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* FORM */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-6 backdrop-blur-xl"
          >

            {/* ZONE SELECT */}
            <div>
              <label className="text-sm text-gray-400">Select Zone</label>

              <div className="grid grid-cols-2 gap-2 mt-2">
                {zones.map((z, i) => (
                  <button
                    key={i}
                    onClick={() => setZone(z)}
                    className={`p-3 rounded-xl text-sm border transition ${
                      zone.name === z.name
                        ? "bg-blue-600/30 border-blue-500"
                        : "bg-[#111827] border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {z.name}
                  </button>
                ))}
              </div>

              <p className="text-xs mt-2">
                Risk Level:{" "}
                <span
                  className={
                    riskLevel === "High"
                      ? "text-red-400"
                      : riskLevel === "Medium"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }
                >
                  {riskLevel}
                </span>
              </p>
            </div>

            {/* RISK BAR */}
            <div>
              <p className="text-sm text-gray-400 mb-1">Zone Risk</p>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full ${riskColor}`}
                  style={{ width: `${zone.risk * 100}%` }}
                />
              </div>
            </div>

            {/* COVERAGE RATIO */}
            <div>
              <label className="text-sm text-gray-400">
                Coverage Ratio:{" "}
                <span className="text-blue-400">{ratio}%</span>
              </label>

              <input
                type="range"
                min="50"
                max="70"
                value={ratio}
                onChange={(e) => setRatio(Number(e.target.value))}
                className="w-full mt-2 accent-blue-500"
              />
            </div>

            {/* PAYOUT */}
            <div>
              <label className="text-sm text-gray-400">
                Max Weekly Payout (₹)
              </label>
              <input
                type="number"
                value={payout}
                onChange={(e) => setPayout(Number(e.target.value))}
                className="mt-2 w-full p-3 bg-[#111827] border border-white/10 rounded-xl"
              />
            </div>

            {/* CTA */}
            <button className="bg-blue-600 hover:bg-blue-700 p-3 rounded-xl font-medium transition hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              Activate Coverage
            </button>

          </motion.div>

          {/* AI CARD */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-600/20 to-green-500/10 border border-white/10 rounded-2xl p-6 flex flex-col justify-between"
          >

            <div>
              <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 text-xl font-semibold">
                AI Recommended Plan
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                Live calculated based on your inputs
              </p>

              <div className="mt-6 space-y-3 text-sm">

                <div className="flex justify-between">
                  <span className="text-gray-400">Coverage Ratio</span>
                  <span>{ratio}%</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Max Payout</span>
                  <span>₹{payout}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Zone Risk</span>
                  <span>{(zone.risk * 100).toFixed(0)}%</span>
                </div>

                <div className="flex justify-between text-lg font-semibold">
                  <span>Premium</span>
                  <span className="text-green-400">₹{premium}/week</span>
                </div>

              </div>
            </div>

            <div className="mt-6 text-sm text-gray-300">
              💡 AI dynamically adjusts pricing based on risk exposure and coverage level.
            </div>

          </motion.div>

        </div>

      </motion.div>
    </div>
  );
}