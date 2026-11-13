import { chromium } from 'playwright-core';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const DOCS_URL = process.env.DOCS_URL || 'http://localhost:5173/';
const OUT_DIR = path.resolve(process.cwd(), 'docs/gifs');
const GIF_WIDTH = 720;
const CHROME_PATH =
  process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

fs.mkdirSync(OUT_DIR, { recursive: true });

function encodeGif(frameDir, outGifPath, fps, width) {
  const palettePath = path.join(frameDir, 'palette.png');
  const pattern = path.join(frameDir, 'frame_%04d.png');
  const vfBase = `fps=${fps},scale=${width}:-1:flags=lanczos`;

  execFileSync(
    'ffmpeg',
    ['-y', '-framerate', String(fps), '-i', pattern, '-vf', `${vfBase},palettegen=stats_mode=diff`, '-frames:v', '1', '-update', '1', palettePath],
    { stdio: 'inherit' }
  );

  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-framerate',
      String(fps),
      '-i',
      pattern,
      '-i',
      palettePath,
      '-lavfi',
      `${vfBase} [x]; [x][1:v] paletteuse=dither=sierra2_4a`,
      outGifPath
    ],
    { stdio: 'inherit' }
  );
}

async function captureFrames(locator, frameDir, durationMs, fps) {
  const intervalMs = Math.round(1000 / fps);
  const totalFrames = Math.ceil(durationMs / intervalMs);
  for (let i = 0; i < totalFrames; i++) {
    const start = Date.now();
    const file = path.join(frameDir, `frame_${String(i).padStart(4, '0')}.png`);
    await locator.screenshot({ path: file });
    const elapsed = Date.now() - start;
    if (elapsed < intervalMs) {
      await new Promise((r) => setTimeout(r, intervalMs - elapsed));
    }
  }
  return totalFrames;
}

async function ensureLightTheme(page) {
  const isLight = await page.evaluate(
    () => document.documentElement.getAttribute('data-theme') === 'light'
  );
  if (!isLight) {
    const headerToggle = page
      .locator('header button', { hasText: /暗夜洒金|澄心昼景|Dark|Light/ })
      .first();
    await headerToggle.click();
    await page.waitForTimeout(800);
  }
}

async function recordDiancha(browser) {
  const frameDir = fs.mkdtempSync(path.join(os.tmpdir(), 'song-ui-diancha-'));
  const page = await browser.newPage({
    viewport: { width: 1080, height: 820 },
    deviceScaleFactor: 2
  });

  try {
    await page.goto(DOCS_URL, { waitUntil: 'networkidle' });
    await ensureLightTheme(page);
    await page.getByRole('button', { name: /点茶与进度/ }).click();
    await page.waitForSelector('.ses-diancha-loader');
    await page.waitForTimeout(300);

    const wrap = page.locator('.ses-diancha-loader').first();
    await wrap.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    // Click "重注沸水击拂" to start from 8% -> 100% (4% per 75ms ≈ 1.75s)
    const actionBtn = wrap.locator('button').first();
    await actionBtn.click();

    const fps = 15;
    // Capture ~3.4s so all 7 stages + final Chabaixi bamboo ink reveal are clearly visible
    await captureFrames(wrap, frameDir, 3400, fps);

    const outGif = path.join(OUT_DIR, 'ses-diancha-loader.gif');
    encodeGif(frameDir, outGif, fps, GIF_WIDTH);
    console.log(`Generated ${outGif}`);
  } finally {
    await page.close();
    fs.rmSync(frameDir, { recursive: true, force: true });
  }
}

async function setRangeValue(page, selector, value) {
  await page.evaluate(
    ({ sel, val }) => {
      const el = document.querySelector(sel);
      if (!el) return;
      el.value = String(val);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    },
    { sel: selector, val: value }
  );
}

