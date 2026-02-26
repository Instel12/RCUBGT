const manifestLocation = "../GameAssets/manifest.json"; // if ur developing, make it "../GameAssets/manifest.json"
const container = document.getElementById("Container");

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

async function loadGame(url) {
    container.srcdoc = "Downloading content...";
    try {
        const response = await fetch(url);
        const text = await response.text();
        container.srcdoc = text;
    } catch (error) {
        container.srcdoc = `An error occurred while loading the game: ${error.message}`;
    }
}