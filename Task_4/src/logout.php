<?php
    require("start.php");
    session_unset();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../cssFiles/styles.css">

    <title>Logout</title>
</head>
<body>
    <main class="app">

        <p class="toCenter">
            <img src="../images/logout.png" alt="Logged Out Icon" width="100" height="100" class="roundIcons">
        </p>
            <h1 class="toCenter">Logged out...</h1>

            <!-- Abschiedsnachricht-->
            <p class="toCenter">See you!</p> 

            <!-- Link zurück zum Login -->
            <p class="toCenter"><a href="./login.html">Login again</a></p>
        
    </main>

    <script src="../jsFiles/backend.js"></script>
    <script src="../jsFiles/script.js"></script>
</body>
</html>