// Static page generator for Graspins Innovations.
// Generates: services, case-studies, contact, documentation, support,
// blog index + blog posts, and the fuzzy 404 page.
// Keeps the shared nav/footer DRY. Run: npm run build:pages
import { writeFile, mkdir } from "node:fs/promises";

const SITE = "https://graspins.com";

// ---------------------------------------------------------------- nav / footer
const navLinks = [
  ["/", "Home", "home"],
  ["/services", "Services", "services"],
  ["/case-studies", "Case Studies", "case-studies"],
  ["/blog", "Blog", "blog"],
  ["/about", "About", "about"],
  ["/contact", "Contact", "contact"],
];

const nav = (active) => {
  const desktop = navLinks
    .map(([href, label, key], i) => {
      const mr = i === navLinks.length - 1 ? "mr-0" : "mr-10";
      const color = key === active ? "text-secondary" : "text-white";
      return `<li class="font-poppins font-normal cursor-pointer text-[16px] ${mr} ${color}"><a href="${href}">${label}</a></li>`;
    })
    .join("\n            ");
  const mobile = navLinks
    .map(([href, label, key], i) => {
      const mb = i === navLinks.length - 1 ? "mr-0" : "mb-4";
      const color = key === active ? "text-secondary" : "text-white";
      return `<li class="font-poppins font-normal cursor-pointer text-[16px] ${mb} ${color}"><a href="${href}">${label}</a></li>`;
    })
    .join("\n                ");
  return `    <div class="sm:px-16 px-6 flex justify-center items-center">
      <div class="xl:max-w-[1280px] w-full">
        <nav class="w-full flex py-6 justify-between items-center navbar">
          <a href="/">
            <img src="/assets/logo.webp" alt="Graspins Innovations" class="w-[200px] h-[60px] object-contain cursor-pointer" />
          </a>
          <ul class="list-none sm:flex hidden justify-end items-center flex-1">
            ${desktop}
          </ul>
          <div class="sm:hidden flex flex-1 justify-end items-center">
            <button id="menu-toggle" aria-label="Toggle menu" class="bg-transparent border-0 p-0 cursor-pointer">
              <img id="menu-icon" src="/assets/menu.svg" alt="" class="w-[28px] h-[28px] object-contain" />
            </button>
            <div id="mobile-menu" class="hidden p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[160px] rounded-xl sidebar z-10">
              <ul class="list-none flex flex-col justify-end items-center flex-1">
                ${mobile}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>`;
};

const footer = `    <div class="bg-primary sm:px-16 px-6 flex justify-center items-start">
      <div class="xl:max-w-[1280px] w-full">
        <section class="flex justify-center items-center sm:py-16 py-6 flex-col">
          <div class="flex justify-center items-start md:flex-row flex-col mb-8 w-full">
            <div class="flex-[1] flex flex-col justify-start mr-10">
              <img src="/assets/logo.webp" alt="Graspins Innovations" class="w-[266px] h-[72.14px] object-contain" />
              <p class="font-poppins font-normal text-dimWhite text-[18px] leading-[30.8px] mt-4 max-w-[312px]">
                Specialized AI solutions — architected, developed, deployed, and maintained for companies of every size.
              </p>
              <a href="mailto:hello@graspins.com" class="font-poppins font-normal text-[16px] leading-[24px] text-secondary hover:underline mt-4">hello@graspins.com</a>
            </div>
            <div class="flex-[1.5] w-full flex flex-row justify-between flex-wrap md:mt-0 mt-10">
              <div class="flex flex-col ss:my-0 my-4 min-w-[150px]">
                <h4 class="font-poppins font-medium text-[18px] leading-[27px] text-white">Services</h4>
                <ul class="list-none mt-4">
                  <li class="font-poppins font-normal text-[16px] leading-[24px] text-dimWhite hover:text-secondary cursor-pointer mb-4"><a href="/services#ai-strategy">AI Strategy &amp; Consulting</a></li>
                  <li class="font-poppins font-normal text-[16px] leading-[24px] text-dimWhite hover:text-secondary cursor-pointer mb-4"><a href="/services#ai-development">Custom AI Development</a></li>
                  <li class="font-poppins font-normal text-[16px] leading-[24px] text-dimWhite hover:text-secondary cursor-pointer mb-4"><a href="/services#machine-learning">Machine Learning &amp; MLOps</a></li>
                  <li class="font-poppins font-normal text-[16px] leading-[24px] text-dimWhite hover:text-secondary cursor-pointer mb-4"><a href="/services#generative-ai">Generative AI</a></li>
                  <li class="font-poppins font-normal text-[16px] leading-[24px] text-dimWhite hover:text-secondary cursor-pointer mb-0"><a href="/services#software">Software Development</a></li>
                </ul>
              </div>
              <div class="flex flex-col ss:my-0 my-4 min-w-[150px]">
                <h4 class="font-poppins font-medium text-[18px] leading-[27px] text-white">Company</h4>
                <ul class="list-none mt-4">
                  <li class="font-poppins font-normal text-[16px] leading-[24px] text-dimWhite hover:text-secondary cursor-pointer mb-4"><a href="/about">About Us</a></li>
                  <li class="font-poppins font-normal text-[16px] leading-[24px] text-dimWhite hover:text-secondary cursor-pointer mb-4"><a href="/case-studies">Case Studies</a></li>
                  <li class="font-poppins font-normal text-[16px] leading-[24px] text-dimWhite hover:text-secondary cursor-pointer mb-4"><a href="/careers">Careers</a></li>
                  <li class="font-poppins font-normal text-[16px] leading-[24px] text-dimWhite hover:text-secondary cursor-pointer mb-4"><a href="/blog">Blog</a></li>
                  <li class="font-poppins font-normal text-[16px] leading-[24px] text-dimWhite hover:text-secondary cursor-pointer mb-0"><a href="/contact">Contact</a></li>
                </ul>
              </div>
              <div class="flex flex-col ss:my-0 my-4 min-w-[150px]">
                <h4 class="font-poppins font-medium text-[18px] leading-[27px] text-white">Resources</h4>
                <ul class="list-none mt-4">
                  <li class="font-poppins font-normal text-[16px] leading-[24px] text-dimWhite hover:text-secondary cursor-pointer mb-4"><a href="/documentation">Documentation</a></li>
                  <li class="font-poppins font-normal text-[16px] leading-[24px] text-dimWhite hover:text-secondary cursor-pointer mb-0"><a href="/support">Support</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="w-full flex justify-between items-center md:flex-row flex-col pt-6 border-t-[1px] border-t-[#3F3E45]">
            <p class="font-poppins font-normal text-center text-[18px] leading-[27px] text-white">Copyright Ⓒ 2026 Graspins Innovations. All Rights Reserved.</p>
            <a href="/contact" class="font-poppins font-normal text-[16px] leading-[27px] text-dimWhite hover:text-secondary md:mt-0 mt-6">Get in touch →</a>
          </div>
        </section>
      </div>
    </div>`;

