// Optimize raster images: PNG -> WebP (resized), plus small favicons.
// Originals are kept; HTML references the .webp versions.
import sharp from "sharp";
import { stat } from "node:fs/promises";

const A = "assets";

// [input, output, maxWidth] — convert to WebP, resize down to a sane display size
const toWebp = [
  ["card.png", "card.webp", 1100],
  ["bill.png", "bill.webp", 1100],
  ["robot.png", "robot.webp", 1100],
  ["people01.png", "people01.webp", 144],
  ["people02.png", "people02.webp", 144],
  ["people03.png", "people03.webp", 144],
  ["airbnb.png", "airbnb.webp", 400],
  ["binance.png", "binance.webp", 400],
  ["coinbase.png", "coinbase.webp", 400],
  ["dropbox.png", "dropbox.webp", 400],
];

const kb = (n) => (n / 1024).toFixed(1) + " KB";

for (const [inp, out, w] of toWebp) {
  const before = (await stat(`${A}/${inp}`)).size;
  await sharp(`${A}/${inp}`)
    .resize({ width: w, withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(`${A}/${out}`);
  const after = (await stat(`${A}/${out}`)).size;
  console.log(`${inp.padEnd(16)} ${kb(before).padStart(10)}  ->  ${out.padEnd(16)} ${kb(after).padStart(10)}`);
}

// Logo: the source SVG embeds a huge base64 raster (~2.2MB) but only displays
// small. Rasterize to a crisp 3x WebP (display ~266px wide -> 800px source).
{
  const before = (await stat(`${A}/logo.svg`)).size;
  await sharp(`${A}/logo.svg`, { density: 400 })
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 90, effort: 6 })
    .toFile(`${A}/logo.webp`);
  const after = (await stat(`${A}/logo.webp`)).size;
  console.log(`${"logo.svg".padEnd(16)} ${kb(before).padStart(10)}  ->  ${"logo.webp".padEnd(16)} ${kb(after).padStart(10)}`);
}

// Social share image (Open Graph / Twitter) — 1200x630, logo on brand bg.
{
  const bg = await sharp({
    create: { width: 1200, height: 630, channels: 4, background: { r: 0, g: 4, b: 15, alpha: 1 } },
  })
    .png()
    .toBuffer();
  const logoBuf = await sharp(`${A}/logo.svg`, { density: 400 })
    .resize({ width: 760, withoutEnlargement: true })
    .png()
    .toBuffer();
  await sharp(bg)
    .composite([{ input: logoBuf, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(`${A}/og-image.png`);
  console.log(`og-image.png    ${kb((await stat(`${A}/og-image.png`)).size).padStart(10)}`);
}

// Favicons from logoicon.png (transparent, square, contain)
const favBg = { r: 0, g: 0, b: 0, alpha: 0 };
await sharp(`${A}/logoicon.png`)
  .resize(32, 32, { fit: "contain", background: favBg })
  .png({ compressionLevel: 9 })
  .toFile(`${A}/favicon-32.png`);
await sharp(`${A}/logoicon.png`)
  .resize(180, 180, { fit: "contain", background: favBg })
  .png({ compressionLevel: 9 })
  .toFile(`${A}/apple-touch-icon.png`);
console.log(
  `favicon-32.png   ${kb((await stat(`${A}/favicon-32.png`)).size).padStart(10)}   |   ` +
  `apple-touch-icon.png ${kb((await stat(`${A}/apple-touch-icon.png`)).size).padStart(10)}`
);
