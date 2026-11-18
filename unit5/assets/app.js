/* ==========================================================
   CBCS Unit 5 · PowerShell Wiki  ·  shared behaviour
   Works from file:// (no fetch, no build step, no CDN).
   Each page sets <body data-root="../" data-page="t05">.
   ========================================================== */
(function () {
  "use strict";

  const NAV = [
    { group: "Start", items: [
      { id: "home", href: "index.html", num: "⌂", title: "Home & study path" },
      { id: "cheatsheet", href: "reference/cheatsheet.html", num: "★", title: "One-page cheat sheet" },
      { id: "datasets", href: "reference/datasets.html", num: "▤", title: "Practice files" },
    ]},
    { group: "Fundamentals", items: [
      { id: "f1", href: "basics/f1-what-is-a-shell.html", num: "F1", title: "What is a shell?" },
      { id: "f2", href: "basics/f2-install-and-open.html", num: "F2", title: "Install & open PowerShell" },
      { id: "f3", href: "basics/f3-first-commands.html", num: "F3", title: "First commands & navigation" },
      { id: "f4", href: "basics/f4-files-and-folders.html", num: "F4", title: "Files & folders" },
      { id: "f5", href: "basics/f5-objects.html", num: "F5", title: "Objects in 5 minutes" },
    ]},
    { group: "Topics", items: [
      { id: "t01", href: "notes/t01-introduction.html", num: "01", title: "Introduction to PowerShell" },
      { id: "t02", href: "notes/t02-console-ise.html", num: "02", title: "Console & ISE" },
      { id: "t03", href: "notes/t03-cmdlets.html", num: "03", title: "Cmdlets" },
      { id: "t04", href: "notes/t04-help.html", num: "04", title: "Working with help" },
      { id: "t05", href: "notes/t05-pipelines.html", num: "05", title: "Pipelines" },
      { id: "t06", href: "notes/t06-writing-scripts.html", num: "06", title: "Writing scripts" },
      { id: "t07", href: "notes/t07-comments.html", num: "07", title: "Comments" },
      { id: "t08", href: "notes/t08-variables.html", num: "08", title: "Variables" },
      { id: "t09", href: "notes/t09-user-input.html", num: "09", title: "User input" },
      { id: "t10", href: "notes/t10-operators.html", num: "10", title: "Operators" },
      { id: "t11", href: "notes/t11-conditionals.html", num: "11", title: "if, else & switch" },
      { id: "t12", href: "notes/t12-loops.html", num: "12", title: "Loops" },
      { id: "t13", href: "notes/t13-arrays.html", num: "13", title: "Arrays" },
      { id: "t14", href: "notes/t14-hashtables.html", num: "14", title: "Hashtables" },
      { id: "t15", href: "notes/t15-functions.html", num: "15", title: "Functions" },
      { id: "t16", href: "notes/t16-scoping.html", num: "16", title: "Scoping" },
      { id: "t17", href: "notes/t17-error-handling.html", num: "17", title: "Basic error handling" },
      { id: "t18", href: "notes/t18-profiles.html", num: "18", title: "Profiles" },
      { id: "t19", href: "notes/t19-script-files.html", num: "19", title: "Script files" },
    ]},
    { group: "Labs", items: [
      { id: "lab01", href: "labs/lab01-console-and-help.html", num: "L1", title: "Explore the console & help" },
      { id: "lab02", href: "labs/lab02-system-report.html", num: "L2", title: "System report with pipelines" },
      { id: "lab03", href: "labs/lab03-first-script.html", num: "L3", title: "First script: greet & calculate" },
      { id: "lab04", href: "labs/lab04-grade-calculator.html", num: "L4", title: "Grade calculator" },
      { id: "lab05", href: "labs/lab05-loops.html", num: "L5", title: "Loop practice" },
      { id: "lab06", href: "labs/lab06-arrays-hashtables.html", num: "L6", title: "Student marks & inventory" },
      { id: "lab07", href: "labs/lab07-functions.html", num: "L7", title: "Build a function toolkit" },
      { id: "lab08", href: "labs/lab08-error-handling.html", num: "L8", title: "Safe file backup" },
      { id: "lab09", href: "labs/lab09-profile.html", num: "L9", title: "Customise your profile" },
      { id: "lab10", href: "labs/lab10-mini-project.html", num: "L10", title: "Mini project: admin menu" },
    ]},
  ];

  const body = document.body;
  const root = body.dataset.root || "";
  const pageId = body.dataset.page || "";

  /* ---------- theme ---------- */
  const THEME_KEY = "cbcs-u5-theme";
  function getStored(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function setStored(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  const savedTheme = getStored(THEME_KEY);
  if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);
  function isDark() {
    const t = document.documentElement.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  /* ---------- shell: topbar + sidebar + toc ---------- */
  const article = document.querySelector("article");
  const main = document.querySelector("main.content") || article.parentElement;

  const topbar = document.createElement("header");
  topbar.className = "topbar";
  topbar.innerHTML =
    '<button class="icon-btn menu-btn" aria-label="Show or hide the menu" title="Show / hide menu">☰</button>' +
    '<a class="brand" href="' + root + 'index.html">CBCS Unit&nbsp;5 <span>PowerShell Wiki</span></a>' +
    '<div class="spacer"></div>' +
    '<button class="icon-btn theme-btn" aria-label="Toggle dark mode"></button>';
  body.insertBefore(topbar, body.firstChild);

  const layout = document.createElement("div");
  layout.className = "layout";
  const sidebar = document.createElement("nav");
  sidebar.className = "sidebar";
  let navHTML = '<input type="search" placeholder="Filter pages…  ( / )" aria-label="Filter pages">';
  let flat = [];
  const COLLAPSE_KEY = "cbcs-u5-collapsed";
  let collapsed = {};
  try { collapsed = JSON.parse(getStored(COLLAPSE_KEY) || "{}") || {}; } catch (e) {}
  NAV.forEach(g => {
    const hasActive = g.items.some(it => it.id === pageId);
    const isClosed = collapsed[g.group] && !hasActive;
    navHTML += '<div class="nav-group' + (isClosed ? " collapsed" : "") + '" data-group="' + g.group + '">' +
      '<button type="button" class="nav-toggle" aria-expanded="' + !isClosed + '">' +
      '<span class="chev" aria-hidden="true">▾</span>' + g.group + '<span class="count">' + g.items.length + "</span></button>" +
      '<div class="nav-items">';
    g.items.forEach(it => {
      flat.push(it);
      navHTML += '<a href="' + root + it.href + '" data-id="' + it.id + '"' + (it.id === pageId ? ' class="active"' : "") +
        '><span class="num">' + it.num + "</span><span>" + it.title + "</span></a>";
    });
    navHTML += "</div></div>";
  });
  navHTML += '<div class="nav-actions"><button type="button" data-act="expand">Expand all</button>' +
    '<button type="button" data-act="collapse">Collapse all</button></div>';
  sidebar.innerHTML = navHTML;

  function saveCollapsed() {
    const state = {};
    sidebar.querySelectorAll(".nav-group").forEach(g => { if (g.classList.contains("collapsed")) state[g.dataset.group] = 1; });
    setStored(COLLAPSE_KEY, JSON.stringify(state));
  }
  function setGroup(g, closed) {
    g.classList.toggle("collapsed", closed);
    g.querySelector(".nav-toggle").setAttribute("aria-expanded", String(!closed));
  }
  sidebar.addEventListener("click", e => {
    const t = e.target.closest(".nav-toggle");
    if (t) { const g = t.parentElement; setGroup(g, !g.classList.contains("collapsed")); saveCollapsed(); return; }
    const a = e.target.closest(".nav-actions button");
    if (a) { sidebar.querySelectorAll(".nav-group").forEach(g => setGroup(g, a.dataset.act === "collapse")); saveCollapsed(); }
  });

  const toc = document.createElement("aside");
  toc.className = "toc";

  main.parentNode.insertBefore(layout, main);
  layout.appendChild(sidebar);
  layout.appendChild(main);
  layout.appendChild(toc);

  // nav filter
  const search = sidebar.querySelector("input");
  search.addEventListener("input", () => {
    const q = search.value.toLowerCase().trim();
    sidebar.classList.toggle("filtering", !!q);
    sidebar.querySelectorAll(".nav-group").forEach(g => {
      let any = false;
      g.querySelectorAll("a").forEach(a => {
        const hit = !q || a.textContent.toLowerCase().includes(q);
        a.style.display = hit ? "" : "none"; any = any || hit;
      });
      g.style.display = any ? "" : "none";
    });
  });
  document.addEventListener("keydown", e => {
    if (e.key === "/" && document.activeElement.tagName !== "INPUT") { e.preventDefault(); search.focus(); }
  });
  const activeLink = sidebar.querySelector("a.active");
  if (activeLink) activeLink.scrollIntoView({ block: "center" });

  // menu button: slide-in drawer on phones, hide/show sidebar on desktop (remembered)
  const SIDE_KEY = "cbcs-u5-sidebar-hidden";
  const mobileMQ = window.matchMedia("(max-width: 860px)");
  if (getStored(SIDE_KEY) === "1") body.classList.add("side-hidden");
  topbar.querySelector(".menu-btn").addEventListener("click", () => {
    if (mobileMQ.matches) { body.classList.toggle("nav-open"); return; }
    const hidden = body.classList.toggle("side-hidden");
    setStored(SIDE_KEY, hidden ? "1" : "0");
  });
  main.addEventListener("click", () => body.classList.remove("nav-open"));

  // theme button
  const themeBtn = topbar.querySelector(".theme-btn");
  function paintThemeBtn() { themeBtn.textContent = isDark() ? "☀ Light" : "☾ Dark"; }
  paintThemeBtn();
  themeBtn.addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    setStored(THEME_KEY, next); paintThemeBtn();
  });

  /* ---------- table of contents ---------- */
  function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  const heads = article.querySelectorAll("h2, h3");
  if (heads.length > 1) {
    let tocHTML = "<h4>On this page</h4>";
    const used = {};
    heads.forEach(h => {
      if (!h.id) { let id = slug(h.textContent) || "s"; while (used[id]) id += "-x"; h.id = id; }
      used[h.id] = 1;
      tocHTML += '<a href="#' + h.id + '" class="' + h.tagName.toLowerCase() + '">' + h.textContent.replace(/</g, "&lt;") + "</a>";
    });
    toc.innerHTML = tocHTML;
    const links = toc.querySelectorAll("a");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id));
        }
      });
    }, { rootMargin: "-70px 0px -70% 0px" });
    heads.forEach(h => obs.observe(h));
  }

  /* ---------- prev / next ---------- */
  const idx = flat.findIndex(i => i.id === pageId);
  if (idx !== -1) {
    const prev = flat[idx - 1], next = flat[idx + 1];
    const pager = document.createElement("div");
    pager.className = "pager";
    pager.innerHTML =
      (prev ? '<a class="prev" href="' + root + prev.href + '"><small>← Previous</small>' + prev.title + "</a>" : "<span></span>") +
      (next ? '<a class="next" href="' + root + next.href + '"><small>Next →</small>' + next.title + "</a>" : "");
    article.appendChild(pager);
  }

  /* ---------- syntax highlighting (tiny, offline) ---------- */
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  const PS_KW = "if|elseif|else|switch|foreach|for|while|do|until|function|filter|param|begin|process|end|return|break|continue|exit|try|catch|finally|throw|trap|in|class|default";
  const RX = {
    powershell: new RegExp(
      "(?<com><#[\\s\\S]*?#>|(?<=^|[\\s;(])#[^\\n]*)" +
      "|(?<str>\"(?:`.|[^\"`])*\"|'(?:''|[^'])*')" +
      "|(?<var>\\$(?:env:|script:|global:|local:|using:)?[A-Za-z_][A-Za-z0-9_]*|\\$[_?^$]|\\$\\{[^}\\n]*\\})" +
      "|(?<attr>(?<![\\w])-(?:eq|ne|gt|ge|lt|le|like|notlike|match|notmatch|contains|notcontains|in|notin|and|or|not|xor|replace|split|join|is|isnot|as|ceq|cne|f)\\b)" +
      "|(?<kw>\\b(?:" + PS_KW + ")\\b)" +
      "|(?<fn>\\b[A-Z][a-zA-Z]+-[A-Z][A-Za-z0-9]+\\b)" +
      "|(?<key>\\[[A-Za-z][\\w.]*(?:\\[\\])?\\])" +
      "|(?<num>\\b\\d+(?:\\.\\d+)?(?:KB|MB|GB)?\\b)", "gm"),
    json: /(?<key>"(?:\\.|[^"\\])*"(?=\s*:))|(?<str>"(?:\\.|[^"\\])*")|(?<num>-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|(?<kw>\b(?:true|false|null)\b)/g,
  };
  RX.ps = RX.powershell; RX.ps1 = RX.powershell;
  function highlight(code, lang) {
    const rx = RX[lang];
    if (!rx) return esc(code);
    let out = "", last = 0;
    rx.lastIndex = 0;
    let m;
    while ((m = rx.exec(code))) {
      if (m[0] === "") { rx.lastIndex++; continue; }
      const g = m.groups; let cls = null;
      for (const k in g) if (g[k] !== undefined) { cls = k; break; }
      out += esc(code.slice(last, m.index)) + '<span class="tk-' + cls + '">' + esc(m[0]) + "</span>";
      last = m.index + m[0].length;
    }
    return out + esc(code.slice(last));
  }
  document.querySelectorAll("pre code").forEach(c => {
    const m = (c.className || "").match(/language-(\w+)/);
    const lang = m ? m[1] : "";
    if (RX[lang]) c.innerHTML = highlight(c.textContent, lang);
  });

  /* ---------- copy buttons + dataset line counts ---------- */
  document.querySelectorAll(".code, .dataset, .output").forEach(box => {
    const head = box.querySelector(".code-head, .ds-head, .out-head");
    const pre = box.querySelector("pre");
    if (!head || !pre) return;
    if (box.classList.contains("dataset") && !head.querySelector(".ds-info")) {
      const n = pre.textContent.replace(/\n$/, "").split("\n").length;
      const info = document.createElement("span");
      info.className = "ds-info"; info.textContent = n + " lines";
      head.appendChild(info);
    }
    const btn = document.createElement("button");
    btn.className = "copy-btn"; btn.type = "button"; btn.textContent = "Copy";
    btn.addEventListener("click", () => {
      const text = pre.textContent;
      const done = () => { btn.textContent = "Copied ✓"; setTimeout(() => (btn.textContent = "Copy"), 1400); };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
      else fallback();
      function fallback() {
        const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta);
        ta.select(); try { document.execCommand("copy"); done(); } catch (e) {} ta.remove();
      }
    });
    head.appendChild(btn);
  });
})();
