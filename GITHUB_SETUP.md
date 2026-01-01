# 🚀 GitHub Setup Guide

Complete step-by-step instructions to push your personal website to GitHub.

---

## 📋 Prerequisites

1. **Git installed** on your computer
   - Download: https://git-scm.com/download/win
   - Verify: `git --version` in PowerShell

2. **GitHub account** 
   - Sign up: https://github.com

3. **GitHub Desktop (optional but easier)**
   - Download: https://desktop.github.com

---

## 🎯 Step-by-Step Instructions

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in the form:
   - **Repository name**: `personal-website` (or your preferred name)
   - **Description**: `Professional personal website built with Next.js`
   - **Privacy**: Choose `Public` (anyone can see) or `Private` (only you)
   - ✅ Add `.gitignore` for Node → **Skip this** (we'll create our own)
   - ✅ Add a README file → **Skip** (we have one)
3. Click **"Create repository"**
4. **Copy the repository URL** (looks like `https://github.com/yourname/personal-website.git`)

---

### Step 2: Initialize Git Locally

Open **PowerShell** and run:

```powershell
# Navigate to your project
cd "d:\Dokument\Portofolio\Profesional Personal Website"

# Initialize Git
git init

# Verify it worked
git status
```

---

### Step 3: Create .gitignore (if you don't have one)

```powershell
# This file is at the root of your project
# It tells Git which files NOT to upload

# Node modules
node_modules/

# Environment variables
.env
.env.local
.env.*.local

# Build outputs
.next/
out/
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Database
*.db
dev.db
*.sqlite

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# Cache
.eslintcache
.stylelintcache

# Testing
.coverage/
.nyc_output/

# Misc
.cache/
.turbo/
```

---

### Step 4: Add Files to Git

```powershell
# Add all files (respects .gitignore)
git add .

# Verify what will be uploaded
git status
```

---

### Step 5: Create First Commit

```powershell
# Create your first commit
git commit -m "Initial commit: Personal website with Next.js, TypeScript, Tailwind, and security hardening"

# Verify
git log --oneline
```

---

### Step 6: Connect to GitHub

```powershell
# Replace YOUR-USERNAME and YOUR-REPO-NAME with your actual values
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Verify connection
git remote -v
```

**Example:**
```powershell
git remote add origin https://github.com/muhammadrizkykhomeini/personal-website.git
```

---

### Step 7: Push to GitHub

```powershell
# Set default branch to main
git branch -M main

# Push all files to GitHub
git push -u origin main

# This might ask for your GitHub credentials
# Use your GitHub username and Personal Access Token (see below)
```

---

## 🔑 GitHub Authentication (Important!)

### Option A: Personal Access Token (Recommended)

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `GitHub Push Token`
4. Select scopes:
   - ✅ `repo` (full control of private repositories)
   - ✅ `workflow` (update GitHub workflows)
5. Click **"Generate token"**
6. **Copy the token** (save it somewhere safe!)
7. When Git asks for password, paste this token

### Option B: SSH Key (More Secure)

1. Generate SSH key:
```powershell
ssh-keygen -t ed25519 -C "your-email@example.com"
# Press Enter for all prompts
```

2. Add to SSH agent:
```powershell
# Start SSH agent
Start-Service ssh-agent

# Add key
ssh-add $env:USERPROFILE\.ssh\id_ed25519
```

3. Add to GitHub:
   - Go to https://github.com/settings/keys
   - Click **"New SSH key"**
   - Copy content from: `C:\Users\YourUsername\.ssh\id_ed25519.pub`
   - Paste and save

4. Use SSH URL when cloning:
```powershell
git remote add origin git@github.com:YOUR-USERNAME/YOUR-REPO-NAME.git
```

---

## ✅ Complete Workflow

Here's the complete command sequence:

```powershell
# 1. Navigate to project
cd "d:\Dokument\Portofolio\Profesional Personal Website"

# 2. Initialize git
git init

# 3. Add all files
git add .

# 4. First commit
git commit -m "Initial commit: Personal website with Next.js, TypeScript, Tailwind, and security hardening"

# 5. Rename branch to main
git branch -M main

# 6. Connect to GitHub (replace with your repo URL)
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# 7. Push to GitHub
git push -u origin main

# 8. Verify (go to your GitHub repo to see your files!)
```

---

## 📁 What Gets Uploaded?

✅ **Will be uploaded**:
- `src/` - Your source code
- `public/` - Public assets
- `prisma/` - Database schema
- `package.json` - Dependencies
- `.eslintrc.json` - Linting config
- `tsconfig.json` - TypeScript config
- `next.config.js` - Next.js config
- All `.md` files - Documentation
- `.gitignore` - Git ignore rules

❌ **Will NOT be uploaded** (ignored):
- `node_modules/` - Too large
- `.env` / `.env.local` - Secrets
- `.next/` - Build output
- `*.db` - Database files
- `.vscode/` - Editor settings

---

## 🔄 Future Commits

After the initial push, use this for future updates:

```powershell
# See what changed
git status

# Add changes
git add .

# Create commit
git commit -m "Describe what you changed"

# Push to GitHub
git push
```

---

## 🌳 Project Structure on GitHub

Your GitHub repo will look like:

```
personal-website/
├── src/                    # All source code
├── public/                 # Static files
├── prisma/                 # Database config
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript
├── next.config.js         # Next.js config
├── README.md              # Project description
├── .gitignore             # What to ignore
└── ...other configs
```

---

## 🚀 After Pushing to GitHub

### Connect to Vercel (Easy Deployment!)

1. Go to https://vercel.com
2. Click **"New Project"**
3. Import your GitHub repository
4. Follow the setup (auto-detects Next.js)
5. Add environment variables:
   - `NEXTAUTH_SECRET`: Your secret
   - `GITHUB_ID` & `GITHUB_SECRET`: OAuth credentials
   - etc.
6. Click **"Deploy"**
7. Your site goes live automatically! 🎉

### Create GitHub Actions

You can add CI/CD workflows:

```yaml
# .github/workflows/build.yml
name: Build and Test

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run lint
```

---

## ❓ Troubleshooting

### "fatal: not a git repository"
```powershell
# Make sure you're in the right folder
cd "d:\Dokument\Portofolio\Profesional Personal Website"
git init
```

### "Permission denied (publickey)"
- You're using SSH but key isn't set up
- Use HTTPS instead or set up SSH properly

### "Everything up-to-date"
```powershell
# You already pushed, to push updates:
git add .
git commit -m "Your message"
git push
```

### ".env file is being tracked"
```powershell
# Remove it from git (but keep locally)
git rm --cached .env
git commit -m "Remove .env from tracking"
```

### "Large files"
```powershell
# Check file sizes
ls -la | sort -Property Length -Descending

# Remove if needed
git rm --cached path/to/large/file
echo "large-file" >> .gitignore
git add .gitignore
git commit -m "Ignore large file"
```

---

## 📚 Useful Git Commands

```powershell
# See commit history
git log --oneline

# See current status
git status

# See what you changed
git diff

# Undo last commit (keep changes)
git reset --soft HEAD~1

# See remote info
git remote -v

# Change remote URL
git remote set-url origin https://new-url.git

# See all branches
git branch -a
```

---

## ✨ GitHub Profile Tips

After pushing:

1. **Add a nice README to your GitHub profile**
   - Create repo: `YOUR-USERNAME/YOUR-USERNAME`
   - Add `README.md` with your bio
   - It shows on your profile!

2. **Pin important repos**
   - Go to your profile
   - Click "Customize your pins"
   - Pin this project

3. **Add Topics to your repo**
   - Go to repo settings
   - Add: `next-js`, `typescript`, `tailwind-css`, `portfolio`

4. **Enable GitHub Pages** (optional, for static sites)
   - Settings → Pages
   - Deploy from `gh-pages` branch

---

## 🎯 You're Ready!

Follow the steps above and your project will be on GitHub. Then:

1. ✅ Push your code
2. ✅ Connect to Vercel to go live
3. ✅ Share your GitHub profile with others
4. ✅ Invite collaborators if needed
5. ✅ Use GitHub for version control

**Good luck! Your portfolio is production-ready!** 🚀

---

**Need help?** Reference this guide or check:
- GitHub Docs: https://docs.github.com
- Git Docs: https://git-scm.com/doc
