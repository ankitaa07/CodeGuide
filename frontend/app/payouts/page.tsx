"use client";

import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { motion } from "framer-motion";

const payouts = [
  {
    id: 1,
    date: "12 Mar",
    trigger: "Rain",
    drop: 35,
    payout: 250,
    details: "Heavy rainfall reduced deliveries significantly",
  },
  {
    id: 2,
    date: "15 Mar",
    trigger: "Traffic",
    drop: 28,
    payout: 180,
    details: "Severe congestion delayed orders",
  },
];

export default function Payouts() {
  const [selected, setSelected] = useState<any>(null);

  const totalPayout = payouts.reduce((acc, p) => acc + p.payout, 0);
  const avgDrop = Math.round(
    payouts.reduce((acc, p) => acc + p.drop, 0) / payouts.length
  );

  const getTriggerColor = (trigger: string) => {
    switch (trigger) {
      case "Rain":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/20";
      case "Traffic":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

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
          <h1 className="text-3xl font-bold">Payout History</h1>
          <p className="text-gray-400">
            Transparent record of all automated payouts
          </p>
        </div>

        {/* 🔥 SUMMARY CARDS (MATCH ADMIN) */}
        <div className="grid md:grid-cols-3 gap-4">

          {[
            { title: "Total Payout", value: `₹${totalPayout}` },
            { title: "Avg Income Drop", value: `${avgDrop}%` },
            { title: "Events Triggered", value: payouts.length },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl"
            >
              <p className="text-gray-400 text-sm">{item.title}</p>
              <h2 className="text-2xl font-semibold mt-1">
                {item.value}
              </h2>
            </motion.div>
          ))}

        </div>

        {/* TABLE */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">

          <table className="w-full text-left">

            <thead className="text-gray-400 text-sm border-b border-white/10">
              <tr>
                <th className="p-4">Date</th>
                <th>Trigger</th>
                <th>Drop %</th>
                <th>Payout</th>
              </tr>
            </thead>

            <tbody>
              {payouts.map((p) => (
                <motion.tr
                  key={p.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelected(p)}
                  className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition"
                >
                  <td className="p-4">{p.date}</td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${getTriggerColor(
                        p.trigger
                      )}`}
                    >
                      {p.trigger}
                    </span>
                  </td>

                  <td className="text-red-400 font-medium">
                    {p.drop}%
                  </td>

                  <td className="text-green-400 font-semibold">
                    ₹{p.payout}
                  </td>
                </motion.tr>
              ))}
            </tbody>

          </table>

        </div>

        {/* 🔥 AI INSIGHT (MATCH ADMIN STYLE) */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-2xl shadow-lg"
        >
          <p className="text-sm opacity-80">System Insight</p>

          <h2 className="text-lg font-semibold mt-2">
            Rain Triggers Highest Payouts
          </h2>

          <p className="text-sm mt-2 opacity-80">
            Most payouts are driven by rainfall disruptions affecting delivery volumes.
          </p>

          <p className="mt-4 text-sm">
            💡 Consider increasing coverage during monsoon periods.
          </p>
        </motion.div>

        {/* MODAL */}
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#111827] p-6 rounded-2xl w-[420px] border border-white/10 shadow-2xl"
            >

              <h2 className="text-lg font-semibold mb-4">
                🔍 Audit Details
              </h2>

              <div className="space-y-3 text-sm">

                <p>📅 {selected.date}</p>
                <p>⚠️ {selected.trigger}</p>
                <p>📉 Drop: {selected.drop}%</p>

                <p className="text-green-400 font-semibold">
                  ₹{selected.payout} credited
                </p>

                <div className="mt-4 space-y-2 border-t border-white/10 pt-3">
                  <p className="text-green-400">✅ Trigger Verified</p>
                  <p className="text-green-400">✅ Threshold Met</p>
                  <p className="text-green-400">✅ Fraud Check Passed</p>
                </div>

                <div className="mt-3 bg-white/5 p-3 rounded-xl text-gray-300">
                  {selected.details}
                </div>

              </div>

              <button
                onClick={() => setSelected(null)}
                className="mt-5 w-full bg-blue-600 hover:bg-blue-700 p-2 rounded-xl transition"
              >
                Close
              </button>

            </motion.div>
          </motion.div>
        )}

      </motion.div>
    </div>
  );
}