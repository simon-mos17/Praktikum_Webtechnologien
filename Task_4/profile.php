<?php
    require("start.php");

    if (!isset($_SESSION["user"]) || empty($_SESSION["user"])) {
    header("Location: login.php");
    exit;
  }

  if(!isset($_GET["friend"]) || empty($_GET["friend"])){
    header("Location: friends.php");
    exit;
  }

  $profileName = $_GET["friend"];
  
  $profileUser = $service->loadUser($profileName);
  if ($profileUser === false) {
    // Wenn der User nicht existiert -> zurück zur Freundesliste
    header("Location: friends.php");
    exit;
}

$firstName = $profileUser->getFirstName() ?? "";
$lastName  = $profileUser->getLastName() ?? "";
$bio       = $profileUser->getBio() ?? "";
$drink     = $profileUser->getCoffeeTea() ?? "";
$layout    = $profileUser->getLayout() ?? "";
$history   = $profileUser->getHistory() ?? [];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="cssFiles/styles.css">

    <title>Profile</title>
</head>
  <body>
    <main class="app">
      <h1>Profile of <?= htmlspecialchars($profileName, ENT_QUOTES) ?></h1>

      <!-- Navigation: Back to Chat | Remove Friend -->
      <!-- Profile header + nav bleibt -->
      <p>
        <a href="chat.php?friend=<?= urlencode($profileName) ?>">&lt; Back to Chat</a> |
        <a href="friends.php?remove=<?= urlencode($profileName) ?>" class="danger">Remove Friend</a>
      </p>

      <!-- NEW: zweispaltiges Layout -->
      <section class="profileLayout">
        <!-- Linke Spalte: großes Bild -->
        <img src="images/profile.png" alt="Profile Icon" class="profileAvatar" width="360" height="360">

        <!-- Rechte Spalte: Karte mit Bio + Daten -->
 <div class="profileCard">
        <p>
          <?= nl2br(htmlspecialchars(
                $bio !== "" ? $bio : "This user has not written a bio yet.",
                ENT_QUOTES
          )) ?>
        </p>

        <dl class="profileFacts">
          <dt>Username</dt>
          <dd><?= htmlspecialchars($profileName, ENT_QUOTES) ?></dd>

          <dt>Name</dt>
          <dd>
            <?= htmlspecialchars(
                  trim($firstName . " " . $lastName) !== ""
                    ? trim($firstName . " " . $lastName)
                    : "—",
                  ENT_QUOTES
            ) ?>
          </dd>

          <dt>Coffee or Tea?</dt>
          <dd>
            <?php
              switch ($drink) {
                  case "coffee":  echo "Coffee"; break;
                  case "tea":     echo "Tea"; break;
                  case "both":    echo "Coffee &amp; Tea"; break;
                  case "neither":
                  default:        echo "Neither nor";
              }
            ?>
          </dd>
            </dl>
        </div>
      </section>
    

       <!-- History der Profiländerungen -->
    <?php if (!empty($history)): ?>
      <section class="profileHistory">
        <h2>Profile Change History</h2>
        <ul>
          <?php foreach ($history as $entry): ?>
            <li><?= htmlspecialchars($entry, ENT_QUOTES) ?></li>
          <?php endforeach; ?>
        </ul>
      </section>
    <?php endif; ?>

    </main> 
  </body>
</html>