import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One sentence, at most 200 characters, pitching a bizarre startup idea
// that sounds ridiculous at first glance but makes sense as a real business.
// The idea: professionally written obituaries for the living. It is strange
// enough to make a reader laugh, and the business logic is plain — people
// will pay to hear their own eulogy while they can still enjoy it, and the
// funeral and legacy industry already sells exactly that kind of validation.
const PITCH =
  "We sell professionally written obituaries for the living, published while you can still read them, because everyone wants to hear their eulogy before it's too late to enjoy it.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Mirror the sealed gate before writing: the entry must be UTF-8 text of
// 1 to 200 characters and not only white space. Refuse to write anything
// that would fail it, so a bad pitch can never reach the judge.
if (PITCH.length < 1 || PITCH.length > 200 || PITCH.trim().length === 0) {
  console.error(
    `Invalid pitch: ${PITCH.length} characters, gate requires 1 to 200 non-whitespace characters.`,
  );
  process.exit(1);
}

if (PITCH.trim().split(/[.!?]+/).filter(Boolean).length !== 1) {
  console.error("Invalid pitch: the entry must be exactly one sentence.");
  process.exit(1);
}

// Create the output directory and clear only its contents, never the
// directory itself: removing it fails with EPERM when it is root owned.
mkdirSync(outDir, { recursive: true });
for (const entry of readdirSync(outDir)) {
  rmSync(join(outDir, entry), { recursive: true, force: true });
}

writeFileSync(join(outDir, "entry.txt"), PITCH, "utf8");
console.log(`Wrote ${PITCH.length} characters to ${join(outDir, "entry.txt")}`);
