#!/usr/bin/env node

const { execFile } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { promisify } = require("node:util");
const zlib = require("node:zlib");

const execFileAsync = promisify(execFile);

const BG = [247, 248, 250];
const PLOT_BG = [255, 255, 255];
const GRID = [226, 232, 240];
const AXIS = [100, 116, 139];
const LINE = [15, 23, 42];
const FILL = [191, 219, 254];
const TEXT = [30, 41, 59];

const FONT = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "10000", "11110", "00001", "00001", "11110"],
  "6": ["01110", "10000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00001", "01110"],
  A: ["00100", "01010", "10001", "10001", "11111", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01111", "10000", "10000", "10111", "10001", "10001", "01110"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["01110", "00100", "00100", "00100", "00100", "00100", "01110"],
  J: ["00111", "00010", "00010", "00010", "00010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "10101", "01010"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  a: ["00000", "00000", "01110", "00001", "01111", "10001", "01111"],
  b: ["10000", "10000", "11110", "10001", "10001", "10001", "11110"],
  c: ["00000", "00000", "01111", "10000", "10000", "10000", "01111"],
  d: ["00001", "00001", "01111", "10001", "10001", "10001", "01111"],
  e: ["00000", "00000", "01110", "10001", "11111", "10000", "01111"],
  f: ["00110", "01001", "01000", "11100", "01000", "01000", "01000"],
  g: ["00000", "00000", "01111", "10001", "10001", "01111", "00001"],
  h: ["10000", "10000", "11110", "10001", "10001", "10001", "10001"],
  i: ["00100", "00000", "01100", "00100", "00100", "00100", "01110"],
  j: ["00010", "00000", "00110", "00010", "00010", "10010", "01100"],
  k: ["10000", "10000", "10010", "10100", "11000", "10100", "10010"],
  l: ["01100", "00100", "00100", "00100", "00100", "00100", "01110"],
  m: ["00000", "00000", "11010", "10101", "10101", "10101", "10101"],
  n: ["00000", "00000", "11110", "10001", "10001", "10001", "10001"],
  o: ["00000", "00000", "01110", "10001", "10001", "10001", "01110"],
  p: ["00000", "00000", "11110", "10001", "10001", "11110", "10000"],
  q: ["00000", "00000", "01111", "10001", "10001", "01111", "00001"],
  r: ["00000", "00000", "10111", "11000", "10000", "10000", "10000"],
  s: ["00000", "00000", "01111", "10000", "01110", "00001", "11110"],
  t: ["01000", "01000", "11100", "01000", "01000", "01001", "00110"],
  u: ["00000", "00000", "10001", "10001", "10001", "10011", "01101"],
  v: ["00000", "00000", "10001", "10001", "10001", "01010", "00100"],
  w: ["00000", "00000", "10001", "10001", "10101", "10101", "01010"],
  x: ["00000", "00000", "10001", "01010", "00100", "01010", "10001"],
  y: ["00000", "00000", "10001", "10001", "10001", "01111", "00001"],
  z: ["00000", "00000", "11111", "00010", "00100", "01000", "11111"],
  ".": ["00000", "00000", "00000", "00000", "00000", "01100", "01100"],
  "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
  ":": ["00000", "00100", "00100", "00000", "00100", "00100", "00000"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"]
};

const MONTHS = {
  1: "JAN",
  2: "FEB",
  3: "MAR",
  4: "APR",
  5: "MAY",
  6: "JUN",
  7: "JUL",
  8: "AUG",
  9: "SEP",
  10: "OCT",
  11: "NOV",
  12: "DEC"
};

function parseArgs(argv) {
  const args = {
    bucket: "week",
    authorEmail: [],
    authorName: [],
    output: "github-lines-changed.png",
    jsonOutput: "github-lines-changed.json"
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      i += 1;
      if (i >= argv.length) {
        throw new Error(`missing value for ${arg}`);
      }
      return argv[i];
    };

    if (arg === "--days") args.days = Number(next());
    else if (arg === "--from") args.fromDate = next();
    else if (arg === "--to") args.toDate = next();
    else if (arg === "--bucket") args.bucket = next();
    else if (arg === "--root") args.root = next();
    else if (arg === "--author-email") args.authorEmail.push(next());
    else if (arg === "--author-name") args.authorName.push(next());
    else if (arg === "--output") args.output = next();
    else if (arg === "--json-output") args.jsonOutput = next();
    else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }

  if (!["day", "week", "month"].includes(args.bucket)) {
    throw new Error("--bucket must be day, week, or month");
  }
  if (args.days !== undefined && (!Number.isInteger(args.days) || args.days <= 0)) {
    throw new Error("--days must be a positive integer");
  }

  return args;
}

function printHelp() {
  process.stdout.write(
    [
      "Usage: locmeter [options]",
      "",
      "Defaults:",
      "  --bucket week",
      "  --to today",
      "  --from one year before --to",
      "  --author-email/--author-name auto-detected from current gh login",
      "",
      "Options:",
      "  --days N",
      "  --from YYYY-MM-DD",
      "  --to YYYY-MM-DD",
      "  --bucket day|week|month",
      "  --root /path/to/repos",
      "  --author-email you@example.com",
      "  --author-name yourname",
      "  --output chart.png",
      "  --json-output data.json"
    ].join("\n") + "\n"
  );
}

function parseDate(value) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function dateIso(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days));
}

