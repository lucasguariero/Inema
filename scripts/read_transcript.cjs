const fs = require('fs');
const readline = require('readline');
const path = 'C:\\Users\\lguar\\.gemini\\antigravity\\brain\\9d40f7ca-ddfd-4ee6-853b-783f644bd6c4\\.system_generated\\logs\\transcript.jsonl';

const stream = fs.createReadStream(path);
const rl = readline.createInterface({ input: stream });

let userMessages = [];
rl.on('line', (line) => {
  try {
    const obj = JSON.parse(line);
    if (obj.type === 'USER_INPUT') {
      userMessages.push(obj.content);
    }
  } catch(e) {}
});

rl.on('close', () => {
  console.log('Total User Inputs:', userMessages.length);
  userMessages.slice(-12).forEach((m, idx) => {
    console.log('--- USER MSG ' + idx + ' ---');
    console.log(m.substring(0, 300));
  });
  process.exit(0);
});
