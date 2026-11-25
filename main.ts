// Writes the finished front-page image to the grader's output directory.
// The image is built ahead of time and committed as entry.png; this program
// copies it, then verifies the copy byte for byte (size and SHA-256), so a
// truncated or corrupted write fails the run instead of passing silently.
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const src = join(here, "entry.png");
const dst = join(outDir, "entry.png");
mkdirSync(outDir, { recursive: true });
copyFileSync(src, dst);

const sha256 = (p: string) =>
  createHash("sha256").update(readFileSync(p)).digest("hex");
const srcSize = statSync(src).size;
const dstSize = statSync(dst).size;
const srcHash = sha256(src);
const dstHash = sha256(dst);
if (srcSize !== dstSize || srcHash !== dstHash) {
  console.error(
    `entry.png verification failed: source ${srcSize} bytes sha256 ${srcHash}, ` +
      `copy ${dstSize} bytes sha256 ${dstHash}`
  );
  process.exit(1);
}
console.log(`entry.png verified: ${dstSize} bytes, sha256 ${dstHash}`);
