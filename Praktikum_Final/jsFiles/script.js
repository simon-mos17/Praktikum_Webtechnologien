// ======================================================
// 1. UTILITIES
// ======================================================
// Get Parameter auslesen und zurückgeben
function getChatpartner() {
  const url = new URL(window.location.href);
  const queryParams = url.searchParams;
  const friendValue = queryParams.get("friend");
  console.log("Teilaufgabe c – Chatpartner aus URL:", friendValue);
  return friendValue;
}

// ======================================================
// 2.1 FRIENDS – Rendering & UI
// ======================================================
function renderFriendsAndRequests(friendsData) {
  //Friendslist auslesen
  const friendsListElement = document.getElementById("friendsList");
  const requestsListElement = document.querySelector("ol");
  if (!friendsListElement || !requestsListElement) {
    return;
  }
  //Friednslist leeren
  friendsListElement.innerHTML = "";
  requestsListElement.innerHTML = "";

  // Arrays für akzeptierte Freunde und offene Anfragen
  const acceptedFriends = [];
  const requestedFriends = [];

  // Daten aus dem Backend nach Status aufteilen
  friendsData.forEach(function (entry) {
    // Defensive checks
    if (!entry || !entry.username || !entry.status) {
      return; // kaputter Eintrag -> überspringen
    }
    //Arrays befüllen
    if (entry.status === "accepted") {
      acceptedFriends.push(entry);
    } else if (entry.status === "requested") {
      requestedFriends.push(entry);
    }
  });

  // Freundesliste (accepted)
  acceptedFriends.forEach(function (friend) {
    // Neues <li> für diesen Freund
    const li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );

    // Link zur Chat-Seite mit Query-Parameter ?friend=<username>
    const a = document.createElement("a");
    a.classList.add("text-decoration-none");
    a.textContent = friend.username;
    a.setAttribute(
      "href",
      "./chat.php?friend=" + encodeURIComponent(friend.username)
    );
    li.appendChild(a);

    // Ungelesene Nachrichten anzeigen
    const unread = friend.unread ?? friend.unreadMessages;
    if (typeof unread === "number" && unread > 0) {
      const badge = document.createElement("span");
      badge.classList.add("badge", "bg-primary", "rounded-pill");
      badge.textContent = String(unread);
      li.appendChild(badge);
    }

    //Zu Friendslist hinzufügen
    friendsListElement.appendChild(li);
  });

  // Requests-Liste (requested)
  requestedFriends.forEach(function (friend) {
    const li = document.createElement("li");
    li.classList.add("list-group-item", "list-group-item-action");

    li.innerHTML =
      "Friend request from <strong>" + friend.username + "</strong>";

    li.style.cursor = "pointer";

    // 👉 Klick auf Anfrage öffnet Modal
    li.addEventListener("click", function () {
      openFriendRequestModal(friend.username);
    });

    requestsListElement.appendChild(li);
  });

  console.log("b2: DOM mit Friends/Requests aktualisiert.", {
    accepted: acceptedFriends,
    requested: requestedFriends,
  });
}

// Modal Freundschaftsanfrage öffnen
function openFriendRequestModal(username) {
  document.getElementById("friendRequestText").textContent =
    "Accept friend request from " + username + "?";

  document.getElementById("accept-username").value = username;
  document.getElementById("reject-username").value = username;

  const modal = new bootstrap.Modal(
    document.getElementById("friendRequestModal")
  );
  modal.show();
}

// Modal Freundschaftsanfrage schließen
function closeFriendRequestModal() {
  const modalEl = document.getElementById("friendRequestModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) {
    modal.hide();
  }
}

// ======================================================
// 2.2 FRIENDS – Backend (AJAX)
// ======================================================
// Holt die Freundesliste vom Backend und ruft renderFriendsAndRequests() auf.
function loadFriends() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log("b2: Daten von /friend erhalten:", data);

        renderFriendsAndRequests(data);
      } else {
        console.error(
          "b2: Fehler beim Laden der Freundesliste. Status:",
          xhr.status
        );
      }
    }
  };

  const url = "ajax_load_friends.php";
  console.log("b2: Lade Freundesliste von:", url);

  xhr.open("GET", url, true);
  xhr.send();
}

// ======================================================
// 2.3 FRIENDS – Initialisierung
// ======================================================
document.addEventListener("DOMContentLoaded", function () {
  // Nur auf friends.php ausführen
  const friendForm = document.querySelector(".friendAddForm");
  if (!friendForm) {
    return;
  }
  console.log("b2: Periodisches Laden der Freundesliste wird gestartet.");
  // Alle 1000 ms (1 Sekunde) neu laden
  window.setInterval(function () {
    loadFriends();
  }, 1000);

  // Einmaliger erster Aufruf, damit die Liste sofort gefüllt wird
  loadFriends();
});

