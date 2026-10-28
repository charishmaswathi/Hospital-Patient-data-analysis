"""
Hospital Patient Data Analysis System
Academic Project - 2nd Year B.Tech CSE (AI/ML)
Database Layer: SQLite3 & Pandas Integration
"""

import sqlite3
import os
from datetime import datetime
import pandas as pd

DB_FILE = os.path.join(os.path.dirname(__file__), 'hospital_data.db')

def get_db_connection():
    """Establishes and returns a connection to the SQLite database with Row factory."""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def compute_age_group(age: int) -> str:
    """Categorizes age into standard clinical demographic bands."""
    if age <= 18:
        return '0-18'
    elif age <= 35:
        return '19-35'
    elif age <= 50:
        return '36-50'
    elif age <= 65:
        return '51-65'
    else:
        return '66+'

def init_db(seed_sample_if_empty=True):
    """
    Initializes the SQLite database and creates the schema if it does not exist.
    Inserts initial synthetic demonstration records without duplicating on restarts.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS patient_records (
        id TEXT PRIMARY KEY,
        age INTEGER NOT NULL CHECK(age >= 0 AND age <= 120),
        age_group TEXT NOT NULL,
        visit_date TEXT NOT NULL,
        department TEXT NOT NULL,
        diagnosis_category TEXT NOT NULL,
        discharge_status TEXT NOT NULL,
        notes TEXT,
        created_at TEXT NOT NULL
    );
    """)
    conn.commit()

    if seed_sample_if_empty:
        cursor.execute("SELECT COUNT(*) AS count FROM patient_records")
        count = cursor.fetchone()['count']
        if count == 0:
            seed_sample_records(conn)

    conn.close()

