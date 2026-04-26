# 📡 Chapter 1: How Does a Request Travel on the Internet?

> *"Every click you make on the internet triggers a fascinating chain of events spanning thousands of miles in milliseconds."*

---

## 🎯 The Big Picture

When you tap the heart button on an Instagram post, the interaction feels instant — almost magical. But behind that single tap lies one of the most intricate engineering achievements in human history. Your request doesn't just teleport to Instagram's servers and back. Instead, it embarks on a journey that involves domain name resolution, reliable transport connections, cryptographic handshakes, load balancing across data centers, application logic execution, database writes, and a return trip through the same chain of infrastructure. All of this happens in roughly 50 to 200 milliseconds, which is faster than a human blink.

To understand backend development, you need to understand this journey. Every concept we study in later chapters — HTTP, routing, serialization, status codes — is just one piece of this bigger picture. This chapter traces the complete path of a single request, from the moment your finger touches the screen to the moment the heart icon turns red.

---

## 🌍 A Brief History: How We Got Here

The story begins in the late 1960s with **ARPANET**, a project funded by the United States Department of Defense's Advanced Research Projects Agency. The idea was to build a network where multiple computers could communicate, even if some nodes were destroyed — a concern driven by Cold War anxieties. On October 29, 1969, the first message was sent over ARPANET from UCLA to Stanford — the word "LOGIN," though only "LO" made it through before the system crashed. Despite that inauspicious start, the fundamental concept worked: computers could talk to each other over long distances.

Throughout the 1970s and 1980s, researchers developed the foundational protocols that still power the internet today. **Vint Cerf** and **Bob Kahn** designed **TCP/IP** in 1974, creating a universal language that allowed different networks to interconnect — hence the name "inter-net." By 1983, ARPANET had fully adopted TCP/IP, and the modern internet was born in principle. Then in 1989, **Tim Berners-Lee** at CERN proposed the World Wide Web — a system of interlinked hypertext documents accessed via the internet. He built the first web browser, the first web server, and wrote the first version of HTTP. The web went public in 1991, and within a few years, the explosion of websites and browsers transformed the internet from an academic curiosity into the backbone of modern civilization.

Today, when your Instagram like request travels from your phone to a data center, it traverses this entire stack of inventions — DNS, TCP/IP, TLS encryption, HTTP messaging — each layer built on decades of research.

---

## 🔬 Step-by-Step: The Journey of an Instagram "Like"

### Step 1: The Click Event (Your Device)

Everything begins on your device. When you tap the heart icon on an Instagram post, the app's code — whether it's JavaScript running in a browser or Swift/Kotlin running natively on your phone — captures that tap as an event. The app then constructs an **HTTP request**, which is a structured message that encodes your intent in a format that servers can understand. This request includes a URL that identifies the resource (`https://api.instagram.com/v1/posts/928374/like`), a method that describes the action (`POST`, because you're creating a new "like"), headers that carry metadata like your authentication token, and a body that holds any additional data the server needs.

At this point, the request exists only as a data structure in your device's memory. It hasn't gone anywhere yet. Your device now needs to figure out where to send it — and that starts with translating the human-readable domain name into a machine-readable IP address.

```http
POST /v1/posts/928374/like HTTP/1.1
Host: api.instagram.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
User-Agent: Instagram/285.0 (iPhone; iOS 17.4)

{
  "user_id": "harshit_87",
  "action": "like"
}
```

---

### Step 2: DNS Resolution (Finding the Address)

Your device knows it needs to reach `api.instagram.com`, but computers don't route traffic using human-readable names — they use numerical **IP addresses** like `157.240.1.35`. The process of translating a domain name into an IP address is called **DNS resolution**, and it involves one of the oldest and most critical systems on the internet.

#### The Historical Context: From HOSTS.TXT to Hierarchical DNS

In the earliest days of the internet, name-to-address mapping was laughably simple. A single file called `HOSTS.TXT` was maintained at the Stanford Research Institute. Every computer on the network would periodically download this file, which contained a flat list of every hostname and its corresponding address. This worked fine when ARPANET had a few dozen hosts, but by the early 1980s, the network was growing so fast that the file was constantly out of date, name collisions were common, and the bandwidth consumed by everyone downloading the ever-growing file was becoming absurd.

In 1983, **Paul Mockapetris** published RFCs 882 and 883, which defined the **Domain Name System** as we know it today. Instead of one centralized file, DNS introduced a hierarchical, distributed database. The domain namespace was organized into a tree structure — root servers at the top, then top-level domains (`.com`, `.org`, `.net`), then authoritative servers for each specific domain. This design was brilliantly scalable: no single server needed to know everything, and each level of the hierarchy only needed to know how to point you to the next level down.

#### How DNS Resolution Works Today

When your device needs to resolve `api.instagram.com`, it follows a chain of lookups that cascades through this hierarchy. First, it checks its own **browser cache** — if you've visited Instagram recently, the answer might already be stored locally. If not, it checks the **operating system's DNS cache**. If that also misses, the request goes to your **ISP's recursive DNS resolver**, which is a server whose entire job is to resolve domain names on behalf of its customers. If the ISP's resolver doesn't have the answer cached either, it walks down the DNS hierarchy: asking a root server where `.com` lives, then asking the `.com` TLD server where `instagram.com` lives, and finally asking Instagram's authoritative DNS server for the actual IP address.

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#e3f2fd',
    'primaryTextColor': '#0d47a1',
    'primaryBorderColor': '#1976d2',
    'lineColor': '#455a64',
    'secondaryColor': '#f1f8e9',
    'tertiaryColor': '#fff3e0',
    'fontSize': '14px',
    'fontFamily': 'verdana'
  }
} }%%

