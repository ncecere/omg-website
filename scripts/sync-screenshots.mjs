// Copies the screenshots that exist into public/images as optimised WebP and
// records their sizes in lib/screenshots.json. Slots without a file keep
// showing a placeholder. Run locally (`npm run images`) and commit the result;
// CI never reads the screenshots directory.
//
// SCREENSHOTS_DIR defaults to ../omg-assets/screenshots, the public
// fictional-instance set. For each slot in lib/slots.json the script looks for
// `file` (or the slot's own name) there; if that is missing and the slot names
// an `interimFile`, it uses that instead and marks the image as interim.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = resolve(process.env.SCREENSHOTS_DIR ?? join(root, "..", "omg-assets", "screenshots"));
const outDir = join(root, "public", "images");
const slots = JSON.parse(readFileSync(join(root, "lib", "slots.json"), "utf8"));
const MAX_WIDTH = 1600;
// Phone screenshots are shown about 18rem wide; 720 px covers 2x screens.
const MAX_PHONE_WIDTH = 720;

const find = (base) =>
  base ? [".png", ".webp", ".jpg"].map((ext) => join(sourceDir, base + ext)).find((p) => existsSync(p)) : undefined;

mkdirSync(outDir, { recursive: true });
const manifest = {};
const missing = [];

for (const [name, slot] of Object.entries(slots)) {
  const base = slot.file ?? name;
  let src = find(base);
  let interim = false;
  if (!src && slot.interimFile) {
    src = find(slot.interimFile);
    interim = Boolean(src);
  }
  const dest = join(outDir, `${name}.webp`);
  if (!src) {
    missing.push(`${base}.png`);
    rmSync(dest, { force: true });
    continue;
  }
  const image = sharp(src).rotate();
  const meta = await image.metadata();
  const maxWidth = slot.shape === "phone" ? MAX_PHONE_WIDTH : MAX_WIDTH;
  const pipeline = meta.width > maxWidth ? image.resize({ width: maxWidth }) : image;
  const info = await pipeline.webp({ quality: 82, effort: 6 }).toFile(dest);
  manifest[name] = { src: `/images/${name}.webp`, width: info.width, height: info.height, ...(interim ? { interim: true } : {}) };
  console.log(`${interim ? "interim " : "ok      "} ${name}: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} KiB`);
}

writeFileSync(join(root, "lib", "screenshots.json"), JSON.stringify(manifest, null, 2) + "\n");
for (const file of missing) console.log(`missing  ${file}`);
console.log(`${Object.keys(manifest).length} of ${Object.keys(slots).length} slots filled from ${sourceDir}`);