const head = ({ title, desc, canonical, ogType = "website", extraHead = "", robots = "index, follow, max-image-preview:large, max-snippet:-1" }) => `  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script>
      document.documentElement.classList.add("js");
    </script>
    <title>${title}</title>
    <meta name="description" content="${desc}" />
    <meta name="author" content="Graspins Innovations" />
    <meta name="robots" content="${robots}" />
    <meta name="theme-color" content="#00040f" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:site_name" content="Graspins Innovations" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${SITE}/assets/og-image.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />
    <meta name="twitter:image" content="${SITE}/assets/og-image.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png" />
    <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" />
    <link rel="stylesheet" href="/css/styles.css" />${extraHead}
  </head>`;

const page = ({ title, desc, canonical, active, body, jsonld = "", ogType, robots, extraHead, footerScript = "" }) => `<!DOCTYPE html>
<html lang="en">
${head({ title, desc, canonical, ogType, robots, extraHead })}
  <body class="bg-primary w-full overflow-x-hidden">
    <!-- Navbar -->
${nav(active)}

${body}

    <!-- Footer -->
${footer}
${jsonld ? `\n    <script type="application/ld+json">\n${jsonld}\n    </script>\n` : ""}${footerScript}    <script src="/js/main.js"></script>
  </body>
</html>
`;

// ---------------------------------------------------------------- prose helper
const P = (t) => `<p class="font-poppins font-normal text-dimWhite text-[18px] leading-[32px] mb-6">${t}</p>`;
const H2 = (t) => `<h2 class="font-poppins font-semibold text-white text-[26px] leading-[36px] mt-10 mb-4">${t}</h2>`;
const UL = (items) => `<ul class="list-disc list-inside text-dimWhite font-poppins text-[18px] leading-[32px] mb-6">${items.map((i) => `<li class="mb-2">${i}</li>`).join("")}</ul>`;

const ctaBand = (heading, text) => `        <section class="flex justify-center items-center sm:my-16 my-6 sm:px-16 px-6 sm:py-12 py-8 sm:flex-row flex-col bg-black-gradient-2 rounded-[20px] box-shadow">
          <div class="flex-1 flex flex-col">
            <h2 class="font-poppins font-semibold text-white text-[36px] leading-[46px] mb-3">${heading}</h2>
            <p class="font-poppins font-normal text-dimWhite text-[18px] leading-[30px] max-w-[560px]">${text}</p>
          </div>
          <div class="flex justify-center items-center sm:ml-10 ml-0 sm:mt-0 mt-6">
            <a href="/contact" class="inline-block text-center py-4 px-6 bg-blue-gradient font-poppins font-medium text-[18px] text-primary rounded-[10px]">Get in touch</a>
          </div>
        </section>`;

const wrap = (inner) => `    <div class="bg-primary sm:px-16 px-6 flex justify-center items-start">
      <div class="xl:max-w-[1280px] w-full">
${inner}
      </div>
    </div>`;

const pageHeader = (eyebrow, h1, sub) => `        <section class="sm:py-16 py-8 max-w-[820px]">
          <p class="font-poppins font-medium text-secondary text-[16px] uppercase tracking-wide mb-3">${eyebrow}</p>
          <h1 class="font-poppins font-semibold text-white xs:text-[52px] text-[40px] xs:leading-[64px] leading-[52px] mb-6">${h1}</h1>
          <p class="font-poppins font-normal text-dimWhite text-[18px] leading-[32px]">${sub}</p>
        </section>`;

// ---------------------------------------------------------------- SERVICES
const services = [
  ["ai-strategy", "AI Strategy & Consulting", "We help you find the highest-value AI opportunities in your business and turn them into a clear, fundable roadmap. Our architects assess your data, systems, and goals, then design a pragmatic plan — including build-vs-buy decisions, model selection, risk and governance, and a phased rollout that delivers value early."],
  ["ai-development", "Custom AI Development", "We design, build, and rigorously evaluate AI systems tailored to your needs — from recommendation engines and forecasting to document intelligence, computer vision, and LLM-powered applications. Everything is engineered to integrate cleanly with your existing products and data."],
  ["machine-learning", "Machine Learning & MLOps", "We take models from notebook to production and keep them healthy there. That means reliable data and feature pipelines, reproducible training, automated CI/CD for models, monitoring for drift and quality, and retraining workflows — so your AI stays accurate and dependable as your data evolves."],
  ["generative-ai", "Generative AI", "We build practical generative-AI products: assistants, copilots, retrieval-augmented (RAG) systems over your knowledge, content and code generation, and agentic workflows. We focus on accuracy, safety, evaluation, and cost control so these systems are trustworthy in production."],
  ["software", "Software Development", "Great AI needs great software around it. We build the web apps, APIs, dashboards, and cloud infrastructure that turn models into products your team and customers can actually use — secure, scalable, and well-tested."],
];