async function recordTimepiece(browser) {
  const frameDir = fs.mkdtempSync(path.join(os.tmpdir(), 'song-ui-timepiece-'));
  const page = await browser.newPage({
    viewport: { width: 1120, height: 860 },
    deviceScaleFactor: 2
  });

  try {
    await page.goto(DOCS_URL, { waitUntil: 'networkidle' });
    await ensureLightTheme(page);
    await page.getByRole('button', { name: /司辰日晷/ }).click();
    await page.waitForSelector('.docs-panel');
    await page.waitForTimeout(350);

    const panel = page.locator('.docs-section .docs-panel').first();
    await panel.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);

    const box = await panel.boundingBox();
    if (!box) throw new Error('Could not measure SesTimepiece panel boundingBox');
    const clip = {
      x: Math.floor(box.x),
      y: Math.floor(box.y),
      width: Math.ceil(box.width),
      height: Math.ceil(box.height) + 12
    };

    const toggleBtn = panel.locator('button').first();

    const fps = 12;
    const intervalMs = Math.round(1000 / fps);
    let idx = 0;

    async function snap(count = 1) {
      for (let k = 0; k < count; k++) {
        const start = Date.now();
        const file = path.join(frameDir, `frame_${String(idx++).padStart(4, '0')}.png`);
        await page.screenshot({ clip, path: file });
        const elapsed = Date.now() - start;
        if (elapsed < intervalMs) {
          await new Promise((r) => setTimeout(r, intervalMs - elapsed));
        }
      }
    }

    // 1. Light mode: Equatorial Sundial (sweep 07:00 -> 12:00 -> 17:30)
    const dayPoints = [420, 480, 540, 600, 660, 720, 780, 840, 900, 960, 1020, 1050];
    for (const m of dayPoints) {
      await setRangeValue(page, '.docs-panel input[type="range"]', m);
      await snap(2);
    }
    await snap(6);

    // 2. Toggle to Dark mode: Lotus Clepsydra
    await toggleBtn.click();
    await snap(10); // capture smooth theme transition

    // 3. Night watch sweep (20:00 -> 00:00 -> 04:00)
    const nightPoints = [1200, 1260, 1320, 1380, 1430, 60, 120, 180, 240];
    for (const m of nightPoints) {
      await setRangeValue(page, '.docs-panel input[type="range"]', m);
      await snap(2);
    }
    await snap(8);

    // 4. Toggle back to Light mode for a seamless loop
    await toggleBtn.click();
    await snap(8);

    const outGif = path.join(OUT_DIR, 'ses-timepiece.gif');
    encodeGif(frameDir, outGif, fps, GIF_WIDTH);
    console.log(`Generated ${outGif}`);
  } finally {
    await page.close();
    fs.rmSync(frameDir, { recursive: true, force: true });
  }
}

async function recordGuqin(browser) {
  const frameDir = fs.mkdtempSync(path.join(os.tmpdir(), 'song-ui-guqin-'));
  const page = await browser.newPage({
    viewport: { width: 1120, height: 860 },
    deviceScaleFactor: 2
  });

  try {
    await page.goto(DOCS_URL, { waitUntil: 'networkidle' });
    await ensureLightTheme(page);
    await page.getByRole('button', { name: /七弦琴轸/ }).click();
    await page.waitForSelector('.ses-guqin-track');
    await page.waitForTimeout(300);

    const panel = page.locator('.docs-section .docs-panel').first();
    await panel.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);

    const box = await panel.boundingBox();
    if (!box) throw new Error('Could not measure SesGuqinSlider panel');
    const clip = {
      x: Math.floor(box.x),
      y: Math.floor(box.y),
      width: Math.ceil(box.width),
      height: Math.ceil(box.height) + 8
    };

    const track = panel.locator('.ses-guqin-track').first();
    const tBox = await track.boundingBox();
    if (!tBox) throw new Error('Could not measure .ses-guqin-track');

    const fps = 12;
    let idx = 0;
    async function snap(count = 1) {
      for (let k = 0; k < count; k++) {
        const file = path.join(frameDir, `frame_${String(idx++).padStart(4, '0')}.png`);
        await page.screenshot({ clip, path: file });
      }
    }

    const yMid = tBox.y + tBox.height / 2;
    const xStart = tBox.x + tBox.width * 0.64;
    await page.mouse.move(xStart, yMid);
    await page.mouse.down();
    await snap(3);

    // Drag smoothly left to 15%, then right to 90%, then back to 64%
    const targets = [0.5, 0.35, 0.2, 0.15, 0.3, 0.5, 0.7, 0.88, 0.76, 0.64];
    for (const ratio of targets) {
      await page.mouse.move(tBox.x + tBox.width * ratio, yMid, { steps: 3 });
      await snap(2);
    }
    await page.mouse.up();
    await snap(6);

    const outGif = path.join(OUT_DIR, 'ses-guqin-slider.gif');
    encodeGif(frameDir, outGif, fps, GIF_WIDTH);
    console.log(`Generated ${outGif}`);
  } finally {
    await page.close();
    fs.rmSync(frameDir, { recursive: true, force: true });
  }
}

