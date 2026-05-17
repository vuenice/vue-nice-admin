#!/usr/bin/env node
/**
 * vuenice-admin CLI
 *
 *   vuenice-admin init [--dir resources/js/admin] [--force]
 *
 * Copies the SPA scaffold from this package into the host project,
 * then prints the next-step snippets for Laravel blade and Adonis edge.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prompts from 'prompts';
import kleur from 'kleur';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// dist/cli.js → ../scaffold
const SCAFFOLD_DIR = path.resolve(__dirname, '..', 'scaffold');

interface InitFlags {
  dir: string;
  force: boolean;
}

function parseArgs(argv: string[]): { cmd: string; flags: InitFlags } {
  const [cmd = 'help', ...rest] = argv;
  const flags: InitFlags = { dir: 'resources/js/admin', force: false };
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === '--dir' || a === '-d') flags.dir = rest[++i] ?? flags.dir;
    else if (a === '--force' || a === '-f') flags.force = true;
  }
  return { cmd, flags };
}

async function main() {
  const { cmd, flags } = parseArgs(process.argv.slice(2));

  switch (cmd) {
    case 'init':
      await init(flags);
      break;
    case 'help':
    case '--help':
    case '-h':
      printHelp();
      break;
    default:
      console.error(kleur.red(`Unknown command: ${cmd}`));
      printHelp();
      process.exit(1);
  }
}

function printHelp() {
  console.log(`
${kleur.bold('vuenice-admin')} — scaffold the VueNice admin SPA into your project

${kleur.bold('Commands:')}
  init                       Copy scaffold into your project
  help                       Show this help

${kleur.bold('Options for init:')}
  --dir <path>               Target directory (default: resources/js/admin)
  --force                    Overwrite existing files

${kleur.bold('Examples:')}
  ${kleur.dim('# Laravel default')}
  npx vuenice-admin init

  ${kleur.dim('# Adonis (same default works — both use resources/js)')}
  npx vuenice-admin init

  ${kleur.dim('# Custom location')}
  npx vuenice-admin init --dir inertia/app/admin
`);
}

async function init(flags: InitFlags) {
  const cwd = process.cwd();
  const target = path.resolve(cwd, flags.dir);

  if (!fs.existsSync(SCAFFOLD_DIR)) {
    console.error(
      kleur.red(
        `Scaffold directory not found at ${SCAFFOLD_DIR}. ` +
          `Try reinstalling @vuenice/admin.`
      )
    );
    process.exit(1);
  }

  console.log(
    `\n${kleur.cyan('•')} VueNice Admin scaffold → ${kleur.bold(
      path.relative(cwd, target) || '.'
    )}\n`
  );

  if (fs.existsSync(target) && !flags.force) {
    const stats = fs.statSync(target);
    const isEmpty = stats.isDirectory() && fs.readdirSync(target).length === 0;
    if (!isEmpty) {
      const { proceed } = await prompts({
        type: 'confirm',
        name: 'proceed',
        message: `Target ${kleur.yellow(
          flags.dir
        )} already exists and is non-empty. Overwrite?`,
        initial: false,
      });
      if (!proceed) {
        console.log(kleur.dim('Aborted.'));
        process.exit(0);
      }
    }
  }

  fs.mkdirSync(target, { recursive: true });
  const copied = copyTree(SCAFFOLD_DIR, target, flags.force);
  console.log(kleur.green(`  ✓ Copied ${copied} files\n`));

  printNextSteps(flags.dir);
}

function copyTree(src: string, dest: string, force: boolean): number {
  let count = 0;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    // The scaffold ships package.json as package.json.tpl so the host's
    // npm doesn't try to install it during `npm install @vuenice/admin`.
    const destName = entry.name === 'package.json.tpl' ? 'package.json' : entry.name;
    const destPath = path.join(dest, destName);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      count += copyTree(srcPath, destPath, force);
    } else {
      if (fs.existsSync(destPath) && !force) {
        console.log(kleur.dim(`  - skip ${path.relative(process.cwd(), destPath)} (exists)`));
        continue;
      }
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }
  return count;
}

function printNextSteps(dir: string) {
  const main = `${dir.replace(/\\/g, '/')}/main.ts`;

  console.log(kleur.bold('Next steps:\n'));

  console.log(kleur.bold('  1. Install scaffold dependencies'));
  console.log(`     ${kleur.cyan('cd')} ${dir} && ${kleur.cyan('npm install')}\n`);

  console.log(kleur.bold('  2. Add the Vite plugin to your host vite.config.{ts,js}'));
  console.log(
    kleur.dim(
      `
     import vuenice from '@vuenice/admin/plugin';
     export default defineConfig({
       plugins: [
         vue(),
         vuenice({
           root: '${dir.replace(/\\/g, '/')}',
           apiProxy: 'http://localhost:8000', // your backend dev URL
         }),
       ],
     });
`
    )
  );

  console.log(kleur.bold('  3. Mount the SPA from a single backend route'));
  console.log(kleur.dim('     Laravel (resources/views/admin.blade.php):'));
  console.log(
    kleur.dim(`
     <!DOCTYPE html>
     <html><head>
       <meta charset="utf-8">
       <meta name="csrf-token" content="{{ csrf_token() }}">
       <title>Admin</title>
       @vite(['${main}'])
     </head><body><div id="vuenice-admin"></div></body></html>
`)
  );
  console.log(kleur.dim('     Adonis (resources/views/admin.edge):'));
  console.log(
    kleur.dim(`
     <!DOCTYPE html>
     <html><head>
       <meta charset="utf-8">
       <meta name="csrf-token" content="{{ csrfToken }}">
       <title>Admin</title>
       @vite(['${main}'])
     </head><body><div id="vuenice-admin"></div></body></html>
`)
  );

  console.log(kleur.bold('  4. Implement the backend contract'));
  console.log(
    `     See ${kleur.cyan('node_modules/@vuenice/admin/docs/BACKEND_CONTRACT.md')}\n`
  );

  console.log(kleur.green('Done. Happy hacking.\n'));
}

main().catch((err) => {
  console.error(kleur.red(String(err?.stack || err)));
  process.exit(1);
});
