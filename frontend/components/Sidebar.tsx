"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  Receipt,
  Wallet,
  BarChart3,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Activate Coverage", href: "/coverage", icon: <ShieldCheck size={18} /> },
    { name: "Quotes", href: "/quote", icon: <Receipt size={18} /> },
    { name: "Payouts", href: "/payouts", icon: <Wallet size={18} /> },
    { name: "Admin", href: "/admin", icon: <BarChart3 size={18} /> },
  ];

  return (
    <div className="w-64 h-screen bg-[#0B0F1A] border-r border-white/10 p-6 flex flex-col">

      {/* LOGO */}
      <h1 className="text-2xl font-bold text-blue-500 mb-10">
        RiderShield
      </h1>

      {/* NAV LINKS */}
      <div className="flex flex-col gap-2">
        {links.map((link, i) => {
          const isActive = pathname === link.href;

          return (
            <Link key={i} href={link.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all
                ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.icon}
                <span className="text-sm font-medium">{link.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="mt-auto pt-6 border-t border-white/10">
        <p className="text-xs text-gray-500">
          AI-powered protection ⚡
        </p>
      </div>

    </div>
  );
}