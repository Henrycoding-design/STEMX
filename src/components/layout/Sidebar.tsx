import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Beaker, BookOpen, TrendingUp, Atom, X, NotebookPen } from "lucide-react";
import { cn } from "../../utils";
import { useAppProgress } from "../../context/AppContext";

interface SidebarProps {
  onCloseMobileMenu?: () => void;
  isMobile?: boolean;
}

export default function Sidebar({ onCloseMobileMenu, isMobile }: SidebarProps) {
  const { t, user, language } = useAppProgress();

  const navItems = [
    { icon: LayoutDashboard, label: t("dashboard"), path: "/dashboard" },
    { icon: Beaker, label: t("simulations"), path: "/simulations" },
    { icon: BookOpen, label: t("curriculum"), path: "/curriculum" },
    { icon: NotebookPen, label: language === "VN" ? "Lý thuyết & Ghi chú" : "Theory & Notes", path: "/theory" },
    { icon: TrendingUp, label: t("progress"), path: "/progress" },
  ];

  return (
    <div
      className={cn(
        "app-sidebar border-r flex flex-col shrink-0 h-full",
        isMobile ? "w-72" : "w-64 hidden md:flex"
      )}
    >
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80">
        <div className="flex items-center">
          <div className="brand-mark w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center mr-2.5">
            <Atom className="w-4 h-4 text-white" />
          </div>
          <span className="brand-lockup font-bold text-lg text-white">STEMX</span>
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

      <div className="px-5 py-3.5 border-b border-slate-800/60 bg-slate-950/35">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {t("system")}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
            KNTT
          </span>
          <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            CTST
          </span>
        </div>
      </div>

      <nav className="flex-1 py-5 px-3.5 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => {
              if (onCloseMobileMenu) onCloseMobileMenu();
            }}
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200",
                isActive
                  ? "bg-indigo-500/12 text-indigo-300 border border-indigo-500/25 shadow-sm shadow-indigo-950/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/45"
              )
            }
          >
            <item.icon className="w-5 h-5 mr-3 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800/80">
        <div className="text-xs text-slate-500 text-center">
          Vật lí 10 • KNTT & CTST
        </div>
      </div>
    </div>
  );
}
