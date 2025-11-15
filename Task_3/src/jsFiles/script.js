
// =================================================
// Teilaufgabe a – Registrierung mit Validierung
// Lokale Checks + Server-Check "User Exists" (AJAX)
// =================================================
    //
    // Prüft bei der Registrierung:
    // 1) Username min. 3 Zeichen
    // 2) Passwort min. 8 Zeichen
    // 3) Passwort-Wiederholung gleich Passwort
    // 4) Username darf noch NICHT verwendet sein
    //    -> per AJAX-Request "User Exists" an den Chat-Server
    //
    // Solange Fehler vorhanden sind -> Formular DARF NICHT
    // abgesendet werden (siehe Aufgabenstellung).



    // Markiert ein Eingabefeld als korrekt (grüner Rahmen).
    function markValid(inputElement) {
        inputElement.classList.remove("input-error"); // rote Umrandung entfernen
        inputElement.classList.add("input-valid");    // grüne Umrandung hinzufügen
    }



    // Markiert ein Eingabefeld als fehlerhaft (roter Rahmen).
    function markInvalid(inputElement) {
        inputElement.classList.remove("input-valid"); // grüne Umrandung entfernen
        inputElement.classList.add("input-error");    // rote Umrandung hinzufügen
    }



    // Wird über onsubmit="return checkRegister();" im <form>-Tag
    // aufgerufen.
    // Ablauf:
    // 1) Lokale Prüfungen (Länge, Wiederholung)
    // 2) Wenn lokal Fehler -> false (Formular wird NICHT gesendet)
    // 3) Wenn lokal alles OK -> AJAX "User Exists":
    //       GET  <backendUrl>/user/<username>
    //       204 -> Benutzer existiert -> Fehler
    //       404 -> Benutzer existiert nicht -> OK -> form.submit()

    function checkRegister() {

        console.log("checkRegister gestartet");  // Debug-Ausgabe in Konsole

        // Formular-Element über seine ID holen
        const form = document.getElementById("registerform");

        // Einzelne Input-Felder aus dem Formular holen
        const usernameInput = form.querySelector("#username");
        const passwordInput = form.querySelector("#password");
        const confirmInput  = form.querySelector("#confirm_pw");

        // Werte der Felder auslesen
        const username = usernameInput.value.trim(); // trim() entfernt Leerzeichen vorne/hinten
        const password = passwordInput.value;
        const confirm  = confirmInput.value;

        // Flag, ob alles gültig ist.
        // Anfangs gehen wir davon aus: alles ok
        let allValid = true;


        // =============================================
        // 1) Benutzername muss min. 3 Zeichen lang sein
        // =============================================
        if (username.length < 3) {
            // Regel verletzt -> Feld rot markieren
            markInvalid(usernameInput);
            allValid = false; // mindestens EIN Fehler -> später nicht senden
        } else {
            // Regel erfüllt -> Feld grün markieren
            markValid(usernameInput);
        }


        // =============================================
        // 2) Passwort muss min. 8 Zeichen lang sein
        // =============================================
        if (password.length < 8) {
            markInvalid(passwordInput);
            allValid = false;
        } else {
            markValid(passwordInput);
        }


        // =========================================================
        // 3) Passwort-Wiederholung muss exakt IDENTISCH sein
        //    confirm.length === 0 verhindert, dass ein leeres Feld
        //    als "richtig" durchgeht.
    // =========================================================
        if (confirm !== password || confirm.length === 0) {
            markInvalid(confirmInput);
            allValid = false;
        } else {
            markValid(confirmInput);
        }


        // ================================================
        // Wenn IRGENDEINE Regel verletzt ist:
        // -> NICHT senden
        // -> false zurückgeben (Browser blockiert Submit)
        // ================================================
        if (!allValid) {
            console.log("Fehler im Formular – Formular wird NICHT gesendet.");
            return false;  // Formular bleibt auf der Seite
        }


        // ===================================================
        // 4) SERVER-TEIL: Gibt es den User? (AJAX-Teil)
        // Jetzt prüfen wir, ob der Username schon verwendet wird.
        // Dazu nutzen wir window.backendUrl aus backend.js:
        //   GET  <backendUrl>/user/<username>
        //      - 204 -> Benutzer existiert (Fehler)
        //      - 404 -> Benutzer existiert nicht (OK -> registrieren)
        // ===================================================

        // readyState und Statuscodes (kurz)
        /*
            readyState (xhr.readyState):
            0 = erstellt
            1 = geöffnet
            2 = Header erhalten
            3 = lädt Daten
            4 = ***Antwort komplett da***

            HTTP-Status (xhr.status) für User Exists:
            204 = Benutzer EXISTIERT
            404 = Benutzer EXISTIERT NICHT
        */

        // Neues XMLHttpRequest-Objekt erzeugen
        const xhr = new XMLHttpRequest();

        // Reaktion auf die Server-Antwort definieren
        xhr.onreadystatechange = function () {
            // 4 = Request fertig, Antwort ist komplett da
            if (xhr.readyState === 4) {

                // 204 -> Username existiert bereits -> Fehler
                if (xhr.status === 204) {
                    markInvalid(usernameInput); // Feld rot
                    alert("Dieser Benutzername wird bereits verwendet. Bitte einen anderen Namen wählen.");
                    console.log("Server: Username existiert bereits (204).");
                    // Kein form.submit() -> Formular bleibt auf Register-Seite
                }

                // 404 -> Username existiert NICHT -> OK
                else if (xhr.status === 404) {
                    markValid(usernameInput);   // zur Sicherheit grün setzen
                    console.log("Server: Username ist frei (404). Formular wird jetzt abgesendet.");

                    // WICHTIG:
                    // Wir schicken das Formular jetzt MANUELL ab.
                    // Dadurch wird die Seite zu friends.html weitergeleitet.
                    form.submit();
                }

                // Andere Statuscodes -> allgemeiner Fehler (z.B. Serverproblem)
                else {
                    markInvalid(usernameInput);
                    alert("Fehler beim Prüfen des Benutzernamens (Status " + xhr.status + "). Bitte später nochmal versuchen.");
                    console.error("Unerwarteter Status-Code beim User-Check:", xhr.status);
                }
            }
        };

        // URL für den User-Exists-Check zusammenbauen
        // Beispiel:
        //   https://online-lectures-cs.thi.de/chat/DEINE_ID/user/Tom
        const url = window.backendUrl + "/user/" + encodeURIComponent(username);

        console.log("Sende User-Exists-Request an:", url);

        // GET-Request vorbereiten
        // Hinweis: Für User Exists ist KEIN Token nötig.
        xhr.open("GET", url, true);

        // Request abschicken
        xhr.send();

        // WICHTIG:
        // Wir geben hier IMMER false zurück,
        // weil wir das Formular NUR in xhr.onreadystatechange
        // (also nach der Server-Antwort) mit form.submit() absenden.
        return false;
    }

