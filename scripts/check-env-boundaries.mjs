import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const configPath = path.join(ROOT, 'config', 'env-boundaries.json');

const loadConfig = async () => {
  const raw = await readFile(configPath, 'utf8');
  return JSON.parse(raw);
};

const walkFiles = async (dir, matcher, acc = []) => {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkFiles(fullPath, matcher, acc);
      continue;
    }

    if (matcher(fullPath)) {
      acc.push(fullPath);
    }
  }
  return acc;
};

const toRel = (p) => path.relative(ROOT, p).replaceAll('\\\\', '/');

const clientFileMatcher = (filePath) => /\.(tsx?|jsx?)$/.test(filePath);
const serverFileMatcher = (filePath) => /\.ts$/.test(filePath);

const collectImportMetaVars = (code) => {
  const vars = new Set();
  for (const match of code.matchAll(/import\.meta\.env\.([A-Z0-9_]+)/g)) {
    vars.add(match[1]);
  }
  return [...vars];
};

const collectProcessEnvVars = (code) => {
  const vars = new Set();
  for (const match of code.matchAll(/process\.env\.([A-Z0-9_]+)/g)) {
    vars.add(match[1]);
  }
  return [...vars];
};

const main = async () => {
  const errors = [];
  const config = await loadConfig();

  const clientRoot = path.join(ROOT, config.client.sourceDir);
  const clientFiles = await walkFiles(clientRoot, clientFileMatcher);
  const forbiddenRegexes = config.client.forbiddenPatterns.map((p) => new RegExp(p, 'g'));

  for (const filePath of clientFiles) {
    const code = await readFile(filePath, 'utf8');
    const relPath = toRel(filePath);

    for (const regex of forbiddenRegexes) {
      regex.lastIndex = 0;
      if (regex.test(code)) {
        errors.push(`[client] ${relPath} matched forbidden pattern: ${regex.source}`);
      }
    }

    const envVars = collectImportMetaVars(code);
    for (const envVar of envVars) {
      const isBuiltIn = config.client.allowedBuiltInEnv.includes(envVar);
      const hasAllowedPrefix = config.client.allowedEnvPrefixes.some((prefix) =>
        envVar.startsWith(prefix)
      );

      if (!isBuiltIn && !hasAllowedPrefix) {
        errors.push(
          `[client] ${relPath} references disallowed env var import.meta.env.${envVar}. Only ${config.client.allowedEnvPrefixes.join(', ')}* are allowed in client source.`
        );
      }
    }
  }

  const serverRoot = path.join(ROOT, config.server.functionsDir);
  const serverFiles = await walkFiles(serverRoot, serverFileMatcher);
  const declaredByFunction = config.server.requiredEnvByFunction;

  for (const filePath of serverFiles) {
    const relPath = toRel(filePath);
    const declaredVars = declaredByFunction[relPath];
    if (!declaredVars || declaredVars.length === 0) {
      errors.push(`[server] ${relPath} has no required env declaration in config/env-boundaries.json`);
      continue;
    }

    const code = await readFile(filePath, 'utf8');
    const usedVars = collectProcessEnvVars(code);

    for (const envVar of declaredVars) {
      if (!usedVars.includes(envVar)) {
        errors.push(`[server] ${relPath} declares ${envVar} but does not read process.env.${envVar}`);
      }
    }

    for (const envVar of usedVars) {
      if (!declaredVars.includes(envVar)) {
        errors.push(`[server] ${relPath} reads process.env.${envVar} but it is not declared in config/env-boundaries.json`);
      }
    }
  }

  for (const relPath of Object.keys(declaredByFunction)) {
    const fullPath = path.join(ROOT, relPath);
    const existsInCodebase = serverFiles.some((f) => toRel(f) === relPath);
    if (!existsInCodebase) {
      errors.push(`[server] Declaration exists for missing function file: ${relPath}`);
    }
  }

  if (errors.length > 0) {
    console.error('❌ Env boundary checks failed:\n');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log('✅ Env boundary checks passed.');
};

main().catch((err) => {
  console.error('❌ Env boundary checker crashed:', err);
  process.exit(1);
});
