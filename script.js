// ============================================
// Student Registration System - Main JavaScript
// ============================================

/**
 * Global Variables and Constants
 */
let students = []; // Array to store all student records
let editingIndex = null; // Track which student is being edited
const STORAGE_KEY = 'studentRegistrationData'; // LocalStorage key

/**
 * DOM Elements - Cache frequently used elements
 */
const studentForm = document.getElementById('studentForm');
const studentNameInput = document.getElementById('studentName');
const studentIdInput = document.getElementById('studentId');
const emailIdInput = document.getElementById('emailId');
const contactNumberInput = document.getElementById('contactNumber');
const studentsTableBody = document.getElementById('studentsTableBody');
const studentCountElement = document.getElementById('studentCount');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const tableContainer = document.getElementById('tableContainer');

// Error message elements
const nameError = document.getElementById('nameError');
const idError = document.getElementById('idError');
const emailError = document.getElementById('emailError');
const contactError = document.getElementById('contactError');

/**
 * Initialize Application
 * Load data from localStorage and set up event listeners
 */
function init() {
    loadFromLocalStorage();
    renderStudentTable();
    setupEventListeners();
    updateScrollbar();
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Form submission
    studentForm.addEventListener('submit', handleFormSubmit);
    
    // Cancel button
    cancelBtn.addEventListener('click', resetForm);
    
    // Real-time validation on input
    studentNameInput.addEventListener('input', () => validateField('name'));
    studentIdInput.addEventListener('input', () => validateField('id'));
    emailIdInput.addEventListener('input', () => validateField('email'));
    contactNumberInput.addEventListener('input', () => validateField('contact'));
    
    // Prevent non-numeric input for student ID
    studentIdInput.addEventListener('keypress', (e) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });
    
    // Prevent non-numeric input for contact number
    contactNumberInput.addEventListener('keypress', (e) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });
    
    // Prevent numeric input for student name
    studentNameInput.addEventListener('keypress', (e) => {
        if (!/[a-zA-Z\s]/.test(e.key)) {
            e.preventDefault();
        }
    });
}

/**
 * Validate individual form field
 * @param {string} fieldType - Type of field to validate
 * @returns {boolean} - Whether the field is valid
 */
function validateField(fieldType) {
    let isValid = true;
    
    switch(fieldType) {
        case 'name':
            const nameValue = studentNameInput.value.trim();
            const nameRegex = /^[a-zA-Z\s]+$/;
            
            if (nameValue === '') {
                nameError.textContent = 'Student name is required';
                studentNameInput.classList.add('error');
                isValid = false;
            } else if (!nameRegex.test(nameValue)) {
                nameError.textContent = 'Name must contain only letters and spaces';
                studentNameInput.classList.add('error');
                isValid = false;
            } else if (nameValue.length < 2) {
                nameError.textContent = 'Name must be at least 2 characters long';
                studentNameInput.classList.add('error');
                isValid = false;
            } else {
                nameError.textContent = '';
                studentNameInput.classList.remove('error');
            }
            break;
            
        case 'id':
            const idValue = studentIdInput.value.trim();
            const idRegex = /^[0-9]+$/;
            
            if (idValue === '') {
                idError.textContent = 'Student ID is required';
                studentIdInput.classList.add('error');
                isValid = false;
            } else if (!idRegex.test(idValue)) {
                idError.textContent = 'Student ID must contain only numbers';
                studentIdInput.classList.add('error');
                isValid = false;
            } else if (isDuplicateId(idValue, editingIndex)) {
                idError.textContent = 'This Student ID already exists';
                studentIdInput.classList.add('error');
                isValid = false;
            } else {
                idError.textContent = '';
                studentIdInput.classList.remove('error');
            }
            break;
            
        case 'email':
            const emailValue = emailIdInput.value.trim();
            // Comprehensive email validation regex
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            
            if (emailValue === '') {
                emailError.textContent = 'Email ID is required';
                emailIdInput.classList.add('error');
                isValid = false;
            } else if (!emailRegex.test(emailValue)) {
                emailError.textContent = 'Please enter a valid email address';
                emailIdInput.classList.add('error');
                isValid = false;
            } else {
                emailError.textContent = '';
                emailIdInput.classList.remove('error');
            }
            break;
            
        case 'contact':
            const contactValue = contactNumberInput.value.trim();
            const contactRegex = /^[0-9]{10,}$/;
            
            if (contactValue === '') {
                contactError.textContent = 'Contact number is required';
                contactNumberInput.classList.add('error');
                isValid = false;
            } else if (!contactRegex.test(contactValue)) {
                contactError.textContent = 'Contact number must be at least 10 digits';
                contactNumberInput.classList.add('error');
                isValid = false;
            } else {
                contactError.textContent = '';
                contactNumberInput.classList.remove('error');
            }
            break;
    }
    
    return isValid;
}

/**
 * Check if student ID is duplicate
 * @param {string} id - Student ID to check
 * @param {number} excludeIndex - Index to exclude from check (for editing)
 * @returns {boolean} - Whether ID is duplicate
 */
