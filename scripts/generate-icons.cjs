// Generate PWA PNG icons using only Node.js built-in modules
// Creates a milk-tea themed icon (cream cup with gold tea on warm background)
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function crc32(buf) {
  let crc = 0xffffffff;
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crcVal = Buffer.alloc(4);
  crcVal.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([len, typeBytes, data, crcVal]);
}

function createPNG(width, height, pixels) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // Raw image data with filter bytes
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const idx = y * (1 + width * 4) + 1 + x * 4;
      const p = pixels[y * width + x];
      raw[idx] = (p >> 24) & 0xff;     // R
      raw[idx + 1] = (p >> 16) & 0xff; // G
      raw[idx + 2] = (p >> 8) & 0xff;  // B
      raw[idx + 3] = p & 0xff;         // A
    }
  }

  const compressed = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// Colors (Wabi-Sabi palette)
const BG    = 0xFAF8F5FF; // cream background
const CUP   = 0xF0EBE3FF; // cup color
const TEA   = 0xC9A96EFF; // gold tea
const FOAM  = 0xFAF8F5C0; // semi-transparent foam
const RIM   = 0xF5EDE0FF; // cup rim
const DARK  = 0xC4B89AFF; // strokes
const STEAM = 0xD4C5B280; // steam

function blend(fg, bg) {
  const fa = fg & 0xff;
  const ba = bg & 0xff;
  const a = fa + ((ba * (255 - fa)) / 255) | 0;
  if (a === 0) return 0;
  const r = (((fg >> 24) & 0xff) * fa + ((bg >> 24) & 0xff) * ba * (255 - fa) / 255) / a | 0;
  const g = (((fg >> 16) & 0xff) * fa + ((bg >> 16) & 0xff) * ba * (255 - fa) / 255) / a | 0;
  const b = (((fg >> 8) & 0xff) * fa + ((bg >> 8) & 0xff) * ba * (255 - fa) / 255) / a | 0;
  return (r << 24) | (g << 16) | (b << 8) | a;
}

function drawCircle(pixels, w, cx, cy, r, color) {
  for (let y = Math.max(0, (cy - r) | 0); y < Math.min(w, (cy + r) | 0); y++) {
    for (let x = Math.max(0, (cx - r) | 0); x < Math.min(w, (cx + r) | 0); x++) {
      const dx = x - cx + 0.5, dy = y - cy + 0.5;
      if (dx * dx + dy * dy <= r * r) {
        const idx = y * w + x;
        pixels[idx] = blend(color, pixels[idx]);
      }
    }
  }
}

function drawRect(pixels, w, rx, ry, rw, rh, color, rxr = 0) {
  for (let y = Math.max(0, ry); y < Math.min(w, ry + rh); y++) {
    for (let x = Math.max(0, rx); x < Math.min(w, rx + rw); x++) {
      // Simple rounded corners
      let inside = true;
      if (rxr > 0) {
        if (x < rx + rxr && y < ry + rxr) {
          const dx = x - (rx + rxr) + 0.5, dy = y - (ry + rxr) + 0.5;
          inside = dx * dx + dy * dy <= rxr * rxr;
        } else if (x >= rx + rw - rxr && y < ry + rxr) {
          const dx = x - (rx + rw - rxr) + 0.5, dy = y - (ry + rxr) + 0.5;
          inside = dx * dx + dy * dy <= rxr * rxr;
        } else if (x < rx + rxr && y >= ry + rh - rxr) {
          const dx = x - (rx + rxr) + 0.5, dy = y - (ry + rh - rxr) + 0.5;
          inside = dx * dx + dy * dy <= rxr * rxr;
        } else if (x >= rx + rw - rxr && y >= ry + rh - rxr) {
          const dx = x - (rx + rw - rxr) + 0.5, dy = y - (ry + rh - rxr) + 0.5;
          inside = dx * dx + dy * dy <= rxr * rxr;
        }
      }
      if (inside) {
        const idx = y * w + x;
        pixels[idx] = blend(color, pixels[idx]);
      }
    }
  }
}