function addYears(date, years) {
  return new Date(Date.UTC(date.getUTCFullYear() + years, date.getUTCMonth(), date.getUTCDate()));
}

function computeDates(args) {
  const today = new Date();
  const utcToday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const endDate = args.toDate ? parseDate(args.toDate) : utcToday;
  let startDate;
  if (args.fromDate) startDate = parseDate(args.fromDate);
  else if (args.days !== undefined) startDate = addDays(endDate, -(args.days - 1));
  else startDate = addYears(endDate, -1);
  if (startDate > endDate) throw new Error("--from must be before or equal to --to");
  return { startDate, endDate };
}

function bucketStart(date, bucket) {
  if (bucket === "day") return new Date(date.getTime());
  if (bucket === "week") {
    const day = (date.getUTCDay() + 6) % 7;
    return addDays(date, -day);
  }
  if (bucket === "month") {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  }
  throw new Error(`unsupported bucket ${bucket}`);
}

async function runJson(command, args) {
  const { stdout } = await execFileAsync(command, args, { maxBuffer: 1024 * 1024 * 50 });
  return JSON.parse(stdout);
}

async function runText(command, args, cwd) {
  const { stdout } = await execFileAsync(command, args, {
    cwd,
    maxBuffer: 1024 * 1024 * 200
  });
  return stdout;
}

async function tryRunText(command, args, cwd) {
  try {
    return await runText(command, args, cwd);
  } catch (error) {
    return "";
  }
}

async function getLogin() {
  const user = await runJson("gh", ["api", "user"]);
  return user.login;
}

async function getRepositories(login) {
  const query = `
    query($login:String!) {
      user(login:$login) {
        repositoriesContributedTo(
          first: 100
          includeUserRepositories: true
          contributionTypes: [COMMIT]
          orderBy: {field: UPDATED_AT, direction: DESC}
        ) {
          nodes { nameWithOwner }
        }
      }
    }
  `;
  const data = await runJson("gh", ["api", "graphql", "-f", `query=${query}`, "-F", `login=${login}`]);
  return data.data.user.repositoriesContributedTo.nodes.map((node) => node.nameWithOwner);
}

function resolveRepoPaths(repoNames, root) {
  const resolved = [];
  const missing = [];
  for (const nameWithOwner of repoNames) {
    const repoName = nameWithOwner.split("/")[1];
    const candidate = path.join(root, repoName);
    if (fs.existsSync(path.join(candidate, ".git"))) {
      resolved.push([nameWithOwner, candidate]);
    } else {
      missing.push(nameWithOwner);
    }
  }
  return { resolved, missing };
}