const servicesBody = wrap(
  pageHeader(
    "Services",
    "AI solutions, end to end.",
    "We architect, develop, deploy, and maintain specialized AI solutions for companies from startups to the Fortune 500. Explore what we do — and let's talk about where AI can move the needle for you."
  ) +
    "\n" +
    services
      .map(
        (s) => `        <section id="${s[0]}" class="sm:py-10 py-8 border-t-[1px] border-t-[#3F3E45] scroll-mt-24">
          <h2 class="font-poppins font-semibold text-white text-[30px] leading-[40px] mb-4">${s[1]}</h2>
          <p class="font-poppins font-normal text-dimWhite text-[18px] leading-[32px] max-w-[820px]">${s[2]}</p>
        </section>`
      )
      .join("\n") +
    "\n" +
    ctaBand("Not sure where to start?", "Tell us about your goals and we'll recommend the highest-impact place to begin.")
);

// ---------------------------------------------------------------- CASE STUDIES
const caseStudies = [
  ["Generative-AI support assistant", "B2B SaaS", "A growing SaaS company was overwhelmed by repetitive support tickets. We designed and deployed a retrieval-augmented assistant grounded in their documentation and ticket history, with human-in-the-loop review and continuous evaluation.", "Faster first responses, deflection of routine tickets, and happier support agents focused on complex cases."],
  ["Demand forecasting platform", "Logistics & supply chain", "A logistics operator needed more accurate demand and capacity forecasts. We built the data pipelines, trained and validated forecasting models, and shipped a monitored production service with automated retraining.", "More reliable forecasts feeding planning, with a transparent pipeline the in-house team can own and extend."],
  ["Document intelligence pipeline", "Fintech", "A fintech team spent hours manually extracting data from documents. We built an ML pipeline combining OCR and LLM extraction with validation and audit trails, integrated into their existing workflow.", "Dramatically reduced manual effort with traceable, reviewable automated extraction."],
];

const caseStudiesBody = wrap(
  pageHeader(
    "Case Studies",
    "Representative engagements.",
    "A look at the kinds of AI problems we solve and how we approach them. Client details are anonymized to respect confidentiality; these illustrate our typical scope, method, and outcomes."
  ) +
    "\n" +
    `        <section class="sm:pb-12 pb-8">
          <div class="flex flex-col gap-6">
${caseStudies
  .map(
    (c) => `            <div class="bg-black-gradient-2 p-8 rounded-[20px]">
              <p class="font-poppins font-medium text-secondary text-[14px] uppercase tracking-wide mb-2">${c[1]}</p>
              <h2 class="font-poppins font-semibold text-white text-[24px] leading-[32px] mb-3">${c[0]}</h2>
              <p class="font-poppins font-normal text-dimWhite text-[17px] leading-[28px] mb-3"><span class="text-white font-medium">Challenge &amp; approach:</span> ${c[2]}</p>
              <p class="font-poppins font-normal text-dimWhite text-[17px] leading-[28px]"><span class="text-white font-medium">Outcome:</span> ${c[3]}</p>
            </div>`
  )
  .join("\n")}
          </div>
        </section>
` +
    ctaBand("Want results like these?", "Let's talk about your data and goals — we'll outline how we'd approach it.")
);

// ---------------------------------------------------------------- CONTACT
const contactBody = wrap(
  pageHeader(
    "Contact",
    "Let's talk about your AI project.",
    "Whether you have a clear brief or just an idea, we'd love to hear from you. Tell us a bit about what you're working on and we'll get back to you quickly."
  ) +
    `
        <section class="sm:pb-16 pb-8 flex md:flex-row flex-col gap-10">
          <div class="flex-1">
            <form id="contact-form" class="flex flex-col gap-4 max-w-[560px]">
              <input required name="name" type="text" placeholder="Your name" class="bg-black-gradient-2 text-white font-poppins text-[16px] rounded-[10px] py-4 px-5 outline-none border border-[#3F3E45] focus:border-secondary" />
              <input required name="email" type="email" placeholder="Your email" class="bg-black-gradient-2 text-white font-poppins text-[16px] rounded-[10px] py-4 px-5 outline-none border border-[#3F3E45] focus:border-secondary" />
              <input name="company" type="text" placeholder="Company (optional)" class="bg-black-gradient-2 text-white font-poppins text-[16px] rounded-[10px] py-4 px-5 outline-none border border-[#3F3E45] focus:border-secondary" />
              <textarea required name="message" rows="5" placeholder="How can we help?" class="bg-black-gradient-2 text-white font-poppins text-[16px] rounded-[10px] py-4 px-5 outline-none border border-[#3F3E45] focus:border-secondary"></textarea>
              <button type="submit" class="inline-block text-center py-4 px-6 bg-blue-gradient font-poppins font-medium text-[18px] text-primary rounded-[10px] cursor-pointer">Send message</button>
              <p class="font-poppins font-normal text-dimWhite text-[14px] leading-[22px]">This opens your email app with the details pre-filled. Prefer email? Write to <a href="mailto:hello@graspins.com" class="text-secondary hover:underline">hello@graspins.com</a>.</p>
            </form>
          </div>
          <div class="flex-1 flex flex-col gap-6">
            <div class="bg-black-gradient-2 p-8 rounded-[20px]">
              <h3 class="font-poppins font-semibold text-white text-[20px] mb-2">General enquiries</h3>
              <a href="mailto:hello@graspins.com" class="font-poppins text-secondary text-[18px] hover:underline">hello@graspins.com</a>
            </div>
            <div class="bg-black-gradient-2 p-8 rounded-[20px]">
              <h3 class="font-poppins font-semibold text-white text-[20px] mb-2">New projects</h3>
              <a href="mailto:hello@graspins.com?subject=New%20project%20enquiry" class="font-poppins text-secondary text-[18px] hover:underline">Start a project</a>
            </div>
            <div class="bg-black-gradient-2 p-8 rounded-[20px]">
              <h3 class="font-poppins font-semibold text-white text-[20px] mb-2">Support</h3>
              <p class="font-poppins font-normal text-dimWhite text-[16px] leading-[26px]">Existing client? Visit our <a href="/support" class="text-secondary hover:underline">support page</a>.</p>
            </div>
          </div>
        </section>`,
);

