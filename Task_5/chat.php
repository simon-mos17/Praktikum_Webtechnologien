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
      <!--<link rel="stylesheet" href="cssFiles/styles.css">-->


      <title>Chat</title>
      <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
    rel="stylesheet">


  </head>
  <body class="bg-light">
      

    <div class="container d-flex justify-content-center">
      <main class="app w-100" style="max-width: 800px;">
          <h1 class="mb-3 mt-3">Chat with <?= $chatPartner?></h1>
          
          <!-- Navigation: Zurück | Profil | Remove Friend -->
  <p>
      <a class="btn btn-secondary" href="friends.php">&lt; Back</a> 
      <a class="btn btn-secondary" href="profile.php?friend=<?= urlencode($chatPartner) ?>">Profile</a> 
  <button
    type="button"
    class="btn btn-danger"
    data-bs-toggle="modal"
    data-bs-target="#removeFriendModal"
  >
    Remove Friend
  </button>
      <br>
  </p>


          <hr>
          
          <!-- Bereich1: Chatverlauf -->
          <section
    id="chatVerlauf"
    class="container border bg-white rounded p-3"

  >
          </section>

          <hr> 

          <!-- Bereich2: Send New Message-->
  <form class="chatForm mt-3">
    <div class="input-group">
      <input
        class="form-control"
        id="message"
        name="message"
        type="text"
        placeholder="New Message"
      >
      <button class="btn btn-primary" type="submit">
        Send
      </button>
    </div>
  </form>



      </main>
      <script>
    window.chatLayout = "<?= $chatLayout ?>";
  </script>
      <script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js">
  </script>
      <script src="jsFiles/backend.js"></script>
      <script src="jsFiles/script.js"></script>




  <!-- Remove Friend Modal -->
  <div class="modal fade" id="removeFriendModal" tabindex="-1" aria-labelledby="removeFriendModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="removeFriendModalLabel">
            Remove <?= htmlspecialchars($chatPartner) ?> as Friend
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          Do you really want to end your friendship?
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Cancel
          </button>

          <!-- Bestätigung: erzeugt die vorbereitete HTTP-Anfrage -->
          <a class="btn btn-primary" href="friends.php?remove=<?= urlencode($chatPartner) ?>">
            Yes, Please!
          </a>
        </div>
      </div>
    </div>
  </div>

  </body>
  </html>