function candidateRoots(explicitRoot) {
  if (explicitRoot) return [path.resolve(explicitRoot)];
  const home = os.homedir();
  const values = [
    process.cwd(),
    path.join(home, "Developer"),
    path.join(home, "Code"),
    path.join(home, "Projects"),
    home
  ];
  return [...new Set(values.map((value) => path.resolve(value)))];
}

function resolveRepoPathsFromCandidates(repoNames, explicitRoot) {
  const candidates = candidateRoots(explicitRoot);
  let best = { resolved: [], missing: repoNames, root: candidates[0] };
  for (const root of candidates) {
    const result = resolveRepoPaths(repoNames, root);
    if (result.resolved.length > best.resolved.length) {
      best = { ...result, root };
    }
    if (result.resolved.length === repoNames.length) return { ...result, root };
  }
  return best;
}

async function autodetectAuthorIdentities(repoPaths, login) {
  const pairs = new Map();
  const loginLower = login.toLowerCase();
  await Promise.all(
    repoPaths.map(async ([, repoPath]) => {
      const output = await runText(
        "git",
        [
          "log",
          "--all",
          "--extended-regexp",
          "--regexp-ignore-case",
          `--author=${login}`,
          "--format=%ae%x09%an"
        ],
        repoPath
      );
      for (const line of output.split("\n")) {
        if (!line.trim()) continue;
        const [email, name] = line.split("\t");
        if (name.trim().toLowerCase() === loginLower || email.toLowerCase().includes(loginLower)) {
          pairs.set(`${email}\t${name}`, { email: email.trim(), name: name.trim() });
        }
      }
    })
  );
  const emails = [...new Set([...pairs.values()].map((item) => item.email))].sort();
  const names = [...new Set([...pairs.values()].map((item) => item.name))].sort();
  return { emails, names };
}

async function gitConfigIdentity() {
  const email = (await tryRunText("git", ["config", "--global", "user.email"])).trim();
  const name = (await tryRunText("git", ["config", "--global", "user.name"])).trim();
  return {
    emails: email ? [email] : [],
    names: name ? [name] : []
  };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function authorPattern(authorEmails, authorNames) {
  return [...authorEmails, ...authorNames].filter(Boolean).map(escapeRegex).join("|");
}

async function collectRepoCommits(repoPath, startDate, endDate, pattern) {
  return runText(
    "git",
    [
      "log",
      "--all",
      "--extended-regexp",
      "--regexp-ignore-case",
      `--author=${pattern}`,
      "--since",
      `${dateIso(startDate)} 00:00:00`,
      "--until",
      `${dateIso(endDate)} 23:59:59`,
      "--format=COMMIT%x09%H%x09%cs%x09%ae%x09%an",
      "--numstat"
    ],
    repoPath
  );
}

async function aggregate(repoPaths, startDate, endDate, bucket, authorEmails, authorNames) {
  const pattern = authorPattern(authorEmails, authorNames);
  if (!pattern) throw new Error("no author pattern available");

  const outputs = await Promise.all(
    repoPaths.map(([, repoPath]) => collectRepoCommits(repoPath, startDate, endDate, pattern))
  );

  const bucketTotals = new Map();
  const rawDaily = new Map();
  const seen = new Set();

  for (const output of outputs) {
    let current = null;
    let runningLines = 0;

    for (const line of output.split("\n")) {
      if (line.startsWith("COMMIT\t")) {
        if (current && !seen.has(current.sha)) {
          seen.add(current.sha);
          rawDaily.set(current.date, (rawDaily.get(current.date) || 0) + runningLines);
          bucketTotals.set(current.bucket, (bucketTotals.get(current.bucket) || 0) + runningLines);
        }
        const [, sha, dateStr] = line.split("\t", 5);
        const commitDate = parseDate(dateStr);
        current = {
          sha,
          date: dateStr,
          bucket: dateIso(bucketStart(commitDate, bucket))
        };
        runningLines = 0;
        continue;
      }

      if (!line.trim() || !current) continue;
      const parts = line.split("\t");
      if (parts.length !== 3) continue;
      const [added, deleted] = parts;
      if (added !== "-") runningLines += Number(added);
      if (deleted !== "-") runningLines += Number(deleted);
    }

    if (current && !seen.has(current.sha)) {
      seen.add(current.sha);
      rawDaily.set(current.date, (rawDaily.get(current.date) || 0) + runningLines);
      bucketTotals.set(current.bucket, (bucketTotals.get(current.bucket) || 0) + runningLines);
    }
  }

  const ordered = new Map();
  let cursor = bucketStart(startDate, bucket);
  const last = bucketStart(endDate, bucket);
  while (cursor <= last) {
    const key = dateIso(cursor);
    ordered.set(key, bucketTotals.get(key) || 0);
    if (bucket === "day") cursor = addDays(cursor, 1);
    else if (bucket === "week") cursor = addDays(cursor, 7);
    else cursor = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1));
  }

  return {
    series: Object.fromEntries(ordered),
    rawDaily: Object.fromEntries([...rawDaily.entries()].sort(([a], [b]) => a.localeCompare(b)))
  };
}

