# 📦 Preparing for GitHub Deployment

Follow these steps to push your project to GitHub repository.

## ✅ Pre-Push Checklist

### 1. Clean Temporary Files
```bash
# Remove temporary test files
del /S tmp_rovodev_* 2>nul

# Remove node_modules (will be reinstalled)
cd restaurant-system
FOR /D %G IN ("*") DO (
  IF EXIST "%G\node_modules" rmdir /S /Q "%G\node_modules"
  IF EXIST "%G\.next" rmdir /S /Q "%G\.next"
)
```

### 2. Verify Environment Files
Make sure NO sensitive data is in version control:
- ✅ `.env.example` files are present
- ✅ Actual `.env` files are in `.gitignore`
- ✅ No database credentials in code
- ✅ No API keys in code

### 3. Test Build Process
```bash
# Test backend build
cd restaurant-system/backend
npm install
npm run build

# Test frontend builds
cd ../admin-panel
npm install
npm run build
```

## 🚀 Push to GitHub

### Step 1: Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: Restaurant Management System"
```

### Step 2: Connect to GitHub Repository
```bash
# Add remote
git remote add origin https://github.com/kuramaOn/restaurant.git

# Verify remote
git remote -v
```

### Step 3: Push to GitHub
```bash
# Push to main branch
git branch -M main
git push -u origin main
```

## 📝 What Gets Pushed

### ✅ Included:
- Source code
- Configuration files
- Documentation
- `.env.example` files
- Package.json files
- Database schema (Prisma)

### ❌ Excluded (via .gitignore):
- `node_modules/`
- `.next/` build folders
- `.env` files with secrets
- Database files
- Log files
- IDE settings
- Temporary files

## 🔒 Security Check

Before pushing, verify:

```bash
# Search for potential secrets
git grep -i "password"
git grep -i "secret"
git grep -i "api_key"
git grep -i "jwt_secret"
```

If you find any hardcoded secrets, remove them and use environment variables instead.

## 📚 Post-Push Setup

After pushing, update your repository:

1. **Add Description**
   - Go to repository settings
   - Add: "Full-stack restaurant management system with mobile-optimized interfaces"

2. **Add Topics**
   - nextjs
   - nestjs
   - typescript
   - restaurant
   - pos-system
   - mobile-first
   - prisma
   - mysql

3. **Set Default Branch**
   - Ensure `main` is the default branch

4. **Add Repository Details**
   - Website: Your demo URL (if available)
   - License: MIT

## 🌟 Make It Discoverable

Add these files (already created):
- ✅ README.md - Comprehensive documentation
- ✅ DEPLOYMENT.md - Deployment guide
- ✅ CONTRIBUTING.md - Contribution guidelines
- ✅ .gitignore - Ignore unwanted files
- ✅ LICENSE - MIT License

## 🎯 Next Steps

After successful push:

1. **Create GitHub Actions** (optional)
   - Automated testing
   - Automated deployment

2. **Add Badges to README**
   ```markdown
   ![Build Status](https://img.shields.io/github/workflow/status/kuramaOn/restaurant/CI)
   ![License](https://img.shields.io/github/license/kuramaOn/restaurant)
   ![Stars](https://img.shields.io/github/stars/kuramaOn/restaurant)
   ```

3. **Deploy to Production**
   - Follow DEPLOYMENT.md guide
   - Deploy to Vercel/Railway

4. **Create Demo**
   - Deploy a live demo
   - Add demo link to README

## 🆘 Troubleshooting

### Large File Error
```bash
# If you get large file error, check file sizes
git ls-files -z | xargs -0 du -h | sort -h -r | head -20

# Remove large files if needed
git rm --cached large-file.zip
```

### Authentication Error
```bash
# Use personal access token
# Go to GitHub → Settings → Developer settings → Personal access tokens
# Create token with 'repo' scope
# Use token as password when pushing
```

### Files Not Ignored
```bash
# If .gitignore isn't working
git rm -r --cached .
git add .
git commit -m "Fix gitignore"
```

## ✅ Verification

After pushing, check:
- [ ] All source files uploaded
- [ ] README.md displays correctly
- [ ] No `.env` files in repository
- [ ] No `node_modules` in repository
- [ ] Documentation is accessible
- [ ] Repository is public (or private if desired)

---

**Your project is now on GitHub! 🎉**

Repository: https://github.com/kuramaOn/restaurant
