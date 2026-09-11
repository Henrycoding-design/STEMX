import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import AiTutorAssistant from "../ai/AiTutorAssistant";

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-10 animate-in slide-in-from-left duration-200 shadow-2xl">
            <Sidebar 
              isMobile={true} 
              onCloseMobileMenu={() => setIsMobileMenuOpen(false)} 
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950/50">
          <Outlet />
        </main>
      </div>

      {/* AI STEM Tutor Assistant */}
      <AiTutorAssistant />
    </div>
  );
}
