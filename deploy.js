// Deployment script for the Fire Safety Inspectors Guide
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting deployment process for Fire Safety Inspectors Guide...');

// Verify that all required files and directories exist
const requiredDirs = [
  'src/app',
  'src/app/admin',
  'src/app/disclaimer',
  'src/components',
  'src/data'
];

const requiredFiles = [
  'vercel.json',
  'next.config.js',
  'src/app/not-found.tsx',
  'src/app/admin/page.tsx',
  'src/app/admin/layout.tsx',
  'src/app/disclaimer/page.tsx',
  'src/app/disclaimer/layout.tsx'
];

console.log('Verifying required directories and files...');

let allRequirementsPass = true;

// Check directories
requiredDirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    console.error(`❌ Required directory not found: ${dir}`);
    allRequirementsPass = false;
  } else {
    console.log(`✅ Directory found: ${dir}`);
  }
});

// Check files
requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Required file not found: ${file}`);
    allRequirementsPass = false;
  } else {
    console.log(`✅ File found: ${file}`);
  }
});

if (!allRequirementsPass) {
  console.error('❌ Some required files or directories are missing. Please fix before deploying.');
  process.exit(1);
}

// Run linting to catch any issues
console.log('\nRunning linting...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ Linting passed');
} catch (error) {
  console.error('❌ Linting failed. Please fix linting issues before deploying.');
  process.exit(1);
}

// Build the application
console.log('\nBuilding the application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful');
} catch (error) {
  console.error('❌ Build failed. Please fix build issues before deploying.');
  process.exit(1);
}

// Deploy to Vercel
console.log('\nDeploying to Vercel...');
try {
  // Check if the Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'pipe' });
  } catch (error) {
    console.log('Vercel CLI not found. Installing...');
    execSync('npm install -g vercel', { stdio: 'inherit' });
  }

  // Deploy to Vercel
  console.log('Running Vercel deployment...');
  execSync('vercel --prod', { stdio: 'inherit' });
  console.log('✅ Deployment successful');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}

console.log('\n🎉 Deployment process completed!');
console.log('Visit your Vercel dashboard to verify the deployment.');
