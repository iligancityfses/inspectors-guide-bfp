// Simple script to check Next.js build status
const fs = require('fs');
const path = require('path');

console.log('Checking Next.js build status...');

// Check if .next directory exists
const nextDir = path.join(__dirname, '.next');
if (!fs.existsSync(nextDir)) {
  console.error('Error: .next directory not found. Build may have failed.');
  process.exit(1);
}

// Check for critical build files
const buildManifest = path.join(nextDir, 'build-manifest.json');
if (!fs.existsSync(buildManifest)) {
  console.error('Error: build-manifest.json not found. Build may be incomplete.');
  process.exit(1);
}

console.log('Build appears to be valid.');
console.log('Note: If you\'re experiencing 404 errors on Vercel, the build may be successful but routing issues may exist.');
console.log('The configuration changes should help resolve these issues.');
