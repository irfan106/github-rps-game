const fs = require("fs");

const commitMsg = process.env.COMMIT_MSG;
const user = process.env.GITHUB_ACTOR;

const match = commitMsg.match(/rps (rock|paper|scissors)/i);
if (!match) {
  console.log("No valid move found.");
  process.exit(0);
}

const userMove = match[1].toLowerCase();
const moves = ["rock", "paper", "scissors"];
const botMove = moves[Math.floor(Math.random() * 3)];

let result = "";
if (userMove === botMove) result = "draw";
else if (
  (userMove === "rock" && botMove === "scissors") ||
  (userMove === "scissors" && botMove === "paper") ||
  (userMove === "paper" && botMove === "rock")
)
  result = "win";
else result = "lose";

// Read or init score
let scores = {};
try {
  scores = JSON.parse(fs.readFileSync("scores.json", "utf-8"));
} catch (e) {
  scores = {};
}
if (!scores[user]) scores[user] = { win: 0, lose: 0, draw: 0 };

scores[user][result]++;

fs.writeFileSync("scores.json", JSON.stringify(scores, null, 2));

// Update README
let board = `## 🎮 Rock, Paper, Scissors Leaderboard

| Player | Wins | Losses | Draws |
|--------|------|--------|-------|
`;

for (const player in scores) {
  const s = scores[player];
  board += `| ${player} | ${s.win} | ${s.lose} | ${s.draw} |\n`;
}

const readme = fs.readFileSync("README.md", "utf-8");
const newReadme = readme.replace(
  /<!-- RPS START -->([\s\S]*?)<!-- RPS END -->/,
  `<!-- RPS START -->\n\n${board}\n\n<!-- RPS END -->`
);
fs.writeFileSync("README.md", newReadme);

console.log(`You played: ${userMove}`);
console.log(`Bot played: ${botMove}`);
console.log(`Result: ${result}`);
