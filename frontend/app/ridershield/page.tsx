"use client";

import { useRouter } from "next/navigation";
import { CloudRain, Car, WifiOff, AlertTriangle, Wind } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  return (
    <main className="bg-[#0B0F1A] text-white min-h-screen overflow-hidden">

      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-28">

        {/* Background Glow */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-blue-600/20 via-transparent to-green-500/10 blur-3xl"></div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold leading-tight max-w-4xl"
        >
          Protect Your Daily Earnings.
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
            {" "}Automatically.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 mt-6 max-w-xl text-lg"
        >
          AI-powered income protection for gig workers. Get paid instantly when
          disruptions reduce your earnings.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex gap-4"
        >
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 px-8 py-3 rounded-xl font-medium shadow-lg transition-all hover:scale-[1.05] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]"
          >
            Get Started
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="border border-gray-600 px-8 py-3 rounded-xl hover:border-white hover:scale-[1.05] transition"
          >
            View Demo
          </button>
        </motion.div>

        <p className="text-sm text-gray-500 mt-6">
          ⚡ Automated • Transparent • No Claims Needed
        </p>

        {/* 🔥 PRODUCT PREVIEW (BIG IMPACT) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 w-full max-w-4xl"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl">

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white/10 p-4 rounded-xl">₹950 Earnings</div>
              <div className="bg-green-500/20 p-4 rounded-xl">Coverage Active</div>
              <div className="bg-yellow-500/20 p-4 rounded-xl">Risk Medium</div>
            </div>

            <div className="grid grid-cols-4 gap-3 text-sm">
              <div className="bg-red-500/20 p-3 rounded-xl">🌧️ Rain High</div>
              <div className="bg-yellow-500/20 p-3 rounded-xl">🚗 Traffic</div>
              <div className="bg-green-500/20 p-3 rounded-xl">🌫️ AQI</div>
              <div className="bg-green-500/20 p-3 rounded-xl">📡 Stable</div>
            </div>

          </div>
        </motion.div>

      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 md:px-16 py-20">
        <h2 className="text-3xl font-semibold mb-12 text-center">
          How RiderShield Works
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            "Activate weekly coverage",
            "AI monitors real-time risks",
            "Receive automatic payouts",
          ].map((step, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl"
            >
              <div className="text-blue-400 font-semibold mb-2">
                Step {i + 1}
              </div>
              <p className="text-gray-300">{step}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* RISKS */}
      <section className="px-6 md:px-16 py-20">
        <h2 className="text-3xl font-semibold mb-12 text-center">
          Covered Disruptions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            { icon: <CloudRain />, label: "Rain" },
            { icon: <Car />, label: "Traffic" },
            { icon: <Wind />, label: "AQI" },
            { icon: <WifiOff />, label: "Outages" },
            { icon: <AlertTriangle />, label: "Civic" },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="text-blue-400">{item.icon}</div>
              <p className="text-gray-300">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="text-center py-20 px-6">
        <h2 className="text-3xl font-bold mb-4">
          Start Protecting Your Income Today
        </h2>

        <button
          onClick={() => router.push("/coverage")}
          className="bg-green-500 px-8 py-3 rounded-xl font-medium shadow-lg hover:scale-[1.05] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] transition"
        >
          Activate Coverage
        </button>
      </section>

    </main>
  );
}