const contactFooterScript = `    <script>
      (function () {
        var f = document.getElementById("contact-form");
        if (!f) return;
        f.addEventListener("submit", function (e) {
          e.preventDefault();
          var d = new FormData(f);
          var subject = "Project enquiry from " + (d.get("name") || "website");
          var body =
            "Name: " + (d.get("name") || "") + "\\n" +
            "Email: " + (d.get("email") || "") + "\\n" +
            "Company: " + (d.get("company") || "") + "\\n\\n" +
            (d.get("message") || "");
          window.location.href =
            "mailto:hello@graspins.com?subject=" +
            encodeURIComponent(subject) +
            "&body=" +
            encodeURIComponent(body);
        });
      })();
    </script>
`;

const contactJsonld = JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Graspins Innovations",
    url: `${SITE}/contact`,
    about: { "@type": "Organization", name: "Graspins Innovations", url: `${SITE}/`, email: "hello@graspins.com", logo: `${SITE}/assets/logo.webp` },
  },
  null,
  2
);

// ---------------------------------------------------------------- DOCUMENTATION
const documentationBody = wrap(
  pageHeader(
    "Documentation",
    "How we work with you.",
    "A practical guide to engaging Graspins — our process, the technologies we use, and what to expect at each stage. For hands-on help, see our <a href=\"/support\" class=\"text-secondary hover:underline\">support page</a>."
  ) +
    "\n        <section class=\"sm:pb-12 pb-8 max-w-[820px]\">" +
    H2("Our engagement process") +
    P("Every engagement follows four clear stages — <span class=\"text-white\">architect, develop, deploy, and maintain</span>. We start with a short discovery to understand your goals and data, produce a proposed architecture and plan, then build in tight iterations with regular demos.") +
    UL([
      "<span class=\"text-white\">Discovery &amp; scoping</span> — goals, data audit, success metrics, and feasibility.",
      "<span class=\"text-white\">Architecture</span> — system design, model approach, and a phased delivery plan.",
      "<span class=\"text-white\">Build &amp; evaluate</span> — iterative development with measurable evaluation at each step.",
      "<span class=\"text-white\">Deploy</span> — production rollout with monitoring, guardrails, and documentation.",
      "<span class=\"text-white\">Maintain</span> — ongoing monitoring, retraining, and improvements.",
    ]) +
    H2("Technologies we use") +
    P("We're pragmatic about tools and choose what fits the problem. Typical stacks include Python with PyTorch, TensorFlow, and scikit-learn for modeling; modern LLM providers and open-weight models for generative AI; vector databases for retrieval; and cloud platforms (AWS, GCP, Azure) with containerized, observable deployments.") +
    H2("Integration & ownership") +
    P("We integrate with your existing systems through clean APIs and well-documented code, and we hand over everything you need to own the solution: source code, infrastructure-as-code, runbooks, and clear documentation. You're never locked in.") +
    H2("Security & data handling") +
    P("We treat your data with care — least-privilege access, encryption in transit and at rest, and clear data-handling agreements. We design AI systems with safety, privacy, and governance in mind from day one.") +
    "        </section>\n" +
    ctaBand("Have a question about working together?", "We're happy to walk you through our process and answer anything.")
);

