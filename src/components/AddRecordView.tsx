import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  FileCheck2,
  HelpCircle,
  Plus,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import {
  COMMON_DIAGNOSES,
  DEPARTMENTS,
  DISCHARGE_STATUSES,
  Department,
  DischargeStatus,
  PatientRecordFormData,
  ValidationErrors,
  getAgeGroup,
} from '../types/patient';
import { PatientStorageService } from '../services/storage';

interface AddRecordViewProps {
  onRecordAdded: () => void;
  onNavigateToRecords: () => void;
}

export const AddRecordView: React.FC<AddRecordViewProps> = ({
  onRecordAdded,
  onNavigateToRecords,
}) => {
  const nextId = PatientStorageService.generateNextId();

  const [formData, setFormData] = useState<PatientRecordFormData>({
    age: '',
    visitDate: new Date().toISOString().split('T')[0],
    department: 'General Medicine',
    diagnosisCategory: '',
    dischargeStatus: 'Discharged',
    notes: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Computed age cohort preview
  const ageNum = Number(formData.age);
  const computedAgeGroup = !isNaN(ageNum) && formData.age !== '' ? getAgeGroup(ageNum) : null;

  // Selected department's common diagnosis suggestions
  const diagnosisSuggestions =
    formData.department && formData.department in COMMON_DIAGNOSES
      ? COMMON_DIAGNOSES[formData.department as Department]
      : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    const result = PatientStorageService.addRecord(formData);
    if (!result.success) {
      setErrors(result.errors || {});
      return;
    }

    setSuccessMessage(`Patient record ${result.record?.id} was created successfully!`);
    setErrors({});
    onRecordAdded();

    // Reset form to defaults
    setFormData({
      age: '',
      visitDate: new Date().toISOString().split('T')[0],
      department: 'General Medicine',
      diagnosisCategory: '',
      dischargeStatus: 'Discharged',
      notes: '',
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Add New Patient Record</h2>
          <p className="text-xs text-slate-500">
            Enter clinical encounter details. Record ID will be auto-indexed.
          </p>
        </div>
        <button
          onClick={onNavigateToRecords}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Records</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs text-emerald-800 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={onNavigateToRecords}
            className="px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline"
          >
            View in Table →
          </button>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errors.general && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
              {errors.general}
            </div>
          )}

          {/* Record ID Indicator */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-slate-500 font-medium">Assigned Record ID:</span>
              <span className="ml-2 font-mono font-bold text-sky-700">{nextId}</span>
            </div>
            <span className="text-[11px] text-slate-400">Sequential Primary Key</span>
          </div>

          {/* Age & Date row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-medium mb-1.5">
                Patient Age (0 - 120 yrs) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={120}
                  step={1}
                  required
                  placeholder="e.g. 45"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
                {computedAgeGroup && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-sky-700 bg-sky-100 px-2 py-0.5 rounded-sm">
                    {computedAgeGroup}
                  </span>
                )}
              </div>
              {errors.age ? (
                <p className="text-[11px] text-rose-600 mt-1">{errors.age}</p>
              ) : (
                <p className="text-[11px] text-slate-400 mt-1">
                  Age determines clinical demographic band (0-18, 19-35, 36-50, 51-65, 66+).
                </p>
              )}
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">
                Visit Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.visitDate}
                onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
              />
              {errors.visitDate ? (
                <p className="text-[11px] text-rose-600 mt-1">{errors.visitDate}</p>
              ) : (
                <p className="text-[11px] text-slate-400 mt-1">Calendar date of hospital admission.</p>
              )}
            </div>
          </div>

          {/* Department & Discharge Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-medium mb-1.5">
                Department <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value as Department })
                }
                className="w-full px-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 cursor-pointer text-slate-700"
              >
                <option value="" disabled>
                  Select Hospital Department
                </option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.department}</p>
              )}
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">
                Discharge Status <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={formData.dischargeStatus}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dischargeStatus: e.target.value as DischargeStatus,
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 cursor-pointer text-slate-700"
              >
                <option value="" disabled>
                  Select Discharge Disposition
                </option>
                {DISCHARGE_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.dischargeStatus && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.dischargeStatus}</p>
              )}
            </div>
          </div>

          {/* Diagnosis Category */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-700 font-medium">
                Diagnosis Category <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Clinical Classification</span>
            </div>
            <input
              type="text"
              required
              minLength={3}
              placeholder="e.g. Hypertension Stage 2, Radial Fracture, Migraine"
              value={formData.diagnosisCategory}
              onChange={(e) => setFormData({ ...formData, diagnosisCategory: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
            />
            {errors.diagnosisCategory && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.diagnosisCategory}</p>
            )}

            {/* Quick Diagnostic Suggestions */}
            {diagnosisSuggestions.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-400">Common {formData.department}:</span>
                {diagnosisSuggestions.map((diag) => (
                  <button
                    key={diag}
                    type="button"
                    onClick={() => setFormData({ ...formData, diagnosisCategory: diag })}
                    className="px-2 py-0.5 text-[11px] text-slate-600 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 rounded-md transition-colors"
                  >
                    {diag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clinical Observation Notes */}
          <div>
            <label className="block text-slate-700 font-medium mb-1.5">
              De-identified Clinical Observation Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Treatment details, observation notes, lab findings..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-xs"
            />
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>
                <strong>Privacy Protocol:</strong> Strictly do not enter real names, phone numbers, or addresses.
              </span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onNavigateToRecords}
              className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              Save Patient Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
