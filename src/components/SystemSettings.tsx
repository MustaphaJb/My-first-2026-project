import React, { useEffect, useState } from 'react';
import { SystemSettings } from '../types';
import { storageService } from '../services/storageService';
import { Settings, Shield, Lock, Save, Database, AlertTriangle } from 'lucide-react';

export const SystemSettingsComponent: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const data = await storageService.getSettings();
    setSettings(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    await storageService.updateSettings(settings);
    setSavedMessage('System & Security configuration updated successfully.');
    setTimeout(() => setSavedMessage(null), 3000);
  };

  if (loading || !settings) {
    return (
      <div className="p-12 text-center text-emerald-400 font-mono text-xs">
        Loading System Settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-5 rounded-xl bg-emerald-950/80 border border-amber-500/30 text-white shadow">
        <h2 className="text-xl font-extrabold uppercase tracking-wide text-white">
          System Configuration & Security Controls
        </h2>
        <p className="text-xs text-emerald-300 mt-1">
          23 Support Engineer Regiment Jos • Global Operational Parameters
        </p>
      </div>

      {savedMessage && (
        <div className="p-3 rounded-lg bg-emerald-900 border border-emerald-500 text-emerald-200 text-xs font-bold">
          {savedMessage}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Security Policy Settings */}
        <div className="p-5 rounded-xl bg-emerald-950/80 border border-emerald-800 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm border-b border-emerald-800 pb-2 uppercase">
            <Lock className="w-4 h-4" />
            <span>JWT & Authentication Security Policy</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-white">
            <div>
              <label className="block text-emerald-300 font-bold mb-1">Session Inactivity Timeout (Minutes)</label>
              <input
                type="number"
                value={settings.sessionTimeoutMinutes}
                onChange={(e) =>
                  setSettings({ ...settings, sessionTimeoutMinutes: parseInt(e.target.value, 10) || 30 })
                }
                className="w-full px-3 py-2 rounded bg-emerald-900 border border-emerald-700 font-mono"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-bold mb-1">Max Failed Login Lockout Threshold</label>
              <input
                type="number"
                value={settings.maxFailedLogins}
                onChange={(e) =>
                  setSettings({ ...settings, maxFailedLogins: parseInt(e.target.value, 10) || 5 })
                }
                className="w-full px-3 py-2 rounded bg-emerald-900 border border-emerald-700 font-mono"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-bold mb-1">Password Complexity</label>
              <select
                value={settings.passwordComplexity}
                onChange={(e) => setSettings({ ...settings, passwordComplexity: e.target.value as any })}
                className="w-full px-3 py-2 rounded bg-emerald-900 border border-emerald-700"
              >
                <option value="Standard">Standard (Min 6 chars)</option>
                <option value="High">High (Alphanumeric + Symbol)</option>
                <option value="Military Grade">Military Grade (Min 12 chars + Mixed)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs pt-2">
            <label className="flex items-center gap-2 text-emerald-300 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireMFA}
                onChange={(e) => setSettings({ ...settings, requireMFA: e.target.checked })}
                className="rounded border-emerald-700 bg-emerald-900 text-amber-500"
              />
              <span>Require Multi-Factor Authentication (MFA) for Officers</span>
            </label>

            <label className="flex items-center gap-2 text-emerald-300 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.auditLoggingEnabled}
                onChange={(e) => setSettings({ ...settings, auditLoggingEnabled: e.target.checked })}
                className="rounded border-emerald-700 bg-emerald-900 text-amber-500"
              />
              <span>Enable Immutable Security Audit Logging</span>
            </label>
          </div>
        </div>

        {/* System Meta Information */}
        <div className="p-5 rounded-xl bg-emerald-950/80 border border-emerald-800 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm border-b border-emerald-800 pb-2 uppercase">
            <Shield className="w-4 h-4" />
            <span>Regiment & System Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-white">
            <div>
              <label className="block text-emerald-300 font-bold mb-1">Regiment Title</label>
              <input
                type="text"
                value={settings.regimentName}
                onChange={(e) => setSettings({ ...settings, regimentName: e.target.value })}
                className="w-full px-3 py-2 rounded bg-emerald-900 border border-emerald-700 font-bold"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-bold mb-1">Command Location</label>
              <input
                type="text"
                value={settings.location}
                onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                className="w-full px-3 py-2 rounded bg-emerald-900 border border-emerald-700"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-bold mb-1">System Version</label>
              <input
                type="text"
                disabled
                value={settings.systemVersion}
                className="w-full px-3 py-2 rounded bg-emerald-900/40 border border-emerald-800 font-mono text-emerald-400"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            id="btn-save-system-settings"
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold uppercase text-xs shadow flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Security Configuration</span>
          </button>
        </div>

      </form>

    </div>
  );
};
