import { execSync } from 'child_process'
import { argv } from 'process'

const versionType = argv[2] || 'patch'

function run(cmd) {
  console.log(`$ ${cmd}`)
  execSync(cmd, { stdio: 'inherit' })
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

console.log('📤 Publishing to npm...')
run('npm publish --access public')

console.log('🌐 Pushing to Git...')
run('git push && git push --tags')

console.log('✅ Done!')
