<?php
$host = "localhost:3307";
$user = "admin"; // default XAMPP user
$pass = "admin123"; // leave empty unless you set one
$dbname = "spa_manna";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
