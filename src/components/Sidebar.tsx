import React from 'react';
import { User } from '../types';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  UserCheck,
  FileSpreadsheet,
  Database,
  ShieldAlert,
  Settings,
  Shield,
  X,
  Smartphone,
  Laptop,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  user: User;
  onCloseDrawer?: () => void;
  isMobileDrawer?: boolean;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  user,
  onCloseDrawer,
  isMobileDrawer = false,
  onLogout,
}) => {
  const isAdmin = user.role === 'Administrator';

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Analytics',
      icon: LayoutDashboard,
      adminOnly: false,
    },
    {
      id: 'personnel',
      label: 'Personnel Database',
      icon: Users,
      adminOnly: false,
    },
    {
      id: 'add_personnel',
      label: 'New Personnel Record',
      icon: UserPlus,
      adminOnly: false,
    },
    {
      id: 'reports',
      label: 'Reports & Export',
      icon: FileSpreadsheet,
      adminOnly: false,
    },
    {
      id: 'database',
      label: 'Database Dashboard',
      icon: Database,
      adminOnly: false,
      badge: 'SQL & Tables',
    },
    {
      id: 'hod_management',
      label: 'HOD & User Accounts',
      icon: UserCheck,
      adminOnly: true,
    },
    {
      id: 'audit_logs',
      label: 'Audit & Security Logs',
      icon: ShieldAlert,
      adminOnly: true,
    },
    {
      id: 'settings',
      label: 'System Settings',
      icon: Settings,
      adminOnly: true,
    },
  ];

  const handleSelectTab = (tabId: string) => {
    onTabChange(tabId);
    if (onCloseDrawer) {
      onCloseDrawer();
    }
  };

  return (
    <aside
      className={`${
        isMobileDrawer
          ? 'w-full max-w-xs h-full bg-emerald-950 text-emerald-100 flex flex-col'
          : 'hidden md:flex w-64 bg-emerald-950/90 border-r border-amber-500/20 text-emerald-100 flex-col flex-shrink-0 min-h-[calc(100vh-5rem)]'
      }`}
    >
      {/* Regiment Banner Subtitle / Drawer Header */}
      <div className="p-4 border-b border-emerald-900 bg-emerald-900/40 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-widest font-semibold">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Regiment System</span>
          </div>
          <p className="text-xs text-emerald-300/80 mt-1 font-sans">
            {isAdmin ? 'Full Access Security Domain' : `Department Domain: ${user.department || 'HOD'}`}
          </p>
        </div>

        {isMobileDrawer && onCloseDrawer && (
          <button
            onClick={onCloseDrawer}
            className="p-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 min-w-[36px] min-h-[36px] flex items-center justify-center"
            title="Close Menu Drawer"
          >
            <X className="w-5 h-5 text-amber-400" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null;

          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => handleSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all min-h-[44px] active:scale-98 ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm font-semibold'
                  : 'text-emerald-200/90 hover:bg-emerald-900/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-amber-400' : 'text-emerald-400 group-hover:text-amber-300'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] bg-amber-500/30 text-amber-200 px-1.5 py-0.5 rounded font-mono">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Dedicated Logout Action Button inside Navigation */}
        {onLogout && (
          <div className="pt-3 mt-3 border-t border-emerald-900/80">
            <button
              id="btn-sidebar-logout"
              onClick={() => {
                if (onCloseDrawer) onCloseDrawer();
                onLogout();
              }}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold text-red-300 hover:text-white bg-red-950/40 hover:bg-red-900/80 border border-red-800/60 transition-all min-h-[44px] active:scale-98 shadow-sm"
              title="Sign Out of 23 SER System"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4 text-red-400" />
                <span>Sign Out / Logout</span>
              </div>
              <span className="text-[10px] font-mono bg-red-950 text-red-400 px-2 py-0.5 rounded border border-red-800">
                EXIT
              </span>
            </button>
          </div>
        )}
      </nav>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-emerald-900 bg-emerald-950/80 text-xs text-emerald-400/80 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span>CLASSIFIED</span>
          <span className="text-amber-400 font-bold">23 SER JOS</span>
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-emerald-900/60 text-[10px] text-emerald-400">
          <span className="flex items-center gap-1">
            <Smartphone className="w-3 h-3 text-amber-400" />
            <Laptop className="w-3 h-3 text-amber-400" />
            Cross-Platform Ready
          </span>
          <span className="font-mono text-amber-300">v1.0</span>
        </div>
      </div>
    </aside>
  );
};

