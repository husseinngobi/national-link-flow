import { cp, mkdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const clientRoot = path.resolve(scriptDir, "..");
const distDir = path.join(clientRoot, "dist");
const vercelOutputDir = path.join(clientRoot, ".vercel", "output");
const staticDir = path.join(vercelOutputDir, "static");
const functionsDir = path.join(vercelOutputDir, "functions", "index.func");

async function main() {
  const npmCli = process.env.npm_execpath;
  if (!npmCli) {
    throw new Error("npm_execpath is not available");
  }

  execFileSync(process.execPath, [npmCli, "run", "build"], {
    cwd: clientRoot,
    stdio: "inherit",
  });

  await rm(vercelOutputDir, { recursive: true, force: true });
  await mkdir(staticDir, { recursive: true });
  await mkdir(functionsDir, { recursive: true });

  await cp(path.join(distDir, "client"), staticDir, { recursive: true });
  await cp(path.join(distDir, "server"), functionsDir, { recursive: true });

  // Vercel should load the function entry as an ES module.
  // Rename the emitted bundle from server.js to server.mjs so Node uses the ESM loader.
  await rename(path.join(functionsDir, "server.js"), path.join(functionsDir, "server.mjs"));

  await writeFile(
    path.join(functionsDir, ".vc-config.json"),
    JSON.stringify(
      {
        // Vercel currently supports nodejs18.x and nodejs20.x runtimes.
        // Use nodejs20.x to ensure compatibility with Vercel's runtime.
        runtime: "nodejs20.x",
        handler: "server.mjs",
        launcherType: "Nodejs",
        supportsResponseStreaming: true,
      },
      null,
      2,
    ),
  );

  await writeFile(
    path.join(vercelOutputDir, "config.json"),
    JSON.stringify(
      {
        version: 3,
        routes: [
          { handle: "filesystem" },
          { src: "/(.*)", dest: "/index" },
        ],
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});