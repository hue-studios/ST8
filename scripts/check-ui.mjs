#!/usr/bin/env node
// Fails if app/components/ui differs from what the shadcn-vue CLI generates.
//
//   pnpm check:ui            compare (CI runs this)
//   pnpm check:ui --keep     also print the temp project path and leave it on disk
//
// app/components/ui is generated code and is never edited by hand (see CLAUDE.md). This script regenerates every
// component found there into a throwaway project that uses the same components.json and the pinned shadcn-vue CLI
// (package.json devDependencies), then compares the two trees file by file.
//
// To add a component: pnpm exec shadcn-vue add <name>. To pick up upstream registry changes: pnpm exec shadcn-vue add
// <every component> --overwrite, review the diff, commit. Never hand-edit the output to make this check pass.

import { spawnSync } from 'node:child_process'
import { cpSync, mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const UI = join(ROOT, 'app/components/ui')
const keep = process.argv.includes('--keep')

const components = readdirSync(UI).filter((name) => statSync(join(UI, name)).isDirectory()).sort()
if (!components.length) {
  console.log('check:ui: app/components/ui is empty, nothing to compare.')
  process.exit(0)
}

// A minimal Nuxt 4 project: enough for the CLI's framework, Tailwind v4 and alias detection, and nothing to install
// besides the components' own dependencies.
const tmp = mkdtempSync(join(tmpdir(), 'st8-ui-check-'))
writeFileSync(join(tmp, 'package.json'), JSON.stringify({ name: 'st8-ui-check', private: true, type: 'module' }, null, 2))
writeFileSync(join(tmp, 'nuxt.config.ts'), 'export default {}\n')
writeFileSync(join(tmp, 'tsconfig.json'), '{}\n')
mkdirSync(join(tmp, '.nuxt'))
writeFileSync(
  join(tmp, '.nuxt/tsconfig.json'), // the CLI finds this one walking up from .nuxt/tsconfig.app.json
  JSON.stringify({ compilerOptions: { paths: { '~': ['../app'], '~/*': ['../app/*'], '@': ['../app'], '@/*': ['../app/*'] } } }, null, 2),
)
cpSync(join(ROOT, 'components.json'), join(tmp, 'components.json'))
mkdirSync(join(tmp, 'app/assets/css'), { recursive: true })
cpSync(join(ROOT, 'app/assets/css/main.css'), join(tmp, 'app/assets/css/main.css'))

console.log(`check:ui: regenerating ${components.length} components: ${components.join(', ')}`)
const cli = join(ROOT, 'node_modules/.bin/shadcn-vue')
const run = spawnSync(cli, ['add', ...components, '--yes', '--overwrite', '--cwd', tmp], {
  cwd: tmp,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, npm_config_user_agent: 'pnpm' },
})
if (run.status !== 0) {
  console.error(run.stdout, run.stderr)
  console.error('check:ui: the shadcn-vue CLI failed (see above).')
  cleanup()
  process.exit(2)
}

const list = (dir) => {
  const out = []
  const walk = (d) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, entry.name)
      if (entry.isDirectory()) walk(p)
      else out.push(relative(dir, p))
    }
  }
  walk(dir)
  return out.sort()
}

const generatedDir = join(tmp, 'app/components/ui')
const ours = new Set(list(UI))
const theirs = new Set(list(generatedDir))
const problems = []
for (const file of ours) {
  if (!theirs.has(file)) problems.push(`  + ${file} (not produced by the CLI)`)
  else if (readFileSync(join(UI, file), 'utf8') !== readFileSync(join(generatedDir, file), 'utf8')) problems.push(`  ~ ${file} (differs from CLI output)`)
}
for (const file of theirs) if (!ours.has(file)) problems.push(`  - ${file} (missing; the CLI generates it)`)

if (problems.length) {
  console.error(`check:ui: app/components/ui does not match the shadcn-vue CLI output:\n${problems.join('\n')}`)
  console.error(`\nCompare with: diff -ru app/components/ui ${generatedDir}   (rerun with --keep to keep that folder)`)
  console.error('Fix: move customizations into app/components/st8/ (or a feature folder) and regenerate with')
  console.error('  pnpm exec shadcn-vue add <component> --overwrite')
  cleanup()
  process.exit(1)
}

console.log(`check:ui: OK, ${ours.size} files match the CLI output.`)
cleanup()

function cleanup() {
  if (keep) console.log(`check:ui: temp project kept at ${tmp}`)
  else rmSync(tmp, { recursive: true, force: true })
}
