const manifestLocation = "../GameAssets/manifest.json"; // if ur developing, make it "../GameAssets/manifest.json"
const container = document.getElementById("Container");
const gameoptions = document.getElementById("GameOptions");
const menuoptions = document.getElementById("MenuOptions");

const PageTitle = document.getElementById("PageTitle");
const PageIcon = document.getElementById("PageIcon");

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

<div class="game-list" id="gameList"></div>

<script>
async function loadGames() {
    const response = await fetch("` + manifestLocation +`");
    const data = await response.json();

    const baseURL = data.BaseURL;
    const list = document.getElementById("gameList");

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

        list.appendChild(div);
    });
}

loadGames();
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
<h3>Other</h3>
<button onclick="parent.enableAntiClose()">Anti-Close</button>
<p style="color: gray; font-size: 10px;">This is really ugly right now, I will improve it later. It also doesn't save yet.</p>
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
