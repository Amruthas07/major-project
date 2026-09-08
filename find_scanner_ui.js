import fs from 'fs';

const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

console.log("=== SCANNING FOR SCANNER / PHOTO / CAMERA ===");
lines.forEach((line, index) => {
  if (line.toLowerCase().includes('photo') || line.toLowerCase().includes('scanner') || line.toLowerCase().includes('camera') || line.toLowerCase().includes('plate')) {
    if (line.trim().length > 0 && line.trim().length < 150) {
      console.log(`Line ${index + 1}: ${line.trim()}`);
    }
  }
});
