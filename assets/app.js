/* ==========================================================
   CBCS Unit 4 · Shell Scripting Wiki  ·  shared behaviour
   Works from file:// (no fetch, no build step, no CDN).
   Each page sets <body data-root="../" data-page="lab04">.
   ========================================================== */
(function () {
  "use strict";

  const NAV = [
    { group: "Start", items: [
      { id: "home", href: "index.html", num: "⌂", title: "Home & how to use" },
      { id: "datasets", href: "reference/datasets.html", num: "▤", title: "Dataset library" },
      { id: "cheatsheet", href: "reference/cheatsheet.html", num: "★", title: "One-page cheat sheet" },
    ]},
    { group: "Labs", items: [
      { id: "lab01", href: "labs/lab01-multi-function.html", num: "01", title: "Multi-function scripting" },
      { id: "lab02", href: "labs/lab02-menus-colors.html", num: "02", title: "Interactive menus & colors" },
      { id: "lab03", href: "labs/lab03-remote-execution.html", num: "03", title: "Remote script execution" },
      { id: "lab04", href: "labs/lab04-json-jq.html", num: "04", title: "JSON with jq" },
      { id: "lab05", href: "labs/lab05-cloudflare-api.html", num: "05", title: "Cloudflare API" },
      { id: "lab06", href: "labs/lab06-access-logs.html", num: "06", title: "Access log analysis" },
      { id: "lab07", href: "labs/lab07-email-alerts.html", num: "07", title: "Automated email alerts" },
      { id: "lab08", href: "labs/lab08-password-generation.html", num: "08", title: "Password generation" },
      { id: "lab09", href: "labs/lab09-pipes-redirection.html", num: "09", title: "Pipes & redirection" },
      { id: "lab10", href: "labs/lab10-wordpress-lamp.html", num: "10", title: "WordPress on LAMP" },
      { id: "lab11", href: "labs/lab11-backup-retention.html", num: "11", title: "Backup & retention" },
      { id: "lab12", href: "labs/lab12-service-health.html", num: "12", title: "Service health monitoring" },
    ]},
    { group: "Command tutorials", items: [
      { id: "grep", href: "tools/grep.html", num: "$", title: "grep: search text" },
      { id: "sed", href: "tools/sed.html", num: "$", title: "sed: stream editor" },
      { id: "awk", href: "tools/awk.html", num: "$", title: "awk: column processing" },
      { id: "jq", href: "tools/jq.html", num: "$", title: "jq: JSON processor" },
      { id: "sort-uniq", href: "tools/sort-uniq.html", num: "$", title: "sort & uniq" },
      { id: "cut-tr", href: "tools/cut-tr.html", num: "$", title: "cut, tr, paste, wc, head, tail, tee" },
      { id: "find-xargs", href: "tools/find-xargs.html", num: "$", title: "find & xargs" },
      { id: "curl", href: "tools/curl.html", num: "$", title: "curl: HTTP from the shell" },
    ]},
  ];

  const body = document.body;
  const root = body.dataset.root || "";
  const pageId = body.dataset.page || "";

  /* ---------- theme ---------- */
  const THEME_KEY = "cbcs-wiki-theme";
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
    '<a class="brand" href="' + root + 'index.html">CBCS Unit&nbsp;4 <span>Shell Wiki</span></a>' +
    '<div class="spacer"></div>' +
    '<button class="icon-btn theme-btn" aria-label="Toggle dark mode"></button>';
  body.insertBefore(topbar, body.firstChild);

  const layout = document.createElement("div");
  layout.className = "layout";
  const sidebar = document.createElement("nav");
  sidebar.className = "sidebar";
  let navHTML = '<input type="search" placeholder="Filter pages…  ( / )" aria-label="Filter pages">';
  let flat = [];
  const COLLAPSE_KEY = "cbcs-wiki-collapsed";
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

  // mobile menu
  // menu button: slide-in drawer on phones, hide/show sidebar on desktop (remembered)
  const SIDE_KEY = "cbcs-wiki-sidebar-hidden";
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
  const BASH_KW = "if|then|else|elif|fi|for|while|until|do|done|case|esac|function|in|return|local|declare|readonly|export|select|break|continue|exit|shift|trap|source|set|unset|eval|exec|getopts|BEGIN|END|next|getline|def|reduce|foreach|as|and|or|not|try|catch";
  const BASH_FN = "echo|printf|read|grep|egrep|sed|awk|jq|sort|uniq|cut|tr|paste|wc|head|tail|tee|find|xargs|curl|ssh|scp|rsync|tar|gzip|mysql|mysqldump|systemctl|mail|mailx|sendmail|openssl|date|cat|ls|cp|mv|rm|mkdir|chmod|chown|tput|column|test|wget|sleep|kill|ps|df|du|free|nc|ping|apt|dnf|yum|sudo|basename|dirname|mktemp|logger|crontab|select|length|map|keys|values|has|split|gsub|sub|substr|tolower|toupper|index|match|sprintf|strftime|tonumber|tostring|group_by|sort_by|unique|min_by|max_by|add|to_entries|from_entries|with_entries|first|last|empty|range|test|ascii_downcase|ascii_upcase|join|del|paths|env|ltrimstr|rtrimstr|startswith|endswith|contains|any|all|flatten|limit|unique_by|getline|close|system|fflush";
  const RX = {
    bash: new RegExp(
      "(?<com>(?<=^|[\\s;])#[^\\n]*)" +
      "|(?<str>\"(?:\\\\.|[^\"\\\\])*\")" +
      "|(?<var>\\$\\{[^}\\n]*\\}|\\$\\([^)\\n]{0,0}|\\$[A-Za-z_][A-Za-z0-9_]*|\\$[0-9#?@*$!]|\\b[A-Z_][A-Z0-9_]{2,}(?==))" +
      "|(?<kw>\\b(?:" + BASH_KW + ")\\b)" +
      "|(?<fn>(?<![\\w./-])(?:" + BASH_FN + ")(?![\\w-]))" +
      "|(?<num>\\b\\d+(?:\\.\\d+)?\\b)", "gm"),
    json: /(?<key>"(?:\\.|[^"\\])*"(?=\s*:))|(?<str>"(?:\\.|[^"\\])*")|(?<num>-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|(?<kw>\b(?:true|false|null)\b)/g,
  };
  RX.awk = RX.bash; RX.jq = RX.bash; RX.sh = RX.bash; RX.shell = RX.bash;
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
