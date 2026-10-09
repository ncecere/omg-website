// Builds the brand images:
//   public/og.png             the Open Graph card (1200x630): the mark and name,
//                             the headline and, when that slot is filled, the
//                             usage screenshot; colours from app/brand.css
//                             (its dark values)
//   public/favicon.ico, favicon.svg, apple-touch-icon.png, icon-192.png,
//   icon-512.png              copied unchanged from the logo's exports in
//                             omg-assets (logo/portal/), when that folder is
//                             present; LOGO_DIR overrides its location
// Run locally (`npm run og`) after `npm run images` or a logo change, and
// commit the results; CI never reads omg-assets.
import { copyFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");
const mark = JSON.parse(readFileSync(join(root, "lib", "mark.json"), "utf8"));

// Colours come from the shared brand file: the dark block's value of each
// token, so the card follows brand.css without copying it.
const brand = readFileSync(join(root, "app", "brand.css"), "utf8");
const darkBlock = brand.slice(brand.indexOf(".dark,"));
function token(name, fallback) {
  const m = darkBlock.match(new RegExp(`--[a-z]+-${name}:\\s*(#[0-9a-fA-F]{3,8})\\b`));
  return m ? m[1] : fallback;
}
const bg = token("bg", "#0b0d12");
const text = token("text", "#eceef2");
const muted = token("text-muted", "#9ba3b0");
const glow = token("primary", "#5357e6");

const font = "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif";

// Icons: the logo's own exports, byte for byte.
const logoDir = resolve(process.env.LOGO_DIR ?? join(root, "..", "omg-assets", "logo", "portal"));
const icons = [
  ["favicon.ico", "favicon.ico"],
  ["favicon.svg", "favicon.svg"],
  ["png/apple-touch-icon.png", "apple-touch-icon.png"],
  ["png/icon-192.png", "icon-192.png"],
  ["png/icon-512.png", "icon-512.png"],
];
const haveLogo = icons.every(([from]) => existsSync(join(logoDir, from)));
if (haveLogo) for (const [from, to] of icons) copyFileSync(join(logoDir, from), join(pub, to));
else console.warn(`${logoDir} not found: icons left as they are`);

// Open Graph card.
const W = 1200;
const H = 630;
const shot = join(pub, "images", "admin-usage.webp");
const hasShot = existsSync(shot);
const headline = hasShot ? ["One governed API", "for every", "AI model."] : ["One governed API for", "every AI model."];

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="0.15" cy="0" r="1">
      <stop offset="0" stop-color="${glow}" stop-opacity="0.45"/>
      <stop offset="0.6" stop-color="${glow}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${bg}"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <g transform="translate(80 86) scale(0.875)">${mark.svgRegular}</g>
  <text x="152" y="128" font-family="${font}" font-size="40" font-weight="600" fill="${text}" letter-spacing="-0.5">Open Model Gateway</text>
  <text font-family="${font}" font-weight="600" fill="${text}" font-size="${hasShot ? 50 : 64}" letter-spacing="-1.5">
    ${headline.map((line, i) => `<tspan x="80" y="${280 + i * (hasShot ? 62 : 78)}">${line}</tspan>`).join("")}
  </text>
  <text x="80" y="${H - 70}" font-family="${font}" font-size="26" fill="${muted}">Open source (MIT) · Self-hosted · Budgets, exact costs, SSO and audit</text>
</svg>`;

const layers = [];
if (hasShot) {
  const shotWidth = 520;
  const { data, info } = await sharp(shot).resize({ width: shotWidth }).png().toBuffer({ resolveWithObject: true });
  const height = Math.min(info.height, H - 160);
  const cropped = await sharp(data).extract({ left: 0, top: 0, width: info.width, height }).toBuffer();
  const mask = Buffer.from(
    `<svg width="${info.width}" height="${height}"><rect width="${info.width}" height="${height}" rx="16" fill="#fff"/></svg>`,
  );
  const rounded = await sharp(cropped).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
  layers.push({ input: rounded, left: W - shotWidth - 60, top: 60 });
}

await sharp(Buffer.from(svg)).composite(layers).png({ compressionLevel: 9, palette: false }).toFile(join(pub, "og.png"));
console.log(
  `wrote public/og.png${hasShot ? " (with the usage screenshot)" : ""}; ${
    haveLogo ? `copied ${icons.map(([, to]) => to).join(", ")} from ${logoDir}` : "icons unchanged"
  }`,
);
