const manifestsingle = "https://Instel12.github.io/RCUBGT/GameAssets/manifest.json";
const manifestfs = "../GameAssets/manifest.json";

const baseurlsingle = "https://instel12.github.io/RCUBGT/GameAssets/";
const baseurlfs = "../GameAssets/";

let manifestLocation = "";
let finalbaseurl = "";
const container = document.getElementById("Container");
const gameoptions = document.getElementById("GameOptions");
const menuoptions = document.getElementById("MenuOptions");

const PageTitle = document.getElementById("PageTitle");
const PageIcon = document.getElementById("PageIcon");

const clientver = document.getElementById("clientver");
const currentver = "";
let overallver = "no idea 💀";

if (localpref.textContent == "false") {
    manifestLocation = manifestsingle;
    finalbaseurl = baseurlsingle;
    console.log("metadata: multifile");
}
else{
    manifestLocation = manifestfs;
    finalbaseurl = baseurlfs;
    console.log("metadata: singlefile");
}

async function getCommitCount(owner, repo) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`
  );

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  const link = res.headers.get("link");

  if (!link) {
    const data = await res.json();
    return data.length;
  }

  const match = link.match(/page=(\d+)>; rel="last"/);
  overallver = Number(match[1]);
}

getCommitCount("Instel12", "RCUBGT");

async function getver() {
    var responce = await fetch("https://instel12.github.io/RCUBGT/version");
    currentver = await responce.text();
}

if (clientver.innerText !== currentver) {
    alert("This client is outdated! Please redownload it via the Github Page.");
}

particlesJS("particles", {
    particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.4 },
        size: { value: 2, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 0.5 }
    },
    retina_detect: true
});

LoadHomepage();

function LoadHomepage() {
    gameoptions.style.display = "none";
    menuoptions.style.display = "flex";
    const container = document.getElementById("Container");

    container.srcdoc = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 24px;
            color: black;
            font-family: "Space Mono", monospace;
        }

        input{
            border: none;
            width: 100%;
        }

        .game-list {
            display: flex;
            gap: 24px;
            flex-wrap: wrap;
        }

        .game {
            width: 160px;
            background: #ffffff;
            padding: 12px;
            text-align: center;
            cursor: pointer;
        }

        .game img {
            width: 100%;
            height: 120px;
            object-fit: contain;
            margin-bottom: 8px;
        }
        .GameIMG{
            
        }
    </style>
</head>
<body>

<input type="text" placeholder="Search" id="searchbar">
<br><br>
<div class="game-list" id="gameList"></div>

<script>
const searchthing = document.getElementById("searchbar");

async function loadGames() {
    const response = await fetch("` + manifestLocation +`");
    const data = await response.json();

    const baseURL = "` + finalbaseurl +`";
    const list = document.getElementById("gameList");

    list.innerHTML = "";
    data.Games.forEach(game => {
        const gameURL = baseURL + game.SuffixURL;
        const iconURL = baseURL + game.Icon;

        const div = document.createElement("div");
        div.className = "game";

        div.innerHTML = \`
            <img class="GameIMG" src="\${iconURL}">
            <div>\${game.Name}</div>
        \`;

        div.onclick = () => parent.loadGame(gameURL);

        if (game.Name.toLowerCase().includes(searchthing.value.toLowerCase())) {
            list.appendChild(div);
        }
    });
}

loadGames();

searchthing.addEventListener("input", function(event){
    loadGames();
});

</script>

</body>
</html>
`;
}

function OpenSettings() {
    container.srcdoc = `<!DOCTYPE html>
<html lang="en">
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">

<h1>Settings <span style="color:red;">[Beta]</span></h1>
<h3>Spoofing</h3>
<input type="text" placeholder="Page Title" value="RCUBGT" id="urlInput">
<input type="text" placeholder="Favicon URL" value="" id="faviconInput">
<h3>Storage</h3>
<button onclick="parent.dumpStorage()">Backup Storage</button>
<button onclick="parent.loadStorage()">Load Storage</button>
<button onclick="parent.localStorage.clear()">Clear Storage</button>
<h3>Other</h3>
<button onclick="parent.enableAntiClose()">Anti-Close</button>
<h3>Version</h3>
<p style="color: gray; font-size: 12px;">Target Client Version: `+currentver+`</p>
<p style="color: gray; font-size: 12px;">Current Client Version: `+clientver.textContent+`</p>
<p style="color: gray; font-size: 12px;">Current Commit: `+overallver+`</p>
<div style="background-color:#262626;width:100%;height:2px;"></div>
<p style="color: red; font-size: 12px;">Settings is not currently finished, its is really ugly and doesnt save.</p>
<style>
body{
    font-family: "Space Mono", monospace;
    color: white;
}
input{
border-radius: 0px;
border: 2px solid black;
font-family: "Space Mono", monospace;
color: black;
}
</style>
<script>
const input = document.getElementById("urlInput");
input.addEventListener("keydown", (e) => {
    if(e.key === "Enter"){
        parent.PageTitle.innerText = input.value;
    }
});
const faviconInput = document.getElementById("faviconInput");
faviconInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter"){
        parent.PageIcon.href = faviconInput.value;
    }
});
</script>
</html>`
}

async function loadGame(url) {
    gameoptions.style.display = "block";
    menuoptions.style.display = "none";
    const response = await fetch(url);
    const html = await response.text();

    const iframe = document.getElementById("Container");

    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(html);
    iframe.contentWindow.document.close();
}

function fullscreen() {
    container.requestFullscreen();
}
function enableAntiClose() {
    window.addEventListener("beforeunload", function (e) {
    e.preventDefault();
    e.returnValue = "Are you sure you want to leave?";
});
}

function dumpStorage() {
    const data = Object.fromEntries(Object.entries(localStorage));

    const jsonStr = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "RCUBGT Backup.json";

    a.click();

    URL.revokeObjectURL(url);
}

function loadStorage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);

                for (const [key, value] of Object.entries(data)) {
                    localStorage.setItem(key, value);
                }
            } catch (err) {
                alert("Error parsing JSON: " + err);
            }
        };
        reader.readAsText(file);
    };

    input.click();
}