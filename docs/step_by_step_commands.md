# Assignment 2 WSL Step-by-Step Commands

The commands below are written for WSL and are ready to copy.

## 1. Enter the completed project

```bash
cd /mnt/c/Users/r1382/Desktop/codex/assignment2_blog
```

## 2. Preview the website locally

```bash
bash scripts/serve.sh 8000
```

## 3. Print the WSL IP address

```bash
bash scripts/get_wsl_ip.sh
```

## 4. Open the website

Use one of the following in your browser:

```text
http://localhost:8000
http://YOUR_WSL_IP:8000
```

## 5. Check the repository history

```bash
git log --oneline --graph
```

## 6. Optional: configure your own Git identity

```bash
git config user.name "Your Name"
git config user.email "your_email@example.com"
```

## 7. Optional: publish to GitHub

```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/assignment2_blog.git
git branch -M main
git push -u origin main
```

## 8. Optional: after GitHub Pages is enabled

```text
https://YOUR_GITHUB_USERNAME.github.io/assignment2_blog/
```

## 9. One complete run sequence

```bash
cd /mnt/c/Users/r1382/Desktop/codex/assignment2_blog
git status
bash scripts/get_wsl_ip.sh
bash scripts/serve.sh 8000
```

