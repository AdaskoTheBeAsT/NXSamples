// compress.js
// Post-build sweep: pre-compressed text assets (.gz/.br/.zst) plus AVIF/WebP images.
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const sharp = require('sharp');

const distDir = path.resolve(__dirname, 'dist/apps/ui');
const compressibleExtensions = /\.(js|mjs|css|html|json|svg)$/;
const imageExtensions = /\.(png|jpe?g)$/;

// env-config*.js is rewritten by env.sh at container startup, so a build-time
// .gz/.br/.zst sibling would keep serving stale configuration.
const skipRuntimeConfig = /env-config(.*)\.js$/;

const zstdSupported = typeof zlib.zstdCompressSync === 'function';

// The bundler plugins already emit most variants, so only fill in what is missing.
function write(targetPath, produce) {
  if (fs.existsSync(targetPath)) {
    return;
  }

  fs.writeFileSync(targetPath, produce());
  console.log(`Created ${targetPath}`);
}

function compressFile(filePath) {
  const fileContents = fs.readFileSync(filePath);

  write(`${filePath}.gz`, () => zlib.gzipSync(fileContents, { level: 9 }));

  write(`${filePath}.br`, () =>
    zlib.brotliCompressSync(fileContents, {
      params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 },
    }),
  );

  if (zstdSupported) {
    write(`${filePath}.zst`, () =>
      zlib.zstdCompressSync(fileContents, {
        params: { [zlib.constants.ZSTD_c_compressionLevel]: 19 },
      }),
    );
  }
}

async function convertImage(filePath) {
  const basePath = filePath.replace(imageExtensions, '');

  const avifPath = `${basePath}.avif`;
  if (!fs.existsSync(avifPath)) {
    await sharp(filePath).avif({ quality: 50 }).toFile(avifPath);
    console.log(`Created ${avifPath}`);
  }

  const webpPath = `${basePath}.webp`;
  if (!fs.existsSync(webpPath)) {
    await sharp(filePath).webp({ quality: 75 }).toFile(webpPath);
    console.log(`Created ${webpPath}`);
  }
}

async function processDirectory(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      await processDirectory(fullPath);
      continue;
    }

    if (!entry.isFile() || skipRuntimeConfig.test(entry.name)) {
      continue;
    }

    if (compressibleExtensions.test(fullPath)) {
      compressFile(fullPath);
    }

    if (imageExtensions.test(fullPath)) {
      await convertImage(fullPath);
    }
  }
}

if (!zstdSupported) {
  console.warn(
    'Zstandard is unavailable in this Node.js runtime (needs 22.15+ or 24+); skipping .zst output.',
  );
}

processDirectory(distDir).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
