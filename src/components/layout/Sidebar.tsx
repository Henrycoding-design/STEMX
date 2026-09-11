import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Beaker, BookOpen, TrendingUp, Atom, X, Database } from "lucide-react";
import { cn } from "../../utils";
import { useAppProgress } from "../../context/AppContext";

interface SidebarProps {
  onCloseMobileMenu?: () => void;
  isMobile?: boolean;
}

export default function Sidebar({ onCloseMobileMenu, isMobile }: SidebarProps) {
  const { t, user } = useAppProgress();

  const navItems = [
    { icon: LayoutDashboard, label: t("dashboard"), path: "/dashboard" },
    { icon: Beaker, label: t("simulations"), path: "/simulations" },
    { icon: BookOpen, label: t("curriculum"), path: "/curriculum" },
    { icon: TrendingUp, label: t("progress"), path: "/progress" },
  ];

  return (
    <div
      className={cn(
        "bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 h-full",
        isMobile ? "w-72" : "w-64 hidden md:flex"
      )}
    >
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
        <div className="flex items-center">
          <Atom className="w-6 h-6 text-indigo-400 mr-2" />
          <span className="font-bold text-lg tracking-tight text-white">STEM Engine</span>
        </div>
        {isMobile && onCloseMobileMenu && (
          <button
            onClick={onCloseMobileMenu}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="px-6 py-3 border-b border-slate-800/60 bg-slate-950/40">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Curricula Benchmarks</div>
        <div className="flex space-x-1.5 mt-1">
          <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
            Cambridge
          </span>
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            AP
          </span>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => {
              if (onCloseMobileMenu) onCloseMobileMenu();
            }}
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
                isActive
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
              )
            }
          >
            <item.icon className="w-5 h-5 mr-3 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="bg-slate-950/60 border border-slate-800/60 p-3 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-slate-300 font-medium">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Persistence</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
            SYNCED
          </span>
        </div>

        <div className="bg-slate-800/40 p-3 rounded-xl">
          <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
            {t("offline_ready")}
          </div>
          <div className="text-[11px] text-slate-400">{t("offline_desc")}</div>
        </div>
      </div>
    </div>
  );
}
