const fs = require("node:fs");

let html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("styles.css", "utf8");
let js = fs.readFileSync("app.js", "utf8");

js = js.replace(
  /if \("serviceWorker" in navigator\) \{[\s\S]*?\n\}\n\nsetupStudyStrip\(\);/,
  "setupStudyStrip();",
);

html = html.replace(/\s*<link rel="manifest" href="manifest\.webmanifest" \/>/, "");
html = html.replace(
  /\s*<link rel="stylesheet" href="styles\.css" \/>/,
  `\n    <style>\n${css}\n    </style>`,
);
html = html.replace(
  /\s*<script src="app\.js" defer><\/script>/,
  `\n    <script>\n${js}\n    </script>`,
);

fs.writeFileSync("katakana-dash-standalone.html", html, "utf8");
console.log("Wrote katakana-dash-standalone.html");