// =================================================
// Teilaufgabe b1 – Hinzufügen neuer Freunde
// =================================================
    // Ziel:
    // - Vom Backend alle Nutzer holen (List Users).
    // - Vorschläge in einer datalist anzeigen.
    // - Beim Tippen wird gefiltert.
    // - Klick auf "Add" sendet eine Freundschaftsanfrage (POST /friend).
    // - Es dürfen NICHT auswählbar sein:
    //      * der aktuell eingeloggte Nutzer (Tom)
    //      * bereits bestehende Freunde aus der Liste
    //
    // Wir gehen davon aus:
    // - Du bist als "Tom" eingeloggt (wir nutzen window.tomToken).
    // - backendUrl und tomToken kommen aus backend.js.


    // Globale Variablen nur für die Friends-Seite
    let allUsers = [];          // Hier speichert man später alle Usernamen, die das Backend zurückgibt (z.B. ["Tom", "Jerry"])
    let currentFriends = [];    // Liste der Freunde aus der HTML-Liste
    const currentUserName = "Tom"; // Aktueller Nutzer (für dein Praktikum reicht das so)



    // liest aktuelle Freunde aus dem DOM
    // Schaut in die UL #friendsList und sammelt die Link-Texte.
    function readFriendsFromDom() {
        const friendsListElement = document.getElementById("friendsList");
        if (!friendsListElement) {
            return;
        }

        const friendLinks = friendsListElement.querySelectorAll("li a"); // Sucht alle <a> Tags in den <li> der Liste, also z.b Tom, Marvin, Tick, Trick etc.
        currentFriends = Array.from(friendLinks).map(link => link.textContent.trim()); // → Wandelt die NodeList in ein richtiges Array um und extrahiert den sichtbaren Text (den Namen des Freundes).

        console.log("Aktuelle Freunde aus DOM:", currentFriends); // Das Ergebnis speicherst du in currentFriends.
        //  Beispiel: ["Tom", "Marvin", "Tick", "Trick"]. Du weiß man, welche Freunde schon existieren
    }



    // lädt alle Nutzer vom Backend (List Users)
    // GET backendUrl + "/user" mit Tom-Token
    function loadAllUsers() {
        const xhr = new XMLHttpRequest(); // Erstellt neues AJAX - Objekt

        xhr.onreadystatechange = function () { // Was passiert wenn sich Zustand des Requests ändert
            if (xhr.readyState === 4) { // Antwort vom Server ist komplett da

                if (xhr.status === 200) { // Alles OK
                    // Antwort ist ein JSON-Array von Strings, z.B. ["Tom", "Jerry"]
                    const data = JSON.parse(xhr.responseText);
                    allUsers = data; // Speicjer Liste ab, damit andere Funktionen sie benutzen können
                    console.log("Alle Nutzer vom Backend:", allUsers);

                    // Nach dem Laden der Nutzer Vorschlagsliste initial aktualisieren
                    updateFriendOptions(""); // Datalist sofort befüllen
                } else {
                    console.error("Fehler beim Laden der Nutzerliste. Status:", xhr.status);
                }
            }
        };

        const url = window.backendUrl + "/user"; // Baut die URL, z. B. https://online-lectures-cs.thi.de/chat/DEINE_ID/user.
        console.log("Lade Nutzerliste von:", url);

        xhr.open("GET", url, true); // bereitet einen GET-Request vor.
        // Token für Tom (Authentifizierung)
        xhr.setRequestHeader("Authorization", "Bearer " + window.tomToken); // Hängt dein Token für Tom an (Authentifizierung).
        xhr.send(); // Schickt die Anfrage los
    }



    // Füllt die datalist #friend-selector mit <option>-Elementen.
    // - Nimmt allUsers als Basis
    // - filtert:
    //    * aktuellen Nutzer (Tom) raus
    //    * bereits bestehende Freunde raus
    //    * optional nach dem eingegebenen Text
    function updateFriendOptions(filterText) {
        const datalist = document.getElementById("friend-selector"); // Datalist holen
        if (!datalist) {
            return;
        }

        datalist.innerHTML = ""; // Alle alten Vorschläge werden gelöscht (Liste aufräumen).

        const filter = filterText.trim().toLowerCase(); // Der aktuelle Eingabetext aus dem Input wird kleingeschrieben, Leerzeichen entfernt.

        // Nutzer filtern: nicht currentUser, nicht bereits Freund
        let candidates = allUsers.filter(name => // Start mit allen Nutzern, dann
            name !== currentUserName && !currentFriends.includes(name) // aktueller User (Tom) wird entfernt + alle, die schon in der Freundesliste stehen, werden entfernt.
        );

        // Wenn etwas im Input steht -> zusätzlich nach Text filtern
        if (filter.length > 0) { // enn der Nutzer etwas getippt hat (filter.length > 0): nochmal zusätzlich nach Text filtern
            candidates = candidates.filter(name => 
                name.toLowerCase().includes(filter)); // Für jeden verbleibenden Namen erzeugst du ein <option> -> option.value = name -> hängt das an die datalist an.
        }

        // Für jeden Kandidaten ein <option>-Element erzeugen
        candidates.forEach(name => {
            const option = document.createElement("option");
            option.value = name;  // value = tatsächlicher Name
            datalist.appendChild(option);
        });

        console.log("Aktualisierte Vorschläge:", candidates);
    }



    // Wird aufgerufen, wenn der Add-Button geklickt wird.
    // Prüft:
    //  - Name existiert in allUsers
    //  - Name ist nicht Tom
    //  - Name ist noch kein Freund
    // Wenn OK -> POST /friend mit JSON {"username": "<Name>"}
    function handleAddFriend() {
        const input = document.getElementById("friend-request-name"); // Input holen
        if (!input) {
            return;
        }

        const name = input.value.trim(); // eingegebener Text, zugeschnitten

        // Grund-Checks (lokal) 4 insgesmat
        let valid = true;

            // 1) Darf nicht leer sein
            if (name.length === 0) {
                valid = false;
            }

            // 2) Muss in der Liste aller Nutzer vorkommen
            if (!allUsers.includes(name)) {
                valid = false;
            }

            // 3) Darf nicht der aktuelle Nutzer sein
            if (name === currentUserName) {
                valid = false;
            }

            // 4) Darf nicht bereits Freund sein
            if (currentFriends.includes(name)) {
                valid = false;
            }

        if (!valid) { // Falls irgendwas nicht stimmt
            // Visuelles Feedback: Eingabefeld rot einfärben
            markInvalid(input);
            alert("Ungültiger Freundesname. Entweder existiert der Nutzer nicht, " +
                "ist bereits dein Freund oder du bist es selbst.");
            return;
        }

        // Wenn wir hier sind, ist die Eingabe lokal OK.
        // Visuell schon mal grün machen
        markValid(input);

        // ==== AJAX: Freundschaftsanfrage senden (POST /friend) ====
        //
        // Kurz zur Erinnerung:
        //   URL:  backendUrl + "/friend"
        //   Method: POST
        //   Header:
        //      Content-Type: application/json
        //      Authorization: Bearer <Tom-Token>
        //   Body (JSON):
        //      { "username": "<ausgewählter Name>" }
        //
        // Server-Response:
        //   204 -> Anfrage erfolgreich angelegt, kein Inhalt
        //   sonst -> Fehler


        // kleine ASCII-Lernhilfe:
        /*
            HTTP-Statuscodes (hier wichtig):
            200 = OK      (Antwort mit Inhalt)
            204 = No Content (Erfolg ohne Inhalt, hier: Freundschaftsanfrage angelegt)
            400 = Bad Request (fehlerhafte Anfrage)
            401 = Unauthorized (Token fehlt/falsch)
            404 = Not Found (z.B. Nutzer existiert nicht)
        */

        const xhr = new XMLHttpRequest(); // Neues XMLHttpRequest erzeugen

        xhr.onreadystatechange = function () { // onreadystate prüfen
            if (xhr.readyState === 4) {

                if (xhr.status === 204) {
                    console.log("Freundschaftsanfrage erfolgreich erstellt für:", name);
                    alert("Freundschaftsanfrage an " + name + " wurde gesendet.");

                    // Input leeren
                    input.value = "";

                    // Neu aus DOM einlesen (später, wenn b2 implementiert ist,
                    // würde die Freundesliste vom Server neu geladen)
                    readFriendsFromDom();
                    updateFriendOptions("");
                } else {
                    console.error("Fehler beim Senden der Freundschaftsanfrage. Status:", xhr.status);
                    alert("Fehler beim Senden der Freundschaftsanfrage (Status " + xhr.status + ").");
                    markInvalid(input);
                }
            }
        };

        const url = window.backendUrl + "/friend"; // Ziel für Freundschaftsanfrage
        console.log("Sende Freundschaftsanfrage an:", url, "für Nutzer:", name);

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", "Bearer " + window.tomToken);

        const body = { // Das JSON Objekt
            username: name
        };
        const jsonString = JSON.stringify(body); // daraus wird ein JSON-String
        xhr.send(jsonString); 
    }


    // ===============================================
    // Initialisierung für die Friends-Seite
    // Diese Funktion wird beim Laden der Seite aufgerufen.
    // ===============================================
    document.addEventListener("DOMContentLoaded", function () {
        // Nur auf friends.html ausführen. Wartet, bis das HTML geladen ist.
        const friendForm = document.querySelector(".friendAddForm");
        if (!friendForm) {
            return; // wir sind nicht auf der Friends-Seite
        }

        console.log("Friends-Seite erkannt. Initialisiere b1-Logik.");

        // 1) Aktuelle Freunde aus der HTML-Liste auslesen
        readFriendsFromDom();

        // 2) Alle Nutzer vom Backend laden
        loadAllUsers();

        // 3) Events für Input und Button setzen
        const input = document.getElementById("friend-request-name");
        const addButton = document.getElementById("friend-add-button");

        if (input) {
            // Bei jeder Eingabe Vorschläge neu filtern
            input.addEventListener("input", function () {
                updateFriendOptions(input.value);
            });
        }

        if (addButton) {
            addButton.addEventListener("click", handleAddFriend);
        }
    });