// ---------------------------------------------------------------- SUPPORT
const supportBody = wrap(
  pageHeader(
    "Support",
    "We're here to help.",
    "Already working with us, or need a hand? Here's how to reach the team and what to expect."
  ) +
    `
        <section class="sm:pb-12 pb-8 flex flex-wrap gap-6">
          <div class="flex-1 min-w-[260px] bg-black-gradient-2 p-8 rounded-[20px]">
            <h2 class="font-poppins font-semibold text-white text-[22px] mb-2">Email support</h2>
            <p class="font-poppins font-normal text-dimWhite text-[16px] leading-[26px] mb-3">For help with an existing project or system, email us and we'll route it to the right engineer.</p>
            <a href="mailto:support@graspins.com" class="font-poppins text-secondary text-[18px] hover:underline">support@graspins.com</a>
          </div>
          <div class="flex-1 min-w-[260px] bg-black-gradient-2 p-8 rounded-[20px]">
            <h2 class="font-poppins font-semibold text-white text-[22px] mb-2">New enquiries</h2>
            <p class="font-poppins font-normal text-dimWhite text-[16px] leading-[26px] mb-3">Thinking about a new project? Start a conversation and we'll get back to you quickly.</p>
            <a href="/contact" class="font-poppins text-secondary text-[18px] hover:underline">Contact us →</a>
          </div>
        </section>
        <section class="sm:pb-12 pb-8 max-w-[820px]">
          <h2 class="font-poppins font-semibold text-white text-[26px] leading-[36px] mb-4">Response times</h2>
          <p class="font-poppins font-normal text-dimWhite text-[18px] leading-[32px] mb-6">We aim to acknowledge every message within one business day. Active clients with a support agreement receive priority response windows defined in their plan.</p>
          <h2 class="font-poppins font-semibold text-white text-[26px] leading-[36px] mb-4">Frequently asked</h2>
          <p class="font-poppins font-normal text-dimWhite text-[18px] leading-[32px] mb-4"><span class="text-white font-medium">Do you offer ongoing maintenance?</span> Yes — we monitor, retrain, and improve the AI systems we build so they stay reliable over time.</p>
          <p class="font-poppins font-normal text-dimWhite text-[18px] leading-[32px] mb-4"><span class="text-white font-medium">Can you work with our existing team?</span> Absolutely. We collaborate with in-house teams and hand over clean, documented, ownable code.</p>
          <p class="font-poppins font-normal text-dimWhite text-[18px] leading-[32px]"><span class="text-white font-medium">What size projects do you take on?</span> From focused proofs of concept to enterprise-scale platforms — startups to the Fortune 500.</p>
        </section>` +
    ctaBand("Need something else?", "Reach out and we'll point you in the right direction.")
);

