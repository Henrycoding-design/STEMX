import React, { useState } from "react";
import { Search, Bell, Menu, Globe, User, Check } from "lucide-react";
import { useAppProgress } from "../../context/AppContext";
import { Language } from "../../types";

interface TopBarProps {
  onOpenMobileMenu?: () => void;
}

export default function TopBar({ onOpenMobileMenu }: TopBarProps) {
  const { language, setLanguage, user, t } = useAppProgress();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0 z-20 sticky top-0">
      <div className="flex items-center">
        <button 
          onClick={onOpenMobileMenu}
          className="md:hidden text-slate-400 hover:text-slate-100 mr-3 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder={t("search_placeholder")} 
            className="bg-slate-950 border border-slate-800 text-xs rounded-full pl-9 pr-4 py-1.5 focus:outline-none focus:border-indigo-500 text-slate-300 w-56 lg:w-64 transition-colors"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Language Switcher */}
        <div className="flex items-center space-x-1 bg-slate-950 border border-slate-800 rounded-lg p-1">
          <Globe className="w-3.5 h-3.5 text-slate-500 ml-1 mr-1 hidden sm:block" />
          {(["ENG", "VN", "FR"] as Language[]).map(lang => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`text-[11px] font-semibold px-2 py-1 rounded transition-colors ${
                language === lang 
                  ? "bg-indigo-600 text-white" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-slate-400 hover:text-slate-100 p-2 rounded-lg hover:bg-slate-800 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border border-slate-900"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-xl z-50 text-xs space-y-2">
              <div className="font-bold text-white border-b border-slate-800 pb-2">Academic System</div>
              <div className="text-slate-300 flex items-start space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Cambridge 0625 &amp; AP Physics 1 benchmark mapping active.</span>
              </div>
              <div className="text-slate-400 text-[10px] pt-1">All simulations updated for Newton, Arrhenius, and Calculus.</div>
            </div>
          )}
        </div>
        
        {/* User Info */}
        <div className="flex items-center space-x-2.5 border-l border-slate-800 pl-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-slate-200">{user.name}</div>
            <div className="text-[10px] text-indigo-400 font-mono">{user.grade}</div>
          </div>
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
