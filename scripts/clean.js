const fs = require("fs");

let input = fs.readFileSync(0, "utf8");

if (input.includes("<head>") && !input.includes("<base href=")) {
    input = input.replace(
        "<head>",
        `<head>
    <base href="https://instel12.github.io/RCUBGT/Assets/">`
    );
}

input = input.replace(
    /"BaseURL"\s*:\s*"[^"]*"/,
    `"BaseURL": "https://instel12.github.io/RCUBGT/GameAssets/"`
);

process.stdout.write(input);