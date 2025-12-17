<?php
require "start.php";

if (!isset($_SESSION["user"]) || empty($_SESSION["user"])) {
    header("Location: login.php");
    exit;
}

$currentusername = $_SESSION["user"];
$user = $service->loadUser($currentusername);
$layout = $user->getLayout() ?? "";


if($_SERVER["REQUEST_METHOD"] === "POST"){
    // Werte aus POST holen (Namen entsprechen deinem Formular!)
    $firstName = $_POST["firstName"] ?? "";
    $lastName  = $_POST["lastName"] ?? "";
    $drink     = $_POST["drink"] ?? "neither";
    $bio       = $_POST["bio"] ?? "";
    $layout    = $_POST["userMessageLine"] ?? ""; // inline / separated

    // In User-Objekt schreiben
    $user->setFirstName($firstName);
    $user->setLastName($lastName);
    $user->setCoffeeTea($drink);
    $user->setBio($bio);
    $user->setLayout($layout);
    $user->addHistoryEntry(date('Y-m-d H:i:s'));


if ($service->saveUser($user)) {
    header("Location: friends.php");
    exit;
} else {
    $error = "Profil konnte nicht gespeichert werden.";
}

}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="cssFiles/styles.css">

    <title>Settings</title>
</head>
<body>

    <main class="app">
    
        <h1>Profile Settings</h1>
        
        <form id="profileSettings" action="settings.php" method="post" class="profileForm">
            
            <!-- Basis Informationen -->
            <fieldset>
                <legend>Base Data</legend>
                
                <!-- Your Name-->
                <label for="firstName">First Name</label>
                <input id="firstName" name="firstName" type="text" placeholder="Your name" value="<?= $user->getFirstName() ?? "" ?>">
                <br>
                
                <!-- Surname-->
                <label for="lastName">Last Name</label>
                <input id="lastName" name="lastName" type="text" placeholder="Your surname" value="<?= $user->getLastName() ?? "" ?>">
                <br>

                <!-- Kaffee oder Tee? Auswahl -->
                <label for="drink">Coffee or Tea?</label>
                <select id="drink" name="drink">
                    <?php $drink = $user->getCoffeeTea() ?? "neither"; ?>
                    <option value="neither"   <?= $drink === "neither" ? "selected" : "" ?>>Neither nor</option>
                    <option value="coffee"    <?= $drink === "coffee"  ? "selected" : "" ?>>Coffee</option>
                    <option value="tea"       <?= $drink === "tea"     ? "selected" : "" ?>>Tea</option>
                    <option value="both"      <?= $drink === "both"    ? "selected" : "" ?>>Both</option>
                </select>
                <br>
            </fieldset>

            <!-- Bio -->
            <fieldset>
                <legend>Tell Something About You</legend>
                    <textarea id="bio" name="bio" placeholder="Leave a comment here"><?= $user->getBio() ?? "" ?></textarea>
            </fieldset>

            <!-- Chat Einstellungen -->
            <fieldset>
                <legend>Prefered Chat Layout</legend>

                <!-- Username and message in one line -->
                <label>
                    <input type="radio" id="userMessageOneLine" name="userMessageLine" value="inline" <?= $layout === "inline" ? "checked" : "" ?>>Username and message in one line</label>
                <br>

                <!-- Username and message in separate lines -->
                <label>
                    <input type="radio" id="userMessageSepLine" name="userMessageLine"  value="separated" <?= $layout === "separated" ? "checked" : "" ?>>Username and message in separated lines</label>
                <br>
            </fieldset>
            
            <div class="profileFormButtons">
            <!-- Cancel Button -->
            <a href="friends.php"><button type="button">Cancel</button></a>

            <!-- Save Button -->
            <button type="submit">Save</button>
            </div>
        </form>
    </main>

</body>
</html>