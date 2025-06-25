// release.mjs

import { execSync } from 'child_process'
import { argv } from 'process'
import fs from 'fs'

const versionArg = argv[2] || 'patch'
const isManualVersion = /^\d+\.\d+\.\d+$/.test(versionArg)
const versionType = isManualVersion ? versionArg : versionArg || 'patch'

function run(cmd) {
  console.log(`$ ${cmd}`)
  execSync(cmd, { stdio: 'inherit' })
}

function tagAlreadyExists(tag) {
  const tags = execSync('git tag').toString().split('\n').map(t => t.trim())
  return tags.includes(tag)
}

function generateChangelog(version) {
  console.log('📝 Generating changelog...')
  let lastTag = ''

  try {
    lastTag = execSync('git describe --tags --abbrev=0').toString().trim()
  } catch {
    console.warn('⚠️  No previous tag found. Generating full log.')
  }

  let log = ''
  try {
    log = execSync(`git log ${lastTag ? `${lastTag}..HEAD` : ''} --oneline`).toString()
  } catch {
    console.warn('⚠️  Failed to get git log.')
    return
  }

  if (!log.trim()) {
    console.log('⚠️  No new commits.')
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

// --- Main ---

console.log('🔍 Checking npm login...')
run('npm whoami')

console.log('🔧 Building project...')
run('npm run build')

console.log('📦 Packing for preview...')
fs.mkdirSync('releases', { recursive: true })
const packName = execSync('npm pack').toString().trim()
fs.renameSync(packName, `releases/${packName}`)

console.log('🔍 Checking git status...')
const gitStatus = execSync('git status --porcelain').toString()
if (gitStatus.trim()) {
  console.log('📝 Committing uncommitted changes...')
  run('git add .')
  run('git commit -m "chore: prepare release"')
}

if (isManualVersion) {
  try {
    const npmInfo = execSync(`npm view . versions --json`).toString()
    const publishedVersions = JSON.parse(npmInfo)
    if (publishedVersions.includes(versionType)) {
      console.error(`❌ Version ${versionType} is already published on npm.`)
      process.exit(1)
    }
  } catch {
    console.warn('⚠️  Failed to check published versions on npm.')
  }
}

// ⛔️ Validate tag BEFORE bumping
if (isManualVersion && tagAlreadyExists(`v${versionType}`)) {
  console.error(`❌ Tag v${versionType} already exists.`)
  process.exit(1)
}

console.log(`🚀 Bumping version (${versionType})...`)
run(`npm version ${versionType}`)

const version = JSON.parse(fs.readFileSync('./package.json', 'utf8')).version
const tag = `v${version}`

// ✅ NO need to check tag again — it's created by npm version

generateChangelog(tag)

console.log('📦 Validating bundle size...')
try {
  run('npx size-limit')
} catch {
  console.warn('⚠️  size-limit check failed or not configured. Skipping.')
}

console.log('📤 Publishing to npm...')
run('npm publish --access public')

console.log('🌐 Pushing to Git...')
run('git push && git push --tags')

console.log('✅ Done!')
