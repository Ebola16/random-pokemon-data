const fs = require("fs");
const path = require("path");

const IMAGE_DIR = "images";
const OUTPUT_FILE = path.join("data", "images.json");
const VALID_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp|avif|heic|heif)$/i;

function walkDir(dir, base = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(base, entry.name).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath, relativePath));
    } else if (VALID_EXTENSIONS.test(entry.name)) {
      files.push(relativePath);
    }
  }

  return files;
}

function main() {
  if (!fs.existsSync(IMAGE_DIR)) {
    console.error(`Directory "${IMAGE_DIR}" does not exist.`);
    process.exit(1);
  }

  const imagePaths = walkDir(IMAGE_DIR);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(imagePaths, null, 2));
  console.log(`✅ ${OUTPUT_FILE} generated with ${imagePaths.length} images.`);
}

main();
