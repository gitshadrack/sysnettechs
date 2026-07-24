import { cpSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const standalone = join(root, ".next", "standalone");

cpSync(join(root, "public"), join(standalone, "public"), {
  recursive: true,
  force: true,
});

const staticTarget = join(standalone, ".next", "static");
mkdirSync(staticTarget, { recursive: true });
cpSync(join(root, ".next", "static"), staticTarget, {
  recursive: true,
  force: true,
});
