const baseurlsingle = "https://instel12.github.io/RCUBGT/GameAssets/";

const baseurlfs = "../GameAssets/";

let borders = "border-radius: 0px;";

let manifestLocation = "";
let finalbaseurl = "";
let finalbaseurl4assets = "";
const container = document.getElementById("Container");
const gameoptions = document.getElementById("GameOptions");
const menuoptions = document.getElementById("MenuOptions");

const PageTitle = document.getElementById("PageTitle");
const PageIcon = document.getElementById("PageIcon");

const clientver = document.getElementById("clientver");

let currentver = "";
let overallver = "no idea 💀";

if (document.getElementById("singlefilepref").textContent == "false") {
    console.log("metadata: multifile");
    finalbaseurl = "../GameAssets/";
    finalbaseurl4assets = "";
} else {
    console.log("metadata: singlefile");
    finalbaseurl = "https://instel12.github.io/RCUBGT/GameAssets/";
    finalbaseurl4assets = "https://instel12.github.io/RCUBGT/Assets/";
}

let manifest = "";
async function fetchManifest() {
    try {
        const response = await fetch(finalbaseurl + "manifest.json");
        const data = await response.json();
        return JSON.stringify(data);
    } catch (err) {
        return '{}';
    }
}

(async () => {
    manifest = await fetchManifest();
    LoadHomepage();
})();


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

async function checkVersion() {
    const responce = await fetch("https://raw.githubusercontent.com/Instel12/RCUBGT/refs/heads/main/version");
    currentver = await responce.text();

    if (clientver.innerText !== currentver) {
        alert("This client is outdated! Please redownload it via the Github Page.");
    }
}

checkVersion();

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

function LoadHomepage() {
    if (localpref.textContent == "false") {
        menuopt.innerHTML = `
        <a onclick="window.open('https://discord.gg/5tXfSNbgTa')"><img src="Images/Discord.png"></a>
        <a onclick="window.open('https://github.com/Instel12/RCUBGT/')"><img src="Images/Github.png"></a>
        <a onclick="OpenSettings()"><img src="Images/Settings.png"></a>`;
    }
    else{
        menuopt.innerHTML = `
        <a onclick="window.open('https://discord.gg/5tXfSNbgTa')"><img src="https://instel12.github.io/RCUBGT/Assets/Images/Discord.png"></a>
        <a onclick="window.open('https://github.com/Instel12/RCUBGT/')"><img src="https://instel12.github.io/RCUBGT/Assets/Images/Github.png"></a>
        <a onclick="OpenSettings()"><img src="https://instel12.github.io/RCUBGT/Assets/Images/Settings.png"></a>`;
    }
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
        input {
            border: none;
            width: 100%;
            font-family: "Space Mono", monospace;
`+borders+`
        }
        select {
            border: none;
            width: 100%;
            font-family: "Space Mono", monospace;
`+borders+`
        }
        .game-list {
            display: flex;
            gap: 24px;
            flex-wrap: wrap;
        }
        .game {
            overflow: hidden;
            width: 160px;
            background: #ffffff;
            padding: 12px;
            text-align: center;
            cursor: pointer;
`+borders+`
            transition: transform 0.15s ease;
        }
        .game:hover {
            transform: scale(1.06);
        }
        .game img {
            width: 100%;
            height: 120px;
            object-fit: contain;
            margin-bottom: 8px;
`+borders+`
        }
        .GameIMG {
`+borders+`
        }
    </style>
</head>
<body>

<input style="width: 89%;" type="text" placeholder="Search" id="searchbar">
<select style="width: 9%" id="tagFilter">
    <option value="All">All</option>
</select>
<br><br>
<div class="game-list" id="gameList"></div>

<script>
const searchthing = document.getElementById("searchbar");
const tagFilter = document.getElementById("tagFilter");

const manifest = '` + manifest.replace(/'/g, "\\'") + `';

async function loadGames() {
    const data = JSON.parse(manifest);
    const baseURL = "` + finalbaseurl + `";
    const list = document.getElementById("gameList");
    list.innerHTML = "";

    const searchValue = normalize(searchthing.value);
    const selectedTag = tagFilter.value;

    for (var i = 0; i < data.Games.length; i++) {
        var game = data.Games[i];
        var gameURL = baseURL + game.SuffixURL;
        var iconURL = baseURL + game.Icon;

        // Filter games by search value and selected tag
        if (normalize(game.Name).indexOf(searchValue) === -1) continue;
        if (selectedTag !== "All" && !game.Tags.includes(selectedTag)) continue;

        var div = document.createElement("div");
        div.className = "game";

        div.innerHTML =
            '<img class="GameIMG" src="' + iconURL + '">' +
            '<div>' + game.Name + '</div>';

        div.onclick = (function(url, element){
            return async function(){
                parent.loadGame(url);
            };
        })(gameURL, div);

        list.appendChild(div);
    }
}

function normalize(str) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function populateTags() {
    const data = JSON.parse(manifest);
    const tagsSet = new Set();

    data.Games.forEach(game => {
        game.Tags.forEach(tag => {
            tagsSet.add(tag);
        });
    });

    tagsSet.forEach(tag => {
        const option = document.createElement("option");
        option.value = tag;
        option.textContent = tag;
        tagFilter.appendChild(option);
    });
}

loadGames();
populateTags();
searchthing.addEventListener("input", loadGames);
tagFilter.addEventListener("change", loadGames);
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
<p>
<button onclick="setCloke('Home', 'https://ssl.gstatic.com/classroom/favicon.png');"><img style="height:20px;" src="https://ssl.gstatic.com/classroom/favicon.png"></button>
<button onclick="setCloke('Clever', 'https://www.clever.com/wp-content/uploads/2023/06/cropped-Favicon-512px-32x32.png');"><img style="height:20px;" src="https://www.clever.com/wp-content/uploads/2023/06/cropped-Favicon-512px-32x32.png"></button>
<button onclick="setCloke('IXL | Math, Language Arts, Science, Social Studies, and Spanish', 'https://www.ixl.com/ixl-favicon.png');"><img style="height:20px;" src="https://www.ixl.com/ixl-favicon.png"></button>
<button onclick="setCloke('VEXcode V5', 'https://codev5.vex.com/static/img/icons/vexfavicon.ico');"><img style="height:20px;" src="https://codev5.vex.com/static/img/icons/vexfavicon.ico"></button>
<h3>Storage</h3>
<button onclick="parent.dumpStorage()">Backup Storage</button>
<button onclick="parent.loadStorage()">Load Storage</button>
<button onclick="parent.localStorage.clear()">Clear Storage</button>
<h3>Other</h3>
<button onclick="parent.enableAntiClose()">Anti-Close</button>
<h3>Theme</h3>
<select id="theme">
    <option value="Space">Space</option>
    <option value="Desert">Desert</option>
    <option value="Polys">Polys</option>
    <option value="Liquid">Liquid</option>
</select>
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
`+borders+`
border: none;
font-family: "Space Mono", monospace;
color: black;
}
button{
border:none;
}
select{
border: none;
}
</style>
<script>
document.getElementById("theme").onchange = function () {
  parent.settheme(this.value);
};

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
function setCloke(title, icon) {
    input.value = title;
    faviconInput.value = icon;
            parent.PageIcon.href = faviconInput.value;
        parent.PageTitle.innerText = input.value;

}
</script>
</html>`
}

