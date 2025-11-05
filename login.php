<?php
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = trim($_POST["username"]);
    $password = trim($_POST["password"]);

    // Use prepared statement to avoid SQL injection
    $stmt = $conn->prepare("SELECT * FROM admin_users WHERE username = ? AND password = ?");
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        // Correct credentials → redirect to dashboard
        header("Location: dashboard.html");
        exit();
    } else {
        // Wrong login → go back with error
        echo "<script>
            alert('❌ Incorrect username or password.');
            window.location.href = 'admin.html';
        </script>";
    }

    $stmt->close();
    $conn->close();
}
?>
