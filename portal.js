// Shared chrome + behaviour for every page in this reference build.
// The topbar (white pill, with relocated/expanding search), the navy gradient
// hero band with its wave divider, and the base info-popup modal are all
// INJECTED here from per-page <body> data attributes, so the markup lives in
// one place instead of being copy-pasted into nine files. Each page supplies:
//   data-active   which nav item is current (e.g. "learning.html")
//   data-title    the hero H1
//   data-sub      the hero sub-line
//   data-crumb    breadcrumb trailing label
//   data-search   search-box placeholder (omit to hide search)
// A page with no data-active (e.g. login) gets no chrome injected.
(function () {
  var body = document.body;
  var active = body.getAttribute("data-active");

  // ---- Mega-menu nav: top-level sections, each pointing at anchors across
  // the site. Entries with `href` render as a plain link; entries with
  // `items` render as a dropdown. `pages` drives which top-level item lights
  // up as active for a given data-active value. ----
  var NAV = [
    { label: "Resources", href: "resources.html", pages: ["resources.html"] },
    { label: "Updates & Advocacy", pages: ["news.html"], items: [
        ["news.html#overview", "Overview"],
        ["news.html#newsforservices", "News for services"],
        ["news.html#windup", "Weekly Windup"],
        ["news.html#alerts", "Current topics and alerts"],
        ["news.html#reforms", "Reform updates"],
        ["news.html#advocacy", "Advocacy priorities"],
        ["news.html#submissions", "Submissions and policy positions"]
    ]},
    { label: "Training & Events", pages: ["learning.html"], items: [
        ["learning.html#overview", "Overview"],
        ["learning.html#webinars", "Webinars and events — upcoming and recordings"],
        ["learning.html#modules", "Training modules"],
        ["learning.html#reading", "Blogs and podcasts"],
        ["learning.html#handbooks", "Handbooks and toolkits"]
    ]},
    { label: "Marketing", pages: ["marketing.html"], items: [
        ["marketing.html#overview", "Overview"],
        ["marketing.html#calendar", "Calendar of key awareness dates"],
        ["marketing.html#campaigns", "Campaigns"],
        ["marketing.html#brand", "Brand & Assets"]
    ]},
    { label: "Community", pages: ["connect.html", "directory.html"], items: [
        ["connect.html#overview", "Overview"],
        ["directory.html", "Member directory"],
        ["connect.html#haveyoursay", "Consultations and surveys"],
        ["connect.html#discussion", "Discussions"],
        ["connect.html#communities", "Communities of practice"],
        ["connect.html#escalated", "Escalated Issues"]
    ]}
  ];

  // ---- Sample content index for the topbar search's autosuggest. Reference
  // build only — a real build would query the CMS/search index instead. ----
  var CONTENT = [
    { title: "Police check guidance", url: "resources.html?open=police-check", type: "Resource", tags: ["hr", "volunteers", "compliance", "police check"] },
    { title: "AGM document templates", url: "resources.html?open=agm-templates", type: "Resource", tags: ["governance", "templates", "agm"] },
    { title: "Support at Home reporting update", url: "resources.html?open=sah-reporting", type: "Resource", tags: ["compliance", "reform", "support at home"] },
    { title: "Grant acquittal checklist", url: "resources.html?open=grant-acquittal", type: "Resource", tags: ["finance", "funding", "grants"] },
    { title: "Brand guidelines and logo pack", url: "marketing.html?open=brand-logos", type: "Marketing", tags: ["brand", "promote", "logo"] },
    { title: "Cuppa for a Cause campaign kit", url: "marketing.html?open=mkt-campaign-cuppa", type: "Marketing", tags: ["campaigns", "brand", "fundraising"] },
    { title: "Weekly Windup — latest edition", url: "news.html", type: "News", tags: ["news", "mow", "windup"] },
    { title: "National Minimum Data Set consultation", url: "connect.html?open=consult-nmds", type: "Consultation", tags: ["advocacy", "have your say", "mds"] },
    { title: "APD annual meal review: what's required", url: "learning.html#upcoming", type: "Webinar", tags: ["training", "aged care", "dietitian"] },
    { title: "Member directory & map", url: "directory.html", type: "Directory", tags: ["community", "directory", "map"] },
    { title: "Volunteer Coordinators Network", url: "connect.html#communities", type: "Community", tags: ["community", "volunteers", "working group"] },
    { title: "Your Network Support Officer", url: "support.html", type: "Support", tags: ["support", "contact", "nso"] }
  ];
  var PAGES = [
    ["Dashboard", "index.html"], ["Resources & Templates", "resources.html"], ["Learning", "learning.html"],
    ["Sector Updates & Advocacy", "news.html"], ["Marketing", "marketing.html"], ["Connect", "connect.html"],
    ["Support", "support.html"], ["Service", "myservice.html"]
  ];

  var searchIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
  var chev = '<svg class="chev" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg>';
  // Two-layer wave: a page-coloured wash underneath (same fill as the page
  // background, filled solid down to the very bottom edge so it melts
  // straight into the page with no seam), topped by a thick teal ribbon
  // with its own swirl on both edges, plus a soft drop-shadow.
  // The teal ribbon's bottom edge and the page-wash's top edge trace the
  // EXACT same curve (same points, reversed direction) so they meet with
  // zero gap at every x — no sliver of the navy gradient can show through,
  // right edge included.
  var waveSvg = '<svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><filter id="waveShadow" x="-10%" y="-60%" width="120%" height="220%"><feDropShadow dx="0" dy="7" stdDeviation="7" flood-color="rgba(3,31,115,0.28)"/></filter></defs>' +
    '<path d="M0,55 C220,90 460,45 720,75 C980,100 1220,60 1440,82 L1440,100 L0,100 Z" fill="var(--surface-tint)"/>' +
    '<path d="M0,15 C220,45 460,2 720,25 C980,50 1220,5 1440,30 L1440,82 C1220,60 980,100 720,75 C460,45 220,90 0,55 Z" fill="var(--teal)" filter="url(#waveShadow)"/>' +
    '</svg>';

  // ---- Active account (the member service the user is managing) ----
  // A member can manage more than one MOW service and switch between them.
  var ACCOUNTS = ["Meals on Wheels Blacktown", "Liverpool Meals on Wheels", "Parramatta Meals on Wheels"];
  var activeAccount = (function () {
    try { var s = localStorage.getItem("mow_active_account"); if (s && ACCOUNTS.indexOf(s) !== -1) return s; } catch (e) {}
    return ACCOUNTS[0];
  })();
  function acctInitials(n) {
    var parts = n.replace(/Meals on Wheels/i, "MOW").split(" ").filter(Boolean);
    return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
  }
  if (active) {
    var title = body.getAttribute("data-title") || "";
    var sub = body.getAttribute("data-sub") || "";
    var crumb = body.hasAttribute("data-crumb") ? body.getAttribute("data-crumb") : title;
    var searchPh = body.getAttribute("data-search");

    var navHtml = NAV.map(function (n) {
      var isActive = n.pages && n.pages.indexOf(active) !== -1;
      if (n.items) {
        var subHtml = n.items.map(function (it) {
          var external = /^https?:\/\//.test(it[0]);
          return '<a href="' + it[0] + '"' + (external ? ' target="_blank" rel="noopener"' : "") + ">" + it[1] + (external ? ' <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-left:4px;vertical-align:-1px"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/></svg>' : "") + "</a>";
        }).join("");
        return '<div class="nav-drop">' +
          '<button type="button" class="nav-drop-btn' + (isActive ? " active" : "") + '">' + n.label + chev + "</button>" +
          '<div class="nav-drop-menu">' + subHtml + "</div>" +
        "</div>";
      }
      return '<a href="' + n.href + '"' + (isActive ? ' class="active"' : "") + ">" + n.label + "</a>";
    }).join("");

    var searchToggleHtml = searchPh
      ? '<button type="button" class="ts-toggle" id="tsToggle" aria-label="Search" aria-expanded="false">' + searchIcon + "</button>"
      : "";
    var searchRowHtml = searchPh
      ? '<div class="topbar-search-row" id="tsRow">' +
          '<div class="topbar-search-inner">' + searchIcon + '<input type="search" id="tsInput" placeholder="' + searchPh + '" aria-label="Search"></div>' +
          '<div class="ts-suggest" id="tsSuggest"></div>' +
        "</div>"
      : "";

    var switchHtml = ACCOUNTS.map(function (a) {
      var cur = a === activeAccount;
      return '<button class="um-item um-acct" type="button" data-acct="' + a + '">' +
        '<span class="um-acct-mark">' + acctInitials(a) + "</span>" +
        '<span class="um-acct-name">' + a + "</span>" +
        (cur ? '<span class="um-acct-check">&#10003;</span>' : "") + "</button>";
    }).join("");

    // One-piece gradient header: nav row + hero content + wave, all on the
    // gradient (no separate solid navy bar). Topbar itself floats as a white
    // rounded pill above the gradient.
    var header =
      '<div class="hero bg-mow-gradient">' +
        '<header class="topbar">' +
          '<div class="topbar-row">' +
            '<a class="brand" href="index.html"><span class="mark"><img src="mow-favicon.svg" width="18" height="18" alt="MOW NSW"></span><span class="brand-text"><span class="brand-title">Members Hub</span><span class="brand-sub">Dashboard</span></span></a>' +
            "<nav>" + navHtml + "</nav>" +
            searchToggleHtml +
            '<div class="user">' +
              '<span class="acct-logo"><span class="acct-name">' + activeAccount + "</span></span>" + chev +
              '<div class="user-menu">' +
                '<div class="um-head"><div class="n" id="umAcctName">' + activeAccount + '</div><div class="r">Active account</div></div>' +
                '<a href="myservice.html#profile">Service profile</a>' +
                '<a href="myservice.html#profile">Update contact details</a>' +
                '<a href="myservice.html#benefits">Membership benefits</a>' +
                '<a href="myservice.html#renewal">Membership renewal</a>' +
                '<div class="um-sep"></div>' +
                '<div class="um-label">Switch account</div>' +
                switchHtml +
                '<div class="um-sep"></div>' +
                '<a href="login.html" class="um-item danger">Log out</a>' +
              "</div>" +
            "</div>" +
          "</div>" +
          searchRowHtml +
        "</header>" +
        '<div class="hero-inner">' +
          '<div class="hero-text">' +
            '<div class="breadcrumb"><a href="index.html">Dashboard</a>' + (crumb ? " / " + crumb : "") + "</div>" +
            "<h1>" + title + "</h1>" +
            (sub ? '<div class="sub">' + sub + "</div>" : "") +
          "</div>" +
          '<div class="hero-aside"></div>' +
        "</div>" +
        '<div class="divider wave">' + waveSvg + "</div>" +
      "</div>";

    var baseModal =
      '<div class="modal-overlay hide" id="infoModal">' +
        '<div class="modal">' +
          '<button class="close" data-modal-close aria-label="Close">&times;</button>' +
          '<div class="info-modal-body" id="infoModalBody"></div>' +
        "</div>" +
      "</div>" +
      '<div class="modal-overlay hide" id="contactPersonModal">' +
        '<div class="modal">' +
          '<button class="close" data-modal-close aria-label="Close">&times;</button>' +
          '<div class="info-modal-body" id="contactPersonBody"></div>' +
        "</div>" +
      "</div>";

    body.insertAdjacentHTML("afterbegin", header + baseModal);

    // Pull any [data-hero-aside] element (e.g. the dashboard alert) up into the
    // hero's right-hand slot, next to the title.
    var aside = document.querySelector(".hero-aside");
    var asideSrc = document.querySelector("[data-hero-aside]");
    if (aside && asideSrc) aside.appendChild(asideSrc);

    // ---- Shared "contact a person" popup: Call / Email / Teams + a message-
    // via-portal form, optionally pre-filled with what the user was looking at
    // (a resource title, a support category, etc). Used by the Support FAB's
    // contact tiles AND by the .im-author chip inside resource popups. ----
    (function () {
      var STAFF_DIRECTORY = {
        "Sarah Nguyen": { role: "Network Support Officer", email: "snguyen@nswmealsonwheels.org.au" },
        "Leesa Carter": { role: "Reform, CHSP & Quality", email: "lcarter@nswmealsonwheels.org.au" },
        "Simone Ho": { role: "Finance & funding", email: "sho@nswmealsonwheels.org.au" },
        "Rezwan Lasker": { role: "Governance & HR", email: "rlasker@nswmealsonwheels.org.au" },
        "Laura Bui": { role: "Brand & Comms", email: "lbui@nswmealsonwheels.org.au" },
        "Louie R.": { role: "Nutrition & Quality", email: "lradburn@nswmealsonwheels.org.au" },
        "Portal support desk": { role: "Logins & access issues", email: "portalsupport@nswmealsonwheels.org.au" }
      };
      var cpModal = document.getElementById("contactPersonModal");
      var cpBody = document.getElementById("contactPersonBody");
      function esc(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
      var callIcon = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
      var mailIcon = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg>';
      var teamsIcon = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/><path d="M9 14h6v4H9z"/></svg>';
      var msgIcon = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

      window.openContactPopup = function (opts) {
        opts = opts || {};
        var name = opts.name || "";
        var role = opts.role || "";
        var email = opts.email || "info@nswmealsonwheels.org.au";
        var phone = (opts.phone || "1300679669").replace(/\s/g, "");
        var context = opts.context || "";
        var subject = context ? "Re: " + context : "Portal enquiry";
        var teamsUrl = "https://teams.microsoft.com/l/meeting/new?subject=" + encodeURIComponent(subject) + "&attendees=" + encodeURIComponent(email);
        var mailUrl = "mailto:" + email + "?subject=" + encodeURIComponent(subject);
        var prefill = context ? ("Hi " + esc(name.split(" ")[0]) + ",\n\nI have a question about \"" + esc(context) + "\".\n\n") : "";

        cpBody.innerHTML =
          "<h2>Contact " + esc(name) + "</h2>" +
          (role ? '<p class="im-meta">' + esc(role) + "</p>" : "") +
          (context ? '<p class="im-note" style="margin-bottom:14px">Re: ' + esc(context) + "</p>" : "") +
          '<div class="contact-action-row">' +
            '<a class="contact-action" href="tel:' + phone + '">' + callIcon + "Call</a>" +
            '<a class="contact-action" href="' + mailUrl + '">' + mailIcon + "Email</a>" +
            '<a class="contact-action" target="_blank" rel="noopener" href="' + teamsUrl + '">' + teamsIcon + "Teams</a>" +
          "</div>" +
          '<div class="ts-suggest-label" style="margin-top:16px">' + msgIcon + " Message via portal</div>" +
          '<form id="cpForm"><div class="field"><label>To</label><input type="text" value="' + esc(name) + '" readonly></div>' +
          '<div class="field"><label>Your message</label><textarea id="cpMsgBody" style="min-height:100px">' + prefill + "</textarea></div>" +
          '<button class="btn-primary" type="submit">Send message</button></form>' +
          '<div class="announce-thanks hide" id="cpThanks">Sent — ' + esc(name) + " will reply through your portal inbox.</div>";

        cpModal.classList.remove("hide");
        document.getElementById("cpForm").addEventListener("submit", function (e) {
          e.preventDefault();
          document.getElementById("cpForm").classList.add("hide");
          document.getElementById("cpThanks").classList.remove("hide");
        });
      };

      cpModal.querySelectorAll("[data-modal-close]").forEach(function (btn) { btn.addEventListener("click", function () { cpModal.classList.add("hide"); }); });
      cpModal.addEventListener("click", function (e) { if (e.target === cpModal) cpModal.classList.add("hide"); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") cpModal.classList.add("hide"); });

      // Any .im-author chip inside a resource popup opens the contact popup
      // instead of navigating to Support, pre-filled with that resource's title.
      document.addEventListener("click", function (e) {
        var chip = e.target.closest(".im-author");
        if (!chip) return;
        e.preventDefault();
        var nameEl = chip.querySelector(".ia-name");
        var roleEl = chip.querySelector(".ia-role");
        var name = nameEl ? nameEl.textContent.trim() : (chip.getAttribute("title") || "").replace(/^Contact /, "");
        var role = roleEl ? roleEl.textContent.trim() : "";
        var dir = STAFF_DIRECTORY[name];
        var modalH2 = chip.closest(".modal") ? chip.closest(".modal").querySelector("h2") : null;
        var context = modalH2 ? modalH2.textContent.trim() : "";
        window.openContactPopup({ name: name, role: role || (dir && dir.role) || "", email: (dir && dir.email) || "info@nswmealsonwheels.org.au", context: context });
      });

      window.__STAFF_DIRECTORY = STAFF_DIRECTORY;
    })();

    // ---- Floating Support button + compact, no-scroll popup (every chrome
    // page). Contacts route through the shared window.openContactPopup; the
    // "Get more help" tiles drill into their own sub-view with a Back button. ----
    (function () {
      var supportIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
      var fabHtml =
        '<button type="button" class="support-fab" id="supportFabBtn">' + supportIcon + "<span>Support</span></button>" +
        '<div class="modal-overlay hide" id="supportFabModal"><div class="modal modal-fab">' +
          '<button class="close" data-modal-close aria-label="Close">&times;</button>' +
          '<div class="info-modal-body" id="supportFabBody"></div>' +
        "</div></div>";
      body.insertAdjacentHTML("beforeend", fabHtml);

      var CATS = [
        { cat: "Compliance & reporting", name: "Leesa Carter", init: "LC" },
        { cat: "Funding & grants", name: "Simone Ho", init: "SH" },
        { cat: "HR & volunteers", name: "Rezwan Lasker", init: "RL" },
        { cat: "Brand, comms & media", name: "Laura Bui", init: "LB" },
        { cat: "Technical / portal access", name: "Portal support desk", init: "IT" }
      ];

      var fabModal = document.getElementById("supportFabModal");
      var fabBody = document.getElementById("supportFabBody");
      var dir = window.__STAFF_DIRECTORY || {};
      var bookIcon = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
      var msgIcon = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

      function homeView() {
        fabBody.innerHTML =
          '<h2>Support</h2>' +
          '<p class="im-meta">Contact a team, book time with your NSO, or open a quick guide — no need to leave this window.</p>' +
          '<div class="fab-nso">' +
            '<span class="fn-avatar">SN</span>' +
            '<div class="fn-info"><div class="fn-flag">Your NSO</div><div class="fn-name">Sarah Nguyen</div><div class="fn-role">Sydney metro region</div></div>' +
            '<div class="fn-actions">' +
              '<button type="button" data-fab-contact="Sarah Nguyen" title="Message, call, email or Teams">' + msgIcon + "</button>" +
              '<a href="https://outlook.office.com/bookwithme/user/snguyen@nswmealsonwheels.org.au" target="_blank" rel="noopener" title="Book a time (O365 Bookings)">' + bookIcon + "</a>" +
            "</div>" +
          "</div>" +
          '<div class="fab-grid-label">Contact a team</div>' +
          '<div class="fab-contact-grid">' +
          CATS.map(function (c) {
            return '<button type="button" class="fab-contact-tile" data-fab-contact="' + c.name + '"><span class="fc-avatar">' + c.init + "</span><span class=\"fc-name\">" + c.name + '</span><span class="fc-cat">' + c.cat + "</span></button>";
          }).join("") +
          "</div>" +
          '<div class="fab-grid-label">Get more help</div>' +
          '<div class="fab-section-grid">' +
            '<button type="button" class="fab-section-tile" data-fab-view="ask"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span class="fs-label">Ask for Help</span></button>' +
            '<button type="button" class="fab-section-tile" data-fab-view="faq"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5" style="display:none"/><path d="M8 9h8M8 13h5"/></svg><span class="fs-label">FAQs</span></button>' +
            '<button type="button" class="fab-section-tile" data-fab-view="transition"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg><span class="fs-label">Start or transition a service</span></button>' +
          "</div>" +
          '<a class="btn-secondary" href="support.html" style="width:100%;justify-content:center;margin-top:14px">View the full Support page &rarr;</a>';

        fabBody.querySelectorAll("[data-fab-contact]").forEach(function (btn) {
          btn.addEventListener("click", function () {
            var name = btn.getAttribute("data-fab-contact");
            var tile = btn.closest(".fab-contact-tile");
            var cat = tile ? tile.querySelector(".fc-cat").textContent : "";
            window.openContactPopup({ name: name, role: (dir[name] && dir[name].role) || cat || "Your Network Support Officer", email: (dir[name] && dir[name].email) || "info@nswmealsonwheels.org.au" });
          });
        });
        fabBody.querySelectorAll("[data-fab-view]").forEach(function (btn) {
          btn.addEventListener("click", function () {
            var v = btn.getAttribute("data-fab-view");
            if (v === "ask") askView();
            else if (v === "faq") faqView();
            else transitionView();
          });
        });
      }

      function backBtn() { return '<button class="fab-back" type="button" id="fabBack">&larr; Back to Support</button>'; }
      function wireBack() { document.getElementById("fabBack").addEventListener("click", homeView); }

      function askView() {
        fabBody.innerHTML = backBtn() +
          "<h2>Ask for Help</h2>" +
          '<p class="im-meta" style="margin-bottom:14px">Log a request and it routes to the right person (and copies your NSO).</p>' +
          '<form id="fabAskForm">' +
          '<div class="field"><label>What do you need help with?</label><select><option>Choose a topic</option><option>Compliance / reporting</option><option>Funding / grants</option><option>HR / volunteers</option><option>Brand, comms & media</option><option>Technical / portal access</option><option>Something else</option></select></div>' +
          '<div class="field"><label>Tell us more</label><textarea style="min-height:90px" placeholder="A few details helps the team get back to you faster"></textarea></div>' +
          '<button class="btn-primary" type="submit">Submit request</button></form>' +
          '<div class="announce-thanks hide" id="fabAskThanks">Thanks — your request has been logged and routed to the relevant team. Reference build — nothing is actually sent.</div>';
        wireBack();
        document.getElementById("fabAskForm").addEventListener("submit", function (e) {
          e.preventDefault();
          document.getElementById("fabAskForm").classList.add("hide");
          document.getElementById("fabAskThanks").classList.remove("hide");
        });
      }

      function faqView() {
        fabBody.innerHTML = backBtn() +
          "<h2>Frequently asked questions</h2>" +
          '<div class="faq-list" style="margin-top:10px">' +
            "<details open><summary>How long does it take to hear back?</summary><div class=\"faq-a\">Your NSO aims to respond within one business day. Urgent compliance issues are flagged for same-day response.</div></details>" +
            "<details><summary>What should be escalated?</summary><div class=\"faq-a\">Anything with a client safety, funding, or legal compliance dimension should go straight to your NSO rather than waiting in the general queue.</div></details>" +
            "<details><summary>Can I change my NSO myself?</summary><div class=\"faq-a\">Your assigned NSO is set by MOW NSW based on your region. If you believe it's incorrect, use Ask for Help and select \"Technical / portal access\".</div></details>" +
          "</div>";
        wireBack();
      }

      function transitionView() {
        fabBody.innerHTML = backBtn() +
          "<h2>Start or transition a service</h2>" +
          '<p style="font-size:13.5px;margin:0 0 14px">Thinking about starting a new Meals on Wheels service, or transitioning leadership of an existing one? There\'s a dedicated pathway and checklist for that.</p>' +
          '<a class="btn-primary" href="support.html">View the service transition guide &rarr;</a>';
        wireBack();
      }

      document.getElementById("supportFabBtn").addEventListener("click", function () {
        homeView();
        fabModal.classList.remove("hide");
      });
      fabModal.querySelectorAll("[data-modal-close]").forEach(function (btn) { btn.addEventListener("click", function () { fabModal.classList.add("hide"); }); });
      fabModal.addEventListener("click", function (e) { if (e.target === fabModal) fabModal.classList.add("hide"); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") fabModal.classList.add("hide"); });
    })();

    // ---- Nav dropdowns ----
    document.querySelectorAll(".nav-drop").forEach(function (drop) {
      var btn = drop.querySelector(".nav-drop-btn");
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var willOpen = !drop.classList.contains("open");
        document.querySelectorAll(".nav-drop.open").forEach(function (d) { d.classList.remove("open"); });
        if (willOpen) drop.classList.add("open");
      });
    });
    document.addEventListener("click", function () {
      document.querySelectorAll(".nav-drop.open").forEach(function (d) { d.classList.remove("open"); });
    });

    // ---- Topbar search: drops down as a second row under the topbar (not
    // over the nav links), with the same relevance/pages/tags autosuggest. ----
    (function () {
      var topbarEl = document.querySelector(".topbar");
      var row = document.getElementById("tsRow");
      if (!topbarEl || !row) return;
      var toggle = document.getElementById("tsToggle");
      var input = document.getElementById("tsInput");
      var suggest = document.getElementById("tsSuggest");

      function esc(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

      function renderSuggest(term) {
        term = (term || "").trim().toLowerCase();
        var matches = CONTENT.filter(function (c) {
          if (!term) return true;
          return c.title.toLowerCase().indexOf(term) !== -1 || c.tags.some(function (t) { return t.indexOf(term) !== -1; });
        });
        var top3 = matches.slice(0, 3);
        var pageMatches = PAGES.filter(function (p) { return !term || p[0].toLowerCase().indexOf(term) !== -1; }).slice(0, 7);
        var allTags = [];
        CONTENT.forEach(function (c) { c.tags.forEach(function (t) { if (allTags.indexOf(t) === -1) allTags.push(t); }); });
        var tagMatches = allTags.filter(function (t) { return !term || t.indexOf(term) !== -1; }).slice(0, 10);

        var html = "";
        if (top3.length) {
          html += '<div class="ts-suggest-label">Most relevant</div><div class="ts-suggest-cols">' +
            top3.map(function (c) {
              return '<a class="ts-suggest-item" href="' + c.url + '"><div class="tsi-t">' + esc(c.title) + '</div><div class="tsi-m">' + esc(c.type) + "</div></a>";
            }).join("") + "</div>";
        }
        if (pageMatches.length) {
          html += '<div class="ts-suggest-label">Pages</div><div class="ts-suggest-pages">' +
            pageMatches.map(function (p) { return '<a href="' + p[1] + '">' + esc(p[0]) + "</a>"; }).join("") + "</div>";
        }
        if (tagMatches.length) {
          html += '<div class="ts-suggest-label">Tags</div><div class="ts-suggest-tags">' +
            tagMatches.map(function (t) { return '<a class="tstag" href="resources.html?tag=' + encodeURIComponent(t) + '">#' + esc(t) + "</a>"; }).join("") + "</div>";
        }
        suggest.innerHTML = html || '<div class="ts-suggest-label">No matches</div>';
      }

      function open() {
        topbarEl.classList.add("search-open");
        toggle.setAttribute("aria-expanded", "true");
        input.focus();
        renderSuggest(input.value);
      }
      function close() {
        topbarEl.classList.remove("search-open");
        toggle.setAttribute("aria-expanded", "false");
      }

      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        if (topbarEl.classList.contains("search-open")) { if (document.activeElement === input) close(); else input.focus(); }
        else open();
      });
      input.addEventListener("focus", function () { renderSuggest(input.value); });
      input.addEventListener("input", function () { renderSuggest(input.value); });
      row.addEventListener("click", function (e) { e.stopPropagation(); });
      document.addEventListener("click", function () { close(); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    })();
  }

  // ---- Profile dropdown ----
  document.querySelectorAll(".topbar .user").forEach(function (user) {
    user.setAttribute("tabindex", "0");
    user.setAttribute("role", "button");
    user.setAttribute("aria-haspopup", "true");
    function toggle(e) {
      e.stopPropagation();
      var willOpen = !user.classList.contains("open");
      document.querySelectorAll(".topbar .user.open").forEach(function (el) { el.classList.remove("open"); });
      if (willOpen) user.classList.add("open");
    }
    user.addEventListener("click", toggle);
    user.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(e); }
      if (e.key === "Escape") user.classList.remove("open");
    });
  });
  document.addEventListener("click", function () {
    document.querySelectorAll(".topbar .user.open").forEach(function (el) { el.classList.remove("open"); });
  });

  // ---- Switch account (updates the active service label live) ----
  document.querySelectorAll("[data-acct]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var name = btn.getAttribute("data-acct");
      try { localStorage.setItem("mow_active_account", name); } catch (err) {}
      document.querySelectorAll(".acct-logo .acct-name").forEach(function (n) { n.textContent = name; });
      var head = document.getElementById("umAcctName");
      if (head) head.textContent = name;
      document.querySelectorAll(".um-acct").forEach(function (b) {
        var check = b.querySelector(".um-acct-check");
        if (check) check.remove();
        if (b.getAttribute("data-acct") === name) b.insertAdjacentHTML("beforeend", '<span class="um-acct-check">&#10003;</span>');
      });
      document.querySelectorAll(".topbar .user.open").forEach(function (el) { el.classList.remove("open"); });
    });
  });

  // ---- Generic reusable comment thread, localStorage-backed. Used for
  // escalated sector issues, submissions, and commenting on visual assets
  // (templates, social tiles, posters). ----
  window.renderCommentThread = function (container, key, opts) {
    opts = opts || {};
    var CKEY = "mow_comments_v1";
    function esc(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
    function loadAll() { try { var s = JSON.parse(localStorage.getItem(CKEY)); if (s) return s; } catch (e) {} return {}; }
    function saveAll(all) { try { localStorage.setItem(CKEY, JSON.stringify(all)); } catch (e) {} }
    var all = loadAll();
    var list = all[key] || (opts.seed ? opts.seed.slice() : []);
    var wrap = document.createElement("div");
    wrap.className = "comment-thread";
    function render() {
      wrap.innerHTML =
        '<div class="ts-suggest-label">' + (opts.label || "Member comments") + "</div>" +
        '<div class="comment-list">' + (list.length ? list.map(function (c) {
          return '<div class="cc-item"><span class="cc-who">' + esc(c.who) + '</span><span class="cc-when">' + esc(c.when) + '</span><div class="cc-text">' + esc(c.text) + "</div></div>";
        }).join("") : '<p class="im-note" style="margin:0 0 10px">No comments yet — be the first.</p>') + "</div>" +
        '<div class="consult-comment-form"><input type="text" placeholder="' + esc(opts.placeholder || "Add a comment") + '"><button type="button">Post</button></div>';
      wrap.querySelector("button").addEventListener("click", function () {
        var input = wrap.querySelector("input");
        var val = input.value.trim();
        if (!val) return;
        list.push({ who: opts.me || "Liverpool Meals on Wheels", when: "just now", text: val });
        all[key] = list;
        saveAll(all);
        render();
      });
      wrap.querySelector("input").addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); wrap.querySelector("button").click(); }
      });
    }
    render();
    container.appendChild(wrap);
  };

  // ---- Generic popup pattern: show a summary first, collapse the rest of
  // the content behind a "Read more" toggle. Keeps the H2/author chip/meta
  // line and the first real paragraph visible; everything after that
  // (extra paragraphs, lists, download panels, notes) is collapsed. ----
  function collapsePopupSummary(container) {
    var kids = [].slice.call(container.children);
    var restStart = -1;
    var seenFirstPara = false;
    kids.forEach(function (el, i) {
      if (restStart !== -1) return;
      var tag = el.tagName;
      var cls = el.className || "";
      if (tag === "H2" || cls.indexOf("im-author") !== -1) return;
      if (tag === "P" && cls.indexOf("im-meta") !== -1 && !seenFirstPara) return;
      if (tag === "P" && cls.indexOf("im-note") === -1 && !seenFirstPara) { seenFirstPara = true; return; }
      restStart = i;
    });
    if (restStart === -1) return;
    var rest = kids.slice(restStart);
    if (!rest.length) return;
    var moreWrap = document.createElement("div");
    moreWrap.className = "im-more hide";
    rest.forEach(function (el) { moreWrap.appendChild(el); });
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "im-more-toggle"; btn.textContent = "Read more";
    btn.addEventListener("click", function () {
      var willShow = moreWrap.classList.contains("hide");
      moreWrap.classList.toggle("hide", !willShow);
      btn.textContent = willShow ? "Show less" : "Read more";
    });
    container.appendChild(btn);
    container.appendChild(moreWrap);
  }

  // Promote-category resources are visual assets — get a comment thread so
  // members can weigh in on the artwork/templates themselves.
  var VISUAL_ASSET_IDS = ["brand-logos", "campaign-kits", "mkt-campaign-cuppa", "media-releases", "social-templates", "fundraising-tools", "storytelling-guide"];

  // ---- Generic info-popup pattern ----
  var modal = document.getElementById("infoModal");
  var modalBody = document.getElementById("infoModalBody");
  if (modal && modalBody) {
    window.openInfoPopup = function (trigger) {
      var tpl = trigger.querySelector("template.popup-content");
      if (!tpl) return;
      modalBody.innerHTML = "";
      modalBody.appendChild(tpl.content.cloneNode(true));
      collapsePopupSummary(modalBody);
      var popupId = trigger.getAttribute("data-popup");
      if (popupId && VISUAL_ASSET_IDS.indexOf(popupId) !== -1) {
        window.renderCommentThread(modalBody, "asset-" + popupId, { label: "Comments on this artwork", placeholder: "What do you think of this design?" });
      } else if (trigger.hasAttribute("data-commentable")) {
        window.renderCommentThread(modalBody, trigger.getAttribute("data-comment-key") || popupId, {
          label: trigger.getAttribute("data-comment-label") || "Member comments",
          placeholder: trigger.getAttribute("data-comment-placeholder") || "Add a comment"
        });
      }
      modal.classList.remove("hide");
    };
    function closeModal() { modal.classList.add("hide"); }
    document.querySelectorAll("[data-popup]").forEach(function (trigger) {
      trigger.setAttribute("tabindex", "0");
      trigger.setAttribute("role", "button");
      trigger.addEventListener("click", function () { window.openInfoPopup(trigger); });
      trigger.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); window.openInfoPopup(trigger); }
      });
    });
    modal.querySelectorAll("[data-modal-close]").forEach(function (btn) {
      btn.addEventListener("click", closeModal);
    });
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }

  // ---- Deep-link: ?open=<data-popup value> auto-opens that popup on load ----
  // Lets dashboard links jump to a page and pop the right item. Pages with
  // their own popup systems (Connect consultations) also read window.__deepOpen.
  var params = new URLSearchParams(window.location.search);
  var deep = params.get("open");
  window.__deepOpen = deep;
  if (deep && modal && modalBody) {
    var target = document.querySelector('[data-popup="' + (window.CSS && CSS.escape ? CSS.escape(deep) : deep) + '"]');
    if (target && target.querySelector("template.popup-content")) {
      window.openInfoPopup(target);
    }
  }

  // ---- Netflix-style carousel arrows: any .carousel gets left/right nav
  // buttons that scroll by ~90% of its own width, hidden at each scroll end. ----
  document.querySelectorAll(".carousel").forEach(function (car) {
    if (car.closest(".carousel-nav-wrap")) return;
    var wrap = document.createElement("div");
    wrap.className = "carousel-nav-wrap";
    car.parentNode.insertBefore(wrap, car);
    wrap.appendChild(car);
    var prev = document.createElement("button");
    prev.type = "button"; prev.className = "carousel-arrow prev"; prev.setAttribute("aria-label", "Scroll left");
    prev.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>';
    var next = document.createElement("button");
    next.type = "button"; next.className = "carousel-arrow next"; next.setAttribute("aria-label", "Scroll right");
    next.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>';
    wrap.appendChild(prev); wrap.appendChild(next);
    function update() {
      prev.classList.toggle("hide", car.scrollLeft <= 4);
      next.classList.toggle("hide", car.scrollLeft >= car.scrollWidth - car.clientWidth - 4);
    }
    prev.addEventListener("click", function () { car.scrollBy({ left: -car.clientWidth * 0.85, behavior: "smooth" }); });
    next.addEventListener("click", function () { car.scrollBy({ left: car.clientWidth * 0.85, behavior: "smooth" }); });
    car.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    update();
  });

  // ---- Generic same-page category filter ----
  // Any page can opt in by marking its tab bar `data-cat-tabs` (tabs need
  // `data-cat="slug"` each) and wrapping each category's content in
  // `[data-cat-section="slug"]`. Clicking a tab — or ANY other `[data-cat]`
  // link on the page (e.g. an "Overview" quick-link card), or a nav-menu
  // link that lands on #slug — then actually shows just that category's
  // content instead of merely scrolling past the others. Falls back to the
  // first tab (typically "Overview") when the hash doesn't match anything.
  document.querySelectorAll("[data-cat-tabs]").forEach(function (tabWrap) {
    var tabs = [].slice.call(tabWrap.querySelectorAll(".tab[data-cat]"));
    var sections = [].slice.call(document.querySelectorAll("[data-cat-section]"));
    var triggers = [].slice.call(document.querySelectorAll("[data-cat]:not([data-cat-section])"));
    if (!tabs.length || !sections.length) return;

    function activate(slug, scroll) {
      if (!tabs.some(function (t) { return t.getAttribute("data-cat") === slug; })) {
        slug = tabs[0].getAttribute("data-cat");
      }
      tabs.forEach(function (t) { t.classList.toggle("active", t.getAttribute("data-cat") === slug); });
      sections.forEach(function (s) { s.classList.toggle("cat-hidden", s.getAttribute("data-cat-section") !== slug); });
      if (scroll) {
        var target = document.querySelector('[data-cat-section="' + slug + '"]');
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    triggers.forEach(function (t) {
      t.addEventListener("click", function (e) {
        e.preventDefault();
        var slug = t.getAttribute("data-cat");
        history.replaceState(null, "", "#" + slug);
        activate(slug, true);
      });
    });

    window.addEventListener("hashchange", function () {
      activate((window.location.hash || "").replace("#", ""), true);
    });

    activate((window.location.hash || "").replace("#", ""), !!window.location.hash);
  });
})();
