const fs = require("fs");
const chatPath = "D:/Zmiiras/src/routes/api/chat.ts";
const promptPath = "D:/Zmiiras/new_prompt.txt";
let chatContent = fs.readFileSync(chatPath, "utf8");
let newPrompt = fs.readFileSync(promptPath, "utf8");
if (newPrompt.startsWith("\ufeff")) { newPrompt = newPrompt.slice(1); }
// Use a more robust regex to find the variable definition
chatContent = chatContent.replace(/const SYSTEM_PROMPT = `[\s\S]*?`;/, "const SYSTEM_PROMPT = `" + newPrompt.replace(/`/g, "\\`").replace(/\$/g, "\\$") + "`;");
fs.writeFileSync(chatPath, chatContent, "utf8");
console.log("Successfully updated SYSTEM_PROMPT");
