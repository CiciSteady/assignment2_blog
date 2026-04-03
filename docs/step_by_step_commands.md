# Assignment 2 WSL Step-by-Step Commands

The commands below are written for WSL and are ready to copy.

## 1. Enter the completed project

```bash
cd /mnt/c/Users/r1382/Desktop/codex/assignment2_blog
```

## 2. Optional: configure your own Git identity

```bash
git config user.name "Your Name"
git config user.email "your_email@example.com"
```

## 3. If you want to reproduce the repository from scratch

```bash
mkdir -p ~/assignment2_blog
cd ~/assignment2_blog
git init -b main
mkdir -p site/assets site/downloads docs scripts .github/workflows
```

## 4. Check the existing commit history

```bash
git log --oneline --graph --decorate
```

## 5. Reproduce the five meaningful commits

### Commit 1

```bash
git add .gitignore README.md
git commit -m "chore: initialize assignment2 static site structure"
```

### Commit 2

```bash
git add site/index.html site/assets/style.css
git commit -m "feat: build responsive landing page and styles"
```

### Commit 3

```bash
git add site/archive.html site/process.html site/downloads/assignment1_report.md site/downloads/assignment1_report.pdf site/downloads/assignment2_report.md
git commit -m "feat: integrate assignment1 downloads and archive page"
```

### Commit 4

```bash
git add docs/assignment2_report.md docs/step_by_step_commands.md
git commit -m "docs: add assignment2 report and WSL command guide"
```

### Commit 5

```bash
git add scripts/serve.sh scripts/get_wsl_ip.sh .github/workflows/pages.yml
git commit -m "chore: add local serving scripts and GitHub Pages workflow"
```

## 6. Print the WSL IP address

```bash
bash scripts/get_wsl_ip.sh
```

## 7. Preview the website locally

```bash
bash scripts/serve.sh 8000
```

## 8. Open the website

Use one of the following in your browser:

```text
http://localhost:8000
http://YOUR_WSL_IP:8000
```

## 9. One complete run sequence

```bash
cd /mnt/c/Users/r1382/Desktop/codex/assignment2_blog
git status
git log --oneline --graph --decorate
bash scripts/get_wsl_ip.sh
bash scripts/serve.sh 8000
```

## 10. Optional: publish to GitHub

```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/assignment2_blog.git
git branch -M main
git push -u origin main
```

## 11. Optional: expected GitHub Pages URL

```text
https://YOUR_GITHUB_USERNAME.github.io/assignment2_blog/
```
