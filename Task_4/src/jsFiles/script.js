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




// Globale Variable, um sich zu merken, welche Freunde aktuell in der Liste stehen.
// Diese wird später sowohl in Teil b1 (Freunde hinzufügen) als auch in Teil b2
// (Freunde aus dem Backend laden) benutzt.
let currentFriends = [];  // Array mit Strings, z.B. ["Jerry", "Spike", ...]



// Globale Variable, in der alle Nutzer-Namen vom Backend (List Users) gespeichert werden.
// Wird in b1 für die Vorschlagsliste verwendet.
let allUsers = []; // z.B. ["Tom", "Jerry", "Spike", "Tyke", ...]





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
    // 2) Wenn lokal Fehler -> false (Formular wird NICHT abgesendet)
    // 3) Wenn lokal OK -> AJAX-Request "User Exists"
    // 4) Wenn Username existiert (204) -> Fehlermeldung (Username rot markieren)
    // 5) Wenn Username NICHT existiert (404) -> jetzt REGISTRIEREN und danach LOGIN
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
            allValid = false;
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


        // ================================================
        // 3) Passwort-Wiederholung muss exakt übereinstimmen
        // ================================================
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


        // ==================================================
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
            4 = fertig

            HTTP-Statuscodes (hier wichtig):
            200 = OK       (Antwort mit Inhalt)
            204 = NoContent (Antwort ohne Inhalt, aber erfolgreich)
            400 = Bad Request
            404 = Not Found
        */

        const xhr = new XMLHttpRequest(); // Neues XMLHttpRequest-Objekt erzeugen

        xhr.onreadystatechange = function () {
            // WICHTIG: Wir interessieren uns für den Moment, wenn die Antwort
            // vollständig eingetroffen ist:
            if (xhr.readyState === 4) {
                console.log("Antwort vom User-Exists-Check erhalten. Status:", xhr.status);

                // Benutzer existiert bereits -> Fehler
                if (xhr.status === 204) {
                    markInvalid(usernameInput);
                    alert("Username ist bereits vergeben. Bitte anderen Namen wählen.");

                    console.log("Server: Username existiert bereits (204).");
                }

                // Benutzer existiert NICHT -> Username ist frei
                // (404 = Not Found -> User nicht gefunden -> OK)
                else if (xhr.status === 404) {
                    markValid(usernameInput);   // zur Sicherheit grün setzen
                    console.log("Server: Username ist frei (404). Starte Registrierung über /register.");

                    // Jetzt tatsächliche Registrierung beim Backend durchführen
                    const registerXhr = new XMLHttpRequest();

                    registerXhr.onreadystatechange = function () {
                        if (registerXhr.readyState === 4) {
                            if (registerXhr.status === 201 || registerXhr.status === 204) {
                                console.log("Registrierung erfolgreich. Melde Benutzer nun an.");

                                // Nach erfolgreicher Registrierung direkt einloggen
                                handleLogin(form);
                            } else {
                                console.error("Fehler bei der Registrierung. Status:", registerXhr.status, registerXhr.responseText);
                                alert("Fehler bei der Registrierung (Status " + registerXhr.status + "). Bitte später erneut versuchen.");
                                markInvalid(usernameInput);
                            }
                        }
                    };

                    const registerUrl = window.backendUrl + "/register";
                    console.log("Sende Register-Request an:", registerUrl);

                    registerXhr.open("POST", registerUrl, true);
                    registerXhr.setRequestHeader("Content-type", "application/json");
                    registerXhr.send(JSON.stringify({
                        username: username,
                        password: password
                    }));
                }

                // Andere Statuscodes -> allgemeiner Fehler (z.B. Serverproblem)
                else {
                    markInvalid(usernameInput);
                    alert("Fehler beim Prüfen des Benutzernamens... (Status " + xhr.status + "). Bitte später nochmal versuchen.");
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
        // (also nach der Server-Antwort) weiterverarbeiten.
        return false;
    }

// =================================================
// Login – echten User einloggen und Token holen
// =================================================

// Führt den AJAX-Login aus und wechselt bei Erfolg auf friends.html
function handleLogin(formElement) {
    const usernameInput = formElement.querySelector("#username");
    const passwordInput = formElement.querySelector("#password");

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (username.length === 0 || password.length === 0) {
        alert("Bitte Username und Passwort eingeben.");
        return;
    }

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // Erwartet: JSON mit einem Token-Feld, z.B. { "token": "abc..." }
                try {
                    const data = JSON.parse(xhr.responseText);
                    if (data && data.token) {
                        // User + Token global & im Storage speichern
                        setCurrentUser(username, data.token);
                        console.log("Login erfolgreich als:", username);

                        // Weiter zur Friends-Seite
                        window.location.href = "./friends.html";
                    } else {
                        alert("Login-Antwort enthält kein Token.");
                        console.error("Login-Antwort ohne Token:", data);
                    }
                } catch (e) {
                    console.error("Fehler beim Parsen der Login-Antwort:", e);
                    alert("Fehler beim Verarbeiten der Login-Antwort.");
                }
            } else {
                console.error("Login fehlgeschlagen. Status:", xhr.status, xhr.responseText);
                alert("Login fehlgeschlagen (Status " + xhr.status + "). Bitte Daten prüfen.");
            }
        }
    };

    const url = window.backendUrl + "/login";
    console.log("Sende Login-Request an:", url, "für User:", username);

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");

    const body = JSON.stringify({
        username: username,
        password: password
    });

    xhr.send(body);
}

