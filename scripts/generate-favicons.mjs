/**
 * Regenerates every favicon / app icon / OG image in public/ from the source
 * logo. Run `pnpm favicons` after changing
 * src/assets/images/lofoten-jazzklubb.png.
 *
 * The source is a wide wordmark (roughly 3:1), so square icons letterbox it
 * rather than cropping — a crop would slice the wordmark in half. That leaves a
 * lot of empty space at small sizes, and the 16px favicon is essentially
 * illegible. A dedicated square mark or monogram would render far better; drop
 * one in as SOURCE and everything below regenerates from it.
 */
import { mkdir } from "node:fs/promises";

import sharp from "sharp";

const SOURCE = "src/assets/images/lofoten-jazzklubb.png";
const OUT = "public";

/**
 * The source logo has a real alpha channel: the wordmark and the gaps between
 * brushstrokes are *transparent*, not white. It only reads as "white text on
 * blue" because it sits on a white page. So every output is flattened onto
 * white — flattening onto the brand blue would fill the knocked-out letters
 * with blue and erase the wordmark entirely.
 */
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

/** Square icon, wordmark centred and letterboxed on white. */
const square = (size, { safeZone = 1 } = {}) => {
  const inner = Math.round(size * safeZone);
  const pad = Math.round((size - inner) / 2);
  return sharp(SOURCE)
    .resize(inner, inner, { fit: "contain", background: WHITE })
    .flatten({ background: WHITE })
    .extend({
      top: pad,
      bottom: size - inner - pad,
      left: pad,
      right: size - inner - pad,
      background: WHITE,
    })
    .png();
};

await mkdir(OUT, { recursive: true });

const targets = [
  ["favicon-16.png", square(16)],
  ["favicon-32.png", square(32)],
  ["favicon-48.png", square(48)],
  ["apple-touch-icon.png", square(180)],
  ["icon-192.png", square(192)],
  ["icon-512.png", square(512)],
  // Maskable icons get cropped to a circle/squircle by the OS, so the artwork
  // must sit inside the middle 80% or it loses its edges.
  ["icon-maskable-512.png", square(512, { safeZone: 0.8 })],
  [
    // 1200x630 is the OG/Twitter standard. The source is wider than 1.91:1, so
    // it is contained rather than cropped.
    "og-image.png",
    sharp(SOURCE)
      .resize(1200, 630, { fit: "contain", background: WHITE })
      .flatten({ background: WHITE })
      // Palette quantisation: this is flat-ish artwork, so 256 colours is
      // visually identical and roughly a fifth of the bytes. Social scrapers
      // are strict about payload size.
      .png({ compressionLevel: 9, palette: true, quality: 90 }),
  ],
];

for (const [name, pipeline] of targets) {
  const info = await pipeline.toFile(`${OUT}/${name}`);
  console.log(
    `  ${name.padEnd(24)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(1)} kB`,
  );
}
