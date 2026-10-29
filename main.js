/* =========================================================
   main.js – kleine Interaktionen (mit KI erstellt)
   Die Seite funktioniert auch ohne JavaScript. Das Skript
   ergänzt nur drei Dinge:
   1. Mobiles Menü auf- und zuklappen
   2. "Jetzt offen / Gerade zu" bei den Öffnungszeiten
   3. Google-Karte erst nach Klick laden (Datenschutz)
   ========================================================= */


/* ---------- 1. Mobiles Menü ----------
   Auf kleinen Bildschirmen ist die Navigation versteckt.
   Ein Klick auf den Menü-Button hängt die Klasse "open" an
   die Liste an – im CSS steht: .nav ul.open { display: flex }  */
const menuButton = document.querySelector(".menu-btn");
const menu = document.getElementById("menu");

menuButton.addEventListener("click", function () {
  const istOffen = menu.classList.toggle("open");          // Klasse an/aus
  menuButton.setAttribute("aria-expanded", istOffen);      // für Screenreader
});


/* ---------- 2. Geöffnet oder geschlossen? ----------
   Wir holen Wochentag und Uhrzeit in Hamburger Zeit und
   vergleichen sie mit den Öffnungszeiten:
   Mo–Fr 10–18 Uhr, Sa 10–16 Uhr, So geschlossen.          */
const jetzt = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Berlin" }));
const tag = jetzt.getDay();                                 // 0 = Sonntag, 1 = Montag … 6 = Samstag
const minuten = jetzt.getHours() * 60 + jetzt.getMinutes(); // Minuten seit Mitternacht

let schluss = 0;                                            // Ladenschluss in Minuten
if (tag >= 1 && tag <= 5) schluss = 18 * 60;                // Montag bis Freitag
if (tag === 6) schluss = 16 * 60;                           // Samstag

const offen = schluss > 0 && minuten >= 10 * 60 && minuten < schluss;

// heutigen Tag in jeder Öffnungszeiten-Tabelle hervorheben
document.querySelectorAll('.hours tr[data-d="' + tag + '"]').forEach(function (zeile) {
  zeile.classList.add("today");
});

// Text und Farbe der Status-Anzeige setzen
document.querySelectorAll(".status").forEach(function (status) {
  status.classList.add(offen ? "open" : "closed");
  status.querySelector("span").textContent = offen
    ? "Jetzt offen – bis " + schluss / 60 + " Uhr"
    : "Gerade zu – bis bald!";
});


/* ---------- 3. Karte erst nach Klick laden ----------
   Google Maps überträgt Daten an Google. Deshalb wird die
   Karte (ein <iframe>) erst eingefügt, wenn man klickt.   */
const kartenButton = document.getElementById("load-map");

if (kartenButton) {                                         // gibt es nur auf laden.html
  kartenButton.addEventListener("click", function () {
    document.getElementById("map-box").innerHTML =
      '<iframe title="Karte: Wandsbeker Allee 68, 22041 Hamburg" ' +
      'src="https://maps.google.com/maps?q=Wandsbeker%20Allee%2068%2C%2022041%20Hamburg&z=16&output=embed"></iframe>';
  });
}