async function recordIncense(browser) {
  const frameDir = fs.mkdtempSync(path.join(os.tmpdir(), 'song-ui-incense-'));
  const page = await browser.newPage({
    viewport: { width: 1120, height: 860 },
    deviceScaleFactor: 2
  });

  try {
    await page.goto(DOCS_URL, { waitUntil: 'networkidle' });
    await ensureLightTheme(page);
    await page.getByRole('button', { name: /一柱燃香/ }).click();
    await page.waitForSelector('.docs-section .docs-panel');
    await page.waitForTimeout(300);

    const panel = page.locator('.docs-section .docs-panel').first();
    await panel.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);

    const box = await panel.boundingBox();
    if (!box) throw new Error('Could not measure SesIncenseTimer panel');
    const clip = {
      x: Math.floor(box.x),
      y: Math.floor(box.y),
      width: Math.ceil(box.width),
      height: Math.ceil(box.height) + 8
    };

    // Select 15s preset and ignite via SesSeal
    await panel.getByRole('button', { name: /十息/ }).click();
    await page.waitForTimeout(150);
    await panel.getByText(/引火燃香/).click();

    const fps = 12;
    const intervalMs = Math.round(1000 / fps);
    const totalFrames = 48; // 4 seconds of burning embers & rising smoke
    for (let i = 0; i < totalFrames; i++) {
      const start = Date.now();
      const file = path.join(frameDir, `frame_${String(i).padStart(4, '0')}.png`);
      await page.screenshot({ clip, path: file });
      const elapsed = Date.now() - start;
      if (elapsed < intervalMs) {
        await new Promise((r) => setTimeout(r, intervalMs - elapsed));
      }
    }

    const outGif = path.join(OUT_DIR, 'ses-incense-timer.gif');
    encodeGif(frameDir, outGif, fps, GIF_WIDTH);
    console.log(`Generated ${outGif}`);
  } finally {
    await page.close();
    fs.rmSync(frameDir, { recursive: true, force: true });
  }
}

