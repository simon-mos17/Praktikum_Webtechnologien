<?php
    require("start.php");
    $error = "";

    if(isset($_SESSION["user"])){
        header("Location: friends.php");
        exit;
    }

    if(!empty($_POST)){
        $username = $_POST['username'];
        $password = $_POST['password'];

        if($service->login($username, $password)){
            $_SESSION["user"] = $username;
            header("Location: friends.php");
        } else{
            $error = "Login fehlgeschlagen. Benutzername oder Passwort falsch.";
        }
    }

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="cssFiles/styles.css">

    <title>Login</title>
</head>
<body>

    <main class="app">
        <img src="images/chat.png" alt="Speech Bubble Icon" width="100" height="100" class="roundIcons">

        <h1 class="toCenter">Please sign in</h1>
        <!-- Einzige Änderung: id="loginform" -->
        <form id="loginform" action="login.php" method="post" class="toCenter">
            <!-- 🟡 Momentan noch GET. Needs to be adjusted! -->
            <fieldset>
                <legend>Login</legend>
                    
                <!-- Username Eingabe-->
                <label for="username">Username</label>
                <input id="username" name="username" type="text" placeholder="Username" required>
                <br>
                    
                <!-- Password Eingabe-->
                <label for="password">Password</label>
                <input id="password" name="password" type="password" placeholder="Password" required>
                <br>
            </fieldset>

            <!-- Buttons als Gruppe (für Responsive Styling) -->
            <div class="authFormButtons">
                <!-- Register-Button -->
                <a href="./register.php"><button type="button">Register</button></a>

                <!-- Login-Button -->
                <button type="submit">Login</button>
            </div>

            <?php
            if(!empty($error)){
                echo "<p style='color:red'><strong>$error</strong></p>";
            }
            ?>

        </form>
    </main>
    <script src="../jsFiles/backend.js"></script>
    <script src="../jsFiles/script.js"></script>
</body>
</html>
