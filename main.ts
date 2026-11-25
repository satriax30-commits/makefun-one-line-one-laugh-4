// makefun-one-line-one-laugh-4 — One Line, One Laugh.
// Deterministic, Node 22 stdlib only: no randomness, no wall-clock time,
// no network, no environment secrets. Writes exactly one funny line to
// entry.txt.
//
// The line: you ask a smart speaker for something relaxing, and the punch
// is that "relaxing" gets answered with the one sound nobody relaxes to —
// your bank balance notifications. The turn lands on the last two words
// and is concrete, not abstract. Every word earns its place.
//
// Rejected candidates (drafted, then cut):
// - phone autocorrects "I'm on my way" to "I'm on my way to therapy"
//   (relatable, but the joke explains itself in the second clause).
// - standing desk, now sitting on the floor next to it
//   (reversal is good, punch too gentle — no real surprise).
// - smartwatch congratulates me for standing up; I was reaching for snacks
//   (cute observation, but the "snacks" punch is a stock joke shape).
// - smart fridge texts that we're out of milk; it watches me eat dry cereal
//   (two jokes fighting in one line; the setup is longer than the punch).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Chosen line. 85 characters, one line, no trailing newline.
const LINE =
  "I asked my smart speaker for relaxing music. It played my bank balance notifications.";

// Gate: the entry must be UTF-8 text of 1 to 200 characters, not only
// whitespace, and a single line. Validate before writing so a bad line
// fails loudly here instead of silently at grading time.
const chars = [...LINE];
if (chars.length < 1 || chars.length > 200) {
  console.error(`entry must be 1-200 characters, got ${chars.length}`);
  process.exit(1);
}
if (LINE.trim().length === 0) {
  console.error("entry must not be only white space");
  process.exit(1);
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  console.error("entry must be a single line");
  process.exit(1);
}

// Output directory: first CLI argument, else OUTPUT_DIR / ENTRY_OUTPUT_DIR,
// else /output (the grader's default). This keeps local testing easy
// without changing the graded behaviour.
const outDir =
  process.argv[2] ?? process.env.OUTPUT_DIR ?? process.env.ENTRY_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Self-check: read the file back and confirm it is byte-for-byte the line
// we intended, so a partial write or encoding surprise fails here.
const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  console.error("read-back mismatch: entry.txt does not match the line");
  process.exit(1);
}
console.log(`wrote ${chars.length} characters to ${outPath}`);