// DOM-Initialisierung speziell für die Login-Seite
document.addEventListener("DOMContentLoaded", function () {
    // wir erkennen die Login-Seite eindeutig am Formular mit der ID "loginform"
    const loginForm = document.getElementById("loginform");

    if (!loginForm) {
        return; // wir sind NICHT auf login.html
    }

    console.log("Login-Seite erkannt. Login-Handler wird registriert.");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();          // normales Absenden verhindern
        handleLogin(loginForm);          // stattdessen AJAX-Login
    });
});




// =================================================
// User/Token-Verwaltung via localStorage
// =================================================

// Setzt aktuellen Benutzer + Token und speichert sie im localStorage
function setCurrentUser(username, token) {
    window.currentUserName = username;
    window.currentToken = token;

    try {
        localStorage.setItem("chat_username", username);
        localStorage.setItem("chat_token", token);
    } catch (e) {
        console.warn("Konnte Userdaten nicht im localStorage speichern:", e);
    }
}

// Liest aktuellen Benutzer + Token aus localStorage oder markiert als "nicht eingeloggt"
function loadCurrentUserFromStorage() {
    let username = null;
    let token = null;

    try {
        username = localStorage.getItem("chat_username");
        token = localStorage.getItem("chat_token");
    } catch (e) {
        console.warn("Konnte localStorage nicht lesen:", e);
    }

    if (username && token) {
        // Es existieren bereits gespeicherte Login-Daten
        window.currentUserName = username;
        window.currentToken = token;
        console.log("Aktueller User aus Storage:", username);
    } else {
        // Kein gespeicherter Login -> Nutzer ist nicht eingeloggt
        window.currentUserName = null;
        window.currentToken = null;
        console.log("Kein User im Storage – bitte zuerst einloggen.");
    }

}

// Beim Laden von script.js einmal initial aufrufen
loadCurrentUserFromStorage();

// Hilfsfunktion, falls wir nur den Namen brauchen
function getCurrentUserName() {
    return window.currentUserName || "Tom";
}



