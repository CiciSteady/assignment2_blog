# Assignment 2 Static Personal Blog Website Report

**Student Name**: Ren Xuan
**Student ID**: ZY2557207
## Objective

The goal of Assignment 2 is to build a static personal blog website, manage the project with Git, document the setup and deployment process in Markdown, integrate previous work, and make the website accessible through a URL or IP address.

## Tool Choice

I chose a plain static HTML/CSS implementation instead of a framework-based generator because the current WSL environment already includes Python 3 but does not include `pip` or Sphinx-related packages.  
This choice keeps the project simple, portable, and easy to deploy without installing additional dependencies.

## Website Structure

The project contains the following components:

- `site/index.html`: homepage with summary, navigation, and quick-start information
- `site/archive.html`: downloadable Assignment 1 and Assignment 2 materials
- `site/process.html`: Git workflow and deployment process
- `site/assets/style.css`: responsive styles for all pages
- `site/downloads/assignment1_report.md`: integrated Assignment 1 Markdown report
- `site/downloads/assignment1_report.pdf`: integrated Assignment 1 PDF report
- `scripts/serve.sh`: local WSL preview script
- `scripts/get_wsl_ip.sh`: script to print the WSL IP address

## Integration of Previous Work

The website includes direct download links to the Assignment 1 Markdown report and PDF report.  
This satisfies the requirement to integrate previous work into the Assignment 2 website.

## Git Management Process

The project uses Git to track logical development milestones.  
The intended meaningful commits are:

| Commit Message | Purpose |
|---------------|---------|
| `chore: initialize assignment2 static site structure` | Create repository layout and basic project files |
| `feat: build responsive landing page and styles` | Add homepage design and shared CSS |
| `feat: integrate assignment1 downloads and archive page` | Add previous work links and archive content |
| `docs: add assignment2 report and WSL command guide` | Document the process and the command workflow |
| `chore: add local serving scripts and GitHub Pages workflow` | Prepare local IP-based serving and optional public deployment |

Each commit corresponds to a specific project milestone rather than an arbitrary file save.

## Deployment Method

### Local Deployment in WSL

The website can be served with Python's built-in HTTP server:

```bash
cd /mnt/c/Users/r1382/Desktop/codex/assignment2_blog
bash scripts/get_wsl_ip.sh
bash scripts/serve.sh 8000
```

After starting the server, the website can be opened at:

- `http://localhost:8000`
- `http://<WSL_IP>:8000`

This satisfies the requirement that the website be accessible through a URL or IP address.

### Optional GitHub Pages Deployment

The repository also includes a GitHub Actions workflow for GitHub Pages deployment.  
After pushing the repository to GitHub, the website can be published as a public URL.

## Why This Approach Works Well

This implementation is appropriate for the assignment because:

1. It is a fully static website.
2. It includes previous coursework.
3. It uses Git in a meaningful way.
4. It is documented with Markdown.
5. It can be accessed locally by URL or IP address and can optionally be published online.

## Conclusion

Through this assignment, I practiced building a static website, organizing a project repository, documenting the workflow with Markdown, integrating previous work, and preparing a deployment path for local and public access.
