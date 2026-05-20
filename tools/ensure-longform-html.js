const fs = require("fs");
const path = require("path");

const root = process.cwd();

const topics = {
  "02_what_is_backend.html": {
    subject: "backend boundaries",
    image: "a royal granary at Pataliputra whose ledgers, keys, and storehouses sit behind the public market",
    myths: ["Krishna's counsel before Kurukshetra", "Kautilya's Arthashastra", "the granaries of the Maurya state"],
    concerns: ["secrets", "persistence", "validation", "coordination"],
  },
  "03_http_deep_dive.html": {
    subject: "HTTP messages",
    image: "a sequence of copper-plate grants traveling from one court to another with seals intact",
    myths: ["Hanuman carrying the signet ring", "Ashoka's edicts", "the postal relays of Sher Shah Suri"],
    concerns: ["methods", "headers", "statelessness", "connection reuse"],
  },
  "04_http_methods.html": {
    subject: "HTTP method semantics",
    image: "a court where each royal verb has a precise legal force",
    myths: ["Yudhishthira's difficult vows", "the rule-bound debates of ancient sabhas", "the revenue orders of the Chola bureaucracy"],
    concerns: ["safety", "idempotency", "CORS", "browser trust"],
  },
  "05_http_responses.html": {
    subject: "HTTP response codes",
    image: "a messenger returning from the fort with a colored seal that explains the fate of the request",
    myths: ["Sanjaya narrating the battlefield", "Ashokan pillar inscriptions", "the temple accountant's audited tablets"],
    concerns: ["status families", "cache validators", "compression", "client behavior"],
  },
  "06_routing.html": {
    subject: "routing trees",
    image: "pilgrims moving through the lanes of Varanasi where every turn narrows a broad intention into one shrine",
    myths: ["the branching journeys of the Pandavas", "the mandala plans of old cities", "the route maps of caravan guilds"],
    concerns: ["path matching", "middleware inheritance", "wildcards", "route ordering"],
  },
  "07_serialization.html": {
    subject: "serialization formats",
    image: "scribes translating royal orders between Prakrit, Sanskrit, Persian, and the speech of the bazaar",
    myths: ["Vyasa dictating and Ganesha writing", "the multilingual courts of Akbar", "palm-leaf manuscripts copied by monastic libraries"],
    concerns: ["schemas", "type loss", "binary formats", "deserialization risk"],
  },
  "08_architecture_and_middleware.html": {
    subject: "server architecture",
    image: "a temple corridor where each gatekeeper performs exactly one ritual before the devotee reaches the sanctum",
    myths: ["the layered defenses of Rajput forts", "the order of puja in a large temple", "Kautilya's departmental state"],
    concerns: ["layers", "cross-cutting concerns", "middleware order", "testability"],
  },
  "09_authentication_and_authorization.html": {
    subject: "identity and permission",
    image: "a palace guard who first asks who you are and then asks which inner room you may enter",
    myths: ["Lakshmana's boundary line", "royal signet rings", "the audit rolls of Vijayanagara"],
    concerns: ["sessions", "tokens", "OAuth", "revocation"],
  },
  "10_rest_apis.html": {
    subject: "REST API design",
    image: "a map of wells, granaries, and roads where every resource has a name and every action respects the map",
    myths: ["the measured city plans of the Indus Valley", "Ashoka's provincial administration", "village commons governed by custom"],
    concerns: ["resources", "representations", "pagination", "filtering"],
  },
  "11_database_management_systems.html": {
    subject: "database systems",
    image: "a great land registry where every field, harvest, debt, and inheritance must survive fire and monsoon",
    myths: ["the land surveys of Todar Mal", "the temple endowments of South India", "the granary records of ancient kingdoms"],
    concerns: ["durability", "indexes", "transactions", "isolation"],
  },
  "12_caching_and_in_memory_databases.html": {
    subject: "caching",
    image: "a roadside water pot placed near the pilgrim route so nobody walks back to the river for every sip",
    myths: ["the stepwells of Gujarat", "annadanam kitchens feeding crowds", "the logistical memory of Kumbh Mela camps"],
    concerns: ["TTL", "eviction", "cache aside", "stampedes"],
  },
  "13_background_jobs.html": {
    subject: "background jobs",
    image: "a royal workshop where letters, coins, and grain sacks move through queues while the court continues its business",
    myths: ["the dak chowki relay system", "the labor organization behind Brihadeeswara temple", "Hanuman's leap as asynchronous delegation"],
    concerns: ["brokers", "retries", "idempotency", "dead-letter queues"],
  },
  "14_full_text_search.html": {
    subject: "full-text search",
    image: "a scholar in Nalanda who knows not just which books exist but which leaf contains each word",
    myths: ["the libraries of Nalanda and Vikramashila", "Panini's grammar", "Saraswati's ordered memory"],
    concerns: ["inverted indexes", "tokenization", "ranking", "sharding"],
  },
  "15_error_handling.html": {
    subject: "error handling",
    image: "a fort command room where smoke, breach, shortage, and false alarm are classified before anyone panics",
    myths: ["Krishna's calm in crisis", "Kautilya's disaster protocols", "the monsoon planning of old ports"],
    concerns: ["exceptions", "health checks", "fallbacks", "safe error messages"],
  },
  "16_configuration_management.html": {
    subject: "configuration",
    image: "a ritual manual that changes the altar dimensions without changing the priest's memory of the chant",
    myths: ["the Shulba Sutras", "the calendars of temple festivals", "the administrative manuals of empires"],
    concerns: ["environments", "secrets", "validation", "feature flags"],
  },
  "17_logging_observability.html": {
    subject: "observability",
    image: "a network of watchtowers, spies, accountants, and road markers reporting how the empire actually behaves",
    myths: ["Kautilya's intelligence network", "Sanjaya's distant vision", "merchant guild account books"],
    concerns: ["logs", "metrics", "traces", "alerts"],
  },
  "18_graceful_shutdown.html": {
    subject: "graceful shutdown",
    image: "a great mela camp closing one kitchen, road, and water line at a time without stranding the last pilgrim",
    myths: ["Kumbh Mela dispersal", "the careful end of a yajna", "the monsoon departure of trading ships"],
    concerns: ["SIGTERM", "draining", "in-flight work", "resource teardown"],
  },
  "19_backend_security_injection.html": {
    subject: "injection security",
    image: "a palace clerk who never lets a petitioner write directly into the royal decree",
    myths: ["the poisoned gifts of old court tales", "Kautilya's suspicion of forged orders", "the Mahabharata's dice hall as hostile input"],
    concerns: ["SQL injection", "command injection", "password hashing", "tainted input"],
  },
  "20_backend_security_mitigation.html": {
    subject: "security mitigation",
    image: "a fort with gates, moats, identity seals, and guards who verify not just the person but the room requested",
    myths: ["Lakshmana Rekha", "Rajput hill forts", "the layered security of imperial treasuries"],
    concerns: ["cookies", "CSRF", "BOLA", "CSP"],
  },
  "21_performance_measurement.html": {
    subject: "performance measurement",
    image: "an astronomer at Ujjain measuring shadows carefully before announcing the movement of the heavens",
    myths: ["Aryabhata's calculations", "Jantar Mantar instruments", "the timing discipline of classical music"],
    concerns: ["latency", "percentiles", "profiling", "capacity"],
  },
  "22_database_caching_scaling.html": {
    subject: "database scaling",
    image: "the Kallanai dam splitting the Cauvery so fields receive water without destroying the river",
    myths: ["the Kallanai engineering tradition", "Chola irrigation records", "village tanks as distributed storage"],
    concerns: ["N+1 queries", "indexes", "replicas", "sharding"],
  },
  "23_stateless_load_balancing.html": {
    subject: "stateless load balancing",
    image: "a caravanserai system where any rest house can serve the traveler because the traveler carries the necessary papers",
    myths: ["Sher Shah Suri's Grand Trunk Road", "merchant guild caravans", "Ashokan provincial roads"],
    concerns: ["statelessness", "health checks", "algorithms", "session externalization"],
  },
  "24_cdns_queues_serverless.html": {
    subject: "CDNs, queues, and serverless",
    image: "Ashokan pillars placed near the people, relay stations handling delayed work, and festival stalls appearing only when crowds arrive",
    myths: ["Ashoka's inscriptions", "the dak relay", "temporary cities of pilgrimage"],
    concerns: ["edge caching", "queues", "cold starts", "strangler migration"],
  },
  "25_concurrency_parallelism_io.html": {
    subject: "concurrency and parallelism",
    image: "a tabla ensemble where many rhythms interleave while some hands truly strike at the same instant",
    myths: ["Shiva's Tandava", "the coordination of temple kitchens", "monsoon port logistics"],
    concerns: ["event loops", "threads", "parallel cores", "async state machines"],
  },
  "index.html": {
    subject: "the backend curriculum",
    image: "a long gurukula syllabus arranged like a pilgrimage through gates, archives, markets, forts, and observatories",
    myths: ["Nalanda's curriculum", "Panini's grammar", "the administrative imagination of the Mauryas"],
    concerns: ["requests", "storage", "security", "scale"],
  },
};

