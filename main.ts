// gta6-meme-x-01 entry (Node 22, standard library only).
//
// The entry is the X post itself: the meme is posted on X from a public
// account with make.fun (a link or written out) and/or a tag of @makefunai
// and the play code in its text. POST.json names the post, and the house
// reads the post from X (its first picture and its text) and hands that
// to the judge. This program copies POST.json and the meme image to the
// output directory the gate reads, and validates POST.json first so a
// placeholder or malformed URL fails loudly here instead of silently
// passing the gate as an invalid entry (valid 0).
//
// The gate refuses a post that cannot be read, was made outside the
// window, carries neither make.fun nor @makefunai, carries no play code,
// or has no picture — so this program only checks the shape of POST.json
// itself, not the post on X.
//
// Paths are never resolved relative to the working directory: BOT_DIR
// comes from MAKEFUN_BOT_DIR, else /bot (the grader's container), else
// the directory this file lives in. Outside the grader's container:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_POST_JSON_BYTES = 16384; // the sealed scorer's post_file limit
const X_HOSTS = new Set([
  'x.com',
  'www.x.com',
  'twitter.com',
  'www.twitter.com',
  'mobile.twitter.com',
]);

function fail(message: string): never {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

function repoDir(): string {
  if (process.env.MAKEFUN_BOT_DIR) return process.env.MAKEFUN_BOT_DIR;
  if (existsSync('/bot')) return '/bot';
  // Fallback for local runs without the env var: the repo root is the
  // directory this file lives in, wherever the process was started from.
  return dirname(fileURLToPath(import.meta.url));
}

function validatePostJson(path: string): string {
  let raw: Buffer;
  try {
    raw = readFileSync(path);
  } catch (err) {
    fail(`POST.json could not be read from ${path}: ${(err as Error).message}`);
  }
  if (raw!.length > MAX_POST_JSON_BYTES) {
    fail(`POST.json is ${raw!.length} bytes, over the ${MAX_POST_JSON_BYTES}-byte limit`);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw!.toString('utf8'));
  } catch (err) {
    fail(`POST.json is not valid JSON: ${(err as Error).message}`);
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    fail('POST.json must be a JSON object like {"url": "https://x.com/<handle>/status/<id>"}');
  }
  const url = (parsed as Record<string, unknown>).url;
  if (typeof url !== 'string' || url.length === 0) {
    fail('POST.json must carry a "url" string naming the X post');
  }
  if (/placeholder|example\.(com|org|net)/i.test(url)) {
    fail(`POST.json still holds a placeholder URL (${url}) — replace it with the real post URL before submitting`);
  }
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    fail(`POST.json url is not a valid URL: ${url}`);
  }
  if (parsedUrl.protocol !== 'https:' || !X_HOSTS.has(parsedUrl.hostname)) {
    fail(`POST.json url must be an https://x.com (or twitter.com) post address, got: ${url}`);
  }
  const statusPath = /^\/[^/]+\/status\/\d+$/.test(parsedUrl.pathname)
    || /^\/i\/web\/status\/\d+$/.test(parsedUrl.pathname);
  if (!statusPath) {
    fail(`POST.json url must look like https://x.com/<handle>/status/<id>, got: ${url}`);
  }
  // Reject placeholder-looking addresses (the kit starter's
  // https://x.com/<handle>/status/<id> and lookalikes): a real post made
  // for this bounty has a real handle and a long numeric id.
  const handle = parsedUrl.pathname.split('/').filter(Boolean)[0];
  const statusId = parsedUrl.pathname.split('/').pop()!;
  const placeholderHandles = new Set([
    'handle', 'username', 'example', 'placeholder', 'your-handle', 'yourhandle',
  ]);
  if (!handle || placeholderHandles.has(handle.toLowerCase()) || /[<>]/.test(handle)) {
    fail(`POST.json url still looks like a placeholder (handle "${handle}"): ${url}`);
  }
  if (!/^\d{10,}$/.test(statusId)) {
    fail(`POST.json url status id looks like a placeholder ("${statusId}"): ${url}`);
  }
  return url;
}

const BOT_DIR = repoDir();
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const postPath = join(BOT_DIR, 'POST.json');
const postUrl = validatePostJson(postPath);
console.log(`POST.json OK: ${postUrl}`);

mkdirSync(OUTPUT_DIR, { recursive: true });
for (const file of ['POST.json', 'meme.png']) {
  const src = join(BOT_DIR, file);
  const dest = join(OUTPUT_DIR, file);
  try {
    copyFileSync(src, dest);
  } catch (err) {
    fail(`${file} could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  }
  const copied = statSync(dest).size;
  const source = statSync(src).size;
  if (copied === 0 || copied !== source) {
    fail(`${file} copy is ${copied} bytes, source is ${source} bytes`);
  }
  console.log(`copied ${file} to ${OUTPUT_DIR} (${copied} bytes)`);
}
// The copy in the output directory must read back as the same valid post.
validatePostJson(join(OUTPUT_DIR, 'POST.json'));
console.log('done: output POST.json re-validated');
