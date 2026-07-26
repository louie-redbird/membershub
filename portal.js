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
    { label: "Resources", pages: ["resources.html"], items: [
        ["resources.html#overview", "Overview"],
        ["resources.html#operate", "Operations"],
        ["resources.html#comply", "Compliance"],
        ["resources.html#deliver", "Delivery"]
    ]},
    { label: "News & Advocacy", pages: ["updates.html", "advocacy.html", "submissions.html"], items: [
        ["updates.html#updates", "All updates"],
        ["updates.html#mownews", "Meals on Wheels news"],
        ["updates.html#localnews", "Sector News"],
        ["updates.html#windup", "Weekly Windup"],
        ["updates.html#reforms", "Reform updates"],
        ["advocacy.html", "Advocacy priorities"],
        ["submissions.html", "Submissions and policy positions"]
    ]},
    { label: "Training & Events", pages: ["learning.html"], items: [
        ["learning.html#overview", "Overview"],
        ["learning.html#webinars", "Webinars and Events"],
        ["learning.html#modules", "Training modules"],
        ["learning.html#blogs", "Blogs"],
        ["learning.html#podcasts", "Podcasts"],
        ["learning.html#handbooks", "Handbooks and toolkits"]
    ]},
    { label: "Marketing", pages: ["marketing.html"], items: [
        ["marketing.html#overview", "Overview"],
        ["marketing.html#calendar", "Calendar"],
        ["marketing.html#campaigns", "Campaigns"],
        ["marketing.html#brand", "Branded Assets"]
    ]},
    { label: "Community", pages: ["connect.html", "directory.html", "engagement.html"], items: [
        ["connect.html#overview", "Overview"],
        ["engagement.html", "Get involved"],
        ["directory.html", "Member directory"],
        ["connect.html#haveyoursay", "Consultations and surveys"],
        ["connect.html#discussion", "Discussions"],
        ["connect.html#communities", "Communities of practice"],
        ["connect.html#escalated", "Escalated Issues"]
    ]}
  ];

  // ---- Sample content index, shared by the topbar search's autosuggest AND
  // archive.html (the tag/search results page). Reference build only — a
  // real build would query the CMS/search index instead. Exposed as
  // window.SITE_CONTENT so archive.html can read it directly. ----
  var CONTENT = [
    { title: "Weekly Windup — latest edition", url: "updates.html", type: "News", tags: ["news", "mow", "windup"] },
    { title: "National Minimum Data Set consultation", url: "connect.html?open=consult-nmds", type: "Consultation", tags: ["advocacy", "have-your-say", "mds"] },
    { title: "Member directory & map", url: "directory.html", type: "Directory", tags: ["community", "directory", "map"] },
    { title: "Volunteer Coordinators Network", url: "connect.html#communities", type: "Community", tags: ["community", "volunteers", "working-group"] },
    { title: "Your Network Support Officer", url: "support.html", type: "Support", tags: ["support", "contact", "nso"] },
    { title: "Police check guidance", url: "resources.html?open=police-check", type: "Guide", tags: ["hr", "volunteers"] },
    { title: "AGM document templates", url: "resources.html?open=agm-templates", type: "Template", tags: ["governance"] },
    { title: "Grant acquittal checklist", url: "resources.html?open=grant-acquittal", type: "Checklist", tags: ["finance", "funding"] },
    { title: "Insurance and risk register template", url: "resources.html?open=insurance-risk", type: "Template", tags: ["risk", "governance"] },
    { title: "Volunteer expense reimbursement policy", url: "resources.html?open=volunteer-expenses", type: "Policy", tags: ["hr", "volunteers"] },
    { title: "Support at Home reporting update", url: "resources.html?open=sah-reporting", type: "Guide", tags: ["chsp", "reform"] },
    { title: "APD annual meal review guidance", url: "resources.html?open=apd-review", type: "Guide", tags: ["aged-care", "quality"] },
    { title: "Quality Standards self-assessment tool", url: "resources.html?open=quality-standards", type: "Checklist", tags: ["quality", "reporting"] },
    { title: "SIRS incident reporting guide", url: "resources.html?open=sirs-guide", type: "Guide", tags: ["sirs", "reporting"] },
    { title: "Provider obligations checklist", url: "resources.html?open=provider-obligations", type: "Checklist", tags: ["aged-care", "reporting"] },
    { title: "Client intake and referral form", url: "resources.html?open=client-intake", type: "Form", tags: ["clients", "referrals"] },
    { title: "Welfare check and incident reporting guide", url: "resources.html?open=welfare-check", type: "Guide", tags: ["safety", "delivery"] },
    { title: "Nutrition and menu planning guide", url: "resources.html?open=nutrition-guide", type: "Guide", tags: ["nutrition"] },
    { title: "Referral pathway map", url: "resources.html?open=referral-pathway", type: "Guide", tags: ["referrals"] },
    { title: "Vehicle and delivery safety checklist", url: "resources.html?open=vehicle-safety", type: "Checklist", tags: ["safety", "delivery"] },
    { title: "APD annual meal review: what's required", url: "learning.html?open=up-apd-review", type: "Webinar", tags: ["nutrition", "dietitian"] },
    { title: "Volunteer induction: setting your team up right", url: "learning.html?open=up-volunteer-induction", type: "Webinar", tags: ["volunteers", "induction"] },
    { title: "Ageing Australia NSW/ACT State Conference", url: "learning.html?open=up-ageing-conference", type: "In-person", tags: ["conference", "sector"] },
    { title: "Financially Disadvantaged Fund: how to apply", url: "learning.html?open=up-fdf", type: "Webinar", tags: ["funding", "fdf"] },
    { title: "CHSP Unlocked virtual forum", url: "learning.html?open=rec-chsp-unlocked", type: "Recording", tags: ["chsp", "compliance"] },
    { title: "Understanding the Aged Care Act 2024", url: "learning.html?open=rec-aged-care-act", type: "Recording", tags: ["compliance", "reform"] },
    { title: "Grant writing basics for small services", url: "learning.html?open=rec-grant-writing", type: "Recording", tags: ["grants", "finance"] },
    { title: "Board governance essentials refresher", url: "learning.html?open=rec-governance-refresher", type: "Recording", tags: ["governance"] },
    { title: "Volunteer recruitment in regional areas", url: "learning.html?open=rec-volunteer-regional", type: "Recording", tags: ["volunteers", "regional"] },
    { title: "Quality Standards self-assessment walkthrough", url: "learning.html?open=rec-quality-standards", type: "Recording", tags: ["quality", "governance"] },
    { title: "CHSP acquittal: common mistakes", url: "learning.html?open=rec-chsp-acquittal", type: "Recording", tags: ["chsp", "finance"] },
    { title: "New member service onboarding", url: "learning.html?open=mod-onboarding", type: "Module", tags: ["onboarding"] },
    { title: "Board governance essentials", url: "learning.html?open=mod-governance", type: "Module", tags: ["governance"] },
    { title: "Five ways to make volunteer shifts easier to fill", url: "learning.html?open=five-ways-shifts", type: "Blog", tags: ["volunteers", "rostering"] },
    { title: "The Loneliness Line: our advocacy team", url: "learning.html?open=loneliness-line", type: "Podcast", tags: ["advocacy"] },
    { title: "Volunteer coordinator handbook", url: "learning.html?open=vol-handbook", type: "Handbook", tags: ["volunteers", "hr"] },
    { title: "Welfare check & incident reporting toolkit", url: "learning.html?open=wc-toolkit", type: "Toolkit", tags: ["safety", "volunteers"] },
    { title: "National Meals on Wheels Day", url: "marketing.html?open=mkt-campaign-nmwd", type: "Campaign", tags: ["campaign", "volunteers", "awareness"] },
    { title: "Cuppa for a Cause", url: "marketing.html?open=mkt-campaign-cuppa", type: "Campaign", tags: ["campaign", "fundraising"] },
    { title: "Brand guidelines and logo pack", url: "marketing.html?open=brand-logos", type: "Brand asset", tags: ["brand", "logo", "print", "digital"] },
    { title: "Campaign kits", url: "marketing.html?open=campaign-kits", type: "Brand asset", tags: ["campaign", "brand", "social", "print"] },
    { title: "Media releases", url: "marketing.html?open=media-releases", type: "Template", tags: ["brand", "media", "approval"] },
    { title: "Social media templates", url: "marketing.html?open=social-templates", type: "Brand asset", tags: ["social", "brand", "canva"] },
    { title: "Fundraising tools", url: "marketing.html?open=fundraising-tools", type: "Template", tags: ["fundraising", "brand"] },
    { title: "Storytelling guide", url: "marketing.html?open=storytelling-guide", type: "Guide", tags: ["brand", "storytelling", "media"] }
  ];
  window.SITE_CONTENT = CONTENT;
  var searchIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
  var chev = '<svg class="chev" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg>';
  var bellIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';

  // ---- Notifications feed. These are the member-engagement prompts that also
  // drive the "bell" dropdown in the topbar; clicking one deep-links straight
  // to the thing that needs the member (a thread, a consultation, renewal).
  // The full set — and the reasoning behind each — lives on the Get involved
  // page (engagement.html) under Community. Reference build: sample data only. ----
  var NI = {
    reply: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    like: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    renewal: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
    consult: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
    event: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
  };
  var NOTIFICATIONS = [
    { id: "n-reply-shifts", tone: "reply", text: "<strong>Simone Despoges</strong> replied in your discussion <strong>Filling volunteer shifts</strong>", time: "2 hours ago", url: "connect.html#discussion" },
    { id: "n-like-nmds", tone: "like", text: "Your comment on the <strong>National Minimum Data Set consultation</strong> was liked", time: "Yesterday", url: "connect.html?open=consult-nmds" },
    { id: "n-renewal", tone: "renewal", text: "Membership renewal is due in <strong>14 days</strong> — a quick confirm keeps your benefits active", time: "Due 9 Aug 2026", url: "myservice.html#renewal" },
    { id: "n-consult-newsletter", tone: "consult", text: "New consultation open: <strong>Member newsletter redesign</strong>. Five minutes to have your say", time: "3 days ago", url: "connect.html?open=consult-newsletter" },
    { id: "n-thread-chsp", tone: "reply", text: "<strong>2 new replies</strong> in <strong>CHSP transition</strong>, a thread you're following", time: "4 days ago", url: "connect.html#discussion" }
  ];
  function readNotifs() { try { return JSON.parse(localStorage.getItem("mow_notifs_read") || "[]") || []; } catch (e) { return []; } }
  function saveReadNotifs(a) { try { localStorage.setItem("mow_notifs_read", JSON.stringify(a)); } catch (e) {} }

  // ---- Popup content for each notification. Clicking a notification opens the
  // relevant thing (thread, consultation paper, renewal) in the shared info
  // modal, on whatever page the member is on, rather than navigating away.
  // Each popup ends with a link through to the full page. Reference build:
  // the content mirrors the real threads/consultations on Community. ----
  function npMsg(initials, name, role, time, text, opts) {
    opts = opts || {};
    return '<div class="npop-msg' + (opts.hl ? " hl" : "") + (opts.mine ? " mine" : "") + '">' +
      '<span class="npop-av">' + initials + "</span>" +
      '<div class="npop-msg-body"><div class="npop-msg-head"><span class="npop-name">' + name + "</span>" +
        (role ? '<span class="npop-role">' + role + "</span>" : "") +
        '<span class="npop-time">' + time + "</span></div>" +
        '<p class="npop-text">' + text + "</p></div></div>";
  }
  function npFooter(url, label) {
    return '<a class="btn-secondary" href="' + url + '" style="width:100%;justify-content:center;margin-top:14px">' + label + ' &rarr;</a>';
  }
  function npReplyBox() {
    return '<div class="npop-reply"><textarea placeholder="Write a reply..." aria-label="Write a reply"></textarea>' +
      '<button class="btn-primary npop-reply-btn" type="button">Post reply</button></div>' +
      '<div class="npop-thanks hide">Thanks, your reply has been posted to the thread. In the finished build it would notify everyone following it.</div>';
  }
  var NOTIF_POPUPS = {
    "n-reply-shifts": function () {
      return '<h2>Filling volunteer shifts</h2>' +
        '<p class="im-meta">Discussion &middot; Operate &middot; you started this thread</p>' +
        '<div class="npop-thread">' +
          npMsg("YO", "You", "Meals on Wheels Blacktown", "3 days ago", "We're consistently short on Thursday and Friday runs. What's working for other services to fill the gaps without leaning on the same few people every week?", { mine: true }) +
          npMsg("SD", "Simone Despoges", "MOW NSW &middot; Network Support", "2 hours ago", "A few services have had good results splitting the long runs into two shorter shifts and publishing the roster a fortnight ahead. Happy to share the template we put together, I'll drop it into the Volunteer Coordinators Network too.", { hl: true }) +
          npMsg("PN", "Priya Nair", "Wagga Wagga Meals on Wheels", "1 hour ago", "Same-day reminder texts made the biggest difference for us. No-shows dropped noticeably.") +
        "</div>" +
        npReplyBox() +
        npFooter("connect.html#discussion", "Open in Discussions");
    },
    "n-thread-chsp": function () {
      return '<h2>CHSP transition</h2>' +
        '<p class="im-meta">Discussion &middot; Comply &middot; a thread you\'re following &middot; 2 new replies</p>' +
        '<div class="npop-thread">' +
          npMsg("RT", "Raj Tan", "Penrith Meals on Wheels", "5 days ago", "Has anyone mapped their current CHSP service types across to the new Support at Home categories yet? Trying to work out where our meal service lands.") +
          npMsg("LB", "Leesa O'Keefe", "MOW NSW &middot; Member Training", "Yesterday", "We're running a walkthrough at the next webinar, but the short version: meals stay in scope. I'll post the mapping table here once it's confirmed.", { hl: true }) +
          npMsg("MC", "Maria Costa", "Shoalhaven Meals on Wheels", "6 hours ago", "Following, this is exactly what our board is asking about. Thanks Leesa.", { hl: true }) +
        "</div>" +
        npReplyBox() +
        npFooter("connect.html#discussion", "Open in Discussions");
    },
    "n-like-nmds": function () {
      return '<div class="npop-banner"><span class="npop-banner-ic">&#9829;</span> <strong>Simone Despoges</strong> and 3 others liked your comment on this consultation.</div>' +
        '<h2>National Minimum Data Set consultation</h2>' +
        '<p class="im-meta">Consultation &middot; Survey &middot; closes 12 Jul 2026</p>' +
        '<p>The Department is proposing a National Minimum Data Set (NMDS) for community aged care, aimed at giving a consistent national picture of who is being supported and what services they receive.</p>' +
        '<p>MOW NSW is preparing a sector submission and wants member input before responding.</p>' +
        '<div class="npop-quote"><p class="npop-quote-label">Your comment</p><p>"The proposed demographic fields largely duplicate what we already report through CHSP. The bigger issue is the six-week timeline, which is unworkable for services without paid admin staff."</p></div>' +
        '<p class="im-note">Not the real consultation wording. Confirm actual content with MOW NSW policy/advocacy before this goes live.</p>' +
        npFooter("connect.html?open=consult-nmds", "View the full consultation and respond");
    },
    "n-consult-newsletter": function () {
      return '<h2>Proposed changes to the Marketing Updates newsletter</h2>' +
        '<p class="im-meta">Newsletter feedback &middot; closes 30 Jul 2026</p>' +
        '<p>MOW NSW is considering moving the Marketing Updates newsletter from monthly to fortnightly, and splitting it into two streams: a short "need to know" alert email, and a longer monthly digest with campaign kits, brand assets and success stories.</p>' +
        '<p>What we would like your feedback on:</p>' +
        '<ul>' +
          '<li>Whether a shorter, more frequent "need to know" email would actually get read, or just add to inbox fatigue</li>' +
          '<li>Whether splitting brand and campaign content into a separate monthly digest makes it easier or harder to find</li>' +
          '<li>Any format or channel you would prefer instead (for example an SMS alert for genuinely urgent items only)</li>' +
        "</ul>" +
        '<p class="im-note">Not final newsletter strategy content.</p>' +
        npFooter("connect.html?open=consult-newsletter", "Give your feedback");
    },
    "n-renewal": function () {
      return '<h2>Membership renewal</h2>' +
        '<p class="im-meta">Meals on Wheels Blacktown &middot; due 9 August 2026</p>' +
        '<div class="npop-banner"><span class="npop-banner-ic">&#8635;</span> Your membership renews in <strong>14 days</strong>. Confirming now keeps everything active with no break.</div>' +
        '<p>Renewing keeps your service\'s access to member-only resources, training, and the member voice in MOW NSW advocacy. Letting it lapse can temporarily interrupt that access.</p>' +
        '<ul>' +
          '<li>Membership year: 2026&ndash;27</li>' +
          '<li>Invoice: issued to your service\'s billing contact</li>' +
          '<li>What to check: your contact details and service profile are current</li>' +
        "</ul>" +
        '<p class="im-note">No real invoice is raised in this demo.</p>' +
        npFooter("myservice.html#renewal", "Review and confirm renewal");
    }
  };
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
  window.mowActiveAccount = activeAccount;
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

    // ---- Notifications bell + dropdown ----
    var readIds = readNotifs();
    var unreadCount = NOTIFICATIONS.filter(function (n) { return readIds.indexOf(n.id) === -1; }).length;
    var notifItemsHtml = NOTIFICATIONS.map(function (n) {
      var unread = readIds.indexOf(n.id) === -1;
      return '<a class="notif-item' + (unread ? " unread" : "") + '" href="' + n.url + '" data-notif="' + n.id + '">' +
        '<span class="notif-icon notif-' + n.tone + '">' + NI[n.tone] + "</span>" +
        '<span class="notif-body"><span class="notif-text">' + n.text + '</span><span class="notif-time">' + n.time + "</span></span>" +
        (unread ? '<span class="notif-dot" aria-label="Unread"></span>' : "") +
      "</a>";
    }).join("");
    var notifHtml =
      '<div class="notif" id="notifWrap">' +
        '<button type="button" class="notif-toggle" id="notifToggle" aria-label="Notifications" aria-expanded="false">' + bellIcon +
          (unreadCount ? '<span class="notif-badge" id="notifBadge">' + unreadCount + "</span>" : '<span class="notif-badge hide" id="notifBadge">0</span>') +
        "</button>" +
        '<div class="notif-menu" id="notifMenu">' +
          '<div class="notif-head"><span>Notifications</span><button type="button" id="notifMarkAll">Mark all read</button></div>' +
          '<div class="notif-list" id="notifList">' + notifItemsHtml + "</div>" +
          '<a class="notif-foot" href="engagement.html">See all the ways to get involved &rarr;</a>' +
        "</div>" +
      "</div>";

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
            notifHtml +
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
        '<div class="modal" id="infoModalInner">' +
          '<button class="close" data-modal-close aria-label="Close">&times;</button>' +
          '<button class="modal-expand-btn" id="infoModalExpandBtn" type="button" aria-label="Expand" title="Expand"></button>' +
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
        "Sarah Thomas": { role: "Manager, Network Support, Products and Services", email: "SarahT@nswmealsonwheels.org.au" },
        "Leesa O'Keefe": { role: "Network Support Officer · Member Training & Communication", email: "LeesaO@nswmealsonwheels.org.au" },
        "Simone Despoges": { role: "Network Support Officer (South Western Sydney, Macarthur/Wingecarribee, Illawarra, Southern Highlands)", email: "Simone.D@nswmealsonwheels.org.au" },
        "Louie Radburnd": { role: "Marketing and Fundraising Manager · Nutrition & Quality", email: "LouieR@nswmealsonwheels.org.au" },
        "Claudia": { role: "Chief Executive Officer", email: "ClaudiaO@nswmealsonwheels.org.au" },
        "Liza Torres": { role: "Corporate Services Officer (Finance)", email: "Finance@nswmealsonwheels.org.au" },
        "Sue Dryden": { role: "Engagement & Communications Coordinator", email: "Volunteer.Coordinator@nswmealsonwheels.org.au" },
        "Rezwan Sarker": { role: "Administration Officer / IT Liaison", email: "Reception@nswmealsonwheels.org.au" },
        "Puvana Thillai Nadesan": { role: "General Manager, Corporate Resources", email: "PuvanaT@nswmealsonwheels.org.au" },
        "Jenny Rea": { role: "Network Support Officer (Riverina Murray)", email: "Jenny@nswmealsonwheels.org.au" },
        "Sheryl Smith": { role: "Network Support Officer (Central West, Orana Far West)", email: "SherylG@nswmealsonwheels.org.au" },
        "Kathy Jennings": { role: "Network Support Officer (Northern NSW & Sydney regions)", email: "KathyJ@nswmealsonwheels.org.au" },
        "Denise Chapman": { role: "Network Support Dietitian (APD)", email: "DeniseC@nswmealsonwheels.org.au" },
        "Laura Brooks": { role: "Marketing and Dietetics Communication Coordinator (APD)", email: "LauraB@nswmealsonwheels.org.au" }
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
        '<div class="drawer-overlay" id="supportDrawerOverlay"></div>' +
        '<aside class="side-drawer" id="supportDrawer" aria-hidden="true">' +
          '<div class="drawer-head"><button class="drawer-close" id="supportDrawerClose" aria-label="Close">&times;</button></div>' +
          '<div class="drawer-body info-modal-body" id="supportFabBody"></div>' +
        "</aside>";
      body.insertAdjacentHTML("beforeend", fabHtml);

      var CATS = [
        { cat: "Compliance & reporting", name: "Leesa O'Keefe", init: "LO" },
        { cat: "Funding & grants", name: "Liza Torres", init: "LT" },
        { cat: "HR & volunteers", name: "Sue Dryden", init: "SD" },
        { cat: "Brand, comms & nutrition", name: "Louie Radburnd", init: "LR" },
        { cat: "Technical / portal access", name: "Rezwan Sarker", init: "RS" }
      ];
      function initialsOf(name) { return (name || "").split(" ").filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase(); }

      var overlay = document.getElementById("supportDrawerOverlay");
      var drawer = document.getElementById("supportDrawer");
      var fabBody = document.getElementById("supportFabBody");
      function openFabDrawer() { overlay.classList.add("open"); drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); }
      function closeFabDrawer() { overlay.classList.remove("open"); drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); }
      var dir = window.__STAFF_DIRECTORY || {};
      var bookIcon = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
      var msgIcon = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
      var callIcon = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
      var mailIcon = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg>';
      var teamsIcon = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/><path d="M9 14h6v4H9z"/></svg>';

      function homeView() {
        fabBody.innerHTML =
          '<h2>Support</h2>' +
          '<p class="im-meta">Contact a team, book time with your NSO, or open a quick guide — no need to leave this window.</p>' +
          '<div class="fab-nso">' +
            '<span class="fn-avatar">ST' + window.mowPresence.dotHtml("Sarah Thomas") + '</span>' +
            '<div class="fn-info"><div class="fn-flag">Your NSO</div><div class="fn-name">Sarah Thomas</div><div class="fn-role">Sydney metro region</div></div>' +
            '<div class="fn-actions">' +
              '<button type="button" data-fab-contact="Sarah Thomas" title="Message, call, email or Teams">' + msgIcon + "</button>" +
              '<a href="https://outlook.office.com/bookwithme/user/SarahT@nswmealsonwheels.org.au" target="_blank" rel="noopener" title="Book a time (O365 Bookings)">' + bookIcon + "</a>" +
            "</div>" +
          "</div>" +
          '<div class="fab-grid-label">Contact a team</div>' +
          '<div class="fab-contact-grid">' +
          CATS.map(function (c) {
            return '<button type="button" class="fab-contact-tile" data-fab-contact="' + c.name + '"><span class="fc-avatar">' + c.init + window.mowPresence.dotHtml(c.name) + "</span><span class=\"fc-name\">" + c.name + '</span><span class="fc-cat">' + c.cat + "</span></button>";
          }).join("") +
          '<button type="button" class="fab-contact-tile" data-fab-view="directory"><span class="fc-avatar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span><span class="fc-name">See full staff directory</span><span class="fc-cat">All MOW NSW contacts</span></button>' +
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
            var tile = btn.closest(".fab-contact-tile");
            var cat = tile ? tile.querySelector(".fc-cat").textContent : "";
            contactView(btn.getAttribute("data-fab-contact"), cat);
          });
        });
        fabBody.querySelectorAll("[data-fab-view]").forEach(function (btn) {
          btn.addEventListener("click", function () {
            var v = btn.getAttribute("data-fab-view");
            if (v === "ask") askView();
            else if (v === "faq") faqView();
            else if (v === "directory") directoryView();
            else transitionView();
          });
        });
      }

      function backBtn() { return '<button class="fab-back" type="button" id="fabBack">&larr; Back</button>'; }
      function wireBack(fn) { document.getElementById("fabBack").addEventListener("click", fn || homeView); }

      // ---- Full staff directory: every real MOW NSW contact, browsable
      // inside the drawer. Selecting anyone opens contactView in-place —
      // contacting someone never has to leave this panel. ----
      function directoryView() {
        var names = Object.keys(dir).sort(function (a, b) { return a.localeCompare(b); });
        fabBody.innerHTML = backBtn() +
          "<h2>Staff directory</h2>" +
          '<p class="im-meta" style="margin-bottom:14px">Every MOW NSW contact — pick anyone to call, email or message them from here.</p>' +
          '<div class="fab-directory-list">' +
          names.map(function (name) {
            return '<button type="button" class="fab-directory-row" data-directory-contact="' + name + '"><span class="fc-avatar">' + initialsOf(name) + window.mowPresence.dotHtml(name) + '</span><span class="fdr-info"><span class="fdr-name">' + name + '</span><span class="fdr-role">' + (dir[name].role || "") + "</span></span></button>";
          }).join("") +
          "</div>";
        wireBack();
        fabBody.querySelectorAll("[data-directory-contact]").forEach(function (btn) {
          btn.addEventListener("click", function () { contactView(btn.getAttribute("data-directory-contact"), "", directoryView); });
        });
      }

      // ---- In-drawer contact view: Call / Email / Teams + a message form,
      // replacing the old approach of popping a separate modal on top of
      // the drawer. backTo controls where "Back" returns to (the home grid,
      // or the full directory if that's where this was opened from). ----
      function contactView(name, fallbackRole, backTo) {
        var info = dir[name] || {};
        var role = info.role || fallbackRole || "";
        var email = info.email || "info@nswmealsonwheels.org.au";
        var teamsUrl = "https://teams.microsoft.com/l/meeting/new?subject=" + encodeURIComponent("Portal enquiry") + "&attendees=" + encodeURIComponent(email);
        fabBody.innerHTML = backBtn() +
          '<div class="fab-contact-header"><span class="fc-avatar">' + initialsOf(name) + window.mowPresence.dotHtml(name) + '</span><div><span class="fdr-name" style="display:block">' + name + '</span><span class="fdr-role" style="display:block">' + role + "</span></div></div>" +
          '<div class="contact-action-row">' +
            '<a class="contact-action" href="tel:1300679669">' + callIcon + "Call</a>" +
            '<a class="contact-action" href="mailto:' + email + '">' + mailIcon + "Email</a>" +
            '<a class="contact-action" target="_blank" rel="noopener" href="' + teamsUrl + '">' + teamsIcon + "Teams</a>" +
          "</div>" +
          '<div class="ts-suggest-label" style="margin-top:16px">' + msgIcon + " Message via portal</div>" +
          '<form id="fabContactForm"><div class="field"><label>To</label><input type="text" value="' + name + '" readonly></div>' +
          '<div class="field"><label>Your message</label><textarea id="fabContactMsg" style="min-height:90px" placeholder="What do you need help with?"></textarea></div>' +
          '<button class="btn-primary" type="submit">Send message</button></form>' +
          '<div class="announce-thanks hide" id="fabContactThanks">Sent — ' + name + " will reply through your portal inbox.</div>";
        wireBack(backTo);
        document.getElementById("fabContactForm").addEventListener("submit", function (e) {
          e.preventDefault();
          document.getElementById("fabContactForm").classList.add("hide");
          document.getElementById("fabContactThanks").classList.remove("hide");
        });
      }

      function askView() {
        fabBody.innerHTML = backBtn() +
          "<h2>Ask for Help</h2>" +
          '<p class="im-meta" style="margin-bottom:14px">Log a request and it routes to the right person (and copies your NSO).</p>' +
          '<form id="fabAskForm">' +
          '<div class="field"><label>What do you need help with?</label><select><option>Choose a topic</option><option>Compliance / reporting</option><option>Funding / grants</option><option>HR / volunteers</option><option>Brand, comms & media</option><option>Technical / portal access</option><option>Something else</option></select></div>' +
          '<div class="field"><label>Tell us more</label><textarea style="min-height:90px" placeholder="A few details helps the team get back to you faster"></textarea></div>' +
          '<button class="btn-primary" type="submit">Submit request</button></form>' +
          '<div class="announce-thanks hide" id="fabAskThanks">Thanks — your request has been logged and routed to the relevant team. Nothing is actually sent.</div>';
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
        openFabDrawer();
      });
      document.getElementById("supportDrawerClose").addEventListener("click", closeFabDrawer);
      overlay.addEventListener("click", closeFabDrawer);
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeFabDrawer(); });
    })();

    // ---- Site footer (every chrome page). Content and structure mirror
    // nswmealsonwheels.org.au's real footer (address, phone, acknowledgement
    // of country, useful links, charity status, ABN/legal row) — external
    // links point at the live public site since those pages don't exist here. ----
    (function () {
      var footerWaveSvg = '<svg viewBox="0 0 1440 70" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M0,30 C220,60 460,10 720,35 C980,60 1220,15 1440,40 L1440,70 L0,70 Z" fill="var(--navy-deep)"/>' +
        '</svg>';
      var footerHtml =
        '<footer class="site-footer">' +
          '<div class="divider wave footer-wave">' + footerWaveSvg + "</div>" +
          '<div class="footer-inner">' +
            '<div class="footer-col">' +
              '<div class="footer-brand"><span class="mark"><img src="mow-favicon.svg" width="18" height="18" alt="MOW NSW"></span>Meals on Wheels NSW</div>' +
              '<p>0.2 Ground Floor, 15 Bourke Road<br>Mascot NSW 2020</p>' +
              '<p><a href="tel:1300679669">Call 1300 679 669</a><br>7:30am–4:00pm weekdays</p>' +
              '<p class="footer-ack">We acknowledge the Traditional Custodians of the lands and waters across Australia, and pay our respects to Elders past and present.</p>' +
            "</div>" +
            '<div class="footer-col">' +
              '<div class="footer-col-head">Member portal</div>' +
              '<a href="index.html">Dashboard</a><a href="resources.html">Resources</a><a href="support.html">Support</a><a href="connect.html">Community</a>' +
            "</div>" +
            '<div class="footer-col">' +
              '<div class="footer-col-head">Useful links</div>' +
              '<a href="https://nswmealsonwheels.org.au/meals/find-a-meal" target="_blank" rel="noopener">Find a meal</a>' +
              '<a href="https://nswmealsonwheels.org.au/volunteer" target="_blank" rel="noopener">Become a volunteer</a>' +
              '<a href="https://nswmealsonwheels.org.au/donate/donate-now" target="_blank" rel="noopener">Donate now</a>' +
              '<a href="https://nswmealsonwheels.org.au/contact-us" target="_blank" rel="noopener">Contact MOW NSW</a>' +
            "</div>" +
            '<div class="footer-col">' +
              '<div class="footer-col-head">We are</div>' +
              "<p>A Registered Charity.<br>Endorsed as a Deductible Gift Recipient.<br>Supported by the Australian Government.</p>" +
            "</div>" +
          "</div>" +
          '<div class="footer-bottom">' +
            "<span>&copy; " + new Date().getFullYear() + " Meals on Wheels NSW Ltd. All rights reserved. ABN 87 418 074 604.</span>" +
            '<span class="footer-legal">' +
              '<a href="https://nswmealsonwheels.org.au/terms-and-conditions" target="_blank" rel="noopener">Terms of use</a>' +
              '<a href="https://nswmealsonwheels.org.au/privacy-policy" target="_blank" rel="noopener">Privacy</a>' +
              '<a href="https://nswmealsonwheels.org.au/accessibility" target="_blank" rel="noopener">Accessibility</a>' +
            "</span>" +
          "</div>" +
        "</footer>";
      body.insertAdjacentHTML("beforeend", footerHtml);
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
        var allTags = [];
        CONTENT.forEach(function (c) { c.tags.forEach(function (t) { if (allTags.indexOf(t) === -1) allTags.push(t); }); });
        var tagMatches = allTags.filter(function (t) { return !term || t.indexOf(term) !== -1; }).slice(0, 10);

        var html = "";
        if (top3.length) {
          html += '<div class="ts-suggest-label">Most popular</div><div class="ts-suggest-cols">' +
            top3.map(function (c) {
              return '<a class="ts-suggest-item" href="' + c.url + '"><div class="tsi-t">' + esc(c.title) + '</div><div class="tsi-m">' + esc(c.type) + "</div></a>";
            }).join("") + "</div>";
        } else if (term) {
          html += '<div class="ts-suggest-label">No matches</div>';
        }
        if (tagMatches.length) {
          html += '<div class="ts-suggest-label">Tags</div><div class="ts-suggest-tags">' +
            tagMatches.map(function (t) { return '<a class="tstag" href="archive.html?tag=' + encodeURIComponent(t) + '">#' + esc(t) + "</a>"; }).join("") + "</div>";
        }
        if (term) {
          html += '<a class="ts-suggest-all" href="archive.html?q=' + encodeURIComponent(term) + '">See all ' + matches.length + " result" + (matches.length === 1 ? "" : "s") + " &rarr;</a>";
        }
        suggest.innerHTML = html;
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
      input.addEventListener("keydown", function (e) {
        if (e.key !== "Enter") return;
        var term = input.value.trim();
        if (term) window.location.href = "archive.html?q=" + encodeURIComponent(term);
      });
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

  // ---- Notifications dropdown ----
  (function () {
    var wrap = document.getElementById("notifWrap");
    if (!wrap) return;
    var toggle = document.getElementById("notifToggle");
    var menu = document.getElementById("notifMenu");
    var badge = document.getElementById("notifBadge");

    function markRead(id) {
      var read = readNotifs();
      if (read.indexOf(id) === -1) { read.push(id); saveReadNotifs(read); }
      var item = menu.querySelector('[data-notif="' + id + '"]');
      if (item) { item.classList.remove("unread"); var dot = item.querySelector(".notif-dot"); if (dot) dot.remove(); }
      updateBadge();
    }
    function updateBadge() {
      var n = menu.querySelectorAll(".notif-item.unread").length;
      badge.textContent = n;
      badge.classList.toggle("hide", n === 0);
    }
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var willOpen = !wrap.classList.contains("open");
      document.querySelectorAll(".topbar .user.open").forEach(function (el) { el.classList.remove("open"); });
      wrap.classList.toggle("open", willOpen);
      toggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
    menu.addEventListener("click", function (e) { e.stopPropagation(); });
    // Clicking a notification marks it read and opens the relevant thing
    // (thread, consultation paper, newsletter, renewal) as a popup, right on
    // the current page. If no popup is defined, its href navigates as a fallback.
    menu.querySelectorAll(".notif-item").forEach(function (item) {
      item.addEventListener("click", function (e) {
        var id = item.getAttribute("data-notif");
        markRead(id);
        var builder = NOTIF_POPUPS[id];
        if (builder && typeof window.openInfoPopupHtml === "function") {
          e.preventDefault();
          wrap.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
          window.openInfoPopupHtml(builder(), { wide: true });
          var box = document.getElementById("infoModalBody");
          var rb = box.querySelector(".npop-reply-btn");
          if (rb) rb.addEventListener("click", function () {
            var r = box.querySelector(".npop-reply"); if (r) r.classList.add("hide");
            var t = box.querySelector(".npop-thanks"); if (t) t.classList.remove("hide");
          });
        }
      });
    });
    document.getElementById("notifMarkAll").addEventListener("click", function (e) {
      e.stopPropagation();
      NOTIFICATIONS.forEach(function (n) { markRead(n.id); });
    });
    document.addEventListener("click", function () { wrap.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { wrap.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); } });
  })();

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

  // ---- Staff presence + org "are we open" status. Reference build mock of
  // an Outlook-calendar sync: business hours are Mon-Fri 7:30am-4pm (the
  // office hours MOW NSW states everywhere), and each staff member's own
  // dot is a deterministic pseudo-random flicker within that window so it
  // doesn't just mirror the org-wide state for every single person. ----
  window.mowPresence = (function () {
    function isBusinessHours() {
      var d = new Date(), day = d.getDay();
      if (day === 0 || day === 6) return false;
      var mins = d.getHours() * 60 + d.getMinutes();
      return mins >= 7 * 60 + 30 && mins < 16 * 60;
    }
    function hash(s) {
      var h = 0;
      for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
      return h;
    }
    function isStaffOnline(name) {
      if (!isBusinessHours()) return false;
      var slot = Math.floor(Date.now() / (10 * 60 * 1000));
      return (hash(name || "") + slot) % 3 !== 0;
    }
    function dotHtml(name) {
      var on = isStaffOnline(name);
      return '<span class="presence-dot' + (on ? " on" : "") + '" title="' + (on ? "Online now" : "Offline right now") + ' — synced with Outlook calendar"></span>';
    }
    function statusBannerHtml() {
      var open = isBusinessHours();
      return open
        ? '<div class="fab-status-line on"><span class="status-dot"></span> <strong>Meals on Wheels NSW is online</strong> — call <a href="tel:1300679669">1300 679 669</a> or send a message below</div>'
        : '<div class="fab-status-line off"><span class="status-dot"></span> <strong>We\'re offline right now</strong> — a message is the best way to reach us. Call <a href="tel:1300679669">1300 679 669</a>, 7:30am–4pm weekdays.</div>';
    }
    return { isBusinessHours: isBusinessHours, isStaffOnline: isStaffOnline, dotHtml: dotHtml, statusBannerHtml: statusBannerHtml };
  })();

  // ---- Discussion-thread notification subscriptions, localStorage-backed.
  // Shared between the dashboard's Active Discussions widget (which can
  // filter to "Subscribed") and the bell toggle on each thread card in
  // Connect &gt; Discussions. ----
  window.mowSubscriptions = (function () {
    var KEY = "mow_subscribed_threads_v1";
    function load() { try { var s = JSON.parse(localStorage.getItem(KEY)); if (Array.isArray(s)) return s; } catch (e) {} return []; }
    function save(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} }
    return {
      isSubscribed: function (id) { return load().indexOf(id) !== -1; },
      toggle: function (id) {
        var list = load(), i = list.indexOf(id);
        if (i === -1) list.push(id); else list.splice(i, 1);
        save(list);
        return i === -1;
      },
      all: function () { return load(); }
    };
  })();

  // ---- Discussions widget: an "Active" or "Subscribed" card used on the
  // dashboard AND inside Connect's Discussions page. One shared renderer so
  // both stay in sync with mow_threads_v2 and with each other. Two ways to
  // mount it: call it once per mode (the original pattern — two stacked
  // cards, no toggle), or pass opts.toggle: true to get ONE card with a
  // Subscribed/Active pill switch built in (opts.mode sets which starts
  // active). ----
  window.initDiscussionsWidget = function (containerEl, opts) {
    opts = opts || {};
    var mode = opts.mode || "active";
    var KEY = "mow_threads_v2";
    var SEED = [
      { id: "t1", person: "Priya Nair", author: "Wagga Wagga Meals on Wheels", title: "Anyone else seen delays with My Aged Care referrals this month?", when: "2 days ago" },
      { id: "t2", person: "Tom Baxter", author: "Coffs Harbour Meals on Wheels", title: "Sharing our new volunteer thank-you event idea", when: "5 days ago" },
      { id: "t3", person: "Jane Smith", author: "Liverpool Meals on Wheels", title: "Tips for rostering around school holidays?", when: "1 week ago" }
    ];
    function esc(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
    function loadThreads() {
      try { var s = JSON.parse(localStorage.getItem(KEY)); if (Array.isArray(s) && s.length) return s; } catch (e) {}
      return SEED;
    }

    var toggleHtml = opts.toggle
      ? '<div class="dir-toggle dir-toggle-sm" style="margin-left:auto" role="tablist" aria-label="Discussions view">' +
          '<button type="button" class="dir-toggle-btn' + (mode === "subscribed" ? " active" : "") + '" data-mode="subscribed" role="tab" aria-selected="' + (mode === "subscribed") + '">Subscribed</button>' +
          '<button type="button" class="dir-toggle-btn' + (mode === "active" ? " active" : "") + '" data-mode="active" role="tab" aria-selected="' + (mode === "active") + '">Active</button>' +
        "</div>"
      : "";

    containerEl.classList.add("mcard", "snapshot");
    containerEl.innerHTML =
      '<div class="mcard-head">' +
        '<span class="mi"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>' +
        "<h2>" + (opts.toggle ? "Discussions" : (mode === "subscribed" ? "Subscribed discussions" : "Active discussions")) + "</h2>" +
        toggleHtml +
      "</div>" +
      '<div data-disc-list></div>' +
      (opts.hideLink ? "" : '<a class="link" href="connect.html#discussion">Go to Discussions &rarr;</a>');

    if (opts.toggle) {
      containerEl.querySelectorAll("[data-mode]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          mode = btn.getAttribute("data-mode");
          containerEl.querySelectorAll("[data-mode]").forEach(function (b) {
            var on = b === btn;
            b.classList.toggle("active", on);
            b.setAttribute("aria-selected", on);
          });
          render();
        });
      });
    }

    var list = containerEl.querySelector("[data-disc-list]");
    function render() {
      var threads = loadThreads();
      if (mode === "subscribed") {
        var subs = window.mowSubscriptions.all();
        threads = threads.filter(function (t) { return subs.indexOf(t.id) !== -1; });
      }
      list.innerHTML = threads.slice(0, 3).map(function (t) {
        return '<button type="button" class="row" data-widget-popout="' + t.id + '"><span class="rt">' + esc(t.title) + '<div class="meta">' + esc(t.person || t.author) + " · " + esc(t.when) + "</div></span></button>";
      }).join("") || '<p class="im-note" style="margin:0">' + (mode === "subscribed" ? "You're not subscribed to any discussions yet — use the bell icon on a thread in Discussions." : "No active discussions yet.") + "</p>";
      list.querySelectorAll("[data-widget-popout]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          window.openThreadPopout(btn.getAttribute("data-widget-popout"), { onUpdate: render });
        });
      });
    }
    render();
  };

  // ---- Generic reusable comment thread, localStorage-backed. Used for
  // escalated sector issues, submissions, and commenting on visual assets
  // (templates, social tiles, posters). Each comment carries the author's
  // name and service; comments the current user posted (mine: true) get
  // Edit/Remove controls, others are read-only. ----
  // ---- Shared recursive comment-list renderer: comments can be liked, and
  // replied to, and replies can be liked and replied to in turn — arbitrary
  // depth, addressed by a "0-2-1"-style path from the root list. Comments
  // the current user posted (mine: true) get Edit/Remove; every comment
  // gets Like/Reply. `list` is mutated in place; `persist` saves it back to
  // wherever the caller keeps it (a whole thread, or one paragraph's
  // thread). Used by renderCommentThread and wireParagraphComments below —
  // one implementation so both get like/reply/edit/remove for free. ----
  window.renderCommentList = function (container, list, persist, opts) {
    opts = opts || {};
    function esc(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
    var openReply = null;
    var editing = null;

    function getNode(path) {
      var node = { replies: list };
      path.split("-").forEach(function (i) { node = node.replies[+i]; });
      return node;
    }
    function getParentList(path) {
      var parts = path.split("-");
      var node = { replies: list };
      for (var i = 0; i < parts.length - 1; i++) node = node.replies[+parts[i]];
      return node.replies;
    }
    function renderNode(node, path, depth) {
      var repliesHtml = (node.replies || []).map(function (child, i) { return renderNode(child, path + "-" + i, depth + 1); }).join("");
      return '<div class="cc-item' + (depth > 0 ? " cc-reply" : "") + '" data-path="' + path + '">' +
        '<span class="cc-who">' + esc(node.who) + (node.org ? " · " + esc(node.org) : "") + '</span><span class="cc-when">' + esc(node.when) + "</span>" +
        (editing === path
          ? '<div class="consult-comment-form" style="margin-top:6px"><input type="text" value="' + esc(node.text) + '" data-cc-edit-input><button type="button" data-cc-save="' + path + '">Save</button></div>' +
            '<button type="button" class="cc-cancel" data-cc-cancel-edit="' + path + '">Cancel edit</button>'
          : '<div class="cc-text">' + esc(node.text) + "</div>") +
        '<div class="cc-actions">' +
          '<button type="button" data-cc-like="' + path + '" class="' + (node.likedByMe ? "liked" : "") + '">&#128077; ' + (node.likes || 0) + "</button>" +
          '<button type="button" data-cc-reply-toggle="' + path + '">Reply</button>' +
          (node.mine ? '<button type="button" data-cc-edit-toggle="' + path + '">Edit</button><button type="button" data-cc-remove="' + path + '">Remove</button>' : "") +
        "</div>" +
        (openReply === path ? '<div class="consult-comment-form cc-reply-form"><input type="text" placeholder="Write a reply" data-cc-reply-input><button type="button" data-cc-reply-submit="' + path + '">Reply</button></div>' : "") +
        (repliesHtml ? '<div class="cc-replies">' + repliesHtml + "</div>" : "") +
      "</div>";
    }

    function render() {
      container.innerHTML =
        (opts.label ? '<div class="ts-suggest-label">' + esc(opts.label) + "</div>" : "") +
        '<div class="comment-list">' + (list.length ? list.map(function (node, i) { return renderNode(node, "" + i, 0); }).join("") : '<p class="im-note" style="margin:0 0 10px">No comments yet — be the first.</p>') + "</div>" +
        '<div class="consult-comment-form"><input type="text" placeholder="' + esc(opts.placeholder || "Add a comment") + '" data-cc-root-input><button type="button" data-cc-root-submit>' + (opts.postLabel || "Post") + "</button></div>";
      wire();
      if (opts.onChange) opts.onChange();
    }

    function newComment(text) {
      return { who: opts.me || "Jane Smith", org: opts.org || window.mowActiveAccount || "", when: "just now", text: text, mine: true, likes: 0, likedByMe: false, replies: [] };
    }

    function wire() {
      container.querySelectorAll("[data-cc-like]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var node = getNode(btn.getAttribute("data-cc-like"));
          node.likedByMe = !node.likedByMe;
          node.likes = (node.likes || 0) + (node.likedByMe ? 1 : -1);
          persist(); render();
        });
      });
      container.querySelectorAll("[data-cc-reply-toggle]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var p = btn.getAttribute("data-cc-reply-toggle");
          openReply = openReply === p ? null : p;
          render();
        });
      });
      container.querySelectorAll("[data-cc-reply-submit]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var p = btn.getAttribute("data-cc-reply-submit");
          var itemEl = container.querySelector('[data-path="' + p + '"]');
          var input = itemEl.querySelector(":scope > .cc-reply-form [data-cc-reply-input]");
          var val = input.value.trim();
          if (!val) return;
          var node = getNode(p);
          node.replies = node.replies || [];
          node.replies.push(newComment(val));
          openReply = null;
          persist(); render();
        });
      });
      container.querySelectorAll("[data-cc-edit-toggle]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var p = btn.getAttribute("data-cc-edit-toggle");
          editing = editing === p ? null : p;
          render();
        });
      });
      container.querySelectorAll("[data-cc-cancel-edit]").forEach(function (btn) {
        btn.addEventListener("click", function () { editing = null; render(); });
      });
      container.querySelectorAll("[data-cc-save]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var p = btn.getAttribute("data-cc-save");
          var itemEl = container.querySelector('[data-path="' + p + '"]');
          var input = itemEl.querySelector(":scope > .consult-comment-form [data-cc-edit-input]");
          var val = input.value.trim();
          if (!val) return;
          var node = getNode(p);
          node.text = val;
          node.when = "just now (edited)";
          editing = null;
          persist(); render();
        });
      });
      container.querySelectorAll("[data-cc-remove]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var p = btn.getAttribute("data-cc-remove");
          var parentList = getParentList(p);
          var idx = +p.slice(p.lastIndexOf("-") + 1);
          parentList.splice(idx, 1);
          persist(); render();
        });
      });
      var rootInput = container.querySelector("[data-cc-root-input]");
      var rootBtn = container.querySelector("[data-cc-root-submit]");
      function submitRoot() {
        var val = rootInput.value.trim();
        if (!val) return;
        list.push(newComment(val));
        persist(); render();
      }
      rootBtn.addEventListener("click", submitRoot);
      rootInput.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); submitRoot(); } });
    }

    render();
  };

  window.renderCommentThread = function (container, key, opts) {
    opts = opts || {};
    var CKEY = "mow_comments_v1";
    function loadAll() { try { var s = JSON.parse(localStorage.getItem(CKEY)); if (s) return s; } catch (e) {} return {}; }
    function saveAll(all) { try { localStorage.setItem(CKEY, JSON.stringify(all)); } catch (e) {} }
    var all = loadAll();
    var list = all[key] || (opts.seed ? opts.seed.slice() : []);
    var wrap = document.createElement("div");
    wrap.className = "comment-thread";
    container.appendChild(wrap);
    window.renderCommentList(wrap, list, function () { all[key] = list; saveAll(all); }, {
      label: opts.label || "Member comments", placeholder: opts.placeholder, me: opts.me, org: opts.org
    });
  };

  // ---- Shared word-review-style inline paragraph commenting: every
  // paragraph in a container gets a hoverable "add comment" affordance,
  // backed by a localStorage thread keyed on a caller-supplied id + the
  // paragraph's index. Used by Submissions' upcoming drafts and Connect's
  // Have Your Say papers. ----
  window.wireParagraphComments = function (container, id, opts) {
    opts = opts || {};
    if (!id) return;
    var CKEY = "mow_paper_comments_v1";
    function loadAll() { try { var s = JSON.parse(localStorage.getItem(CKEY)); if (s) return s; } catch (e) {} return {}; }
    function saveAll(all) { try { localStorage.setItem(CKEY, JSON.stringify(all)); } catch (e) {} }
    var allComments = loadAll();
    var mine = allComments[id] || {};
    function countAll(list) { return (list || []).reduce(function (sum, c) { return sum + 1 + countAll(c.replies); }, 0); }
    // :scope > p only — excludes paragraphs nested inside a doc-preview
    // panel or other collapsible detail block, which may be hidden (and so
    // would silently produce a zero-size, inaccessible comment box).
    var paras = container.querySelectorAll(opts.selector || ":scope > p:not(.im-meta):not(.im-note)");

    paras.forEach(function (p, idx) {
      p.classList.add("consult-para");
      var thread = mine[idx] || [];

      var addBtn = document.createElement("button");
      addBtn.type = "button"; addBtn.className = "cp-add"; addBtn.title = "Add a comment on this paragraph";
      addBtn.innerHTML = "&#128172;";
      p.appendChild(addBtn);

      var box = document.createElement("div");
      box.className = "consult-comments hide";
      p.insertAdjacentElement("afterend", box);

      function syncCount() {
        var total = countAll(thread);
        p.classList.toggle("has-comments", total > 0);
        var existingCount = addBtn.querySelector(".cp-count");
        if (total) {
          if (existingCount) existingCount.textContent = total;
          else { var c2 = document.createElement("span"); c2.className = "cp-count"; c2.textContent = total; addBtn.appendChild(c2); }
        } else if (existingCount) {
          existingCount.remove();
        }
      }
      window.renderCommentList(box, thread, function () { mine[idx] = thread; allComments[id] = mine; saveAll(allComments); }, {
        placeholder: "Add a comment on this paragraph", postLabel: "Comment", org: opts.org, me: opts.me, onChange: syncCount
      });
      syncCount();
      addBtn.addEventListener("click", function () { box.classList.toggle("hide"); });
    });
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

  // ---- Shared expand/collapse wiring for any modal: a button next to Close
  // that grows the modal wider and taller (a two-pane modal can also pass
  // its grid layout element to rebalance the column ratio while expanded).
  // Returns the setExpanded(on) function so the caller can reset to
  // collapsed each time it loads new content into the modal. ----
  window.wireModalExpand = function (modalInner, expandBtn, layoutEl) {
    var EXPAND_ICON = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';
    var COLLAPSE_ICON = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"/></svg>';
    function setExpanded(on) {
      modalInner.classList.toggle("expanded", on);
      if (layoutEl) layoutEl.classList.toggle("expanded", on);
      expandBtn.innerHTML = on ? COLLAPSE_ICON : EXPAND_ICON;
      expandBtn.title = on ? "Collapse" : "Expand";
      expandBtn.setAttribute("aria-label", on ? "Collapse" : "Expand");
    }
    setExpanded(false);
    expandBtn.addEventListener("click", function () { setExpanded(!modalInner.classList.contains("expanded")); });
    return setExpanded;
  };

  // ---- Generic info-popup pattern ----
  var modal = document.getElementById("infoModal");
  var modalBody = document.getElementById("infoModalBody");
  if (modal && modalBody) {
    var setModalExpanded = window.wireModalExpand(document.getElementById("infoModalInner"), document.getElementById("infoModalExpandBtn"));

    // ---- Generic escape hatch: any feature can drop arbitrary HTML into the
    // shared info modal instead of driving it off a [data-popup] trigger.
    // Used by the dashboard's "Find it fast" actions and the shared
    // announcement composer below. ----
    window.openInfoPopupHtml = function (html, opts) {
      modalBody.innerHTML = html;
      var inner = modal.querySelector(".modal");
      if (inner) inner.classList.toggle("modal-lg", !!(opts && opts.wide));
      setModalExpanded(false);
      modal.classList.remove("hide");
    };
    window.closeInfoPopup = function () { modal.classList.add("hide"); };

    // ---- Shared "post an announcement" composer. Used by the dashboard's
    // "Make an announcement" quick action AND the "+ Post an announcement"
    // button on News for services, so both go through one implementation. ----
    window.openAnnouncePopup = function () {
      window.openInfoPopupHtml(
        "<h2>Post an announcement</h2>" +
        '<p class="im-meta" style="font-size:12px;color:var(--muted);margin:0 0 14px">Posts to the Meals on Wheels news column for members. Nothing is actually published.</p>' +
        '<form id="announceForm">' +
          '<div class="field"><label>Headline</label><input type="text" placeholder="Short, clear headline" required></div>' +
          '<div class="field"><label>Audience</label><select><option>All member services</option><option>My region only</option><option>Volunteer coordinators</option></select></div>' +
          '<div class="field"><label>Announcement</label><textarea placeholder="What do members need to know?" style="min-height:120px" required></textarea></div>' +
          '<div class="field"><label>Link (optional)</label><input type="url" placeholder="https://"></div>' +
          '<div class="field"><label>Attach a file (optional)</label><input type="file"></div>' +
          '<button class="btn-primary" type="submit">Publish announcement</button>' +
        "</form>" +
        '<div class="announce-thanks hide" id="announceThanks">Thanks — your announcement has been submitted. In the finished build it would appear in the Meals on Wheels news column once approved.</div>'
      );
      document.getElementById("announceForm").addEventListener("submit", function (e) {
        e.preventDefault();
        e.target.classList.add("hide");
        document.getElementById("announceThanks").classList.remove("hide");
      });
    };

    // ---- Shared "Raise an issue — Member Voice" popup — same fields as
    // Connect's inline Escalated Issues form, for pages that want the same
    // capability without embedding the whole form on the page. ----
    window.openEscalateIssuePopup = function () {
      window.openInfoPopupHtml(
        "<h2>Raise an issue — Member Voice</h2>" +
        '<p class="im-meta" style="font-size:12px;color:var(--muted);margin:0 0 14px">Tell us what\'s going on. Issues raised here are reviewed weekly and may be added to the Escalated Issues list.</p>' +
        '<form id="voicePopupForm">' +
          '<div class="field field-tight"><label>Issue <span class="tag warn" style="padding:2px 7px">Required</span></label><input type="text" placeholder="Short title, e.g. Delays with My Aged Care referrals" required></div>' +
          '<div class="field field-tight"><label>Description <span class="tag warn" style="padding:2px 7px">Required</span></label><textarea placeholder="What\'s happening?" required style="min-height:64px"></textarea></div>' +
          '<div class="field-row">' +
            '<div class="field field-tight"><label>Category <span class="tag warn" style="padding:2px 7px">Required</span></label>' +
              '<select required>' +
                '<option value="">Choose a category</option>' +
                '<option>Funding</option><option>Workforce</option><option>Service Delivery</option>' +
                '<option>Compliance &amp; Regulation</option><option>Aged Care Reform</option><option>Transport</option>' +
                '<option>Volunteers</option><option>Digital Systems</option><option>Health &amp; Clinical</option>' +
                '<option>Procurement</option><option>Government Policy</option><option>Media &amp; Public Perception</option><option>Other</option>' +
              '</select>' +
            '</div>' +
            '<div class="field field-tight"><label>Impact <span class="tag warn" style="padding:2px 7px">Required</span></label><input type="text" placeholder="e.g. Delayed client intakes" required></div>' +
          "</div>" +
          '<div class="field field-tight"><label>Who is affected <span class="tag warn" style="padding:2px 7px">Required</span></label><input type="text" placeholder="e.g. Regional services, new clients awaiting intake" required></div>' +
          '<div class="field-row">' +
            '<div class="field field-tight"><label>Suggested solution <span style="font-weight:400">(optional)</span></label><textarea placeholder="Any practical recommendation you have" style="min-height:48px"></textarea></div>' +
            '<div class="field field-tight"><label>Raised elsewhere? <span style="font-weight:400">(optional)</span></label><textarea placeholder="e.g. Government department, MP, council, peak body" style="min-height:48px"></textarea></div>' +
          "</div>" +
          '<div class="field field-tight"><label>Supporting evidence <span style="font-weight:400">(optional)</span></label><input type="file" multiple><div class="hint">Documents, photos, letters or media articles</div></div>' +
          '<div class="field-row">' +
            '<div class="field field-tight"><label>Contact person</label><input type="text" value="Jane Smith, Liverpool Meals on Wheels" readonly></div>' +
            '<div class="field field-tight"><label>Email &amp; phone</label><input type="text" value="admin@liverpoolmow.org.au · (02) 9800 1234" readonly></div>' +
          "</div>" +
          '<div class="field field-tight">' +
            '<label class="checkbox-row"><input type="checkbox"><span>Permission to contact — allow the advocacy team to discuss this further</span></label>' +
            '<label class="checkbox-row"><input type="checkbox"><span>Permission to use anonymously — allow this as a case study while protecting my identity</span></label>' +
          "</div>" +
          '<button class="btn-primary" type="submit">Submit to Member Voice</button>' +
        "</form>" +
        '<div class="suggest-thanks hide" id="voicePopupThanks">Thanks — that\'s been logged in Member Voice and may be escalated by the advocacy team. Nothing is actually sent.</div>'
      );
      document.getElementById("voicePopupForm").addEventListener("submit", function (e) {
        e.preventDefault();
        e.target.classList.add("hide");
        document.getElementById("voicePopupThanks").classList.remove("hide");
      });
    };

    // ---- Shared "Start a conversation" composer — one implementation used
    // by the dashboard's quick action AND Connect's "+ Start a discussion"
    // button, so both actually post into the same thread list (mow_threads_v2,
    // the same key/schema Connect's discussion board reads). Pass
    // opts.onPosted(thread) to update a live list in place (Connect) instead
    // of showing the reference-build "thanks" state (dashboard). ----
    window.openStartConversationPopup = function (opts) {
      opts = opts || {};
      var esc = function (s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };
      var KEY = "mow_threads_v2";
      var ME_PERSON = "Jane Smith";
      function loadThreads() { try { var s = JSON.parse(localStorage.getItem(KEY)); if (Array.isArray(s)) return s; } catch (e) {} return []; }
      function saveThreads(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} }

      window.openInfoPopupHtml(
        "<h2>Start a conversation</h2>" +
        '<p class="im-meta" style="font-size:12px;color:var(--muted);margin:0 0 14px">Posts to Connect &gt; Discussions.</p>' +
        '<form id="convForm">' +
          '<div class="field"><label>Thread title</label><input type="text" id="convTitle" placeholder="What\'s your question or idea?" required></div>' +
          '<div class="field-row">' +
            '<div class="field readonly"><label>Member service</label><input type="text" value="' + esc(activeAccount) + '" readonly></div>' +
            '<div class="field"><label>Category</label><select id="convCategory"><option>Operate</option><option>Comply</option><option>Deliver</option><option>Promote</option><option>General</option></select></div>' +
          "</div>" +
          '<div class="field"><label>Message</label><textarea id="convBody" style="min-height:90px" placeholder="Add a bit of detail" required></textarea></div>' +
          '<div class="field"><label>Tags <span style="font-weight:400">(comma separated, optional)</span></label><input type="text" id="convTags" placeholder="e.g. Volunteers, Rostering"></div>' +
          '<div class="field-row">' +
            '<div class="field"><label>Attachments (optional)</label><input type="file"></div>' +
            '<div class="field"><label>Visible to</label><select id="convVisible" data-cond data-cond-yes="convSpecific"><option>All members</option><option>MOW NSW staff only</option><option value="Yes">Specific member</option></select></div>' +
          "</div>" +
          '<div class="field hide" id="convSpecific"><label>Which member?</label><input type="text" placeholder="e.g. Wagga Wagga Meals on Wheels"></div>' +
          '<div class="field-check-grid" style="margin-bottom:14px">' +
            '<label><input type="checkbox" id="convPublic"> Public Q&amp;A other services can find</label>' +
            '<label><input type="checkbox" id="convNotify" checked> Notify me of replies</label>' +
          "</div>" +
          '<button class="btn-primary" type="submit">Post</button>' +
        "</form>" +
        '<div class="announce-thanks hide" id="convThanks">Thanks — your thread has been posted. <a href="connect.html#discussion">View it in Discussions &rarr;</a></div>'
      );

      if (opts.title) document.getElementById("convTitle").value = opts.title;
      if (opts.category) document.getElementById("convCategory").value = opts.category;

      var form = document.getElementById("convForm");
      form.querySelectorAll("[data-cond]").forEach(function (sel) {
        var yesIds = (sel.getAttribute("data-cond-yes") || "").split(/\s+/).filter(Boolean);
        function update() {
          var show = sel.value === "Yes";
          yesIds.forEach(function (id) { var el = document.getElementById(id); if (el) el.classList.toggle("hide", !show); });
        }
        sel.addEventListener("change", update);
        update();
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var tags = document.getElementById("convTags").value.split(",").map(function (t) { return t.trim(); }).filter(Boolean);
        var thread = {
          id: "t" + Date.now(), person: ME_PERSON, author: activeAccount, mine: true,
          title: document.getElementById("convTitle").value,
          body: document.getElementById("convBody").value,
          category: document.getElementById("convCategory").value,
          tags: tags,
          when: "just now", reactions: { like: 0, helpful: 0 }, myReactions: [], repliesList: []
        };
        if (document.getElementById("convNotify").checked) window.mowSubscriptions.toggle(thread.id);
        var threads = loadThreads();
        threads.unshift(thread);
        saveThreads(threads);
        if (opts.onPosted) {
          opts.onPosted(thread);
          window.closeInfoPopup();
        } else {
          form.classList.add("hide");
          document.getElementById("convThanks").classList.remove("hide");
        }
      });
    };

    // ---- Shared "Discuss in Webinar Forum" composer — asks to have a topic
    // raised at an upcoming webinar, training session or Community of
    // Practice call. Used from Submissions' "Get involved" prompt. ----
    window.openWebinarForumPopup = function (opts) {
      opts = opts || {};
      var esc = function (s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };
      window.openInfoPopupHtml(
        "<h2>Discuss in Webinar Forum</h2>" +
        '<p class="im-meta" style="font-size:12px;color:var(--muted);margin:0 0 14px">Ask to have this raised as a discussion topic at an upcoming webinar, training session or Community of Practice call.</p>' +
        '<form id="webinarForumForm">' +
          '<div class="field"><label>Topic</label><input type="text" id="wfTopic" value="' + esc(opts.title || "") + '" required></div>' +
          '<div class="field"><label>Preferred session</label><select id="wfSession"><option>Next available webinar</option><option>APD annual meal review — Wed 22 July</option><option>Volunteer induction — Tue 12 August</option><option>A Community of Practice call</option></select></div>' +
          '<div class="field"><label>What would you like covered?</label><textarea id="wfNotes" placeholder="A bit of context for the presenter" style="min-height:80px" required></textarea></div>' +
          '<div class="field readonly"><label>Contact</label><input type="text" value="Jane Smith · Liverpool Meals on Wheels" readonly></div>' +
          '<button class="btn-primary" type="submit">Request this topic</button>' +
        "</form>" +
        '<div class="announce-thanks hide" id="webinarForumThanks">Thanks — this has been flagged to the Training &amp; Events team, and we\'ll follow up if it can fit into an upcoming session.</div>'
      );
      document.getElementById("webinarForumForm").addEventListener("submit", function (e) {
        e.preventDefault();
        e.target.classList.add("hide");
        document.getElementById("webinarForumThanks").classList.remove("hide");
      });
    };

    // ---- Shared "Get involved" chooser — three lightweight routes into
    // the network for a specific draft/topic: start a discussion, ask for
    // it at a webinar/forum, or talk to Support. Each opens its own popup;
    // this one is just the menu. ----
    window.openGetInvolvedPopup = function (opts) {
      opts = opts || {};
      var esc = function (s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };
      var title = opts.title || "";
      window.openInfoPopupHtml(
        "<h2>Get involved</h2>" +
        (title ? '<p class="im-meta" style="font-size:12px;color:var(--muted);margin:0 0 14px">' + esc(title) + "</p>" : "") +
        '<div class="mcard" style="max-width:none;margin:0">' +
          '<button type="button" class="row" id="giDiscuss"><span class="rt">Start a discussion<div class="meta">Post a question or comment to the network in Discussions</div></span></button>' +
          '<button type="button" class="row" id="giWebinar"><span class="rt">Discuss in Webinar Forum<div class="meta">Raise it at an upcoming webinar, training session or CoP call</div></span></button>' +
          '<button type="button" class="row" id="giSupport"><span class="rt">Contact Support<div class="meta">Talk it through with your Network Support Officer</div></span></button>' +
        "</div>"
      );
      document.getElementById("giDiscuss").addEventListener("click", function () {
        window.openStartConversationPopup({ title: title ? "Re: " + title : "" });
      });
      document.getElementById("giWebinar").addEventListener("click", function () {
        window.openWebinarForumPopup({ title: title });
      });
      document.getElementById("giSupport").addEventListener("click", function () {
        window.closeInfoPopup();
        var fab = document.getElementById("supportFabBtn");
        if (fab) fab.click();
      });
    };

    // =====================================================================
    // ThreadUI: canonical discussion-thread card renderer + interaction
    // wiring. Shared by Connect's Discussions feed and the thread popout
    // (dashboard widgets, Connect's expand icon) so both look and behave
    // identically — one implementation, not two copies drifting apart.
    // Also owns the mow_threads_v2 schema/seed, so there's one source of
    // truth for thread + per-comment likes and replies-to-a-comment.
    // =====================================================================
    window.ThreadUI = (function () {
      var KEY = "mow_threads_v2";
      var ME_PERSON = "Jane Smith";
      function esc(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
      function initials(name) { return (name || "").split(" ").filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase(); }

      var SEED = [
        { id: "t1", person: "Priya Nair", author: "Wagga Wagga Meals on Wheels", mine: false, category: "Deliver", tags: ["My Aged Care", "Referrals"],
          title: "Anyone else seen delays with My Aged Care referrals this month?",
          body: "We've had three referrals sit for over a fortnight. Wondering if it's just us or a wider system issue.",
          when: "2 days ago", reactions: { like: 4 }, myReactions: [],
          repliesList: [
            { id: "t1-r1", person: "Tom Baxter", author: "Coffs Harbour Meals on Wheels", body: "Same here — about 10 days on average this month.", when: "2 days ago", reactions: { like: 0 }, myReactions: [] },
            { id: "t1-r2", person: "Sarah Thomas", author: "MOW NSW (NSO)", body: "Flagging this to the My Aged Care liaison team — will update the thread.", when: "1 day ago", reactions: { like: 0 }, myReactions: [] }
          ] },
        { id: "t2", person: "Tom Baxter", author: "Coffs Harbour Meals on Wheels", mine: false, category: "Promote", tags: ["Volunteers", "Events"],
          title: "Sharing our new volunteer thank-you event idea",
          body: "We ran a small morning tea with certificates and it went down really well. Happy to share the run sheet.",
          when: "5 days ago", reactions: { like: 6 }, myReactions: [],
          repliesList: [
            { id: "t2-r1", person: "Anh Le", author: "Parramatta Meals on Wheels", body: "Love this idea, mind sharing the run sheet? Cc @Sarah Thomas (NSO) so she's aware too — might suit the newsletter.", when: "4 days ago", reactions: { like: 0 }, myReactions: [] },
            { id: "t2-r2", person: "Tom Baxter", author: "Coffs Harbour Meals on Wheels", body: "Of course — I'll drop it in the thread tomorrow!", when: "3 days ago", reactions: { like: 0 }, myReactions: [] }
          ] },
        { id: "t3", person: ME_PERSON, author: "Liverpool Meals on Wheels", mine: true, category: "Operate", tags: ["Rostering", "Volunteers"],
          title: "Tips for rostering around school holidays?",
          body: "Half our drivers have grandkids to mind over the holidays. How does everyone keep runs covered?",
          when: "1 week ago", reactions: { like: 2 }, myReactions: [],
          repliesList: [
            { id: "t3-r1", person: "Priya Nair", author: "Wagga Wagga Meals on Wheels", body: "We stagger shifts and lean on retirees who don't have school pickups.", when: "6 days ago", reactions: { like: 0 }, myReactions: [] }
          ] }
      ];

      var MENTIONABLE = [
        "Sarah Thomas (NSO)", "Leesa O'Keefe (MOW NSW)", "Simone Despoges (MOW NSW)", "Sue Dryden (MOW NSW)",
        "Wagga Wagga Meals on Wheels", "Coffs Harbour Meals on Wheels", "Parramatta Meals on Wheels", "Penrith Meals on Wheels"
      ];
      function withMentions(text) {
        var out = esc(text);
        MENTIONABLE.forEach(function (m) {
          var re = new RegExp("@" + m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
          out = out.replace(re, '<span class="mention">@' + esc(m) + "</span>");
        });
        return out;
      }

      function loadThreads() {
        var list;
        try { var s = JSON.parse(localStorage.getItem(KEY)); if (Array.isArray(s)) list = s; } catch (e) {}
        if (!list) list = SEED.slice();
        // Backfill replies saved before per-comment like/reply existed —
        // without a stable id, replyTo lookups (and thus replyItemHtml's
        // recursion) can self-match on two undefined values and loop forever.
        var seq = 0;
        list.forEach(function (t) {
          (t.repliesList || []).forEach(function (r) {
            if (!r.id) r.id = t.id + "-rlegacy-" + (seq++);
            if (!r.reactions) r.reactions = { like: 0 };
            if (!r.myReactions) r.myReactions = [];
          });
        });
        return list;
      }
      function saveThreads(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} }

      var thumbIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/></svg>';
      var thumbIconSmall = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/></svg>';
      var thumbIconFilled = '<svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/></svg>';
      var commentIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
      var commentIconSmall = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
      var bellIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
      var globeIcon = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
      var expandIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>';

      function popoutBtn(t) {
        return '<button type="button" class="tp-popout" data-popout="' + t.id + '" title="Open in a popout" aria-label="Open in a popout">' + expandIcon + "</button>";
      }
      function kebabMenu(t) {
        var items = t.mine
          ? '<button type="button" data-edit="' + t.id + '">Edit</button><button type="button" class="danger" data-del="' + t.id + '">Delete</button>'
          : '<button type="button" data-msg="' + esc(t.author) + '">Message ' + esc((t.author || "").split(" ")[0]) + '</button>';
        return '<div class="tp-kebab-wrap"><button type="button" class="tp-kebab" data-kebab="' + t.id + '" aria-label="More options">&#8942;</button>' +
          '<div class="tp-kebab-menu" data-kebab-menu="' + t.id + '">' + items + '</div></div>';
      }
      function statsRow(t) {
        var likeCount = (t.reactions && t.reactions.like) || 0;
        var replyCount = (t.repliesList || []).length;
        return '<div class="tp-stats">' +
          (likeCount ? '<span class="tp-stat-likes"><span class="dot">' + thumbIconFilled + "</span>" + likeCount + "</span>" : "<span></span>") +
          (replyCount ? '<button type="button" class="tp-stat-replies" data-toggle="' + t.id + '">' + replyCount + " comment" + (replyCount === 1 ? "" : "s") + "</button>" : "<span></span>") +
        "</div>";
      }
      function actionRow(t) {
        var likeOn = (t.myReactions || []).indexOf("like") !== -1;
        var subscribed = window.mowSubscriptions.isSubscribed(t.id);
        return '<div class="tp-actions">' +
          '<button type="button" class="tp-action' + (likeOn ? " on" : "") + '" data-react="' + t.id + '" title="Like">' + thumbIcon + "</button>" +
          '<button type="button" class="tp-action" data-focus-comment="' + t.id + '" title="Comment">' + commentIcon + "</button>" +
          '<button type="button" class="tp-action' + (subscribed ? " on" : "") + '" data-notify="' + t.id + '" title="' + (subscribed ? "Stop emailing me about this thread" : "Email me when this thread gets activity") + '">' + bellIcon + "</button>" +
        "</div>";
      }
      function tagsRow(t) {
        var tags = t.tags || [];
        if (!tags.length) return "";
        return '<div class="tp-tags">' + tags.map(function (tag) {
          return '<button type="button" class="tp-tag" data-tag-filter="' + esc(tag) + '">#' + esc(tag.replace(/\s+/g, "")) + "</button>";
        }).join("") + "</div>";
      }
      function commentBox(t) {
        return '<div class="tp-comment-box"><span class="tp-avatar-sm">' + initials(ME_PERSON) + '</span>' +
          '<input type="text" class="tp-comment-input" placeholder="Add a comment…" data-comment-for="' + t.id + '"></div>';
      }

      // One comment, with its own Like + Reply, and (recursively) any
      // replies-to-that-comment nested beneath it.
      function replyItemHtml(t, r, openReplyBoxId) {
        var isAuthor = r.author === t.author && (r.person || "") === (t.person || "");
        var likeCount = (r.reactions && r.reactions.like) || 0;
        var likeOn = (r.myReactions || []).indexOf("like") !== -1;
        var children = (t.repliesList || []).filter(function (x) { return x.replyTo === r.id; });
        var childrenHtml = children.map(function (c) { return replyItemHtml(t, c, openReplyBoxId); }).join("");
        var replyBoxHtml = openReplyBoxId === r.id
          ? '<div class="tp-comment-box" style="margin-top:8px;padding-top:0;border-top:none"><span class="tp-avatar-sm">' + initials(ME_PERSON) + '</span><input type="text" class="tp-comment-input" placeholder="Reply to ' + esc((r.person || r.author || "").split(" ")[0]) + '…" data-comment-for="' + t.id + '" data-reply-to="' + r.id + '"></div>'
          : "";
        return '<div class="thread-reply" data-reply-id="' + r.id + '"><div class="tr-head"><span class="tr-avatar">' + initials(r.person || r.author) + '</span><span class="tr-author">' + esc(r.person || r.author) +
          "</span>" + (isAuthor ? '<span class="tr-author-badge">Author</span>' : "") +
          '<span class="tp-org">from ' + esc(r.author) + '</span><span class="tr-when">' + esc(r.when) + "</span></div>" +
          '<div class="tr-body">' + withMentions(r.body) + "</div>" +
          '<div class="tr-actions">' +
            '<button type="button" class="tr-action' + (likeOn ? " on" : "") + '" data-react-reply="' + r.id + '" data-thread="' + t.id + '">' + thumbIconSmall + (likeCount ? " " + likeCount : "") + "</button>" +
            '<button type="button" class="tr-action" data-reply-to-comment="' + r.id + '" data-thread="' + t.id + '">' + commentIconSmall + " Reply</button>" +
          "</div>" +
          replyBoxHtml +
          (childrenHtml ? '<div class="thread-reply-list">' + childrenHtml + "</div>" : "") +
        "</div>";
      }

      // Shows the most recent 2 top-level comments by default, with a
      // "View N more" toggle; nested replies-to-a-comment always show
      // alongside their parent (no separate truncation for those).
      function replyBlock(t, openState) {
        openState = openState || {};
        var all = t.repliesList || [];
        var topLevel = all.filter(function (r) { return !r.replyTo; });
        if (!topLevel.length) return "";
        var showAll = !!openState.showAllReplies;
        var visible = showAll ? topLevel : topLevel.slice(-2);
        var hiddenCount = topLevel.length - visible.length;
        var toggle = hiddenCount > 0
          ? '<button type="button" class="tp-toggle-replies" data-toggle="' + t.id + '">View ' + hiddenCount + " more comment" + (hiddenCount === 1 ? "" : "s") + "</button>"
          : "";
        return toggle + '<div class="thread-reply-list" data-replylist="' + t.id + '">' + visible.map(function (r) { return replyItemHtml(t, r, openState.replyBoxFor); }).join("") + "</div>";
      }

      // Full card body — identical whether rendered in the main feed list
      // or inside the popout modal. Caller wraps this in its own
      // `.thread-post` container.
      function cardHtml(t, opts) {
        opts = opts || {};
        return '<div class="tp-head">' +
            '<span class="tp-avatar">' + initials(t.person || t.author) + "</span>" +
            '<div class="tp-who">' +
              '<div class="tp-name-row"><span class="tp-author">' + esc(t.person || t.author) + "</span>" + (t.mine ? '<span class="tp-mine-flag">You</span>' : "") + "</div>" +
              '<div class="tp-headline">' + esc(t.author) + (t.category ? " · " + esc(t.category) : "") + "</div>" +
              '<div class="tp-meta"><span>' + esc(t.when) + "</span>" + globeIcon + "</div>" +
            "</div>" +
            (opts.showExpand !== false ? popoutBtn(t) : "") +
            kebabMenu(t) +
          "</div>" +
          '<div class="tp-title">' + esc(t.title) + "</div>" +
          '<div class="tp-body">' + withMentions(t.body) + "</div>" +
          tagsRow(t) +
          statsRow(t) +
          actionRow(t) +
          commentBox(t) +
          replyBlock(t, opts.openState);
      }

      function findReply(t, replyId) {
        var found = null;
        (t.repliesList || []).forEach(function (r) { if (r.id === replyId) found = r; });
        return found;
      }

      function toggleLike(obj) {
        obj.reactions = obj.reactions || {};
        obj.myReactions = obj.myReactions || [];
        var idx = obj.myReactions.indexOf("like");
        if (idx === -1) { obj.myReactions.push("like"); obj.reactions.like = (obj.reactions.like || 0) + 1; }
        else { obj.myReactions.splice(idx, 1); obj.reactions.like = Math.max(0, (obj.reactions.like || 0) - 1); }
      }

      // Delegated click + keydown handling for a card container — works for
      // both the multi-card feed list and a single-card popout. `api`:
      //   getThreads()        -> current in-memory array
      //   setThreads(list)    -> replace it after a mutation
      //   onChange()          -> persist + re-render hook
      //   getOpenState(id)    -> mutable {showAllReplies, replyBoxFor} for that thread
      //   onExpand(id)        -> optional, popout icon
      //   onTagFilter(tag)    -> optional
      //   onEdit/onDelete/onMessage(id/name) -> optional, kebab menu
      function wire(root, api) {
        function threads() { return api.getThreads(); }
        function persistAndRefresh() { saveThreads(threads()); api.onChange(); }

        root.addEventListener("click", function (e) {
          var toggleBtn = e.target.closest("[data-toggle]");
          if (toggleBtn) {
            var st = api.getOpenState(toggleBtn.getAttribute("data-toggle"));
            st.showAllReplies = !st.showAllReplies;
            api.onChange();
            return;
          }
          var tagFilterBtn = e.target.closest("[data-tag-filter]");
          if (tagFilterBtn && api.onTagFilter) { api.onTagFilter(tagFilterBtn.getAttribute("data-tag-filter")); return; }

          var focusBtn = e.target.closest("[data-focus-comment]");
          if (focusBtn) {
            var input = root.querySelector('.tp-comment-input[data-comment-for="' + focusBtn.getAttribute("data-focus-comment") + '"]:not([data-reply-to])');
            if (input) input.focus();
            return;
          }
          var replyToCommentBtn = e.target.closest("[data-reply-to-comment]");
          if (replyToCommentBtn) {
            var rid = replyToCommentBtn.getAttribute("data-reply-to-comment");
            var st2 = api.getOpenState(replyToCommentBtn.getAttribute("data-thread"));
            st2.replyBoxFor = st2.replyBoxFor === rid ? null : rid;
            api.onChange();
            return;
          }
          var expandBtn = e.target.closest("[data-popout]");
          if (expandBtn && api.onExpand) { api.onExpand(expandBtn.getAttribute("data-popout")); return; }

          var kebabBtn = e.target.closest("[data-kebab]");
          if (kebabBtn) {
            var menu = kebabBtn.parentElement.querySelector("[data-kebab-menu]");
            var willOpen = !menu.classList.contains("open");
            root.querySelectorAll(".tp-kebab-menu.open").forEach(function (m) { m.classList.remove("open"); });
            if (willOpen) menu.classList.add("open");
            return;
          }
          var reactReplyBtn = e.target.closest("[data-react-reply]");
          if (reactReplyBtn) {
            var list = threads();
            var th = list.find(function (x) { return x.id === reactReplyBtn.getAttribute("data-thread"); });
            var reply = th && findReply(th, reactReplyBtn.getAttribute("data-react-reply"));
            if (reply) { toggleLike(reply); api.setThreads(list); persistAndRefresh(); }
            return;
          }
          var reactBtn = e.target.closest("[data-react]");
          if (reactBtn) {
            var list2 = threads();
            var rt = list2.find(function (x) { return x.id === reactBtn.getAttribute("data-react"); });
            if (rt) { toggleLike(rt); api.setThreads(list2); persistAndRefresh(); }
            return;
          }
          var bellBtn = e.target.closest("[data-notify]");
          if (bellBtn) {
            var on = window.mowSubscriptions.toggle(bellBtn.getAttribute("data-notify"));
            bellBtn.classList.toggle("on", on);
            bellBtn.title = on ? "Stop emailing me about this thread" : "Email me when this thread gets activity";
            return;
          }
          var btn = e.target.closest("button");
          if (!btn) return;
          var editId = btn.getAttribute("data-edit");
          var delId = btn.getAttribute("data-del");
          var msgWho = btn.getAttribute("data-msg");
          if (editId && api.onEdit) { api.onEdit(editId); return; }
          if (delId && api.onDelete) { api.onDelete(delId); return; }
          if (msgWho && api.onMessage) { api.onMessage(msgWho); return; }
        });

        root.addEventListener("keydown", function (e) {
          if (e.key !== "Enter") return;
          var input = e.target.closest(".tp-comment-input");
          if (!input) return;
          e.preventDefault();
          var val = input.value.trim();
          if (!val) return;
          var id = input.getAttribute("data-comment-for");
          var replyTo = input.getAttribute("data-reply-to");
          var list = threads();
          var t = list.find(function (x) { return x.id === id; });
          if (!t) return;
          t.repliesList = t.repliesList || [];
          var newReply = { id: t.id + "-r" + Date.now(), person: ME_PERSON, author: activeAccount, body: val, when: "just now", reactions: { like: 0 }, myReactions: [] };
          if (replyTo) newReply.replyTo = replyTo;
          t.repliesList.push(newReply);
          var st3 = api.getOpenState(id);
          st3.showAllReplies = true;
          if (replyTo) st3.replyBoxFor = null;
          api.setThreads(list);
          persistAndRefresh();
        });
      }

      return {
        esc: esc, initials: initials, withMentions: withMentions, MENTIONABLE: MENTIONABLE, ME_PERSON: ME_PERSON,
        loadThreads: loadThreads, saveThreads: saveThreads,
        cardHtml: cardHtml, wire: wire
      };
    })();

    // ---- Thread popout: expands a discussion thread into the shared info
    // modal, using the exact same ThreadUI card renderer as the main
    // Discussions feed — so it always looks the same, wherever it's opened
    // from (Connect's expand icon, or an Active/Subscribed widget row).
    // The modal body is a single persistent DOM node reused across every
    // popout open, so it's wired to ThreadUI.wire() exactly ONCE (here, at
    // load) rather than per render/per open — otherwise each reopen would
    // stack another delegated listener on top of stale ones from whichever
    // thread was open before, and clicks would fire against dead state. ----
    var popoutState = null;
    function renderPopout() {
      if (!popoutState) return;
      var t = popoutState.threads.find(function (x) { return x.id === popoutState.threadId; });
      if (!t) return;
      window.openInfoPopupHtml('<div class="thread-post" style="border:none;padding:0">' + window.ThreadUI.cardHtml(t, { showExpand: false, openState: popoutState.openState }) + "</div>");
    }
    window.ThreadUI.wire(document.getElementById("infoModalBody"), {
      getThreads: function () { return popoutState ? popoutState.threads : []; },
      setThreads: function (list) { if (popoutState) popoutState.threads = list; },
      getOpenState: function () { return popoutState ? popoutState.openState : {}; },
      onChange: function () {
        if (!popoutState) return;
        window.ThreadUI.saveThreads(popoutState.threads);
        if (popoutState.onUpdate) popoutState.onUpdate();
        renderPopout();
      }
    });
    window.openThreadPopout = function (threadId, opts) {
      opts = opts || {};
      popoutState = { threadId: threadId, threads: window.ThreadUI.loadThreads(), openState: {}, onUpdate: opts.onUpdate };
      renderPopout();
    };

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
      setModalExpanded(false);
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
  var catActivate = null;
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
        // Top tab-bar clicks never scroll (the tabs are already in view, and
        // jumping is jarring) — but other same-page `[data-cat]` links, like
        // an Overview card's "View all X" pointing at a tab further down,
        // still scroll so the activated content is actually visible.
        activate(slug, tabs.indexOf(t) === -1);
      });
    });

    window.addEventListener("hashchange", function () {
      activate((window.location.hash || "").replace("#", ""), true);
    });

    // No scroll on initial load: hidden categories are removed from flow, so
    // the active one already sits right under the tabs — no jump needed,
    // whether that's a fresh deep link or landing here from another page.
    // The hash itself comes from window.__initialHash, stashed and stripped
    // from the URL by an inline script in <head> before the browser gets far
    // enough into parsing <body> to find the matching id and jump to it
    // natively — activate(..., false) alone can't stop that native jump,
    // since it happens during HTML parsing, before this script ever runs.
    activate((window.__initialHash || window.location.hash || "").replace("#", ""), false);
    catActivate = activate;
  });

  // ---- Mega-menu links into a same-page tab: switch tabs without any
  // scroll/jump. A plain <a href="updates.html#mownews"> triggers the
  // browser's native anchor-jump when already on that page, and the tab
  // system's own hashchange handler then smooth-scrolls on top of that —
  // both pointless since the target category is already positioned right
  // under the tabs. Intercept and just flip categories instead. Links to a
  // *different* page are left alone (real navigation, landing there already
  // skips the scroll per the initial activate() call above).
  document.addEventListener("click", function (e) {
    var link = e.target.closest && e.target.closest(".nav-drop-menu a");
    if (!link || !catActivate) return;
    var href = link.getAttribute("href") || "";
    var hashIdx = href.indexOf("#");
    if (hashIdx === -1) return;
    var pagePart = href.slice(0, hashIdx);
    if (pagePart && pagePart !== active) return;
    e.preventDefault();
    var slug = href.slice(hashIdx + 1);
    history.replaceState(null, "", "#" + slug);
    catActivate(slug, false);
  });
})();

