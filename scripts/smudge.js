const fs = require("fs");

let input = fs.readFileSync(0, "utf8");

input = input.replace(
    /\s*<base href="https:\/\/instel12\.github\.io\/RCUBGT\/Assets\/">\s*/g,
    "\n"
);

input = input.replace(
    /"BaseURL"\s*:\s*"https:\/\/instel12\.github\.io\/RCUBGT\/GameAssets\/"/,
    `"BaseURL": "../GameAssets/"`
);

process.stdout.write(input);