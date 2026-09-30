const fs = require('fs');
const svg = fs.readFileSync('public/logo.svg', 'utf8');
const match = svg.match(/base64,([^"']+)/);
if (match) {
  const buf = Buffer.from(match[1], 'base64');
  fs.writeFileSync('C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4/decoded-logo.png', buf);
  console.log('Saved decoded-logo.png, size:', buf.length);
}
