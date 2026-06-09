# YANG HONGRU 个人网站文件结构

## Project Type

This project is a pure static website.

- Framework: none
- Runtime: none
- Build step: none
- Main files: `index.html`, `works.html`, `work.html`, `research.html`, `research-detail.html`, `about.html`, `cv.html`, `contact.html`
- Shared assets and logic: `styles.css`, `data.js`, `main.js`

It does not use Next.js, React, Vite, Astro, or Vue.

## Production Notes

The website uses compressed web videos in `assets/works/video/**/**/*-web.mp4`.

Original master videos and archive/source materials are intentionally excluded from Git through `.gitignore`:

- `assets/source/`
- original large video master files
- `.DS_Store`

Do not remove the local master files unless they have been backed up elsewhere. They are useful for future re-exporting, but they should not be deployed.

## Netlify Deployment

Recommended Netlify settings:

- Build command: leave empty
- Publish directory: `.`
- Functions directory: none

The included `netlify.toml` already sets:

- publish directory as `.`
- security headers
- long cache headers for `/assets/*`

Deployment workflow:

1. Push this project to GitHub.
2. In Netlify, choose `Add new site` -> `Import an existing project`.
3. Connect the GitHub repository.
4. Set build command to empty.
5. Set publish directory to `.`.
6. Deploy.

## Future Custom Domain

When the final domain is ready:

1. Add the domain in Netlify under `Domain management`.
2. Set the primary domain, for example `yanghongru.com`.
3. Add the DNS records Netlify provides.
4. Enable HTTPS after DNS propagation.
5. Keep all links relative, as they are now, so the site works on both Netlify preview URLs and the future domain.

## 网站页面

根目录下的 `.html`、`styles.css`、`data.js`、`main.js` 是当前静态网站文件。

## 作品图片

按网站栏目补充图片：

- `assets/works/painting`：绘画
- `assets/works/sketch`：速写
- `assets/works/video`：影像
- `assets/works/research`：研究

把新增作品图放进对应文件夹后，可继续让我更新 `data.js` 中的标题、年份、材料、尺寸和说明。

## 资料内容

- `content/cv`：教育、展览、收藏、获奖、出版等 CV 资料
- `content/about`：Biography、Artist Statement、中文简介等
- `content/research`：研究文章、阅读笔记、参考资料
- `content/contact`：联系方式资料

## 原始素材

- `assets/source/keynote`：原始 Keynote 作品集和解包素材
- `assets/source/original-works`：原先散放的作品图片原始文件
- `assets/portrait`：艺术家肖像、创作照
- `assets/studio`：工作室照片
- `assets/exhibitions`：展览现场图