// =================================================
// Teilaufgabe b2 – Freundesliste & Requests aus Backend laden
// =================================================
    
    // Ziel von b2:
    //  - Alle Freundschaften vom Backend holen (GET /friend).
    //  - Einträge mit status "accepted" in der UL #friendsList anzeigen.
    //  - Einträge mit status "requested" in der OL mit den Requests anzeigen.
    //  - Die Friends-Liste soll Links zur Chat-Seite enthalten:
    //        chat.html?friend=<username>
    //  - Das Ganze wird jede Sekunde automatisch aktualisiert.
    //
    // WICHTIG:
    //  - Wir ändern keine bestehenden Funktionen, sondern ergänzen nur neue.


    // Hilfsfunktion: DOM für Friends und Requests neu aufbauen
    // friendsData: Array von Objekten aus dem Backend
    //   z.B. [{ username: "Jerry", status: "accepted" }, ...]
    function renderFriendsAndRequests(friendsData) {
        // UL mit den Freunden
        const friendsListElement = document.getElementById("friendsList");
        // OL mit den Requests – es gibt nur eine <ol> auf der Seite
        const requestsListElement = document.querySelector("ol");

        if (!friendsListElement || !requestsListElement) {
            // Sicherheits-Check: wenn wir nicht auf friends.html sind, abbrechen
            return;
        }

        // Listen vor dem Neuaufbau komplett leeren
        friendsListElement.innerHTML = "";
        requestsListElement.innerHTML = "";

        // Arrays für akzeptierte Freunde und offene Anfragen
        const acceptedFriends = [];
        const requestedFriends = [];

        // Daten aus dem Backend nach Status aufteilen
        friendsData.forEach(function (entry) {
            // defensive checks: wir erwarten username + status
            if (!entry || !entry.username || !entry.status) {
                return; // kaputter Eintrag -> überspringen
            }

            if (entry.status === "accepted") {
                acceptedFriends.push(entry);
            } else if (entry.status === "requested") {
                requestedFriends.push(entry);
            }
        });

        // ===== Freundesliste (accepted) =====
        acceptedFriends.forEach(function (friend) {
            // Neues <li> für diesen Freund
            const li = document.createElement("li");

            // Link zur Chat-Seite mit Query-Parameter ?friend=<username>
            const a = document.createElement("a");
            a.textContent = friend.username;
            a.setAttribute(
                "href",
                "./chat.html?friend=" + encodeURIComponent(friend.username)
            );

            li.appendChild(a);

            // Falls der Server ein Feld für ungelesene Nachrichten liefert,
            // zeigen wir das über ein Badge rechts an (optional).
            const unread = friend.unread ?? friend.unreadMessages;
            if (typeof unread === "number" && unread > 0) {
                const badge = document.createElement("span");
                badge.className = "badge";
                badge.textContent = String(unread);
                li.appendChild(badge);
            }

            friendsListElement.appendChild(li);  // <li> in die UL einfügen
        });

        // Sehr wichtig:
        // Nachdem wir die Friend-Liste neu gebaut haben, aktualisieren wir
        // currentFriends (aus b1), damit die Add-Freund-Funktion immer weiß,
        // wer aktuell schon Freund ist.
        readFriendsFromDom();

        // ===== Requests-Liste (requested) =====
        requestedFriends.forEach(function (friend) {
            const li = document.createElement("li");

            // Text "Friend request from <Name>"
            const textLink = document.createElement("a");
            textLink.innerHTML =
                'Friend request from <strong>' + friend.username + "</strong>";
            li.appendChild(textLink);

            // Buttons: Accept / Reject (Funktionalität wäre Teil einer anderen Aufgabe)
            const acceptBtn = document.createElement("button");
            acceptBtn.type = "button";
            acceptBtn.textContent = "Accept";

            const rejectBtn = document.createElement("button");
            rejectBtn.type = "button";
            rejectBtn.textContent = "Reject";
            rejectBtn.classList.add("danger");

            li.appendChild(acceptBtn);
            li.appendChild(rejectBtn);

            requestsListElement.appendChild(li);
        });

        console.log("b2: DOM mit Friends/Requests aktualisiert.", {
            accepted: acceptedFriends,
            requested: requestedFriends
        });
    }



    // Holt die Freundesliste vom Backend und ruft renderFriendsAndRequests() auf.
    function loadFriends() {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            // ReadyState 4 → Server hat vollständig geantwortet
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {     // 200 OK → gültige Liste erhalten
                    // Erwartet: JSON-Array von Einträgen mit username + status
                    const data = JSON.parse(xhr.responseText);
                    console.log("b2: Daten von /friend erhalten:", data);

                    renderFriendsAndRequests(data);
                } else {
                    console.error("b2: Fehler beim Laden der Freundesliste. Status:", xhr.status);
                }
            }
        };

        const url = window.backendUrl + "/friend";
        console.log("b2: Lade Freundesliste von:", url);

        xhr.open("GET", url, true);
        // Token für Tom (Authentifizierung)
        xhr.setRequestHeader("Authorization", "Bearer " + window.tomToken);
        xhr.send();
    }

    // -----------------------------------------------
    // b2-Initialisierung: loadFriends jede Sekunde ausführen
    // Wir hängen EINEN ZUSÄTZLICHEN DOMContentLoaded-Listener an,
    // damit der bestehende b1-Code unverändert bleiben kann
    // -----------------------------------------------
    document.addEventListener("DOMContentLoaded", function () {
        // Nur auf friends.html ausführen (es gibt dort das Formular .friendAddForm)
        const friendForm = document.querySelector(".friendAddForm");
        if (!friendForm) {
            return; // wir sind nicht auf der Friends-Seite
        }

        console.log("b2: Periodisches Laden der Freundesliste wird gestartet.");

        // Alle 1000 ms (1 Sekunde) neu laden
        window.setInterval(function () {
            loadFriends();
        }, 1000);

        // Einmaliger erster Aufruf, damit die Liste sofort gefüllt wird
        loadFriends();
    });

