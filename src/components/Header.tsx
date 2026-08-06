import React from 'react';
import { RegimentLogo } from './RegimentLogo';
import { User } from '../types';
import { LogOut, ShieldCheck, Database, Sun, Moon, Menu, Smartphone, Laptop } from 'lucide-react';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenDatabaseDashboard: () => void;
  onOpenSettings: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  darkMode,
  onToggleDarkMode,
  onOpenDatabaseDashboard,
  onOpenSettings,
  onToggleMobileMenu,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-emerald-950 border-b border-amber-500/30 text-white shadow-lg pt-[env(safe-area-inset-top)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Regiment Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onToggleMobileMenu && (
              <button
                id="btn-header-mobile-menu"
                onClick={onToggleMobileMenu}
                className="md:hidden p-2 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 border border-amber-500/30 min-w-[40px] min-h-[40px] flex items-center justify-center active:scale-95 transition-transform"
                title="Toggle Navigation Menu"
              >
                <Menu className="w-5 h-5 text-amber-400" />
              </button>
            )}

            <RegimentLogo size="md" showText={true} />
          </div>

          {/* Right Controls & User Info */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Database Dashboard Quick Launcher Button */}
            <button
              id="btn-database-dashboard"
              onClick={onOpenDatabaseDashboard}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-900/90 hover:bg-emerald-800 border border-amber-500/40 text-amber-300 font-medium text-xs sm:text-sm transition-all shadow-sm"
              title="Open Backend Database Dashboard"
            >
              <Database className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Database Dashboard</span>
            </button>

            {/* Platform / Device Compatibility Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-900/50 border border-emerald-700/50 text-xs text-emerald-300 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-amber-400" />
                <Laptop className="w-3 h-3 text-amber-400" />
                Android • iOS • Desktop
              </span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              id="btn-toggle-darkmode"
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 transition-colors border border-amber-500/20 min-w-[40px] min-h-[40px] flex items-center justify-center"
              title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Military Theme'}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-amber-200" />}
            </button>

            {/* User Profile Info Pill */}
            <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-emerald-800">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-500/20 border-2 border-amber-400/80 flex items-center justify-center font-bold text-amber-300 text-xs sm:text-sm shadow-inner flex-shrink-0">
                {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-sm font-semibold text-white leading-tight">
                  {user.name}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      user.role === 'Administrator'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-800 text-emerald-200 border border-emerald-600'
                    }`}
                  >
                    {user.role === 'Administrator' ? 'ADMINISTRATOR' : `HOD • ${user.department || 'DEPT'}`}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                id="btn-logout"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-950/70 hover:bg-red-900 text-red-200 hover:text-white border border-red-700/80 transition-all shadow-md active:scale-95 min-w-[40px] min-h-[40px] justify-center"
                title="Logout from System"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 group-hover:text-white" />
                <span className="hidden md:inline font-bold text-xs uppercase tracking-wider text-red-300">
                  Log Out
                </span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

