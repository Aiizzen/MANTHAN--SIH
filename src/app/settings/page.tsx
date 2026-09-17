'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Settings, User, Bell, Shield, Database, Save, ChevronRight, Mail, MapPin, Sliders, Eye, Trash2, CheckCircle2,  } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface SettingsSection {
  id: string;
  label: string;
  icon: React.ElementType;
}

const SECTIONS: SettingsSection[] = [
  { id: 'profile', label: 'Operator Profile', icon: User },
  { id: 'detection', label: 'Detection Thresholds', icon: Sliders },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'display', label: 'Display & Map', icon: Eye },
  { id: 'data', label: 'Data & Export', icon: Database },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    name: 'M. Okafor',
    email: 'mokafor@sonarshield.io',
    role: 'Survey Operator',
    organisation: 'Pacific Marine Survey Ltd',
    location: 'Sydney, NSW, Australia',
  });

  // Detection thresholds
  const [thresholds, setThresholds] = useState({
    minConfidence: 45,
    autoConfirmAbove: 90,
    flagForReviewBelow: 70,
    maxContactsPerSurvey: 50,
  });

  // Notifications
  const [notifications, setNotifications] = useState({
    emailOnComplete: true,
    emailOnHighConfidence: true,
    emailOnError: true,
    browserNotifications: false,
    dailyDigest: false,
  });

  // Display
  const [display, setDisplay] = useState({
    defaultMapZoom: 12,
    showCoordinates: true,
    showBoundingBoxes: true,
    compactCards: false,
    defaultSortBy: 'confidence_desc',
  });

  // Data
  const [data, setData] = useState({
    exportFormat: 'csv',
    includeImages: false,
    retentionDays: 365,
    autoExportConfirmed: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-[16px] font-bold text-foreground mb-1">Operator Profile</h2>
              <p className="text-[13px] text-muted-foreground">Your personal and organisational details.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', key: 'name', type: 'text', icon: User },
                { label: 'Email Address', key: 'email', type: 'email', icon: Mail },
                { label: 'Role', key: 'role', type: 'text', icon: Shield },
                { label: 'Organisation', key: 'organisation', type: 'text', icon: Database },
                { label: 'Location', key: 'location', type: 'text', icon: MapPin },
              ].map(({ label, key, type, icon: Icon }) => (
                <div key={key} className={key === 'location' ? 'sm:col-span-2' : ''}>
                  <label className="block text-[12px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                    {label}
                  </label>
                  <div className="relative">
                    <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={type}
                      value={profile[key as keyof typeof profile]}
                      onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 text-[13px] bg-muted border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-150"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'detection':
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-[16px] font-bold text-foreground mb-1">Detection Thresholds</h2>
              <p className="text-[13px] text-muted-foreground">Configure confidence score thresholds for automated pipeline decisions.</p>
            </div>
            <div className="space-y-6">
              {[
                {
                  label: 'Minimum Confidence to Display',
                  key: 'minConfidence',
                  min: 0, max: 100,
                  description: 'Contacts below this confidence score will be hidden from results.',
                  color: 'text-red-500',
                },
                {
                  label: 'Auto-Confirm Threshold',
                  key: 'autoConfirmAbove',
                  min: 50, max: 100,
                  description: 'Contacts above this score are highlighted for fast confirmation.',
                  color: 'text-green-600',
                },
                {
                  label: 'Flag for Review Below',
                  key: 'flagForReviewBelow',
                  min: 0, max: 100,
                  description: 'Contacts below this score are automatically flagged for manual review.',
                  color: 'text-amber-600',
                },
                {
                  label: 'Max Contacts per Survey',
                  key: 'maxContactsPerSurvey',
                  min: 5, max: 200,
                  description: 'Maximum number of contacts to surface per survey report.',
                  color: 'text-primary',
                },
              ].map(({ label, key, min, max, description, color }) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[13px] font-semibold text-foreground">{label}</label>
                    <span className={`text-[14px] font-bold tabular-nums ${color}`}>
                      {thresholds[key as keyof typeof thresholds]}{key !== 'maxContactsPerSurvey' ? '%' : ''}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={thresholds[key as keyof typeof thresholds]}
                    onChange={(e) => setThresholds({ ...thresholds, [key]: Number(e.target.value) })}
                    className="w-full h-2 rounded-full appearance-none bg-muted accent-primary cursor-pointer"
                  />
                  <p className="text-[12px] text-muted-foreground mt-1">{description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-[16px] font-bold text-foreground mb-1">Notifications</h2>
              <p className="text-[13px] text-muted-foreground">Control when and how you receive alerts.</p>
            </div>
            <div className="space-y-3">
              {[
                { key: 'emailOnComplete', label: 'Email when survey processing completes', description: 'Receive an email once the full pipeline finishes.' },
                { key: 'emailOnHighConfidence', label: 'Email on high-confidence hazard detected', description: 'Immediate alert when a contact exceeds the auto-confirm threshold.' },
                { key: 'emailOnError', label: 'Email on pipeline error', description: 'Get notified if a survey fails to process.' },
                { key: 'browserNotifications', label: 'Browser push notifications', description: 'Show desktop notifications while the app is open.' },
                { key: 'dailyDigest', label: 'Daily summary digest', description: 'Receive a morning summary of pending reviews and new detections.' },
              ].map(({ key, label, description }) => (
                <div
                  key={key}
                  className="flex items-start justify-between gap-4 p-4 bg-muted rounded-xl border border-border"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-foreground">{label}</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{description}</p>
                  </div>
                  <button
                    suppressHydrationWarning
                    onClick={() => setNotifications({ ...notifications, [key]: !notifications[key as keyof typeof notifications] })}
                    className={`relative flex-shrink-0 w-10 h-5.5 rounded-full transition-colors duration-200 focus:outline-none ${
                      notifications[key as keyof typeof notifications] ? 'bg-primary' : 'bg-border'
                    }`}
                    style={{ height: 22, width: 40 }}
                    aria-label={label}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform duration-200 ${
                        notifications[key as keyof typeof notifications] ? 'translate-x-[18px]' : 'translate-x-0'
                      }`}
                      style={{ width: 18, height: 18 }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'display':
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-[16px] font-bold text-foreground mb-1">Display & Map</h2>
              <p className="text-[13px] text-muted-foreground">Customise how survey data and maps are presented.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                  Default Map Zoom Level
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={8}
                    max={18}
                    value={display.defaultMapZoom}
                    onChange={(e) => setDisplay({ ...display, defaultMapZoom: Number(e.target.value) })}
                    className="flex-1 h-2 rounded-full appearance-none bg-muted accent-primary cursor-pointer"
                  />
                  <span className="text-[14px] font-bold text-primary tabular-nums w-6 text-right">{display.defaultMapZoom}</span>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                  Default Sort Order
                </label>
                <select
                  value={display.defaultSortBy}
                  onChange={(e) => setDisplay({ ...display, defaultSortBy: e.target.value })}
                  className="w-full px-3 py-2.5 text-[13px] bg-muted border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-150"
                >
                  <option value="confidence_desc">Confidence: High → Low</option>
                  <option value="confidence_asc">Confidence: Low → High</option>
                  <option value="date_desc">Date: Newest First</option>
                  <option value="date_asc">Date: Oldest First</option>
                </select>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'showCoordinates', label: 'Show coordinates on detection cards' },
                  { key: 'showBoundingBoxes', label: 'Show bounding boxes on thumbnails' },
                  { key: 'compactCards', label: 'Use compact detection card layout' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border">
                    <p className="text-[13px] font-semibold text-foreground">{label}</p>
                    <button
                      suppressHydrationWarning
                      onClick={() => setDisplay({ ...display, [key]: !display[key as keyof typeof display] })}
                      className={`relative flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none ${
                        display[key as keyof typeof display] ? 'bg-primary' : 'bg-border'
                      }`}
                      style={{ height: 22, width: 40 }}
                      aria-label={label}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 bg-white rounded-full shadow transition-transform duration-200 ${
                          display[key as keyof typeof display] ? 'translate-x-[18px]' : 'translate-x-0'
                        }`}
                        style={{ width: 18, height: 18 }}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-[16px] font-bold text-foreground mb-1">Data & Export</h2>
              <p className="text-[13px] text-muted-foreground">Configure default export formats and data retention policies.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                  Default Export Format
                </label>
                <div className="flex gap-3">
                  {['csv', 'json', 'geojson'].map((fmt) => (
                    <button
                      key={fmt}
                      suppressHydrationWarning
                      onClick={() => setData({ ...data, exportFormat: fmt })}
                      className={`flex-1 py-2.5 rounded-lg text-[13px] font-semibold border transition-all duration-150 uppercase ${
                        data.exportFormat === fmt
                          ? 'bg-primary text-white border-primary' :'bg-muted text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                  Data Retention Period
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={30}
                    max={730}
                    step={30}
                    value={data.retentionDays}
                    onChange={(e) => setData({ ...data, retentionDays: Number(e.target.value) })}
                    className="flex-1 h-2 rounded-full appearance-none bg-muted accent-primary cursor-pointer"
                  />
                  <span className="text-[13px] font-bold text-primary tabular-nums whitespace-nowrap">
                    {data.retentionDays >= 365 ? `${Math.round(data.retentionDays / 365)}yr` : `${data.retentionDays}d`}
                  </span>
                </div>
                <p className="text-[12px] text-muted-foreground mt-1">Survey data older than this period will be archived.</p>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'includeImages', label: 'Include sonar thumbnails in exports', description: 'Embeds base64 image data — increases file size significantly.' },
                  { key: 'autoExportConfirmed', label: 'Auto-export confirmed contacts', description: 'Automatically generate an export file when contacts are confirmed.' },
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-start justify-between gap-4 p-4 bg-muted rounded-xl border border-border">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-foreground">{label}</p>
                      <p className="text-[12px] text-muted-foreground mt-0.5">{description}</p>
                    </div>
                    <button
                      suppressHydrationWarning
                      onClick={() => setData({ ...data, [key]: !data[key as keyof typeof data] })}
                      className={`relative flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none ${
                        data[key as keyof typeof data] ? 'bg-primary' : 'bg-border'
                      }`}
                      style={{ height: 22, width: 40 }}
                      aria-label={label}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 bg-white rounded-full shadow transition-transform duration-200 ${
                          data[key as keyof typeof data] ? 'translate-x-[18px]' : 'translate-x-0'
                        }`}
                        style={{ width: 18, height: 18 }}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">Danger Zone</p>
                <button
                  suppressHydrationWarning
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition-all duration-150"
                >
                  <Trash2 size={14} />
                  Clear All Survey Data
                </button>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-[16px] font-bold text-foreground mb-1">Security</h2>
              <p className="text-[13px] text-muted-foreground">Manage authentication and access control settings.</p>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-xl border border-border">
                <p className="text-[13px] font-semibold text-foreground mb-1">Change Password</p>
                <p className="text-[12px] text-muted-foreground mb-3">Update your account password. You will be signed out of all other sessions.</p>
                <div className="space-y-3">
                  {['Current Password', 'New Password', 'Confirm New Password'].map((label) => (
                    <div key={label}>
                      <label className="block text-[12px] font-semibold text-muted-foreground mb-1">{label}</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-3 py-2.5 text-[13px] bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-150"
                      />
                    </div>
                  ))}
                  <button
                    suppressHydrationWarning
                    className="px-4 py-2.5 rounded-lg text-[13px] font-semibold bg-primary text-white hover:bg-primary/90 transition-all duration-150"
                  >
                    Update Password
                  </button>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-xl border border-border">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">Two-Factor Authentication</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">Add an extra layer of security to your account.</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex-shrink-0">
                    Not Enabled
                  </span>
                </div>
                <button
                  suppressHydrationWarning
                  className="mt-3 px-4 py-2 rounded-lg text-[13px] font-semibold border border-primary text-primary hover:bg-primary/5 transition-all duration-150"
                >
                  Enable 2FA
                </button>
              </div>

              <div className="p-4 bg-muted rounded-xl border border-border">
                <p className="text-[13px] font-semibold text-foreground mb-3">Active Sessions</p>
                {[
                  { device: 'Chrome on macOS', location: 'Sydney, AU', time: 'Now', current: true },
                  { device: 'Firefox on Windows', location: 'Melbourne, AU', time: '2 days ago', current: false },
                ].map((session) => (
                  <div key={session.device} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                    <div>
                      <p className="text-[13px] font-medium text-foreground">{session.device}</p>
                      <p className="text-[12px] text-muted-foreground">{session.location} · {session.time}</p>
                    </div>
                    {session.current ? (
                      <span className="text-[11px] font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Current</span>
                    ) : (
                      <button suppressHydrationWarning className="text-[12px] text-red-500 hover:text-red-700 font-medium transition-colors duration-150">
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Settings size={18} className="text-primary" />
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-foreground">Settings</h1>
              <p className="text-[13px] text-muted-foreground">Manage your operator preferences and system configuration</p>
            </div>
          </div>
          <button
            suppressHydrationWarning
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
              saved
                ? 'bg-green-500 text-white' :'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {saved ? <CheckCircle2 size={15} /> : <Save size={15} />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar nav */}
          <aside className="w-52 flex-shrink-0">
            <nav className="space-y-0.5">
              {SECTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  suppressHydrationWarning
                  onClick={() => setActiveSection(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 group ${
                    activeSection === id
                      ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  <span className="flex-1 text-left">{label}</span>
                  {activeSection === id && <ChevronRight size={14} className="flex-shrink-0 opacity-60" />}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content panel */}
          <div className="flex-1 min-w-0 bg-card rounded-xl border border-border shadow-card p-6">
            {renderSection()}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}