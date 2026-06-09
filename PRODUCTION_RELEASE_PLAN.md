# Production Release Handoff

Current project path:

`/Volumes/存储/个人网站`

Current release status:

- Website is a pure static HTML/CSS/JS project.
- It is not Next.js, React, Vite, Astro, or Vue.
- Video compression is complete.
- Website references now use compressed web videos:
  - `erosion-web.mp4`
  - `gaze-bailuyuan-web.mp4`
  - `kanjian-web.mp4`
  - `plants-house-web.mp4`
  - `river-web.mp4`
  - `eyes-web.mp4`
  - `mihun-web.mp4`
- All compressed videos are about 40-44 MB.
- Original master videos are ignored by Git.
- `assets/source/` is ignored by Git.
- `.DS_Store`, `.netlify/`, and accidental nested `yanghongru-art/` are ignored by Git.
- `netlify.toml` exists and is configured for a static site.
- README includes deployment notes.

Verification already completed:

- 8 HTML pages returned HTTP 200 locally.
- Static HTML href/src references checked.
- `data.js` local media/document references checked.
- `data.js` and `main.js` syntax checks passed.
- No tracked file exceeds GitHub's 100 MB file limit.
- Git garbage was cleaned.

Git status:

- Main project repository is the root folder: `/Volumes/存储/个人网站`
- Latest commit:
  - `1f76cd3 Prepare artist website for production`
- Remote currently set to:
  - `https://github.com/artyanghongru-ux/yanghongru-art.git`

Important note:

The subfolder `/Volumes/存储/个人网站/yanghongru-art/` is an accidental nested empty Git repository. It is ignored and should not be used as the website repository. The deployable repository is the project root.

Next steps after waking the computer:

1. Confirm GitHub username and repo URL.
2. Push from the project root:

```bash
cd "/Volumes/存储/个人网站"
git push -u origin main
```

3. If the GitHub username is different, update the remote first:

```bash
cd "/Volumes/存储/个人网站"
git remote set-url origin https://github.com/YOUR_USERNAME/yanghongru-art.git
git push -u origin main
```

4. If Git asks for authentication, log in with GitHub credentials or a personal access token.
5. After push succeeds, connect Netlify to the GitHub repository.

Netlify settings:

```text
Build command: leave empty
Publish directory: .
Framework preset: Static site / none
```

Final pre-launch checklist:

- GitHub push succeeds.
- Netlify deploy succeeds.
- Home, Works, Work Detail, Research, Research Detail, About, CV, and Contact open correctly on Netlify.
- Video playback works on the video detail pages.
- Mobile homepage spacing is still correct on the deployed URL.
- Custom domain can be added later through Netlify Domain management.
