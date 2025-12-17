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
    <link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
  rel="stylesheet">


    <title>Profile</title>
</head>
  <body class="bg-light">

<div class="container mt-4" style="max-width: 900px;">

  <!-- Header -->
  <h1 class="mb-3">Profile of <?= htmlspecialchars($profileName, ENT_QUOTES) ?></h1>

  <!-- Navigation -->
  <div class="d-flex gap-2 mb-4">
    <a href="chat.php?friend=<?= urlencode($profileName) ?>" class="btn btn-secondary">
      &lt; Back to Chat
    </a>

    <button
      class="btn btn-danger"
      data-bs-toggle="modal"
      data-bs-target="#removeFriendModal">
      Remove Friend
    </button>
  </div>

  <!-- Profile Layout -->
  <div class="row g-4">

    <!-- Avatar -->
    <div class="col-md-4 text-center">
      <div class="card p-3">
        <img
          src="images/profile.png"
          alt="Profile Icon"
          class="img-fluid rounded"
        >
      </div>
    </div>

    <!-- Profile Info -->
    <div class="col-md-8">
      <div class="card">
        <div class="card-body">

          <!-- Bio -->
          <p class="card-text">
            <?= nl2br(htmlspecialchars(
              $bio !== "" ? $bio : "This user has not written a bio yet.",
              ENT_QUOTES
            )) ?>
          </p>

          <hr>

          <!-- Facts -->
          <ul class="list-group list-group-flush">
            <li class="list-group-item">
              <strong>Username:</strong>
              <?= htmlspecialchars($profileName, ENT_QUOTES) ?>
            </li>

            <li class="list-group-item">
              <strong>Name:</strong>
              <?= htmlspecialchars(
                trim($firstName . " " . $lastName) !== ""
                  ? trim($firstName . " " . $lastName)
                  : "—",
                ENT_QUOTES
              ) ?>
            </li>

            <li class="list-group-item">
              <strong>Coffee or Tea?</strong>
              <?php
                switch ($drink) {
                  case "coffee": echo "Coffee"; break;
                  case "tea": echo "Tea"; break;
                  case "both": echo "Coffee & Tea"; break;
                  default: echo "Neither nor";
                }
              ?>
            </li>
          </ul>

        </div>
      </div>
    </div>
  </div>

  <!-- History -->
  <?php if (!empty($history)): ?>
    <div class="card mt-4">
      <div class="card-body">
        <h5 class="card-title">Profile Change History</h5>
        <ul class="list-group list-group-flush">
          <?php foreach ($history as $entry): ?>
            <li class="list-group-item">
              <?= htmlspecialchars($entry, ENT_QUOTES) ?>
            </li>
          <?php endforeach; ?>
        </ul>
      </div>
    </div>
  <?php endif; ?>

</div>

<!-- ================= Remove Friend Modal ================= -->
<div class="modal fade" id="removeFriendModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">

      <div class="modal-header">
        <h5 class="modal-title">
          Remove <?= htmlspecialchars($profileName, ENT_QUOTES) ?> as Friend
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body">
        Do you really want to end your friendship?
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
          Cancel
        </button>
        <a
          href="friends.php?remove=<?= urlencode($profileName) ?>"
          class="btn btn-danger">
          Yes, remove friend
        </a>
      </div>

    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>