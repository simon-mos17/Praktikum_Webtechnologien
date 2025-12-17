<?php
require("start.php");
$error = "";

if (isset($_SESSION["user"])) {
  header("Location: friends.php");
  exit;
}

if (!empty($_POST)) {
  $username = $_POST['username'] ?? "";
  $password = $_POST['password'] ?? "";

  if ($service->login($username, $password)) {
    $_SESSION["user"] = $username;
    header("Location: friends.php");
    exit;
  } else {
    $error = "Login fehlgeschlagen. Benutzername oder Passwort falsch.";
  }
}
?>
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">

  <title>Login</title>
</head>

<body class="bg-light">

  <main class="container vh-100 d-flex flex-column justify-content-center align-items-center">

    <!-- Icon -->
    <img src="images/chat.png" alt="Speech Bubble Icon" width="120" height="120" class="rounded-circle mb-4">

    <!-- Card -->
    <div class="card shadow-sm" style="width: 22rem;">
      <div class="card-body text-center">

        <h4 class="mb-4">Please sign in</h4>

        <?php if (!empty($error)): ?>
          <div class="alert alert-danger py-2" role="alert">
            <strong><?= htmlspecialchars($error) ?></strong>
          </div>
        <?php endif; ?>

        <form action="login.php" method="post" class="text-start">

          <div class="mb-3">
            <input id="username" name="username" type="text"
                   class="form-control"
                   placeholder="Username" required>
          </div>

          <div class="mb-3">
            <input id="password" name="password" type="password"
                   class="form-control"
                   placeholder="Password" required>
          </div>

          <div class="d-flex gap-2 justify-content-center mt-3">
            <!-- Register: weiß -->
            <a href="./register.php" class="btn btn-outline-secondary flex-fill">
              Register
            </a>

            <!-- Login: blau -->
            <button type="submit" class="btn btn-primary flex-fill">
              Login
            </button>
          </div>

        </form>

      </div>
    </div>

  </main>

  <!-- Bootstrap JS Bundle -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>

  <!-- Deine Scripts (falls nötig) -->
  <script src="../jsFiles/backend.js"></script>
  <script src="../jsFiles/script.js"></script>
</body>
</html>
