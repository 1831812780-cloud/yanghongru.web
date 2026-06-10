import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("/Users/hongruyang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp");

const widths = [900, 1600, 2200];
const imageExts = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const outRoot = "assets/optimized";

function gitFiles() {
  return execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
    .split("\0")
    .filter(Boolean);
}

function outputBase(src, width) {
  const parsed = path.parse(src);
  const cleanDir = path.join(outRoot, parsed.dir);
  mkdirSync(cleanDir, { recursive: true });
  return path.join(cleanDir, `${parsed.name}-${width}`);
}

async function encode(src, width, format) {
  const base = outputBase(src, width);
  const out = `${base}.${format}`;
  const image = sharp(src, { limitInputPixels: false }).rotate();
  const meta = await image.metadata();
  const targetWidth = Math.min(width, meta.width || width);
  let pipeline = image.resize({
    width: targetWidth,
    withoutEnlargement: true,
    fit: "inside"
  });

  if (format === "webp") {
    pipeline = pipeline.webp({
      quality: width === 900 ? 72 : 76,
      effort: 5,
      smartSubsample: true
    });
  } else {
    pipeline = pipeline.avif({
      quality: width === 900 ? 42 : 46,
      effort: 4
    });
  }

  await pipeline.toFile(out);
  return out;
}

async function main() {
  const files = gitFiles().filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return imageExts.has(ext) && !file.startsWith(outRoot + "/");
  });

  const manifest = {};
  for (const src of files) {
    manifest[src] = {};
    for (const width of widths) {
      const webp = await encode(src, width, "webp");
      const avif = await encode(src, width, "avif");
      manifest[src][width] = { webp, avif };
    }
    console.log(`optimized ${src}`);
  }

  writeFileSync(
    "optimized-images.js",
    `window.optimizedImages = ${JSON.stringify(manifest, null, 2)};\n`,
    "utf8"
  );
  console.log(`Wrote optimized-images.js for ${files.length} images`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