flowchart LR
    %% Logical Grouping for Environmental Context
    subgraph Client ["💻 Local Client Environment"]
        direction LR
        A["🖥️ Your Device"]
        B[("📁 Browser Cache")]
        C[("📁 OS Cache")]
    end

    subgraph ISP_Layer ["🏢 Service Provider"]
        D{"🔍 ISP DNS Resolver"}
    end

    subgraph Global_DNS ["🌍 Global DNS Hierarchy"]
        direction TB
        E["👑 Root DNS Server"]
        F["🌐 TLD DNS Server (.com)"]
        G["🏠 Authoritative DNS"]
    end

    %% Step-by-Step Resolution Path
    A -->|"1. api.instagram.com?"| B
    B -->|"2. Cache Miss"| C
    C -->|"3. Cache Miss"| D

    %% Recursive Query Logic
    D -.->|"4. Query Root"| E
    E -.->|"5. Referral: .com"| F
    F -.->|"6. Referral: Instagram"| G

    %% Final Resolution Path
    G ==>|"7. A Record Found"| D
    D ==>|"8. IP: 157.240.1.35"| A

    %% Professional Styling Classes
    classDef clientNode fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#0d47a1;
    classDef ispNode fill:#f1f8e9,stroke:#689f38,stroke-width:2px,color:#33691e;
    classDef globalNode fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#e65100;

    class A,B,C clientNode;
    class D ispNode;
    class E,F,G globalNode;
```

The beauty of this system is caching. Each layer caches the answer for a configurable duration called the **TTL (Time To Live)**, set by the domain owner. This means the full recursive lookup only happens on the first request — subsequent requests hit the cache and resolve almost instantly. On a cache miss, DNS resolution typically takes 20 to 120 milliseconds. On a cache hit, it's nearly instantaneous.

> [!NOTE]
> There are 13 root DNS server clusters in the world (labeled A through M), but thanks to **anycast routing**, they're replicated across hundreds of physical locations globally. When your ISP's resolver contacts a "root server," it's actually reaching the nearest physical copy.

---

### Step 3: TCP Connection (The Handshake)

Now that your device knows Instagram's IP address, it needs to establish a reliable connection. HTTP runs on top of **TCP (Transmission Control Protocol)**, which guarantees data arrives completely, correctly, and in order. TCP was designed by **Vint Cerf** and **Bob Kahn** in 1974 as part of the original TCP/IP suite. Its core promise is powerful: if a packet gets lost, TCP detects the loss and retransmits it. If packets arrive out of order, TCP reassembles them correctly before handing data to the application.

The setup process is called the **three-way handshake**. Your device sends a **SYN** (synchronize) packet, saying "I'd like to start a conversation." The server responds with a **SYN-ACK**, saying "I heard you and I'm ready too." Your device then sends a final **ACK**, confirming that the connection is live. Only after this handshake completes can your HTTP request actually be transmitted.

```mermaid
sequenceDiagram
    autonumber

    participant C as Your Device
    participant S as Instagram Server

    Note over C, S: TCP 3-Way Handshake Initialization

    C->>+S: SYN (Synchronize)
    Note right of S: Server allocates resources\nInitial Seq No: X

    S-->>-C: SYN-ACK (Sync-Acknowledge)
    Note left of C: Client verifies response\nAck No: X + 1 | Seq No: Y

    C->>S: ACK (Acknowledge)
    Note right of S: Handshake verified\nAck No: Y + 1

    Note over C, S: Connection State: ESTABLISHED