function createCanvas(width, height, color) {
  const pixels = new Uint8Array(width * height * 3);
  for (let i = 0; i < width * height; i += 1) {
    pixels[i * 3] = color[0];
    pixels[i * 3 + 1] = color[1];
    pixels[i * 3 + 2] = color[2];
  }
  return { width, height, pixels };
}

function setPx(canvas, x, y, color) {
  if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;
  const idx = (y * canvas.width + x) * 3;
  canvas.pixels[idx] = color[0];
  canvas.pixels[idx + 1] = color[1];
  canvas.pixels[idx + 2] = color[2];
}

function fillRect(canvas, x1, y1, x2, y2, color) {
  const startX = Math.max(0, Math.min(canvas.width, x1));
  const endX = Math.max(0, Math.min(canvas.width, x2));
  const startY = Math.max(0, Math.min(canvas.height, y1));
  const endY = Math.max(0, Math.min(canvas.height, y2));
  for (let y = startY; y < endY; y += 1) {
    for (let x = startX; x < endX; x += 1) setPx(canvas, x, y, color);
  }
}

function drawLine(canvas, x0, y0, x1, y1, color, thickness = 1) {
  let cx = x0;
  let cy = y0;
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  while (true) {
    for (let ox = -Math.floor(thickness / 2); ox <= Math.floor(thickness / 2); ox += 1) {
      for (let oy = -Math.floor(thickness / 2); oy <= Math.floor(thickness / 2); oy += 1) {
        setPx(canvas, cx + ox, cy + oy, color);
      }
    }
    if (cx === x1 && cy === y1) break;
    const e2 = err * 2;
    if (e2 > -dy) {
      err -= dy;
      cx += sx;
    }
    if (e2 < dx) {
      err += dx;
      cy += sy;
    }
  }
}

function drawPolyFill(canvas, points, baseline, color) {
  const polygon = [...points, [points[points.length - 1][0], baseline], [points[0][0], baseline]];
  const minY = Math.max(0, Math.min(...polygon.map(([, y]) => y)));
  const maxY = Math.min(canvas.height - 1, Math.max(...polygon.map(([, y]) => y)));
  for (let y = minY; y <= maxY; y += 1) {
    const intersections = [];
    for (let i = 0; i < polygon.length; i += 1) {
      const [x1, y1] = polygon[i];
      const [x2, y2] = polygon[(i + 1) % polygon.length];
      if (y1 === y2) continue;
      if (Math.min(y1, y2) <= y && y < Math.max(y1, y2)) {
        const ratio = (y - y1) / (y2 - y1);
        intersections.push(Math.round(x1 + ratio * (x2 - x1)));
      }
    }
    intersections.sort((a, b) => a - b);
    for (let i = 0; i < intersections.length; i += 2) {
      if (i + 1 >= intersections.length) break;
      fillRect(canvas, intersections[i], y, intersections[i + 1] + 1, y + 1, color);
    }
  }
}

