/**
 * gen-icons.mjs — Generate placeholder PWA icons for ECOTUN.
 *
 * PLACEHOLDER ICONS: These are generated programmatically for development.
 * Replace with real brand icons before production launch.
 *
 * Usage:
 *   node scripts/gen-icons.mjs
 *
 * Requires: sharp (bundled with Next.js / available in node_modules)
 * Output: public/icons/icon-192.png, public/icons/icon-512.png, public/icons/icon-maskable-512.png
 */

import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, "..", "public", "icons");

fs.mkdirSync(iconsDir, { recursive: true });

// Leaf-green brand colors
const BG = "#1A7F4B";
const FG = "#FFFFFF";

/**
 * Build an SVG string for the icon at a given size.
 * For maskable icons, content is inset to the safe zone (80% of the icon size).
 * @param {number} size — total icon size in px
 * @param {boolean} maskable — whether to add extra padding for the maskable safe zone
 */
function buildSvg(size, maskable = false) {
  // Safe zone for maskable: content within 80% of the size (10% padding each side)
  const padding = maskable ? Math.round(size * 0.1) : 0;
  const inner = size - padding * 2;
  const cx = size / 2;
  const cy = size / 2;

  // Rounded rect radius
  const rx = maskable ? Math.round(size * 0.15) : Math.round(size * 0.1875);

  // Scale all shape coordinates from 512 reference
  const s = inner / 512;
  const ox = padding;
  const oy = padding;

  // Transform a point from 512-space to actual SVG space
  const tx = (x) => (ox + x * s).toFixed(2);
  const ty = (y) => (oy + y * s).toFixed(2);

  // Stroke widths
  const stemW = (18 * s).toFixed(2);
  const branchW = (12 * s).toFixed(2);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${rx}" ry="${rx}" fill="${BG}"/>
  <path d="M${tx(256)} ${ty(380)} L${tx(256)} ${ty(220)}"
    stroke="${FG}" stroke-width="${stemW}" stroke-linecap="round" fill="none"/>
  <path d="M${tx(256)} ${ty(220)}
    C${tx(256)} ${ty(220)} ${tx(180)} ${ty(200)} ${tx(160)} ${ty(140)}
    C${tx(200)} ${ty(100)} ${tx(310)} ${ty(110)} ${tx(320)} ${ty(190)}
    C${tx(320)} ${ty(250)} ${tx(256)} ${ty(220)} ${tx(256)} ${ty(220)}Z"
    fill="${FG}" opacity="0.95"/>
  <path d="M${tx(256)} ${ty(290)} C${tx(230)} ${ty(270)} ${tx(200)} ${ty(275)} ${tx(185)} ${ty(265)}"
    stroke="${FG}" stroke-width="${branchW}" stroke-linecap="round" fill="none" opacity="0.7"/>
</svg>`;
}

async function generateIcon(size, filename, maskable = false) {
  const svg = buildSvg(size, maskable);
  const outPath = path.join(iconsDir, filename);
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(outPath);
  const stat = fs.statSync(outPath);
  console.log(`  ✓ ${filename} (${size}×${size}) — ${stat.size} bytes`);
}

console.log("Generating ECOTUN PWA icons (PLACEHOLDERS — replace with real branding)...");
await generateIcon(192, "icon-192.png", false);
await generateIcon(512, "icon-512.png", false);
await generateIcon(512, "icon-maskable-512.png", true);
console.log("Done. Icons written to public/icons/");
