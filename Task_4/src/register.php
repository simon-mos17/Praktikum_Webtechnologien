<?php
    require("start.php");
    $error= [];
    $errortest = true;

    if(!empty($_POST)){
        $username = $_POST['username'];
        $password = $_POST['password'];
        $confirm_pw = $_POST['confirm_pw'];

        if(strlen($username) < 3){
            $error[] = "Der Nutzername ist zu kurz (mind. 3 Zeichen)";
            $errortest = false;
        }
        if($service->userExists($username)){
            $error[] = "Der Nutzername existiert bereits. Bitte anderen wählen";
            $errortest = false;
        }
        if(strlen($password) < 1){
            $error[] = "Kein Passwort eingegeben";
            $errortest = false;
        }
        if(strlen($password) < 8){
            $error[] = "Das Passwort benötigt mindestens 8 Zeichen";
            $errortest = false;
        }
        if($password != $confirm_pw){
            $error[] = "Passwörter stimmen nicht überein";
            $errortest = false;
        }

        if($errortest){
            if($service->register($username, $password)){
                $_SESSION["user"] = $username;
                header("Location: friends.php");
                exit;
            } else{
                $error[] = "Registrierung fehlgeschlagen";
            }
        }

    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../cssFiles/styles.css">

    <title>Register</title>
</head>
<body>
    <main class="app">
        <img src="../images/user.png" alt="Register Icon" width="100" height="100" class="roundIcons">

        <h1 class="toCenter">Register Yourself</h1>

        <form id="registerform" action="register.php" method="post" class="toCenter">
            <!-- 🟡 Future Adjustment -->
            <fieldset>
                <legend>Register</legend>

                <!-- Username -->
                <label for="username">Username</label>
                <input id="username" name="username" type="text" placeholder="Username" required>
                <br>

                <!-- Password-->
                <label for="password">Password</label>
                <input id="password" name="password" type="password" placeholder="Password" required>
                <br>

                <!-- Confirm Password -->
                <label for="confirm_pw">Confirm Password</label>
                <input id="confirm_pw" name="confirm_pw" type="password" placeholder="Confirm Password" required>
                <br>
            </fieldset>

            <!-- Buttons als Gruppe (für Responsive Styling) -->
            <div class="authFormButtons">
                <!-- Cancel Button -->
                <a href="./login.php"><button type="button">Cancel</button></a>

                <!-- Create Account Button -->
                <button type="submit">Create Account</button>
            </div>
            <?php
                foreach($error as $err){
                    echo "<p style='color:red'><strong>$err</strong></p>";
                }
            ?>
        </form>
    </main>
    <script src="../jsFiles/backend.js"></script>
    <script src="../jsFiles/script.js"></script>
</body>
</html>
