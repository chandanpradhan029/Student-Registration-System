// Array to store student records
let students = [];

// Getting required DOM elements
const form = document.getElementById("studentForm");
const tableBody = document.getElementById("studentsTableBody");
const count = document.getElementById("studentCount");

// Handle form submission
form.addEventListener("submit", e => {
  e.preventDefault(); // Prevent page reload

  // Create student object from form inputs
  const student = {
    name: studentName.value,
    id: studentId.value,
    email: emailId.value,
    contact: contactNumber.value
  };

  // Add student to array
  students.push(student);

  // Reset form after submission
  form.reset();

  // Update table UI
  renderTable();
});

// Function to display students in table
function renderTable() {
  tableBody.innerHTML = "";           // Clear existing rows
  count.textContent = students.length; // Update total count

  // Loop through students and create rows
  students.forEach((s, i) => {
    tableBody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${s.name}</td>
        <td>${s.id}</td>
        <td>${s.email}</td>
        <td>${s.contact}</td>
        <td>
          <button class="btn-edit" onclick="editStudent(${i})">Edit</button>
          <button class="btn-delete" onclick="deleteStudent(${i})">Delete</button>
        </td>
      </tr>
    `;
  });

  // Display message if no records exist
  if (students.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6">No students added</td>
      </tr>
    `;
  }
}

// Delete a student record
function deleteStudent(index) {
  students.splice(index, 1); // Remove student from array
  renderTable();             // Refresh table
}

// Edit student record
function editStudent(index) {
  const s = students[index];

  // Fill form with selected student data
  studentName.value = s.name;
  studentId.value = s.id;
  emailId.value = s.email;
  contactNumber.value = s.contact;

  // Remove old record so updated data can be added again
  students.splice(index, 1);
  renderTable();
}
