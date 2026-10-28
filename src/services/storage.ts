import {
  AgeGroup,
  AnalyticsSummary,
  Department,
  DischargeStatus,
  PatientRecord,
  PatientRecordFormData,
  ValidationErrors,
  getAgeGroup,
} from '../types/patient';

const STORAGE_KEY = 'hospital_patient_data_records_v1';
const INITIALIZED_KEY = 'hospital_patient_data_initialized_v1';

// 45 clearly fictional demonstration records
const INITIAL_DEMO_RECORDS: Omit<PatientRecord, 'createdAt' | 'updatedAt'>[] = [
  { id: 'PID-1001', age: 45, ageGroup: '36-50', visitDate: '2026-01-12', department: 'Cardiology', diagnosisCategory: 'Hypertension Stage 2', dischargeStatus: 'Discharged', notes: 'Routine checkup, blood pressure stabilized' },
  { id: 'PID-1002', age: 29, ageGroup: '19-35', visitDate: '2026-01-18', department: 'General Medicine', diagnosisCategory: 'Acute Gastroenteritis', dischargeStatus: 'Discharged', notes: 'IV fluids administered, discharged with oral rehydration salts' },
  { id: 'PID-1003', age: 68, ageGroup: '66+', visitDate: '2026-01-24', department: 'Orthopedics', diagnosisCategory: 'Osteoarthritis of Knee', dischargeStatus: 'Follow-up Scheduled', notes: 'Physical therapy referral made' },
  { id: 'PID-1004', age: 14, ageGroup: '0-18', visitDate: '2026-02-03', department: 'Pediatrics', diagnosisCategory: 'Asthma Exacerbation', dischargeStatus: 'Under Observation', notes: 'Nebulization completed, pulse oximetry 98%' },
  { id: 'PID-1005', age: 52, ageGroup: '51-65', visitDate: '2026-02-14', department: 'Oncology', diagnosisCategory: 'Colorectal Neoplasm Follow-up', dischargeStatus: 'Admitted', notes: 'Elective admission for chemotherapy cycle 3' },
  { id: 'PID-1006', age: 38, ageGroup: '36-50', visitDate: '2026-02-21', department: 'Neurology', diagnosisCategory: 'Migraine with Aura', dischargeStatus: 'Discharged', notes: 'Triptan prescribed, lifestyle modifications discussed' },
  { id: 'PID-1007', age: 22, ageGroup: '19-35', visitDate: '2026-03-02', department: 'Emergency', diagnosisCategory: 'Acute Blunt Trauma', dischargeStatus: 'Transferred', notes: 'Transferred to Level 1 surgical trauma unit' },
  { id: 'PID-1008', age: 74, ageGroup: '66+', visitDate: '2026-03-09', department: 'Cardiology', diagnosisCategory: 'Atrial Fibrillation', dischargeStatus: 'Admitted', notes: 'Anticoagulation initiation, telemetry monitoring' },
  { id: 'PID-1009', age: 31, ageGroup: '19-35', visitDate: '2026-03-15', department: 'Dermatology', diagnosisCategory: 'Psoriasis Vulgaris', dischargeStatus: 'Discharged', notes: 'Topical corticosteroid maintenance plan' },
  { id: 'PID-1010', age: 8, ageGroup: '0-18', visitDate: '2026-03-22', department: 'Pediatrics', diagnosisCategory: 'Streptococcal Pharyngitis', dischargeStatus: 'Discharged', notes: 'Antibiotic therapy initiated' },
  { id: 'PID-1011', age: 61, ageGroup: '51-65', visitDate: '2026-04-05', department: 'General Medicine', diagnosisCategory: 'Type 2 Diabetes Mellitus', dischargeStatus: 'Follow-up Scheduled', notes: 'HbA1c test ordered, metformin titration' },
  { id: 'PID-1012', age: 49, ageGroup: '36-50', visitDate: '2026-04-12', department: 'Orthopedics', diagnosisCategory: 'Lumbar Disc Herniation', dischargeStatus: 'Under Observation', notes: 'Conservative pain management trial' },
  { id: 'PID-1013', age: 67, ageGroup: '66+', visitDate: '2026-04-19', department: 'Neurology', diagnosisCategory: 'Ischemic Stroke', dischargeStatus: 'Admitted', notes: 'Stroke protocol activated, antiplatelet therapy' },
  { id: 'PID-1014', age: 26, ageGroup: '19-35', visitDate: '2026-04-26', department: 'Dermatology', diagnosisCategory: 'Atopic Dermatitis', dischargeStatus: 'Discharged', notes: 'Emollient therapy education' },
  { id: 'PID-1015', age: 58, ageGroup: '51-65', visitDate: '2026-05-03', department: 'Cardiology', diagnosisCategory: 'Coronary Artery Disease', dischargeStatus: 'Follow-up Scheduled', notes: 'Echocardiogram completed, stable angina' },
  { id: 'PID-1016', age: 34, ageGroup: '19-35', visitDate: '2026-05-11', department: 'Emergency', diagnosisCategory: 'Acute Abdominal Pain', dischargeStatus: 'Under Observation', notes: 'Rule out acute appendicitis, ultrasound pending' },
  { id: 'PID-1017', age: 6, ageGroup: '0-18', visitDate: '2026-05-18', department: 'Pediatrics', diagnosisCategory: 'Viral Gastroenteritis', dischargeStatus: 'Discharged', notes: 'Tolerating oral intake, discharged in good condition' },
  { id: 'PID-1018', age: 63, ageGroup: '51-65', visitDate: '2026-05-27', department: 'Oncology', diagnosisCategory: 'Breast Carcinoma Monitoring', dischargeStatus: 'Discharged', notes: 'Mammogram and tumor markers within target limits' },
  { id: 'PID-1019', age: 41, ageGroup: '36-50', visitDate: '2026-06-04', department: 'General Medicine', diagnosisCategory: 'Community-Acquired Pneumonia', dischargeStatus: 'Admitted', notes: 'Moderate pneumonia, oxygen therapy via nasal cannula' },
  { id: 'PID-1020', age: 25, ageGroup: '19-35', visitDate: '2026-06-12', department: 'Orthopedics', diagnosisCategory: 'Radial Fracture', dischargeStatus: 'Discharged', notes: 'Closed reduction performed, fiberglass cast applied' },
  { id: 'PID-1021', age: 79, ageGroup: '66+', visitDate: '2026-06-20', department: 'Neurology', diagnosisCategory: 'Peripheral Neuropathy', dischargeStatus: 'Follow-up Scheduled', notes: 'Nerve conduction studies reviewed' },
  { id: 'PID-1022', age: 47, ageGroup: '36-50', visitDate: '2026-07-02', department: 'Cardiology', diagnosisCategory: 'Congestive Heart Failure', dischargeStatus: 'Admitted', notes: 'Volume overload, IV furosemide regimen' },
  { id: 'PID-1023', age: 19, ageGroup: '19-35', visitDate: '2026-07-09', department: 'Emergency', diagnosisCategory: 'Anaphylactic Reaction', dischargeStatus: 'Under Observation', notes: 'Intramuscular epinephrine given, stabilized' },
  { id: 'PID-1024', age: 53, ageGroup: '51-65', visitDate: '2026-07-16', department: 'General Medicine', diagnosisCategory: 'Urinary Tract Infection', dischargeStatus: 'Discharged', notes: 'Oral ciprofloxacin course prescribed' },
  { id: 'PID-1025', age: 71, ageGroup: '66+', visitDate: '2026-07-23', department: 'Oncology', diagnosisCategory: 'Lymphoma Evaluation', dischargeStatus: 'Admitted', notes: 'Staging PET-CT scheduled' },
  { id: 'PID-1026', age: 36, ageGroup: '36-50', visitDate: '2026-08-01', department: 'Dermatology', diagnosisCategory: 'Contact Dermatitis', dischargeStatus: 'Discharged', notes: 'Patch testing scheduled' },
  { id: 'PID-1027', age: 12, ageGroup: '0-18', visitDate: '2026-08-08', department: 'Pediatrics', diagnosisCategory: 'Acute Bronchitis', dischargeStatus: 'Discharged', notes: 'Symptomatic treatment, hydration' },
  { id: 'PID-1028', age: 59, ageGroup: '51-65', visitDate: '2026-08-15', department: 'Orthopedics', diagnosisCategory: 'Rotator Cuff Tear', dischargeStatus: 'Follow-up Scheduled', notes: 'Arthroscopic surgery consultation' },
  { id: 'PID-1029', age: 44, ageGroup: '36-50', visitDate: '2026-08-22', department: 'Neurology', diagnosisCategory: 'Epilepsy Evaluation', dischargeStatus: 'Under Observation', notes: '24-hour ambulatory EEG recording' },
  { id: 'PID-1030', age: 82, ageGroup: '66+', visitDate: '2026-08-29', department: 'Emergency', diagnosisCategory: 'Hypertensive Crisis', dischargeStatus: 'Admitted', notes: 'BP 210/115, labetalol infusion' },
  { id: 'PID-1031', age: 33, ageGroup: '19-35', visitDate: '2026-09-04', department: 'Cardiology', diagnosisCategory: 'Angina Pectoris', dischargeStatus: 'Follow-up Scheduled', notes: 'Treadmill stress test arranged' },
  { id: 'PID-1032', age: 56, ageGroup: '51-65', visitDate: '2026-09-11', department: 'General Medicine', diagnosisCategory: 'Vitamin D Deficiency', dischargeStatus: 'Discharged', notes: 'High dose weekly cholecalciferol' },
  { id: 'PID-1033', age: 28, ageGroup: '19-35', visitDate: '2026-09-18', department: 'Orthopedics', diagnosisCategory: 'ACL Sprain', dischargeStatus: 'Discharged', notes: 'Hinged knee brace fitted, RICE protocol' },
  { id: 'PID-1034', age: 65, ageGroup: '51-65', visitDate: '2026-09-25', department: 'Oncology', diagnosisCategory: 'Benign Thyroid Nodule', dischargeStatus: 'Discharged', notes: 'Fine needle aspiration confirmed benign' },
  { id: 'PID-1035', age: 4, ageGroup: '0-18', visitDate: '2026-10-02', department: 'Pediatrics', diagnosisCategory: 'Febrile Seizure', dischargeStatus: 'Under Observation', notes: 'Single brief seizure, fever reduced, watchful waiting' },
  { id: 'PID-1036', age: 50, ageGroup: '36-50', visitDate: '2026-10-08', department: 'Cardiology', diagnosisCategory: 'Hypertension Stage 2', dischargeStatus: 'Discharged', notes: 'Combination antihypertensive started' },
  { id: 'PID-1037', age: 72, ageGroup: '66+', visitDate: '2026-10-14', department: 'Emergency', diagnosisCategory: 'Severe Dehydration', dischargeStatus: 'Under Observation', notes: 'Electrolytes balanced with normal saline' },
  { id: 'PID-1038', age: 43, ageGroup: '36-50', visitDate: '2026-10-18', department: 'Neurology', diagnosisCategory: 'Tension Headache', dischargeStatus: 'Discharged', notes: 'Stress reduction and sleep hygiene counseling' },
  { id: 'PID-1039', age: 62, ageGroup: '51-65', visitDate: '2026-10-22', department: 'Oncology', diagnosisCategory: 'Leukemia Maintenance', dischargeStatus: 'Follow-up Scheduled', notes: 'Complete blood count stable' },
  { id: 'PID-1040', age: 27, ageGroup: '19-35', visitDate: '2026-10-25', department: 'Dermatology', diagnosisCategory: 'Superficial Fungal Infection', dischargeStatus: 'Discharged', notes: 'Antifungal cream application twice daily' },
];

