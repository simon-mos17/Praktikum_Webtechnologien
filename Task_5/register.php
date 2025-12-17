<?php
require("start.php");

$errors = [];
$fieldErrors = [
  "username" => "",
  "password" => "",
  "confirm_pw" => ""
];

$username = "";
$password = "";
$confirm_pw = "";

if (!empty($_POST)) {
  $username = trim($_POST["username"] ?? "");
  $password = $_POST["password"] ?? "";
  $confirm_pw = $_POST["confirm_pw"] ?? "";

  // Username
  if (strlen($username) < 3) {
    $fieldErrors["username"] = "Mindestens 3 Zeichen.";
  } elseif ($service->userExists($username)) {
    $fieldErrors["username"] = "Username existiert bereits.";
  }

  // Password
  if (strlen($password) < 1) {
    $fieldErrors["password"] = "Kein Passwort eingegeben.";
  } elseif (strlen($password) < 8) {
    $fieldErrors["password"] = "Mindestens 8 Zeichen.";
  }

  // Confirm
  if ($password !== $confirm_pw) {
    $fieldErrors["confirm_pw"] = "Passwörter stimmen nicht überein.";
  }

  // Sammel-Errors (optional für oben)
  foreach ($fieldErrors as $msg) {
    if (!empty($msg)) $errors[] = $msg;
  }

  // Wenn keine Feldfehler, registrieren
  $hasFieldErrors = false;
  foreach ($fieldErrors as $msg) {
    if (!empty($msg)) { $hasFieldErrors = true; break; }
  }

  if (!$hasFieldErrors) {
    if ($service->register($username, $password)) {
      $_SESSION["user"] = $username;
      header("Location: friends.php");
      exit;
    } else {
      $errors[] = "Registrierung fehlgeschlagen.";
    }
  }
}

// Helper: Bootstrap class
function bsClass($posted, $fieldError) {
  if (!$posted) return "";                // noch nicht abgeschickt
  return empty($fieldError) ? "is-valid" : "is-invalid";
}
$posted = !empty($_POST);
?>
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Bootstrap -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">

  <title>Register</title>
</head>

<body class="bg-light">
<main class="container vh-100 d-flex flex-column justify-content-center align-items-center">

  <img src="images/user.png" alt="Register Icon" width="120" height="120" class="rounded-circle mb-4">

  <div class="card shadow-sm" style="width: 24rem;">
    <div class="card-body">

      <h4 class="text-center mb-4">Register Yourself</h4>

      <?php if (!empty($errors)): ?>
        <div class="alert alert-danger py-2" role="alert">
          Bitte Eingaben prüfen.
        </div>
      <?php endif; ?>

      <form action="register.php" method="post" novalidate>

        <!-- Username -->
        <div class="mb-3">
          <label class="form-label" for="username">Username</label>
          <input
            class="form-control <?= bsClass($posted, $fieldErrors["username"]) ?>"
            id="username"
            name="username"
            type="text"
            value="<?= htmlspecialchars($username) ?>"
            placeholder="Username"
            required>

          <div class="valid-feedback">Looks good!</div>
          <div class="invalid-feedback">
            <?= htmlspecialchars($fieldErrors["username"] ?: "Bitte gültigen Username eingeben.") ?>
          </div>
        </div>

        <!-- Password -->
        <div class="mb-3">
          <label class="form-label" for="password">Password</label>
          <input
            class="form-control <?= bsClass($posted, $fieldErrors["password"]) ?>"
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            required>

          <div class="valid-feedback">Looks good!</div>
          <div class="invalid-feedback">
            <?= htmlspecialchars($fieldErrors["password"] ?: "Bitte gültiges Passwort eingeben.") ?>
          </div>
        </div>

        <!-- Confirm -->
        <div class="mb-3">
          <label class="form-label" for="confirm_pw">Confirm Password</label>
          <input
            class="form-control <?= bsClass($posted, $fieldErrors["confirm_pw"]) ?>"
            id="confirm_pw"
            name="confirm_pw"
            type="password"
            placeholder="Confirm Password"
            required>

          <div class="valid-feedback">Looks good!</div>
          <div class="invalid-feedback">
            <?= htmlspecialchars($fieldErrors["confirm_pw"] ?: "Passwörter müssen übereinstimmen.") ?>
          </div>
        </div>

        <!-- Buttons -->
        <div class="d-flex gap-2">
          <a href="./login.php" class="btn btn-outline-secondary flex-fill">Cancel</a>
          <button type="submit" class="btn btn-primary flex-fill">Create Account</button>
        </div>

      </form>
    </div>
  </div>

</main>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
