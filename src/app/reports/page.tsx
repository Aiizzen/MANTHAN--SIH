'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { CONFIRMED_CONTACTS_ALL, SURVEYS } from '@/data/mockData';
import type { DetectionClass } from '@/data/mockData';
import { FileBarChart2, Download, FileJson, FileText } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';

const CLASS_COLORS: Record<DetectionClass, string> = {
  Shipwreck: 'text-amber-600 bg-amber-50 border-amber-200',
  Pipe: 'text-blue-600 bg-blue-50 border-blue-200',
  Cylinder: 'text-purple-600 bg-purple-50 border-purple-200',
  'Entangled Net': 'text-red-600 bg-red-50 border-red-200',
  'Unknown Object': 'text-gray-600 bg-gray-50 border-gray-200',
};

function getConfidenceColor(conf: number) {
  if (conf >= 80) return 'text-green-700';
  if (conf >= 50) return 'text-amber-600';
  return 'text-red-600';
}

export default function ReportsPage() {
  const [filterClass, setFilterClass] = useState<DetectionClass | 'All'>('All');

  const filtered = CONFIRMED_CONTACTS_ALL.filter(
    (c) => filterClass === 'All' || c.classification === filterClass
  );

  const getSurveyFilename = (surveyId: string) => {
    const s = SURVEYS.find((sv) => sv.id === surveyId);
    return s ? s.filename : surveyId;
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Survey', 'Class', 'Confidence', 'Lat', 'Lng', 'Depth', 'Length', 'Width', 'Date', 'Status'];
    const rows = filtered.map((c) => [
      c.id,
      getSurveyFilename(c.surveyId),
      c.classification,
      `${c.confidence}%`,
      c.lat,
      c.lng,
      c.depth,
      c.length,
      c.width,
      c.date,
      c.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sonarshield_confirmed_contacts.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const data = filtered.map((c) => ({
      ...c,
      surveyFilename: getSurveyFilename(c.surveyId),
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sonarshield_confirmed_contacts.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const classes: Array<DetectionClass | 'All'> = ['All', 'Shipwreck', 'Pipe', 'Cylinder', 'Entangled Net', 'Unknown Object'];

  return (
    <AppLayout>
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileBarChart2 size={18} className="text-primary" />
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-foreground">Reports &amp; Export</h1>
              <p className="text-[13px] text-muted-foreground">All confirmed contacts across surveys</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              suppressHydrationWarning
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-[13px] font-medium text-foreground hover:bg-muted transition-colors duration-150"
            >
              <FileText size={14} className="text-primary" />
              Export CSV
            </button>
            <button
              suppressHydrationWarning
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-[13px] font-medium hover:bg-primary/90 transition-colors duration-150"
            >
              <FileJson size={14} />
              Export JSON
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Confirmed', value: CONFIRMED_CONTACTS_ALL.length },
            { label: 'Shipwrecks', value: CONFIRMED_CONTACTS_ALL.filter((c) => c.classification === 'Shipwreck').length },
            { label: 'Avg. Confidence', value: `${Math.round(CONFIRMED_CONTACTS_ALL.reduce((s, c) => s + c.confidence, 0) / CONFIRMED_CONTACTS_ALL.length)}%` },
            { label: 'Surveys Covered', value: new Set(CONFIRMED_CONTACTS_ALL.map((c) => c.surveyId)).size },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl border border-border shadow-card p-4">
              <p className="text-[12px] text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-[22px] font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {classes.map((cls) => (
            <button
              key={`filter-${cls}`}
              suppressHydrationWarning
              onClick={() => setFilterClass(cls)}
              className={`px-3 py-1 rounded-full text-[12px] font-medium border transition-all duration-150 ${
                filterClass === cls
                  ? 'bg-primary text-white border-primary' :'bg-muted text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {cls}
            </button>
          ))}
          <span className="ml-auto text-[12px] text-muted-foreground">{filtered.length} contacts</span>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Class</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Confidence</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Coordinates</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Dimensions</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Survey</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((contact, i) => (
                  <tr
                    key={contact.id}
                    className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors duration-100 ${i % 2 === 0 ? '' : 'bg-muted/10'}`}
                  >
                    <td className="px-4 py-3 font-mono text-[12px] text-muted-foreground">{contact.id.toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${CLASS_COLORS[contact.classification]}`}>
                        {contact.classification}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${getConfidenceColor(contact.confidence)}`}>
                        {contact.confidence}%
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-foreground">
                      {contact.lat.toFixed(4)}, {contact.lng.toFixed(4)}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {contact.length} × {contact.width}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{contact.date}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={contact.status} />
                    </td>
                    <td className="px-4 py-3 text-[11px] text-muted-foreground max-w-[180px] truncate" title={getSurveyFilename(contact.surveyId)}>
                      {getSurveyFilename(contact.surveyId)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Download size={32} className="text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-[14px] text-muted-foreground">No confirmed contacts match the current filter.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
