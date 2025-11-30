✅ Warum wir python -m http.server 8000 brauchen

(und warum es für dein Testat absolut notwendig ist)

Stell dir vor:

Deine HTML-Dateien liegen einfach so auf deinem PC.

Wenn du sie per Doppelklick öffnest, lädt der Browser sie über file://.

Das sieht so aus:

file:///C:/Users/.../register.html

➡️ Das ist kein Webserver, sondern nur eine Datei aus dem Ordner.
❌ Problem: Viele Web-Technologien funktionieren NICHT über file://

🟢 Die Lösung: Einen Mini-Webserver starten

Der Befehl:

python -m http.server 8000

oder, wie du es gemacht hast:

py -m http.server 8000

macht folgendes:

✔️ 1. Startet einen komplett funktionierenden, kleinen HTTP-Webserver

(in deinem Ordner!)

✔️ 2. Macht deine Dateien unter einer echten URL erreichbar

Zum Beispiel:

http://localhost:8000/register.html

✔️ 3. Browser denkt jetzt: „Ah, das ist eine richtige Webseite“

→ und verhält sich so wie im echten Internet.

✔️ 4. Jetzt funktionieren:

AJAX Requests

Backend-Zugriffe

Events

Scripts

alles, was im Testat gefordert wird

🧑‍🏫 Stell dir vor dein Lehrer fragt:

„Warum starten Sie einen Server? Warum nicht einfach Doppelklick auf die Datei?“

Dann sagst du:

„Weil AJAX-Requests und die Kommunikation mit dem Backend nicht über file:// funktionieren.
Der Python-Webserver stellt die Dateien korrekt unter http://localhost:8000 bereit,
und nur so verhält sich die Seite wie im echten Web.“

➡️ 100% richtige Antwort.
