# Hospital Patient Data Analysis System
**Academic College Project — 2nd-Year B.Tech Computer Science & Engineering (AI/ML)**

---

## 1. Project Objective & Overview
The **Hospital Patient Data Analysis System** is an educational, full-stack data analytics and healthcare administration platform developed for a 2nd-year B.Tech Computer Science & Engineering (Artificial Intelligence and Machine Learning) college curriculum.

### Core Objectives:
- **Organized Record Management**: Facilitate structured CRUD (Create, Read, Update, Delete) operations on synthetic patient hospital visits.
- **Exploratory Data Analysis (EDA)**: Leverage Python `pandas` to calculate descriptive statistics, assess age distributions, and generate cross-tabulations (Department vs. Discharge Status).
- **Interactive Visualizations**: Render real-time clinical trends using `Chart.js` across departments, monthly visits, age groups, and outcomes.
- **Data Hygiene Auditing**: Identify missing attributes and duplicate clinical profiles before machine learning preprocessing.
- **Privacy by Design**: Strictly compliant with healthcare data minimization standards—no personal identifying information (PII) such as patient names, phone numbers, or residential addresses are collected.

> **Disclaimer**: This system is exclusively an academic educational demonstration and is **not** intended for actual clinical diagnosis, triage, or medical treatment decisions.

---

## 2. Technology Stack & Architecture

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend UI** | HTML5, Bootstrap 5.3, CSS3 | Clean healthcare dashboard layout with responsive cards and sidebar |
| **Data Visualizations** | Chart.js 4.x | Interactive doughnut, bar, line, and horizontal bar charts |
| **Backend Framework** | Python 3.10+ & Flask | REST routing, server-side data validation, template rendering |
| **Database** | SQLite3 (`hospital_data.db`) | Local ACID-compliant relational storage with parameterized SQL queries |
| **Analytics Engine** | Pandas & NumPy | Descriptive metrics, aggregation, contingency tables, duplicate checks |
| **Web Preview Runtime** | React 19 + TypeScript + Tailwind | Interactive live container deployment in Google AI Studio |

---

## 3. Directory Structure

```text
hospital-patient-data-analysis/
├── app.py                      # Flask application router & API endpoints
├── database.py                 # SQLite database connection, queries & Pandas EDA
├── requirements.txt            # Python dependencies (Flask, pandas, numpy)
├── README.md                   # Complete academic documentation & run guide
├── static/
│   ├── css/
│   │   └── style.css           # Custom hospital blue/teal styles & responsiveness
│   └── js/
│       ├── charts.js           # Chart.js initialization & dynamic API integration
│       └── main.js             # Form validation & interactive table filters
├── templates/
│   ├── base.html               # Master layout template with sidebar & header
│   ├── index.html              # Main clinical dashboard with KPIs & 4 charts
│   ├── records.html            # Patient records table with search & pagination
│   ├── add_record.html         # Add patient record form with dual validation
│   ├── edit_record.html        # Edit record form
│   ├── analytics.html          # Pandas EDA, data hygiene & contingency matrix
│   ├── reports.html            # Audit summary & CSV export
│   └── about.html              # B.Tech project documentation & Viva questions
└── src/                        # Interactive React SPA live preview engine
```

---

## 4. Local Installation and Setup Guide

### Prerequisites
- Python 3.9, 3.10, 3.11, or 3.12 installed on your system.
- `pip` package manager.
- Any modern web browser (Google Chrome, Firefox, Safari, Edge).

### Step-by-Step Execution:

#### Step 1: Clone or Extract the Project
Extract the project folder onto your computer and open your terminal / command prompt in the directory:
```bash
cd hospital-patient-data-analysis
```

#### Step 2: (Recommended) Create a Virtual Environment
```bash
# On Linux / macOS:
python3 -m venv venv
source venv/bin/activate

# On Windows (cmd.exe):
python -m venv venv
venv\Scripts\activate

# On Windows (PowerShell):
python -m venv venv
venv\Scripts\Activate.ps1
```

#### Step 3: Install Required Dependencies
```bash
pip install -r requirements.txt
```

#### Step 4: Run the Flask Application
```bash
python app.py
```
*(The SQLite database `hospital_data.db` is generated automatically upon the first launch and seeded with 30 synthetic demonstration records without duplicating on subsequent runs).*

#### Step 5: Open in Your Browser
Open your browser and navigate to:
```
http://127.0.0.1:5000
```

---

## 5. Schema & Field Definitions

| Column Name | SQL Type | Description | Permitted Values / Constraints |
|---|---|---|---|
| `id` | `TEXT PRIMARY KEY` | Formatted clinical record ID | `PID-1001` upwards |
| `age` | `INTEGER` | Patient age in complete years | `0` to `120` |
| `age_group` | `TEXT` | Categorical demographic bracket | `0-18`, `19-35`, `36-50`, `51-65`, `66+` |
| `visit_date` | `TEXT` | Date patient presented at hospital | `YYYY-MM-DD` (Years 2000-2030) |
| `department` | `TEXT` | Attending hospital department | Cardiology, Neurology, Pediatrics, Orthopedics, Oncology, General Medicine, Emergency, Dermatology |
| `diagnosis_category` | `TEXT` | Clinical diagnosis summary | Non-empty text ($\ge 3$ characters) |
| `discharge_status` | `TEXT` | Patient disposition outcome | Discharged, Admitted, Under Observation, Transferred, Follow-up Scheduled |
| `notes` | `TEXT` | De-identified clinical notes | Optional observation details |
| `created_at` | `TEXT` | ISO-8601 audit timestamp | Automatically captured |

---

## 6. Testing & Evaluation Checklist

Use this checklist during your college project presentation and viva evaluation:

- [x] **Dashboard KPI Verification**: Verify total records count matches database table size.
- [x] **Real-Time Chart Rendering**: Inspect all 4 charts (Department, Monthly visits, Age groups, Discharge status).
- [x] **Record Insertion & Validation**: Attempt adding a record with Age = `150` (expect validation error) and a valid record (expect success message and updated KPI count).
- [x] **Search & Multi-Filter**: Filter by department "Pediatrics" and verify table updates immediately.
- [x] **Record Update**: Edit a record's discharge status from "Under Observation" to "Discharged".
- [x] **Record Deletion**: Delete a test record and confirm flash notification.
- [x] **Data Hygiene & Pandas Check**: Navigate to the Analytics tab to inspect the Missing-Value matrix and Duplicate detection report.
- [x] **CSV Export**: Click "Export CSV" and verify the generated file can be opened in MS Excel or Google Sheets.
- [x] **Database Idempotency**: Restart the server and verify records are not duplicated.

---

## 7. Troubleshooting Common Errors

1. **`ModuleNotFoundError: No module named 'flask'`**:
   - Solution: Ensure your virtual environment is activated and run `pip install -r requirements.txt`.
2. **`Address already in use (Port 5000)`**:
   - Solution: Run on a different port by changing the last line in `app.py` to `app.run(debug=True, port=5050)` or terminate the lingering process on port 5000.
3. **Database locked / `sqlite3.OperationalError`**:
   - Solution: Make sure no external database viewer (like DB Browser for SQLite) has an uncommitted write lock on `hospital_data.db`.
4. **Missing or Blank Charts**:
   - Solution: Ensure an active internet connection to load the CDN assets for Bootstrap 5 and Chart.js, or serve them locally from `static/js/`.
