"""
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
    """Renders the main clinical dashboard with KPIs and chart containers."""
    records = database.get_all_records()
    total_records = len(records)
    departments_set = {r['department'] for r in records}
    
    # Discharge status tally
    discharge_tally = {}
    for r in records:
        status = r['discharge_status']
        discharge_tally[status] = discharge_tally.get(status, 0) + 1

    # Most recent 5 records
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
    """Displays patient records table with search, filter, and pagination."""
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

    # Basic pagination (10 per page)
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
    """Handles adding a new patient record with rigorous validation."""
    if request.method == 'POST':
        age_raw = request.form.get('age', '').strip()
        visit_date = request.form.get('visit_date', '').strip()
        department = request.form.get('department', '').strip()
        diagnosis = request.form.get('diagnosis_category', '').strip()
        status = request.form.get('discharge_status', '').strip()
        notes = request.form.get('notes', '').strip()

        # Validation rules
        errors = []
        try:
            age = int(age_raw)
            if age < 0 or age > 120:
                errors.append("Patient age must be between 0 and 120 years.")
        except ValueError:
            errors.append("Age must be a valid integer number.")

        if not visit_date:
            errors.append("Visit date is required.")
        else:
            try:
                parsed_date = datetime.strptime(visit_date, '%Y-%m-%d')
                if parsed_date.year < 2000 or parsed_date.year > 2030:
                    errors.append("Visit date year must be between 2000 and 2030.")
            except ValueError:
                errors.append("Visit date must be in YYYY-MM-DD format.")

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

        # Generate unique ID and insert
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
    """Handles updating an existing patient record."""
    record = database.get_record_by_id(record_id)
    if not record:
        flash(f"Record with ID '{record_id}' not found.", 'danger')
        return redirect(url_for('records_view'))

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
            return render_template('edit_record.html', record=request.form, record_id=record_id, departments=DEPARTMENTS, discharge_statuses=DISCHARGE_STATUSES)

        database.update_record(record_id, age, visit_date, department, diagnosis, status, notes)
        flash(f"Record {record_id} successfully updated!", 'success')
        return redirect(url_for('records_view'))

    return render_template('edit_record.html', record=record, record_id=record_id, departments=DEPARTMENTS, discharge_statuses=DISCHARGE_STATUSES)

@app.route('/records/delete/<record_id>', methods=['POST'])
def delete_record(record_id):
    """Deletes a patient record with flash confirmation."""
    record = database.get_record_by_id(record_id)
    if not record:
        flash(f"Record {record_id} could not be found.", 'warning')
    else:
        database.delete_record(record_id)
        flash(f"Patient record {record_id} was deleted successfully.", 'info')
    return redirect(url_for('records_view'))

@app.route('/analytics')
def analytics():
    """Exploratory Data Analysis using Pandas summaries and data hygiene checks."""
    analysis = database.get_pandas_analytics()
    return render_template('analytics.html', analysis=analysis)

@app.route('/reports')
def reports():
    """Generates analytical report summaries and export options."""
    analysis = database.get_pandas_analytics()
    records = database.get_all_records()
    return render_template('reports.html', analysis=analysis, records=records[:10], total_records=len(records))

@app.route('/reports/export-csv')
def export_csv():
    """Streams patient records as a downloadable CSV file."""
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
    """Academic project documentation for 2nd-year B.Tech CSE (AI/ML)."""
    return render_template('about.html')

@app.route('/api/chart-data')
def api_chart_data():
    """Returns aggregated chart metrics in JSON for Chart.js rendering."""
    analysis = database.get_pandas_analytics()
    return jsonify({
        'departments': analysis['dept_counts'],
        'monthly_visits': analysis['monthly_visits'],
        'age_groups': analysis['age_group_counts'],
        'discharge_status': analysis['discharge_counts']
    })

@app.route('/api/reset-sample', methods=['POST'])
def api_reset_sample():
    """Resets the SQLite database to the canonical demonstration records."""
    conn = database.get_db_connection()
    conn.execute("DELETE FROM patient_records")
    conn.commit()
    database.seed_sample_records(conn)
    conn.close()
    flash("Database reset with 30 synthetic demonstration records.", 'success')
    return redirect(url_for('dashboard'))

if __name__ == '__main__':
    # Local development server for B.Tech CSE college viva / evaluation
    print("Starting Hospital Patient Data Analysis System on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
