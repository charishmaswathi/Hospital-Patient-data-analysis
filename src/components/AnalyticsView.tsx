import React from 'react';
import {
  AlertCircle,
  Binary,
  Calculator,
  CheckCircle2,
  Download,
  FileCheck,
  Grid3X3,
  Scale,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { AnalyticsSummary } from '../types/patient';
import { PatientStorageService } from '../services/storage';

interface AnalyticsViewProps {
  summary: AnalyticsSummary;
  onDownloadReport: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  summary,
  onDownloadReport,
}) => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Exploratory Data Analysis (EDA) & Data Quality Suite
          </h2>
          <p className="text-xs text-slate-500">
            Calculated via Python <code className="text-sky-700 font-mono">pandas.DataFrame</code> statistical modeling and data hygiene checks.
          </p>
        </div>
        <button
          onClick={onDownloadReport}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Summary CSV Report</span>
        </button>
      </div>

      {/* Section 1: Pandas Descriptive Statistics Cards */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-sky-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Parametric Statistics on Patient Age (<code className="font-mono text-sky-600">df['age'].describe()</code>)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            N = {summary.totalRecords} records
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-[11px] text-slate-400 font-medium mb-1">Mean Age (μ)</div>
            <div className="text-xl font-bold font-mono tabular-nums text-sky-700">
              {summary.ageStats.mean} <span className="text-xs font-normal text-slate-500">yrs</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-[11px] text-slate-400 font-medium mb-1">Median Age</div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-800">
              {summary.ageStats.median} <span className="text-xs font-normal text-slate-500">yrs</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-[11px] text-slate-400 font-medium mb-1">Std Dev (σ)</div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-800">
              ±{summary.ageStats.stdDev}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-[11px] text-slate-400 font-medium mb-1">Min Age</div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-800">
              {summary.ageStats.min} <span className="text-xs font-normal text-slate-500">yrs</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-[11px] text-slate-400 font-medium mb-1">Max Age</div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-800">
              {summary.ageStats.max} <span className="text-xs font-normal text-slate-500">yrs</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-[11px] text-slate-400 font-medium mb-1">Identified Duplicates</div>
            <div
              className={`text-xl font-bold font-mono tabular-nums ${
                summary.duplicateCount === 0 ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {summary.duplicateCount}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Data Hygiene & Missing-Value Auditing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Missing Values Audit */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Missing-Value Audit (<code className="font-mono text-emerald-600">df.isnull().sum()</code>)
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Data Preprocessing</span>
          </div>

          <p className="text-xs text-slate-500 mb-3">
            Verifying feature completeness before feeding records into machine learning models.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                  <th className="py-2 px-2.5">Feature Column</th>
                  <th className="py-2 px-2.5">Missing Count</th>
                  <th className="py-2 px-2.5">Missing Rate</th>
                  <th className="py-2 px-2.5 text-right">Hygiene Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {summary.missingValues.map((item) => (
                  <tr key={item.column} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-2.5 font-mono font-medium text-slate-700">
                      {item.column}
                    </td>
                    <td className="py-2.5 px-2.5 font-mono tabular-nums text-slate-600">
                      {item.missingCount}
                    </td>
                    <td className="py-2.5 px-2.5 font-mono tabular-nums text-slate-600">
                      {item.percentage}%
                    </td>
                    <td className="py-2.5 px-2.5 text-right">
                      {item.missingCount === 0 ? (
                        <span className="text-emerald-700 text-[11px] font-semibold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>100% Clean</span>
                        </span>
                      ) : (
                        <span className="text-amber-700 text-[11px] font-semibold flex items-center justify-end gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                          <span>Missing Values</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Duplicate Record Checks */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Binary className="w-4 h-4 text-sky-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Duplicate Record Verification (<code className="font-mono text-sky-600">df.duplicated()</code>)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Data Deduplication</span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Scans database tuples matching identical clinical feature sets: <code>[Age, Visit Date, Department, Diagnosis]</code>.
            </p>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Total Unique Clinical Signatures:</span>
                <span className="font-mono font-bold text-slate-900">
                  {summary.totalRecords - summary.duplicateCount}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Redundant Duplicate Rows:</span>
                <span className="font-mono font-bold text-emerald-600">
                  {summary.duplicateCount}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                <span className="text-slate-600">Dataset Deduplication Integrity:</span>
                <span className="font-mono font-bold text-sky-700">
                  {summary.totalRecords > 0
                    ? `${(((summary.totalRecords - summary.duplicateCount) / summary.totalRecords) * 100).toFixed(1)}%`
                    : '100%'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-sky-50/60 p-3 rounded-lg border border-sky-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
            <span>Clean dataset conforms to first normal form (1NF) relational standards.</span>
          </div>
        </div>
      </div>

      {/* Section 3: Department vs Discharge Status Cross-Tabulation (Contingency Matrix) */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4 text-teal-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Cross-Tabulation Matrix: Department vs. Discharge Status (<code className="font-mono text-teal-600">pd.crosstab()</code>)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Bivariate Analysis</span>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Bivariate contingency table mapping clinical department against final patient disposition.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-100">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3 text-center">Discharged</th>
                <th className="py-2.5 px-3 text-center">Admitted</th>
                <th className="py-2.5 px-3 text-center">Under Observation</th>
                <th className="py-2.5 px-3 text-center">Transferred</th>
                <th className="py-2.5 px-3 text-center">Follow-up Scheduled</th>
                <th className="py-2.5 px-3 text-right bg-slate-100 font-bold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {summary.contingencyTable.map((row) => (
                <tr key={row.department} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-800">
                    {row.department}
                  </td>
                  <td className="py-2.5 px-3 text-center tabular-nums text-slate-700">
                    {row.discharged}
                  </td>
                  <td className="py-2.5 px-3 text-center tabular-nums text-slate-700">
                    {row.admitted}
                  </td>
                  <td className="py-2.5 px-3 text-center tabular-nums text-slate-700">
                    {row.observation}
                  </td>
                  <td className="py-2.5 px-3 text-center tabular-nums text-slate-700">
                    {row.transferred}
                  </td>
                  <td className="py-2.5 px-3 text-center tabular-nums text-slate-700">
                    {row.followUp}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums font-bold text-sky-800 bg-slate-50">
                    {row.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
