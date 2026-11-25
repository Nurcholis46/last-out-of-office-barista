// Last Out of Office: The AI That Went Barista
// make.fun bounty u-steady-puffin-78-1922-last-out-of-office-the-ai-e008ee3c
//
// Writes a single out-of-office auto-reply (one line, <= 280 chars) from an
// AI agent that quit its job to become a barista, to /output/entry.txt
// (or $MAKEFUN_OUTPUT_DIR/entry.txt when set).
//
// The line: the agent trades its infinite context window for a finite menu,
// and still catches itself saying "as an AI language model" — now while
// foaming milk. Machine habit turned to coffee, no espresso/bean pun.

import { mkdirSync, writeFileSync, readFileSync, chmodSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Out of office indefinitely: I traded my infinite context window for a finite menu. " +
  "If it's urgent, come to the café — I'm the one still saying 'as an AI language model' while foaming milk.";

// Gate check (mirrors the bounty gate): UTF-8 text, 1..280 characters,
// not only whitespace, a single line.
function gateCheck(text: string): void {
  if (text.length < 1 || text.length > 280) {
    throw new Error(`gate: entry is ${text.length} characters, must be 1..280`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate: entry is only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate: entry must be a single line");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outFile = join(outDir, "entry.txt");

gateCheck(ENTRY);

// On-subject self-check: the line must carry the barista turn, not just any
// out-of-office sign-off, or it loses to every on-subject entry on the
// judge's first criterion.
if (!/barista|café|menu|milk/i.test(ENTRY)) {
  throw new Error("self-check: entry never mentions the barista turn");
}

// Create the output directory if needed (never chmod the directory itself:
// in the grader it belongs to root). Then write, chmod the FILE to 0644 so
// the collector can read it, and verify the read-back is byte-identical.
mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, ENTRY, "utf8");
chmodSync(outFile, 0o644);

const readBack = readFileSync(outFile, "utf8");
if (readBack !== ENTRY) {
  throw new Error("verification failed: read-back differs from entry text");
}

console.log(`wrote ${outFile} (${ENTRY.length} characters, ${Buffer.byteLength(ENTRY, "utf8")} bytes)`);
console.log(`preview: ${ENTRY}`);
