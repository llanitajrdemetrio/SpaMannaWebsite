<?php
// Database connection setup
$host = "localhost:3307";
$user = "admin"; // Default for XAMPP
$pass = "admin123"; // Leave blank unless you set a MySQL password
$dbname = "spa_manna";

// Connect to MySQL
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
  die(json_encode([
    "status" => "error",
    "message" => "Database connection failed: " . $conn->connect_error
  ]));
}

