"use client";

import { useRouter } from "next/navigation";
import {
  MapPin,
  Search,
  User,
  ShoppingCart,
  CloudRain,
  Car,
  Shield,
} from "lucide-react";

export default function RiderDashboard() {
  const router = useRouter();

  return (
    <main className="bg-[#F8F8F8] min-h-screen text-black">

      {/* 🔥 NAVBAR (BLINKIT STYLE) */}
      <div className="bg-white px-6 py-4 flex items-center justify-between shadow-sm">

        <h1 className="text-2xl font-bold text-yellow-500">
          blinkit
        </h1>

        <div className="flex items-center gap-2 text-sm">
          <MapPin size={16} />
          Chennai
        </div>

        <div className="flex items-center bg-gray-100 px-4 py-2 rounded-xl w-[40%]">
          <Search size={16} />
          <input
            placeholder="Search deliveries..."
            className="bg-transparent outline-none ml-2 w-full"
          />
        </div>

        <div className="flex gap-6">
          <User />
          <ShoppingCart />
        </div>

      </div>

      {/* 🔥 CATEGORY BAR */}
      <div className="bg-white px-6 py-3 flex gap-6 text-sm border-b">

        <button className="font-semibold border-b-2 border-black pb-1">
          Dashboard
        </button>

        <button>Orders</button>
        <button>Earnings</button>

        {/* ⭐ INSURANCE TAB */}
        <button
          onClick={() => router.push("/ridershield")}
          className="text-blue-600 font-semibold"
        >
          RiderShield
        </button>

      </div>

      {/* 🔥 MAIN CONTENT */}
      <div className="px-6 py-6 space-y-6">

        {/* 💰 EARNINGS BANNER */}
        <div className="bg-gradient-to-r from-yellow-400 to-green-400 rounded-3xl p-6 flex justify-between items-center">

          <div>
            <h2 className="text-2xl font-bold">
              ₹1,240 earned today
            </h2>
            <p className="text-sm mt-1">
              18 deliveries • 7 hours online
            </p>
          </div>

          <div className="text-right text-sm">
            <p>Zone</p>
            <p className="font-semibold">OMR</p>
          </div>

        </div>

        {/* 📊 STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Deliveries</p>
            <h2 className="text-xl font-bold">18</h2>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Earnings</p>
            <h2 className="text-xl font-bold">₹1240</h2>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Hours</p>
            <h2 className="text-xl font-bold">7h</h2>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Rating</p>
            <h2 className="text-xl font-bold">4.8 ⭐</h2>
          </div>

        </div>

        {/* 🌧 LIVE CONDITIONS */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">

          <h2 className="font-semibold mb-4">
            Live Delivery Conditions
          </h2>

          <div className="flex gap-6">

            <div className="flex items-center gap-3">
              <CloudRain className="text-blue-500" />
              <div>
                <p className="text-sm font-medium">Rain</p>
                <p className="text-xs text-red-500">
                  Heavy impact
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Car className="text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Traffic</p>
                <p className="text-xs text-yellow-500">
                  Moderate
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* 📦 RECENT DELIVERIES */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">

          <h2 className="font-semibold mb-4">
            Recent Deliveries
          </h2>

          <div className="space-y-3">

            {[
              { place: "Adyar", amount: 80 },
              { place: "Perungudi", amount: 90 },
              { place: "Thoraipakkam", amount: 60 },
            ].map((d, i) => (
              <div
                key={i}
                className="flex justify-between border-b pb-2"
              >
                <span>{d.place}</span>
                <span className="text-green-600 font-medium">
                  ₹{d.amount}
                </span>
              </div>
            ))}

          </div>

        </div>

        {/* 🛡 INSURANCE CARD */}
        <div className="bg-blue-100 p-6 rounded-2xl flex justify-between items-center">

          <div>
            <h2 className="font-semibold">
              Insurance for Riders 🚀
            </h2>
            <p className="text-sm mt-1">
              Rain may reduce your income today
            </p>
          </div>

          <button
            onClick={() => router.push("/ridershield")}
            className="bg-black text-white px-4 py-2 rounded-xl"
          >
            Explore
          </button>

        </div>

      </div>

    </main>
  );
}