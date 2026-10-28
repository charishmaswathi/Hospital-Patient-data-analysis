/**
 * Hospital Patient Data Analysis System
 * UI Utilities & Client-Side Validation
 */

document.addEventListener('DOMContentLoaded', function () {
  // Mobile sidebar toggle
  const toggleBtn = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', function () {
      sidebar.classList.toggle('show');
    });
  }

  // Client-side date and age validation
  const recordForm = document.getElementById('patientRecordForm');
  if (recordForm) {
    recordForm.addEventListener('submit', function (e) {
      const ageInput = document.getElementById('age');
      const dateInput = document.getElementById('visit_date');

      if (ageInput) {
        const age = parseInt(ageInput.value, 10);
        if (isNaN(age) || age < 0 || age > 120) {
          alert('Age must be between 0 and 120.');
          ageInput.focus();
          e.preventDefault();
          return false;
        }
      }

      if (dateInput && dateInput.value) {
        const selectedDate = new Date(dateInput.value);
        const year = selectedDate.getFullYear();
        if (year < 2000 || year > 2030) {
          alert('Please enter a valid visit date between years 2000 and 2030.');
          dateInput.focus();
          e.preventDefault();
          return false;
        }
      }
    });
  }
});
