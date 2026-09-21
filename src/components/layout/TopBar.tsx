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
    <header className="app-topbar h-16 backdrop-blur-xl border-b flex items-center justify-between px-4 sm:px-6 shrink-0 z-20 sticky top-0">
      <div className="flex items-center space-x-3">
        <button 
          onClick={onOpenMobileMenu}
          className="md:hidden text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Curriculum Standard Badge */}
        <div className="hidden sm:flex items-center space-x-2 bg-slate-950/65 border border-slate-800/80 rounded-lg px-3 py-1.5 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-200">
            {language === "VN" ? "Vật lí 10 • GDPT 2018" : "Physics 10 • 2018 Curriculum"}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-indigo-400 font-mono text-[11px]">KNTT & CTST</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Language Switcher */}
        <div className="flex items-center space-x-1 bg-slate-950/70 border border-slate-800 rounded-lg p-1">
          <Globe className="w-3.5 h-3.5 text-slate-500 ml-1 mr-1 hidden sm:block" />
          {(["VN", "ENG"] as Language[]).map(lang => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded transition-colors ${
                language === lang 
                  ? "bg-indigo-600 text-white" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {lang === "VN" ? "Tiếng Việt" : "English"}
            </button>
          ))}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-slate-400 hover:text-slate-100 p-2 rounded-lg hover:bg-slate-800 relative transition-colors"
            aria-label={language === "VN" ? "Mở thông báo" : "Open notifications"}
            aria-expanded={showNotifications}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border border-slate-900"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-slate-900/98 backdrop-blur-xl border border-slate-700/80 rounded-xl p-3 shadow-2xl z-50 text-xs space-y-2">
              <div className="font-bold text-white border-b border-slate-800 pb-2">
                {language === "VN" ? "Chương trình Vật lí 10" : "Grade 10 Physics"}
              </div>
              <div className="text-slate-300 flex items-start space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {language === "VN" 
                    ? "Đối chiếu chuẩn SGK Kết nối tri thức (KNTT) & Chân trời sáng tạo (CTST)." 
                    : "Aligned with KNTT and CTST national high school textbooks."}
                </span>
              </div>
              <div className="text-slate-400 text-[10px] pt-1">
                {language === "VN" ? "Tất cả mô phỏng & câu hỏi kiểm tra đã được cập nhật." : "All simulations and concept checks are synchronized."}
              </div>
            </div>
          )}
        </div>
        
        {/* User Info */}
        <div className="flex items-center space-x-2.5 border-l border-slate-800 pl-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-slate-200">{user.name}</div>
            <div className="text-[10px] text-indigo-400 font-mono">{user.grade}</div>
          </div>
          <div className="brand-mark w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
