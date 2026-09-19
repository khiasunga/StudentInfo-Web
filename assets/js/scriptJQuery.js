let students = [];
let formMode = "Add";
let selectedStudentID = -1;
const baseURL = "http://192.168.100.223/student-info/tae/assets/php/student.php";

const $tbody = $("#student-data");

const $addBtn = $("#add-btn");
const $editBtn = $("#edit-btn");
const $deleteBtn = $("#delete-btn");
const $saveBtn = $("#save-btn");
const $cancelBtn = $("#cancel-btn");

const $txtLastname = $("#txt-lastname");
const $txtFirstname = $("#txt-firstname");
const $txtMiddlename = $("#txt-middlename");
const $txtGender = $("#txt-gender");
const $txtYearLevel = $("#txt-year-level");
const $txtSection = $("#txt-section");
const $txtEmail = $("#txt-email");

const $placeholderLastname = $("#placeholder-lastname");
const $placeholderFirstname = $("#placeholder-firstname");
const $placeholderMiddlename = $("#placeholder-middlename");
const $placeholderGender = $("#placeholder-gender");
const $placeholderYearLevel = $("#placeholder-year-level");
const $placeholderSection = $("#placeholder-section");
const $placeholderEmail = $("#placeholder-email");

$(document).ready(function () {
  resetForm();
  fetchStudentData();
});

$addBtn.on("click", function () {
  formMode = "Add";
  resetForm();
  enableFormFields(true);
  toggleButtons(true, false);
});

$editBtn.on("click", function () {
  formMode = "Edit";
  resetForm();
  enableFormFields(true);
  toggleButtons(true, false);
  populateFormFields(getStudentById(selectedStudentID));
});

$deleteBtn.on("click", function () {});

$saveBtn.on("click", function () {
  if (validateForm().length > 0) {
    return;
  }

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

$cancelBtn.on("click", function () {});

function resetForm() {
  toggleButtons(false, false);
  enableFormFields(false);
  resetPlaceholder();
  resetInputFields();
}

function renderStudents() {
  $tbody.empty();
  students.forEach(function (student) {
    const $row = $("<tr></tr>");
    $("<td></td>").text(student.lastname).appendTo($row);
    $("<td></td>").text(student.firstname).appendTo($row);
    $("<td></td>").text(student.middlename).appendTo($row);
    $("<td></td>").text(student.gender).appendTo($row);
    $("<td></td>").text(student.year_level).appendTo($row);
    $("<td></td>").text(student.section).appendTo($row);
    $("<td></td>").text(student.email).appendTo($row);

    $row.on("click", function () {
      resetForm();
      displayStudentDetails(student);
      toggleButtons(false, true);
    });

    $tbody.append($row);
  });
}

function displayStudentDetails(student) {
  if (!student) return;

  selectedStudentID = student.id;

  $("#placeholder-value-lastname").text(student.lastname);
  $("#placeholder-value-firstname").text(student.firstname);
  $("#placeholder-value-middlename").text(student.middlename);
  $("#placeholder-value-gender").text(student.gender);
  $("#placeholder-value-year-level").text(student.year_level);
  $("#placeholder-value-section").text(student.section);
  $("#placeholder-value-email").text(student.email);
}

function populateFormFields(student) {
  if (!student) {
    return;
  }

  $txtLastname.val(student.lastname);
  $txtFirstname.val(student.firstname);
  $txtMiddlename.val(student.middlename);
  $txtGender.val(student.gender);
  $txtYearLevel.val(student.year_level);
  $txtSection.val(student.section);
  $txtEmail.val(student.email);
}

function toggleButtons(
  showSaveCancelBtn = false,
  showAddEditDeleteBtn = false,
) {
  $saveBtn.toggleClass("display-none", !showSaveCancelBtn);

  $cancelBtn.toggleClass("display-none", !showSaveCancelBtn);

  $editBtn.toggleClass("display-none", !showAddEditDeleteBtn);

  $deleteBtn.toggleClass("display-none", !showAddEditDeleteBtn);
}

function enableFormFields(enable = false) {
  $(".textbox").toggleClass("default-text", !enable);

  const $inputs = $(
    "#txt-lastname, " +
      "#txt-firstname, " +
      "#txt-middlename, " +
      "#txt-gender, " +
      "#txt-year-level, " +
      "#txt-section, " +
      "#txt-email",
  );

  $inputs.prop("disabled", !enable);
}

function resetPlaceholder() {
  $placeholderLastname.html(
    `Last Name: <span id="placeholder-value-lastname"></span>`,
  );

  $placeholderFirstname.html(
    `First Name: <span id="placeholder-value-firstname"></span>`,
  );

  $placeholderMiddlename.html(
    `Middle Name: <span id="placeholder-value-middlename"></span>`,
  );

  $placeholderGender.html(
    `Gender: <span id="placeholder-value-gender"></span>`,
  );

  $placeholderYearLevel.html(
    `Year Level: <span id="placeholder-value-year-level"></span>`,
  );

  $placeholderSection.html(
    `Section: <span id="placeholder-value-section"></span>`,
  );

  $placeholderEmail.html(`Email: <span id="placeholder-value-email"></span>`);
}

function resetInputFields() {
  const $inputs = $(
    "#txt-lastname, " +
      "#txt-firstname, " +
      "#txt-middlename, " +
      "#txt-gender, " +
      "#txt-year-level, " +
      "#txt-section, " +
      "#txt-email",
  );

  $inputs.val("");
}

function validateForm() {
  const errors = [];

  if (!$txtLastname.val()) {
    errors.push("Last name is required");
  }

  if (!$txtFirstname.val()) {
    errors.push("First name is required");
  }

  if (!$txtMiddlename.val()) {
    errors.push("Middle name is required");
  }

  if (!$txtGender.val()) {
    errors.push("Gender is required");
  }

  if (!$txtYearLevel.val()) {
    errors.push("Year level is required");
  }

  if (!$txtSection.val()) {
    errors.push("Section is required");
  }

  if (!$txtEmail.val()) {
    errors.push("Email is required");
  }

  if (errors.length > 0) {
    alert(errors.join("\n"));
  }

  return errors;
}

function fetchStudentData() {
  $tbody.html(`
        <tr>
            <td colspan="7">Loading student records...</td>
        </tr>
    `);

  getAllStudents()
    .done(function (response) {
      if (!response.success) {
        showTableMessage(response.error || "Unable to fetch students.");
        return;
      }

      students = response.data.map(normalizeStudent);
      renderStudents();
    })
    .fail(function (xhr) {
      const response = xhr.responseJSON || {};
      const message = response.error || "Unable to fetch student records.";

      showTableMessage(message);
    });
}

function showTableMessage(message) {
  const $row = $("<tr></tr>");
  $("<td></td>").attr("colspan", 7).text(message).appendTo($row);

  $tbody.empty().append($row);
}

function normalizeStudent(student) {
  return {
    id: Number(student.id),
    lastname: student.lastname || "",
    firstname: student.firstname || "",
    middlename: student.middlename || "",
    gender: student.gender || "",
    year_level: student.acadlevel_name || student.year_level || "",
    section: student.section_name || student.section || "",
    email: student.email || "",
    acadlevel_id: student.acadlevel_id || "",
    section_id: student.section_id || "",
  };
}

function getStudentById(studentId) {
  return students.find((student) => student.id === studentId);
}

function getAllStudents() {
  return $.ajax({
    url: baseURL,
    type: "GET",
    data: {
      "get-all-students": 1,
    },
    dataType: "json",
  });
}

function addStudent() {
  var student;

  return $.ajax({
    url: API_URL,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(student),
    dataType: "json",
  });
}
