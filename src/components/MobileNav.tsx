import React from 'react';
import { User } from '../types';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileSpreadsheet,
  Menu,
  LogOut,
} from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onToggleMenu: () => void;
  user: User;
  onLogout?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onTabChange,
  onToggleMenu,
  user,
  onLogout,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-emerald-950/95 backdrop-blur-md border-t border-amber-500/30 text-emerald-100 flex items-center justify-around py-2 px-1 md:hidden shadow-2xl pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      <button
        id="btn-mobile-tab-dash"
        onClick={() => onTabChange('dashboard')}
        className={`flex flex-col items-center justify-center gap-1 min-w-[50px] min-h-[44px] text-[10px] font-medium transition-all ${
          currentTab === 'dashboard' ? 'text-amber-400 font-bold scale-105' : 'text-emerald-300/80 hover:text-white'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span>Dashboard</span>
      </button>

      <button
        id="btn-mobile-tab-roster"
        onClick={() => onTabChange('personnel')}
        className={`flex flex-col items-center justify-center gap-1 min-w-[50px] min-h-[44px] text-[10px] font-medium transition-all ${
          currentTab === 'personnel' ? 'text-amber-400 font-bold scale-105' : 'text-emerald-300/80 hover:text-white'
        }`}
      >
        <Users className="w-5 h-5" />
        <span>Roster</span>
      </button>

      {/* Primary Action Floating Button */}
      <button
        id="btn-mobile-tab-add"
        onClick={() => onTabChange('add_personnel')}
        className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-emerald-950 flex items-center justify-center shadow-lg -mt-5 border-2 border-emerald-950 active:scale-95 transition-transform"
        title="Add New Personnel Record"
      >
        <UserPlus className="w-6 h-6 stroke-[2.5]" />
      </button>

      <button
        id="btn-mobile-tab-reports"
        onClick={() => onTabChange('reports')}
        className={`flex flex-col items-center justify-center gap-1 min-w-[50px] min-h-[44px] text-[10px] font-medium transition-all ${
          currentTab === 'reports' ? 'text-amber-400 font-bold scale-105' : 'text-emerald-300/80 hover:text-white'
        }`}
      >
        <FileSpreadsheet className="w-5 h-5" />
        <span>Reports</span>
      </button>

      <button
        id="btn-mobile-tab-more"
        onClick={onToggleMenu}
        className="flex flex-col items-center justify-center gap-1 min-w-[50px] min-h-[44px] text-[10px] font-medium text-emerald-300/80 hover:text-white transition-all active:scale-95"
      >
        <Menu className="w-5 h-5 text-amber-400" />
        <span>Menu</span>
      </button>

      {onLogout && (
        <button
          id="btn-mobile-tab-logout"
          onClick={onLogout}
          className="flex flex-col items-center justify-center gap-1 min-w-[50px] min-h-[44px] text-[10px] font-bold text-red-400 hover:text-red-300 transition-all active:scale-95"
          title="Logout from System"
        >
          <LogOut className="w-5 h-5 text-red-400" />
          <span>Logout</span>
        </button>
      )}
    </nav>
  );
};
