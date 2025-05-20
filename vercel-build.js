// This script helps Vercel find your app directory
const fs = require('fs');
const path = require('path');

console.log('Running Vercel build script...');

// Check if we're in a Vercel environment
const isVercel = process.env.VERCEL === '1';

if (isVercel) {
  console.log('Detected Vercel environment, creating app directory symlink...');
  
  // Create a symlink from /app to /src/app if it doesn't exist
  const appDir = path.join(process.cwd(), 'app');
  const srcAppDir = path.join(process.cwd(), 'src', 'app');
  
  if (!fs.existsSync(appDir) && fs.existsSync(srcAppDir)) {
    try {
      // On Unix systems, this would be:
      // fs.symlinkSync(srcAppDir, appDir, 'dir');
      
      // But on Vercel (Linux), we'll use a different approach:
      // Create a minimal app directory with the necessary files
      fs.mkdirSync(appDir, { recursive: true });
      
      // Copy the essential files from src/app to app
      const files = fs.readdirSync(srcAppDir);
      files.forEach(file => {
        const srcPath = path.join(srcAppDir, file);
        const destPath = path.join(appDir, file);
        
        if (fs.statSync(srcPath).isFile()) {
          fs.copyFileSync(srcPath, destPath);
        }
      });
      
      console.log('Successfully created app directory with essential files');
    } catch (error) {
      console.error('Error creating app directory:', error);
    }
  } else {
    console.log('App directory already exists or src/app does not exist');
  }
}

// Continue with the normal build process
console.log('Proceeding with Next.js build...');