// ---------------------------------------------------------------- BLOG POSTS
const posts = [
  {
    slug: "claude-3-enterprise-ai",
    title: "Claude 3 Raises the Bar for Enterprise AI",
    date: "2024-03-05",
    tag: "Large Language Models",
    excerpt: "Anthropic's Claude 3 family — Opus, Sonnet, and Haiku — pushes frontier quality while giving teams a clear cost/latency ladder. Here's what it means for production AI.",
    blocks: [
      ["p", "This week Anthropic introduced the Claude 3 model family — Opus, Sonnet, and Haiku. Beyond the headline benchmark gains, what stands out for teams building real products is the deliberate three-tier lineup: a top-quality model, a balanced workhorse, and a fast, economical option that share the same interface."],
      ["h2", "Why a model ladder matters"],
      ["p", "Most production AI systems don't need the largest model for every call. A well-designed system routes easy requests to a cheaper, faster model and escalates only the hard ones. A consistent family like Claude 3 makes that routing straightforward, which directly improves both cost and latency."],
      ["h2", "Stronger vision and longer context"],
      ["p", "Claude 3 also brings improved vision capabilities and large context windows, opening up document understanding, multimodal extraction, and analysis over long inputs. For enterprises sitting on piles of PDFs and reports, that's immediately useful."],
      ["p", "Our take: treat model choice as an architecture decision, not a default. We help teams design evaluation harnesses and routing so they capture frontier quality where it counts without overpaying everywhere else."],
    ],
  },
  {
    slug: "gpt-4o-multimodal-ai",
    title: "GPT-4o and the Shift to Real-Time Multimodal AI",
    date: "2024-05-16",
    tag: "Multimodal AI",
    excerpt: "OpenAI's GPT-4o brings faster, natively multimodal interaction across text, vision, and audio. We look at what changes for product design.",
    blocks: [
      ["p", "OpenAI's GPT-4o (\"omni\") lands with a clear theme: one model handling text, vision, and audio with much lower latency. Around the same time, Google's I/O underscored the same direction with its long-context multimodal models. The industry is converging on responsive, multimodal assistants."],
      ["h2", "Latency is a feature"],
      ["p", "Fast responses change what's possible. Sub-second, conversational interaction makes voice interfaces and live assistance feel natural rather than clunky. When you're designing AI UX, latency budgets deserve as much attention as accuracy."],
      ["h2", "Designing for multiple modalities"],
      ["p", "Native multimodality means you can build experiences that mix a photo, a question, and a spoken reply seamlessly. The design challenge shifts to grounding, error handling, and giving users control when the model is uncertain."],
      ["p", "Our take: multimodal doesn't mean \"throw everything at the model.\" The best products are still opinionated about the few interactions that matter, then make those feel instant and reliable."],
    ],
  },
  {
    slug: "claude-3-5-sonnet-ai-copilots",
    title: "Claude 3.5 Sonnet and the Rise of AI Coding Copilots",
    date: "2024-06-24",
    tag: "Developer Tools",
    excerpt: "Claude 3.5 Sonnet's coding gains — and its new Artifacts interface — point to a future where AI is a genuine collaborator in software work.",
    blocks: [
      ["p", "Anthropic's Claude 3.5 Sonnet arrived with a notable jump in coding and reasoning while being faster and cheaper than the previous top model. Alongside it, the new Artifacts experience lets you see and iterate on generated code and content beside the conversation."],
      ["h2", "From autocomplete to collaborator"],
      ["p", "Coding assistants have moved well beyond line completion. With stronger models, they can scaffold features, refactor across files, write tests, and explain unfamiliar code. The productivity gains are real — but so is the need for review discipline."],
      ["h2", "Keeping humans in the loop"],
      ["p", "We encourage teams to treat AI-generated code like any contribution: reviewed, tested, and understood. The teams getting the most value pair capable models with strong evaluation and CI, not blind trust."],
      ["p", "Our take: AI copilots are a force multiplier for good engineering practices, not a replacement for them. We help teams adopt them safely and measure the impact."],
    ],
  },
  {
    slug: "openai-o1-reasoning-models",
    title: "Reasoning Models Arrive: What OpenAI o1 Means for AI Systems",
    date: "2024-09-16",
    tag: "Reasoning",
    excerpt: "OpenAI's o1 spends more compute \"thinking\" before answering. That trade-off reshapes how we design AI for hard, multi-step problems.",
    blocks: [
      ["p", "OpenAI previewed o1, a model trained to reason through problems step by step before responding. Instead of answering instantly, it spends more inference-time compute working through harder tasks in math, coding, and science."],
      ["h2", "A new dial: thinking time"],
      ["p", "This introduces a design dial we didn't have before — how much \"thinking\" to allow. For routine tasks, fast models are still the right call. For complex, high-stakes reasoning, spending more compute per query can be well worth it."],
      ["h2", "Implications for system design"],
      ["p", "Reasoning models reward good problem decomposition and clear evaluation. They also change cost and latency profiles, so routing between fast and deliberate models becomes even more important in production."],
      ["p", "Our take: match the model to the task. We build systems that reserve heavyweight reasoning for the moments that truly need it."],
    ],
  },
  {
    slug: "agentic-ai-computer-use",
    title: "Agentic AI and Computer Use: A New Interaction Model",
    date: "2024-10-24",
    tag: "AI Agents",
    excerpt: "Anthropic's upgraded Claude 3.5 Sonnet introduced computer use — models that operate software like a person. Promising, and a reminder to design guardrails first.",
    blocks: [
      ["p", "Anthropic's updated Claude 3.5 Sonnet introduced a striking capability: computer use, where the model can move a cursor, click, and type to operate software. It's an early, experimental step toward agents that complete real digital tasks end to end."],
      ["h2", "Why agents are different"],
      ["p", "An agent that takes actions — not just generates text — is far more useful and far more consequential. Mistakes can have side effects. That makes scoping, permissions, and oversight the central design problem, not an afterthought."],
      ["h2", "Build guardrails first"],
      ["p", "We design agentic systems with constrained tools, clear boundaries, approval steps for sensitive actions, and thorough logging. Start narrow, prove reliability, then expand scope."],
      ["p", "Our take: agentic AI is genuinely exciting, but the winners will be teams that treat safety and evaluation as first-class from the start."],
    ],
  },
  {
    slug: "gemini-2-agent-era",
    title: "Gemini 2.0 and the Beginning of the Agent Era",
    date: "2024-12-12",
    tag: "AI Agents",
    excerpt: "Google's Gemini 2.0 Flash leans into native tool use and multimodal output, framing 2025 as the year agentic AI goes mainstream.",
    blocks: [
      ["p", "Google introduced Gemini 2.0 Flash with a clear pitch toward the \"agentic era\": native tool use, multimodal inputs and outputs, and low latency aimed at assistants that can actually do things on your behalf."],
      ["h2", "Tool use as a primitive"],
      ["p", "When calling tools and APIs is a first-class capability, models become orchestrators. They can fetch data, run actions, and combine results — which is exactly what real workflows require."],
      ["h2", "From demos to dependable systems"],
      ["p", "The gap between an impressive demo and a dependable product is evaluation, error handling, and observability. As agent capabilities grow, disciplined engineering is what separates reliable systems from flaky ones."],
      ["p", "Our take: 2025 will be defined less by raw model size and more by how well teams compose models, tools, and guardrails into trustworthy agents."],
    ],
  },
  {
    slug: "deepseek-r1-open-reasoning",
    title: "DeepSeek R1 and the Economics of Open Reasoning Models",
    date: "2025-01-27",
    tag: "Open Models",
    excerpt: "DeepSeek R1 brought strong reasoning to open weights at a fraction of the expected cost — with real implications for build-vs-buy decisions.",
    blocks: [
      ["p", "DeepSeek released R1, an open-weight reasoning model that delivered competitive performance at a striking cost point. It sent a clear signal: frontier-style reasoning is no longer the exclusive domain of a few closed labs."],
      ["h2", "Open weights change the calculus"],
      ["p", "Open models you can self-host change the build-vs-buy decision. For workloads with strict data-residency needs, high volume, or customization requirements, hosting an open model can be both cheaper and more controllable."],
      ["h2", "Trade-offs to weigh"],
      ["p", "Self-hosting brings responsibility: infrastructure, scaling, evaluation, and security. The right answer is rarely all-or-nothing — many teams blend hosted APIs and self-hosted open models depending on the task."],
      ["p", "Our take: we help clients run honest cost and risk comparisons, then design hybrid architectures that use the right model for each job."],
    ],
  },
  {
    slug: "claude-3-7-extended-thinking",
    title: "Extended Thinking: Inside Claude 3.7 Sonnet",
    date: "2025-02-25",
    tag: "Reasoning",
    excerpt: "Claude 3.7 Sonnet blends fast responses with optional extended thinking, letting one model flex between quick answers and deep reasoning.",
    blocks: [
      ["p", "Anthropic's Claude 3.7 Sonnet introduced a hybrid approach: it can answer quickly for everyday requests or engage extended thinking for harder problems, with developers able to control how much reasoning to spend."],
      ["h2", "One model, two modes"],
      ["p", "Combining quick and deliberate reasoning in a single model simplifies architecture. Instead of routing between separate models, teams can dial reasoning up or down per request based on difficulty and budget."],
      ["h2", "Practical evaluation still wins"],
      ["p", "More reasoning isn't always better — it costs time and money. The teams that benefit most measure where extended thinking actually improves outcomes and apply it selectively."],
      ["p", "Our take: controllable reasoning is a powerful lever. We build evaluation into client systems so that lever is tuned with data, not guesswork."],
    ],
  },
  {
    slug: "gemini-2-5-pro-long-context",
    title: "Gemini 2.5 Pro and the Long-Context Advantage",
    date: "2025-03-26",
    tag: "Large Language Models",
    excerpt: "Gemini 2.5 Pro pairs strong reasoning with very large context windows. We look at where long context genuinely helps — and where retrieval still wins.",
    blocks: [
      ["p", "Google's Gemini 2.5 Pro combined strong reasoning with very large context windows, making it possible to feed entire codebases, document sets, or long histories directly into a single prompt."],
      ["h2", "When long context shines"],
      ["p", "Huge context is fantastic for tasks that need to reason across a lot of material at once — reviewing a large codebase, synthesizing many documents, or following long conversations without losing the thread."],
      ["h2", "When retrieval still wins"],
      ["p", "Long context isn't a replacement for retrieval. For large, frequently changing knowledge bases, a well-built RAG system is often cheaper, faster, and easier to keep current than stuffing everything into the prompt."],
      ["p", "Our take: long context and retrieval are complementary. We design systems that use each where it's strongest, with cost and freshness in mind."],
    ],
  },
  {
    slug: "claude-4-coding-agents",
    title: "Claude 4 and the Next Generation of Coding Agents",
    date: "2025-05-26",
    tag: "AI Agents",
    excerpt: "Anthropic's Claude 4 family pushes sustained, agentic coding — models that can work through multi-step software tasks more reliably than before.",
    blocks: [
      ["p", "Anthropic introduced the Claude 4 family — Opus 4 and Sonnet 4 — with a clear emphasis on sustained, agentic work: models that can stay on task across long, multi-step coding and reasoning problems."],
      ["h2", "Agents that go the distance"],
      ["p", "Earlier agents often lost the thread on long tasks. Improvements in sustained reasoning and tool use mean agents can now handle longer workflows — refactoring across a project, running tests, and iterating — with fewer derailments."],
      ["h2", "Engineering discipline scales the benefit"],
      ["p", "The more capable the agent, the more leverage your guardrails provide. Clear task scoping, strong tests, code review, and observability turn a capable model into a dependable teammate."],
      ["p", "Our take: this is the most exciting moment yet for AI-assisted engineering. We help teams put these agents to work safely, with the evaluation and process to trust the results."],
    ],
  },
];