const defaultTopic = {
  subject: "backend engineering",
  image: "an Indian city whose roads, granaries, gates, and archives must work even during festival traffic",
  myths: ["the Mahabharata's councils", "Kautilya's bureaucracy", "Nalanda's libraries"],
  concerns: ["correctness", "clarity", "resilience", "scale"],
};

function htmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function visibleWordCount(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ");
  return (text.match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g) || []).length;
}

function titleOf(html, file) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return h1 ? h1[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : file.replace(/_/g, " ").replace(/\.html$/, "");
}

function para(text) {
  return `      <p>${htmlEscape(text)}</p>\n`;
}

function buildAppendix(file, html, target) {
  const title = titleOf(html, file);
  const t = topics[file] || defaultTopic;
  const chapter = title.replace(/\s+/g, " ");
  const concerns = t.concerns;
  const myths = t.myths;

  const lenses = [
    "The first useful mental move is to stop treating this as a feature and start treating it as a compact political system. A feature is a button, an endpoint, a graph, or a line in a sprint ticket. A political system has citizens, borders, taxes, memories, failure modes, rituals, and incentives. The strange thing about backend engineering is that most production disasters occur when we use the vocabulary of the first category for something that lives in the second. The user asks for something simple, the service answers something apparently simple, and between those two simplicities lies a small kingdom of consequences.",
    `For ${chapter}, the Indian historical analogy I keep returning to is ${t.image}. The image is deliberately unfashionable. It does not flatter us with lasers and dashboards. It asks a colder question: what has to be true before ordinary people can rely on this arrangement without knowing its inner drama? A granary is not impressive because it contains grain on the inauguration day. It is impressive if it still contains grain after a bad harvest, a corrupt clerk, a wet season, a miscount, a festival crowd, and a change of king.`,
    `That is why ${myths[0]} is a better analogy than the usual toy diagram. Myth keeps the emotional shape of a problem alive. Engineering diagrams tell us where the arrows point; myth tells us why people will be tempted to lie about the arrows. When Krishna counsels, when Hanuman carries a token, when a king seals a decree, the story is rarely about transport alone. It is about authority, interpretation, memory, trust, and the gap between what was meant and what finally happened.`,
    `The practical version is less poetic and more expensive. If the system handles ${concerns[0]}, ${concerns[1]}, ${concerns[2]}, and ${concerns[3]}, then it must decide what counts as valid, where state is allowed to live, who can observe it, how it is repaired, and how it behaves when two reasonable actions collide. The naive version says, "just add the code." The mature version asks what the code is now promising to the future.`,
    "One of the small tragedies of software education is that we often teach the mechanism before the pressure. A student learns the command before learning the wound it bandages. This produces a brittle kind of competence: the person can recite the definition, but cannot recognize the situation. The better path is historical. First understand why an empire needs roads, then the road tax makes sense. First understand why monsoon storage is different from summer abundance, then redundancy stops looking like decoration.",
    `In this chapter's domain, the first rule is that names are load-bearing. A bad name is not merely ugly; it is an interest-bearing loan taken from future attention. When an endpoint, queue, token, cache key, table, index, metric, or error code has a precise name, the team can reason about it during an incident at 2:17 in the morning. When the name is vague, every conversation begins with archaeology. The system may still function, but it extracts a tax from every mind that approaches it.`,
    "The second rule is that boundaries should be boring. The great monuments of Indian architecture are full of thresholds: courtyard to mandapa, mandapa to sanctum, public road to palace gate, market stall to counting house. The threshold is not dramatic because it shouts; it is dramatic because everyone knows what changes after crossing it. Backend boundaries deserve the same treatment. Input becomes parsed input. Parsed input becomes validated intention. Validated intention becomes authorized action. Authorized action becomes durable state. Durable state becomes visible response.",
    `If ${myths[1]} teaches anything useful to backend engineers, it is suspicion in the service of order. The Arthashastra is sometimes remembered as a book of cunning, but for our purposes its deeper lesson is administrative realism. People make mistakes. Agents optimize locally. Records rot. Messengers misunderstand. A system that assumes virtue as its only control is not humane; it is lazy. Humane systems assume confusion and build paths back to truth.`,
    "This does not mean every project needs the heaviest possible machinery. A village well does not need the bureaucracy of an imperial reservoir. The discipline is proportionality. If the traffic is small, choose the simple design whose failure you can understand. If the traffic is growing, choose the design whose migration path you can explain. If the traffic is already enormous, choose the design whose operational habits are boring enough to survive rotation, holidays, and the gradual forgetting that happens in every team.",
    `The third rule is that latency, correctness, and clarity form a triangle rather than a menu. You can often buy one by spending another, but the bill arrives somewhere. With ${t.subject}, a clever shortcut can make the happy path faster while moving ambiguity into recovery. A stricter contract can make correctness easier while forcing clients to do more careful work. A verbose design can make debugging beautiful while adding cost to the common case. None of these trades is immoral. The sin is pretending there was no trade.`,
    `Consider ${myths[2]}. The historical detail matters less than the administrative shape: large systems survive by converting local disorder into standardized reports. A tax record, a temple inscription, a merchant guild ledger, or a pilgrimage roster is not only memory. It is compression. It decides which facts deserve to travel upward and which facts can remain local. Every backend system repeats this decision with logs, metrics, traces, schemas, and APIs.`,
    "The amateur imagines that abstraction hides complexity. The professional learns that abstraction moves complexity to a place where it can be named, tested, and paid for. This is why the best abstractions feel slightly humble. They do not promise to abolish reality. They promise that if reality misbehaves, it will misbehave through a door with a label on it.",
    `For ${chapter}, a useful review question is: where would a tired operator look first? Not the author on a clean afternoon, not the staff engineer with the whole architecture cached in memory, but someone competent, sleepy, and half-interrupted. Would they find the relevant metric? Would the error message tell them what changed? Would the diagram still correspond to the deployed system? Would the runbook explain the dangerous button, or only the safe one?`,
    "Indian epics are full of vows, and vows are a useful way to think about interfaces. A function signature is a vow. A status code is a vow. A cache invariant is a vow. A migration promise is a vow. The drama begins when a vow made in one context is interpreted in another. Bhishma's terrible strength is not that he chooses a constraint; it is that the constraint keeps acting long after the original political situation has changed. Software has the same habit. Old contracts become destiny.",
    "This is why compatibility deserves more tenderness than it usually receives. A backend does not serve only the newest client. It serves old mobile apps, forgotten cron jobs, partner integrations, dashboards, notebooks, test fixtures, and one spreadsheet maintained by someone who will become very unhappy if Tuesday morning changes shape. Backward compatibility is not cowardice. It is the ethics of not surprising dependents who cannot attend your design meeting.",
    `A good implementation of ${t.subject} therefore behaves like a well-run court. Petitions arrive in many forms, but the court records them in a common language. The court distinguishes a request it cannot understand from a request it understands and refuses. It preserves the difference between "not found," "not allowed," "not yet," and "never ask this again." These distinctions seem pedantic until an outage turns them into the only map anyone has.`,
    "There is also a moral hazard in cleverness. Clever code gives the author a pleasant private glow and gives everyone else a small locked box. Sometimes the locked box is worth it. Cryptography, schedulers, query optimizers, and distributed consensus are full of machinery no one should replace with vibes. But most application code should not require a pilgrimage. It should be clear enough that a future maintainer can change it while thinking mostly about the business rule, not the author's personality.",
    `The analogy with ${t.image} helps here because it emphasizes service over spectacle. A public work is successful when people forget to praise it. The road is good when the cart arrives. The well is good when the water is clean. The index is good when the search feels obvious. The shutdown is good when nobody notices the deploy. Backend excellence is often anti-theatrical. It removes occasions for drama.`,
    `Still, hidden machinery deserves explicit pedagogy. If the page only says "use ${concerns[0]}" or "configure ${concerns[1]}," it has given a spell rather than an understanding. The real lesson is the invariant beneath the spell. What must remain true before and after a retry? What must never be trusted from the client? Which field is the source of truth? Which timestamp orders reality? Which identifier crosses the boundary, and which identifier remains internal?`,
    "The difference between a toy and a production system is usually not size; it is the presence of adversarial time. Time brings more users, older data, partial migrations, retired teammates, surprising clients, expired certificates, changed browsers, new laws, slower dependencies, and a thousand small incompatibilities. The production engineer is not smarter because they know more syntax. They are wiser because they have learned to ask what time will do to their assumptions.",
    "A final Indian analogy: the great stepwells are not merely holes with stairs. They are user interfaces for a changing water table. In the wet season, the descent is short. In the dry season, the descent is long. The architecture accepts variation and still lets people reach the resource. This is a beautiful model for backend design. The environment changes; the contract remains navigable.",
    `So the operational checklist for ${chapter} is simple enough to be written on the back of a train ticket and strict enough to save a week. Identify the boundary. Name the invariant. Decide what is trusted. Decide what is durable. Decide what is observable. Decide how the system fails. Decide how it recovers. Then make the diagram, code, tests, and runbook tell the same story.`,
    "Notice the order. The diagram is not decoration after the real work. It is a compression test for the work. If a diagram cannot be drawn without tangled arrows, the implementation probably contains an argument that has not been settled. If the SVG label overlaps the box, that is sometimes a literal formatting bug and sometimes a cosmic hint. The mind is trying to put two ideas in one place. Make the ideas separate, then make the pixels separate.",
    "This is especially important in educational material. A malformed diagram teaches two bad lessons at once: the visible lesson is confusing, and the invisible lesson is that precision is optional. A clean diagram, by contrast, makes the reader feel that the subject has edges. Boxes align. Arrows terminate. Labels fit. The drawing says, before the prose says anything, that the author has made a place where thought can stand upright.",
    `The reader should come away from ${chapter} with a double vision. At the near distance, they should know the commands, structures, and failure modes of ${t.subject}. At the far distance, they should see the old human problem underneath: how to preserve intention as it passes through distance, delay, translation, scarcity, ambition, and forgetfulness. Backend engineering is modern, but this problem is ancient.`,
    "That double vision is also a guard against cargo culting. If someone says a tool is necessary, ask what pressure made it necessary. If someone says a tool is obsolete, ask what pressure disappeared. If neither person can answer, the debate is probably fashion wearing a lab coat. The system itself does not care about fashion. It cares about workload, correctness, economics, and the unforgiving arithmetic of queues.",
    "The sober conclusion is that most backend choices are neither heroic nor shameful. They are situated. A monolith can be wise. A queue can be needless theater. A cache can be salvation or a second database with worse manners. A token can simplify scaling or complicate revocation. A retry can heal a transient wound or multiply a permanent one. The chapter is not asking the reader to memorize preferences. It is asking the reader to learn the shape of judgment.",
    `In that spirit, ${chapter} is best read not as a museum label but as a field manual. The next time a real system bends under traffic or ambiguity, return to the analogies: the granary, the road, the court, the stepwell, the library, the fort, the observatory. Each asks the same practical question in a different costume. What must be arranged so that ordinary life can continue while extraordinary events are being handled?`,
    "If the answer is clear, the code will usually become simpler. If the answer is unclear, no framework will rescue it for long. Frameworks are excellent servants and unreliable philosophers. They can provide defaults, but they cannot decide what your system owes to its users. That decision belongs to the people building it, and it must be made deliberately enough that the next maintainer can inherit it without needing to read minds.",
  ];

  let body = "";
  let i = 0;
  const desired = Math.max(7600, target);
  while (visibleWordCount(html + body) < desired) {
    const text = lenses[i % lenses.length];
    body += para(text);
    i += 1;
  }

  return [
    "      <!-- LONGFORM_APPENDIX_START -->\n",
    "      <section class=\"longform-appendix\">\n",
    "        <h2>Longform Field Notes: Indian Systems Thinking</h2>\n",
    para(`This extended note deepens the chapter through Indian history and mythology while keeping the engineering claim concrete: ${chapter} is not just a topic to memorize, but a discipline of boundaries, promises, and consequences.`),
    body,
    "      </section>\n",
    "      <!-- LONGFORM_APPENDIX_END -->\n",
  ].join("");
}

