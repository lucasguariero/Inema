const fs = require('fs');
const path = require('path');

const srcDir = path.resolve('qa/referencias-visuais');
const brainDir = path.resolve('C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4');

const files = [
  'view-00-default.png',
  'view-01-nordic.png',
  'view-02-deep-forest.png',
  'view-03-biophilic-mineral.png',
  'view-04-legacy.png'
];

for (const f of files) {
  const src = path.join(srcDir, f);
  const dest = path.join(brainDir, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${f} to brain.`);
  }
}