async function recordMountain(browser) {
  const frameDir = fs.mkdtempSync(path.join(os.tmpdir(), 'song-ui-mountain-'));
  const page = await browser.newPage({
    viewport: { width: 1120, height: 860 },
    deviceScaleFactor: 2
  });

  try {
    await page.goto(DOCS_URL, { waitUntil: 'networkidle' });
    await ensureLightTheme(page);
    await page.getByRole('button', { name: /青绿叠嶂/ }).click();
    await page.waitForSelector('.docs-section .docs-panel svg');
    await page.waitForTimeout(350);

    const panel = page.locator('.docs-section .docs-panel').first();
    await panel.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);

    const box = await panel.boundingBox();
    if (!box) throw new Error('Could not measure SesMountainChart panel');
    const clip = {
      x: Math.floor(box.x),
      y: Math.floor(box.y),
      width: Math.ceil(box.width),
      height: Math.ceil(box.height) + 8
    };

    const svg = panel.locator('svg').first();
    const sBox = await svg.boundingBox();
    if (!sBox) throw new Error('Could not measure MountainChart SVG');

    const fps = 12;
    let idx = 0;
    async function snap(count = 1) {
      for (let k = 0; k < count; k++) {
        const file = path.join(frameDir, `frame_${String(idx++).padStart(4, '0')}.png`);
        await page.screenshot({ clip, path: file });
        await new Promise((r) => setTimeout(r, 75));
      }
    }

    await snap(4);
    // Hover across ridge points in grain mode
    for (const rx of [0.22, 0.38, 0.56, 0.74, 0.88]) {
      await page.mouse.move(sBox.x + sBox.width * rx, sBox.y + sBox.height * 0.45);
      await snap(4);
    }

    // Switch to Imperial Kiln series
    await panel.getByRole('button', { name: /官窑岁贡|Imperial Kiln/ }).click();
    await snap(8);
    for (const rx of [0.72, 0.48, 0.28]) {
      await page.mouse.move(sBox.x + sBox.width * rx, sBox.y + sBox.height * 0.45);
      await snap(4);
    }

    // Switch back to Grain for clean loop
    await panel.getByRole('button', { name: /汴京漕粮|Bianjing Grain/ }).click();
    await page.mouse.move(box.x + 10, box.y + 10);
    await snap(6);

    const outGif = path.join(OUT_DIR, 'ses-mountain-chart.gif');
    encodeGif(frameDir, outGif, fps, GIF_WIDTH);
    console.log(`Generated ${outGif}`);
  } finally {
    await page.close();
    fs.rmSync(frameDir, { recursive: true, force: true });
  }
}

async function recordWoodblock(browser) {
  const frameDir = fs.mkdtempSync(path.join(os.tmpdir(), 'song-ui-woodblock-'));
  const page = await browser.newPage({
    viewport: { width: 1120, height: 860 },
    deviceScaleFactor: 2
  });

  try {
    await page.goto(DOCS_URL, { waitUntil: 'networkidle' });
    await ensureLightTheme(page);
    await page.getByRole('button', { name: /乌丝栏善本/ }).click();
    await page.waitForSelector('.docs-section .docs-panel');
    await page.waitForTimeout(350);

    const panel = page.locator('.docs-section .docs-panel').first();
    await panel.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);

    const box = await panel.boundingBox();
    if (!box) throw new Error('Could not measure SesWoodblockReader panel');
    const clip = {
      x: Math.floor(box.x),
      y: Math.floor(box.y),
      width: Math.ceil(box.width),
      height: Math.ceil(box.height) + 12
    };

    const toggleBtn = panel.locator('button').first();
    const fps = 10;
    let idx = 0;
    async function snap(count = 1) {
      for (let k = 0; k < count; k++) {
        const file = path.join(frameDir, `frame_${String(idx++).padStart(4, '0')}.png`);
        await page.screenshot({ clip, path: file });
        await new Promise((r) => setTimeout(r, 90));
      }
    }

    // Vertical mode hold
    await snap(10);
    // Toggle to Horizontal mode
    await toggleBtn.click();
    await snap(14);
    // Toggle back to Vertical mode
    await toggleBtn.click();
    await snap(10);

    const outGif = path.join(OUT_DIR, 'ses-woodblock-reader.gif');
    encodeGif(frameDir, outGif, fps, GIF_WIDTH);
    console.log(`Generated ${outGif}`);
  } finally {
    await page.close();
    fs.rmSync(frameDir, { recursive: true, force: true });
  }
}

async function main() {
  const onlyArg = process.argv.find((a) => a.startsWith('--only='))?.slice(7);
  const selected = onlyArg ? new Set(onlyArg.split(',')) : null;
  const tasks = {
    diancha: recordDiancha,
    timepiece: recordTimepiece,
    guqin: recordGuqin,
    incense: recordIncense,
    mountain: recordMountain,
    woodblock: recordWoodblock
  };

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });

  try {
    for (const [key, fn] of Object.entries(tasks)) {
      if (!selected || selected.has(key)) {
        await fn(browser);
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