export class PatientStorageService {
  /**
   * Initializes database with synthetic demonstration records if not already initialized
   */
  public static init(): void {
    const initialized = localStorage.getItem(INITIALIZED_KEY);
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!initialized || !existing) {
      this.resetToSampleData();
    }
  }

  /**
   * Retrieves all records sorted by visitDate descending
   */
  public static getAllRecords(): PatientRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const records: PatientRecord[] = JSON.parse(data);
      return records.sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());
    } catch (e) {
      console.error('Failed to parse patient records from localStorage', e);
      return [];
    }
  }

  /**
   * Retrieves single record by ID
   */
  public static getRecordById(id: string): PatientRecord | undefined {
    const records = this.getAllRecords();
    return records.find((r) => r.id.toLowerCase() === id.trim().toLowerCase());
  }

  /**
   * Generates next unique patient ID (e.g. PID-1041)
   */
  public static generateNextId(): string {
    const records = this.getAllRecords();
    if (records.length === 0) return 'PID-1001';
    
    let maxNumber = 1000;
    records.forEach((r) => {
      const match = r.id.match(/^PID-(\d+)$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNumber) {
          maxNumber = num;
        }
      }
    });

    return `PID-${maxNumber + 1}`;
  }

  /**
   * Validates form data according to requirements
   */
  public static validate(data: PatientRecordFormData, isUpdate = false): ValidationErrors {
    const errors: ValidationErrors = {};

    // Validate Age (0 to 120)
    const ageNum = Number(data.age);
    if (data.age === '' || isNaN(ageNum)) {
      errors.age = 'Patient age is required and must be a valid number.';
    } else if (!Number.isInteger(ageNum)) {
      errors.age = 'Age must be an integer.';
    } else if (ageNum < 0 || ageNum > 120) {
      errors.age = 'Age must be between 0 and 120 years.';
    }

    // Validate Visit Date
    if (!data.visitDate) {
      errors.visitDate = 'Visit date is required.';
    } else {
      const dateObj = new Date(data.visitDate);
      if (isNaN(dateObj.getTime())) {
        errors.visitDate = 'Please enter a valid calendar date (YYYY-MM-DD).';
      } else {
        const year = dateObj.getFullYear();
        if (year < 2000 || year > 2030) {
          errors.visitDate = 'Visit date must be between years 2000 and 2030.';
        }
      }
    }

    // Validate Department
    if (!data.department) {
      errors.department = 'Please select a hospital department.';
    }

    // Validate Diagnosis Category
    if (!data.diagnosisCategory || !data.diagnosisCategory.trim()) {
      errors.diagnosisCategory = 'Diagnosis category cannot be blank.';
    } else if (data.diagnosisCategory.trim().length < 3) {
      errors.diagnosisCategory = 'Diagnosis must be at least 3 characters.';
    }

    // Validate Discharge Status
    if (!data.dischargeStatus) {
      errors.dischargeStatus = 'Please select a discharge status.';
    }

    return errors;
  }

  /**
   * Inserts a new record
   */
  public static addRecord(data: PatientRecordFormData): { success: boolean; record?: PatientRecord; errors?: ValidationErrors } {
    const errors = this.validate(data);
    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    const id = data.id?.trim() || this.generateNextId();
    const existing = this.getRecordById(id);
    if (existing) {
      return { success: false, errors: { general: `Record ID ${id} already exists in database.` } };
    }

    const age = Number(data.age);
    const now = new Date().toISOString();
    const newRecord: PatientRecord = {
      id,
      age,
      ageGroup: getAgeGroup(age),
      visitDate: data.visitDate,
      department: data.department as Department,
      diagnosisCategory: data.diagnosisCategory.trim(),
      dischargeStatus: data.dischargeStatus as DischargeStatus,
      notes: data.notes?.trim() || '',
      createdAt: now,
      updatedAt: now,
    };

    const records = this.getAllRecords();
    records.push(newRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));

    return { success: true, record: newRecord };
  }

  /**
   * Updates an existing record
   */
  public static updateRecord(id: string, data: PatientRecordFormData): { success: boolean; record?: PatientRecord; errors?: ValidationErrors } {
    const errors = this.validate(data, true);
    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    const records = this.getAllRecords();
    const index = records.findIndex((r) => r.id.toLowerCase() === id.trim().toLowerCase());
    if (index === -1) {
      return { success: false, errors: { general: `Record ${id} not found.` } };
    }

    const age = Number(data.age);
    const updated: PatientRecord = {
      ...records[index],
      age,
      ageGroup: getAgeGroup(age),
      visitDate: data.visitDate,
      department: data.department as Department,
      diagnosisCategory: data.diagnosisCategory.trim(),
      dischargeStatus: data.dischargeStatus as DischargeStatus,
      notes: data.notes !== undefined ? data.notes.trim() : records[index].notes,
      updatedAt: new Date().toISOString(),
    };

    records[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));

    return { success: true, record: updated };
  }

  /**
   * Deletes a record by ID
   */
  public static deleteRecord(id: string): boolean {
    const records = this.getAllRecords();
    const filtered = records.filter((r) => r.id.toLowerCase() !== id.trim().toLowerCase());
    if (filtered.length === records.length) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  /**
   * Resets database to default synthetic demonstration records
   */
  public static resetToSampleData(): void {
    const timestamp = new Date().toISOString();
    const populated: PatientRecord[] = INITIAL_DEMO_RECORDS.map((r) => ({
      ...r,
      createdAt: timestamp,
      updatedAt: timestamp,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(populated));
    localStorage.setItem(INITIALIZED_KEY, 'true');
  }

  /**
   * Clears all records (for testing empty states)
   */
  public static clearAllRecords(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }

  /**
   * Computes comprehensive Pandas-equivalent analytics summary
   */
  public static getAnalyticsSummary(): AnalyticsSummary {
    const records = this.getAllRecords();
    const totalRecords = records.length;
    const totalVisits = records.length;

    const departmentCounts: Record<string, number> = {};
    const dischargeCounts: Record<string, number> = {};
    const ageGroupCounts: Record<string, number> = {
      '0-18': 0,
      '19-35': 0,
      '36-50': 0,
      '51-65': 0,
      '66+': 0,
    };
    const monthlyVisits: Record<string, number> = {};

    let sumAge = 0;
    const ages: number[] = [];

    // Duplicate detection map
    const signatureMap = new Map<string, number>();
    let duplicateCount = 0;

    records.forEach((r) => {
      // Department
      departmentCounts[r.department] = (departmentCounts[r.department] || 0) + 1;

      // Discharge
      dischargeCounts[r.dischargeStatus] = (dischargeCounts[r.dischargeStatus] || 0) + 1;

      // Age Group
      ageGroupCounts[r.ageGroup] = (ageGroupCounts[r.ageGroup] || 0) + 1;

      // Monthly Visits (YYYY-MM)
      if (r.visitDate) {
        const monthKey = r.visitDate.substring(0, 7); // "2026-03"
        monthlyVisits[monthKey] = (monthlyVisits[monthKey] || 0) + 1;
      }

      // Age stats
      if (typeof r.age === 'number') {
        sumAge += r.age;
        ages.push(r.age);
      }

      // Duplicate signature: age + visitDate + department + diagnosis
      const sig = `${r.age}|${r.visitDate}|${r.department}|${r.diagnosisCategory.toLowerCase()}`;
      const count = signatureMap.get(sig) || 0;
      if (count > 0) {
        duplicateCount++;
      }
      signatureMap.set(sig, count + 1);
    });

    // Sort ages for median
    ages.sort((a, b) => a - b);
    const mean = totalRecords > 0 ? parseFloat((sumAge / totalRecords).toFixed(1)) : 0;
    let median = 0;
    if (ages.length > 0) {
      const mid = Math.floor(ages.length / 2);
      median = ages.length % 2 !== 0 ? ages[mid] : parseFloat(((ages[mid - 1] + ages[mid]) / 2).toFixed(1));
    }
    const min = ages.length > 0 ? ages[0] : 0;
    const max = ages.length > 0 ? ages[ages.length - 1] : 0;

    // Standard deviation
    let stdDev = 0;
    if (ages.length > 1) {
      const variance = ages.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (ages.length - 1);
      stdDev = parseFloat(Math.sqrt(variance).toFixed(2));
    }

    // Missing value checks
    const missingValues = [
      {
        column: 'Patient ID',
        missingCount: records.filter((r) => !r.id).length,
        percentage: 0,
      },
      {
        column: 'Age',
        missingCount: records.filter((r) => r.age === undefined || r.age === null || isNaN(r.age)).length,
        percentage: 0,
      },
      {
        column: 'Visit Date',
        missingCount: records.filter((r) => !r.visitDate).length,
        percentage: 0,
      },
      {
        column: 'Department',
        missingCount: records.filter((r) => !r.department).length,
        percentage: 0,
      },
      {
        column: 'Diagnosis Category',
        missingCount: records.filter((r) => !r.diagnosisCategory).length,
        percentage: 0,
      },
      {
        column: 'Discharge Status',
        missingCount: records.filter((r) => !r.dischargeStatus).length,
        percentage: 0,
      },
    ].map((item) => ({
      ...item,
      percentage: totalRecords > 0 ? parseFloat(((item.missingCount / totalRecords) * 100).toFixed(1)) : 0,
    }));

    // Contingency table: Department vs Discharge Status
    const depts = Object.keys(departmentCounts).sort();
    const contingencyTable = depts.map((dept) => {
      const deptRecords = records.filter((r) => r.department === dept);
      const discharged = deptRecords.filter((r) => r.dischargeStatus === 'Discharged').length;
      const admitted = deptRecords.filter((r) => r.dischargeStatus === 'Admitted').length;
      const observation = deptRecords.filter((r) => r.dischargeStatus === 'Under Observation').length;
      const transferred = deptRecords.filter((r) => r.dischargeStatus === 'Transferred').length;
      const followUp = deptRecords.filter((r) => r.dischargeStatus === 'Follow-up Scheduled').length;
      return {
        department: dept,
        discharged,
        admitted,
        observation,
        transferred,
        followUp,
        total: deptRecords.length,
      };
    });

    return {
      totalRecords,
      totalVisits,
      departmentCounts,
      dischargeCounts,
      ageGroupCounts,
      monthlyVisits,
      ageStats: { mean, median, min, max, stdDev },
      missingValues,
      duplicateCount,
      contingencyTable,
    };
  }

  /**
   * Generates CSV string of patient records
   */
  public static exportToCsv(recordsToExport?: PatientRecord[]): string {
    const records = recordsToExport || this.getAllRecords();
    const headers = ['Record_ID', 'Age', 'Age_Group', 'Visit_Date', 'Department', 'Diagnosis_Category', 'Discharge_Status', 'Clinical_Notes', 'Created_At'];
    const rows = records.map((r) => [
      r.id,
      r.age,
      r.ageGroup,
      r.visitDate,
      `"${r.department}"`,
      `"${r.diagnosisCategory.replace(/"/g, '""')}"`,
      `"${r.dischargeStatus}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
      r.createdAt,
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }

  /**
   * Generates CSV summary analytics report
   */
  public static exportAnalyticsReportCsv(): string {
    const summary = this.getAnalyticsSummary();
    const lines: string[] = [
      '# HOSPITAL PATIENT DATA ANALYSIS SYSTEM - SUMMARY REPORT',
      `# Generated at: ${new Date().toISOString()}`,
      `# Total Patient Records: ${summary.totalRecords}`,
      `# Total Hospital Visits: ${summary.totalVisits}`,
      `# Unique Departments: ${Object.keys(summary.departmentCounts).length}`,
      '',
      '## 1. AGE DEMOGRAPHICS (PANDAS STATISTICAL SUMMARY)',
      'Metric,Value',
      `Mean Age,${summary.ageStats.mean}`,
      `Median Age,${summary.ageStats.median}`,
      `Standard Deviation,${summary.ageStats.stdDev}`,
      `Minimum Age,${summary.ageStats.min}`,
      `Maximum Age,${summary.ageStats.max}`,
      '',
      '## 2. DEPARTMENT-WISE RECORDS',
      'Department,Record_Count,Percentage',
      ...Object.entries(summary.departmentCounts).map(([dept, count]) => {
        const pct = summary.totalRecords > 0 ? ((count / summary.totalRecords) * 100).toFixed(1) : '0';
        return `"${dept}",${count},${pct}%`;
      }),
      '',
      '## 3. DISCHARGE STATUS DISTRIBUTION',
      'Discharge_Status,Count,Percentage',
      ...Object.entries(summary.dischargeCounts).map(([status, count]) => {
        const pct = summary.totalRecords > 0 ? ((count / summary.totalRecords) * 100).toFixed(1) : '0';
        return `"${status}",${count},${pct}%`;
      }),
      '',
      '## 4. MONTHLY VISIT TRENDS',
      'Month,Visits',
      ...Object.entries(summary.monthlyVisits)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, count]) => `${month},${count}`),
      '',
      '## 5. DATA HYGIENE AND INTEGRITY AUDIT',
      'Column,Missing_Count,Missing_Percentage',
      ...summary.missingValues.map((m) => `"${m.column}",${m.missingCount},${m.percentage}%`),
      `Identified Duplicate Records,${summary.duplicateCount},--`,
    ];

    return lines.join('\n');
  }
}
