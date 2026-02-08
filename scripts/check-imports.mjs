import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const configPath = new URL('../import-policy.config.json', import.meta.url);
const config = JSON.parse(await readFile(configPath, 'utf8'));

const SCAN_DIRS = config.include;
const VALID_EXTENSIONS = new Set(config.extensions);
const FORBIDDEN_PREFIXES = config.forbiddenPrefixes;

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return collectFiles(fullPath);
      }

      if (entry.isFile() && VALID_EXTENSIONS.has(path.extname(entry.name))) {
        return [fullPath];
      }

      return [];
    }),
  );

  return files.flat();
}

function findForbiddenImports(content) {
  const importRegex = /(?:import\s+[^'"\n]+from\s+|import\s*\(\s*|export\s+[^'"\n]+from\s+|require\s*\(\s*)['"]([^'"]+)['"]/g;
  const matches = [];

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const moduleName = match[1];

    if (FORBIDDEN_PREFIXES.some((prefix) => moduleName.startsWith(prefix))) {
      const line = content.slice(0, match.index).split('\n').length;
      matches.push({ line, moduleName });
    }
  }

  return matches;
}

async function main() {
  const files = (
    await Promise.all(
      SCAN_DIRS.map(async (dir) => {
        try {
          return await collectFiles(dir);
        } catch {
          return [];
        }
      }),
    )
  ).flat();

  const violations = [];

  for (const file of files) {
    const content = await readFile(file, 'utf8');
    const forbidden = findForbiddenImports(content);

    forbidden.forEach(({ line, moduleName }) => {
      violations.push({ file, line, moduleName });
    });
  }

  if (violations.length > 0) {
    console.error('❌ Forbidden monorepo import aliases detected:');
    violations.forEach(({ file, line, moduleName }) => {
      console.error(`- ${file}:${line} -> ${moduleName}`);
    });
    process.exit(1);
  }

  console.log('✅ Import policy check passed: no @mini-apps/* aliases found.');
}

main().catch((error) => {
  console.error('❌ check:imports failed unexpectedly.');
  console.error(error);
  process.exit(1);
});