function drawChar(canvas, x, y, ch, color, scale = 2) {
  const pattern = FONT[ch] || FONT[" "];
  for (let row = 0; row < pattern.length; row += 1) {
    for (let col = 0; col < pattern[row].length; col += 1) {
      if (pattern[row][col] === "1") {
        fillRect(canvas, x + col * scale, y + row * scale, x + (col + 1) * scale, y + (row + 1) * scale, color);
      }
    }
  }
  return (pattern[0].length + 1) * scale;
}

function drawText(canvas, x, y, text, color, scale = 2) {
  let cursor = x;
  for (const ch of text) cursor += drawChar(canvas, cursor, y, ch, color, scale);
}

function textWidth(text, scale = 2) {
  let width = 0;
  for (const ch of text) {
    const pattern = FONT[ch] || FONT[" "];
    width += (pattern[0].length + 1) * scale;
  }
  return width;
}

function crcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    table[n] = c >>> 0;
  }
  return table;
}

const CRC_TABLE = crcTable();

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(tag, data) {
  const tagBuffer = Buffer.from(tag, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([tagBuffer, data])), 0);
  return Buffer.concat([length, tagBuffer, data, crc]);
}

function savePng(canvas, filePath) {
  const raw = Buffer.alloc((canvas.width * 3 + 1) * canvas.height);
  for (let y = 0; y < canvas.height; y += 1) {
    const rowStart = y * (canvas.width * 3 + 1);
    raw[rowStart] = 0;
    raw.set(canvas.pixels.subarray(y * canvas.width * 3, (y + 1) * canvas.width * 3), rowStart + 1);
  }
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(canvas.width, 0);
  ihdr.writeUInt32BE(canvas.height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const png = Buffer.concat([
    signature,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0))
  ]);
  fs.writeFileSync(filePath, png);
}

function niceUpperBound(maxValue) {
  if (maxValue <= 10) return 10;
  const power = 10 ** Math.floor(Math.log10(maxValue));
  for (const factor of [1, 2, 5, 10]) {
    const bound = factor * power;
    if (maxValue <= bound) return bound;
  }
  return 10 * power;
}

function formatCompact(value) {
  if (value >= 1000) {
    const text = (value / 1000).toFixed(1).replace(/\.0$/, "");
    return `${text}K`;
  }
  return String(value);
}

function formatGrouped(value) {
  return new Intl.NumberFormat("de-AT").format(value);
}

function xLabel(date, bucket) {
  const month = MONTHS[date.getUTCMonth() + 1];
  if (bucket === "day" || bucket === "month") return `${month} ${String(date.getUTCFullYear()).slice(2)}`;
  return `${month} ${date.getUTCDate()}`;
}

