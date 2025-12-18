<!-- PHP -->
<?php
// Session prüfen und setzen
require "start.php";

if (!isset($_SESSION["user"]) || empty($_SESSION["user"])) {
  header("Location: login.php");
  exit;
}

$currentusername = $_SESSION["user"];
$user = $service->loadUser($currentusername);
$layout = $user->getLayout() ?? "";

// Werte aus POST holen
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $firstName = $_POST["firstName"] ?? "";
  $lastName  = $_POST["lastName"] ?? "";
  $drink     = $_POST["drink"] ?? "neither";
  $bio       = $_POST["bio"] ?? "";
  $layout    = $_POST["userMessageLine"] ?? "";

  // Werte in User-Objekt schreiben
  $user->setFirstName($firstName);
  $user->setLastName($lastName);
  $user->setCoffeeTea($drink);
  $user->setBio($bio);
  $user->setLayout($layout);
  $user->addHistoryEntry(date('Y-m-d H:i:s'));

  // Speichern
  if ($service->saveUser($user)) {
    header("Location: friends.php");
    exit;
  } else {
    $error = "Profil konnte nicht gespeichert werden.";
  }
}
?>

<!-- HTML -->
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Bootstrap -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
  <title>Settings</title>
</head>

<body class="bg-light">
  <div class="container d-flex justify-content-center">
    <main class="w-100" style="max-width: 700px;">

      <h1 class="text-center mt-4">Profile Settings</h1>
      <hr>

      <form action="settings.php" method="post">
        <!-- Base Data-->
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="mb-3">Base Data</h5>

            <div class="mb-3">
              <label for="firstName" class="form-label">First Name</label>
              <input
                type="text"
                class="form-control"
                id="firstName"
                name="firstName"
                value="<?= $user->getFirstName() ?? "" ?>">
            </div>

            <div class="mb-3">
              <label for="lastName" class="form-label">Last Name</label>
              <input
                type="text"
                class="form-control"
                id="lastName"
                name="lastName"
                value="<?= $user->getLastName() ?? "" ?>">
            </div>

            <div class="mb-3">
              <label for="drink" class="form-label">Coffee or Tea?</label>
              <select class="form-select" id="drink" name="drink">
                <?php $drink = $user->getCoffeeTea() ?? "neither"; ?>
                <option value="neither" <?= $drink === "neither" ? "selected" : "" ?>>Neither nor</option>
                <option value="coffee" <?= $drink === "coffee" ? "selected" : "" ?>>Coffee</option>
                <option value="tea" <?= $drink === "tea" ? "selected" : "" ?>>Tea</option>
                <option value="both" <?= $drink === "both" ? "selected" : "" ?>>Both</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Tell Something about you -->
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="mb-3">Tell Something About You</h5>

            <div class="mb-3">
              <label for="bio" class="form-label">Short Description</label>
              <textarea
                class="form-control"
                id="bio"
                name="bio"
                rows="4"><?= $user->getBio() ?? "" ?></textarea>
            </div>
          </div>
        </div>

        <!-- Chat Layout -->
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="mb-3">Preferred Chat Layout</h5>

            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="userMessageLine"
                id="layoutInline"
                value="inline"
                <?= $layout === "inline" ? "checked" : "" ?>>
              <label class="form-check-label" for="layoutInline">
                Username and message in one line
              </label>
            </div>

            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="userMessageLine"
                id="layoutSeparated"
                value="separated"
                <?= $layout === "separated" ? "checked" : "" ?>>
              <label class="form-check-label" for="layoutSeparated">
                Username and message in separated lines
              </label>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="d-flex mb-5">
          <a href="friends.php" class="btn btn-secondary w-50 me-2">Cancel</a>
          <button type="submit" class="btn btn-primary w-50">Save</button>
        </div>
      </form>

    </main>
  </div>

</body>

</html>