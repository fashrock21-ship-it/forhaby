Out of This World — A small interactive surprise

What you get
- `index.html` — animated starfield page with a typing love message and controls.
- `style.css`, `script.js` — page styles and behavior.
- `star_certificate.svg` — downloadable certificate generated on demand (generated dynamically; you can download via the button).
- `poem.txt` — a short printable poem.

How to use
1. Open `index.html` in any modern browser (Chrome, Edge, Firefox). If your browser blocks local files, drag the file into a new tab.
2. Type your girlfriend's name into the input and click "Reveal Message" (or press Enter). The message will type out and reveal a short poem.
3. Click "Download Certificate" to download a personalized SVG you can print or gift.

Customization
- Edit `script.js` to change the message, poem, or certificate template.
- `generateCertificate(name)` returns an SVG string; you can modify fonts, colors, and layout there.

Notes
- All files are local and do not require a server. No external network calls are made.

Adding background music
- Place a file named `bgm.mp3` in the same folder as `index.html` (i.e., `out_of_this_world/bgm.mp3`). The page looks for that file and the "Play music" button will become functional. The page will also try to start playback when you click "Reveal Message" (this requires a user gesture so browsers allow playback).

Curated royalty-free track suggestions (manual search)
- Ambient piano — search for "ambient piano" on: Pixabay Music (https://pixabay.com/music/), FreePD (https://freepd.com/), or Free Music Archive (https://freemusicarchive.org/).
- Gentle synth (space ambient) — search for "space ambient" or "ethereal synth" on the same sites above.
- Slow orchestral (cinematic strings) — search for "cinematic" or "strings".

How to add a track manually
1. Download an mp3 file you like (30–180s recommended).
2. Rename it to `bgm.mp3` and place it into this folder: `out_of_this_world/`.
3. Reload `index.html` in your browser. Click "Reveal Message" and then use the Play music button.

If you prefer, reply here with the mood you want (Ambient piano, Gentle synth, or Slow orchestral) and I will fetch a CC0/royalty-free mp3, save it as `bgm.mp3`, and wire it into the project for you.

If you want, I can:
- Add a print-ready PDF certificate.
- Add a small animated card you can email.
- Make a one-click ZIP with the files ready to send.

Enjoy — open `index.html` and show her the surprise!