<?php
require "start.php";

if (!isset($_SESSION["user"]) || empty($_SESSION["user"])) {
    header("Location: login.php");
    exit;
}

if (isset($_GET["remove"]) && !empty($_GET["remove"])) {
    $friendToRemove = $_GET["remove"];

    $ok = $service->removeFriend($friendToRemove);

    // Optional Erfolg prüfen
    // if(!$ok) { echo "Error removing friend"; }

    // Zurück zur Freundesliste
    header("Location: friends.php");
    exit;
}

// Accept / Reject Handler
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["action"])) {

    $action = $_POST["action"];
    $username = $_POST["username"] ?? "";

    if ($action === "accept-friend") {
        $ok = $service->friendAccept($username);
        http_response_code($ok ? 204 : 500);
        exit;
    }

    if ($action === "reject-friend") {
        $ok = $service->friendDismiss($username);
        http_response_code($ok ? 204 : 500);
        exit;
    }
}


//Neuen Freund hinzufügen
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["friendname"])) {

    $newFriend = trim($_POST["friendname"]);

    if ($newFriend !== "") {

        // Aktuellen Usernamen ermitteln
        $sessionUser = $_SESSION['user'];
        if (is_string($sessionUser)) {
            $currentUsername = $sessionUser;
        } elseif (is_object($sessionUser) && method_exists($sessionUser, 'getUsername')) {
            $currentUsername = $sessionUser->getUsername();
        } else {
            $currentUsername = null;
        }

        // 1) Alle User laden
        $allUsers    = $service->loadUsers();
        // 2) Alle Freunde laden
        $friendsList = $service->loadFriends();

        // Liste der bereits bekannten Freunde / Requests
        $existingFriends = [];
        if (is_array($friendsList)) {
            foreach ($friendsList as $friend) {
                // Friend-Objekt -> Username holen
                if (method_exists($friend, 'getUsername')) {
                    $existingFriends[] = $friend->getUsername();
                } elseif (property_exists($friend, 'username')) {
                    $existingFriends[] = $friend->username;
                }
            }
        }

        $error = null;

        // === Regeln wie früher im JS ===

        // a) Nicht sich selbst hinzufügen
        if ($currentUsername !== null && $newFriend === $currentUsername) {
            $error = "Du kannst dich nicht selbst als Freund hinzufügen.";
        }
        // b) Nicht hinzufügen, wenn schon Freund / Anfrage vorhanden
        elseif (in_array($newFriend, $existingFriends, true)) {
            $error = "Dieser Benutzer ist bereits in deiner Freundesliste oder angefragt.";
        }
        // c) Nur existierende Nutzer zulassen
        elseif (!is_array($allUsers) || !in_array($newFriend, $allUsers, true)) {
            $error = "Diesen Benutzer gibt es nicht.";
        }

        // Wenn kein Fehler -> Freundschaftsanfrage schicken
        if ($error === null) {
            $service->friendRequest(["username" => $newFriend]);
        } else {
            // Fehler ggf. merken (sehr einfache Variante über GET-Parameter)
            header("Location: friends.php?error=" . urlencode($error));
            exit;
        }
    }

    header("Location: friends.php");
    exit;
}



?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"> 
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Friends</title>
    <link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
  rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>

</head>
<body class="bg-light">

  <div class="container d-flex justify-content-center">
    <main class="app w-100" style="max-width: 800px;">
        <h1 >Friends</h1>

        <!-- Navigation Logout und Settings -->
        <p>
            <a class="btn btn-secondary" href="logout.php">&lt; Logout</a> 
            <a class="btn btn-secondary" href="settings.php">Settings</a>
        </p>

        <hr>

        <!-- Bereich1: Ungeordnete Liste mit aktuellen Freunden -->
        <section class="friendsPanel">
            <ul class="list-group" id="friendsList">
                <!-- Wird komplett von JavaScript (loadFriends/renderFriendsAndRequests)
                     dynamisch mit den Freunden des aktuell eingeloggten Users befüllt. -->
            </ul>
        </section>

        <hr>

        <!-- Bereich2: Geordnete Liste mit Freundschaftsanfragen -->
        <section>
            <h2>New Requests</h2>
            <ol class="list-group requestsList">
                <!-- Wird ebenfalls per JavaScript (renderFriendsAndRequests)
                     mit "requested"-Einträgen befüllt. -->
            </ol>
        </section>

        <hr>

        <!-- Bereich3: Formular zum Hinzufügen neuer Freunde-->
        <form action="friends.php" method="post" class="friendAddForm mt-3">
            <div class="input-group">
            <!-- Eingabefeld mit datalist-Verknüpfung -->
            <input class="form-control" placeholder="Add Friend to List" name="friendname" id="friend-request-name" list="friend-selector" autocomplete="off">
            <button class="btn btn-primary" type="submit" id="friend-add-button">Add</button>
</div>
            <datalist id="friend-selector">
            <?php
                $allUsers    = $service->loadUsers();
                $friendsList = $service->loadFriends();
                $sessionUser = $_SESSION['user'];

                // aktuellen Benutzer als String holen
                if (is_string($sessionUser)) {
                    $currentUsername = $sessionUser;
                } elseif (is_object($sessionUser) && method_exists($sessionUser, 'getUsername')) {
                    $currentUsername = $sessionUser->getUsername();
                } else {
                    $currentUsername = null;
                }

                // Blockliste: ich selbst + alle Freunde (egal ob accepted oder requested)
                $blocked = [];
                if ($currentUsername !== null) {
                    $blocked[] = $currentUsername;
                }

                if (is_array($friendsList)) {
                    foreach ($friendsList as $friend) {
                        if (method_exists($friend, 'getUsername')) {
                            $blocked[] = $friend->getUsername();
                        } elseif (property_exists($friend, 'username')) {
                            $blocked[] = $friend->username;
                        }
                    }
                }

                if (is_array($allUsers)) {
                    foreach ($allUsers as $u) {
                        if (!in_array($u, $blocked, true)) {
                            echo '<option value="' . htmlspecialchars($u, ENT_QUOTES) . '"></option>';
                        }
                    }
                }
            ?>
            </datalist>




        </form>
    </main>
  </div>

<!-- Friend Request Modal -->
<div class="modal fade" id="friendRequestModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">

      <div class="modal-header">
        <h5 class="modal-title">Friend request</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body">
        <p id="friendRequestText"></p>
      </div>

      <div class="modal-footer">
        <form method="post" class="d-inline">
          <input type="hidden" name="username" id="reject-username">
          <input type="hidden" name="action" value="reject-friend">
          <button type="submit"
        class="btn btn-secondary"
        onclick="closeFriendRequestModal()">
  Dismiss
</button>

        </form>

        <form method="post" class="d-inline">
          <input type="hidden" name="username" id="accept-username">
          <input type="hidden" name="action" value="accept-friend">
          <button type="submit"
        class="btn btn-primary"
        onclick="closeFriendRequestModal()">
  Accept
</button>

        </form>
      </div>

    </div>
  </div>
</div>

</body>
    <script src="jsFiles/backend.js"></script>
    <script src="jsFiles/script.js"></script>

</html>