function isDuplicateId(id, excludeIndex = null) {
    return students.some((student, index) => {
        if (excludeIndex !== null && index === excludeIndex) {
            return false; // Skip the student being edited
        }
        return student.studentId === id;
    });
}

/**
 * Validate entire form
 * @returns {boolean} - Whether the entire form is valid
 */
function validateForm() {
    const isNameValid = validateField('name');
    const isIdValid = validateField('id');
    const isEmailValid = validateField('email');
    const isContactValid = validateField('contact');
    
    return isNameValid && isIdValid && isEmailValid && isContactValid;
}

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    if (!validateForm()) {
        return;
    }
    
    // Get form values
    const studentData = {
        studentName: studentNameInput.value.trim(),
        studentId: studentIdInput.value.trim(),
        emailId: emailIdInput.value.trim(),
        contactNumber: contactNumberInput.value.trim()
    };
    
    // Check if editing or adding new student
    if (editingIndex !== null) {
        // Update existing student
        students[editingIndex] = studentData;
        editingIndex = null;
        submitBtn.querySelector('.btn-text').textContent = 'Add Student';
    } else {
        // Add new student
        students.push(studentData);
    }
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Render updated table
    renderStudentTable();
    
    // Reset form
    resetForm();
    
    // Update scrollbar
    updateScrollbar();
}

/**
 * Reset form to initial state
 */
function resetForm() {
    studentForm.reset();
    editingIndex = null;
    submitBtn.querySelector('.btn-text').textContent = 'Add Student';
    
    // Clear all error messages
    nameError.textContent = '';
    idError.textContent = '';
    emailError.textContent = '';
    contactError.textContent = '';
    
    // Remove error styling
    studentNameInput.classList.remove('error');
    studentIdInput.classList.remove('error');
    emailIdInput.classList.remove('error');
    contactNumberInput.classList.remove('error');
}

/**
 * Render student table with all records
 */
function renderStudentTable() {
    // Clear existing table body
    studentsTableBody.innerHTML = '';
    
    // Check if there are any students
    if (students.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.className = 'no-records';
        emptyRow.innerHTML = `
            <td colspan="6">No students registered yet. Start by adding a new student!</td>
        `;
        studentsTableBody.appendChild(emptyRow);
        studentCountElement.textContent = '0';
        return;
    }
    
    // Render each student record
    students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${escapeHtml(student.studentName)}</td>
            <td>${escapeHtml(student.studentId)}</td>
            <td>${escapeHtml(student.emailId)}</td>
            <td>${escapeHtml(student.contactNumber)}</td>
            <td>
                <button class="btn btn-edit" onclick="editStudent(${index})" aria-label="Edit student ${escapeHtml(student.studentName)}">
                    ✏️ Edit
                </button>
                <button class="btn btn-delete" onclick="deleteStudent(${index})" aria-label="Delete student ${escapeHtml(student.studentName)}">
                    🗑️ Delete
                </button>
            </td>
        `;
        studentsTableBody.appendChild(row);
    });
    
    // Update student count
    studentCountElement.textContent = students.length;
}

/**
 * Edit student record
 * @param {number} index - Index of student to edit
 */
function editStudent(index) {
    const student = students[index];
    
    // Populate form with student data
    studentNameInput.value = student.studentName;
    studentIdInput.value = student.studentId;
    emailIdInput.value = student.emailId;
    contactNumberInput.value = student.contactNumber;
    
    // Set editing mode
    editingIndex = index;
    submitBtn.querySelector('.btn-text').textContent = 'Update Student';
    
    // Scroll to form
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Focus on first input
    studentNameInput.focus();
}

/**
 * Delete student record
 * @param {number} index - Index of student to delete
 */
function deleteStudent(index) {
    const student = students[index];
    
    // Confirm deletion
    if (confirm(`Are you sure you want to delete ${student.studentName}'s record?`)) {
        students.splice(index, 1);
        saveToLocalStorage();
        renderStudentTable();
        updateScrollbar();
        
        // If deleting the student being edited, reset form
        if (editingIndex === index) {
            resetForm();
        } else if (editingIndex !== null && editingIndex > index) {
            // Adjust editing index if necessary
            editingIndex--;
        }
    }
}

/**
 * Save students array to localStorage
 */
function saveToLocalStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        alert('Unable to save data. Please check your browser settings.');
    }
}

/**
 * Load students array from localStorage
 */
function loadFromLocalStorage() {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            students = JSON.parse(storedData);
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        students = [];
    }
}

/**
 * Update scrollbar dynamically based on table height
 * Adds scrollbar if table exceeds a certain height
 */
function updateScrollbar() {
    // Maximum height before scrollbar appears (in pixels)
    const maxHeight = 500;
    
    // Get the actual height of the table
    const tableHeight = tableContainer.scrollHeight;
    
    // Apply max-height and overflow if needed
    if (tableHeight > maxHeight) {
        tableContainer.style.maxHeight = `${maxHeight}px`;
        tableContainer.style.overflowY = 'auto';
    } else {
        tableContainer.style.maxHeight = 'none';
        tableContainer.style.overflowY = 'visible';
    }
}

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Window resize event listener to update scrollbar
 */
window.addEventListener('resize', updateScrollbar);

/**
 * Initialize application when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', init);
