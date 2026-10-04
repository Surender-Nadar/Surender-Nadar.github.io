# Surender Nadar: personal site

Plain HTML, CSS and a little JavaScript. No build step, no dependencies, no backend.

## Run locally
Open `index.html`, or: `python3 -m http.server 8000` and visit http://localhost:8000.

## Make it yours
- **Portrait:** save your photo in this folder as `portrait.jpg` (portrait orientation, about 640x800, under 150 KB). Until then `portrait.svg` is shown.
- **Links:** edit `LINKS` at the top of `main.js`. Add your X profile URL (`x`), a phone number (`phone`, shows a call button) and a resume file (`resume: "resume.pdf"`). Empty links stay hidden.

## Deploy to GitHub Pages
1. Create a repo (`<username>.github.io` for a root URL, or any name).
2. Push this folder to `main`:
   ```
   git init && git add . && git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```
3. Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/ (root)`. Save.
4. Live in about a minute. All paths are relative, so project URLs work as is.

## Secrets
There's a hidden Gotham mode: press `B`, use the footer bat, or type `batman` in the terminal.

## Photos (fast loading)
1. Put all your photos in `photos/` (any names, any format) and your portrait in this folder as `portrait.jpg` or `portrait.jpeg`.
2. Run: `pip install pillow` then `python3 optimize-photos.py`. It backs up your originals to `photos-original/` (not deployed), then writes small versions: `photos/1.jpg`...`photos/N.jpg`, tiny pile thumbnails in `photos/t/`, and a 640px `portrait.jpg`.
3. If it prints a different number than 24, set `COUNT` near the bottom of `main.js`. Edit the captions in the `PHOTOS` list if you like.
No Python? Resize each photo to about 1200px wide at roughly 75% quality (squoosh.app), name them `1.jpg`...`24.jpg`, and put 420px copies in `photos/t/`.

## Modes and speed
Top-left buttons switch Batman and Spider-Man modes (keys `B` and `S`, or type `batman` / `spiderman` in the terminal). For best speed, compress your photos: about 800px wide for `photos/*.jpg` and 640x800 for `portrait.jpg`, under 150 KB each (squoosh.app works well).
