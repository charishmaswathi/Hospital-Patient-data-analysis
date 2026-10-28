import React from 'react';
import {
  AlertTriangle,
  BrainCircuit,
  Building,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  FileCode2,
  GraduationCap,
  HelpCircle,
  Layers,
  Network,
  ShieldCheck,
  Target,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Banner Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap className="w-5 h-5 text-sky-600" />
          <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
            Academic College Project Documentation
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
          Hospital Patient Data Analysis System
        </h1>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          Curriculum project engineered for <strong>2nd-Year B.Tech Computer Science & Engineering (Artificial Intelligence and Machine Learning)</strong>. 
          Combines embedded relational storage (SQLite), statistical exploratory data analysis (Pandas), and dynamic web visualizations (Chart.js) 
          into a modern, responsive clinical administration dashboard.
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
          <div>Course: <span className="text-slate-900 font-semibold">B.Tech CSE (AI/ML)</span></div>
          <span aria-hidden="true">·</span>
          <div>Year / Semester: <span className="text-slate-900 font-semibold">2nd Year / IV Semester</span></div>
          <span aria-hidden="true">·</span>
          <div>Domain: <span className="text-slate-900 font-semibold">Healthcare Informatics & EDA</span></div>
        </div>
      </div>

      {/* 1. Project Objectives */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Target className="w-4 h-4 text-sky-600" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            1. Project Objectives
          </h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          In healthcare operations, data is often captured across disparate paper slips, siloed spreadsheets, or fragmented outpatient registers. 
          The overarching objective of this project is to create an integrated web application that:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
          <li className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span>Provides robust CRUD management for clinical patient visit records with relational integrity.</span>
          </li>
          <li className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span>Executes Exploratory Data Analysis (EDA) on age cohorts, monthly admissions, and departmental workloads.</span>
          </li>
          <li className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span>Audits data hygiene, scanning for missing values and duplicates prior to machine learning model ingestion.</span>
          </li>
          <li className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span>Strictly enforces privacy by design through de-identification (no patient names, phones, or addresses).</span>
          </li>
        </ul>
      </div>

      {/* 2. Limitations of Existing Systems vs. Proposed System */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            2. Existing Systems vs. Proposed System
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-xl space-y-2">
            <h3 className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
              <span>Existing / Legacy Systems</span>
            </h3>
            <ul className="text-xs text-rose-700/90 space-y-1.5 list-disc list-inside">
              <li>Manual paper logs prone to physical degradation and human transcription error.</li>
              <li>Static spreadsheets lacking input boundaries (e.g. negative ages, future years).</li>
              <li>No real-time statistical summaries or visual trends without tedious manual formula creation.</li>
              <li>High risk of PII leakage by recording personal identities in insecure files.</li>
              <li>Absence of structured data deduplication and null-value auditing.</li>
            </ul>
          </div>

          <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-2">
            <h3 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <span>Proposed Automated System</span>
            </h3>
            <ul className="text-xs text-emerald-700/90 space-y-1.5 list-disc list-inside">
              <li>Relational SQLite database with ACID compliance and primary key constraints.</li>
              <li>Dual-layer input validation (frontend + backend) rejecting invalid dates and ages.</li>
              <li>Real-time Chart.js dashboards directly hooked into live database records.</li>
              <li>Built-in Pandas data quality suite identifying missing features and duplicates.</li>
              <li>Zero PII collection; records use synthetic pseudonymized identifiers (PID-XXXX).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. System Architecture & Relational Schema */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Layers className="w-4 h-4 text-indigo-600" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            3. System Architecture & Relational Data Schema
          </h2>
        </div>

        {/* Textual Architecture Diagram */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-700 space-y-2">
          <div className="font-bold text-slate-900">[CLIENT / PRESENTATION LAYER]</div>
          <div className="pl-4">
            HTML5 · Bootstrap 5 / Tailwind CSS · Chart.js (Bar, Line, Doughnut) · JavaScript
          </div>
          <div className="text-slate-400 pl-8">│ (HTTP Requests / Form Submissions / REST API)</div>
          <div className="text-slate-400 pl-8">▼</div>
          <div className="font-bold text-slate-900">[APPLICATION SERVER LAYER]</div>
          <div className="pl-4">
            Python 3.10 Flask Routing (`app.py`) · Server Validation · Pandas EDA Engine (`database.py`)
          </div>
          <div className="text-slate-400 pl-8">│ (Parameterized SQL: `cursor.execute('... ? ...')`)</div>
          <div className="text-slate-400 pl-8">▼</div>
          <div className="font-bold text-slate-900">[DATABASE / PERSISTENCE LAYER]</div>
          <div className="pl-4">
            SQLite3 Database (`hospital_data.db`) · Table: `patient_records`
          </div>
        </div>

        {/* Database Schema Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2 px-3">Column Name</th>
                <th className="py-2 px-3">SQL Data Type</th>
                <th className="py-2 px-3">Constraints & Validation</th>
                <th className="py-2 px-3">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-700 text-[11px]">
              <tr>
                <td className="py-2 px-3 font-bold text-sky-700">id</td>
                <td className="py-2 px-3">TEXT</td>
                <td className="py-2 px-3">PRIMARY KEY, Format `PID-XXXX`</td>
                <td className="py-2 px-3 font-sans">Unique patient record identifier</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-sky-700">age</td>
                <td className="py-2 px-3">INTEGER</td>
                <td className="py-2 px-3">CHECK(age &gt;= 0 AND age &lt;= 120)</td>
                <td className="py-2 px-3 font-sans">Patient age in completed years</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-sky-700">age_group</td>
                <td className="py-2 px-3">TEXT</td>
                <td className="py-2 px-3">`0-18`, `19-35`, `36-50`, `51-65`, `66+`</td>
                <td className="py-2 px-3 font-sans">Categorical demographic grouping</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-sky-700">visit_date</td>
                <td className="py-2 px-3">TEXT</td>
                <td className="py-2 px-3">NOT NULL, ISO-8601 `YYYY-MM-DD`</td>
                <td className="py-2 px-3 font-sans">Date of hospital admission / triage</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-sky-700">department</td>
                <td className="py-2 px-3">TEXT</td>
                <td className="py-2 px-3">NOT NULL (8 Approved Specialties)</td>
                <td className="py-2 px-3 font-sans">Attending clinical unit</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-sky-700">diagnosis_category</td>
                <td className="py-2 px-3">TEXT</td>
                <td className="py-2 px-3">NOT NULL, min length 3 chars</td>
                <td className="py-2 px-3 font-sans">Clinical diagnostic classification</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-sky-700">discharge_status</td>
                <td className="py-2 px-3">TEXT</td>
                <td className="py-2 px-3">NOT NULL (5 Approved Outcomes)</td>
                <td className="py-2 px-3 font-sans">Patient disposition status</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-sky-700">notes</td>
                <td className="py-2 px-3">TEXT</td>
                <td className="py-2 px-3">NULLABLE, PII-restricted</td>
                <td className="py-2 px-3 font-sans">De-identified clinical observation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Software & Hardware Requirements */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Cpu className="w-4 h-4 text-sky-600" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            4. Software & Hardware Specifications
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <h4 className="font-bold text-slate-900">Software Environment</h4>
            <p><strong>Python:</strong> Version 3.10 or higher</p>
            <p><strong>Web Framework:</strong> Flask 3.0+</p>
            <p><strong>Data Processing:</strong> Pandas 2.0+, NumPy</p>
            <p><strong>Database:</strong> SQLite3</p>
            <p><strong>UI Stack:</strong> Bootstrap 5.3, Chart.js 4.4, Lucide Icons</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <h4 className="font-bold text-slate-900">Hardware Requirements</h4>
            <p><strong>Processor:</strong> Dual-Core Intel Core i3 / AMD Ryzen 3 or higher</p>
            <p><strong>RAM:</strong> 4 GB minimum (8 GB recommended for large datasets)</p>
            <p><strong>Storage:</strong> 250 MB free disk space</p>
            <p><strong>Display:</strong> 1366 × 768 minimum resolution (fully responsive)</p>
          </div>
        </div>
      </div>

      {/* 5. AI/ML Roadmap & Future Scope */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <BrainCircuit className="w-4 h-4 text-teal-600" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            5. AI / ML Roadmap & Future Scope
          </h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          As a 2nd-year B.Tech CSE (AI/ML) foundation project, this dataset and architecture can be directly extended into machine learning pipelines:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-sky-50/50 border border-sky-100 rounded-lg space-y-1">
            <div className="text-xs font-bold text-sky-800">1. Length of Stay (LOS) Regression</div>
            <p className="text-[11px] text-slate-600 leading-normal">
              Apply XGBoost or Random Forest regression on patient age, department, and diagnosis category to forecast expected hospitalization days.
            </p>
          </div>
          <div className="p-3.5 bg-teal-50/50 border border-teal-100 rounded-lg space-y-1">
            <div className="text-xs font-bold text-teal-800">2. Readmission Classification</div>
            <p className="text-[11px] text-slate-600 leading-normal">
              Train binary classifiers (Logistic Regression / SVM) to identify patients at high risk of unplanned readmission within 30 days.
            </p>
          </div>
          <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-lg space-y-1">
            <div className="text-xs font-bold text-indigo-800">3. Time-Series Bed Demand</div>
            <p className="text-[11px] text-slate-600 leading-normal">
              Implement ARIMA / Prophet models on monthly visits to predict seasonal influx, optimizing staff allocation and oxygen inventory.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Viva Voce Preparation Guide */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <HelpCircle className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            6. College Viva Voce Questions & Answers
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <h4 className="font-bold text-slate-900">Q1: Why was SQLite selected over MySQL or PostgreSQL for this project?</h4>
            <p className="text-slate-600 leading-relaxed">
              <strong>Answer:</strong> SQLite is a serverless, zero-configuration, self-contained relational database stored as a single disk file (`hospital_data.db`). 
              For an educational B.Tech project, it eliminates the need to configure separate database servers while providing full ACID compliance, 
              CHECK constraints, and fast read throughput for local analysis.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <h4 className="font-bold text-slate-900">Q2: How does the application prevent SQL Injection attacks?</h4>
            <p className="text-slate-600 leading-relaxed">
              <strong>Answer:</strong> By strictly employing parameterized queries (`cursor.execute('SELECT * FROM patient_records WHERE department = ?', (dept,))`). 
              User input is never directly concatenated into raw SQL strings, ensuring the database engine treats input exclusively as data rather than executable statements.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <h4 className="font-bold text-slate-900">Q3: What role does Pandas play in the backend?</h4>
            <p className="text-slate-600 leading-relaxed">
              <strong>Answer:</strong> Pandas reads SQL queries directly into DataFrame structures (`pd.read_sql_query`). 
              It calculates descriptive statistics (mean, median, standard deviation via `.describe()`), performs data quality audits 
              (`df.isnull().sum()`, `df.duplicated()`), and generates cross-tabulations (`pd.crosstab()`) with high computational efficiency.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <h4 className="font-bold text-slate-900">Q4: How does the system address healthcare privacy and HIPAA/GDPR principles?</h4>
            <p className="text-slate-600 leading-relaxed">
              <strong>Answer:</strong> The system enforces data minimization. It does not record Personally Identifiable Information (PII) such as patient names, 
              social security numbers, residential addresses, or phone numbers. All records utilize synthetic IDs (`PID-XXXX`) and synthetic clinical profiles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
