const { execSync } = require('child_process');
const path = require('path');
const fse = require('fs-extra');

const clientDir = path.join(__dirname, '..', 'client');
const outDir = path.join(__dirname, '..', 'public');

try{
  console.log('Installing client dependencies...');
  execSync('npm install', { cwd: clientDir, stdio: 'inherit' });
  console.log('Building client (vite)...');
  execSync('npm run build', { cwd: clientDir, stdio: 'inherit' });

  console.log('Copying client/dist to server/public...');
  fse.removeSync(outDir);
  fse.ensureDirSync(outDir);
  fse.copySync(path.join(clientDir, 'dist'), outDir);

  console.log('Client build copied to', outDir);
}catch(err){
  console.error('Build client failed', err);
  process.exit(1);
}