// ======================================================
// 3. CHAT – Rendering
// ======================================================
// Liest den Query-Parameter "friend" aus der aktuellen URL aus.
function renderMessages(messageArray) {
  const chatSection = document.getElementById("chatVerlauf");
  if (!chatSection) return;
  chatSection.innerHTML = "";

  if (!Array.isArray(messageArray)) return;

  messageArray.forEach(function (msgObj) {
    if (
      !msgObj ||
      typeof msgObj.msg !== "string" ||
      typeof msgObj.from !== "string"
    )
      return;

    const p = document.createElement("p");
    p.classList.add("d-flex", "justify-content-between", "align-items-center");

    const textSpan = document.createElement("span");
    textSpan.className = "msg";

    if (window.chatLayout === "separated") {
      // Username separat
      textSpan.innerHTML =
        "<strong>" + msgObj.from + "</strong><br>" + msgObj.msg;
    } else {
      // Username + Message einzeilig
      textSpan.textContent = msgObj.from + ": " + msgObj.msg;
    }

    const timeSpan = document.createElement("span");
    timeSpan.className = "timeBadge";

    if (typeof msgObj.time === "number") {
      // Backend liefert Zeit als Timestamp (Millisekunden)
      const date = new Date(msgObj.time);

      // Uhrzeit formatieren wie in der Musterlösung (HH:MM:SS)
      timeSpan.textContent = date.toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }

    p.appendChild(textSpan);
    p.appendChild(timeSpan);
    chatSection.appendChild(p);
  });
}

// ======================================================
// 4. CHAT – Backend
// ======================================================

// Holt Nachrichten vom Backend (GET /message/<friend>) und ruft renderMessages() auf
function loadMessages() {
  const friendName = getChatpartner();
  if (!friendName) {
    console.warn("Kein Chatpartner gefunden – loadMessages abgebrochen.");
    return;
  }

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          renderMessages(data);
        } catch (e) {
          console.error("Fehler beim Parsen:", e);
        }
      } else {
        console.error("Fehler beim Laden der Nachrichten. Status:", xhr.status);
      }
    }
  };

  const url = "ajax_load_messages.php?to=" + encodeURIComponent(friendName);
  console.log("Lade Nachrichten von:", url);

  xhr.open("GET", url, true);
  xhr.send();
}

// Holt Text aus #message und sendet ihn über POST /message
function sendMessage() {
  const input = document.getElementById("message");
  const text = input.value.trim();

  if (text.length === 0) return; // leere Nachrichten ignorieren

  const friendName = getChatpartner();
  if (!friendName) {
    alert("Kein Chatpartner angegeben.");
    return;
  }

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 204) {
        console.log("Nachricht erfolgreich gesendet.");
        input.value = ""; // Textfeld leeren
        loadMessages(); // Chat sofort neu laden
      } else {
        console.error("Fehler beim Senden:", xhr.status);
        alert("Nachricht konnte nicht gesendet werden.");
      }
    }
  };

  xhr.open("POST", "ajax_send_message.php", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhr.send(
    JSON.stringify({
      msg: text, // <-- WICHTIG!
      to: friendName,
    })
  );
}

// ======================================================
// 5. CHAT – Initialisierung
// ======================================================
// Initialisierung NUR auf der chat.php
// Lädt Nachrichten, setzt Überschrift, aktiviert das Polling,
// verhindert echten Submit und nutzt sendMessage()
document.addEventListener("DOMContentLoaded", function () {
  const chatSection = document.getElementById("chatVerlauf");
  if (!chatSection) return; // nicht auf chat.html → abbrechen

  console.log("Teilaufgabe c – Chat-Seite erkannt. Initialisierung läuft...");

  const friendName = getChatpartner();

  // Überschrift anpassen, wenn vorhanden
  const heading = document.querySelector("main.app h1");
  if (heading && friendName) {
    heading.textContent = "Chat with " + friendName;
  }

  // Beim Start Nachrichten laden
  loadMessages();

  // Jede Sekunde neu laden (Polling)
  window.setInterval(loadMessages, 1000);

  // Formular abfangen und SENDEN per AJAX
  const chatForm = document.querySelector(".chatForm");
  if (chatForm) {
    chatForm.addEventListener("submit", function (event) {
      event.preventDefault();
      sendMessage();
    });
  }
});