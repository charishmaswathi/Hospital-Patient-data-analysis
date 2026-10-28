import React from 'react';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  HeartPulse,
  Layers,
  Users,
} from 'lucide-react';
import { AnalyticsSummary, PatientRecord } from '../types/patient';
import { StatCard } from './StatCard';

// Register Chart.js core components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardViewProps {
  summary: AnalyticsSummary;
  recentRecords: PatientRecord[];
  onNavigateToRecords: () => void;
  onNavigateToAddRecord: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  summary,
  recentRecords,
  onNavigateToRecords,
  onNavigateToAddRecord,
}) => {
  // Chart 1: Department distribution
  const deptLabels = Object.keys(summary.departmentCounts);
  const deptData = {
    labels: deptLabels,
    datasets: [
      {
        label: 'Patients',
        data: deptLabels.map((d) => summary.departmentCounts[d] || 0),
        backgroundColor: '#0284c7', // Sky-600
        hoverBackgroundColor: '#0369a1',
        borderRadius: 6,
      },
    ],
  };

  // Chart 2: Monthly hospital visits
  const monthLabels = Object.keys(summary.monthlyVisits).sort();
  const monthlyData = {
    labels: monthLabels.length > 0 ? monthLabels : ['No data'],
    datasets: [
      {
        label: 'Hospital Visits',
        data: monthLabels.length > 0 ? monthLabels.map((m) => summary.monthlyVisits[m] || 0) : [0],
        borderColor: '#0d9488', // Teal-600
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#0d9488',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Chart 3: Age-Group distribution (Horizontal bar)
  const ageOrder = ['0-18', '19-35', '36-50', '51-65', '66+'];
  const ageGroupData = {
    labels: ageOrder,
    datasets: [
      {
        label: 'Patients',
        data: ageOrder.map((grp) => summary.ageGroupCounts[grp] || 0),
        backgroundColor: '#3b82f6', // Blue-500
        hoverBackgroundColor: '#2563eb',
        borderRadius: 6,
      },
    ],
  };

  // Chart 4: Discharge Status (Doughnut)
  const dischargeLabels = Object.keys(summary.dischargeCounts);
  const dischargeColors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];
  const dischargeStatusData = {
    labels: dischargeLabels.length > 0 ? dischargeLabels : ['None'],
    datasets: [
      {
        data:
          dischargeLabels.length > 0
            ? dischargeLabels.map((s) => summary.dischargeCounts[s] || 0)
            : [0],
        backgroundColor: dischargeColors.slice(0, Math.max(1, dischargeLabels.length)),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  // Discharged percentage calculation
  const dischargedCount = summary.dischargeCounts['Discharged'] || 0;
  const dischargeRate =
    summary.totalRecords > 0 ? ((dischargedCount / summary.totalRecords) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* 4 Summary Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Patient Records"
          value={summary.totalRecords}
          subtitle="Synchronized SQLite table records"
          icon={<Users className="w-5 h-5" />}
          iconBgColor="bg-sky-50"
          iconTextColor="text-sky-600"
        />

        <StatCard
          label="Total Hospital Visits"
          value={summary.totalVisits}
          subtitle="Active outpatient & inpatient logs"
          icon={<CalendarDays className="w-5 h-5" />}
          iconBgColor="bg-teal-50"
          iconTextColor="text-teal-600"
        />

        <StatCard
          label="Clinical Departments"
          value={Object.keys(summary.departmentCounts).length}
          subtitle="Active specialty units"
          icon={<Building2 className="w-5 h-5" />}
          iconBgColor="bg-indigo-50"
          iconTextColor="text-indigo-600"
        />

        <StatCard
          label="Discharge-Status Rate"
          value={`${dischargeRate}%`}
          subtitle={`${dischargedCount} routine discharges`}
          icon={<HeartPulse className="w-5 h-5" />}
          iconBgColor="bg-emerald-50"
          iconTextColor="text-emerald-600"
        />
      </div>

      {/* 4 Interactive Chart.js Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Department Distribution */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Patient Records by Department</h2>
              <p className="text-xs text-slate-500">Distribution of patient intake volume</p>
            </div>
            <div className="text-xs text-slate-400 font-mono">Bar Chart</div>
          </div>
          <div className="h-64 relative">
            <Bar
              data={deptData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => ` ${context.parsed.y} patients`,
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { precision: 0, font: { size: 11 } },
                    grid: { color: '#f1f5f9' },
                  },
                  x: {
                    ticks: { font: { size: 10 } },
                    grid: { display: false },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Chart 2: Monthly Hospital Visits */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Monthly Hospital Visits</h2>
              <p className="text-xs text-slate-500">Chronological admission trend</p>
            </div>
            <div className="text-xs text-slate-400 font-mono">Line Chart</div>
          </div>
          <div className="h-64 relative">
            <Line
              data={monthlyData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => ` ${context.parsed.y} visits recorded`,
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { precision: 0, font: { size: 11 } },
                    grid: { color: '#f1f5f9' },
                  },
                  x: {
                    ticks: { font: { size: 11 } },
                    grid: { display: false },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Chart 3: Age-Group Distribution */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Patient Age-Group Distribution</h2>
              <p className="text-xs text-slate-500">Clinical demographic cohorts</p>
            </div>
            <div className="text-xs text-slate-400 font-mono">Horizontal Bar</div>
          </div>
          <div className="h-64 relative">
            <Bar
              data={ageGroupData}
              options={{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => ` ${context.parsed.x} patients`,
                    },
                  },
                },
                scales: {
                  x: {
                    beginAtZero: true,
                    ticks: { precision: 0, font: { size: 11 } },
                    grid: { color: '#f1f5f9' },
                  },
                  y: {
                    ticks: { font: { size: 11 } },
                    grid: { display: false },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Chart 4: Discharge Status */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Discharge-Status Breakdown</h2>
              <p className="text-xs text-slate-500">Clinical disposition breakdown</p>
            </div>
            <div className="text-xs text-slate-400 font-mono">Doughnut</div>
          </div>
          <div className="h-64 relative flex items-center justify-center">
            {summary.totalRecords > 0 ? (
              <Doughnut
                data={dischargeStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: '68%',
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        boxWidth: 12,
                        font: { size: 11 },
                        padding: 12,
                      },
                    },
                  },
                }}
              />
            ) : (
              <div className="text-xs text-slate-400">No records available to render</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Records Quick Snapshot */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Patient Encounters</h2>
            <p className="text-xs text-slate-500">Latest hospital visits from SQLite database</p>
          </div>
          <button
            onClick={onNavigateToRecords}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors"
          >
            <span>View all {summary.totalRecords} records</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Record ID</th>
                  <th className="py-2.5 px-3">Age</th>
                  <th className="py-2.5 px-3">Age Group</th>
                  <th className="py-2.5 px-3">Visit Date</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Diagnosis Category</th>
                  <th className="py-2.5 px-3">Discharge Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-semibold text-sky-700">{r.id}</td>
                    <td className="py-2.5 px-3 tabular-nums font-mono">{r.age} yrs</td>
                    <td className="py-2.5 px-3 text-slate-500">{r.ageGroup}</td>
                    <td className="py-2.5 px-3 tabular-nums font-mono text-slate-600">
                      {r.visitDate}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{r.department}</td>
                    <td className="py-2.5 px-3 text-slate-700">{r.diagnosisCategory}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-xs text-slate-600">
                        {r.dischargeStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-xs text-slate-500 mb-3">Database is currently empty.</p>
            <button
              onClick={onNavigateToAddRecord}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700"
            >
              Add First Record
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