function settheme(name) {
    console.log("set theme to " + name + " jsyk")
    if (name == "Space") {
        document.body.style.backgroundImage = "";
        document.body.style.backgroundColor = "black";
        borders = "border-radius: 0px;";
        document.getElementById("particles").style.display = "block";
    }
    if (name == "Polys") {
        document.body.style.backgroundImage = "url('" + finalbaseurl4assets+ "Images/Backgrounds/polys.png')";
        borders = "border-radius: 0px;";
        document.getElementById("particles").style.display = "block";
    }
    if (name == "Liquid") {
        document.body.style.backgroundImage = "url('" + finalbaseurl4assets+ "Images/Backgrounds/liquid.avif')";
        borders = "border-radius: 9px;";
        document.getElementById("particles").style.display = "none";
    }
    if (name == "Desert") {
        document.body.style.backgroundImage = "url('" + finalbaseurl4assets+ "Images/Backgrounds/desert.jpg')";
        borders = "border-radius: 9px;";
        document.getElementById("particles").style.display = "block";
    }

    document.getElementsByClassName("Banner")[0].style = borders;
}

async function loadGame(url) {
    if (localpref.textContent == "false") {
        menuopt.innerHTML = `
        <a onclick="injectCode()"><img src="Images/Console.png"></a>
        <a onclick="fullscreen()"><img src="Images/Fullscreen.png"></a>`;
    }
    else{
        menuopt.innerHTML = `
        <a onclick="injectCode()"><img src="https://instel12.github.io/RCUBGT/Assets/Images/Console.png"></a>
        <a onclick="fullscreen()"><img src="https://instel12.github.io/RCUBGT/Assets/Images/Fullscreen.png"></a>`;
    
    }
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

function injectCode() {
    container.appendChild(document.createElement("script")).innerText = prompt("What code could you like to inject to the game? (Be careful! I am not affiliated with anything you enter):");
}