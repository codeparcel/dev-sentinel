#!/bin/bash

VERSION=${1:-patch}

echo "🔍 Checking npm login..."
npm whoami || exit 1

echo "🔧 Building..."
npm run build || exit 1

echo "📦 Packing..."
npm pack || exit 1

echo "🚀 Bumping version ($VERSION)..."
npm version $VERSION || exit 1

echo "📤 Publishing..."
npm publish --access public || exit 1

echo "🔄 Pushing to Git..."
git push && git push --tags || exit 1

echo "✅ Done!"
