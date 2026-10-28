/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AboutView } from './components/AboutView';
import { AddRecordView } from './components/AddRecordView';
import { AnalyticsView } from './components/AnalyticsView';
import { DashboardView } from './components/DashboardView';
import { FlaskSourceModal } from './components/FlaskSourceModal';
import { Header } from './components/Header';
import { RecordsView } from './components/RecordsView';
import { ReportsView } from './components/ReportsView';
import { NavTab, Sidebar } from './components/Sidebar';
import { PatientStorageService } from './services/storage';
import { AnalyticsSummary, PatientRecord } from './types/patient';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary>({
    totalRecords: 0,
    totalVisits: 0,
    departmentCounts: {},
    dischargeCounts: {},
    ageGroupCounts: {},
    monthlyVisits: {},
    ageStats: { mean: 0, median: 0, min: 0, max: 0, stdDev: 0 },
    missingValues: [],
    duplicateCount: 0,
    contingencyTable: [],
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize and load records
  const loadData = () => {
    PatientStorageService.init();
    const allRecords = PatientStorageService.getAllRecords();
    setRecords(allRecords);
    setSummary(PatientStorageService.getAnalyticsSummary());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Reset to canonical fictional demonstration data
  const handleResetData = () => {
    PatientStorageService.resetToSampleData();
    loadData();
    showToast('Database reset with 40 synthetic educational records.');
  };

  // Export CSV
  const handleExportCsv = () => {
    const csvContent = PatientStorageService.exportToCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `hospital_patient_records_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Patient dataset CSV exported successfully.');
  };

  // Export Analytics Summary CSV
  const handleExportAnalyticsReport = () => {
    const csvContent = PatientStorageService.exportAnalyticsReportCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `hospital_analytics_summary_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Analytics summary CSV exported.');
  };

  const handleTabSelect = (tab: NavTab) => {
    if (tab === 'code-viewer') {
      setIsCodeModalOpen(true);
    } else {
      setCurrentTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl animate-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleTabSelect}
        onResetData={handleResetData}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <Header
          currentTab={currentTab}
          onSelectTab={handleTabSelect}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onExportCsv={handleExportCsv}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              summary={summary}
              recentRecords={records.slice(0, 5)}
              onNavigateToRecords={() => setCurrentTab('records')}
              onNavigateToAddRecord={() => setCurrentTab('add-record')}
            />
          )}

          {currentTab === 'records' && (
            <RecordsView
              records={records}
              onRefresh={loadData}
              onNavigateToAddRecord={() => setCurrentTab('add-record')}
            />
          )}

          {currentTab === 'add-record' && (
            <AddRecordView
              onRecordAdded={loadData}
              onNavigateToRecords={() => setCurrentTab('records')}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView
              summary={summary}
              onDownloadReport={handleExportAnalyticsReport}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView
              summary={summary}
              records={records}
              onDownloadCsv={handleExportCsv}
              onDownloadAnalyticsReport={handleExportAnalyticsReport}
            />
          )}

          {currentTab === 'about' && <AboutView />}
        </main>
      </div>

      {/* Fullscreen Code Viewer & ZIP Download Modal */}
      <FlaskSourceModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}