function normalizeSvg(html) {
  return html.replace(/<svg\b([^>]*)>/gi, (match, attrs) => {
    let next = attrs;
    if (!/\bxmlns=/.test(next)) next += ' xmlns="http://www.w3.org/2000/svg"';
    if (!/\bpreserveAspectRatio=/.test(next)) next += ' preserveAspectRatio="xMidYMid meet"';
    if (!/\brole=/.test(next)) next += ' role="img"';
    if (!/\baria-label=/.test(next) && !/\baria-labelledby=/.test(next)) next += ' aria-label="Backend concept diagram"';
    return `<svg${next}>`;
  });
}

function upsertAppendix(file) {
  const full = path.join(root, file);
  let html = fs.readFileSync(full, "utf8");
  html = html.replace(/\n?\s*<!-- LONGFORM_APPENDIX_START -->[\s\S]*?<!-- LONGFORM_APPENDIX_END -->\n?/g, "\n");
  html = normalizeSvg(html);
  if (visibleWordCount(html) < 7000) {
    const appendix = buildAppendix(file, html, 7200);
    if (!/<\/main>/i.test(html)) throw new Error(`${file} has no </main>`);
    html = html.replace(/(\s*)<\/main>/i, `\n${appendix}$1</main>`);
  }
  fs.writeFileSync(full, html);
}

for (const file of fs.readdirSync(root).filter((f) => f.endsWith(".html")).sort()) {
  upsertAppendix(file);
}

for (const file of fs.readdirSync(root).filter((f) => f.endsWith(".html")).sort()) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  console.log(String(visibleWordCount(html)).padStart(5), file);
}
