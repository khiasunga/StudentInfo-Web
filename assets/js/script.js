import { StudentList } from "./data.js";
let students = StudentList;
let formMode = "Add";
let selectedStudentID = -1;

const tbody = document.getElementById("student-data");

const addBtn = document.getElementById("add-btn");
const editBtn = document.getElementById("edit-btn");
const deleteBtn = document.getElementById("delete-btn");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");

const txtLastname = document.getElementById("text-lastname");
const txtFirstname = document.getElementById("text-firstname");
const txtMiddlename = document.getElementById("text-middlename");
const txtGender = document.getElementById("text-gender");
const txtYearLevel = document.getElementById("text-year-level");
const txtSection = document.getElementById("text-section");
const txtEmail = document.getElementById("text-email");

const placeholderLastname = document.getElementById("placeholder-lastname");
const placeholderFirstname = document.getElementById("placeholder-firstname");
const placeholderMiddlename = document.getElementById("placeholder-middlename");
const placeholderGender = document.getElementById("placeholder-gender");
const placeholderYearLevel = document.getElementById("placeholder-year-level");
const placeholderSection = document.getElementById("placeholder-section");
const placeholderEmail = document.getElementById("placeholder-email");

document.addEventListener("DOMContentLoaded", function () {
  resetForm();
  fetchStudentData();
});

addBtn.addEventListener("click", () => {
  formMode = "Add";
  resetForm();
  enableFormFields(true);
  toggleButtons(true, false);
});

editBtn.addEventListener("click", () => {
  formMode = "Edit";
  resetForm();
  enableFormFields(true);
  toggleButtons(true, false);
  populateFormFields(getStudentById(selectedStudentID));
});

deleteBtn.addEventListener("click", () => {
  formMode = "Delete";
  if (confirm("Are you sure you want to delete this student?")) {
    deleteStudent();
    resetForm();
    fetchStudentData();
  }
});

saveBtn.addEventListener("click", () => {
  if (validateForm().length > 0) return;

  if (formMode === "Add") {
    addStudent();
  }

  if (formMode === "Edit") {
    editStudent();
  }

  resetForm();
  displayStudentDetails(getStudentById(selectedStudentID));
  fetchStudentData();
});

cancelBtn.addEventListener("click", () => {
  resetForm();
  displayStudentDetails(getStudentById(selectedStudentID));
});

function addStudent() {
  selectedStudentID = students.length + 1;

  const student = {
    id: selectedStudentID,
    lastname: txtLastname.value,
    firstname: txtFirstname.value,
    middlename: txtMiddlename.value,
    gender: txtGender.value,
    year_level: txtYearLevel.value,
    section: txtSection.value,
    email: txtEmail.value,
  };
  students.push(student);
  formMode = "";
}

function editStudent() {
  let getStudent = getStudentById(selectedStudentID);
  if (getStudent) {
    getStudent.lastname = txtLastname.value;
    getStudent.firstname = txtFirstname.value;
    getStudent.middlename = txtMiddlename.value;
    getStudent.gender = txtGender.value;
    getStudent.year_level = txtYearLevel.value;
    getStudent.section = txtSection.value;
    getStudent.email = txtEmail.value;
  }
  formMode = "";
}

function deleteStudent() {
  if (selectedStudentID === -1) return;
  students.splice(
    students.findIndex((student) => student.id === selectedStudentID),
    1,
  );
  formMode = "";
}

function fetchStudentData() {
  tbody.innerHTML = "";

  students.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${student.lastname}</td>
        <td>${student.firstname}</td>
        <td>${student.middlename}</td>
        <td>${student.gender}</td>
        <td>${student.year_level}</td>
        <td>${student.section}</td>
        <td>${student.email}</td>
        `;

    row.addEventListener("click", () => {
      resetForm();
      displayStudentDetails(student);
      toggleButtons(false, true);
    });

    tbody.appendChild(row);
  });
}

function displayStudentDetails(student) {
  selectedStudentID = student.id;
  placeholderLastname.querySelector("#placeholder-value-lastname").textContent =
    student.lastname;
  placeholderFirstname.querySelector(
    "#placeholder-value-firstname",
  ).textContent = student.firstname;
  placeholderMiddlename.querySelector(
    "#placeholder-value-middlename",
  ).textContent = student.middlename;
  placeholderGender.querySelector("#placeholder-value-gender").textContent =
    student.gender;
  placeholderYearLevel.querySelector(
    "#placeholder-value-year-level",
  ).textContent = student.year_level;
  placeholderSection.querySelector("#placeholder-value-section").textContent =
    student.section;
  placeholderEmail.querySelector("#placeholder-value-email").textContent =
    student.email;
}
function populateFormFields(student) {
  txtLastname.value = student.lastname;
  txtFirstname.value = student.firstname;
  txtMiddlename.value = student.middlename;
  txtGender.value = student.gender;
  txtYearLevel.value = student.year_level;
  txtSection.value = student.section;
  txtEmail.value = student.email;
}

function resetForm() {
  toggleButtons(false, false);
  enableFormFields(false);
  resetPlaceholders();
  resetInputFields();
}

function toggleButtons(showSaveCancelBtn = false, showEditDeleteBtn = false) {
  saveBtn.classList.toggle("display-none", !showSaveCancelBtn);
  cancelBtn.classList.toggle("display-none", !showSaveCancelBtn);
  editBtn.classList.toggle("display-none", !showEditDeleteBtn);
  deleteBtn.classList.toggle("display-none", !showEditDeleteBtn);
}

function enableFormFields(enable = false) {
  let txtboxes = document.getElementsByClassName("textbox");
  Array.from(txtboxes).forEach((txtbox) => {
    txtbox.classList.toggle("default-text", !enable);
  });

  [
    txtLastname,
    txtFirstname,
    txtMiddlename,
    txtGender,
    txtYearLevel,
    txtSection,
    txtEmail,
  ].forEach((input) => {
    input.disabled = !enable;
  });
}

function resetPlaceholders() {
  placeholderLastname.innerHTML = `Last Name: <span id="placeholder-value-lastname"></span>`;
  placeholderFirstname.innerHTML = `First Name: <span id="placeholder-value-firstname"></span>`;
  placeholderMiddlename.innerHTML = `Middle Name: <span id="placeholder-value-middlename"></span>`;
  placeholderGender.innerHTML = `Gender: <span id="placeholder-value-gender"></span>`;
  placeholderYearLevel.innerHTML = `Year level: <span id="placeholder-value-year-level"></span>`;
  placeholderSection.innerHTML = `Section: <span id="placeholder-value-section"></span>`;
  placeholderEmail.innerHTML = `Email: <span id="placeholder-value-email"></span>`;
}

function resetInputFields() {
  [
    txtLastname,
    txtFirstname,
    txtMiddlename,
    txtGender,
    txtYearLevel,
    txtSection,
    txtEmail,
  ].forEach((input) => {
    input.value = "";
  });
}

function validateForm() {
  const errors = [];
  if (!txtLastname.value) errors.push("Last name is required");
  if (!txtFirstname.value) errors.push("First name is required");
  if (!txtMiddlename.value) errors.push("Middle name is required");
  if (!txtGender.value) errors.push("Gender is required");
  if (!txtYearLevel.value) errors.push("Year level is required");
  if (!txtSection.value) errors.push("Section is required");
  if (!txtEmail.value) errors.push("Email is required");

  if (errors.length > 0) {
    alert(errors.join("\n"));
  }

  return errors;
}

function getStudentById(studentId) {
  return students.find((student) => student.id === studentId);
}
