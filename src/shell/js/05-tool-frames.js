// ---- picture helpers shared by every tool (runs at the top of each tool's page) ----
function ptFrameInit() {
  var P = window.parent;
  try {
    P.ptInstallMeta && P.ptInstallMeta(window);
    P.ptInstallImgTheme && P.ptInstallImgTheme(window);
  } catch (e) {}
  try {
    if (P.ptAccentCSS) {
      var acs = document.createElement("style");
      acs.id = "pt-acc";
      acs.textContent = P.ptAccentCSS();
      (document.head || document.documentElement).appendChild(acs);
    }
  } catch (e) {}
  try {
    var th = P.document.documentElement.getAttribute("data-theme");
    if (th) document.documentElement.setAttribute("data-theme", th);
  } catch (e) {}
  document.addEventListener(
    "keydown",
    function (e) {
      try {
        P.ptHotkey && P.ptHotkey(e, document);
      } catch (x) {}
    },
    true,
  );
  var PTID = null;
  try {
    PTID = P.ptFrameId && P.ptFrameId(window);
  } catch (e) {}
  function ptCfg() {
    try {
      return P.ptSettings ? P.ptSettings() : {};
    } catch (e) {
      return {};
    }
  }
  // remember where you were in each tool
  if (PTID) {
    var sT = 0;
    window.addEventListener(
      "scroll",
      function () {
        clearTimeout(sT);
        sT = setTimeout(function () {
          if (ptCfg().scroll === false) return;
          try {
            var m = JSON.parse(localStorage.getItem("pt-scroll") || "{}");
            m[PTID] = Math.round(scrollY);
            localStorage.setItem("pt-scroll", JSON.stringify(m));
          } catch (e) {}
        }, 200);
      },
      { passive: true },
    );
    window.addEventListener("load", function () {
      if (ptCfg().scroll === false) return;
      var y = 0;
      try {
        y = JSON.parse(localStorage.getItem("pt-scroll") || "{}")[PTID] || 0;
      } catch (e) {}
      if (!y) return;
      var n = 0;
      (function go() {
        scrollTo(0, y);
        if (Math.abs(scrollY - y) > 2 && n++ < 12) setTimeout(go, 120);
      })();
    });
  }
  // short numbers: $1,000,000,000 becomes $1B, the full number shows on hover
  var NUMRE = /(\d{1,3}(?:,\d{3}){2,})(\.\d+)?/g,
    UN = [
      ["Qi", 1e18],
      ["Qa", 1e15],
      ["T", 1e12],
      ["B", 1e9],
      ["M", 1e6],
    ];
  function ptShortN(n, dec) {
    for (var i = 0; i < UN.length; i++)
      if (n >= UN[i][1]) {
        var v = (n / UN[i][1]).toFixed(dec);
        if (v.indexOf(".") >= 0) v = v.replace(/0+$/, "").replace(/\.$/, "");
        return v + UN[i][0];
      }
    return null;
  }
  var SKIP = "SCRIPT,STYLE,TEXTAREA,INPUT,SELECT,OPTION,CODE,PRE,SVG,TITLE";
  function ptNumApply() {
    var c = ptCfg();
    if (!c.short || !document.body) return;
    var dec = +c.dec;
    if (!(dec >= 0)) dec = 2;
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (t) {
        if (!t.data || t.data.length < 9 || !/\d,\d{3},\d{3}/.test(t.data)) return 2;
        for (var e = t.parentElement; e; e = e.parentElement) {
          if (
            SKIP.indexOf(e.tagName) >= 0 ||
            e.isContentEditable ||
            e.classList.contains("pt-num") ||
            e.classList.contains("pt-noshort")
          )
            return 2;
        }
        return 1;
      },
    });
    var list = [],
      t;
    while ((t = w.nextNode())) list.push(t);
    list.forEach(function (t) {
      var s = t.data,
        f = document.createDocumentFragment(),
        last = 0,
        m;
      NUMRE.lastIndex = 0;
      while ((m = NUMRE.exec(s))) {
        var n = parseFloat(m[0].replace(/,/g, ""));
        var sh = ptShortN(n, dec);
        if (!sh) continue;
        f.appendChild(document.createTextNode(s.slice(last, m.index)));
        var sp = document.createElement("span");
        sp.className = "pt-num";
        sp.dataset.full = m[0];
        sp.title = (s.charAt(m.index - 1) === "$" ? "$" : "") + m[0];
        sp.textContent = sh;
        f.appendChild(sp);
        last = m.index + m[0].length;
      }
      if (last) {
        f.appendChild(document.createTextNode(s.slice(last)));
        t.parentNode.replaceChild(f, t);
      }
    });
  }
  function ptNumClear() {
    document.querySelectorAll(".pt-num").forEach(function (sp) {
      var p = sp.parentNode;
      p.replaceChild(document.createTextNode(sp.dataset.full), sp);
      p.normalize();
    });
  }
  window.ptNumRefresh = function () {
    ptNumClear();
    ptNumApply();
  };
  window.ptK = function (n) {
    var m = {
      Luck: "luck",
      Capacity: "cap",
      "Size Boost": "size",
      "Dig Strength": "digstr",
      "Dig Speed": "digspd",
      "Sell Boost": "sell",
      "Walk Speed": "walk",
      "Modifier Boost": "mod",
      "Shake Strength": "shkstr",
      "Shake Speed": "shkspd",
      "Inventory Size": "inv",
      "Jump Power": "jump",
    }[n];
    return m ? "var(--k-" + m + ")" : "";
  };
  try {
    if (P.ptCompactOn && P.ptCompactOn()) document.documentElement.setAttribute("data-compact", "");
  } catch (e) {}
  window.ptBig = function (u) {
    try {
      return P.ptBig(u);
    } catch (e) {
      return u;
    }
  };
  window.ptIc = function (n, k) {
    var u = "";
    try {
      u = P.ptIcon(k || "Mineral", n);
    } catch (e) {}
    return u ? '<img class="pti" src="' + u + '" alt="">' : "";
  };
  window.ptRecent = function (k, n) {
    try {
      P.ptRecent(k, n);
    } catch (e) {}
  };
  var css =
    ".pti{width:1.4em;height:1.4em;object-fit:contain;vertical-align:-.38em;margin-right:.3em;flex:none}" +
    ".pt-acts{display:inline-flex;flex-wrap:wrap;gap:6px;align-items:center;justify-content:flex-end;margin-left:auto;max-width:100%}" +
    "[data-pta]{display:inline-flex!important;align-items:center;gap:6px;height:32px;box-sizing:border-box;margin:0!important;padding:0 12px!important;border-radius:8px!important;font-size:13px!important;font-weight:600!important;line-height:1!important;white-space:nowrap;border:1px solid var(--line,rgba(127,127,127,.4))!important;background:var(--panel,transparent)!important;color:var(--fg,inherit)!important;cursor:pointer;width:auto!important;box-shadow:none!important}" +
    '[data-pta]:hover{border-color:var(--accent,currentColor)!important}[data-pta]::before{content:"";width:14px;height:14px;flex:none;background:currentColor;-webkit-mask:var(--pti) center/contain no-repeat;mask:var(--pti) center/contain no-repeat}' +
    "[data-pta=img]{color:var(--accent,inherit)!important;border-color:var(--accent,currentColor)!important}[data-pta=tg]{border-radius:999px!important}" +
    "label[data-pta] input{position:absolute;opacity:0;width:1px;height:1px;pointer-events:none}label[data-pta]:has(input:checked){background:var(--accent)!important;border-color:var(--accent)!important;color:var(--bg,#fff)!important}label[data-pta]:has(input:focus-visible){outline:2px solid var(--accent);outline-offset:2px}" +
    "[data-pta=img]{--pti:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='16' rx='2'/%3E%3Ccircle cx='9' cy='10' r='2'/%3E%3Cpath d='M21 17l-5-5-8 8'/%3E%3C/svg%3E\")}" +
    "[data-pta=dl]{--pti:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 4v11M7 10l5 5 5-5M4 20h16'/%3E%3C/svg%3E\")}" +
    "[data-pta=imp]{--pti:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 15V4M7 9l5-5 5 5M4 20h16'/%3E%3C/svg%3E\")}" +
    "[data-pta=open]{--pti:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5'/%3E%3C/svg%3E\")}" +
    "[data-pta=copy]{--pti:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='8' y='8' width='12' height='12' rx='2'/%3E%3Cpath d='M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3'/%3E%3C/svg%3E\")}" +
    "[data-pta=save]{--pti:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 3h12v18l-6-4-6 4z'/%3E%3C/svg%3E\")}" +
    "[data-pta=add]{--pti:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 5v14M5 12h14'/%3E%3C/svg%3E\")}" +
    "[data-pta=clr]{--pti:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13'/%3E%3C/svg%3E\")}" +
    "[data-pta=tg]{--pti:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3C/svg%3E\")}" +
    ":root{--k-luck:#2f8f1f;--k-cap:#b5700f;--k-size:#c53030;--k-digstr:#c2552f;--k-digspd:#2a6fb8;--k-sell:#9a7a00;--k-walk:#5d6670;--k-mod:#1f8f5a;--k-shkstr:#b5486a;--k-shkspd:#6b4fc0;--k-inv:#8a5a2b;--k-jump:#5d6670;--kon:#fff}" +
    "@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--k-luck:#86f34a;--k-cap:#f0b44a;--k-size:#ff6b6b;--k-digstr:#ff9d7f;--k-digspd:#8ecbff;--k-sell:#ffd21f;--k-walk:#d6dbe0;--k-mod:#39e06a;--k-shkstr:#ff8fb1;--k-shkspd:#b9a6ff;--k-inv:#e0b07a;--k-jump:#d6dbe0;--kon:#14181c}}" +
    ":root[data-theme=dark]{--k-luck:#86f34a;--k-cap:#f0b44a;--k-size:#ff6b6b;--k-digstr:#ff9d7f;--k-digspd:#8ecbff;--k-sell:#ffd21f;--k-walk:#d6dbe0;--k-mod:#39e06a;--k-shkstr:#ff8fb1;--k-shkspd:#b9a6ff;--k-inv:#e0b07a;--k-jump:#d6dbe0;--kon:#14181c}" +
    "select:not([multiple]):not([size]){background-color:var(--panel)!important;color:var(--fg)!important;-webkit-appearance:none!important;appearance:none!important;padding-right:28px!important;cursor:pointer;background-image:linear-gradient(45deg,transparent 50%,var(--muted,#888) 50%),linear-gradient(135deg,var(--muted,#888) 50%,transparent 50%)!important;background-position:calc(100% - 15px) 50%,calc(100% - 11px) 50%!important;background-size:4px 4px,4px 4px!important;background-repeat:no-repeat!important}" +
    "select:not(:disabled):hover{border-color:var(--accent)!important}select option{background-color:var(--panel,#fff);color:var(--fg,#000)}" +
    ".chip.r[aria-pressed=true]{background:var(--rc)!important;border-color:var(--rc)!important;color:var(--bg)!important}" +
    ".chip.pt-k{font-size:11.5px!important;padding:3px 9px!important;color:var(--kc,var(--fg))!important}.chip.pt-k[aria-pressed=true]{background:var(--kc,var(--accent))!important;border-color:var(--kc,var(--accent))!important;color:var(--kon)!important}" +
    ".chip.pt-k.pt-any{color:var(--fg)!important;--kc:var(--accent)}.chip.pt-k.pt-any[aria-pressed=true]{color:var(--bg)!important}" +
    "input[type=text],input[type=search],input[type=number],input:not([type]),textarea{background-color:var(--panel)!important}input[type=checkbox]{accent-color:var(--accent)}" +
    ":root[data-compact] h2{font-size:1.02rem!important}:root[data-compact] h3{font-size:.95rem!important}:root[data-compact] .chips,:root[data-compact] .frow,:root[data-compact] .cfr{gap:5px!important}:root[data-compact] .chip.sm,:root[data-compact] .chip.pt-k{padding:2px 8px!important;font-size:11px!important}" +
    ":root[data-compact] .mcards{gap:6px!important;grid-template-columns:repeat(auto-fill,minmax(130px,1fr))!important}:root[data-compact] .mc{padding:6px 9px!important;gap:1px!important}:root[data-compact] .mc b{font-size:.98rem!important}:root[data-compact] .mc .x{font-size:1.1rem!important}:root[data-compact] .mc small{font-size:11px!important}:root[data-compact] .top{gap:6px!important}:root[data-compact] [data-pta]{height:28px;padding:0 10px!important;font-size:12px!important}" +
    ".pt-num{cursor:help;text-decoration:underline dotted color-mix(in srgb,currentColor 40%,transparent);text-underline-offset:3px}" +
    ":root[data-compact] body{font-size:14px;line-height:1.35}:root[data-compact] .wrap{gap:10px!important;padding-block:12px 32px!important}:root[data-compact] .card{padding:10px 12px!important;gap:8px!important}:root[data-compact] h1{font-size:1.5rem!important}:root[data-compact] .lede{display:none!important}" +
    ":root[data-compact] td,:root[data-compact] th{padding-top:4px!important;padding-bottom:4px!important}:root[data-compact] .chip{padding:3px 9px!important}@media (min-width:861px){:root[data-compact] .row[data-n]{height:56px!important}:root[data-compact] .row[data-n] .c.ic img{width:40px!important;height:40px!important;object-fit:contain}}:root[data-compact] .psec{gap:5px!important}" +
    ".ph .icon{position:relative;overflow:hidden;isolation:isolate;--glow:var(--rc,var(--gc,var(--accent)));background:radial-gradient(circle at 50% 52%,color-mix(in srgb,var(--glow) 42%,transparent) 0,color-mix(in srgb,var(--glow) 14%,transparent) 48%,transparent 72%),var(--sunk)!important;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--glow) 35%,transparent),0 0 22px -6px color-mix(in srgb,var(--glow) 55%,transparent)}" +
    ".ph .icon img{position:relative;z-index:1;filter:drop-shadow(0 4px 10px color-mix(in srgb,var(--glow) 45%,transparent))}" +
    ".ph .icon.pt-shine::after{content:'';position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.38) 48%,rgba(255,255,255,.05) 56%,transparent 70%);background-size:260% 100%;animation:ptsh 3.4s ease-in-out infinite;mix-blend-mode:soft-light}" +
    ".ph .icon.pt-shine{animation:ptgl 3.4s ease-in-out infinite}" +
    "@keyframes ptsh{0%{background-position:130% 0}55%,100%{background-position:-30% 0}}@keyframes ptgl{0%,100%{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--glow) 35%,transparent),0 0 18px -6px color-mix(in srgb,var(--glow) 50%,transparent)}50%{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--glow) 60%,transparent),0 0 30px -4px color-mix(in srgb,var(--glow) 75%,transparent)}}" +
    "@media (prefers-reduced-motion:reduce){.ph .icon.pt-shine,.ph .icon.pt-shine::after{animation:none}}" +
    "@media (prefers-color-scheme:light){:root:not([data-theme=dark]) img[src^='data:image/webp']{filter:drop-shadow(0 0 .7px rgba(15,20,28,.55))}}:root[data-theme=light] img[src^='data:image/webp']{filter:drop-shadow(0 0 .7px rgba(15,20,28,.55))}";

  var ACT = [
    ["tg", /^(hide|show|only show)\b(?!.*(more|limited))/i],
    ["clr", /^clear( board)?$/i],
    ["open", /^(open|use) in\b/i],
    ["save", /^(save to my|add to build)/i],
    ["copy", /^copy\b/i],
    ["imp", /^import\b/i],
    ["dl", /^download\b/i],
    ["img", /^(save as image|copy image|copy & save image)$/i],
  ];
  function ptKind(e) {
    var t = (e.textContent || "").trim();
    if (e.tagName === "LABEL" && !e.classList.contains("btn")) return null;
    for (var i = 0; i < ACT.length; i++) if (ACT[i][1].test(t)) return ACT[i][0];
    return null;
  }
  function ptShine() {
    var ic = document.querySelectorAll(".ph .icon");
    for (var i = 0; i < ic.length; i++) {
      var ph = ic[i].closest(".ph"),
        r = ph && ph.querySelector(".rr");
      ic[i].classList.toggle("pt-shine", !!r && /\b(exotic|mythic)\b/i.test(r.textContent));
    }
  }
  function ptImgLabels() {
    var m = ptCfg().img || "save",
      t = m === "copy" ? "Copy image" : m === "both" ? "Copy & save image" : "Save as image";
    var b = document.querySelectorAll("[data-pta=img]");
    for (var i = 0; i < b.length; i++) {
      var e = b[i];
      if (/^(save as image|copy image|copy & save image)$/i.test(e.textContent.trim()) && e.textContent.trim() !== t)
        e.textContent = t;
    }
  }
  window.ptImgLabels = ptImgLabels;
  function ptActs() {
    ptShine();
    try {
      ptNumApply();
    } catch (e) {}
    var els = document.querySelectorAll("button,label");
    var groups = new Map();
    for (var i = 0; i < els.length; i++) {
      var e = els[i];
      if (e.closest(".sheet,.pt-noacts")) continue;
      var k = e.dataset.pta || ptKind(e);
      if (!k) continue;
      e.dataset.pta = k;
      var par = e.parentElement;
      if (par && par.classList.contains("pt-acts")) continue;
      if (!groups.has(par)) groups.set(par, []);
      groups.get(par).push(e);
    }
    groups.forEach(function (list, par) {
      var w = document.createElement("span");
      w.className = "pt-acts";
      par.insertBefore(w, list[0]);
      var ord = ACT.map(function (a) {
        return a[0];
      });
      list.sort(function (a, b) {
        return ord.indexOf(a.dataset.pta) - ord.indexOf(b.dataset.pta);
      });
      list.forEach(function (e) {
        w.appendChild(e);
      });
    });
    try {
      ptImgLabels();
    } catch (e) {}
    document.querySelectorAll("[data-ptopt]").forEach(function (o) {
      var w = o.parentElement && o.parentElement.querySelector(":scope>.pt-acts");
      if (!w) return;
      var im = w.querySelector("[data-pta=img]");
      w.insertBefore(o, im || null);
    });
  }
  var ptT = 0;
  function ptSoon() {
    clearTimeout(ptT);
    ptT = setTimeout(ptActs, 60);
  }
  document.addEventListener("DOMContentLoaded", function () {
    ptActs();
    new MutationObserver(ptSoon).observe(document.body, { childList: true, subtree: true });
  });
  var st = document.createElement("style");
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var skip = "button,a,label,select,input,[role=option],[role=button],[data-i],[data-pick],[data-open]";
  document.addEventListener(
    "mouseover",
    function (e) {
      var im = e.target;
      if (!im || im.tagName !== "IMG" || im.dataset.ptc) return;
      var w = null;
      try {
        w = P.ptImgWho(im.src);
      } catch (_) {}
      if (!w || im.closest(skip) || getComputedStyle(im).cursor === "pointer") {
        im.dataset.ptc = "0";
        return;
      }
      im.dataset.ptc = "1";
      im.style.cursor = "zoom-in";
      if (!im.title) im.title = "Open " + w.name;
    },
    true,
  );
  document.addEventListener(
    "click",
    function (e) {
      var im = e.target;
      if (!im || im.tagName !== "IMG" || im.dataset.ptc !== "1") return;
      e.preventDefault();
      e.stopPropagation();
      try {
        P.ptOpenWho(P.ptImgWho(im.src));
      } catch (_) {}
    },
    true,
  );
  // every dropdown (<select>) on desktop: the toolkit's own list instead of the browser's, in the tool's theme.
  // Mutation pickers (<select data-ptmut>) also show what each mutation does when you hover it.
  // Phones keep the normal picker; <select data-native> opts out.
  (function () {
    var MU = {};
    try {
      (P.PTDATA.ench.muts || []).forEach(function (m) {
        MU[m.n] = m;
      });
    } catch (e) {}
    var COL = { Silver: "#a9b4be", Gold: "#d9a520", Diamond: "#5fc8e8", Granite: "#b08d64", Overclocked: "#6b8cff", Festive: "#e05555", Prismatic: "#d24fc0" };
    var PCT = { "Shake Speed": 1, "Dig Speed": 1, "Size Boost": 1, "Modifier Boost": 1, "Sell Boost": 1 };
    var esc = function (t) {
      return String(t).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    };
    var nf = function (v) {
      return (+v).toLocaleString("en-US", { maximumFractionDigits: 2 });
    };
    var css = document.createElement("style");
    css.textContent =
      ".ptmx{position:fixed;z-index:2147483000;max-width:min(380px,calc(100vw - 16px));background:var(--panel,#fff);color:var(--fg,#1d2228);border:1px solid var(--line,#d6dbe0);border-radius:10px;box-shadow:0 14px 34px rgba(0,0,0,.28);overflow:hidden;font-size:13px;line-height:1.35;display:flex;flex-direction:column}" +
      ".ptmx ul{list-style:none;margin:0;padding:4px;max-height:320px;overflow-y:auto}" +
      ".ptmx li{padding:6px 10px;border-radius:7px;cursor:pointer;display:flex;justify-content:space-between;gap:10px}" +
      ".ptmx li.mu{font-weight:600}" +
      ".ptmx li small{font-weight:400;color:var(--muted,#5d6670);font-family:ui-monospace,Consolas,monospace}" +
      ".ptmx li.g{cursor:default;padding:8px 10px 3px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted,#5d6670)}" +
      ".ptmx li.on{background:color-mix(in srgb,var(--accent,#0f7c6b) 14%,var(--panel,#fff))}" +
      ".ptmx li.cur{box-shadow:inset 3px 0 0 var(--accent,#0f7c6b)}" +
      ".ptmx li.off{opacity:.45;cursor:default}" +
      ".ptmx .det{border-top:1px solid var(--line,#d6dbe0);padding:8px 12px;background:var(--sunk,#f5f7f8);font-size:12.5px}" +
      ".ptmx .det b{display:block;margin-bottom:2px}" +
      ".ptmx .det .l{display:flex;justify-content:space-between;gap:12px}" +
      ".ptmx .det .l span:last-child{font-family:ui-monospace,Consolas,monospace}" +
      ".ptmx .det .h{display:block;color:var(--muted,#5d6670);font-size:12px;margin-top:4px}";
    (document.head || document.documentElement).appendChild(css);
    var box = null,
      sel = null,
      act = -1,
      mut = false,
      typed = "",
      typedT = 0;
    function info(v) {
      var m = MU[v];
      if (!m) return "<b>No mutation</b><span class='h'>The item's normal stats</span>";
      var h = "<b style='color:" + (COL[v] || "inherit") + "'>" + esc(v) + "</b>";
      h += "<span class='l'><span>Item's stats</span><span>×" + nf(m.x) + " (+" + Math.round((m.x - 1) * 100) + "%)</span></span>";
      Object.keys(m.a || {}).forEach(function (n) {
        h += "<span class='l'><span>" + esc(n) + "</span><span>+" + nf(m.a[n]) + (PCT[n] ? "%" : "") + " flat</span></span>";
      });
      if (m.ev) h += "<span class='h'>" + esc(m.ev) + "</span>";
      return h;
    }
    function items() {
      return box ? [].slice.call(box.querySelectorAll("li[data-i]")) : [];
    }
    function close() {
      if (box) box.remove();
      box = null;
      sel = null;
      act = -1;
    }
    function focusItem(i) {
      var li = items();
      if (!li.length) return;
      act = (i + li.length) % li.length;
      li.forEach(function (x, j) {
        x.classList.toggle("on", j === act);
      });
      li[act].scrollIntoView({ block: "nearest" });
      if (mut) box.querySelector(".det").innerHTML = info(li[act].getAttribute("data-v"));
    }
    function pick(li) {
      if (!li || li.classList.contains("off")) return;
      var s = sel;
      close();
      if (!s) return;
      s.selectedIndex = +li.getAttribute("data-o");
      s.dispatchEvent(new Event("input", { bubbles: true }));
      s.dispatchEvent(new Event("change", { bubbles: true }));
      s.focus();
    }
    function open(s) {
      close();
      sel = s;
      mut = s.hasAttribute("data-ptmut");
      typed = "";
      var h = "",
        n = 0,
        cur = 0,
        lastGrp = null;
      [].forEach.call(s.options, function (o, oi) {
        if (mut && o.value === "") return; // "Set all mutations…" is a prompt, not a choice
        if (o.hidden) return;
        var g = o.parentNode && o.parentNode.tagName === "OPTGROUP" ? o.parentNode : null;
        if (g && g !== lastGrp) h += "<li class='g' role='presentation'>" + esc(g.label) + "</li>";
        lastGrp = g;
        var isCur = oi === s.selectedIndex;
        if (isCur) cur = n;
        var cls = (isCur ? " cur" : "") + (o.disabled || (g && g.disabled) ? " off" : "") + (mut ? " mu" : "");
        var m = mut && MU[o.value],
          col = mut ? COL[o.value] : o.style.color;
        h +=
          "<li role='option' data-i='" + n++ + "' data-o='" + oi + "' data-v='" + esc(o.value) + "'" + (cls ? " class='" + cls.trim() + "'" : "") + "><span" + (col ? " style='color:" + esc(col) + "'" : "") + ">" + esc(mut ? (m ? o.value : "No mutation") : o.text) + "</span>" + (m ? "<small>×" + nf(m.x) + "</small>" : "") + "</li>";
      });
      if (!n) return (sel = null);
      box = document.createElement("div");
      box.className = "ptmx";
      box.setAttribute("role", "listbox");
      box.innerHTML = "<ul>" + h + "</ul>" + (mut ? "<div class='det'></div>" : "");
      document.body.appendChild(box);
      var r = s.getBoundingClientRect();
      box.style.minWidth = Math.max(r.width, mut ? 230 : 160) + "px";
      var w = box.offsetWidth,
        bh = box.offsetHeight;
      box.style.left = Math.max(8, Math.min(r.left, innerWidth - w - 8)) + "px";
      box.style.top = (r.bottom + 4 + bh > innerHeight && r.top - 4 - bh > 0 ? r.top - 4 - bh : r.bottom + 4) + "px";
      focusItem(cur);
    }
    var isSel = function (t) {
      return t && t.tagName === "SELECT" && !t.multiple && !(t.size > 1) && !t.hasAttribute("data-native");
    };
    var lastTouch = 0;
    document.addEventListener(
      "touchstart",
      function () {
        lastTouch = Date.now();
      },
      { capture: true, passive: true },
    );
    document.addEventListener(
      "mousedown",
      function (e) {
        var t = e.target;
        if (box && box.contains(t)) {
          e.preventDefault();
          pick(t.closest("li[data-i]"));
          return;
        }
        if (isSel(t) && e.button === 0 && Date.now() - lastTouch > 800 && !t.disabled) {
          e.preventDefault();
          if (sel === t) close();
          else {
            t.focus();
            open(t);
          }
          return;
        }
        if (box) close();
      },
      true,
    );
    document.addEventListener("mouseover", function (e) {
      var li = box && e.target.closest && e.target.closest(".ptmx li[data-i]");
      if (li) focusItem(+li.getAttribute("data-i"));
    });
    document.addEventListener(
      "keydown",
      function (e) {
        if (box) {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            focusItem(act + (e.key === "ArrowDown" ? 1 : -1));
          } else if (e.key === "Home" || e.key === "End") {
            e.preventDefault();
            focusItem(e.key === "Home" ? 0 : items().length - 1);
          } else if (e.key === "Enter" || (e.key === " " && !typed)) {
            e.preventDefault();
            pick(items()[act]);
          } else if (e.key === "Escape" || e.key === "Tab") {
            if (e.key === "Escape") e.preventDefault();
            close();
          } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            // type to jump, like the browser's own dropdown
            e.preventDefault();
            if (Date.now() - typedT > 700) typed = "";
            typedT = Date.now();
            typed += e.key.toLowerCase();
            var li = items(),
              k = li.findIndex(function (x) {
                return x.textContent.trim().toLowerCase().indexOf(typed) === 0;
              });
            if (k >= 0) focusItem(k);
          }
          return;
        }
        if (isSel(e.target) && !e.altKey && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          open(e.target);
        }
      },
      true,
    );
    window.addEventListener(
      "scroll",
      function (e) {
        if (box && !box.contains(e.target)) close();
      },
      true,
    );
    window.addEventListener("resize", close);
    window.addEventListener("blur", close);
  })();
}
const PRE0 =
  '<base target="_blank"><script>try{if(!window.hostBridge&&window.parent&&window.parent.hostBridge)window.hostBridge=window.parent.hostBridge}catch(e){}document.addEventListener("click",function(e){if(!(e.ctrlKey||e.metaKey))return;var t=e.target.closest&&e.target.closest("[data-mineral],[data-location],[data-equip]");if(!t)return;e.preventDefault();e.stopPropagation();try{window.parent.ptOpen(t.hasAttribute("data-mineral")?"mineral":t.hasAttribute("data-equip")?"equip":"location",t.getAttribute("data-mineral")||t.getAttribute("data-equip")||t.getAttribute("data-location"))}catch(err){}},true);document.addEventListener("DOMContentLoaded",function(){var st=document.createElement("style");st.textContent=".pt-ft{display:flex!important;flex-wrap:wrap;justify-content:center;align-items:center;gap:8px;text-align:center;max-width:none!important;white-space:nowrap}.pt-ft i{font-style:normal}.pt-fix{flex-basis:100%;white-space:normal!important;overflow-wrap:break-word;max-width:100%;text-align:center;font-size:12.5px;color:var(--muted,#888);margin:6px 0 0;line-height:1.4}.pt-fix b{color:var(--fg,inherit);font-weight:600}.pt-ver{flex-basis:100%;text-align:center;font-size:12px;font-weight:500;letter-spacing:.02em;margin:2px 0 0;color:color-mix(in srgb,var(--fg,#888) 30%,var(--bg,transparent))}@media (max-width:600px){.pt-ft .lg{display:none}.pt-ft{gap:6px}.pt-ft>span{padding:4px 9px!important}}.pt-ft>span{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:999px;font-size:12.5px;font-weight:600;line-height:1.3;color:var(--pc);background:color-mix(in srgb,var(--pc) 13%,transparent);border:1px solid color-mix(in srgb,var(--pc) 45%,transparent);transition:transform .15s,background .15s}.pt-ft>span::before{content:\\"\\";width:6px;height:6px;border-radius:50%;background:var(--pc);box-shadow:0 0 6px var(--pc)}.pt-ft>span:hover{transform:translateY(-1px);background:color-mix(in srgb,var(--pc) 22%,transparent)}.pt-ft a{color:inherit!important;text-decoration:none!important}.pt-ft .p1{--pc:#14b8a6}.pt-ft .p2{--pc:#f59e0b}.pt-ft .p3{--pc:#a78bfa}.pt-ft .p4{--pc:#6b7cff}@media (prefers-color-scheme:light){:root:not([data-theme=dark]) .pt-ft .p1{--pc:#0f8f80}:root:not([data-theme=dark]) .pt-ft .p2{--pc:#b86e00}:root:not([data-theme=dark]) .pt-ft .p3{--pc:#7c5ce0}:root:not([data-theme=dark]) .pt-ft .p4{--pc:#4b5bdc}}:root[data-theme=light] .pt-ft .p1{--pc:#0f8f80}:root[data-theme=light] .pt-ft .p2{--pc:#b86e00}:root[data-theme=light] .pt-ft .p3{--pc:#7c5ce0}:root[data-theme=light] .pt-ft .p4{--pc:#4b5bdc}";document.head.appendChild(st);document.querySelectorAll("p").forEach(function(p){if(!/Made by @__coastal\\s*$/.test(p.innerHTML)||p.classList.contains("pt-ft"))return;var m=p.textContent.match(/Last\\s+edited\\s*([0-9\\/]+)/);p.classList.add("pt-ft");p.innerHTML="<span class=\\"p1\\"><a href=\\"https://www.youtube.com/watch?v=dQw4w9WgXcQ\\" target=\\"_blank\\" rel=\\"noopener\\"><i class=\\"lg\\">Made by <\/i>@__coastal<\/a><\/span><span class=\\"p2\\"><a href=\\"https://prospecting.miraheze.org/wiki/Main_Page\\" target=\\"_blank\\" rel=\\"noopener\\"><i class=\\"lg\\">Prospecting <\/i>Wiki<\/a><\/span><span class=\\"p3\\"><i class=\\"lg\\">Last edited <\/i>"+(m?m[1]:"")+"<\/span><span class=\\"p4\\"><a class=\\"pt-dc\\" href=\\"https://discord.gg/TuXc7dguFG\\" target=\\"_blank\\" rel=\\"noopener\\"><i class=\\"lg\\">Join the official <\/i>Discord<\/a><\/span>";if(!p.querySelector(\".pt-ver\"))p.insertAdjacentHTML(\"beforeend\",\"<div class=\\\"pt-fix\\\">Spotted something wrong or out of date? Message <b>@__coastal<\/b> on Discord.<\/div><div class=\\\"pt-ver\\\">Version %%PTVER%%<\/div>\");var p3=p.querySelector(".p3");if(p3&&m){var q=m[1].split("/");var d=new Date(2000+(+q[2]),(+q[1])-1,+q[0]);var n=Math.round((new Date().setHours(0,0,0,0)-d.getTime())/864e5);p3.title=n<=0?"That was today":n===1?"That was 1 day ago":"That was "+n+" days ago";p3.style.cursor="help"}var a1=p.querySelector(".p1 a"),a2=p.querySelector(".p2 a"),a4=p.querySelector(".p4 a");if(a2)a2.title="Click to go to the wiki";if(a4)a4.title="Click to get invited";if(a1){var MS=["Psst... click me","Click for a secret","Don\\u2019t click this","Bet you won\\u2019t click","Hidden developer tips inside","You\\u2019ve been chosen. Click.","Click to claim your reward","Secret pan strategy, one click away","Only 1 in 26,764 players find this","Meet the mind behind the toolkit","Click for the ultimate luck boost","Exclusive behind-the-scenes content","The best-kept secret in Prospecting","Something rare is waiting for you","Click to unlock developer mode"],li=-1;var pick=function(){var i;do{i=Math.floor(Math.random()*MS.length)}while(i===li);li=i;a1.title=MS[i]};pick();a1.addEventListener("mouseenter",pick);a1.addEventListener("focus",pick)}})});<\/script>';
const PRE = PRE0 + "<script>(" + ptFrameInit.toString() + ")()<\/script>";

function syncTheme(f) {
  try {
    const t = document.documentElement.getAttribute("data-theme");
    const r = f.contentDocument && f.contentDocument.documentElement;
    if (!r) return;
    if (t) r.setAttribute("data-theme", t);
    else r.removeAttribute("data-theme");
  } catch (e) {}
}
function frameFor(id) {
  if (frames[id]) return frames[id];
  const f = document.createElement("iframe");
  f.title = LIST.find((x) => x.id === id).name;
  f.srcdoc = TOOLS[id].replace(/<head>/i, "<head>" + PRE);
  f.addEventListener("load", () => {
    syncTheme(f);
    f.dataset.ok = "1";
    ptAddReset(f, id);
    if (!f.hidden) document.getElementById("skel").hidden = true;
  });
  main.appendChild(f);
  frames[id] = f;
  return f;
}
