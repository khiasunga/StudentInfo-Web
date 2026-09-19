<?php

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json");
require "db.php";

$method = $_SERVER["REQUEST_METHOD"];


// GET
if ($method === "GET") {

    // GET ALL STUDENTS
    if (isset($_GET["get-all-students"])) {

        $sql = "
            SELECT
                students.id,
                students.lastname,
                students.firstname,
                students.middlename,
                students.acadlevel_id,
                acadlevels.name AS acadlevel_name,
                students.section_id,
                sections.name AS section_name,
                students.gender,
                students.email

            FROM students

            LEFT JOIN acadlevels
                ON students.acadlevel_id = acadlevels.id

            LEFT JOIN sections
                ON students.section_id = sections.id

            ORDER BY students.id DESC
        ";

        $stmt = $pdo->query($sql);

        $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "data" => $students
        ]);

        exit;
    }


    // GET ALL ACADEMIC LEVELS
    if (isset($_GET["get-all-acadlevel"])) {

        $sql = "
            SELECT
                id,
                name
            FROM acadlevels
            ORDER BY name ASC
        ";

        $stmt = $pdo->query($sql);

        $acadlevels = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "data" => $acadlevels
        ]);

        exit;
    }

    // GET ALL SECTIONS
    if (isset($_GET["get-all-sections"])) {

        $sql = "
            SELECT
                id,
                name
            FROM sections
            ORDER BY name ASC
        ";

        $stmt = $pdo->query($sql);

        $sections = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "data" => $sections
        ]);

        exit;
    }

    // SEARCH STUDENTS
    if (isset($_GET["search"])) {

        $search = trim($_GET["search"]);

        $sql = "
            SELECT
                students.id,
                students.lastname,
                students.firstname,
                students.middlename,
                students.acadlevel_id,
                acadlevels.name AS acadlevel_name,
                students.section_id,
                sections.name AS section_name,
                students.gender,
                students.email

            FROM students

            LEFT JOIN acadlevels
                ON students.acadlevel_id = acadlevels.id

            LEFT JOIN sections
                ON students.section_id = sections.id

            WHERE
                students.lastname LIKE :search
                OR students.firstname LIKE :search
                OR students.middlename LIKE :search
                OR students.gender LIKE :search
                OR students.email LIKE :search
                OR acadlevels.name LIKE :search
                OR sections.name LIKE :search

            ORDER BY students.id DESC
        ";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            "search" => "%" . $search . "%"
        ]);

        $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "data" => $students
        ]);

        exit;
    }


    // GET STUDENT BY ID
    if (isset($_GET["id"])) {

        $id = intval($_GET["id"]);

        $sql = "
            SELECT
                students.id,
                students.lastname,
                students.firstname,
                students.middlename,
                students.acadlevel_id,
                acadlevels.name AS acadlevel_name,
                students.section_id,
                sections.name AS section_name,
                students.gender,
                students.email

            FROM students

            LEFT JOIN acadlevels
                ON students.acadlevel_id = acadlevels.id

            LEFT JOIN sections
                ON students.section_id = sections.id

            WHERE students.id = :id
        ";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            "id" => $id
        ]);

        $student = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$student) {

            http_response_code(404);

            echo json_encode([
                "success" => false,
                "error" => "Student not found"
            ]);

            exit;
        }

        echo json_encode([
            "success" => true,
            "data" => $student
        ]);

        exit;
    }

    // INVALID GET REQUEST
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "error" => "Invalid GET request"
    ]);

    exit;
}


// POST - ADD STUDENT
if ($method === "POST") {

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    if (!$data) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "error" => "Invalid JSON data"
        ]);

        exit;
    }


    $sql = "
        INSERT INTO students
        (
            lastname,
            firstname,
            middlename,
            gender,
            acadlevel_id,
            section_id,
            email
        )

        VALUES
        (
            :lastname,
            :firstname,
            :middlename,
            :gender,
            :acadlevel_id,
            :section_id,
            :email
        )
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        "lastname" => $data["lastname"],
        "firstname" => $data["firstname"],
        "middlename" => $data["middlename"],
        "gender" => $data["gender"],
        "acadlevel_id" => $data["acadlevel_id"],
        "section_id" => $data["section_id"],
        "email" => $data["email"]
    ]);

    $newId = $pdo->lastInsertId();

    echo json_encode([
        "success" => true,
        "message" => "Student added successfully",
        "id" => $newId
    ]);

    exit;
}


// PUT - UPDATE STUDENT
if ($method === "PUT") {

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    if (!$data || !isset($data["id"])) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "error" => "Student ID is required"
        ]);

        exit;
    }


    $sql = "
        UPDATE students

        SET
            lastname = :lastname,
            firstname = :firstname,
            middlename = :middlename,
            gender = :gender,
            acadlevel_id = :acadlevel_id,
            section_id = :section_id,
            email = :email

        WHERE id = :id
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        "lastname" => $data["lastname"],
        "firstname" => $data["firstname"],
        "middlename" => $data["middlename"],
        "gender" => $data["gender"],
        "acadlevel_id" => $data["acadlevel_id"],
        "section_id" => $data["section_id"],
        "email" => $data["email"],
        "id" => $data["id"]
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Student updated successfully"
    ]);

    exit;
}


if ($method === "DELETE") {

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    if (!$data || !isset($data["id"])) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "error" => "Student ID is required"
        ]);

        exit;
    }


    $sql = "
        DELETE FROM students
        WHERE id = :id
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        "id" => $data["id"]
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Student deleted successfully"
    ]);

    exit;
}


// METHOD NOT ALLOWED
http_response_code(405);

echo json_encode([
    "success" => false,
    "error" => "Method not allowed"
]);

?>