# GitHub Actions Workflows

This repository uses GitHub Actions for continuous integration. Here are the available workflows:

## 🔍 CI - Lint and Format Check (`ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**What it does:**
1. ✅ **ESLint** - Checks code quality and style
2. ✅ **Prettier** - Checks code formatting
3. ✅ **TypeScript** - Validates type checking for backend and frontend
4. ✅ **Dependencies** - Installs and caches dependencies efficiently

## 🚀 Full CI Pipeline (`full-ci.yml`)

**Triggers:**
- Push to `main` branch
- Pull requests to `main` branch

**What it does:**
1. **Quality Checks Job:**
   - ESLint validation
   - Prettier format checking
   - TypeScript compilation check
2. **Build Job:**
   - Builds shared types package
   - Builds frontend application
   - (Ready for backend build when needed)

## 🛠️ Available Scripts

Run these locally to test before pushing:

```bash
# Lint code
yarn lint
yarn lint:fix

# Format code
yarn format
yarn format:check

# Build applications
yarn build:types
yarn build:frontend
yarn build

# Development
yarn dev
```

## 📦 Caching Strategy

The workflows use Yarn v4 cache optimization:
- Dependencies are cached based on `yarn.lock` hash
- Significantly reduces CI build times
- Uses `yarn install --immutable` for consistent installs

## 🔧 Node.js Version

All workflows use **Node.js 20** (LTS) for consistency.

## 📋 Status Badges

Add these to your README.md:

```markdown
![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI%20-%20Lint%20and%20Format%20Check/badge.svg)
![Full CI](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/Full%20CI%20Pipeline/badge.svg)
```
