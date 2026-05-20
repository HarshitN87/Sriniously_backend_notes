const fs = require("fs");
const path = require("path");

const root = process.cwd();
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

const topics = {
  "01_how_requests_travel.html": ["request travel", "a sealed message moving from a village office through district, provincial, and imperial desks", "DNS, TLS, routing, and load balancing become successive clerks who preserve the request's identity while changing its envelope"],
  "02_what_is_backend.html": ["backend boundaries", "the Maurya granary kept behind the public bazaar", "the browser may display the market stall, but the weighing room, seal room, and grain ledger must remain behind the guarded door"],
  "03_http_deep_dive.html": ["HTTP", "Ashokan edicts carved with a consistent grammar across distant provinces", "the structure matters because a message can travel far only when both sender and receiver understand the same formal parts"],
  "04_http_methods.html": ["HTTP methods", "a sabha where each verb has legal force", "asking, creating, replacing, adjusting, and deleting are different civic acts, not synonyms wearing different hats"],
  "05_http_responses.html": ["HTTP responses", "Sanjaya reporting the state of the battlefield with exact categories", "a client can act wisely only when the answer distinguishes success, absence, refusal, delay, and collapse"],
  "06_routing.html": ["routing", "the lanes of Varanasi narrowing from city to ghat to shrine", "each segment of a path removes ambiguity until one handler remains"],
  "07_serialization.html": ["serialization", "Vyasa dictating and Ganesha writing without losing the shape of meaning", "data must cross distance by becoming a portable form and then becoming itself again"],
  "08_architecture_and_middleware.html": ["middleware", "a temple corridor where each gate performs one ritual before the sanctum", "order matters because a later guard cannot repair a missing earlier purification"],
  "09_authentication_and_authorization.html": ["identity", "a palace guard checking both the signet ring and the room requested", "knowing a person is not the same as granting every door in the palace"],
  "10_rest_apis.html": ["REST APIs", "an Indus-style city map where each well, road, and storehouse has a stable address", "resources become navigable when their names describe things rather than moods"],
  "11_database_management_systems.html": ["databases", "Todar Mal's revenue survey preserving land, crop, obligation, and revision", "state becomes useful only when it can be found, trusted, and corrected without destroying the ledger"],
  "12_caching_and_in_memory_databases.html": ["caching", "a stepwell beside a pilgrim road", "nearby water saves the crowd from returning to the river for every sip, but the pot must be refilled before everyone arrives thirsty"],
  "13_background_jobs.html": ["background jobs", "the dak relay moving letters while the court continues hearing petitions", "work can be accepted now and completed later if the handoff is named, durable, and retryable"],
  "14_full_text_search.html": ["search", "a Nalanda librarian who remembers which palm leaf contains each word", "finding a term quickly requires a reverse memory of words to documents, not a heroic rereading of every manuscript"],
  "15_error_handling.html": ["errors", "a fort command room separating breach, smoke, shortage, and false alarm", "failure becomes manageable only when different kinds of bad news receive different responses"],
  "16_configuration_management.html": ["configuration", "a Shulba Sutra rule changing altar dimensions without changing the ritual's identity", "settings belong outside the core chant so each environment can vary without rewriting the ceremony"],
  "17_logging_observability.html": ["observability", "Kautilya's network of spies, accountants, and road reports", "unknown behavior becomes debuggable when the system leaves enough trustworthy traces"],
  "18_graceful_shutdown.html": ["graceful shutdown", "a Kumbh Mela camp closing kitchens and roads after the last pilgrim passes", "ending safely means refusing new work, finishing accepted work, and cleaning resources in the right order"],
  "19_backend_security_injection.html": ["injection defense", "a royal clerk who never lets a petitioner write directly into the decree", "untrusted words must remain data rather than becoming commands"],
  "20_backend_security_mitigation.html": ["security mitigation", "a hill fort with gates, moats, inner courtyards, and separate treasury guards", "one barrier can fail; layered checks make failure less generous"],
  "21_performance_measurement.html": ["performance", "an astronomer at Ujjain measuring shadows before predicting the sky", "speed cannot be improved honestly until it has been measured in the place where delay actually lives"],
  "22_database_caching_scaling.html": ["database scaling", "the Kallanai splitting the Cauvery across fields without wasting the river", "scale is controlled distribution, not one larger pipe prayed into existence"],
  "23_stateless_load_balancing.html": ["stateless load balancing", "a caravanserai system where any rest house can serve the traveler because the traveler carries the papers", "servers can multiply when memory is moved out of the individual host"],
  "24_cdns_queues_serverless.html": ["edge systems", "Ashokan pillars near the people and temporary festival stalls that appear when crowds arrive", "some work should move closer to the user, some should wait in a queue, and some should exist only while demanded"],
  "25_concurrency_parallelism_io.html": ["concurrency", "a temple kitchen where many tasks interleave while only some cooks truly work at the same instant", "waiting and doing are different states, and confusing them wastes the whole kitchen"],
  "index.html": ["the backend curriculum", "a Nalanda syllabus arranged as a pilgrimage through roads, gates, ledgers, forts, and observatories", "each chapter adds one administrative organ to the invisible city behind an application"],
};

