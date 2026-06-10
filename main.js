function setCurrentNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      link.setAttribute("aria-current", "page");
    }
  });
}

function optimizedVariant(src, size = 1600) {
  const manifest = window.optimizedImages || {};
  const entry = manifest[src];
  if (!entry) return null;
  return entry[size] || entry[1600] || entry[900] || entry[2200] || null;
}

function imageTag(src, alt, className = "", options = {}) {
  if (!src) return `<div class="image-placeholder ${className}">${alt}</div>`;
  const {
    size = 1600,
    loading = "lazy",
    fetchpriority = "",
    sizes = "(max-width: 767px) 100vw, 80vw"
  } = options;
  const variant = optimizedVariant(src, size);
  const priorityAttr = fetchpriority ? ` fetchpriority="${fetchpriority}"` : "";
  const baseImg = `<img src="${variant?.webp || src}" alt="${alt}" class="${className}" loading="${loading}"${priorityAttr} sizes="${sizes}">`;
  if (!variant) return baseImg;
  return `
    <picture class="${className} optimized-picture">
      <source srcset="${variant.avif}" type="image/avif">
      <source srcset="${variant.webp}" type="image/webp">
      ${baseImg}
    </picture>
  `;
}

function needsContent(value = "") {
  return /Placeholder|placeholder|待|will be completed|will be translated|待补充|待校对/.test(String(value));
}

function contentClass(value = "") {
  return needsContent(value) ? " needs-content" : "";
}

function textSpan(value, className = "") {
  if (needsContent(value)) return "";
  return `<span class="${className}${contentClass(value)}">${value}</span>`;
}

function mediaCover(work, className = "") {
  if (work.image || work.cover) {
    return imageTag(work.cover || work.image, work.title, className, { size: 900 });
  }

  if (work.video) {
    return imageTag("", work.title, className);
  }

  return imageTag("", work.title, className);
}

function workMeta(work) {
  const title = work.titleEn ? `${work.title} / ${work.titleEn}` : work.title;
  return `
    <div class="work-meta">
      <span class="work-meta__title">${title}</span>
      ${textSpan(work.year, "work-meta__detail")}
      ${textSpan(work.material, "work-meta__detail")}
    </div>
  `;
}

function renderHome() {
  const hero = homeHero;
  const heroEl = document.querySelector("[data-hero]");
  const featuredEl = document.querySelector("[data-featured]");
  if (!heroEl || !featuredEl) return;

  heroEl.innerHTML = `
    ${imageTag(hero.image, hero.title, "hero__image", {
      size: 1600,
      loading: "eager",
      fetchpriority: "high",
      sizes: "100vw"
    })}
    <div class="hero__overlay">
      ${hero.kicker ? `<span>${hero.kicker}</span>` : ""}
      <h1>${hero.title}</h1>
      <p>${hero.subtitle}</p>
    </div>
  `;

  const featuredWorks = ["tashan-zhishi", "baima-feima", "huitoulu", "sisyphus"]
    .map((slug) => works.find((work) => work.slug === slug))
    .filter(Boolean);

  featuredEl.innerHTML = `
    <div class="featured-slider" data-featured-slider>
      ${featuredWorks.map((work, index) => `
        <a class="featured-slide${index === 0 ? " is-active" : ""}" href="works.html#painting">
          ${imageTag(work.image, work.title, "featured__image", {
            size: index === 0 ? 1600 : 900,
            loading: index === 0 ? "eager" : "lazy",
            fetchpriority: index === 0 ? "high" : "",
            sizes: "100vw"
          })}
          <div class="featured-slide__meta">
            ${workMeta(work)}
          </div>
        </a>
      `).join("")}
    </div>
  `;

  const slides = Array.from(featuredEl.querySelectorAll(".featured-slide"));
  let activeIndex = 0;
  if (slides.length > 1) {
    setInterval(() => {
      slides[activeIndex].classList.remove("is-active");
      activeIndex = (activeIndex + 1) % slides.length;
      slides[activeIndex].classList.add("is-active");
    }, 5500);
  }
}

