import { cp, mkdir, rm, writeFile } from "node:fs/promises";
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

  await writeFile(
    path.join(functionsDir, ".vc-config.json"),
    JSON.stringify(
      {
        runtime: "nodejs22.x",
        handler: "server.js",
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