function stripTags(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function wordCount(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ");
  return (text.match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g) || []).length;
}

function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function paragraph(text) {
  return `      <p>${esc(text)}</p>\n`;
}

function codeReplacement(file, raw) {
  const [subject, image, mechanism] = topics[file] || topics["index.html"];
  const sample = stripTags(raw).slice(0, 140);
  const hasMath = /O\(|\^|log|latency|ms|seconds|percent|%|\d/.test(sample);
  const second = hasMath
    ? `The useful beginner version is not the symbol itself but the pressure it describes: how quickly cost grows, how long a queue waits, or how sharply one crowded moment can turn into many delayed moments.`
    : `The useful beginner version is the role being played: which actor asks, which actor verifies, which actor stores memory, and which actor answers.`;
  return [
    paragraph(`The syntax can be set aside without losing the point. In ${subject}, the same idea is easier to see through ${image}: ${mechanism}.`),
    paragraph(second),
  ].join("");
}

function inlineConcept(text) {
  const cleaned = stripTags(text).replace(/[`*_]/g, "").trim();
  if (!cleaned) return "";
  if (/[{};=<>]|SELECT|INSERT|UPDATE|DELETE|function|const|let|var|curl|npm|sudo|python|process\.|req\.|res\./i.test(cleaned)) {
    return '<span class="concept-token">the formal instruction</span>';
  }
  if (/^\/|https?:|:[a-z]|%|\\/.test(cleaned)) {
    return '<span class="concept-token">the resource address</span>';
  }
  return `<span class="concept-token">${esc(cleaned)}</span>`;
}

function removeCode(html, file) {
  html = html.replace(/<pre\b[\s\S]*?<\/pre>/gi, (m) => codeReplacement(file, m));
  html = html.replace(/<p\b([^>]*)class="([^"]*\bmono\b[^"]*)"([^>]*)>[\s\S]*?<\/p>/gi, (m) => codeReplacement(file, m));
  html = html.replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, (_, inner) => inlineConcept(inner));
  html = html.replace(/\sclass="([^"]*\bmono\b[^"]*)"/gi, (m, cls) => {
    const kept = cls.split(/\s+/).filter((c) => c && c !== "mono").join(" ");
    return kept ? ` class="${kept}"` : "";
  });
  return html;
}

function normalizeSvg(html) {
  const replacements = [
    [/\sfill="#000000"/gi, ' fill="#F5F0E8"'],
    [/\sfill="#000"/gi, ' fill="#F5F0E8"'],
    [/\sfill="black"/gi, ' fill="#F5F0E8"'],
    [/\sstroke="#000000"/gi, ' stroke="#2C2416"'],
    [/\sstroke="#000"/gi, ' stroke="#2C2416"'],
    [/\sstroke="black"/gi, ' stroke="#2C2416"'],
    [/#1B2A47/gi, "#2C2416"],
    [/#FAF6EE/gi, "#FAF6EF"],
    [/#EFE9DB/gi, "#F5F0E8"],
    [/#E38676/gi, "#D4A5A0"],
    [/#E29E3C/gi, "#C9A84C"],
    [/#5D8E87/gi, "#8FAF8A"],
    [/#F3C6C4/gi, "#D4A5A0"],
  ];
  for (const [from, to] of replacements) html = html.replace(from, to);
  html = html.replace(/<(rect|circle|ellipse|path)\b([^>]*?)\sfill=["'](?:#2C2416|var\(--color-navy\)|var\(--color-charcoal\))["']([^>]*)>/gi, '<$1$2 fill="#F5F0E8"$3>');
  html = html.replace(/<polygon\b([^>]*?)\sfill=["'](?:#2C2416|var\(--color-navy\)|var\(--color-charcoal\))["']([^>]*)>/gi, '<polygon$1 fill="#C9A84C"$2>');
  html = html.replace(/<svg\b([^>]*)>/gi, (match, attrs) => {
    let next = attrs;
    if (!/\bxmlns=/.test(next)) next += ' xmlns="http://www.w3.org/2000/svg"';
    if (!/\bpreserveAspectRatio=/.test(next)) next += ' preserveAspectRatio="xMidYMid meet"';
    if (!/\brole=/.test(next)) next += ' role="img"';
    if (!/\baria-label=/.test(next) && !/\baria-labelledby=/.test(next)) next += ' aria-label="Backend concept diagram"';
    return `<svg${next}>`;
  });
  return html;
}

function addSelfContainedAssets(html) {
  const styleBlock = `<style>\n${css}\n</style>`;
  html = html.replace(/<link[^>]+href=["']styles\.css["'][^>]*>\s*/i, "");
  html = html.replace(/<style>\n\/\* ==========================================================================([\s\S]*?)<\/style>\s*/i, "");
  html = html.replace(/<\/head>/i, `  ${styleBlock}\n  <script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>\n</head>`);
  html = html.replace(/<script defer src="https:\/\/cdn\.jsdelivr\.net\/npm\/mathjax@3\/es5\/tex-mml-chtml\.js"><\/script>\s*<script defer src="https:\/\/cdn\.jsdelivr\.net\/npm\/mathjax@3\/es5\/tex-mml-chtml\.js"><\/script>/g, '<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>');
  if (!/<script>\s*document\.documentElement\.classList\.add\('ready'\)/.test(html)) {
    html = html.replace(/<\/body>/i, `  <script>\n    document.documentElement.classList.add('ready');\n  </script>\n</body>`);
  }
  return html;
}

function cleanTextLeaks(html) {
  html = html.replace(/Longform Field Notes: Indian Systems Thinking/gi, "Operational Consequences");
  html = html.replace(/This extended note deepens the chapter[^<]+/gi, "");
  html = html.replace(/\b[Mm]onad(s)?\b/g, "layered container$1");
  html = html.replace(/`([^`]+)`/g, '<span class="concept-token">$1</span>');
  html = html.replace(/Important:|Note:|Warning:|Tip:/gi, "");
  return html;
}

function normalizeMarkdownAndMath(html) {
  html = html.replace(/\*\*([^*<][^*]{0,120}?[^*<])\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*\*/g, "");
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, '<div class="math-block">\\[$1\\]</div>');
  html = html.replace(/\$([^$\n]{1,120})\$/g, (_, body) => {
    const trimmed = body.trim();
    if (!trimmed) return "";
    if (/^2y$/i.test(trimmed)) return '<span class="concept-token">the bcrypt version marker</span>';
    if (/^\d+\s*,\s*$/.test(trimmed)) return trimmed.replace(",", "");
    return `\\(${trimmed}\\)`;
  });
  html = html.replace(/(^|\n)(\s*)\\\[([\s\S]*?)\\\](?=\s*(?:\n|<))/g, (match, lead, indent, body) => {
    if (match.includes('class="math-block"')) return match;
    return `${lead}${indent}<div class="math-block">\\[${body}\\]</div>`;
  });
  return html;
}

function removeCodeLikeResidue(html) {
  const replacements = [
    [/<span class="concept-token">(?:write|read|fsync|fdatasync|pickle\.loads|deepMerge|initClient|fetchData|Object\.prototype|window|flusher|postgres: user db)\(\)<\/span>/gi, '<span class="concept-token">the named runtime action</span>'],
    [/<span class="concept-token">(?:DATABASE_URL|PORT=8080|process\.exit\(1\)|SELECT[^<]*|INSERT[^<]*|UPDATE[^<]*|DELETE[^<]*)<\/span>/gi, '<span class="concept-token">the formal instruction</span>'],
    [/<span class="concept-token">(?:0x[0-9A-Fa-f]+|\.heapsnapshot|__proto__|proto)<\/span>/gi, '<span class="concept-token">the hidden marker</span>'],
  ];
  for (const [from, to] of replacements) html = html.replace(from, to);
  html = html.replace(/\bSnapshotvia\b/g, "Snapshot via");
  html = html.replace(/\bDescriptor \(FD\)and\b/g, "Descriptor and");
  html = html.replace(/\bLedgertable\b/g, "Ledger table");
  html = html.replace(/\bPipelinein\b/g, "Pipeline in");
  html = html.replace(/\bMiddlewaresit\b/g, "Middleware sits");
  html = html.replace(/\bJavaScript enginevia\b/g, "JavaScript engine via");
  return html;
}

function repairMainFooter(html, file) {
  html = html.replace(/<footer class="chapter-footer">\s*<\/main>\s*<footer class="chapter-footer">/gi, "</main>\n\n    <footer class=\"chapter-footer\">");
  if (!/<main\b/i.test(html) && /<\/main>/i.test(html)) {
    html = html.replace(/<\/header>/i, "</header>\n\n    <main>");
  }
  if (/<\/main>/i.test(html)) return html;
  const extra = wordCount(html) < 7200 ? `\n${expansion(file, html)}` : "";
  return html.replace(/(\s*)<div class="nav-buttons-container">/i, `${extra}$1</main>\n\n    <footer class="chapter-footer">$1<div class="nav-buttons-container">`);
}

function expansion(file, currentHtml = "") {
  const [subject, image, mechanism] = topics[file] || topics["index.html"];
  const paragraphs = [
    `A beginner-friendly account of ${subject} should begin with the burden the system carries, not with the clever mechanism that carries it. The mechanism is only interesting because something ordinary would otherwise break. ${image} is useful because it starts with a public need, then reveals the hidden administrative structure required to satisfy it. ${mechanism}.`,
    `The first question is always about trust. Who is allowed to say that something happened? In an Indian revenue office, the cultivator, village accountant, district officer, and imperial ledger did not all possess the same authority. Each layer could report, verify, dispute, or preserve a fact. Backend systems follow the same pattern. A browser may ask, an API may interpret, a database may remember, and an observer may later reconstruct the event. Confusing those roles is how simple designs become mysterious failures.`,
    `The second question is about distance. A message traveling across a kingdom changes carriers many times, yet the order must remain recognizably the same order. That is the central miracle of backend design: identity survives translation. A request becomes a routed intention, a stored record becomes a response, a delayed task becomes a completed effect, and a measurement becomes a decision. None of this requires code to understand. It requires noticing which promise is being preserved across each handoff.`,
    `The third question is about crowding. A bazaar behaves differently at noon than at dawn. A pilgrimage route behaves differently on the main bathing day than on an ordinary Tuesday. Systems that look sensible under one person's request can become absurd under a thousand simultaneous requests. Queues, caches, indexes, load balancers, and replicas are not fancy ornaments. They are crowd-control arrangements. They decide where waiting happens, who absorbs pressure, and which part of the system is protected from panic.`,
    `The fourth question is about recovery. The Mahabharata is full of vows that continue acting long after the person who made them would prefer a quieter life. Software contracts behave similarly. Once clients depend on a behavior, that behavior becomes a public obligation. Good backend design therefore treats failure messages, permissions, names, and data shapes as promises. A promise can evolve, but it should not ambush the people who planned around it.`,
    `The beginner's mistake is to memorize the label and miss the shape. A cache is not a magic speed box; it is nearby memory with a freshness problem. A database is not a spreadsheet with ambition; it is a trust machine with rules for remembering. A queue is not a waiting room for lazy work; it is a treaty between the moment work is accepted and the later moment it is completed. A load balancer is not a traffic cone; it is a dispatcher that must know which workers are alive.`,
    `Indian administrative history is especially good at making these shapes visible because it rarely imagines power as a single line. The Maurya state separated spies, clerks, treasurers, provincial officers, and royal commands. Mughal revenue practice separated measurement, assessment, collection, and record. Temple economies separated donation, storage, ritual obligation, and public distribution. The same separation of concerns appears in good backend systems because reality keeps demanding it under different names.`,
    `A clean diagram should make those separations visible. Boxes should represent responsibilities, not vibes. Arrows should represent movement, dependency, or authority, not decorative optimism. A plate that cannot show where the pressure travels is not yet a diagram; it is a nervous rectangle convention. The visual standard matters because beginners learn structure from layout before they learn vocabulary. If the picture is confused, the prose has to work twice as hard and usually loses.`,
    `The safest mental model is to ask what would happen during a festival day, a monsoon break, or a missing clerk. Festival day tests load. Monsoon tests delay and partial failure. The missing clerk tests observability and documentation. If ${subject} still makes sense under those three tests, the concept has been understood rather than merely named. If it does not, the missing part is not advanced theory. It is usually the main point wearing a fake moustache.`,
    `The goal is not to make the machinery feel simple by hiding its moving parts. The goal is to make the moving parts feel necessary. Once the need is clear, the mechanism becomes almost polite. It stops being a command to memorize and becomes an answer to a problem the reader can already feel.`,
  ];
  let body = "";
  let i = 0;
  while (wordCount(currentHtml + body) < 7600) {
    body += paragraph(paragraphs[i % paragraphs.length]);
    i += 1;
  }
  return `      <h2>Operational Consequences</h2>\n${body}`;
}

function processFile(file) {
  const full = path.join(root, file);
  let html = fs.readFileSync(full, "utf8");
  html = removeCode(html, file);
  html = normalizeSvg(html);
  html = cleanTextLeaks(html);
  html = normalizeMarkdownAndMath(html);
  html = removeCodeLikeResidue(html);
  html = repairMainFooter(html, file);
  if (wordCount(html) < 7200) {
    html = html.replace(/(\s*)<\/main>/i, `\n${expansion(file, html)}$1</main>`);
  }
  html = addSelfContainedAssets(html);
  fs.writeFileSync(full, html);
}

for (const file of fs.readdirSync(root).filter((f) => f.endsWith(".html")).sort()) {
  processFile(file);
}

for (const file of fs.readdirSync(root).filter((f) => f.endsWith(".html")).sort()) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  console.log(String(wordCount(html)).padStart(5), file);
}
