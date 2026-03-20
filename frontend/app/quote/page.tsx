"use client";

import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Quote() {
  const [income] = useState(1200);
  const [ratio] = useState(60);

  const risks = {
    rain: 0.3,
    traffic: 0.25,
    aqi: 0.15,
    civic: 0.1,
  };

  const totalRisk =
    risks.rain + risks.traffic + risks.aqi + risks.civic;

  const expectedLoss = Math.round(income * totalRisk * (ratio / 100));
  const premium = Math.round(expectedLoss * 0.15);

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
          <h1 className="text-3xl font-bold">Weekly Quote</h1>
          <p className="text-gray-400">
            AI-calculated premium based on real-world risks
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* LEFT: SUMMARY */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-6 backdrop-blur-xl"
          >

            <h2 className="text-lg font-semibold">Quote Summary</h2>

            <div className="space-y-4 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-400">Predicted Income</span>
                <span>₹{income}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Coverage Ratio</span>
                <span>{ratio}%</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Risk Score</span>
                <span className="text-yellow-400 font-medium">
                  {(totalRisk * 100).toFixed(0)}%
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Expected Loss</span>
                <span className="text-red-400">₹{expectedLoss}</span>
              </div>

              <div className="flex justify-between text-xl font-semibold pt-2 border-t border-white/10">
                <span>Final Premium</span>
                <span className="text-green-400">
                  ₹{premium}/week
                </span>
              </div>

            </div>

            <button className="mt-4 bg-green-500 hover:bg-green-600 p-3 rounded-xl font-medium transition hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]">
              Confirm & Activate
            </button>

          </motion.div>

          {/* RIGHT: RISK BREAKDOWN */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-br from-blue-600/20 to-purple-500/10 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
          >

            <h2 className="text-lg font-semibold mb-4">
              Risk Breakdown
            </h2>

            {Object.entries(risks).map(([key, value], i) => (
              <div key={i} className="mb-5">

                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize text-gray-300">
                    {key}
                  </span>
                  <span className="text-gray-400">
                    {(value * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-blue-500"
                  />
                </div>

              </div>
            ))}

            <div className="mt-6 text-sm text-gray-300">
              💡 Rain and traffic are the dominant risks this week, increasing your expected loss.
            </div>

          </motion.div>

        </div>

        {/* RISK METER */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
        >

          <h2 className="text-lg font-semibold mb-4">
            Overall Risk Level
          </h2>

          <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${totalRisk * 100}%` }}
              transition={{ duration: 0.6 }}
              className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500"
            />
          </div>

          <p className="mt-2 text-sm text-gray-400">
            {(totalRisk * 100).toFixed(0)}% risk score for this week
          </p>

        </motion.div>

        {/* AI INSIGHT CARD */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-2xl shadow-lg"
        >
          <p className="text-sm opacity-80">AI Insight</p>
          <h2 className="text-lg font-semibold mt-2">
            Elevated Risk Week
          </h2>
          <p className="text-sm mt-2 opacity-80">
            Increased rainfall and traffic congestion are expected to impact delivery efficiency.
          </p>

          <p className="mt-4 text-sm">
            💡 Recommended to maintain at least 60% coverage for optimal protection.
          </p>
        </motion.div>

      </motion.div>
    </div>
  );
}