const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const fmtDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${monthNames[m - 1]} ${d}, ${y}`;
};
const readingTime = (blocks) => {
  const words = blocks.map((b) => b[1].split(/\s+/).length).reduce((a, b) => a + b, 0);
  return Math.max(2, Math.round(words / 200));
};

const renderBlocks = (blocks) => blocks.map(([t, v]) => (t === "h2" ? H2(v) : P(v))).join("\n          ");

const postBody = (post) => wrap(
  `        <article class="sm:py-16 py-8 max-w-[760px]">
          <a href="/blog" class="font-poppins font-normal text-secondary text-[16px] hover:underline">← All articles</a>
          <p class="font-poppins font-medium text-secondary text-[14px] uppercase tracking-wide mt-8 mb-3">${post.tag} · ${fmtDate(post.date)} · ${readingTime(post.blocks)} min read</p>
          <h1 class="font-poppins font-semibold text-white xs:text-[44px] text-[34px] xs:leading-[56px] leading-[44px] mb-8">${post.title}</h1>
          ${renderBlocks(post.blocks)}
        </article>
` + ctaBand("Want help applying this to your business?", "We turn the latest AI into production systems that deliver real value.")
);

const postJsonld = (post) =>
  JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      dateModified: post.date,
      author: { "@type": "Organization", name: "Graspins Innovations", url: `${SITE}/` },
      publisher: { "@type": "Organization", name: "Graspins Innovations", logo: { "@type": "ImageObject", url: `${SITE}/assets/logo.webp` } },
      image: `${SITE}/assets/og-image.png`,
      mainEntityOfPage: `${SITE}/blog/${post.slug}`,
      keywords: post.tag,
    },
    null,
    2
  );

// blog index
const blogIndexBody = wrap(
  pageHeader(
    "Blog",
    "Notes on building with AI.",
    "Practical perspectives from our team on the AI landscape — new models, agents, and what they mean for teams shipping real products."
  ) +
    `
        <section class="sm:pb-16 pb-8 flex flex-col gap-6">