function generateIcon(size) {
  const w = size, h = size;
  const pixels = new Uint32Array(w * h);
  pixels.fill(BG);

  // Scale factors based on 512px design
  const s = size / 512;

  // Cup body
  const cupX = (128 * s) | 0, cupY = (156 * s) | 0, cupW = (256 * s) | 0, cupH = (248 * s) | 0;
  drawRect(pixels, w, cupX, cupY, cupW, cupH, CUP, (32 * s) | 0);

  // Cup border (stroke)
  const borderW = Math.max(1, (6 * s) | 0);
  // draw border as rect outline
  for (let y = Math.max(0, cupY); y < Math.min(h, cupY + cupH); y++) {
    for (let x = Math.max(0, cupX); x < Math.min(w, cupX + cupW); x++) {
      const inBorder =
        x < cupX + borderW || x >= cupX + cupW - borderW ||
        y < cupY + borderW || y >= cupY + cupH - borderW;
      if (inBorder) {
        const idx = y * w + x;
        pixels[idx] = blend(DARK, pixels[idx]);
      }
    }
  }

  // Tea liquid
  const teaX = (140 * s) | 0, teaY = (188 * s) | 0, teaW = (232 * s) | 0, teaH = (200 * s) | 0;
  drawRect(pixels, w, teaX, teaY, teaW, teaH, TEA, (24 * s) | 0);

  // Foam bubbles
  drawCircle(pixels, w, (210 * s) | 0, (210 * s) | 0, (14 * s) | 0, FOAM);
  drawCircle(pixels, w, (270 * s) | 0, (198 * s) | 0, (10 * s) | 0, FOAM);
  drawCircle(pixels, w, (310 * s) | 0, (220 * s) | 0, (12 * s) | 0, FOAM);

  // Cup rim
  const rimX = (124 * s) | 0, rimY = (148 * s) | 0, rimW = (264 * s) | 0, rimH = (24 * s) | 0;
  drawRect(pixels, w, rimX, rimY, rimW, rimH, RIM, (12 * s) | 0);
  // Rim border
  for (let y = Math.max(0, rimY); y < Math.min(h, rimY + rimH); y++) {
    for (let x = Math.max(0, rimX); x < Math.min(w, rimX + rimW); x++) {
      const inBorder =
        x < rimX + borderW || x >= rimX + rimW - borderW ||
        y < rimY + borderW || y >= rimY + rimH - borderW;
      if (inBorder) {
        const idx = y * w + x;
        pixels[idx] = blend(DARK, pixels[idx]);
      }
    }
  }

  // Straw (diagonal — simplified as rotated rect)
  const strawBaseX = (340 * s) | 0, strawY = (50 * s) | 0;
  const strawW = Math.max(1, (10 * s) | 0), strawH = (200 * s) | 0;
  const angle = 12 * Math.PI / 180;
  const cos = Math.cos(angle), sin = Math.sin(angle);
  const cx = strawBaseX + strawW / 2, cy = strawY;

  for (let dy = 0; dy < strawH; dy++) {
    for (let dx = -strawW / 2; dx < strawW / 2; dx++) {
      const rx = cx + dx * cos - dy * sin;
      const ry = cy + dx * sin + dy * cos;
      const ix = rx | 0, iy = ry | 0;
      if (ix >= 0 && ix < w && iy >= 0 && iy < h) {
        const idx = iy * w + ix;
        pixels[idx] = blend(0xE8D5A0FF, pixels[idx]);
      }
    }
  }

  // Steam wisps (simple arcs)
  function drawSteam(sx, sy, len) {
    for (let t = 0; t < len; t++) {
      const frac = t / len;
      const x = sx + Math.sin(frac * Math.PI * 2) * (6 * s);
      const y = sy - frac * len;
      const ix = x | 0, iy = y | 0;
      if (ix >= 0 && ix < w && iy >= 0 && iy < h) {
        const idx = iy * w + ix;
        // Draw a small dot for steam
        pixels[idx] = blend(STEAM, pixels[idx]);
      }
    }
  }

  // Three steam lines
  drawSteam((180 * s) | 0, (130 * s) | 0, (80 * s) | 0);
  drawSteam((230 * s) | 0, (120 * s) | 0, (80 * s) | 0);
  drawSteam((280 * s) | 0, (125 * s) | 0, (80 * s) | 0);

  return createPNG(w, h, pixels);
}

// Generate icons
const publicDir = path.resolve(__dirname, '..', 'public');

const icon192 = generateIcon(192);
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), icon192);
console.log('Created icon-192.png');

const icon512 = generateIcon(512);
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), icon512);
console.log('Created icon-512.png');