function renderWorks() {
  const indexEl = document.querySelector("[data-series-index]");
  const listEl = document.querySelector("[data-works]");
  if (!indexEl || !listEl) return;

  indexEl.innerHTML = series.map((item) => `
    <a href="#${item.slug}">
      <div>${item.en}</div>
      <div class="meta">${item.zh}</div>
    </a>
  `).join("");

  listEl.innerHTML = series.map((item) => {
    const grouped = works.filter((work) => work.series === item.slug);
    if (item.slug === "video") {
      return renderVideoSection(item, grouped);
    }

    if (item.slug === "research") {
      return `
        <section class="series-section" id="${item.slug}">
          <h2 class="series-heading">
            <span>${item.en}</span>
            <span class="meta">${item.zh}</span>
          </h2>
          <a class="research-card" href="research.html">
            ${imageTag(researchProjects[0].hero, researchProjects[0].title, "research-card__image", { size: 900 })}
            <div class="research-card__text">
              <span>${researchProjects[0].displayTitleEn}</span>
              <strong>${researchProjects[0].displayTitle}</strong>
              <p>${researchProjects[0].intro}</p>
            </div>
          </a>
        </section>
      `;
    }

    return `
      <section class="series-section" id="${item.slug}">
        <h2 class="series-heading">
          <span>${item.en}</span>
          <span class="meta">${item.zh}</span>
        </h2>
        <div class="work-grid">
          ${grouped.map((work) => `
            <a class="work-card" href="work.html?slug=${work.slug}">
              ${imageTag(work.image, work.title, "", { size: 900, sizes: "(max-width: 767px) 100vw, 50vw" })}
              ${workMeta(work)}
            </a>
          `).join("")}
        </div>
      </section>
    `;
  }).join("");
}

function renderVideoSection(item, grouped) {
  const featured = grouped.filter((work) => work.displayLevel === "featured");
  const secondary = grouped.filter((work) => work.displayLevel === "secondary");
  const minimal = grouped.filter((work) => work.displayLevel === "minimal");

  return `
    <section class="series-section video-section" id="${item.slug}">
      <h2 class="series-heading">
        <span>${item.en}</span>
        <span class="meta">${item.zh}</span>
      </h2>
      <div class="video-featured-grid">
        ${featured.map((work) => `
          <a class="video-featured-card" href="work.html?slug=${work.slug}">
            ${mediaCover(work, "video-featured-card__image")}
            <div class="video-featured-card__meta">
              ${workMeta(work)}
              <p>${work.description}</p>
            </div>
          </a>
        `).join("")}
      </div>
      <div class="video-secondary-grid">
        ${secondary.map((work) => `
          <a class="video-card" href="work.html?slug=${work.slug}">
            ${mediaCover(work, "video-card__image")}
            ${workMeta(work)}
          </a>
        `).join("")}
      </div>
      <div class="video-minimal-list">
        ${minimal.map((work) => `
          <a class="video-minimal-row" href="work.html?slug=${work.slug}">
            ${mediaCover(work, "video-minimal-row__media")}
            <div>
              <strong>${work.title}</strong>
              <span>${work.material}</span>
            </div>
          </a>
        `).join("")}
      </div>
    </section>
  `;
}

