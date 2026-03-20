"use client";

import Sidebar from "@/components/Sidebar";
import StatusBadge from "@/components/StatusBadge";
import { CloudRain, Car, Wind, Wifi } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const data = [
  { day: "Mon", expected: 900, actual: 700 },
  { day: "Tue", expected: 1000, actual: 950 },
  { day: "Wed", expected: 1100, actual: 800 },
  { day: "Thu", expected: 950, actual: 900 },
  { day: "Fri", expected: 1200, actual: 850 },
];

export default function Dashboard() {
  return (
    <div className="flex bg-[#0B0F1A] text-white min-h-screen">

      <Sidebar />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 w-full flex flex-col gap-6"
      >

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-400">Welcome back 👋</p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { title: "Weekly Earnings", value: "₹950" },
            { title: "Coverage", value: "Active", color: "text-green-400" },
            { title: "Risk Level", value: "Medium" },
            { title: "Protected Income", value: "₹700", color: "text-blue-400" },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.04 }}
              className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.03)] transition"
            >
              <p className="text-gray-400 text-sm">{item.title}</p>
              <h2 className={`text-2xl font-semibold mt-1 ${item.color || ""}`}>
                {item.value}
              </h2>
            </motion.div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* CHART */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="col-span-2 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl"
          >
            <h2 className="mb-4 font-semibold text-gray-300">
              Earnings vs Expected
            </h2>

            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data}>
                <XAxis dataKey="day" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Line dataKey="expected" stroke="#3b82f6" strokeWidth={2} />
                <Line dataKey="actual" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* AI CARD */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="relative bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-white/10 blur-2xl opacity-20"></div>

            <p className="text-sm opacity-80">AI Insight</p>
            <h2 className="text-lg font-semibold mt-2">
              High Rain Risk Detected
            </h2>
            <p className="text-sm mt-2 opacity-80">
              Expected 30–40% drop in deliveries today.
            </p>

            <p className="mt-4 text-sm">
              💡 Coverage likely to trigger payout
            </p>
          </motion.div>

        </div>

        {/* RISK MONITOR */}
        <div>
          <h2 className="mb-4 font-semibold text-gray-300">
            Live Risk Monitor
          </h2>

          <div className="grid md:grid-cols-4 gap-4">

            {[
              {
                icon: <CloudRain />,
                title: "Rain",
                status: "high",
                text: "Heavy rain expected",
              },
              {
                icon: <Car />,
                title: "Traffic",
                status: "medium",
                text: "Moderate congestion",
              },
              {
                icon: <Wind />,
                title: "AQI",
                status: "low",
                text: "Air quality is good",
              },
              {
                icon: <Wifi />,
                title: "Connectivity",
                status: "low",
                text: "No outages",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-xl transition"
              >
                <div className="flex justify-between items-center">
                  <div className="text-blue-400">{item.icon}</div>
                  <StatusBadge status={item.status} />
                </div>

                <p className="mt-3 font-medium">{item.title}</p>
                <p className="text-sm text-gray-400">{item.text}</p>
              </motion.div>
            ))}

          </div>
        </div>

      </motion.div>
    </div>
  );
}