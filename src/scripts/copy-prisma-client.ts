import * as fs from 'fs';
import * as path from 'path';

function copyFolderSync(from: string, to: string) {
  if (!fs.existsSync(from)) {
    console.warn(`Source folder does not exist: ${from}`);
    return;
  }
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    const stat = fs.lstatSync(fromPath);
    if (stat.isFile()) {
      try {
        fs.copyFileSync(fromPath, toPath);
      } catch (err: any) {
        if (err.code === 'EBUSY' && fs.existsSync(toPath)) {
          console.warn(`Warning: File ${element} is locked/busy, but already exists in destination. Skipping copy.`);
        } else {
          throw err;
        }
      }
    } else if (stat.isDirectory()) {
      copyFolderSync(fromPath, toPath);
    }
  });
}

const srcDir = path.join(__dirname, '../../src/generated/client');
const distDir = path.join(__dirname, '../../dist/generated/client');

console.log(`Copying Prisma Client from ${srcDir} to ${distDir}...`);
copyFolderSync(srcDir, distDir);
console.log('Prisma Client copied to dist successfully.');
