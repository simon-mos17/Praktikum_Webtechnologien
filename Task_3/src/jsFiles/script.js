
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


    // =============================================================
    // checkRegister()
    // Wird über onsubmit="return checkRegister();" im <form>-Tag
    // aufgerufen.
    // Ablauf:
    // 1) Lokale Prüfungen (Länge, Wiederholung)
    // 2) Wenn lokal Fehler -> false (Formular wird NICHT gesendet)
    // 3) Wenn lokal alles OK -> AJAX "User Exists":
    //       GET  <backendUrl>/user/<username>
    //       204 -> Benutzer existiert -> Fehler
    //       404 -> Benutzer existiert nicht -> OK -> form.submit()
    // =============================================================
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