${[...posts]
  .sort((a, b) => (a.date < b.date ? 1 : -1))
  .map(
    (p) => `          <a href="/blog/${p.slug}" class="block bg-black-gradient-2 p-8 rounded-[20px] feature-card">
            <p class="font-poppins font-medium text-secondary text-[14px] uppercase tracking-wide mb-2">${p.tag} · ${fmtDate(p.date)}</p>
            <h2 class="font-poppins font-semibold text-white text-[24px] leading-[32px] mb-3">${p.title}</h2>
            <p class="font-poppins font-normal text-dimWhite text-[17px] leading-[28px]">${p.excerpt}</p>
            <span class="font-poppins font-medium text-secondary text-[16px] inline-block mt-4">Read article →</span>
          </a>`
  )
  .join("\n")}
        </section>`
);

const blogJsonld = JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Graspins Innovations Blog",
    url: `${SITE}/blog`,
    description: "Practical perspectives on building with AI.",
    blogPost: [...posts]
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .map((p) => ({ "@type": "BlogPosting", headline: p.title, datePublished: p.date, url: `${SITE}/blog/${p.slug}` })),
  },
  null,
  2
);

// ---------------------------------------------------------------- 404 (fuzzy)
const notFoundRoutes = [
  ["/", "Home"],
  ["/services", "Services"],
  ["/case-studies", "Case Studies"],
  ["/blog", "Blog"],
  ["/about", "About"],
  ["/contact", "Contact"],
  ["/careers", "Careers"],
  ["/documentation", "Documentation"],
  ["/support", "Support"],
  ...posts.map((p) => ["/blog/" + p.slug, p.title]),
];

const notFoundBody = wrap(
  `        <section class="sm:py-24 py-16 flex flex-col items-center text-center max-w-[640px] mx-auto">
          <p class="font-poppins font-medium text-secondary text-[16px] uppercase tracking-wide mb-3">Page not found</p>
          <h1 class="font-poppins font-semibold text-white text-[44px] leading-[54px] mb-4">Taking you to the right place…</h1>
          <p id="nf-msg" class="font-poppins font-normal text-dimWhite text-[18px] leading-[30px] mb-8">We couldn't find that exact page. Redirecting you to the closest match — or you can pick a destination below.</p>
          <div class="flex flex-wrap justify-center gap-3">
            <a href="/" class="inline-block py-3 px-5 bg-blue-gradient font-poppins font-medium text-[16px] text-primary rounded-[10px]">Home</a>
            <a href="/services" class="inline-block py-3 px-5 border border-[#3F3E45] font-poppins font-medium text-[16px] text-white rounded-[10px] hover:text-secondary">Services</a>
            <a href="/blog" class="inline-block py-3 px-5 border border-[#3F3E45] font-poppins font-medium text-[16px] text-white rounded-[10px] hover:text-secondary">Blog</a>
            <a href="/contact" class="inline-block py-3 px-5 border border-[#3F3E45] font-poppins font-medium text-[16px] text-white rounded-[10px] hover:text-secondary">Contact</a>
          </div>
        </section>`
);

const notFoundScript = `    <script>
      (function () {
        var routes = ${JSON.stringify(notFoundRoutes)};
        var path = (location.pathname || "/").toLowerCase().replace(/\\/+$/, "");
        if (!path) path = "/";
        function norm(s){ return s.toLowerCase().replace(/[^a-z0-9]/g, ""); }
        function lev(a, b) {
          var m = a.length, n = b.length, d = [];
          for (var i = 0; i <= m; i++) d[i] = [i];
          for (var j = 0; j <= n; j++) d[0][j] = j;
          for (i = 1; i <= m; i++) for (j = 1; j <= n; j++)
            d[i][j] = Math.min(d[i-1][j]+1, d[i][j-1]+1, d[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
          return d[m][n];
        }
        var target = norm(path);
        var best = "/", bestScore = Infinity;
        routes.forEach(function (r) {
          var cand = norm(r[0]);
          var score = lev(target, cand);
          if (cand && target.indexOf(cand) !== -1 || (cand && cand.indexOf(target) !== -1)) score -= 3;
          if (score < bestScore) { bestScore = score; best = r[0]; }
        });
        // Only auto-redirect on a reasonably close match; otherwise go home.
        var dest = bestScore <= Math.max(4, target.length * 0.6) ? best : "/";
        setTimeout(function () { location.replace(dest); }, 1200);
      })();
    </script>
`;

// ---------------------------------------------------------------- write files
const files = [
  ["services.html", page({ title: "AI Services | Graspins Innovations", desc: "AI strategy, custom AI development, machine learning & MLOps, generative AI, and software development — delivered end to end by Graspins Innovations.", canonical: `${SITE}/services`, active: "services", body: servicesBody })],
  ["case-studies.html", page({ title: "Case Studies | Graspins Innovations", desc: "Representative, anonymized AI engagements by Graspins Innovations — generative-AI assistants, forecasting, and document intelligence.", canonical: `${SITE}/case-studies`, active: "case-studies", body: caseStudiesBody })],
  ["contact.html", page({ title: "Contact Graspins Innovations | Start an AI Project", desc: "Get in touch with Graspins Innovations to discuss your AI project. Email hello@graspins.com or send us a message.", canonical: `${SITE}/contact`, active: "contact", body: contactBody, jsonld: contactJsonld, footerScript: contactFooterScript })],
  ["documentation.html", page({ title: "Documentation | Graspins Innovations", desc: "How Graspins Innovations works with you: our engagement process, technology stack, integration approach, and data handling.", canonical: `${SITE}/documentation`, active: "", body: documentationBody })],
  ["support.html", page({ title: "Support | Graspins Innovations", desc: "Get support from Graspins Innovations. Email support@graspins.com, expected response times, and frequently asked questions.", canonical: `${SITE}/support`, active: "", body: supportBody })],
  ["blog.html", page({ title: "Blog | Graspins Innovations", desc: "Practical perspectives from the Graspins Innovations team on AI models, agents, and building real products with artificial intelligence.", canonical: `${SITE}/blog`, active: "blog", body: blogIndexBody, jsonld: blogJsonld })],
  ["404.html", page({ title: "Page Not Found | Graspins Innovations", desc: "The page you requested could not be found. We'll redirect you to the closest match.", canonical: `${SITE}/404`, active: "", body: notFoundBody, robots: "noindex, follow", footerScript: notFoundScript })],
];

async function run() {
  for (const [name, html] of files) {
    await writeFile(name, html, "utf8");
    console.log("wrote", name);
  }
  await mkdir("blog", { recursive: true });
  for (const post of posts) {
    const html = page({
      title: `${post.title} | Graspins Innovations`,
      desc: post.excerpt,
      canonical: `${SITE}/blog/${post.slug}`,
      active: "blog",
      ogType: "article",
      body: postBody(post),
      jsonld: postJsonld(post),
    });
    await writeFile(`blog/${post.slug}.html`, html, "utf8");
    console.log("wrote", `blog/${post.slug}.html`);
  }
}
run();