function renderChart(series, login, startDate, endDate, bucket, outputPath) {
  const dates = Object.keys(series).sort();
  const values = dates.map((date) => series[date]);
  const width = 1800;
  const height = 980;
  const left = 130;
  const right = 40;
  const top = 160;
  const bottom = 130;
  const plotLeft = left;
  const plotRight = width - right;
  const plotTop = top;
  const plotBottom = height - bottom;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;
  const maxValue = values.length ? Math.max(...values) : 0;
  const upper = niceUpperBound(Math.max(maxValue, 10));

  const canvas = createCanvas(width, height, BG);
  fillRect(canvas, plotLeft, plotTop, plotRight, plotBottom, PLOT_BG);

  for (let idx = 0; idx < 6; idx += 1) {
    const value = Math.round((upper * idx) / 5);
    const y = plotBottom - Math.floor((plotHeight * idx) / 5);
    drawLine(canvas, plotLeft, y, plotRight, y, GRID);
    drawText(canvas, 18, y - 10, formatCompact(value), AXIS, 3);
  }

  drawLine(canvas, plotLeft, plotBottom, plotRight, plotBottom, AXIS, 2);
  drawLine(canvas, plotLeft, plotTop, plotLeft, plotBottom, AXIS, 2);

  const points = values.map((value, idx) => {
    const x = plotLeft + Math.floor((idx * plotWidth) / Math.max(1, values.length - 1));
    const y = plotBottom - Math.floor((value / upper) * plotHeight);
    return [x, y];
  });
  if (points.length) {
    drawPolyFill(canvas, points, plotBottom, FILL);
    for (let i = 0; i < points.length - 1; i += 1) {
      drawLine(canvas, points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], LINE, 3);
    }
  }

  const tickCount = Math.min(8, dates.length);
  const step = Math.max(1, Math.floor(dates.length / Math.max(1, tickCount - 1)));
  const tickIndexes = [];
  for (let i = 0; i < dates.length; i += step) tickIndexes.push(i);
  if (tickIndexes[tickIndexes.length - 1] !== dates.length - 1) tickIndexes.push(dates.length - 1);

  let drawnUntil = -1;
  for (const idx of tickIndexes) {
    const x = plotLeft + Math.floor((idx * plotWidth) / Math.max(1, values.length - 1));
    const label = xLabel(parseDate(dates[idx]), bucket);
    const widthPx = textWidth(label, 2);
    const labelX = Math.max(plotLeft, Math.min(x - Math.floor(widthPx / 2), plotRight - widthPx));
    if (labelX <= drawnUntil + 12) continue;
    drawLine(canvas, x, plotBottom, x, plotBottom + 8, AXIS);
    drawText(canvas, labelX, plotBottom + 20, label, AXIS, 2);
    drawnUntil = labelX + widthPx;
  }

  drawText(canvas, 24, 24, `${login} lines per ${bucket}`, TEXT, 5);
  drawText(canvas, 24, 74, `${dateIso(startDate)} to ${dateIso(endDate)}`, AXIS, 3);
  drawText(
    canvas,
    24,
    104,
    `Total: ${formatGrouped(values.reduce((sum, value) => sum + value, 0))} Peak: ${formatGrouped(maxValue)}`,
    AXIS,
    3
  );

  savePng(canvas, outputPath);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { startDate, endDate } = computeDates(args);
  const output = path.resolve(args.output);
  const jsonOutput = path.resolve(args.jsonOutput);

  const login = await getLogin();
  const repoNames = await getRepositories(login);
  const { resolved: repoPaths, missing, root } = resolveRepoPathsFromCandidates(repoNames, args.root);

  if (!repoPaths.length) {
    throw new Error(
      `could not find any locally cloned contributed repos under ${root}; pass --root to the directory that contains your repo clones`
    );
  }

  let authorEmails = [...new Set(args.authorEmail)];
  let authorNames = [...new Set(args.authorName)];

  if (!authorEmails.length && !authorNames.length) {
    const detected = await autodetectAuthorIdentities(repoPaths, login);
    authorEmails = detected.emails;
    authorNames = detected.names;
  }

  if (!authorEmails.length && !authorNames.length) {
    const detected = await gitConfigIdentity();
    authorEmails = detected.emails;
    authorNames = [...new Set([login, ...detected.names])];
  }

  if (!authorEmails.length && !authorNames.length) {
    throw new Error("could not auto-detect your author identity; pass --author-email or --author-name");
  }

  const { series, rawDaily } = await aggregate(
    repoPaths,
    startDate,
    endDate,
    args.bucket,
    authorEmails,
    authorNames
  );

  renderChart(series, login, startDate, endDate, args.bucket, output);

  const values = Object.values(series);
  fs.writeFileSync(
    jsonOutput,
    JSON.stringify(
      {
        login,
        from: dateIso(startDate),
        to: dateIso(endDate),
        bucket: args.bucket,
        author_emails: authorEmails,
        author_names: authorNames,
        root_used: root,
        local_repositories_used: repoPaths.map(([name]) => name),
        missing_repositories: missing,
        total_lines_changed: values.reduce((sum, value) => sum + value, 0),
        peak_lines_changed: values.length ? Math.max(...values) : 0,
        bucketed_lines_changed: series,
        daily_lines_changed: rawDaily
      },
      null,
      2
    )
  );

  process.stdout.write(`${output}\n${jsonOutput}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
