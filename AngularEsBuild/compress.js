// compress.js
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

// Update the path to match your dist directory
const distDir = path.resolve(__dirname, 'dist/apps/ui');

function compressFile(filePath) {
  const fileContents = fs.readFileSync(filePath);

  // Gzip compression
  const gzipContent = zlib.gzipSync(fileContents, { level: 9 });
  fs.writeFileSync(`${filePath}.gz`, gzipContent);
  console.log(`Compressed ${filePath} to ${filePath}.gz`);

  // Brotli compression
  const brotliContent = zlib.brotliCompressSync(fileContents, {
    params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 },
  });
  fs.writeFileSync(`${filePath}.br`, brotliContent);
  console.log(`Compressed ${filePath} to ${filePath}.br`);
}

function compressDirectory(directory) {
  fs.readdirSync(directory).forEach((file) => {
    const fullPath = path.join(directory, file);
    const stats = fs.statSync(fullPath);

    if (stats.isFile() && /\.(js|css|html|svg)$/.test(fullPath)) {
      compressFile(fullPath);
    } else if (stats.isDirectory()) {
      compressDirectory(fullPath);
    }
  });
}

// Start compression from the dist directory
compressDirectory(distDir);
