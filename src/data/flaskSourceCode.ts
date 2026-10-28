/**
 * Pre-packaged source code files of the Python Flask backend
 * for in-browser inspection, copying, and one-click ZIP download.
 */

export interface FlaskSourceFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

export const FLASK_FILES: FlaskSourceFile[] = [
  {
    name: 'app.py',
    path: 'app.py',
    language: 'python',
    content: `"""
Hospital Patient Data Analysis System
2nd-Year B.Tech CSE (AI/ML) College Project
Flask Web Application Entry Point
"""

from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, Response
import csv
import io
from datetime import datetime
import database

app = Flask(__name__)
app.secret_key = 'hospital-btech-aiml-edu-secret-key-2026'

# Initialize database schema and synthetic demonstration data on startup
with app.app_context():
    database.init_db(seed_sample_if_empty=True)

DEPARTMENTS = [
    'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics',
    'Oncology', 'General Medicine', 'Emergency', 'Dermatology'
]

DISCHARGE_STATUSES = [
    'Discharged', 'Admitted', 'Under Observation', 'Transferred', 'Follow-up Scheduled'
]

AGE_GROUPS = ['0-18', '19-35', '36-50', '51-65', '66+']

@app.route('/')
def dashboard():
    records = database.get_all_records()
    total_records = len(records)
    departments_set = {r['department'] for r in records}
    
    discharge_tally = {}
    for r in records:
        status = r['discharge_status']
        discharge_tally[status] = discharge_tally.get(status, 0) + 1

    recent_records = records[:5]

    return render_template(
        'index.html',
        total_records=total_records,
        total_departments=len(departments_set),
        discharge_tally=discharge_tally,
        recent_records=recent_records
    )

@app.route('/records')
def records_view():
    search = request.args.get('search', '').strip()
    department = request.args.get('department', '').strip()
    discharge_status = request.args.get('discharge_status', '').strip()
    age_group = request.args.get('age_group', '').strip()

    all_records = database.get_all_records(
        search=search,
        department=department,
        discharge_status=discharge_status,
        age_group=age_group
    )

    page = int(request.args.get('page', 1))
    per_page = 10
    total = len(all_records)
    total_pages = max(1, (total + per_page - 1) // per_page)
    page = min(max(1, page), total_pages)
    
    start_idx = (page - 1) * per_page
    end_idx = start_idx + per_page
    paginated_records = all_records[start_idx:end_idx]

    return render_template(
        'records.html',
        records=paginated_records,
        departments=DEPARTMENTS,
        discharge_statuses=DISCHARGE_STATUSES,
        age_groups=AGE_GROUPS,
        current_search=search,
        current_department=department,
        current_status=discharge_status,
        current_age_group=age_group,
        page=page,
        total_pages=total_pages,
        total_records=total
    )

@app.route('/records/add', methods=['GET', 'POST'])
def add_record():
    if request.method == 'POST':
        age_raw = request.form.get('age', '').strip()
        visit_date = request.form.get('visit_date', '').strip()
        department = request.form.get('department', '').strip()
        diagnosis = request.form.get('diagnosis_category', '').strip()
        status = request.form.get('discharge_status', '').strip()
        notes = request.form.get('notes', '').strip()

        errors = []
        try:
            age = int(age_raw)
            if age < 0 or age > 120:
                errors.append("Patient age must be between 0 and 120 years.")
        except ValueError:
            errors.append("Age must be a valid integer number.")

        if not visit_date:
            errors.append("Visit date is required.")

        if department not in DEPARTMENTS:
            errors.append("Please select a valid hospital department.")

        if not diagnosis or len(diagnosis) < 3:
            errors.append("Diagnosis category must be at least 3 characters.")

        if status not in DISCHARGE_STATUSES:
            errors.append("Please select a valid discharge status.")

        if errors:
            for err in errors:
                flash(err, 'danger')
            return render_template(
                'add_record.html',
                departments=DEPARTMENTS,
                discharge_statuses=DISCHARGE_STATUSES,
                form_data=request.form
            )

        new_id = database.generate_next_id()
        database.insert_record(new_id, age, visit_date, department, diagnosis, status, notes)
        flash(f"Patient record {new_id} successfully created!", 'success')
        return redirect(url_for('records_view'))

    return render_template(
        'add_record.html',
        departments=DEPARTMENTS,
        discharge_statuses=DISCHARGE_STATUSES,
        form_data={}
    )

@app.route('/records/edit/<record_id>', methods=['GET', 'POST'])
def edit_record(record_id):
    record = database.get_record_by_id(record_id)
    if not record:
        flash(f"Record with ID '{record_id}' not found.", 'danger')
        return redirect(url_for('records_view'))

    if request.method == 'POST':
        age = int(request.form.get('age', 0))
        visit_date = request.form.get('visit_date', '')
        department = request.form.get('department', '')
        diagnosis = request.form.get('diagnosis_category', '')
        status = request.form.get('discharge_status', '')
        notes = request.form.get('notes', '')

        database.update_record(record_id, age, visit_date, department, diagnosis, status, notes)
        flash(f"Record {record_id} successfully updated!", 'success')
        return redirect(url_for('records_view'))

    return render_template('edit_record.html', record=record, record_id=record_id, departments=DEPARTMENTS, discharge_statuses=DISCHARGE_STATUSES)

@app.route('/records/delete/<record_id>', methods=['POST'])
def delete_record(record_id):
    database.delete_record(record_id)
    flash(f"Patient record {record_id} was deleted successfully.", 'info')
    return redirect(url_for('records_view'))

@app.route('/analytics')
def analytics():
    analysis = database.get_pandas_analytics()
    return render_template('analytics.html', analysis=analysis)

@app.route('/reports')
def reports():
    analysis = database.get_pandas_analytics()
    records = database.get_all_records()
    return render_template('reports.html', analysis=analysis, records=records[:10], total_records=len(records))

@app.route('/reports/export-csv')
def export_csv():
    records = database.get_all_records()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Record_ID', 'Age', 'Age_Group', 'Visit_Date', 'Department', 'Diagnosis_Category', 'Discharge_Status', 'Clinical_Notes', 'Created_At'])

    for r in records:
        writer.writerow([r['id'], r['age'], r['age_group'], r['visit_date'], r['department'], r['diagnosis_category'], r['discharge_status'], r['notes'], r['created_at']])

    response = Response(output.getvalue(), mimetype='text/csv')
    response.headers['Content-Disposition'] = 'attachment; filename=hospital_patient_records.csv'
    return response

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/api/chart-data')
def api_chart_data():
    analysis = database.get_pandas_analytics()
    return jsonify({
        'departments': analysis['dept_counts'],
        'monthly_visits': analysis['monthly_visits'],
        'age_groups': analysis['age_group_counts'],
        'discharge_status': analysis['discharge_counts']
    })

if __name__ == '__main__':
    print("Starting Hospital Patient Data Analysis System on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
`,
  },
  {
    name: 'database.py',
    path: 'database.py',
    language: 'python',
    content: `"""
Hospital Patient Data Analysis System
SQLite3 & Pandas Database Integration Module
"""

import sqlite3
import os
from datetime import datetime
import pandas as pd

DB_FILE = os.path.join(os.path.dirname(__file__), 'hospital_data.db')

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def compute_age_group(age: int) -> str:
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
        if cursor.fetchone()['count'] == 0:
            seed_sample_records(conn)
    conn.close()

def seed_sample_records(conn=None):
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
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM patient_records WHERE id = ?", (record_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def insert_record(record_id, age, visit_date, department, diagnosis_category, discharge_status, notes=""):
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
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM patient_records WHERE id = ?", (record_id,))
    conn.commit()
    conn.close()

def get_pandas_analytics():
    conn = get_db_connection()
    df = pd.read_sql_query("SELECT * FROM patient_records", conn)
    conn.close()

    if df.empty:
        return {
            'total_records': 0, 'mean_age': 0, 'median_age': 0, 'std_age': 0,
            'min_age': 0, 'max_age': 0, 'missing_report': [], 'duplicate_count': 0,
            'dept_counts': {}, 'discharge_counts': {}, 'age_group_counts': {},
            'monthly_visits': {}, 'contingency_table': []
        }

    mean_age = round(float(df['age'].mean()), 2)
    median_age = round(float(df['age'].median()), 2)
    std_age = round(float(df['age'].std()), 2) if len(df) > 1 else 0
    min_age = int(df['age'].min())
    max_age = int(df['age'].max())

    missing_report = []
    for col in ['id', 'age', 'visit_date', 'department', 'diagnosis_category', 'discharge_status']:
        count_missing = int(df[col].isnull().sum())
        pct_missing = round((count_missing / len(df)) * 100, 2)
        missing_report.append({'column': col, 'missing': count_missing, 'percentage': pct_missing})

    duplicate_count = int(df.duplicated(subset=['age', 'visit_date', 'department', 'diagnosis_category']).sum())
    dept_counts = df['department'].value_counts().to_dict()
    discharge_counts = df['discharge_status'].value_counts().to_dict()
    age_group_counts = df['age_group'].value_counts().to_dict()

    df['year_month'] = df['visit_date'].str.slice(0, 7)
    monthly_visits = df['year_month'].value_counts().sort_index().to_dict()

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
`,
  },
  {
    name: 'requirements.txt',
    path: 'requirements.txt',
    language: 'text',
    content: `Flask>=3.0.0
pandas>=2.0.0
numpy>=1.24.0`,
  },
  {
    name: 'README.md',
    path: 'README.md',
    language: 'markdown',
    content: `# Hospital Patient Data Analysis System
2nd-Year B.Tech CSE (AI/ML) Academic Project

## Quick Start
1. Install dependencies:
   pip install -r requirements.txt

2. Run Flask server:
   python app.py

3. Open in browser:
   http://127.0.0.1:5000
`,
  },
];
