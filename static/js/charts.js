/**
 * Hospital Patient Data Analysis System
 * Chart.js Integration Script
 */

document.addEventListener('DOMContentLoaded', function () {
  fetchChartData();
});

function fetchChartData() {
  fetch('/api/chart-data')
    .then((response) => response.json())
    .then((data) => {
      renderDepartmentChart(data.departments);
      renderMonthlyVisitsChart(data.monthly_visits);
      renderAgeGroupChart(data.age_groups);
      renderDischargeStatusChart(data.discharge_status);
    })
    .catch((error) => console.error('Error fetching chart data:', error));
}

function renderDepartmentChart(departments) {
  const ctx = document.getElementById('deptChart');
  if (!ctx) return;

  const labels = Object.keys(departments);
  const counts = Object.values(departments);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Patients',
          data: counts,
          backgroundColor: '#0284c7',
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 },
        },
      },
    },
  });
}

function renderMonthlyVisitsChart(monthlyData) {
  const ctx = document.getElementById('monthlyChart');
  if (!ctx) return;

  const labels = Object.keys(monthlyData).sort();
  const counts = labels.map((l) => monthlyData[l]);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Hospital Visits',
          data: counts,
          borderColor: '#0d9488',
          backgroundColor: 'rgba(13, 148, 136, 0.1)',
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#0d9488',
          pointRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 },
        },
      },
    },
  });
}

function renderAgeGroupChart(ageGroups) {
  const ctx = document.getElementById('ageChart');
  if (!ctx) return;

  const order = ['0-18', '19-35', '36-50', '51-65', '66+'];
  const labels = order;
  const counts = order.map((grp) => ageGroups[grp] || 0);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Patients in Age Group',
          data: counts,
          backgroundColor: '#3b82f6',
          borderRadius: 4,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { precision: 0 },
        },
      },
    },
  });
}

function renderDischargeStatusChart(dischargeData) {
  const ctx = document.getElementById('dischargeChart');
  if (!ctx) return;

  const labels = Object.keys(dischargeData);
  const counts = Object.values(dischargeData);

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [
        {
          data: counts,
          backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'],
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { boxWidth: 12, font: { size: 11 } },
        },
      },
      cutout: '65%',
    },
  });
}
