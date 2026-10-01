/* Sample Archive: a local-first showroom management tool. */
const STORAGE_KEY = "sample-archive-v1";
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85";
const seed = {
  nextSampleNumber: 18,
  buyers: [
    { id: "buyer-harbor", name: "Harbor & Field", note: "Contemporary essentials, northern Europe.", logo: "" },
    { id: "buyer-atelier", name: "Atelier Morrow", note: "Refined womenswear and considered tailoring.", logo: "" },
    { id: "buyer-north", name: "North Archive", note: "Modern utility and elevated casualwear.", logo: "" },
    { id: "buyer-verde", name: "Casa Verde", note: "Mediterranean resort collections.", logo: "" }
  ],
  locations: [
    { id: "loc-rack-01", type: "Display", name: "Rack-01" }, { id: "loc-rack-02", type: "Display", name: "Rack-02" },
    { id: "loc-rack-03", type: "Display", name: "Rack-03" }, { id: "loc-wall-01", type: "Display", name: "Wall-01" },
    { id: "loc-box-001", type: "Box", name: "BOX-001" }, { id: "loc-box-002", type: "Box", name: "BOX-002" },
    { id: "loc-box-003", type: "Box", name: "BOX-003" }, { id: "loc-box-012", type: "Box", name: "BOX-012" }
  ],
  samples: [
    { id: "SMP-00017", buyerId: "buyer-harbor", style: "HF-24-071", code: "PLO-471", name: "Merino Point Polo", fabric: "Extra-fine Merino", gsm: "210", finish: "Enzyme washed", sampleType: "Proto", status: "Available", color: "Lichen", size: "M", season: "AW 2026", locationId: "loc-rack-01", photo: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85", remarks: "Keep with the knitwear story. Approved for buyer review." },
    { id: "SMP-00016", buyerId: "buyer-atelier", style: "AM-SS-112", code: "DRS-112", name: "Fluid Column Dress", fabric: "TENCEL Lyocell Twill", gsm: "185", finish: "Garment dyed", sampleType: "Salesman", status: "Available", color: "Black Olive", size: "S", season: "SS 2027", locationId: "loc-rack-02", photo: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85", remarks: "Confirm hem measurement after fitting." },
    { id: "SMP-00015", buyerId: "buyer-north", style: "NA-27-046", code: "OVR-046", name: "Canvas Overshirt", fabric: "Organic Cotton Canvas", gsm: "320", finish: "Peached", sampleType: "Fit", status: "Pending", color: "Clay", size: "L", season: "AW 2026", locationId: "loc-box-012", photo: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=85", remarks: "Awaiting revised pocket construction." },
    { id: "SMP-00014", buyerId: "buyer-verde", style: "CV-RS-038", code: "SHT-038", name: "Linen Camp Shirt", fabric: "Linen Voile", gsm: "145", finish: "Softened", sampleType: "Salesman", status: "Moved", color: "Ecru Stripe", size: "M", season: "Resort 2027", locationId: "loc-wall-01", photo: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1200&q=85", remarks: "Pair with the resort trouser group on the wall." },
    { id: "SMP-00013", buyerId: "buyer-harbor", style: "HF-24-057", code: "TRS-057", name: "Relaxed Pleat Trouser", fabric: "Cotton Wool Twill", gsm: "280", finish: "Rinsed", sampleType: "Proto", status: "Available", color: "Charcoal", size: "32", season: "AW 2026", locationId: "loc-box-001", photo: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&q=85", remarks: "Stored with matching overshirt reference." },
    { id: "SMP-00012", buyerId: "buyer-atelier", style: "AM-SS-098", code: "JKT-098", name: "Soft Tailored Jacket", fabric: "Viscose Linen Blend", gsm: "245", finish: "Piece dyed", sampleType: "Fit", status: "Pending", color: "Oyster", size: "M", season: "SS 2027", locationId: "loc-rack-03", photo: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=85", remarks: "New shoulder pad in the next fit round." },
    { id: "SMP-00011", buyerId: "buyer-north", style: "NA-27-021", code: "TEE-021", name: "Heavyweight Pocket Tee", fabric: "Compact Jersey", gsm: "260", finish: "Silicone wash", sampleType: "Salesman", status: "Available", color: "Undyed", size: "M", season: "AW 2026", locationId: "loc-box-002", photo: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=85", remarks: "Reference quality for all jersey developments." }
  ],
  movements: [
    { id: "move-1", sampleId: "SMP-00014", productName: "Linen Camp Shirt", from: "Box · BOX-003", to: "Display · Wall-01", timestamp: "2026-09-30T10:35:00.000Z" },
    { id: "move-2", sampleId: "SMP-00015", productName: "Canvas Overshirt", from: "Display · Rack-03", to: "Box · BOX-012", timestamp: "2026-09-28T08:20:00.000Z" },
    { id: "move-3", sampleId: "SMP-00012", productName: "Soft Tailored Jacket", from: "Box · BOX-002", to: "Display · Rack-03", timestamp: "2026-09-23T06:15:00.000Z" }
  ]
};

const clone = (value) => JSON.parse(JSON.stringify(value));
let state = loadState();
let sampleFilter = "";
let sampleStatus = "All";
let atlasConnected = false;
let atlasSaveTimer;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.buyers) && Array.isArray(saved.samples) && Array.isArray(saved.locations) && Array.isArray(saved.movements)) return saved;
  } catch (_) { /* Seed cleanly when saved JSON is corrupt. */ }
  return clone(seed);
}
function saveLocally() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function persist() {
  saveLocally();
  if (atlasConnected) queueAtlasSave();
}
function archiveShapeIsValid(value) { return value && ["buyers", "samples", "locations", "movements"].every((key) => Array.isArray(value[key])); }
function queueAtlasSave() {
  window.clearTimeout(atlasSaveTimer);
  atlasSaveTimer = window.setTimeout(async () => {
    try {
      const response = await fetch("/api/archive", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(state) });
      if (!response.ok) throw new Error("Atlas save failed");
    } catch (_error) {
      atlasConnected = false;
      toast("Saved locally. Atlas sync is temporarily unavailable.", true);
    }
  }, 180);
}
async function initialiseAtlas() {
  try {
    const response = await fetch("/api/archive", { cache: "no-store" });
    if (!response.ok) throw new Error("Atlas read failed");
    const remoteArchive = await response.json();
    atlasConnected = true;
    if (archiveShapeIsValid(remoteArchive)) {
      state = remoteArchive;
      state.nextSampleNumber ||= state.samples.length + 1;
      saveLocally();
    } else {
      queueAtlasSave();
    }
    render();
  } catch (_error) {
    atlasConnected = false;
    toast("Atlas is unavailable. Your archive is saving locally.", true);
  }
}
function uid(prefix) { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }
function escapeHTML(value = "") { return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]); }
function buyer(id) { return state.buyers.find((item) => item.id === id); }
function showroomLocation(id) { return state.locations.find((item) => item.id === id); }
function sample(id) { return state.samples.find((item) => item.id === id); }
function labelLocation(locationId) { const item = showroomLocation(locationId); return item ? `${item.type} · ${item.name}` : "Unassigned"; }
function formatDate(value) { return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
function plural(count, word) { return `${count} ${word}${count === 1 ? "" : "s"}`; }
function initials(name = "") { return name.split(/\s+/).slice(0, 2).map((part) => part[0] || "").join("").toUpperCase() || "SA"; }
function buyerMark(item) { return item?.logo ? `<img src="${escapeHTML(item.logo)}" alt="${escapeHTML(item.name)} logo" />` : escapeHTML(initials(item?.name)); }
function driveImageUrl(raw = "") {
  const value = raw.trim();
  const match = value.match(/(?:\/d\/|id=)([-\w]{10,})/);
  return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : value;
}
function safeImage(url) { return url || FALLBACK_IMAGE; }
function refreshIcons() { if (window.lucide) window.lucide.createIcons({ attrs: { "stroke-width": 1.5 } }); }
function toast(message, error = false) {
  const root = document.querySelector("#toast-root");
  root.innerHTML = `<div class="toast${error ? " error" : ""}">${escapeHTML(message)}</div>`;
  setTimeout(() => { root.innerHTML = ""; }, 3100);
}
function setHeaderContext(value) { document.querySelector("#header-context").textContent = value; }

function statusClass(status) { return String(status || "").toLowerCase(); }
function sampleCard(item) {
  const b = buyer(item.buyerId);
  return `<button class="sample-card" data-route="sample/${encodeURIComponent(item.id)}">
    <span class="sample-image-wrap"><img class="sample-image" src="${escapeHTML(safeImage(item.photo))}" onerror="this.src='${FALLBACK_IMAGE}'" alt="${escapeHTML(item.name)} sample" /></span>
    <span class="sample-card-info">
      <span class="sample-card-top"><span class="sample-name">${escapeHTML(item.name)}</span><span class="sample-id">${escapeHTML(item.id)}</span></span>
      <span class="sample-meta">${escapeHTML(item.style)} &nbsp; / &nbsp; ${escapeHTML(b?.name || "No buyer")}</span>
      <span class="sample-details-line"><span class="sample-location">${escapeHTML(labelLocation(item.locationId))}</span><span class="status ${statusClass(item.status)}">${escapeHTML(item.status)}</span></span>
    </span>
  </button>`;
}
function noItems(title, message, action = "") { return `<div class="empty-state"><h3>${escapeHTML(title)}</h3><p>${escapeHTML(message)}</p>${action}</div>`; }

function overviewPage() {
  const counts = { total: state.samples.length, buyers: state.buyers.length, display: state.samples.filter((item) => showroomLocation(item.locationId)?.type === "Display").length, boxes: state.samples.filter((item) => showroomLocation(item.locationId)?.type === "Box").length, available: state.samples.filter((item) => item.status === "Available").length };
  const buyerCards = state.buyers.map((item) => {
    const count = state.samples.filter((s) => s.buyerId === item.id).length;
    return `<button class="buyer-card" data-route="buyer/${encodeURIComponent(item.id)}"><span class="buyer-card-top"><span class="buyer-monogram">${buyerMark(item)}</span><span class="buyer-arrow"><i data-lucide="arrow-up-right"></i></span></span><span class="buyer-name">${escapeHTML(item.name)}</span><span class="buyer-count">${plural(count, "sample")}</span></button>`;
  }).join("") || noItems("No buyers yet", "Create a buyer to begin cataloguing samples.");
  return `<section><div class="home-head"><div><p class="eyebrow">Private Garment Showroom</p><h1 class="display-title">Sample Archive</h1></div><div class="archive-date">LIVE COLLECTION<br />${new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date())}</div></div>
    <div class="search-wrap"><i data-lucide="search"></i><input id="global-search" autocomplete="off" placeholder="Search Style, Product, Code or Buyer..." aria-label="Search samples" /><div class="quick-results" id="quick-results" hidden></div></div>
    <div class="stats"><div class="stat"><span class="stat-number">${counts.total}</span><span class="stat-label">Total Samples</span></div><div class="stat"><span class="stat-number">${counts.buyers}</span><span class="stat-label">Total Buyers</span></div><div class="stat"><span class="stat-number">${counts.display}</span><span class="stat-label">On Display</span></div><div class="stat"><span class="stat-number">${counts.boxes}</span><span class="stat-label">In Boxes</span></div><div class="stat"><span class="stat-number">${counts.available}</span><span class="stat-label">Available Samples</span></div></div>
    <div class="section-heading"><div><h2>Browse by buyer</h2><p>Open a collection to view its current sample set.</p></div><button class="link-button" data-route="buyers">View all buyers</button></div><div class="buyer-grid">${buyerCards}</div>
  </section>`;
}

function buyersPage() {
  const rows = state.buyers.map((item) => {
    const count = state.samples.filter((s) => s.buyerId === item.id).length;
    return `<article class="buyer-row"><a class="buyer-row-mark" href="#buyer/${encodeURIComponent(item.id)}" aria-label="Open ${escapeHTML(item.name)}"><span class="buyer-monogram">${buyerMark(item)}</span></a><a class="buyer-row-identity" href="#buyer/${encodeURIComponent(item.id)}"><div class="buyer-row-name">${escapeHTML(item.name)}</div><span class="buyer-count">${plural(count, "sample")}</span></a><p class="buyer-note">${escapeHTML(item.note || "No buyer note added.")}</p><div class="row-actions"><button class="icon-button" title="Open ${escapeHTML(item.name)}" data-route="buyer/${encodeURIComponent(item.id)}"><i data-lucide="arrow-up-right"></i></button><button class="icon-button" title="Edit buyer" data-action="edit-buyer" data-id="${escapeHTML(item.id)}"><i data-lucide="pencil"></i></button><button class="icon-button" title="Delete buyer" data-action="delete-buyer" data-id="${escapeHTML(item.id)}"><i data-lucide="trash-2"></i></button></div></article>`;
  }).join("");
  return pageHeader("Buyers", "The people and labels behind the current showroom collection.", `<button class="primary-button" data-action="add-buyer"><i data-lucide="user-round-plus"></i>Add Buyer</button>`) + `<div class="buyers-list">${rows || noItems("No buyers yet", "Add a buyer to start building your archive.")}</div>`;
}
function pageHeader(title, subtitle, button = "") { return `<section class="page-header"><div class="eyebrow">Sample Archive / ${escapeHTML(title)}</div><div class="section-heading" style="margin:0 0 0"><div><h1 class="page-title">${escapeHTML(title)}</h1><p class="page-subtitle">${escapeHTML(subtitle)}</p></div>${button}</div></section>`; }
function filteredSamples() {
  const q = sampleFilter.trim().toLowerCase();
  return state.samples.filter((item) => {
    const b = buyer(item.buyerId);
    const queryText = [item.id, item.style, item.code, item.name, item.fabric, item.color, b?.name].join(" ").toLowerCase();
    return (!q || queryText.includes(q)) && (sampleStatus === "All" || item.status === sampleStatus);
  });
}
function samplesPage() {
  const list = filteredSamples();
  return pageHeader("Samples", "A working collection of every physical sample currently in the showroom.", `<button class="primary-button" data-action="add-sample"><i data-lucide="plus"></i>Add Sample</button>`) + `<div class="toolbar"><div class="search-small"><i data-lucide="search"></i><input id="sample-search" value="${escapeHTML(sampleFilter)}" placeholder="Filter samples..." /></div><div class="filter-set"><select id="status-filter" class="select-small"><option value="All">All statuses</option>${["Available", "Pending", "Moved"].map((s) => `<option ${sampleStatus === s ? "selected" : ""}>${s}</option>`).join("")}</select><span class="utility-button">${plural(list.length, "result")}</span></div></div><div class="samples-grid">${list.map(sampleCard).join("") || noItems("Nothing found", "Try a different style, product code, buyer, fabric or color.")}</div>`;
}
function locationsPage() {
  const group = (type) => state.locations.filter((item) => item.type === type).map((item) => {
    const count = state.samples.filter((s) => s.locationId === item.id).length;
    return `<button class="location-row" data-route="location/${encodeURIComponent(item.id)}"><span class="location-name">${escapeHTML(item.name)}</span><span class="location-count"><strong>${count}</strong>${count === 1 ? "sample" : "samples"}</span></button>`;
  }).join("") || `<div class="location-row"><span class="location-count">No locations created.</span></div>`;
  return pageHeader("Locations", "A live view of every rack, wall and box in the physical archive.", `<button class="primary-button" data-action="add-location"><i data-lucide="plus"></i>Add Location</button>`) + `<div class="locations-wrap"><section><h2 class="location-section-title">Display locations</h2><p class="location-section-description">Racks and walls currently available in the showroom.</p><div class="location-list">${group("Display")}</div></section><section><h2 class="location-section-title">Boxes</h2><p class="location-section-description">Archived and off-floor samples by box number.</p><div class="location-list">${group("Box")}</div></section></div>`;
}
function historyPage() {
  const list = [...state.movements].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
  return pageHeader("Movement History", "A permanent record of every change in sample location.") + `<div class="history-list">${list.map((item) => `<article class="history-row"><div class="history-time">${escapeHTML(formatDate(item.timestamp))}</div><div class="history-product"><strong>${escapeHTML(item.productName)}</strong><span>${escapeHTML(item.sampleId)}</span></div><div class="history-from">${escapeHTML(item.from)}</div><div class="history-to"><span class="history-arrow">&#8594;</span>${escapeHTML(item.to)}</div></article>`).join("") || noItems("No movements recorded", "Location changes will appear here.")}</div>`;
}
function sampleDetailPage(id) {
  const item = sample(id);
  if (!item) return notFound("This sample is no longer in the archive.");
  const b = buyer(item.buyerId);
  const details = [["Buyer", b?.name || "No buyer"], ["Style", item.style], ["Product code", item.code], ["Fabric", item.fabric], ["GSM", item.gsm ? `${item.gsm} GSM` : "-"], ["Finish", item.finish], ["Sample", item.sampleType], ["Status", item.status], ["Color", item.color], ["Size", item.size], ["Season", item.season], ["Current location", labelLocation(item.locationId)]];
  return `<a class="detail-back" href="#samples"><i data-lucide="arrow-left"></i>Back to samples</a><article class="detail-layout"><div class="detail-photo"><img src="${escapeHTML(safeImage(item.photo))}" onerror="this.src='${FALLBACK_IMAGE}'" alt="${escapeHTML(item.name)}" /></div><div class="detail-info"><div class="detail-id">${escapeHTML(item.id)}</div><h1 class="detail-title">${escapeHTML(item.name)}</h1><div class="detail-buyer">${escapeHTML(b?.name || "No buyer assigned")}</div><div class="detail-data">${details.map(([label, value]) => `<div class="data-item"><span class="data-label">${escapeHTML(label)}</span><span class="data-value">${escapeHTML(value || "-")}</span></div>`).join("")}</div><div class="remarks"><h3>Remarks</h3><p>${escapeHTML(item.remarks || "No remarks recorded for this sample.")}</p></div><div class="detail-actions"><button class="primary-button" data-action="edit-sample" data-id="${escapeHTML(item.id)}"><i data-lucide="pencil"></i>Edit Sample</button><button class="outline-button" data-action="move-sample" data-id="${escapeHTML(item.id)}"><i data-lucide="arrow-left-right"></i>Move Location</button><button class="danger-button" data-action="delete-sample" data-id="${escapeHTML(item.id)}"><i data-lucide="trash-2"></i>Delete Sample</button></div></div></article>`;
}
function buyerDetailPage(id) {
  const item = buyer(id);
  if (!item) return notFound("This buyer is no longer in the archive.");
  const list = state.samples.filter((s) => s.buyerId === id);
  return `<a class="detail-back" href="#buyers"><i data-lucide="arrow-left"></i>Back to buyers</a>${pageHeader(item.name, item.note || "Buyer collection", `<div class="locations-head-actions"><button class="outline-button" data-action="edit-buyer" data-id="${escapeHTML(id)}"><i data-lucide="pencil"></i>Edit</button><button class="primary-button" data-action="add-sample" data-buyer-id="${escapeHTML(id)}"><i data-lucide="plus"></i>Add Sample</button></div>`)}<div class="section-heading full-collection"><div><h2>Current collection</h2><p>${plural(list.length, "sample")} in the archive</p></div></div><div class="samples-grid">${list.map(sampleCard).join("") || noItems("No samples yet", "Add the first sample for this buyer.")}</div>`;
}
function locationDetailPage(id) {
  const loc = showroomLocation(id);
  if (!loc) return notFound("This showroom location is no longer available.");
  const list = state.samples.filter((s) => s.locationId === id);
  return `<a class="detail-back" href="#locations"><i data-lucide="arrow-left"></i>Back to locations</a>${pageHeader(loc.name, `${loc.type} location with ${plural(list.length, "sample")}.`, `<button class="primary-button" data-action="add-sample" data-location-id="${escapeHTML(id)}"><i data-lucide="plus"></i>Add Sample</button>`)}<div class="section-heading full-collection"><div><h2>Samples at ${escapeHTML(loc.name)}</h2><p>Live physical location</p></div></div><div class="samples-grid">${list.map(sampleCard).join("") || noItems("No samples here", "Move or add a sample to this location.")}</div>`;
}
function notFound(message) { return `<div class="empty-state"><h3>Not found</h3><p>${escapeHTML(message)}</p><a class="primary-button" href="#overview" style="margin-top:18px">Return to archive</a></div>`; }

function render() {
  const raw = location.hash.slice(1) || "overview";
  const [route, id] = raw.split("/").map(decodeURIComponent);
  const views = { overview: overviewPage, buyers: buyersPage, samples: samplesPage, locations: locationsPage, history: historyPage };
  const contexts = { overview: "Private garment showroom", buyers: "Buyer directory", samples: "Sample collection", locations: "Showroom location map", history: "Movement record" };
  let markup;
  if (route === "sample") markup = sampleDetailPage(id);
  else if (route === "buyer") markup = buyerDetailPage(id);
  else if (route === "location") markup = locationDetailPage(id);
  else markup = (views[route] || overviewPage)();
  document.querySelector("#app").innerHTML = markup;
  setHeaderContext(contexts[route] || "Sample details");
  document.querySelectorAll("[data-nav]").forEach((node) => node.classList.toggle("active", node.dataset.nav === route));
  refreshIcons();
}

function showModal(markup, small = false) { document.querySelector("#modal-root").innerHTML = `<div class="modal-layer" data-action="close-modal"><div class="modal${small ? " small" : ""}" role="dialog" aria-modal="true">${markup}</div></div>`; refreshIcons(); }
function closeModal() { document.querySelector("#modal-root").innerHTML = ""; }
function modalTitle(title, subtitle = "") { return `<div class="modal-head"><div><h2>${escapeHTML(title)}</h2>${subtitle ? `<p>${escapeHTML(subtitle)}</p>` : ""}</div><button class="icon-button modal-close" data-action="close-modal" aria-label="Close"><i data-lucide="x"></i></button></div>`; }
function buyerForm(id) {
  const item = id ? buyer(id) : { name: "", note: "", logo: "" };
  showModal(`${modalTitle(id ? "Edit Buyer" : "Add Buyer", "Keep buyer details concise and easy to scan.")}<form class="form" id="buyer-form" data-id="${escapeHTML(id || "")}"><div class="form-grid"><div class="field full"><label for="buyer-name">Buyer Name *</label><input id="buyer-name" name="name" required value="${escapeHTML(item.name)}" placeholder="e.g. Harbor & Field" /></div><div class="field full"><label for="buyer-note">Buyer Note / Description</label><textarea id="buyer-note" name="note" placeholder="Collection or contact context...">${escapeHTML(item.note)}</textarea></div><div class="field full"><label for="buyer-logo">Optional Buyer Logo URL</label><input id="buyer-logo" name="logo" value="${escapeHTML(item.logo)}" placeholder="https://..." /></div></div><div class="form-footer"><span class="form-error"></span><button type="button" class="outline-button" data-action="close-modal">Cancel</button><button class="primary-button" type="submit">${id ? "Save Changes" : "Save Buyer"}</button></div></form>`);
  setTimeout(() => document.querySelector("#buyer-name")?.focus(), 20);
}
function selectOptions(items, selected, blank = "") { return `${blank ? `<option value="">${escapeHTML(blank)}</option>` : ""}${items.map((item) => `<option value="${escapeHTML(item.id)}" ${item.id === selected ? "selected" : ""}>${escapeHTML(item.name)}</option>`).join("")}`; }
function sampleForm(id, defaults = {}) {
  const item = id ? sample(id) : { buyerId: defaults.buyerId || "", style: "", code: "", name: "", fabric: "", gsm: "", finish: "", sampleType: "Proto", status: "Available", color: "", size: "", season: "", locationId: defaults.locationId || "", photo: "", remarks: "" };
  const locationsForType = (type) => state.locations.filter((loc) => loc.type === type);
  const currentType = showroomLocation(item.locationId)?.type || "Display";
  const fields = (label, key, extras = "") => `<div class="field ${extras}"><label for="sample-${key}">${label}</label><input id="sample-${key}" name="${key}" value="${escapeHTML(item[key] || "")}" /></div>`;
  showModal(`${modalTitle(id ? "Edit Sample" : "Add Sample", id ? "Update the archive record. Changes appear everywhere immediately." : "A complete record makes every sample easier to find.")}<form class="form" id="sample-form" data-id="${escapeHTML(id || "")}"><div class="form-section"><div class="form-section-title">Basic information</div><div class="form-grid"><div class="field"><label for="sample-buyer">Buyer *</label><select id="sample-buyer" name="buyerId" required>${selectOptions(state.buyers, item.buyerId, "Select buyer")}</select></div>${fields("Style *", "style")}${fields("Product Code *", "code")}${fields("Product Name *", "name")} ${fields("Fabric *", "fabric")} ${fields("GSM", "gsm")} ${fields("Finish", "finish")}<div class="field"><label for="sample-type">Sample Type</label><select id="sample-type" name="sampleType">${["Proto", "Fit", "Salesman", "PP", "Size Set"].map((v) => `<option ${item.sampleType === v ? "selected" : ""}>${v}</option>`).join("")}</select></div><div class="field"><label for="sample-status">Status</label><select id="sample-status" name="status">${["Available", "Pending", "Moved"].map((v) => `<option ${item.status === v ? "selected" : ""}>${v}</option>`).join("")}</select></div></div></div><div class="form-section"><div class="form-section-title">Product details</div><div class="form-grid">${fields("Color", "color")}${fields("Size", "size")}${fields("Season", "season")}</div></div><div class="form-section"><div class="form-section-title">Location</div><div class="form-grid"><div class="field"><label for="sample-location-type">Location Type *</label><select id="sample-location-type" name="locationType"><option ${currentType === "Display" ? "selected" : ""}>Display</option><option ${currentType === "Box" ? "selected" : ""}>Box</option></select></div><div class="field"><label for="sample-location">Location *</label><select id="sample-location" name="locationId" required>${selectOptions(locationsForType(currentType), item.locationId, "Select location")}</select></div></div></div><div class="form-section"><div class="form-section-title">Photo & notes</div><div class="form-grid"><div class="field full"><label for="sample-photo">Google Drive Photo Link</label><input id="sample-photo" name="photo" value="${escapeHTML(item.photo || "")}" placeholder="Paste a Google Drive sharing link or direct image URL" /><div id="photo-preview-holder"></div></div><div class="field full"><label for="sample-remarks">Remarks</label><textarea id="sample-remarks" name="remarks" placeholder="Fitting notes, buyer feedback, storage details...">${escapeHTML(item.remarks || "")}</textarea></div></div></div><div class="form-footer"><span class="form-error"></span><button type="button" class="outline-button" data-action="close-modal">Cancel</button><button class="primary-button" type="submit">${id ? "Save Changes" : "Save Sample"}</button></div></form>`);
  updatePhotoPreview(item.photo);
  setTimeout(() => document.querySelector("#sample-buyer")?.focus(), 20);
}
function updateLocationSelect(type, selectId, selected = "") {
  const select = document.querySelector(selectId);
  if (!select) return;
  const locations = state.locations.filter((item) => item.type === type);
  select.innerHTML = selectOptions(locations, selected, "Select location");
}
function updatePhotoPreview(raw) {
  const holder = document.querySelector("#photo-preview-holder");
  if (!holder) return;
  const url = driveImageUrl(raw || "");
  holder.innerHTML = url ? `<div class="photo-preview"><img src="${escapeHTML(url)}" onerror="this.style.display='none'" alt="Photo preview" /><span>Photo preview<br />Google Drive links are converted automatically.</span></div>` : "";
}
function locationForm() {
  showModal(`${modalTitle("Add Location", "Add a rack, wall or box to the showroom map.")}<form class="form" id="location-form"><div class="form-grid"><div class="field"><label for="location-type">Location Type *</label><select id="location-type" name="type"><option>Display</option><option>Box</option></select></div><div class="field"><label for="location-name">Location Name *</label><input id="location-name" name="name" required placeholder="e.g. Rack-04 or BOX-004" /></div></div><div class="form-footer"><span class="form-error"></span><button type="button" class="outline-button" data-action="close-modal">Cancel</button><button class="primary-button" type="submit">Save Location</button></div></form>`);
  setTimeout(() => document.querySelector("#location-name")?.focus(), 20);
}
function moveForm(id) {
  const item = sample(id); if (!item) return;
  const current = showroomLocation(item.locationId);
  showModal(`${modalTitle("Move Sample", "Every move becomes a permanent record in Movement History.")}<form class="form" id="move-form" data-id="${escapeHTML(id)}"><div class="confirm-sample"><strong>${escapeHTML(item.name)}</strong><span>${escapeHTML(item.id)} &nbsp; / &nbsp; Current: ${escapeHTML(labelLocation(item.locationId))}</span></div><div class="form-grid"><div class="field"><label for="move-location-type">New Location Type *</label><select id="move-location-type" name="locationType"><option ${current?.type === "Display" ? "selected" : ""}>Display</option><option ${current?.type === "Box" ? "selected" : ""}>Box</option></select></div><div class="field"><label for="move-location">New Location *</label><select id="move-location" name="locationId" required>${selectOptions(state.locations.filter((l) => l.type === (current?.type || "Display")), item.locationId, "Select location")}</select></div></div><div class="form-footer"><span class="form-error"></span><button type="button" class="outline-button" data-action="close-modal">Cancel</button><button class="primary-button" type="submit">Save Move</button></div></form>`);
}
function confirmModal({ title, body, sampleText = "", confirmText, onConfirm, danger = true }) {
  showModal(`<div class="confirm-content"><h2>${escapeHTML(title)}</h2><p>${escapeHTML(body)}</p>${sampleText ? `<div class="confirm-sample">${sampleText}</div>` : ""}<div class="confirm-actions"><button class="outline-button" data-action="close-modal">Cancel</button><button class="${danger ? "danger-button" : "primary-button"}" data-action="confirm" data-confirm="${escapeHTML(onConfirm)}">${escapeHTML(confirmText)}</button></div></div>`, true);
}

function validateSample(form) {
  const values = Object.fromEntries(new FormData(form).entries());
  for (const field of ["buyerId", "style", "code", "name", "fabric", "locationId"]) if (!values[field]?.trim()) return `Please complete ${field === "buyerId" ? "the buyer" : field === "locationId" ? "the location" : field.replace("Id", "")}.`;
  return "";
}
function formError(form, message) { const target = form.querySelector(".form-error"); if (target) target.textContent = message; }
function saveBuyer(form) {
  const values = Object.fromEntries(new FormData(form).entries());
  if (!values.name.trim()) return formError(form, "Buyer name is required.");
  const id = form.dataset.id;
  if (id) Object.assign(buyer(id), { name: values.name.trim(), note: values.note.trim(), logo: values.logo.trim() });
  else state.buyers.push({ id: uid("buyer"), name: values.name.trim(), note: values.note.trim(), logo: values.logo.trim() });
  persist(); closeModal(); render(); toast(id ? "Buyer updated successfully." : "Buyer added to the archive.");
}
function saveSample(form) {
  const error = validateSample(form); if (error) return formError(form, error);
  const values = Object.fromEntries(new FormData(form).entries());
  const id = form.dataset.id;
  const payload = { buyerId: values.buyerId, style: values.style.trim(), code: values.code.trim(), name: values.name.trim(), fabric: values.fabric.trim(), gsm: values.gsm.trim(), finish: values.finish.trim(), sampleType: values.sampleType, status: values.status, color: values.color.trim(), size: values.size.trim(), season: values.season.trim(), locationId: values.locationId, photo: driveImageUrl(values.photo), remarks: values.remarks.trim() };
  if (id) {
    const old = sample(id); const oldLoc = old.locationId;
    Object.assign(old, payload);
    if (oldLoc !== payload.locationId) state.movements.push({ id: uid("move"), sampleId: old.id, productName: old.name, from: labelLocation(oldLoc), to: labelLocation(payload.locationId), timestamp: new Date().toISOString() });
  } else {
    const newId = `SMP-${String(state.nextSampleNumber || 1).padStart(5, "0")}`;
    state.nextSampleNumber = (state.nextSampleNumber || 1) + 1;
    state.samples.push({ id: newId, ...payload });
  }
  persist(); closeModal(); render(); toast(id ? "Sample updated successfully." : "Sample added to the archive.");
}
function saveLocation(form) {
  const values = Object.fromEntries(new FormData(form).entries()); const name = values.name.trim();
  if (!name) return formError(form, "Location name is required.");
  if (state.locations.some((item) => item.name.toLowerCase() === name.toLowerCase())) return formError(form, "This location already exists.");
  state.locations.push({ id: uid("loc"), type: values.type, name }); persist(); closeModal(); render(); toast("Location added to the showroom map.");
}
function saveMove(form) {
  const values = Object.fromEntries(new FormData(form).entries()); const item = sample(form.dataset.id);
  if (!values.locationId) return formError(form, "Choose a new location.");
  if (values.locationId === item.locationId) return formError(form, "Choose a different location to record a move.");
  const before = labelLocation(item.locationId); item.locationId = values.locationId; item.status = "Moved";
  state.movements.push({ id: uid("move"), sampleId: item.id, productName: item.name, from: before, to: labelLocation(item.locationId), timestamp: new Date().toISOString() });
  persist(); closeModal(); render(); toast("Sample moved and history updated.");
}
function deleteSample(id) { const item = sample(id); if (!item) return; state.samples = state.samples.filter((s) => s.id !== id); persist(); closeModal(); render(); toast("Sample deleted successfully."); }
function deleteBuyer(id) { const item = buyer(id); if (!item) return; state.samples = state.samples.filter((s) => s.buyerId !== id); state.buyers = state.buyers.filter((b) => b.id !== id); persist(); closeModal(); render(); toast("Buyer deleted successfully."); }
function downloadBackup() { const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "sample-archive-backup.json"; a.click(); URL.revokeObjectURL(url); toast("Backup downloaded successfully."); }
function restoreBackup(file) { const reader = new FileReader(); reader.onload = () => { try { const restored = JSON.parse(reader.result); if (!Array.isArray(restored.buyers) || !Array.isArray(restored.samples) || !Array.isArray(restored.locations) || !Array.isArray(restored.movements)) throw new Error("Schema"); state = restored; state.nextSampleNumber ||= state.samples.length + 1; persist(); render(); toast("Backup restored successfully."); } catch (_) { toast("That file is not a valid Sample Archive backup.", true); } }; reader.readAsText(file); }

document.addEventListener("click", (event) => {
  const route = event.target.closest("[data-route]"); if (route) { location.hash = route.dataset.route; document.querySelector("#sidebar").classList.remove("open"); return; }
  const actionTarget = event.target.closest("[data-action]"); if (!actionTarget) return;
  const action = actionTarget.dataset.action; const id = actionTarget.dataset.id;
  if (action === "close-modal") { if (event.target === actionTarget || !actionTarget.classList.contains("modal-layer")) closeModal(); }
  if (action === "toggle-menu") document.querySelector("#sidebar").classList.toggle("open");
  if (action === "add-buyer") buyerForm();
  if (action === "edit-buyer") buyerForm(id);
  if (action === "add-sample") sampleForm(null, { buyerId: actionTarget.dataset.buyerId, locationId: actionTarget.dataset.locationId });
  if (action === "edit-sample") sampleForm(id);
  if (action === "add-location") locationForm();
  if (action === "move-sample") moveForm(id);
  if (action === "delete-sample") { const item = sample(id); if (item) confirmModal({ title: "Delete sample?", body: "Are you sure you want to permanently delete this sample? This cannot be undone.", sampleText: `<strong>${escapeHTML(item.name)}</strong><span>${escapeHTML(item.style)} &nbsp; / &nbsp; ${escapeHTML(item.code)}</span>`, confirmText: "Delete Sample", onConfirm: `sample:${id}` }); }
  if (action === "delete-buyer") { const item = buyer(id); if (item) { const count = state.samples.filter((s) => s.buyerId === id).length; confirmModal({ title: "Delete buyer?", body: count ? `This buyer has ${count} sample${count === 1 ? "" : "s"}. Delete buyer and all associated samples?` : "Are you sure you want to delete this buyer?", sampleText: `<strong>${escapeHTML(item.name)}</strong><span>${count ? `${count} associated sample${count === 1 ? "" : "s"}` : "No associated samples"}</span>`, confirmText: count ? "Delete Buyer & Samples" : "Delete Buyer", onConfirm: `buyer:${id}` }); } }
  if (action === "confirm") { const [type, targetId] = actionTarget.dataset.confirm.split(":"); if (type === "sample") deleteSample(targetId); if (type === "buyer") deleteBuyer(targetId); }
  if (action === "backup") downloadBackup();
  if (action === "restore") document.querySelector("#restore-input").click();
});
document.addEventListener("submit", (event) => { if (event.target.id === "buyer-form") { event.preventDefault(); saveBuyer(event.target); } if (event.target.id === "sample-form") { event.preventDefault(); saveSample(event.target); } if (event.target.id === "location-form") { event.preventDefault(); saveLocation(event.target); } if (event.target.id === "move-form") { event.preventDefault(); saveMove(event.target); } });
document.addEventListener("input", (event) => {
  if (event.target.id === "sample-search") { sampleFilter = event.target.value; render(); const input = document.querySelector("#sample-search"); input?.focus(); input?.setSelectionRange(sampleFilter.length, sampleFilter.length); }
  if (event.target.id === "sample-photo") updatePhotoPreview(event.target.value);
  if (event.target.id === "global-search") { const value = event.target.value.trim().toLowerCase(); const results = state.samples.filter((item) => [item.id, item.style, item.code, item.name, item.fabric, item.color, buyer(item.buyerId)?.name].join(" ").toLowerCase().includes(value)).slice(0, 5); const box = document.querySelector("#quick-results"); box.hidden = !value; box.innerHTML = value ? (results.length ? results.map((item) => `<button class="quick-result" data-route="sample/${encodeURIComponent(item.id)}"><strong>${escapeHTML(item.name)}</strong><span>${escapeHTML(item.id)} / ${escapeHTML(buyer(item.buyerId)?.name || "")}</span></button>`).join("") : `<div class="quick-empty">No matching samples found.</div>`) : ""; refreshIcons(); }
});
document.addEventListener("change", (event) => {
  if (event.target.id === "status-filter") { sampleStatus = event.target.value; render(); }
  if (event.target.id === "sample-location-type") updateLocationSelect(event.target.value, "#sample-location");
  if (event.target.id === "move-location-type") updateLocationSelect(event.target.value, "#move-location");
  if (event.target.id === "restore-input" && event.target.files?.[0]) { restoreBackup(event.target.files[0]); event.target.value = ""; }
});
window.addEventListener("hashchange", render);
render();
initialiseAtlas();
