'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Survey } from '@/data/mockData';
import { SurveyStatusBadge } from '@/components/ui/StatusBadge';
import { TableRowSkeleton } from '@/components/ui/SkeletonLoader';
import {
  ChevronUp,
  ChevronDown,
  Search,
  ScanSearch,
  FileText,
  ArrowUpDown,
} from 'lucide-react';

interface SurveysTableProps {
  surveys: Survey[];
  loading: boolean;
}

type SortKey = 'filename' | 'uploadDate' | 'areaCovered' | 'contactsDetected' | 'status';
type SortDir = 'asc' | 'desc';

const STATUS_ORDER = ['processing', 'pending_review', 'reviewed', 'exported'];

export default function SurveysTable({ surveys, loading }: SurveysTableProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('uploadDate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const filtered = surveys.filter(
    (s) =>
      s.filename.toLowerCase().includes(search.toLowerCase()) ||
      s.vessel.toLowerCase().includes(search.toLowerCase()) ||
      s.operator.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortKey === 'filename') cmp = a.filename.localeCompare(b.filename);
    else if (sortKey === 'uploadDate') cmp = a.uploadDate.localeCompare(b.uploadDate);
    else if (sortKey === 'areaCovered') cmp = parseFloat(a.areaCovered) - parseFloat(b.areaCovered);
    else if (sortKey === 'contactsDetected') cmp = a.contactsDetected - b.contactsDetected;
    else if (sortKey === 'status') cmp = STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown size={13} className="text-muted-foreground opacity-50" />;
    return sortDir === 'asc' ? (
      <ChevronUp size={13} className="text-primary" />
    ) : (
      <ChevronDown size={13} className="text-primary" />
    );
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2, '0')} ${d.toLocaleString('en-AU', { month: 'short' })} ${d.getFullYear()}`;
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      {/* Search Bar */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search surveys, vessels, operators…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 text-[13px] bg-muted border border-input rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150"
          />
        </div>
        <span className="text-[12px] text-muted-foreground ml-auto">
          {filtered.length} of {surveys.length} surveys
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {[
                { key: 'filename' as SortKey, label: 'Filename' },
                { key: 'uploadDate' as SortKey, label: 'Upload Date' },
                { key: null, label: 'Vessel' },
                { key: null, label: 'Operator' },
                { key: 'areaCovered' as SortKey, label: 'Area' },
                { key: 'contactsDetected' as SortKey, label: 'Contacts' },
                { key: null, label: 'Proc. Time' },
                { key: 'status' as SortKey, label: 'Status' },
                { key: null, label: 'Actions' },
              ].map(({ key, label }, i) => (
                <th
                  key={`th-${i}`}
                  className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap ${key ? 'cursor-pointer hover:text-foreground select-none' : ''}`}
                  onClick={() => key && handleSort(key)}
                >
                  <div className="flex items-center gap-1.5">
                    {label}
                    {key && <SortIcon col={key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRowSkeleton key={`table-skeleton-${i}`} cols={9} />
              ))
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <FileText size={36} className="text-muted-foreground opacity-40" />
                    <p className="text-[15px] font-semibold text-foreground">No surveys found</p>
                    <p className="text-[13px] text-muted-foreground max-w-xs">
                      No survey files match your search. Upload a new survey to begin processing.
                    </p>
                    <Link
                      href="/upload-new-survey"
                      className="mt-1 px-4 py-2 bg-primary text-white text-[13px] font-semibold rounded-lg hover:bg-secondary transition-colors duration-150"
                    >
                      Upload Survey
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((survey, rowIdx) => (
                <tr
                  key={survey.id}
                  className={`border-b border-border hover:bg-muted/40 transition-colors duration-100 ${rowIdx % 2 === 0 ? '' : 'bg-muted/20'}`}
                >
                  <td className="px-4 py-3 max-w-[220px]">
                    <span className="font-mono text-[12px] text-foreground truncate block" title={survey.filename}>
                      {survey.filename}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {formatDate(survey.uploadDate)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-foreground font-medium">
                    {survey.vessel}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {survey.operator}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-tabular text-foreground">
                    {survey.areaCovered}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`font-tabular font-semibold ${survey.contactsDetected > 10 ? 'text-amber-600' : 'text-foreground'}`}>
                      {survey.contactsDetected}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-tabular text-muted-foreground">
                    {survey.processingTime}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <SurveyStatusBadge status={survey.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {survey.status !== 'processing' ? (
                      <Link
                        href="/survey-detection-results"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[12px] font-semibold hover:bg-primary hover:text-white transition-all duration-150"
                      >
                        <ScanSearch size={13} />
                        Review
                      </Link>
                    ) : (
                      <span className="text-[12px] text-muted-foreground italic">Processing…</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && sorted.length > perPage && (
        <div className="px-4 py-3 border-t border-border flex items-center justify-between">
          <span className="text-[12px] text-muted-foreground">
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, sorted.length)} of {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={`page-${i + 1}`}
                onClick={() => setPage(i + 1)}
                className={`w-7 h-7 rounded-md text-[12px] font-medium transition-all duration-150 ${
                  page === i + 1
                    ? 'bg-primary text-white' :'text-muted-foreground hover:bg-muted'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}