def seed_sample_records(conn=None):
    """Populates the database with synthetic educational records."""
    close_after = False
    if conn is None:
        conn = get_db_connection()
        close_after = True

    sample_data = [
        ('PID-1001', 45, '36-50', '2026-01-12', 'Cardiology', 'Hypertension Stage 2', 'Discharged', 'Routine checkup, blood pressure stabilized'),
        ('PID-1002', 29, '19-35', '2026-01-18', 'General Medicine', 'Acute Gastroenteritis', 'Discharged', 'IV hydration given, oral rehydration prescribed'),
        ('PID-1003', 68, '66+', '2026-01-24', 'Orthopedics', 'Osteoarthritis of Knee', 'Follow-up Scheduled', 'Physical therapy referral initiated'),
        ('PID-1004', 14, '0-18', '2026-02-03', 'Pediatrics', 'Asthma Exacerbation', 'Under Observation', 'Nebulization completed, pulse oximetry normal'),
        ('PID-1005', 52, '51-65', '2026-02-14', 'Oncology', 'Colorectal Neoplasm Follow-up', 'Admitted', 'Scheduled for chemotherapy cycle'),
        ('PID-1006', 38, '36-50', '2026-02-21', 'Neurology', 'Migraine with Aura', 'Discharged', 'Triptan prescribed, lifestyle guidance given'),
        ('PID-1007', 22, '19-35', '2026-03-02', 'Emergency', 'Acute Blunt Trauma', 'Transferred', 'Transferred to regional trauma center'),
        ('PID-1008', 74, '66+', '2026-03-09', 'Cardiology', 'Atrial Fibrillation', 'Admitted', 'Telemetry monitoring and anticoagulation initiated'),
        ('PID-1009', 31, '19-35', '2026-03-15', 'Dermatology', 'Psoriasis Vulgaris', 'Discharged', 'Topical corticosteroid maintenance plan'),
        ('PID-1010', 8, '0-18', '2026-03-22', 'Pediatrics', 'Streptococcal Pharyngitis', 'Discharged', 'Antibiotic regimen completed'),
        ('PID-1011', 61, '51-65', '2026-04-05', 'General Medicine', 'Type 2 Diabetes Mellitus', 'Follow-up Scheduled', 'HbA1c test ordered, metformin adjusted'),
        ('PID-1012', 49, '36-50', '2026-04-12', 'Orthopedics', 'Lumbar Disc Herniation', 'Under Observation', 'Conservative therapy and MRI evaluation'),
        ('PID-1013', 67, '66+', '2026-04-19', 'Neurology', 'Ischemic Stroke', 'Admitted', 'Stroke rehabilitation care started'),
        ('PID-1014', 26, '19-35', '2026-04-26', 'Dermatology', 'Atopic Dermatitis', 'Discharged', 'Moisturizer therapy and antihistamine'),
        ('PID-1015', 58, '51-65', '2026-05-03', 'Cardiology', 'Coronary Artery Disease', 'Follow-up Scheduled', 'Echocardiogram stable'),
        ('PID-1016', 34, '19-35', '2026-05-11', 'Emergency', 'Acute Abdominal Pain', 'Under Observation', 'Appendicitis ruled out, observation complete'),
        ('PID-1017', 6, '0-18', '2026-05-18', 'Pediatrics', 'Viral Gastroenteritis', 'Discharged', 'Tolerating oral fluids, discharge authorized'),
        ('PID-1018', 63, '51-65', '2026-05-27', 'Oncology', 'Breast Carcinoma Monitoring', 'Discharged', 'Mammogram clean, stable remission'),
        ('PID-1019', 41, '36-50', '2026-06-04', 'General Medicine', 'Community-Acquired Pneumonia', 'Admitted', 'Antibiotic infusion therapy'),
        ('PID-1020', 25, '19-35', '2026-06-12', 'Orthopedics', 'Radial Fracture', 'Discharged', 'Cast applied after closed reduction'),
        ('PID-1021', 79, '66+', '2026-06-20', 'Neurology', 'Peripheral Neuropathy', 'Follow-up Scheduled', 'Nerve conduction test ordered'),
        ('PID-1022', 47, '36-50', '2026-07-02', 'Cardiology', 'Congestive Heart Failure', 'Admitted', 'Diuretic regimen and fluid restriction'),
        ('PID-1023', 19, '19-35', '2026-07-09', 'Emergency', 'Anaphylactic Reaction', 'Under Observation', 'Epinephrine administered, patient stable'),
        ('PID-1024', 53, '51-65', '2026-07-16', 'General Medicine', 'Urinary Tract Infection', 'Discharged', 'Oral antibiotic therapy prescribed'),
        ('PID-1025', 71, '66+', '2026-07-23', 'Oncology', 'Lymphoma Evaluation', 'Admitted', 'Biopsy and staging protocol'),
        ('PID-1026', 36, '36-50', '2026-08-01', 'Dermatology', 'Contact Dermatitis', 'Discharged', 'Allergen avoidance advised'),
        ('PID-1027', 12, '0-18', '2026-08-08', 'Pediatrics', 'Acute Bronchitis', 'Discharged', 'Cough suppressant and bronchodilator'),
        ('PID-1028', 59, '51-65', '2026-08-15', 'Orthopedics', 'Rotator Cuff Tear', 'Follow-up Scheduled', 'Surgical consult booked'),
        ('PID-1029', 44, '36-50', '2026-08-22', 'Neurology', 'Epilepsy Evaluation', 'Under Observation', '24-hour ambulatory EEG recording'),
        ('PID-1030', 82, '66+', '2026-08-29', 'Emergency', 'Hypertensive Crisis', 'Admitted', 'ICU blood pressure titrations'),
    ]

    now = datetime.now().isoformat()
    cursor = conn.cursor()
    for row in sample_data:
        cursor.execute("""
        INSERT OR IGNORE INTO patient_records 
        (id, age, age_group, visit_date, department, diagnosis_category, discharge_status, notes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], now))

    conn.commit()
    if close_after:
        conn.close()

def generate_next_id():
    """Calculates the next incremental patient ID (PID-XXXX)."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM patient_records WHERE id LIKE 'PID-%'")
    rows = cursor.fetchall()
    conn.close()

    max_num = 1000
    for r in rows:
        try:
            num = int(r['id'].replace('PID-', ''))
            if num > max_num:
                max_num = num
        except ValueError:
            continue
    return f"PID-{max_num + 1}"

def get_all_records(search="", department="", discharge_status="", age_group=""):
    """Fetches patient records with parameterized query filters."""
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM patient_records WHERE 1=1"
    params = []

    if search:
        search_param = f"%{search.strip()}%"
        query += " AND (id LIKE ? OR diagnosis_category LIKE ? OR notes LIKE ?)"
        params.extend([search_param, search_param, search_param])

    if department:
        query += " AND department = ?"
        params.append(department)

    if discharge_status:
        query += " AND discharge_status = ?"
        params.append(discharge_status)

    if age_group:
        query += " AND age_group = ?"
        params.append(age_group)

    query += " ORDER BY visit_date DESC"
    cursor.execute(query, params)
    records = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return records