// =================================================
// Teilaufgabe b1 – Hinzufügen neuer Freunde
// =================================================
    //
    // Ziel:
    // - Vom Backend alle Nutzer holen (List Users).
    // - Vorschläge in einer datalist anzeigen.
    // - Beim Tippen wird gefiltert.
    // - Klick auf "Add" sendet eine Freundschaftsanfrage (POST /friend).
    // - Es dürfen NICHT auswählbar sein:
    //      * der aktuell eingeloggte Nutzer
    //      * bereits bestehende Freunde aus der Liste
    //
    // Wir gehen davon aus:
    // - Du bist eingeloggt (Token in window.currentToken).
    // - Die Friends-Seite enthält:
    //      * UL mit id="friendsList"
    //      * OL mit Requests
    //      * Formular mit class="friendAddForm"
    //      * Input mit id="friend-request-name"
    //      * datalist mit id="friend-selector"

    // Liest die Friends-Liste aus dem DOM (friends.html) in das Array currentFriends ein.
    // Dadurch wissen wir, wen wir NICHT mehr als Vorschlag anbieten dürfen.
    function readFriendsFromDom() {
        const listElement = document.getElementById("friendsList");

        // Falls es diese UL nicht gibt (z.B. auf einer anderen Seite) -> abbrechen
        if (!listElement) {
            console.warn("Friends-UL #friendsList nicht gefunden – vermutlich nicht auf friends.html?");
            currentFriends = [];
            return;
        }

        // Alle <li>-Elemente in der UL holen
        const liElements = listElement.querySelectorAll("li");

        // currentFriends leeren
        currentFriends = [];

        liElements.forEach(li => {
            const link = li.querySelector("a");
            if (link) {
                const name = link.textContent.trim();
                if (name.length > 0) {
                    currentFriends.push(name);
                }
            }
        });

        console.log("Aktuelle Freunde aus dem DOM:", currentFriends);
    }



    // Lädt alle Nutzer (List Users) vom Backend und speichert sie in allUsers.
    // Achtung: Der aktuell eingeloggte Nutzer ist auch dabei und muss später
    //          aus den Vorschlägen herausgefiltert werden.
    function loadAllUsers() {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        if (Array.isArray(data)) {
                            // Wir erwarten ein Array von Strings, z.B. ["Tom", "Jerry", ...]
                            allUsers = data.slice(); // Kopie des Arrays
                            console.log("Nutzerliste vom Backend:", allUsers);

                            // Nach dem Laden einmal die Vorschläge aktualisieren
                            updateFriendOptions("");
                        } else {
                            console.error("Unerwartetes Format der Nutzerliste:", data);
                        }
                    } catch (e) {
                        console.error("Fehler beim Parsen der Nutzerliste:", e);
                    }
                } else {
                    console.error("Fehler beim Laden der Nutzerliste. Status:", xhr.status);
                }
            }
        };

        const url = window.backendUrl + "/user"; // Baut die URL, z. B. https://online-lectures-cs.thi.de/chat/DEINE_ID/user.
        console.log("Lade Nutzerliste von:", url);

        xhr.open("GET", url, true);
        // Token für aktuellen User (Authentifizierung)
        xhr.setRequestHeader("Authorization", "Bearer " + window.currentToken);
        xhr.send(); // Schickt die Anfrage los
    }



    // Füllt die datalist #friend-selector mit <option>-Elementen.
    // - Nimmt allUsers als Basis.
    // - Filtert:
    //      * den aktuellen User selbst
    //      * alle, die schon in der Freundesliste stehen
    //      * optional nach dem aktuellen Eingabetext (Substring)
    function updateFriendOptions(filterText) {
        const datalist = document.getElementById("friend-selector");

        if (!datalist) {
            console.warn("datalist #friend-selector nicht gefunden.");
            return;
        }

        // Bestehende Optionen entfernen
        datalist.innerHTML = "";

        const currentUserName = getCurrentUserName();
        const filter = filterText.trim().toLowerCase(); // Der aktuelle Eingabetext aus dem Input wird kleingeschrieben, Leerzeichen entfernt.

        // Nutzer filtern: nicht currentUser, nicht bereits Freund
        let candidates = allUsers.filter(name => // Start mit allen Nutzern, dann
            name !== currentUserName && !currentFriends.includes(name) // alle, die schon in der Freundesliste stehen, werden entfernt.
        );

        // Wenn etwas im Input steht -> zusätzlich nach Text filtern
        if (filter.length > 0) { // Wenn der Nutzer etwas getippt hat (filter.length > 0): nochmal zusätzlich nach Text filtern
            candidates = candidates.filter(name => 
                name.toLowerCase().includes(filter)); // Für jeden Namen prüfen: kommt der Filtertext drin vor?
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
    //  - Name ist nicht der aktuelle User
    //  - Name ist noch nicht in currentFriends
    //  - Wenn alles ok -> Freundschaftsanfrage (POST /friend)
    function handleAddFriend() {
        const input = document.getElementById("friend-request-name"); // Input holen
        if (!input) {
            return;
        }

        const name = input.value.trim(); // eingegebener Text, zugeschnitten

        // Grund-Checks (lokal)
        let valid = true;

            // 1) Darf nicht leer sein
            if (name.length === 0) {
                valid = false;
            }

            // 2) Darf nicht der aktuell eingeloggte Nutzer sein
            const currentUserName = getCurrentUserName();
            if (name === currentUserName) {
                valid = false;
            }

            // 3) Darf nicht bereits in der Freundesliste sein
            if (currentFriends.includes(name)) {
                valid = false;
            }

            // 4) Muss in allUsers vorkommen (Server kennt den Namen)
            if (!allUsers.includes(name)) {
                valid = false;
            }

        if (!valid) {
            alert("Ungültiger Freundesname. Bitte einen gültigen Nutzer wählen, " +
                  "der noch nicht dein Freund ist und nicht du selbst bist.");
            markInvalid(input);
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
        //      Authorization: Bearer <Token>
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
            201 = Created (Ressource angelegt)
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
        xhr.setRequestHeader("Authorization", "Bearer " + window.currentToken);

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
        currentFriends = acceptedFriends.map(function (f) { return f.username; });

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
        // wieder mit Token des aktuellen Users
        xhr.setRequestHeader("Authorization", "Bearer " + window.currentToken);
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
    //    eingeloggten Nutzer und dem ausgewählten Chatpartner laden.
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
    //  - Authentifizierung erfolgt wieder über window.currentToken.
    //  - Wir fassen den gesamten Chat-Code in eigene Funktionen und
    //    hängen uns wieder an DOMContentLoaded, aber nur auf chat.html.



    // Liest den Query-Parameter "friend" aus der aktuellen URL aus.
    // Beispiel: chat.html?friend=Jerry  ->  liefert "Jerry" zurück.
    function getChatpartner() {
        const url = new URL(window.location.href);      // gesamte URL holen
        const queryParams = url.searchParams;           // Query-Parameter lesen
        const friendValue = queryParams.get("friend");  // Wert des "friend"-Parameters

        console.log("Teilaufgabe c – Chatpartner aus URL:", friendValue);

        return friendValue; // Chatpartner-Name zurückgeben (oder null)
    }



    // Zeichnet eine Liste von Nachrichten in den DOM-Bereich #chatVerlauf.
    // messageArray: Array von Objekten mit { from, to, msg, time, ... }
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

            // Textspan mit "Absender: Nachricht"
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

            // p ins DOM
            chatSection.appendChild(p);
        });
    }



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
        xhr.setRequestHeader("Authorization", "Bearer " + window.currentToken);
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
        xhr.setRequestHeader("Authorization", "Bearer " + window.currentToken);

        const body = JSON.stringify({
            to: friendName,
            message: text
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
                event.preventDefault();
                sendMessage();
            });
        }
    });



// Helfer zum Logout: Userdaten löschen
function clearCurrentUser() {
    try {
        localStorage.removeItem("chat_username");
        localStorage.removeItem("chat_token");
    } catch (e) {
        console.warn("Konnte localStorage nicht leeren:", e);
    }

    window.currentUserName = null;
    window.currentToken = null;
}

// Logout-Seite erkennen und Userdaten löschen
document.addEventListener("DOMContentLoaded", function () {
    // Prüfen, ob wir auf logout.html sind
    if (window.location.pathname.includes("logout.html")) {
        console.log("Logout-Seite erkannt. Lösche aktuellen User.");
        clearCurrentUser();
    }
});
