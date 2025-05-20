// This script helps Vercel find your app directory and ensures special pages are properly handled
const fs = require('fs');
const path = require('path');

console.log('Running Vercel build script...');

// Check if we're in a Vercel environment
const isVercel = process.env.VERCEL === '1';

if (isVercel) {
  console.log('Detected Vercel environment, preparing app directory...');
  
  // Create a symlink from /app to /src/app if it doesn't exist
  const appDir = path.join(process.cwd(), 'app');
  const srcAppDir = path.join(process.cwd(), 'src', 'app');
  
  if (!fs.existsSync(appDir) && fs.existsSync(srcAppDir)) {
    try {
      // Create a minimal app directory with the necessary files
      fs.mkdirSync(appDir, { recursive: true });
      
      // Function to recursively copy directories
      const copyDir = (src, dest) => {
        // Create destination directory if it doesn't exist
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }
        
        // Read source directory
        const entries = fs.readdirSync(src, { withFileTypes: true });
        
        // Process each entry
        for (const entry of entries) {
          const srcPath = path.join(src, entry.name);
          const destPath = path.join(dest, entry.name);
          
          if (entry.isDirectory()) {
            // Recursively copy subdirectories
            copyDir(srcPath, destPath);
          } else {
            // Copy files
            fs.copyFileSync(srcPath, destPath);
          }
        }
      };
      
      // Copy the entire src/app directory structure
      copyDir(srcAppDir, appDir);
      
      // Ensure special directories exist and are properly copied
      const specialDirs = ['admin', 'disclaimer'];
      
      specialDirs.forEach(dir => {
        const srcSpecialDir = path.join(srcAppDir, dir);
        const destSpecialDir = path.join(appDir, dir);
        
        if (fs.existsSync(srcSpecialDir) && !fs.existsSync(destSpecialDir)) {
          console.log(`Ensuring ${dir} directory is properly copied...`);
          copyDir(srcSpecialDir, destSpecialDir);
        }
      });
      
      console.log('Successfully created app directory with all necessary files and directories');
    } catch (error) {
      console.error('Error creating app directory:', error);
    }
  } else {
    console.log('App directory already exists or src/app does not exist');
  }
}

// Continue with the normal build process
console.log('Proceeding with Next.js build...');
