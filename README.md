# Amit Kumar Mohanty — personal site

Dark, minimal, interactive personal website. Plain HTML, CSS and JavaScript, with no build step and no dependencies.

**Live:** https://amitmohanty022.github.io/amit-mohanty-portfolio/

## Features
- Particle field in the hero that reacts to the mouse; click for a burst
- Typing intro, glitch name effect, custom cursor, magnetic buttons, scroll progress bar
- Drawing studio with colours, rainbow brush, mirror mode, and PNG download
- Generative art tiles (click to regenerate)
- Reaction-time test with a saved best score

## How to run (step by step)

**Option 1: just open it**

1. Click the green **Code** button on GitHub → **Download ZIP**, and unzip it. Or clone it:
   ```bash
   git clone https://github.com/amitmohanty022/amit-mohanty-portfolio.git
   ```
2. Double-click `index.html`. It opens in your browser.

**Option 2: run a local web server** (closest to the live site)

1. Install Python 3 if you don't have it: https://www.python.org/downloads/
2. In a terminal, go to the project folder and run:
   ```bash
   cd amit-mohanty-portfolio
   python -m http.server 8000
   ```
3. Open http://localhost:8000 in your browser. Press `Ctrl + C` in the terminal to stop.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure and content |
| `style.css` | All styling |
| `script.js` | Animations, drawing studio, generative art, reaction test |
| `.nojekyll` | Tells GitHub Pages to serve files as-is |

## Deploy to GitHub Pages

1. Open the repository on GitHub → **Settings → Pages**.
2. Under **Source**, choose **Deploy from a branch**, select `main` and `/ (root)`, and click **Save**.
3. After about a minute, the site is live at `https://<your-username>.github.io/amit-mohanty-portfolio/`.
