'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutDashboard,
  Upload,
  ScanSearch,
  FileBarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  HelpCircle,
  LogOut,
  Activity,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  group: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'nav-dashboard', label: 'Dashboard', href: '/', icon: LayoutDashboard, group: 'main' },
  { id: 'nav-upload', label: 'New Survey', href: '/upload-new-survey', icon: Upload, group: 'main' },
  { id: 'nav-results', label: 'Detection Results', href: '/survey-detection-results', icon: ScanSearch, badge: 2, group: 'main' },
  { id: 'nav-reports', label: 'Reports & Export', href: '/reports', icon: FileBarChart2, group: 'analysis' },
  { id: 'nav-activity', label: 'Pipeline Activity', href: '/pipeline', icon: Activity, group: 'analysis' },
  { id: 'nav-settings', label: 'Settings', href: '/settings', icon: Settings, group: 'system' },
];

const GROUP_LABELS: Record<string, string> = {
  main: 'Operations',
  analysis: 'Analysis',
  system: 'System',
};

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const groups = ['main', 'analysis', 'system'];

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 nav-bg border-r border-nav transition-all duration-300 ease-in-out flex-shrink-0 z-30"
      style={{ width: collapsed ? 64 : 240 }}
    >
      {/* Logo */}
      <div className={`flex items-center border-b border-nav transition-all duration-300 ${collapsed ? 'px-3 py-4 justify-center' : 'px-4 py-4 gap-3'}`}>
        <AppLogo size={32} />
        {!collapsed && (
          <span className="text-white font-semibold text-[15px] tracking-tight whitespace-nowrap overflow-hidden">
            SonarShield
          </span>
        )}
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2">
        {groups.map((group) => {
          const items = NAV_ITEMS.filter((n) => n.group === group);
          return (
            <div key={`group-${group}`} className="mb-4">
              {!collapsed && (
                <p className="text-[10px] font-semibold uppercase tracking-widest text-nav px-3 mb-1 opacity-50">
                  {GROUP_LABELS[group]}
                </p>
              )}
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative
                          ${isActive
                            ? 'bg-nav-active text-nav-active' :'text-nav hover:bg-white/5 hover:text-nav-active'
                          }
                          ${collapsed ? 'justify-center' : ''}
                        `}
                        title={collapsed ? item.label : undefined}
                      >
                        <Icon size={18} className="flex-shrink-0" />
                        {!collapsed && (
                          <span className="text-[14px] font-medium whitespace-nowrap">
                            {item.label}
                          </span>
                        )}
                        {!collapsed && item.badge !== undefined && item.badge > 0 && (
                          <span className="ml-auto text-[10px] font-bold bg-amber-500 text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">
                            {item.badge}
                          </span>
                        )}
                        {collapsed && item.badge !== undefined && item.badge > 0 && (
                          <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
                        )}
                        {/* Tooltip for collapsed */}
                        {collapsed && (
                          <span className="
                            absolute left-full ml-3 px-2 py-1 bg-foreground text-white text-[12px] font-medium
                            rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none
                            transition-opacity duration-150 z-50 shadow-lg
                          ">
                            {item.label}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-nav px-2 py-3 space-y-0.5">
        {[
          { id: 'btn-notifications', icon: Bell, label: 'Notifications', badge: 3 },
          { id: 'btn-help', icon: HelpCircle, label: 'Help & Docs' },
        ].map(({ id, icon: Icon, label, badge }) => (
          <button
            key={id}
            suppressHydrationWarning
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-nav hover:bg-white/5 hover:text-nav-active transition-all duration-150 group relative ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span className="text-[14px] font-medium">{label}</span>}
            {!collapsed && badge !== undefined && badge > 0 && (
              <span className="ml-auto text-[10px] font-bold bg-amber-500 text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">
                {badge}
              </span>
            )}
            {collapsed && badge !== undefined && badge > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
            )}
            {collapsed && (
              <span className="absolute left-full ml-3 px-2 py-1 bg-foreground text-white text-[12px] font-medium rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-lg">
                {label}
              </span>
            )}
          </button>
        ))}

        {/* User Profile */}
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mt-1 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
            MO
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-white truncate">M. Okafor</p>
              <p className="text-[11px] text-nav truncate">Survey Operator</p>
            </div>
          )}
          {!collapsed && (
            <button suppressHydrationWarning className="text-nav hover:text-nav-active transition-colors duration-150 ml-auto">
              <LogOut size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        suppressHydrationWarning
        className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-card hover:shadow-card-hover transition-all duration-150 z-40"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight size={12} className="text-muted-foreground" />
        ) : (
          <ChevronLeft size={12} className="text-muted-foreground" />
        )}
      </button>
    </aside>
  );
}