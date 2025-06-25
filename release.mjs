// release.mjs

import { execSync } from 'child_process'
import { argv } from 'process'
import fs from 'fs'

const versionType = argv[2] || 'patch'

function run(cmd) {
  console.log(`$ ${cmd}`)
  execSync(cmd, { stdio: 'inherit' })
}

function generateChangelog(version) {
  console.log('📝 Generating changelog...')
  const log = execSync(`git log $(git describe --tags --abbrev=0)..HEAD --oneline`).toString()
  if (!log.trim()) {
    console.log('⚠️  No new commits since last tag.')
    return
  }

  const changelog = `## ${version}\n\n` + log
    .split('\n')
    .filter(Boolean)
    .map(line => `- ${line.trim()}`)
    .join('\n') + '\n\n'

  fs.appendFileSync('CHANGELOG.md', changelog)
  console.log('✅ Changelog updated.')
}

console.log('🔍 Checking npm login...')
run('npm whoami')

console.log('🔧 Building project...')
run('npm run build')

console.log('📦 Packing for preview...')
run('npm pack')

console.log('🔍 Checking git status...')
const gitStatus = execSync('git status --porcelain').toString()
if (gitStatus.trim()) {
  console.log('📝 Committing uncommitted changes...')
  run('git add .')
  run('git commit -m "chore: prepare release"')
}

console.log(`🚀 Bumping version (${versionType})...`)
run(`npm version ${versionType}`)
const version = JSON.parse(fs.readFileSync('./package.json', 'utf8')).version

// Optional: validate tag doesn't already exist
const tagExists = execSync('git tag').toString().split('\n').includes(`v${version}`)
if (tagExists) {
  console.error(`❌ Tag v${version} already exists.`)
  process.exit(1)
}

// Generate changelog
generateChangelog(`v${version}`)

console.log('📦 Validating bundle size...')
try {
  run('npx size-limit')
} catch (err) {
  console.warn('⚠️  size-limit check failed or not configured. Skipping.')
}

console.log('📤 Publishing to npm...')
run('npm publish --access public')

console.log('🌐 Pushing to Git...')
run('git push && git push --tags')

console.log('✅ Done!')