```

> [!IMPORTANT]
> The three-way handshake typically adds about 20–30 milliseconds of latency. This is why modern protocols like **HTTP/2** and **HTTP/3** work hard to minimize new connections — reusing existing connections and multiplexing multiple requests over a single connection saves hundreds of milliseconds on busy page loads.

---

### Step 4: TLS/SSL Handshake (Securing the Connection)

Since Instagram uses `https://`, there's an additional handshake on top of TCP. This is the **TLS (Transport Layer Security)** handshake, which establishes an encrypted channel so that no one between your device and Instagram's server can read or tamper with the data.

The story of web encryption begins at **Netscape Communications** in the mid-1990s. The early web transmitted all HTTP traffic in plain text, meaning anyone intercepting packets could read everything — passwords, credit card numbers, private messages. Netscape engineer **Taher Elgamal** led development of **SSL (Secure Sockets Layer)**, with SSL 2.0 releasing in 1995. SSL 3.0 followed in 1996, and then the IETF took over and rebranded it as **TLS**. TLS 1.0 (1999) was essentially SSL 3.1 with improvements. The latest version, **TLS 1.3** (2018), reduced the handshake from two round trips to just one and removed support for older insecure cipher suites. Today, when people say "SSL," they almost always mean TLS — SSL itself has been deprecated since 2015.

During the TLS handshake, your device and the server negotiate encryption algorithms, the server proves its identity via a digital certificate from a trusted Certificate Authority, and both sides generate a shared session key for encrypting all subsequent communication.

```mermaid
sequenceDiagram
    participant C as 🖥️ Client
    participant S as 🖧 Server

    C->>S: ClientHello (supported cipher suites, TLS version)
    S->>C: ServerHello (chosen cipher suite, digital certificate)
    Note left of C: Client verifies certificate<br/>against Certificate Authority
    C->>S: Key Exchange (pre-master secret encrypted with server's public key)
    Note over C,S: Both derive session keys
    C->>S: Finished (encrypted with session key)
    S->>C: Finished (encrypted with session key)
    Note over C,S: 🔒 Secure channel established!
```

After TLS completes, **every single byte** between your device and Instagram is encrypted. HTTPS adoption has gone from about 30% of web traffic in 2014 to over 95% today — encryption is now the baseline expectation, not a luxury.

---

### Step 5: The HTTP Request Flies Over the Wire

With DNS resolved, TCP connected, and TLS secured, your device finally sends the actual HTTP request through the encrypted tunnel. The request is serialized into bytes, encrypted by TLS, packaged into TCP segments, wrapped in IP packets, and transmitted as physical signals.

Those signals might travel as **electrical impulses through copper cables**, then as **light pulses through fiber optic cables** spanning continents, and potentially as **radio waves through cellular towers** if you're on mobile. The speed of light in fiber (about 200,000 km/s) means physical transit is only a few tens of milliseconds even intercontinentally. The real latency comes from routing delays, queuing at congested links, and the handshake overheads we discussed above.

---

### Step 6: Load Balancer (Traffic Distribution)

Your request doesn't arrive directly at an application server. It first hits a **load balancer** that distributes incoming traffic across a fleet of servers. Instagram handles billions of requests per day, and no single server could process all of them.

Load balancing has evolved significantly since the early web. In the 1990s, simple DNS-based round-robin was the most common approach — returning a different IP for each request. This was crude and had no awareness of server health or load. Modern load balancers (NGINX, HAProxy, cloud-native solutions like AWS ALB) monitor each backend server's health and current load in real time, routing requests intelligently and taking failed servers out of rotation automatically.

```mermaid
flowchart LR
    A["📨 Your Request"] --> LB["⚖️ Load Balancer"]
    LB --> S1["🖧 Server 1 (40% load)"]
    LB --> S2["🖧 Server 2 (65% load)"]
    LB --> S3["🖧 Server 3 (20% load) ✅"]
    LB --> S4["🖧 Server 4 (55% load)"]

    style S3 fill:#0d9,stroke:#0d9
```

