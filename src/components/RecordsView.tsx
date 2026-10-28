import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Filter,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import {
  AgeGroup,
  DEPARTMENTS,
  DISCHARGE_STATUSES,
  Department,
  DischargeStatus,
  PatientRecord,
  PatientRecordFormData,
  ValidationErrors,
} from '../types/patient';
import { PatientStorageService } from '../services/storage';

interface RecordsViewProps {
  records: PatientRecord[];
  onRefresh: () => void;
  onNavigateToAddRecord: () => void;
}

export const RecordsView: React.FC<RecordsViewProps> = ({
  records,
  onRefresh,
  onNavigateToAddRecord,
}) => {
  // Filters & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'visitDate' | 'id' | 'age'>('visitDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Edit Modal State
  const [editingRecord, setEditingRecord] = useState<PatientRecord | null>(null);
  const [editFormData, setEditFormData] = useState<PatientRecordFormData>({
    age: '',
    visitDate: '',
    department: '',
    diagnosisCategory: '',
    dischargeStatus: '',
    notes: '',
  });
  const [editErrors, setEditErrors] = useState<ValidationErrors>({});

  // Delete Modal Confirmation State
  const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);

  // Filtered & Sorted records
  const filteredRecords = useMemo(() => {
    return records
      .filter((r) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            r.id.toLowerCase().includes(q) ||
            r.diagnosisCategory.toLowerCase().includes(q) ||
            (r.notes && r.notes.toLowerCase().includes(q)) ||
            r.department.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Department filter
        if (selectedDept !== 'all' && r.department !== selectedDept) return false;

        // Discharge status filter
        if (selectedStatus !== 'all' && r.dischargeStatus !== selectedStatus) return false;

        // Age group filter
        if (selectedAgeGroup !== 'all' && r.ageGroup !== selectedAgeGroup) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'visitDate') {
          const tA = new Date(a.visitDate).getTime();
          const tB = new Date(b.visitDate).getTime();
          return sortOrder === 'asc' ? tA - tB : tB - tA;
        }
        if (sortBy === 'age') {
          return sortOrder === 'asc' ? a.age - b.age : b.age - a.age;
        }
        // sort by ID
        return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
      });
  }, [records, searchQuery, selectedDept, selectedStatus, selectedAgeGroup, sortBy, sortOrder]);

  // Paginated records
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const currentRecords = filteredRecords.slice(startIndex, startIndex + pageSize);

  // Clear filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDept('all');
    setSelectedStatus('all');
    setSelectedAgeGroup('all');
    setCurrentPage(1);
  };

  // Open Edit Modal
  const handleOpenEdit = (record: PatientRecord) => {
    setEditingRecord(record);
    setEditFormData({
      id: record.id,
      age: record.age,
      visitDate: record.visitDate,
      department: record.department,
      diagnosisCategory: record.diagnosisCategory,
      dischargeStatus: record.dischargeStatus,
      notes: record.notes || '',
    });
    setEditErrors({});
  };

  // Submit Edit Form
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    const result = PatientStorageService.updateRecord(editingRecord.id, editFormData);
    if (!result.success) {
      setEditErrors(result.errors || {});
      return;
    }

    setEditingRecord(null);
    onRefresh();
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deletingRecordId) return;
    PatientStorageService.deleteRecord(deletingRecordId);
    setDeletingRecordId(null);
    onRefresh();
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Patient Records Management</h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>Showing {filteredRecords.length} of {records.length} records</span>
              <span aria-hidden="true">·</span>
              <span>Page {validCurrentPage} of {totalPages}</span>
            </div>
          </div>

          <button
            onClick={onNavigateToAddRecord}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors cursor-pointer self-start md:self-auto shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Patient Record</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {/* Search */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID, diagnosis..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 transition-colors"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 cursor-pointer text-slate-700"
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Discharge Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 cursor-pointer text-slate-700"
            >
              <option value="all">All Discharge Statuses</option>
              {DISCHARGE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Age Group Filter */}
          <div>
            <select
              value={selectedAgeGroup}
              onChange={(e) => {
                setSelectedAgeGroup(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 cursor-pointer text-slate-700"
            >
              <option value="all">All Age Groups</option>
              <option value="0-18">0-18 (Pediatric)</option>
              <option value="19-35">19-35 (Young Adult)</option>
              <option value="36-50">36-50 (Adult)</option>
              <option value="51-65">51-65 (Middle Aged)</option>
              <option value="66+">66+ (Geriatric)</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex gap-2">
            <button
              onClick={handleResetFilters}
              title="Reset all search filters"
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Records Table Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold tracking-wider">
                <th
                  onClick={() => {
                    if (sortBy === 'id') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    else {
                      setSortBy('id');
                      setSortOrder('asc');
                    }
                  }}
                  className="py-3 px-3.5 cursor-pointer hover:text-slate-900 select-none"
                >
                  Record ID {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => {
                    if (sortBy === 'age') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    else {
                      setSortBy('age');
                      setSortOrder('asc');
                    }
                  }}
                  className="py-3 px-3.5 cursor-pointer hover:text-slate-900 select-none"
                >
                  Age / Cohort {sortBy === 'age' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => {
                    if (sortBy === 'visitDate') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    else {
                      setSortBy('visitDate');
                      setSortOrder('desc');
                    }
                  }}
                  className="py-3 px-3.5 cursor-pointer hover:text-slate-900 select-none"
                >
                  Visit Date {sortBy === 'visitDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-3 px-3.5">Department</th>
                <th className="py-3 px-3.5">Diagnosis Category</th>
                <th className="py-3 px-3.5">Discharge Status</th>
                <th className="py-3 px-3.5">Clinical Notes</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentRecords.length > 0 ? (
                currentRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3.5 font-mono font-semibold text-sky-700 whitespace-nowrap">
                      {r.id}
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className="font-mono tabular-nums text-slate-800 font-medium">
                        {r.age} yrs
                      </span>
                      <span className="text-slate-400 text-[11px] ml-1.5">({r.ageGroup})</span>
                    </td>
                    <td className="py-3 px-3.5 font-mono tabular-nums text-slate-600 whitespace-nowrap">
                      {r.visitDate}
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className="text-slate-800 font-medium">{r.department}</span>
                    </td>
                    <td className="py-3 px-3.5 text-slate-700 max-w-xs truncate">
                      {r.diagnosisCategory}
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className="text-xs text-slate-600">
                        {r.dischargeStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-slate-500 max-w-xs truncate text-[11px]">
                      {r.notes || '—'}
                    </td>
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(r)}
                          className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-md transition-colors"
                          title="Edit patient record"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingRecordId(r.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Delete patient record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    <p className="text-xs mb-1">No matching patient records found.</p>
                    <button
                      onClick={handleResetFilters}
                      className="text-xs text-sky-600 hover:underline font-medium"
                    >
                      Clear search filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        {totalPages > 1 && (
          <div className="p-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>
                Showing {startIndex + 1}–{Math.min(startIndex + pageSize, filteredRecords.length)} of{' '}
                {filteredRecords.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={validCurrentPage <= 1}
                className="p-1.5 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono tabular-nums px-2">
                {validCurrentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={validCurrentPage >= totalPages}
                className="p-1.5 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-50 transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Record Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Edit Record: <span className="font-mono text-sky-700">{editingRecord.id}</span>
                </h3>
                <p className="text-xs text-slate-500">Update clinical encounter parameters</p>
              </div>
              <button
                onClick={() => setEditingRecord(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editErrors.general && (
              <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                {editErrors.general}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Age (0 - 120 yrs) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={120}
                    value={editFormData.age}
                    onChange={(e) => setEditFormData({ ...editFormData, age: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                    required
                  />
                  {editErrors.age && <p className="text-[11px] text-rose-600 mt-1">{editErrors.age}</p>}
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Visit Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={editFormData.visitDate}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, visitDate: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                    required
                  />
                  {editErrors.visitDate && (
                    <p className="text-[11px] text-rose-600 mt-1">{editErrors.visitDate}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editFormData.department}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        department: e.target.value as Department,
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-700"
                    required
                  >
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {editErrors.department && (
                    <p className="text-[11px] text-rose-600 mt-1">{editErrors.department}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Discharge Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editFormData.dischargeStatus}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        dischargeStatus: e.target.value as DischargeStatus,
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-700"
                    required
                  >
                    <option value="">Select Status</option>
                    {DISCHARGE_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  {editErrors.dischargeStatus && (
                    <p className="text-[11px] text-rose-600 mt-1">{editErrors.dischargeStatus}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Diagnosis Category <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.diagnosisCategory}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, diagnosisCategory: e.target.value })
                  }
                  placeholder="e.g. Hypertension Stage 2"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                  required
                />
                {editErrors.diagnosisCategory && (
                  <p className="text-[11px] text-rose-600 mt-1">{editErrors.diagnosisCategory}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Clinical Notes (De-identified)
                </label>
                <textarea
                  rows={2}
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingRecordId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-sm w-full p-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Confirm Record Deletion</h3>
                <p className="text-xs text-slate-500">Record ID: {deletingRecordId}</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Are you sure you want to delete patient record <strong className="font-mono">{deletingRecordId}</strong> from the database? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeletingRecordId(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
