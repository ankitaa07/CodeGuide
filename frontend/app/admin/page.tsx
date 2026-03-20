"use client";

import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const triggerData = [
  { name: "Rain", value: 40 },
  { name: "Traffic", value: 30 },
  { name: "AQI", value: 15 },
  { name: "Civic", value: 15 },
];

export default function Admin() {
  const totalPolicies = 128;
  const totalPayouts = 45200;
  const lossRatio = 32;

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
          <h1 className="text-3xl font-bold">Admin Analytics</h1>
          <p className="text-gray-400">
            System-wide insights and performance metrics
          </p>
        </div>

        {/* METRIC CARDS */}
        <div className="grid md:grid-cols-3 gap-4">

          {[
            { title: "Total Policies", value: totalPolicies },
            { title: "Total Payouts", value: `₹${totalPayouts}` },
            { title: "Loss Ratio", value: `${lossRatio}%` },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.04 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl"
            >
              <p className="text-gray-400 text-sm">{item.title}</p>
              <h2 className="text-2xl font-semibold mt-1">
                {item.value}
              </h2>
            </motion.div>
          ))}

        </div>

        {/* MAIN GRID */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* TRIGGER CHART */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
          >
            <h2 className="text-lg font-semibold mb-4">
              Trigger Frequency
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={triggerData}>
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* ZONE RISK HEATMAP (MOCK) */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-br from-blue-600/20 to-purple-500/10 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
          >
            <h2 className="text-lg font-semibold mb-4">
              Zone Risk Overview
            </h2>

            <div className="grid grid-cols-2 gap-3 text-sm">

              {[
                { zone: "Central", risk: "Medium", color: "yellow" },
                { zone: "North", risk: "High", color: "red" },
                { zone: "South", risk: "Low", color: "green" },
                { zone: "OMR", risk: "Medium", color: "yellow" },
              ].map((z, i) => (
                <div
                  key={i}
                  className="bg-white/5 p-3 rounded-xl flex justify-between"
                >
                  <span>{z.zone}</span>
                  <span
                    className={
                      z.color === "red"
                        ? "text-red-400"
                        : z.color === "yellow"
                        ? "text-yellow-400"
                        : "text-green-400"
                    }
                  >
                    {z.risk}
                  </span>
                </div>
              ))}

            </div>

          </motion.div>

        </div>

        {/* AI SYSTEM INSIGHT */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-2xl shadow-lg"
        >
          <p className="text-sm opacity-80">System Insight</p>

          <h2 className="text-lg font-semibold mt-2">
            Rain is the Primary Risk Driver
          </h2>

          <p className="text-sm mt-2 opacity-80">
            Over 40% of payouts are triggered by rainfall disruptions.
          </p>

          <p className="mt-4 text-sm">
            💡 Consider adjusting premiums dynamically in high-risk zones.
          </p>
        </motion.div>

      </motion.div>
    </div>
  );
}