// =================================================
// Teilaufgabe c – Chat-Nachrichten laden und versenden
// =================================================

    // Ziel von c:
    //  - Auf der chat.html-Seite alle Nachrichten zwischen dem aktuell
    //    eingeloggten Nutzer "Tom" und dem ausgewählten Chatpartner laden.
    //  - Neue Nachrichten per Formular absenden (AJAX, OHNE echten Submit).
    //  - Überschrift "Chat with <Name>" dynamisch anpassen.
    //  - Den Chat-Verlauf jede Sekunde neu laden.
    //
    // WICHTIG:
    //  - Zum Laden nutzen wir die Backend-Funktion "List Messages":
    //        GET  backendUrl + "/message/<user>"
    //  - Zum Senden nutzen wir "Send Message":
    //        POST backendUrl + "/message"
    //        Body: { "message": "<Text>", "to": "<Chatpartner>" }
    //  - Authentifizierung erfolgt wieder über window.tomToken.
    //  - Wir fassen den gesamten Chat-Code in eigene Funktionen und
    //    hängen uns wieder an DOMContentLoaded, aber nur auf chat.html.



    // Liest den Query-Parameter "friend" aus der aktuellen URL aus.
    // Beispiel: chat.html?friend=Jerry  ->  liefert "Jerry" zurück.
    function getChatpartner() {
        const url = new URL(window.location.href);      // gesamte URL holen
        const queryParams = url.searchParams;           // Query-Parameter lesen
        const friendValue = queryParams.get("friend");  // Wert des "friend"-Parameters

        console.log("Teilaufgabe c – Chatpartner aus URL:", friendValue);

        return friendValue; // Chatpartner-Name zurück
    }


    // Baut den Chat-Verlauf (#chatVerlauf) anhand der Serverdaten auf.
    // Erwartetes Format: [{ msg: "...", from: "...", time: 2 }, ...]
    function renderMessages(messageArray) {
        const chatSection = document.getElementById("chatVerlauf");

        // Sicherheitscheck: nur auf chat.html existiert #chatVerlauf
        if (!chatSection) return;

        // Liste komplett leeren, bevor neue Nachrichten eingetragen werden
        chatSection.innerHTML = "";

        // Falls der Server keine Liste liefert: abbrechen
        if (!Array.isArray(messageArray)) {
            console.error("Unerwartetes Nachrichtenformat:", messageArray);
            return;
        }

        // Jede Nachricht einzeln ins DOM schreiben
        messageArray.forEach(function (msgObj) {
            if (!msgObj || typeof msgObj.msg !== "string" || typeof msgObj.from !== "string") {
                return; // Falls etwas kaputt ist, Nachricht überspringen
            }

            // Ein einzelnes <p> für jede Nachricht
            const p = document.createElement("p");

            // Nachricht + Name
            const textSpan = document.createElement("span");
            textSpan.className = "msg";
            textSpan.textContent = msgObj.from + ": " + msgObj.msg;

            // Zeitstempel / Nummer der Nachricht
            const timeSpan = document.createElement("span");
            timeSpan.className = "timeBadge";

            if (typeof msgObj.time === "number") {
                const padded = String(msgObj.time).padStart(2, "0");
                timeSpan.textContent = padded;
            } else {
                timeSpan.textContent = "";
            }

            // Zusammenbauen
            p.appendChild(textSpan);
            p.appendChild(timeSpan);

            // Nachricht in den Chatverlauf einfügen
            chatSection.appendChild(p);
        });

        console.log("Teilaufgabe c – Chat-Verlauf aktualisiert.");
    }



    // Holt vom Server alle Nachrichten zwischen Tom und Chatpartner
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
                        const data = JSON.parse(xhr.responseText); // JSON → JS-Objekt
                        renderMessages(data);                      // ins DOM zeichnen
                    } catch (e) {
                        console.error("Fehler beim Parsen:", e);
                    }
                } else {
                    console.error("Fehler beim Laden der Nachrichten. Status:", xhr.status);
                }
            }
        };

        const url = window.backendUrl + "/message/" + encodeURIComponent(friendName);
        console.log("Teilaufgabe c – Lade Nachrichten von:", url);

        xhr.open("GET", url, true);
        xhr.setRequestHeader("Authorization", "Bearer " + window.tomToken);
        xhr.send();
    }


    // Holt Text aus #message und sendet ihn über POST /message
    function sendMessage() {
        const input = document.getElementById("message");
        if (!input) return;

        const text = input.value.trim(); // Inhalt ohne Leerzeichen
        if (text.length === 0) return;   // leere Nachrichten ignorieren

        const friendName = getChatpartner();
        if (!friendName) {
            alert("Fehler: Kein Chatpartner gefunden.");
            return;
        }

        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 204) {
                    console.log("Nachricht gesendet.");
                    input.value = ""; // Eingabefeld leeren
                    loadMessages();   // sofort neu laden
                } else {
                    console.error("Fehler beim Senden:", xhr.status);
                    alert("Nachricht konnte nicht gesendet werden.");
                }
            }
        };

        const url = window.backendUrl + "/message";
        console.log("Teilaufgabe c – Sende Nachricht:", text);

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", "Bearer " + window.tomToken);

        const body = JSON.stringify({
            message: text,
            to: friendName
        });

        xhr.send(body);
    }




    // Initialisierung NUR auf der chat.html
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
                event.preventDefault(); // Seite NICHT neu laden!
                sendMessage();          // Nachricht über AJAX verschicken
            });
        }
    });