function renderWorkDetail() {
  const el = document.querySelector("[data-work-detail]");
  if (!el) return;

  const slug = new URLSearchParams(location.search).get("slug") || works[0].slug;
  const index = works.findIndex((work) => work.slug === slug);
  const work = works[index] || works[0];
  const previous = works[index - 1] || works[works.length - 1];
  const next = works[index + 1] || works[0];

  document.title = `${work.title} | YANG HONGRU`;
  if (work.series === "video") {
    el.innerHTML = renderVideoDetail(work, previous, next);
    return;
  }

  el.innerHTML = `
    <div class="detail-layout${work.hideDetailImage ? " detail-layout--without-image" : ""}">
      ${work.hideDetailImage ? "" : imageTag(work.image, work.title, "detail-image", {
        size: 2200,
        sizes: "(max-width: 767px) 100vw, 90vw"
      })}
      <section class="detail-info">
        <p class="eyebrow">Works / ${work.seriesEn} / ${work.seriesZh}</p>
        <h1 class="page-title">${work.title}</h1>
        <dl class="definition-list">
          ${needsContent(work.year) ? "" : `<dt>Year</dt><dd>${work.year}</dd>`}
          ${needsContent(work.material) ? "" : `<dt>Material</dt><dd>${work.material}</dd>`}
          ${needsContent(work.dimensions) ? "" : `<dt>Dimensions</dt><dd>${work.dimensions}</dd>`}
        </dl>
        ${needsContent(work.description) ? "" : `<p class="meta">${work.description}</p>`}
        ${renderPaintingExtras(work)}
        <nav class="prev-next" aria-label="Work navigation">
          <a href="work.html?slug=${previous.slug}">Previous</a>
          <a href="work.html?slug=${next.slug}">Next</a>
        </nav>
      </section>
    </div>
  `;
}

function renderPaintingExtras(work) {
  const detailImages = work.detailImages || [];
  const installationImages = work.installationImages || [];
  if (!detailImages.length && !installationImages.length) return "";

  return `
    <section class="work-extra">
      ${detailImages.length ? `
        <h2 class="section-title">Details</h2>
        <div class="detail-gallery">
          ${detailImages.map((src) => imageTag(src, `${work.title} detail`, "", {
            size: 1600,
            sizes: "(max-width: 767px) 100vw, 50vw"
          })).join("")}
        </div>
      ` : ""}
      ${installationImages.length ? `
        <h2 class="section-title">Installation</h2>
        <div class="installation-gallery">
          ${installationImages.map((src) => imageTag(src, `${work.title} installation`, "", {
            size: 1600,
            sizes: "100vw"
          })).join("")}
        </div>
      ` : ""}
    </section>
  `;
}

function renderVideoDetail(work, previous, next) {
  if (work.displayLevel === "featured") {
    return `
      <article class="video-detail video-detail--featured">
        <section class="video-hero">
          ${work.poster ? imageTag(work.poster, `${work.title} poster`, "video-poster", { size: 900 }) : mediaCover(work, "video-poster")}
          <div class="video-hero__text">
            <p class="eyebrow">Works / Video / 影像</p>
            <h1 class="page-title">${work.title}<span>${work.titleEn ? ` / ${work.titleEn}` : ""}</span></h1>
            <dl class="definition-list">
              ${needsContent(work.year) ? "" : `<dt>Year</dt><dd>${work.year}</dd>`}
              <dt>Medium</dt><dd>${work.material}</dd>
              <dt>Format</dt><dd>${work.dimensions}</dd>
            </dl>
          </div>
        </section>
        ${work.cover ? imageTag(work.cover, `${work.title} horizontal poster`, "video-wide-poster", { size: 1600 }) : ""}
        ${renderStills(work)}
        ${renderVideoPlayer(work)}
        ${renderBilingualText(work)}
        ${renderPdfLink(work)}
        ${renderPrevNext(previous, next)}
      </article>
    `;
  }

  return `
    <article class="video-detail">
      <p class="eyebrow">Works / Video / 影像</p>
      <h1 class="page-title">${work.title}<span>${work.titleEn ? ` / ${work.titleEn}` : ""}</span></h1>
      <div class="video-detail-grid">
        ${mediaCover(work, "video-detail-cover")}
        <section class="detail-info">
          <dl class="definition-list">
            ${needsContent(work.year) ? "" : `<dt>Year</dt><dd>${work.year}</dd>`}
            <dt>Medium</dt><dd>${work.material}</dd>
            <dt>Format</dt><dd>${work.dimensions}</dd>
          </dl>
          ${needsContent(work.description) ? "" : `<p class="meta">${work.description}</p>`}
        </section>
      </div>
      ${renderStills(work)}
      ${renderVideoPlayer(work)}
      ${work.displayLevel !== "minimal" ? renderBilingualText(work) : ""}
      ${renderPdfLink(work)}
      ${renderPrevNext(previous, next)}
    </article>
  `;
}

