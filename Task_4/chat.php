<?php
    require("start.php");

    if (!isset($_SESSION["user"]) || empty($_SESSION["user"])) {
        header("Location: login.php");
        exit;
    }

    if (!isset($_GET["friend"]) || empty($_GET["friend"])) {
        header("Location: friends.php");
        exit;
    }

$chatPartner = $_GET["friend"];

// aktuellen User laden
$currentUser = $service->loadUser($_SESSION["user"]);
$chatLayout  = $currentUser ? ($currentUser->getLayout() ?? "inline") : "inline";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="cssFiles/styles.css">


    <title>Chat</title>

</head>
<body>
    <main class="app">
        <h1>Chat with <?= $chatPartner?></h1>
        
        <!-- Navigation: Zurück | Profil | Remove Friend -->
<p>
    <a href="friends.php">&lt; Back</a> |
    <a href="profile.php?friend=<?= urlencode($chatPartner) ?>">Profile</a> |
    <a href="friends.php?remove=<?= urlencode($chatPartner) ?>" class="danger">
        Remove Friend
    </a>
    <br>
</p>


        <hr>
        
        <!-- Bereich1: Chatverlauf -->
        <section id="chatVerlauf" class="chatPanel">
        </section>

        <hr> 

        <!-- Bereich2: Send New Message-->
        <form class="chatForm">
            <input id="message" name="message" type="text" placeholder="New Message">
            <button type="submit">Send</button>
        </form>

    </main>
    <script>
  window.chatLayout = "<?= $chatLayout ?>";
</script>

    <script src="jsFiles/backend.js"></script>
    <script src="jsFiles/script.js"></script>
</body>
</html>