def get_record_by_id(record_id: str):
    """Retrieves a single record by patient ID using parameterized SQL."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM patient_records WHERE id = ?", (record_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def insert_record(record_id, age, visit_date, department, diagnosis_category, discharge_status, notes=""):
    """Inserts a new patient record with parameterized query."""
    age = int(age)
    age_group = compute_age_group(age)
    now = datetime.now().isoformat()

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO patient_records (id, age, age_group, visit_date, department, diagnosis_category, discharge_status, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (record_id, age, age_group, visit_date, department, diagnosis_category, discharge_status, notes, now))
    conn.commit()
    conn.close()

def update_record(record_id, age, visit_date, department, diagnosis_category, discharge_status, notes=""):
    """Updates an existing patient record."""
    age = int(age)
    age_group = compute_age_group(age)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE patient_records
    SET age = ?, age_group = ?, visit_date = ?, department = ?, diagnosis_category = ?, discharge_status = ?, notes = ?
    WHERE id = ?
    """, (age, age_group, visit_date, department, diagnosis_category, discharge_status, notes, record_id))
    conn.commit()
    conn.close()

def delete_record(record_id: str):
    """Deletes a patient record by ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM patient_records WHERE id = ?", (record_id,))
    conn.commit()
    conn.close()

def get_pandas_analytics():
    """
    Uses Pandas DataFrame to perform comprehensive exploratory data analysis (EDA):
    - Descriptive statistics (Mean, Median, Standard Deviation)
    - Data hygiene checks (missing values & duplicate checks)
    - Department & discharge cross-tabulation
    """
    conn = get_db_connection()
    df = pd.read_sql_query("SELECT * FROM patient_records", conn)
    conn.close()

    if df.empty:
        return {
            'total_records': 0,
            'mean_age': 0,
            'median_age': 0,
            'std_age': 0,
            'min_age': 0,
            'max_age': 0,
            'missing_report': [],
            'duplicate_count': 0,
            'dept_counts': {},
            'discharge_counts': {},
            'age_group_counts': {},
            'monthly_visits': {},
            'contingency_table': []
        }

    # Descriptive Statistics on Age
    mean_age = round(float(df['age'].mean()), 2)
    median_age = round(float(df['age'].median()), 2)
    std_age = round(float(df['age'].std()), 2) if len(df) > 1 else 0
    min_age = int(df['age'].min())
    max_age = int(df['age'].max())

    # Data Hygiene & Missing Value Audit
    missing_report = []
    for col in ['id', 'age', 'visit_date', 'department', 'diagnosis_category', 'discharge_status']:
        count_missing = int(df[col].isnull().sum())
        pct_missing = round((count_missing / len(df)) * 100, 2)
        missing_report.append({'column': col, 'missing': count_missing, 'percentage': pct_missing})

    # Duplicate check on clinical attributes
    duplicate_count = int(df.duplicated(subset=['age', 'visit_date', 'department', 'diagnosis_category']).sum())

    # Group counts
    dept_counts = df['department'].value_counts().to_dict()
    discharge_counts = df['discharge_status'].value_counts().to_dict()
    age_group_counts = df['age_group'].value_counts().to_dict()

    # Monthly visit trends
    df['year_month'] = df['visit_date'].str.slice(0, 7)
    monthly_visits = df['year_month'].value_counts().sort_index().to_dict()

    # Cross-tabulation (Department vs Discharge Status)
    cross_tab = pd.crosstab(df['department'], df['discharge_status'])
    contingency = []
    for dept, row in cross_tab.iterrows():
        entry = {'department': dept}
        entry.update(row.to_dict())
        entry['Total'] = int(row.sum())
        contingency.append(entry)

    return {
        'total_records': len(df),
        'mean_age': mean_age,
        'median_age': median_age,
        'std_age': std_age,
        'min_age': min_age,
        'max_age': max_age,
        'missing_report': missing_report,
        'duplicate_count': duplicate_count,
        'dept_counts': dept_counts,
        'discharge_counts': discharge_counts,
        'age_group_counts': age_group_counts,
        'monthly_visits': monthly_visits,
        'contingency_table': contingency
    }