---

### Step 7: Application Server (Processing the Request)

The application server receives your request and runs it through a pipeline of logic. First, **authentication** — verifying your JWT token is valid. Then **authorization** — checking you're allowed to like posts. Then the **business logic** — checking if you've already liked this post, inserting the like record into the database, updating the cached like count in Redis, and triggering a push notification to the post owner. Finally, the server constructs and sends the HTTP response.

```mermaid
flowchart TD
    A["📨 Incoming Request"] --> B["🔐 Authentication<br/>Verify JWT token"]
    B --> C["✅ Authorization<br/>Can this user like posts?"]
    C --> D["📝 Business Logic<br/>Process the like action"]
    D --> E["💾 Database Query<br/>INSERT INTO likes..."]
    E --> F["📊 Update Counters<br/>Increment like count"]
    F --> G["📤 Send Response<br/>200 OK"]
```

---

### Step 8: Database Interaction

The server communicates with a **database** to persist the like. Modern applications use a combination of relational databases (PostgreSQL, MySQL) for structured data, key-value stores (Redis) for caching, and sometimes specialized databases (Cassandra, DynamoDB) for massive-scale workloads. Database interaction typically takes 5 to 15 milliseconds.

```sql
-- Check if already liked
SELECT * FROM likes WHERE user_id = 'harshit_87' AND post_id = 928374;

-- If not liked, insert
INSERT INTO likes (user_id, post_id, created_at) 
VALUES ('harshit_87', 928374, NOW());

-- Update like count
UPDATE posts SET like_count = like_count + 1 WHERE id = 928374;
```

---

### Step 9: The Response Travels Back

The server constructs an HTTP response and sends it back through the same TCP connection. The response travels the reverse path: server → load balancer → internet backbone → ISP → your router → your device.

```http
HTTP/1.1 200 OK
Content-Type: application/json
X-Request-Id: abc-123-def

{
  "status": "success",
  "liked": true,
  "total_likes": 4829
}
```

---

### Step 10: UI Update (The Heart Turns Red ❤️)

Your app receives the `200 OK` response, parses the JSON body, and updates the UI. The heart animates from 🤍 to ❤️ and the counter increments from `4,828` to `4,829`. Total time: roughly 50–200 milliseconds.

In practice, most modern apps use **optimistic UI updating** — changing the heart to red *immediately* when you tap it, and only reverting if the server responds with an error. This makes the interaction feel instant even when the network round trip takes a couple hundred milliseconds.

---

## 📊 Complete Journey Summary

```mermaid
flowchart LR
    A["👆 Tap Like"] --> B["🔍 DNS Lookup<br/>~20ms"]
    B --> C["🤝 TCP Handshake<br/>~30ms"]
    C --> D["🔒 TLS Handshake<br/>~40ms"]
    D --> E["📨 HTTP Request<br/>~10ms"]
    E --> F["⚖️ Load Balancer<br/>~5ms"]
    F --> G["⚙️ App Server<br/>~30ms"]
    G --> H["💾 Database<br/>~15ms"]
    H --> I["📤 Response<br/>~50ms"]
    I --> J["❤️ UI Update"]
```

> [!TIP]
> The entire round trip typically takes **50–200ms** for well-optimized services. Most of that time is pure physics — the speed of light through fiber optic cables. Software optimizations like DNS caching, connection reuse, and optimistic UI updates all work to shave off every possible millisecond.

---

## 🔑 Key Takeaways

The journey of an HTTP request is a microcosm of the entire internet's architecture. **DNS** translates domain names into IP addresses, using a hierarchical system that replaced the original flat HOSTS.TXT file in 1983. **TCP** provides reliable, ordered delivery through its three-way handshake and retransmission mechanisms — the foundation HTTP trusts to deliver messages intact. **TLS** encrypts all communication, evolving from Netscape's SSL in the 1990s to today's TLS 1.3. **Load balancers** distribute traffic across multiple servers so no single machine is overwhelmed. **Application servers** execute the business logic that turns raw requests into meaningful action. And **databases** persist data durably so it survives restarts and can be shared across the server fleet.

Every subsequent chapter in these notes zooms into one of these layers. Next, we'll explore what "backend" really means and why we can't just put all our logic in the frontend.

---

[Next Chapter → What is Backend? →](./02_What_Is_Backend.md)
