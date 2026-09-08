import fs from 'fs';

const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

console.log("=== SCANNING FOR SCANNER ===");
lines.forEach((line, index) => {
  if (line.includes('scan') || line.includes('Scan') || line.includes('photo') || line.includes('Photo') || line.includes('camera') || line.includes('Camera')) {
    if (line.trim().length > 0 && line.trim().length < 150) {
      console.log(`Line ${index + 1}: ${line.trim()}`);
    }
  }
});