function renderStills(work) {
  const stills = work.stills || [];
  if (!stills.length) return "";
  return `
    <section class="video-stills">
      <h2 class="section-title">Film Stills</h2>
      <div class="video-stills-grid">
        ${stills.map((src) => imageTag(src, `${work.title} still`, "", {
          size: 900,
          sizes: "(max-width: 767px) 100vw, 50vw"
        })).join("")}
      </div>
    </section>
  `;
}

function renderVideoPlayer(work) {
  if (!work.video) return "";
  return `
    <section class="video-player-block">
      <h2 class="section-title">Film</h2>
      <video src="${work.video}" controls preload="metadata" playsinline></video>
    </section>
  `;
}

function renderBilingualText(work) {
  const descriptionZh = needsContent(work.descriptionZh) ? "" : work.descriptionZh;
  const descriptionEn = needsContent(work.descriptionEn) ? "" : work.descriptionEn;
  if (!descriptionZh && !descriptionEn) return "";
  return `
    <section class="bilingual-text">
      ${descriptionZh ? `<div>
        <h2 class="section-title">中文介绍</h2>
        <p>${descriptionZh}</p>
      </div>` : ""}
      ${descriptionEn ? `<div>
        <h2 class="section-title">English</h2>
        <p>${descriptionEn}</p>
      </div>` : ""}
    </section>
  `;
}

function renderPdfLink(work) {
  if (!work.pdf) return "";
  return `
    <p class="archive-link"><a href="${work.pdf}">PDF Archive</a></p>
  `;
}

function renderPrevNext(previous, next) {
  return `
    <nav class="prev-next" aria-label="Work navigation">
      <a href="work.html?slug=${previous.slug}">Previous</a>
      <a href="work.html?slug=${next.slug}">Next</a>
    </nav>
  `;
}

function renderCV() {
  const el = document.querySelector("[data-cv]");
  if (!el || typeof cvEnglishSections === "undefined" || typeof cvChineseSections === "undefined") return;

  const renderSections = (sections) => sections.map((section) => `
    <section class="cv-section">
      <h2>${section.title}</h2>
      <div class="cv-entries">
        ${section.entries.map((entry) => `
          <div class="cv-entry"><span>${entry.year}</span><span>${entry.text}</span></div>
        `).join("")}
      </div>
    </section>
  `).join("");

  el.innerHTML = `
    <section class="cv-language">
      <p class="eyebrow">English Version</p>
      ${renderSections(cvEnglishSections)}
    </section>
    <section class="cv-language cv-language--zh">
      <p class="eyebrow">中文版本</p>
      ${renderSections(cvChineseSections)}
    </section>
  `;
}

function renderResearch() {
  const indexEl = document.querySelector("[data-research-index]");
  const listEl = document.querySelector("[data-research-list]");
  if (!indexEl || !listEl) return;

  indexEl.innerHTML = researchProjects.map((project) => `
    <a href="#${project.slug}">
      <div>${project.displayTitleEn || project.title}</div>
      <div class="meta">${project.displayTitle || project.titleZh || project.title}</div>
    </a>
  `).join("");

  listEl.innerHTML = researchProjects.map((project) => `
    <a class="research-card" href="research-detail.html?slug=${project.slug}" id="${project.slug}">
      ${imageTag(project.hero, project.title, "research-card__image", {
        size: 900,
        sizes: "(max-width: 767px) 100vw, 50vw"
      })}
      <div class="research-card__text">
        <strong style="font-size: clamp(18px, 2vw, 26px); line-height: 1.25;">${project.displayTitleEn || project.title}</strong>
        <span class="research-card__title-zh" style="font-size: clamp(18px, 2vw, 26px); line-height: 1.25;">${project.displayTitle || project.titleZh || project.title}</span>
        <p>${project.intro}</p>
      </div>
    </a>
  `).join("");
}

