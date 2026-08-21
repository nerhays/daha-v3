"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wrench, FileText } from "lucide-react";
import AdminLogout from "./AdminLogout";
const menus = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Layanan",
    href: "/admin/under-construction",
    icon: Wrench,
  },
  {
    label: "Artikel",
    href: "/admin/articles",
    icon: FileText,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-slate-200 px-6">
        <div>
          <h1 className="text-xl font-bold text-[#0F4C81]">DAHA CMS</h1>

          <p className="text-xs text-slate-400">Content Management System</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-1 p-4">
        {menus.map((menu) => {
          const Icon = menu.icon;

          const active = menu.href === "/admin" ? pathname === "/admin" : pathname.startsWith(menu.href);

          return (
            <Link key={menu.href} href={menu.href} className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${active ? "bg-[#0F4C81] text-white" : "text-slate-600 hover:bg-slate-100 hover:text-[#0F4C81]"}`}>
              <Icon size={19} />

              <span>{menu.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-4">
        <div className="mb-3 rounded-lg bg-slate-50 px-4 py-3">
          <p className="text-xs text-slate-400">Admin Panel</p>

          <p className="text-sm font-semibold text-slate-700">Daha Borepile</p>
        </div>

        <AdminLogout />
      </div>
    </aside>
  );
}
