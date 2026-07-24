/** @type {import('@adaskothebeast/esbuild-compressor').DirectoryCompressionOptions} */
module.exports = {
  directory: 'dist/apps/ui/browser',
  extensions: ['.js', '.css', '.html', '.json', '.svg'],
  skipFilesPattern: '^(?:env-config|main)(?:-[^.]+)?\\.js$',
  gzip: true,
  gzipOptions: { level: 9 },
  brotli: true,
  brotliOptions: {
    params: { BROTLI_PARAM_QUALITY: 11 },
  },
  // nginx has no zstd_static, so .zst is a bonus artifact for servers that can serve it.
  zstd: true,
  zstdOptions: {
    params: { ZSTD_c_compressionLevel: 19 },
  },
  imageExtensions: ['.png', '.jpg', '.jpeg'],
  imageFormats: {
    avif: { quality: 50 },
    webp: { quality: 75 },
  },
};