// ---- Shared "Add to calendar" control — ONE consistent implementation used
// everywhere on the site. Drop an empty tag anywhere (including inside
// popup content injected after page load) with:
//   class="ics-add" data-ics-title="…" data-ics-start="2026-07-22T14:00:00"
//   [data-ics-end="…"] [data-ics-allday] [data-ics-location="…"] [data-ics-desc="…"]
// and it self-renders into an icon button that opens a small menu: a direct
// Google Calendar link, and an .ics download that Outlook and Apple
// Calendar both open natively. Start/end values must include a "T" time
// component (even for all-day events) so the browser parses them as local
// time rather than UTC-midnight. A MutationObserver picks up instances
// added later (e.g. inside a popup), so no per-page wiring is needed. ----
(function () {
  function pad(n) { return String(n).padStart(2, "0"); }
  function fmtStamp(d) { return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + "Z"; }
  function fmtDateOnly(d) { return d.getFullYear() + "" + pad(d.getMonth() + 1) + "" + pad(d.getDate()); }
  function icsEscape(s) { return String(s || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n"); }
  function attrEscape(s) { return String(s || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;"); }

  window.icsDateAttr = function (d) {
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + "T" + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":00";
  };

  window.downloadIcs = function (opts) {
    var start = opts.start, end = opts.end || new Date(start.getTime() + (opts.allDay ? 86400000 : 3600000));
    var lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//MOW NSW Members Hub//EN", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
      "UID:" + Date.now() + "-" + Math.random().toString(36).slice(2) + "@membershub.local",
      "DTSTAMP:" + fmtStamp(new Date())];
    if (opts.allDay) {
      lines.push("DTSTART;VALUE=DATE:" + fmtDateOnly(start));
      lines.push("DTEND;VALUE=DATE:" + fmtDateOnly(end));
    } else {
      lines.push("DTSTART:" + fmtStamp(start));
      lines.push("DTEND:" + fmtStamp(end));
    }
    lines.push("SUMMARY:" + icsEscape(opts.title));
    if (opts.location) lines.push("LOCATION:" + icsEscape(opts.location));
    if (opts.description) lines.push("DESCRIPTION:" + icsEscape(opts.description));
    lines.push("END:VEVENT", "END:VCALENDAR");

    var blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = (opts.title || "event").replace(/[^a-z0-9]+/gi, "-").toLowerCase() + ".ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  };

  var calIcon = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
  var chevIcon = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>';
  var googleIcon = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>';
  var downloadIcon = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>';

  function googleUrl(el, start, end, allDay, title, location, desc) {
    var dates = allDay ? fmtDateOnly(start) + "/" + fmtDateOnly(end) : fmtStamp(start) + "/" + fmtStamp(end);
    return "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(title) +
      "&dates=" + dates + (desc ? "&details=" + encodeURIComponent(desc) : "") + (location ? "&location=" + encodeURIComponent(location) : "");
  }

  function renderOne(el) {
    if (el.dataset.icsRendered) return;
    var startStr = el.getAttribute("data-ics-start");
    if (!startStr) return;
    el.dataset.icsRendered = "1";
    var title = el.getAttribute("data-ics-title") || "";
    var endStr = el.getAttribute("data-ics-end");
    var allDay = el.hasAttribute("data-ics-allday");
    var start = new Date(startStr);
    var end = endStr ? new Date(endStr) : new Date(start.getTime() + (allDay ? 86400000 : 3600000));
    var location = el.getAttribute("data-ics-location") || "";
    var desc = el.getAttribute("data-ics-desc") || "";

    el.classList.add("ics-add");
    el.innerHTML =
      '<button type="button" class="ics-add-btn" data-ics-toggle>' + calIcon + "<span>Add to calendar</span>" + chevIcon + "</button>" +
      '<div class="ics-add-menu hide">' +
        '<a class="ics-add-opt" href="' + googleUrl(el, start, end, allDay, title, location, desc) + '" target="_blank" rel="noopener">' + googleIcon + "Google Calendar</a>" +
        '<button type="button" class="ics-add-opt" data-ics-title="' + attrEscape(title) + '" data-ics-start="' + startStr + '" data-ics-end="' + (endStr || "") + '"' + (allDay ? " data-ics-allday" : "") + ' data-ics-location="' + attrEscape(location) + '" data-ics-desc="' + attrEscape(desc) + '">' + downloadIcon + "Outlook / Apple (.ics)</button>" +
      "</div>";
  }

  function scan(root) {
    if (root.nodeType !== 1 && root.nodeType !== 9) return;
    if (root.matches && root.matches(".ics-add[data-ics-title]")) renderOne(root);
    (root.querySelectorAll ? root.querySelectorAll(".ics-add[data-ics-title]") : []).forEach(renderOne);
  }
  scan(document);
  new MutationObserver(function (muts) {
    muts.forEach(function (m) { m.addedNodes.forEach(scan); });
  }).observe(document.body, { childList: true, subtree: true });

  // Both listeners below run in the CAPTURE phase (the `true` third arg).
  // A card's own [data-popup] click handler is attached directly to the
  // card, which sits closer to the target than document in the bubble
  // path — so a bubble-phase stopPropagation() here would always run too
  // late to stop it. Capture runs document-down before that ever fires.

  // Toggle the dropdown, closing any other open one; close on outside click.
  document.addEventListener("click", function (e) {
    var toggle = e.target.closest && e.target.closest("[data-ics-toggle]");
    if (toggle) {
      e.stopPropagation();
      var menu = toggle.nextElementSibling;
      var willOpen = menu.classList.contains("hide");
      document.querySelectorAll(".ics-add-menu").forEach(function (m) { m.classList.add("hide"); });
      if (willOpen) menu.classList.remove("hide");
      return;
    }
    if (!e.target.closest || !e.target.closest(".ics-add-menu")) {
      document.querySelectorAll(".ics-add-menu").forEach(function (m) { m.classList.add("hide"); });
    }
  }, true);

  // The actual .ics download, for the "Outlook / Apple" option (and any
  // other bare [data-ics-title] element, for backward compatibility).
  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest("[data-ics-title]");
    if (!btn || btn.classList.contains("ics-add")) return;
    e.stopPropagation();
    var start = btn.getAttribute("data-ics-start");
    if (!start) return;
    var end = btn.getAttribute("data-ics-end");
    window.downloadIcs({
      title: btn.getAttribute("data-ics-title"),
      start: new Date(start),
      end: end ? new Date(end) : null,
      allDay: btn.hasAttribute("data-ics-allday"),
      location: btn.getAttribute("data-ics-location") || "",
      description: btn.getAttribute("data-ics-desc") || ""
    });
    document.querySelectorAll(".ics-add-menu").forEach(function (m) { m.classList.add("hide"); });
  }, true);
})();

// ---- Clickable topic tags: any .tag inside a card's .rtags list navigates
// to archive.html filtered to that tag (slugified from the tag's own
// label, so it works without every card needing a matching data-tag
// attribute). Capture phase + stopPropagation for the same reason as the
// .ics-add handlers above — a lot of these tags sit inside a card that's
// itself a [data-popup] trigger, and only capture reliably runs before
// that card's own bubble-phase click listener. ----
(function () {
  document.addEventListener("click", function (e) {
    var tag = e.target.closest && e.target.closest(".rtags .tag");
    if (!tag) return;
    e.preventDefault();
    e.stopPropagation();
    var slug = tag.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    if (!slug) return;
    window.location.href = "archive.html?tag=" + encodeURIComponent(slug);
  }, true);
})();