function renderResearchDetail() {
  const el = document.querySelector("[data-research-detail]");
  if (!el) return;

  const slug = new URLSearchParams(location.search).get("slug") || researchProjects[0].slug;
  const project = researchProjects.find((entry) => entry.slug === slug) || researchProjects[0];
  document.title = `${project.title} | Research | YANG HONGRU`;
  el.innerHTML = `
    <article class="research-project">
      <section class="research-hero">
        ${imageTag(project.hero, project.title, "", {
          size: 1600,
          sizes: "(max-width: 767px) 100vw, 60vw"
        })}
        <div class="research-hero__text">
          <p class="eyebrow">Research / ${project.category}</p>
          <h1 class="page-title research-title">${project.title}<span> / ${project.titleZh}</span></h1>
          <p>${project.intro}</p>
        </div>
      </section>
      ${project.artwork ? imageTag(project.artwork, project.title, "research-artwork", {
        size: 1600,
        sizes: "(max-width: 767px) 100vw, 70vw"
      }) : ""}
      <section class="research-two-column">
        <div>
          <h2 class="section-title">中文</h2>
          ${(project.statementZh || [project.introZh]).map((paragraph) => `<p>${paragraph}</p>`).join("")}
        </div>
        <div>
          <h2 class="section-title">Statement</h2>
          ${(project.statementEn || [project.intro]).map((paragraph) => `<p>${paragraph}</p>`).join("")}
        </div>
      </section>
      ${renderResearchReferences(project)}
      ${renderCuratorialNote(project)}
      ${renderResearchDetails(project)}
    </article>
  `;
}

function renderCuratorialNote(project) {
  if (!project.curatorEn && !project.curatorZh) return "";
  const curatorZh = Array.isArray(project.curatorZh) ? project.curatorZh : [project.curatorZh];
  const curatorEn = Array.isArray(project.curatorEn) ? project.curatorEn : [project.curatorEn];
  return `
    <section class="research-commentary">
      <h2 class="section-title">Curatorial Note <span>策展人评价</span></h2>
      <div class="research-two-column">
        <div>${curatorZh.map((paragraph) => `<p>${paragraph}</p>`).join("")}</div>
        <div>${curatorEn.map((paragraph) => `<p>${paragraph}</p>`).join("")}</div>
      </div>
    </section>
  `;
}

function renderResearchReferences(project) {
  const references = project.references || [];
  if (!references.length) return "";
  return `
    <section class="research-references">
      <h2 class="section-title">Research References</h2>
      <div class="research-reference-grid">
        ${references.map((reference) => `
          <figure class="research-reference research-reference--${reference.size}${reference.note ? " research-reference--with-note" : ""}">
            ${imageTag(reference.image, reference.title, "", {
              size: 900,
              sizes: "(max-width: 767px) 100vw, 33vw"
            })}
            <figcaption>
              <span>${reference.title}</span>
              ${reference.note ? `<em>${reference.note}</em>` : ""}
              ${reference.noteEn ? `<small>${reference.noteEn}</small>` : ""}
            </figcaption>
          </figure>
        `).join("")}
      </div>
    </section>
  `;
}

function renderResearchDetails(project) {
  const details = project.details || [];
  if (!details.length) return "";
  return `
    <section class="research-details">
      <h2 class="section-title">Details</h2>
      <dl class="definition-list">
        ${details.map(([key, value]) => `<dt>${key}</dt><dd>${value}</dd>`).join("")}
      </dl>
    </section>
  `;
}

setCurrentNav();
renderHome();
renderWorks();
renderWorkDetail();
renderResearch();
renderResearchDetail();
renderCV();
