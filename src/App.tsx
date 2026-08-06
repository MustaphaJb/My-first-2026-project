import React, { useState, useEffect } from 'react';
import { User, PersonnelRecord } from './types';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { PersonnelList } from './components/PersonnelList';
import { PersonnelProfileModal } from './components/PersonnelProfileModal';
import { PersonnelFormModal } from './components/PersonnelFormModal';
import { HODUserManagement } from './components/HODUserManagement';
import { ReportsModule } from './components/ReportsModule';
import { DatabaseDashboard } from './components/DatabaseDashboard';
import { AuditLogsModal } from './components/AuditLogsModal';
import { SystemSettingsComponent } from './components/SystemSettings';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  // Modals
  const [selectedPersonnel, setSelectedPersonnel] = useState<PersonnelRecord | null>(null);
  const [personnelToEdit, setPersonnelToEdit] = useState<PersonnelRecord | null>(null);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);

  useEffect(() => {
    // Check active session on boot
    const active = storageService.getCurrentUser();
    if (active) {
      setUser(active);
    }
  }, []);

  const handleLogin = async (email: string, pass: string): Promise<boolean> => {
    const res = await storageService.login(email, pass);
    if (res.success && res.user) {
      setUser(res.user);
      setCurrentTab('dashboard');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    storageService.logout();
    setUser(null);
  };

  const handleTabSelect = (tab: string) => {
    setCurrentTab(tab);
    setMobileDrawerOpen(false);
    if (tab === 'add_personnel') {
      setPersonnelToEdit(null);
      setShowFormModal(true);
    }
  };

  if (!user) {
    return (
      <LandingPage
        onLoginSuccess={handleLogin}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-900 text-white'} flex flex-col font-sans relative`}>
      
      {/* Header Bar */}
      <Header
        user={user}
        onLogout={handleLogout}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenDatabaseDashboard={() => handleTabSelect('database')}
        onOpenSettings={() => handleTabSelect('settings')}
        onToggleMobileMenu={() => setMobileDrawerOpen(!mobileDrawerOpen)}
      />

      {/* Main Body Layout (Sidebar + Content Canvas) */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Desktop Sidebar Navigation */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={handleTabSelect}
          user={user}
          onLogout={handleLogout}
        />

        {/* Content Workspace Area */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden pb-24 md:pb-8">
          
          {currentTab === 'dashboard' && (
            <Dashboard
              user={user}
              onNavigate={(tab) => {
                if (tab === 'add_personnel') {
                  setPersonnelToEdit(null);
                  setShowFormModal(true);
                } else {
                  handleTabSelect(tab);
                }
              }}
            />
          )}

          {currentTab === 'personnel' && (
            <PersonnelList
              user={user}
              onSelectPersonnel={(p) => setSelectedPersonnel(p)}
              onEditPersonnel={(p) => {
                setPersonnelToEdit(p);
                setShowFormModal(true);
              }}
              onAddNew={() => {
                setPersonnelToEdit(null);
                setShowFormModal(true);
              }}
            />
          )}

          {currentTab === 'reports' && <ReportsModule />}

          {currentTab === 'database' && <DatabaseDashboard />}

          {currentTab === 'hod_management' && user.role === 'Administrator' && (
            <HODUserManagement currentUser={user} />
          )}

          {currentTab === 'audit_logs' && user.role === 'Administrator' && <AuditLogsModal />}

          {currentTab === 'settings' && user.role === 'Administrator' && <SystemSettingsComponent />}

        </main>
      </div>

      {/* Mobile Touch Bottom Navigation Bar (Android & iOS) */}
      <MobileNav
        currentTab={currentTab}
        onTabChange={handleTabSelect}
        onToggleMenu={() => setMobileDrawerOpen(!mobileDrawerOpen)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Mobile Slide-Over Navigation Drawer (Android & iOS) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Slide-out Drawer Panel */}
          <div className="relative z-10 w-4/5 max-w-xs h-full bg-emerald-950 shadow-2xl">
            <Sidebar
              currentTab={currentTab}
              onTabChange={handleTabSelect}
              user={user}
              isMobileDrawer={true}
              onCloseDrawer={() => setMobileDrawerOpen(false)}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}

      {/* Profile Detail View Modal */}
      {selectedPersonnel && (
        <PersonnelProfileModal
          personnel={selectedPersonnel}
          user={user}
          onClose={() => setSelectedPersonnel(null)}
          onEdit={() => {
            setPersonnelToEdit(selectedPersonnel);
            setSelectedPersonnel(null);
            setShowFormModal(true);
          }}
          onReload={async () => {
            const list = await storageService.getPersonnel({ search: selectedPersonnel.serviceNumber });
            if (list.data.length > 0) {
              setSelectedPersonnel(list.data[0]);
            }
          }}
        />
      )}

      {/* Create / Edit Personnel Modal */}
      {showFormModal && (
        <PersonnelFormModal
          personnelToEdit={personnelToEdit}
          onClose={() => {
            setShowFormModal(false);
            setPersonnelToEdit(null);
          }}
          onSuccess={() => {
            setShowFormModal(false);
            setPersonnelToEdit(null);
            if (currentTab !== 'personnel') {
              setCurrentTab('personnel');
            }
          }}
        />
      )}

    </div>
  );
}

export default App;

