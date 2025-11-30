<?php
    require("start.php");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../cssFiles/styles.css">

    <title>Profile</title>
</head>
  <body>
    <main class="app">
      <h1>Profile of Tom</h1>

      <!-- Navigation: Back to Chat | Remove Friend -->
      <!-- Profile header + nav bleibt -->
      <p>
        <a href="./chat.html">&lt; Back to Chat</a> |
        <a href="./friends.html" class="danger">Remove Friend</a>
      </p>

      <!-- NEW: zweispaltiges Layout -->
      <section class="profileLayout">
        <!-- Linke Spalte: großes Bild -->
        <img src="../images/profile.png" alt="Profile Icon" class="profileAvatar" width="360" height="360">

        <!-- Rechte Spalte: Karte mit Bio + Daten -->
        <div class="profileCard">
          <p>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
            ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo
            duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
            dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
            tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
          </p>

          <dl class="profileFacts">
            <dt>Coffee or Tea?</dt>
            <dd>Tea</dd>

            <dt>Name</dt>
            <dd>Thomas</dd>
          </dl>
        </div>
      </section>
    
    </main> 
  </body>
</html>