<!-- PHP -->
<?php
require("start.php");
//Session beenden
session_unset();
session_destroy();
?>

<!-- HTML -->
<!DOCTYPE html>
<html lang="de">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Bootstrap -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <title>Logout</title>
</head>

<body class="bg-light">
  <main class="container vh-100 d-flex flex-column justify-content-center align-items-center">

    <!-- Icon -->
    <img src="images/logout.png"
      alt="Logged Out Icon"
      width="140" height="140"
      class="rounded-circle mb-4">

    <!-- Card -->
    <div class="card shadow-sm" style="width: 22rem;">
      <div class="card-body text-center py-4">

        <h4 class="mb-2">Logged out...</h4>
        <p class="text-muted mb-4">See u!</p>

        <a href="login.php" class="btn btn-secondary w-100">
          Login again
        </a>
      </div>
    </div>
  </main>

  <!-- Bootstrap JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>