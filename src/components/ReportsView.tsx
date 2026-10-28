import React from 'react';
import {
  Building2,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { AnalyticsSummary, PatientRecord } from '../types/patient';

interface ReportsViewProps {
  summary: AnalyticsSummary;
  records: PatientRecord[];
  onDownloadCsv: () => void;
  onDownloadAnalyticsReport: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  summary,
  records,
  onDownloadCsv,
  onDownloadAnalyticsReport,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Hospital Clinical Audit Reports</h2>
          <p className="text-xs text-slate-500">
            Official summary statements for administrative review, regulatory auditing, and analytical export.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>
          <button
            onClick={onDownloadCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Full CSV</span>
          </button>
        </div>
      </div>

      {/* Main Printable Audit Report Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 sm:p-8 shadow-xs space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Report Header */}
        <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-sky-700 tracking-wide uppercase">
                MediPulse Hospital Health System
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-400">Clinical Audit Division</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Hospital Patient Data & Throughput Analysis Report
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated Administrative Evaluation for 2nd-Year B.Tech CSE (AI/ML)
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500 space-y-0.5 font-mono">
            <div>
              Generated Date: <span className="font-semibold text-slate-700">{new Date().toISOString().split('T')[0]}</span>
            </div>
            <div>
              Dataset Scope: <span className="font-semibold text-slate-700">{summary.totalRecords} Encounters</span>
            </div>
            <div>
              Compliance: <span className="text-emerald-600 font-semibold">PII-Sanitized</span>
            </div>
          </div>
        </div>

        {/* Section 1: Executive Capacity Summary */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            1. Executive Volume & Demographic Overview
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            During the evaluated logging period, the hospital processed a cumulative volume of{' '}
            <strong className="text-slate-900 font-mono tabular-nums">{summary.totalRecords}</strong> patient records 
            across <strong className="text-slate-900">{Object.keys(summary.departmentCounts).length}</strong> clinical specialty departments. 
            The parametric mean patient age across the sample is{' '}
            <strong className="text-slate-900 font-mono tabular-nums">{summary.ageStats.mean} years</strong>{' '}
            (standard deviation: ±{summary.ageStats.stdDev}, range: {summary.ageStats.min}–{summary.ageStats.max} yrs). 
            Total inpatient bed admissions constituted{' '}
            <strong className="text-slate-900 font-mono tabular-nums">
              {summary.dischargeCounts['Admitted'] || 0}
            </strong>{' '}
            cases, with{' '}
            <strong className="text-slate-900 font-mono tabular-nums">
              {summary.dischargeCounts['Discharged'] || 0}
            </strong>{' '}
            patients discharged in stable condition.
          </p>
        </div>

        {/* Section 2: Department Intake Volume Breakdown */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            2. Department-Wise Clinical Intake & Allocation
          </h2>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Clinical Department</th>
                  <th className="py-2.5 px-3">Patient Encounters</th>
                  <th className="py-2.5 px-3">Relative Volume Share</th>
                  <th className="py-2.5 px-3">Capacity Utilization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                {Object.entries(summary.departmentCounts).map(([dept, count]) => {
                  const pct =
                    summary.totalRecords > 0
                      ? ((count / summary.totalRecords) * 100).toFixed(1)
                      : '0';
                  return (
                    <tr key={dept} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-sans font-medium text-slate-900">{dept}</td>
                      <td className="py-2.5 px-3 tabular-nums font-bold">{count}</td>
                      <td className="py-2.5 px-3 tabular-nums">{pct}%</td>
                      <td className="py-2.5 px-3 font-sans">
                        <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-sky-600 h-full rounded-full"
                            style={{ width: `${Math.min(100, Number(pct) * 3)}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Clinical Disposition Summary */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            3. Discharge & Disposition Breakdown
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.entries(summary.dischargeCounts).map(([status, count]) => {
              const pct =
                summary.totalRecords > 0
                  ? ((count / summary.totalRecords) * 100).toFixed(1)
                  : '0';
              return (
                <div key={status} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                  <div className="text-[11px] text-slate-500 font-medium truncate mb-1">
                    {status}
                  </div>
                  <div className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                    {count}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">{pct}% share</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Data Governance & Integrity Sign-Off */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Data Quality Certified:</strong> Zero identifying patient data (PII) present.
              All {summary.totalRecords} records validated against schema constraints.
            </span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            System ID: MP-HPDAS-2026-EDU
          </div>
        </div>
      </div>

      {/* Export Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900">Raw Patient Records CSV</h3>
            </div>
            <p className="text-xs text-slate-500">
              Download complete comma-separated dataset ({summary.totalRecords} rows)
            </p>
          </div>
          <button
            onClick={onDownloadCsv}
            className="px-3.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
          >
            Export CSV
          </button>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-sky-600" />
              <h3 className="text-xs font-bold text-slate-900">Statistical Summary Report CSV</h3>
            </div>
            <p className="text-xs text-slate-500">
              Aggregated KPI tables, demographics, and data hygiene metrics
            </p>
          </div>
          <button
            onClick={onDownloadAnalyticsReport}
            className="px-3.5 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer"
          >
            Export Summary
          </button>
        </div>
      </div>
    </div>
  );
};
