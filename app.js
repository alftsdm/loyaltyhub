const data = window.LOYALTY_DATA;

const state = {
  query: "",
  level: "all",
  status: "all",
  view: "cards",
  channels: new Set(),
  lang: localStorage.getItem("loyaltyHubLang") || "zh",
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const i18n = {
  zh: {
    sidebarLabel: "产品筛选",
    hierarchyLabel: "产品层级定义",
    closeDetail: "关闭详情",
    searchLabel: "搜索",
    searchPlaceholder: "产品、描述、渠道、排期...",
    levelFilter: "产品层级",
    channelFilter: "渠道支持",
    statusFilter: "状态",
    viewFilter: "视图",
    heroTitle: "Loyalty Hub产品地图",
    sourceNote: "数据源：LoyaltyHub Product Map.xlsx / Loyalty Hub Products Map",
    reset: "重置筛选",
    all: "全部",
    cards: "卡片",
    matrix: "矩阵",
    productCount: "产品数",
    supportedProducts: "已支持产品",
    plannedProducts: "有排期产品",
    currentShowing: (shown, total) => `当前显示 ${shown} / ${total} 个产品`,
    empty: "没有匹配的产品。调整搜索词或筛选条件后再试。",
    unnamedProduct: "未命名产品",
    noDescription: "原表暂未填写产品描述。",
    viewDetail: "查看详情",
    excelRow: "Excel 行",
    level: "层级",
    productSku: "产品 SKU",
    series: "产品系列",
    description: "产品描述",
    productDefinition: "产品描述定义",
    channelSupport: "渠道支持度",
    demoCase: "DEMO / Pilot Clients / Typical Case",
    noPlaybookLink: "原表未提供链接。",
    noPlaybook: "原表暂未填写 playbook 说明。",
    noDemoCase: "原表暂未填写。",
    playbookLink: (index) => `Playbook 链接 ${index + 1}`,
    status: {
      supported: "已支持",
      planned: "有排期",
      "no-plan": "暂无计划",
      unknown: "未标注",
      note: "备注",
    },
    statusValue: {
      Y: "支持",
      "No plan": "暂无计划",
    },
    channel: {
      app: "Dragonpass App",
      h5: "白标 H5",
      web: "白标 Web",
      api: "通用 API",
      admin: "Admin Portal",
      b2b: "B2B Portal",
    },
    shortChannel: {
      app: "DP App",
      h5: "白标 H5",
      web: "白标 Web",
      api: "API",
      admin: "Admin",
      b2b: "B2B",
    },
    seriesName: {
      "Supply Chain Products": "供应链产品",
      "Benefit Management": "权益管理",
      "Loyalty Marketing": "忠诚度营销",
      "User Engagement": "用户互动",
      "User Engagement ": "用户互动",
    },
    hierarchyName: {
      "Supply Chain product": "供应链产品",
      "Benefit management": "权益管理",
      "Loyalty marketing": "忠诚度营销",
      "User Engagemet—— AI & Data-Powered User Interest & Personalization Insight Capability": "用户互动 - AI 与数据驱动的用户兴趣及个性化洞察能力",
    },
    hierarchyDescription: {
      L1: "Supply chain products (E.g. lounge, limo, fast track, etc)",
      L2: "Benefit manager (E.g. swap entitlement, split entitlement, etc)",
      L3: "Loyalty marketing: Focus on the marketing campaign or revenue burning of supply chain products (E.g. action based rewards, marketing campaign tools, benefit bundle, etc)",
      L4: "User engagement: Focus on end-user interaction, activation and service (E.g. Digital Concierge, AI trip planner, etc)",
    },
  },
  en: {
    sidebarLabel: "Product filters",
    hierarchyLabel: "Product level definitions",
    closeDetail: "Close detail",
    searchLabel: "Search",
    searchPlaceholder: "Product, description, channel, schedule...",
    levelFilter: "Product level",
    channelFilter: "Channel support",
    statusFilter: "Status",
    viewFilter: "View",
    heroTitle: "Loyalty Hub Product Map",
    sourceNote: "Source: LoyaltyHub Product Map.xlsx / Loyalty Hub Products Map",
    reset: "Reset filters",
    all: "All",
    cards: "Cards",
    matrix: "Matrix",
    productCount: "Products",
    supportedProducts: "Supported products",
    plannedProducts: "Roadmapped products",
    currentShowing: (shown, total) => `Showing ${shown} / ${total} products`,
    empty: "No matching products. Adjust the search term or filters and try again.",
    unnamedProduct: "Unnamed product",
    noDescription: "No product description in the source sheet.",
    viewDetail: "View detail",
    excelRow: "Excel row",
    level: "Level",
    productSku: "Product SKU",
    series: "Series",
    description: "Description",
    productDefinition: "Product definition",
    channelSupport: "Channel support",
    demoCase: "DEMO / Pilot Clients / Typical Case",
    noPlaybookLink: "No link provided in the source sheet.",
    noPlaybook: "No playbook notes in the source sheet.",
    noDemoCase: "Not provided in the source sheet.",
    playbookLink: (index) => `Playbook link ${index + 1}`,
    status: {
      supported: "Supported",
      planned: "Roadmapped",
      "no-plan": "No plan",
      unknown: "Unspecified",
      note: "Note",
    },
    statusValue: {
      Y: "Yes",
      "No plan": "No plan",
    },
    channel: {
      app: "Dragonpass App",
      h5: "White label H5",
      web: "White label Web",
      api: "Generic API",
      admin: "Admin Portal",
      b2b: "B2B Portal",
    },
    shortChannel: {
      app: "DP App",
      h5: "WL H5",
      web: "WL Web",
      api: "API",
      admin: "Admin",
      b2b: "B2B",
    },
    seriesName: {},
    hierarchyName: {},
    hierarchyDescription: {
      L1: "Supply chain products (E.g. lounge, limo, fast track, etc)",
      L2: "Benefit manager (E.g. swap entitlement, split entitlement, etc)",
      L3: "Loyalty marketing: Focus on the marketing campaign or revenue burning of supply chain products (E.g. action based rewards, marketing campaign tools, benefit bundle, etc)",
      L4: "User engagement: Focus on end-user interaction, activation and service (E.g. Digital Concierge, AI trip planner, etc)",
    },
  },
};

function t(key) {
  return i18n[state.lang][key] ?? i18n.zh[key] ?? key;
}

function statusLabel(type) {
  return i18n[state.lang].status[type] ?? i18n.zh.status[type] ?? type;
}

function channelLabel(channel) {
  return i18n[state.lang].channel[channel.key] ?? channel.label;
}

function channelShortLabel(item) {
  return i18n[state.lang].shortChannel[item.key] ?? shortChannel(item.label);
}

function seriesName(product) {
  return i18n[state.lang].seriesName[product.series] ?? product.series;
}

function hierarchyName(item) {
  return i18n[state.lang].hierarchyName[item.name] ?? item.name;
}

function hierarchyDescription(item) {
  return i18n[state.lang].hierarchyDescription[item.level] ?? hierarchyName(item);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalize(value = "") {
  return String(value).toLowerCase().replace(/\s+/g, " ").trim();
}

function productSearchText(product) {
  return normalize([
    product.level,
    product.series,
    seriesName(product),
    product.sku,
    product.description,
    product.playbook,
    product.demo,
    product.case,
    ...product.support.flatMap((item) => [item.label, channelShortLabel(item), item.value, statusLabel(item.type), statusValue(item)]),
  ].join(" "));
}

function matchesFilters(product) {
  if (state.level !== "all" && product.level !== state.level) return false;
  if (state.status !== "all" && !product.support.some((item) => item.type === state.status)) return false;
  if (state.channels.size) {
    const ok = [...state.channels].every((key) => {
      const item = product.support.find((entry) => entry.key === key);
      return item && (item.type === "supported" || item.type === "planned");
    });
    if (!ok) return false;
  }
  if (state.query && !productSearchText(product).includes(state.query)) return false;
  return true;
}

function supportScore(product) {
  return product.support.reduce((sum, item) => {
    if (item.type === "supported") return sum + 2;
    if (item.type === "planned") return sum + 1;
    return sum;
  }, 0);
}

function filteredProducts() {
  return data.products
    .filter(matchesFilters)
    .sort((a, b) => a.level.localeCompare(b.level) || supportScore(b) - supportScore(a) || a.row - b.row);
}

function renderFilters() {
  const levels = ["all", ...new Set(data.products.map((item) => item.level).filter(Boolean))];
  $("#levelFilters").innerHTML = levels.map((level) => {
    const label = level === "all" ? t("all") : level;
    return `<button class="chip ${state.level === level ? "active" : ""}" data-level="${level}">${label}</button>`;
  }).join("");

  $("#channelFilters").innerHTML = data.channels.map((channel) => `
    <button class="channel-toggle ${state.channels.has(channel.key) ? "active" : ""}" data-channel="${channel.key}">
      ${escapeHtml(channelLabel(channel))}
    </button>
  `).join("");
}

function renderHierarchy() {
  $("#hierarchyStrip").innerHTML = data.hierarchy.map((item) => `
    <article class="level-card">
      <strong>${escapeHtml(item.level)}</strong>
      <p>${escapeHtml(hierarchyDescription(item))}</p>
    </article>
  `).join("");
}

function renderStats(products) {
  const supported = products.filter((product) => product.support.some((item) => item.type === "supported")).length;
  const planned = products.filter((product) => product.support.some((item) => item.type === "planned")).length;
  const playbooks = products.filter((product) => product.playbook).length;
  $("#stats").innerHTML = [
    [t("productCount"), products.length],
    [t("supportedProducts"), supported],
    [t("plannedProducts"), planned],
    ["Playbook", playbooks],
  ].map(([label, value]) => `<div class="stat"><b>${value}</b><span>${label}</span></div>`).join("");
}

function statusValue(item) {
  if (item.value) return i18n[state.lang].statusValue[item.value] ?? item.value;
  return statusLabel(item.type);
}

function renderSupportCells(product) {
  return product.support.map((item) => `
    <div class="support-cell ${item.type}" title="${escapeHtml(channelLabel(item))}: ${escapeHtml(statusValue(item))}">
      <span>${escapeHtml(channelShortLabel(item))}</span>
      ${escapeHtml(statusValue(item))}
    </div>
  `).join("");
}

function shortChannel(label) {
  return label
    .replace("Dragonpass ", "DP ")
    .replace("White label ", "WL ")
    .replace("Generic ", "")
    .replace("Admin ", "Admin");
}

function renderCards(products) {
  if (!products.length) {
    $("#cardsView").innerHTML = `<div class="empty">${escapeHtml(t("empty"))}</div>`;
    return;
  }
  $("#cardsView").innerHTML = products.map((product) => `
    <article class="product-card">
      <header>
        <div>
          <h3>${escapeHtml(product.sku || t("unnamedProduct"))}</h3>
          <p class="series">${escapeHtml(seriesName(product))}</p>
        </div>
        <span class="level-badge">${escapeHtml(product.level || "-")}</span>
      </header>
      <p class="description">${escapeHtml(product.description || t("noDescription"))}</p>
      <div class="support-row">${renderSupportCells(product)}</div>
      <div class="card-actions">
        <span class="mini-meta">${escapeHtml(t("excelRow"))} ${product.row}</span>
        <button class="text-button" data-open="${product.id}">${escapeHtml(t("viewDetail"))}</button>
      </div>
    </article>
  `).join("");
}

function renderMatrix(products) {
  if (!products.length) {
    $("#matrixView").innerHTML = `<div class="empty">${escapeHtml(t("empty"))}</div>`;
    return;
  }
  const channelHeaders = data.channels.map((channel) => `<th>${escapeHtml(channelLabel(channel))}</th>`).join("");
  const rows = products.map((product) => `
    <tr>
      <td><strong>${escapeHtml(product.level)}</strong></td>
      <td><button class="text-button" data-open="${product.id}">${escapeHtml(product.sku || t("unnamedProduct"))}</button></td>
      <td>${escapeHtml(seriesName(product))}</td>
      ${product.support.map((item) => `<td><span class="status-pill ${item.type}">${escapeHtml(statusValue(item))}</span></td>`).join("")}
      <td>${escapeHtml((product.description || "").slice(0, 120))}</td>
    </tr>
  `).join("");
  $("#matrixView").innerHTML = `
    <table class="matrix">
      <thead>
        <tr>
          <th>${escapeHtml(t("level"))}</th>
          <th>${escapeHtml(t("productSku"))}</th>
          <th>${escapeHtml(t("series"))}</th>
          ${channelHeaders}
          <th>${escapeHtml(t("description"))}</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderDetail(product) {
  const support = product.support.map((item) => `
    <div class="support-cell ${item.type}">
      <span>${escapeHtml(channelLabel(item))}</span>
      ${escapeHtml(statusValue(item))}
    </div>
  `).join("");
  const links = product.playbookLinks.length
    ? `<div class="link-list">${product.playbookLinks.map((url, index) => `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(t("playbookLink")(index))}</a>`).join("")}</div>`
    : `<p>${escapeHtml(t("noPlaybookLink"))}</p>`;

  $("#drawerContent").innerHTML = `
    <span class="level-badge">${escapeHtml(product.level || "-")}</span>
    <h2 class="drawer-title">${escapeHtml(product.sku || t("unnamedProduct"))}</h2>
    <p class="series">${escapeHtml(seriesName(product))} · ${escapeHtml(t("excelRow"))} ${product.row}</p>

    <section class="drawer-section">
      <h4>${escapeHtml(t("productDefinition"))}</h4>
      <p>${escapeHtml(product.description || t("noDescription"))}</p>
    </section>

    <section class="drawer-section">
      <h4>${escapeHtml(t("channelSupport"))}</h4>
      <div class="support-row">${support}</div>
    </section>

    <section class="drawer-section">
      <h4>Product Playbook</h4>
      <p>${escapeHtml(product.playbook || t("noPlaybook"))}</p>
      ${links}
    </section>

    <section class="drawer-section">
      <h4>${escapeHtml(t("demoCase"))}</h4>
      <p>${escapeHtml([product.demo, product.case].filter(Boolean).join("\\n") || t("noDemoCase"))}</p>
    </section>
  `;
  $("#detailDrawer").classList.add("open");
  $("#detailDrawer").setAttribute("aria-hidden", "false");
}

function closeDetail() {
  $("#detailDrawer").classList.remove("open");
  $("#detailDrawer").setAttribute("aria-hidden", "true");
}

function render() {
  document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";
  renderStaticText();
  renderFilters();
  renderHierarchy();
  const products = filteredProducts();
  renderStats(products);
  $("#resultMeta").textContent = t("currentShowing")(products.length, data.products.length);
  $("#cardsView").hidden = state.view !== "cards";
  $("#matrixView").hidden = state.view !== "matrix";
  renderCards(products);
  renderMatrix(products);
  $$(".chip[data-status]").forEach((button) => button.classList.toggle("active", button.dataset.status === state.status));
  $$(".chip[data-view]").forEach((button) => button.classList.toggle("active", button.dataset.view === state.view));
  $$(".lang-option").forEach((button) => button.classList.toggle("active", button.dataset.lang === state.lang));
}

function renderStaticText() {
  $$("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  $$("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });
  $("#searchInput").placeholder = t("searchPlaceholder");
  $$("[data-status]").forEach((button) => {
    button.textContent = button.dataset.status === "all" ? t("all") : statusLabel(button.dataset.status);
  });
  $$("[data-view]").forEach((button) => {
    button.textContent = t(button.dataset.view);
  });
}

document.addEventListener("click", (event) => {
  const levelButton = event.target.closest("[data-level]");
  if (levelButton) {
    state.level = levelButton.dataset.level;
    render();
    return;
  }

  const channelButton = event.target.closest("[data-channel]");
  if (channelButton) {
    const key = channelButton.dataset.channel;
    if (state.channels.has(key)) state.channels.delete(key);
    else state.channels.add(key);
    render();
    return;
  }

  const statusButton = event.target.closest("[data-status]");
  if (statusButton) {
    state.status = statusButton.dataset.status;
    render();
    return;
  }

  const viewButton = event.target.closest("[data-view]");
  if (viewButton) {
    state.view = viewButton.dataset.view;
    render();
    return;
  }

  const langButton = event.target.closest("[data-lang]");
  if (langButton) {
    state.lang = langButton.dataset.lang;
    localStorage.setItem("loyaltyHubLang", state.lang);
    render();
    return;
  }

  const openButton = event.target.closest("[data-open]");
  if (openButton) {
    const product = data.products.find((item) => item.id === openButton.dataset.open);
    if (product) renderDetail(product);
    return;
  }

  if (event.target.id === "detailDrawer" || event.target.id === "closeDrawer") closeDetail();
});

$("#searchInput").addEventListener("input", (event) => {
  state.query = normalize(event.target.value);
  render();
});

$("#resetBtn").addEventListener("click", () => {
  state.query = "";
  state.level = "all";
  state.status = "all";
  state.view = "cards";
  state.channels.clear();
  $("#searchInput").value = "";
  render();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDetail();
});

render();
