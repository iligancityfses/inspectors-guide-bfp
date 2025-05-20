// Script to verify Next.js app structure
const fs = require('fs');
const path = require('path');

console.log('Verifying Next.js application structure...');

// Check for src/app directory
const srcAppDir = path.join(__dirname, 'src', 'app');
if (fs.existsSync(srcAppDir)) {
  console.log('✓ src/app directory found');
} else {
  console.error('✗ src/app directory not found');
}

// Check for package.json
const packageJson = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJson)) {
  console.log('✓ package.json found');
  
  // Read and check package.json content
  try {
    const packageData = JSON.parse(fs.readFileSync(packageJson, 'utf8'));
    console.log(`✓ Project name: ${packageData.name}`);
    console.log(`✓ Next.js version: ${packageData.dependencies.next}`);
    
    // Check for next.js related scripts
    if (packageData.scripts && packageData.scripts.build) {
      console.log(`✓ Build script: ${packageData.scripts.build}`);
    }
  } catch (err) {
    console.error('✗ Error reading package.json:', err.message);
  }
} else {
  console.error('✗ package.json not found');
}

// Check for next.config.js
const nextConfig = path.join(__dirname, 'next.config.js');
if (fs.existsSync(nextConfig)) {
  console.log('✓ next.config.js found');
} else {
  console.error('✗ next.config.js not found');
}

// Check for vercel.json
const vercelJson = path.join(__dirname, 'vercel.json');
if (fs.existsSync(vercelJson)) {
  console.log('✓ vercel.json found');
  
  // Read and check vercel.json content
  try {
    const vercelData = JSON.parse(fs.readFileSync(vercelJson, 'utf8'));
    console.log(`✓ Framework: ${vercelData.framework}`);
    if (vercelData.outputDirectory) {
      console.log(`✓ Output directory: ${vercelData.outputDirectory}`);
    }
  } catch (err) {
    console.error('✗ Error reading vercel.json:', err.message);
  }
} else {
  console.error('✗ vercel.json not found');
}

console.log('\nVerification complete. If all checks passed, your project structure should be correctly recognized by Vercel.');
console.log('If you continue to experience issues, please consider the following:');
console.log('1. Ensure all files are committed and pushed to your GitHub repository');
console.log('2. In Vercel dashboard, set the "Root Directory" setting to the correct path if needed');
console.log('3. Check Vercel build logs for more specific error messages');
