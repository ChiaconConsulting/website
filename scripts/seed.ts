/**
 * Seeds starter content and the first admin user. Safe to re-run: existing rows are left untouched.
 *   npm run db:seed
 */
try {
  process.loadEnvFile(".env");
} catch {}

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function main() {
  const { db, schema } = await import("../src/lib/db");
  const { adminUsers, services, clients, caseStudies, posts, jobs } = schema;

  // ---- Admin user -------------------------------------------------------
  const email = (process.env.ADMIN_EMAIL || "admin@chiacon.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const existing = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
  if (!existing.length) {
    if (!password || password.length < 10) throw new Error("Set ADMIN_PASSWORD (10+ characters) before seeding.");
    await db.insert(adminUsers).values({
      email,
      name: process.env.ADMIN_NAME || "Chiacon Admin",
      passwordHash: await bcrypt.hash(password, 12),
    });
    console.log(`Admin user created: ${email}`);
  }

  // ---- Services ---------------------------------------------------------
  const serviceRows = [
    {
      slug: "auditable-ai",
      title: "Auditable AI",
      icon: "shield",
      tagline: "AI assistants and insight engines your auditors can sign off on.",
      summary:
        "We design and build AI that answers from your own systems, cites its sources, flags what it is unsure of and keeps a record of who approved what.",
      capabilities: [
        "AI assistants over enterprise data (RAG) with source citations",
        "Insight and reporting engines: deterministic queries with AI narration",
        "Confidence scoring and routing to subject-matter experts",
        "Governed reuse of approved answers, with version history",
        "Faithfulness audits and regression test harnesses",
        "Technical assessment of an existing AI pilot: enhance, re-engineer or rebuild",
      ],
      tools: ["Azure AI", "Microsoft Copilot Studio", "Power Platform", "SQL", "Python"],
      body: `## The problem we solve

Most enterprise AI pilots work in the demo and stall at rollout. The reason is rarely the model. It is that nobody can show where an answer came from, whether the numbers reconcile, or who approved it.

## How we build

**Computation stays deterministic.** Totals, variances and comparisons are produced by queries against your systems of record. The language model explains the result in plain language; it does not calculate it.

**Evidence is part of the answer.** Each response carries the source, the record or field, and the date the data was current. Where evidence is missing or conflicting, the system says so.

**People stay in the loop where it matters.** Low-confidence and unanswered questions are routed to the right expert. Their validated answers are captured and reused under version control.

**Releases are gated by tests.** We audit a sample of outputs claim by claim, then keep a regression suite so that quality does not drift when prompts, models or data change.

## Where to start

If you already have an AI pilot, start with a technical assessment. In two to four weeks we review the code, architecture, data and output quality, and give you a recommendation with scope, plan and price.`,
    },
    {
      slug: "intelligent-process-automation",
      title: "Intelligent Process Automation",
      icon: "workflow",
      tagline: "Automation that survives audits, upgrades and month-end.",
      summary:
        "End-to-end automation of finance, procurement, supply chain and master-data processes on UiPath, Power Automate and Playwright.",
      capabilities: [
        "Process discovery, ROI assessment and automation roadmap",
        "Bot design and build on UiPath and Power Automate",
        "Web and portal automation with Playwright",
        "Document and invoice processing with AI extraction",
        "Platform migration, for example UiPath to Power Automate",
        "Bot support, monitoring and managed operations",
      ],
      tools: ["UiPath", "Power Automate", "Playwright", "SAP", "SQL Server"],
      body: `## What we automate

Rule-heavy, high-volume work that sits between systems: provisioning and accruals, invoice processing, master-data creation and change, retailer and supplier portal extraction, reconciliations and report distribution.

## How we deliver

We start by sizing the process and the saving, then build on the platform that fits your landscape and licence position. Every automation ships with exception handling, a run log, and documentation your team can maintain.

Where a process already runs on one platform and the cost or reliability no longer works, we migrate it, for example from attended UiPath bots to Power Automate orchestration with Playwright for the portal steps.

## Quick Deployable Bots

For common needs such as invoice processing and file harmonisation, our pre-built bots cut delivery time. See [Solutions](/solutions).`,
    },
    {
      slug: "data-analytics",
      title: "Data & Analytics",
      icon: "chart",
      tagline: "One version of the numbers, from source to board pack.",
      summary:
        "Data engineering, modelling and reporting on Power BI and Microsoft Fabric, built so that finance and operations trust what they see.",
      capabilities: [
        "Data platform design on Microsoft Fabric",
        "Data pipelines, modelling and reconciliation to source",
        "Power BI dashboards and paginated reports",
        "Profitability, provisioning and sales reporting",
        "Analytics support and enhancement as a managed service",
        "Data quality rules and exception reporting",
      ],
      tools: ["Power BI", "Microsoft Fabric", "SQL Server", "Azure Data Factory", "Excel"],
      body: `## What we deliver

Reporting that reconciles. We build the pipelines and models behind management reporting, then the dashboards on top, with controls that show when data is late, incomplete or out of balance.

## Typical work

- Profitability and provisioning reporting across markets
- Sales consolidation from distributors and retailers
- Migration of spreadsheet reporting to governed Power BI models
- Ongoing analytics support for an existing Power BI and Fabric estate

## Why it matters for AI

Auditable AI depends on trustworthy data. The same reconciled models that feed your dashboards are what our AI solutions query, which is why the two practices work as one team.`,
    },
    {
      slug: "quality-assurance",
      title: "Quality Assurance",
      icon: "check",
      tagline: "Test automation that keeps pace with your releases.",
      summary:
        "Functional, regression and automation testing, including migration of legacy test suites to Playwright.",
      capabilities: [
        "Test strategy and automation framework design",
        "UI and API test automation with Playwright",
        "Migration of UiPath and legacy test suites to Playwright",
        "Regression, integration and UAT support",
        "CI/CD integration and test reporting",
        "Dedicated QA teams and managed testing",
      ],
      tools: ["Playwright", "Python", "TypeScript", "Azure DevOps", "UiPath Test Suite"],
      body: `## What we do

We build and run automated test suites that give release managers a clear answer: is this build safe to ship?

## Migration to Playwright

Many teams hold large regression suites in tools that are costly to license and slow to maintain. We migrate them to Playwright in a controlled way: pilot on a small batch, agree conversion standards, then move the remainder with progress tracked case by case.

## Engagement options

A fixed-scope automation project, a dedicated QA team that works inside your sprints, or managed testing against agreed service levels.`,
    },
    {
      slug: "project-catalysts",
      title: "Project Catalysts",
      icon: "rocket",
      tagline: "Delivery leadership and product builds that get to go-live.",
      summary:
        "Project management, business analysis and application development on Power Platform for teams that need to move faster than their capacity allows.",
      capabilities: [
        "Project and programme management",
        "Business analysis and requirements discovery",
        "Business apps on Microsoft Power Platform",
        "Application enhancement and support",
        "Delivery governance and status reporting",
        "Specialist staffing for automation, data and QA roles",
      ],
      tools: ["Power Apps", "Power Automate", "Dataverse", "SharePoint", "Azure DevOps"],
      body: `## What we do

We take a project from a stalled idea to a live system. That can mean running the project, writing the requirements, building the application, or all three.

## Typical work

- Workflow and governance applications on Power Platform
- Enhancement of existing business applications in sprints
- Discovery workshops and business requirement documents
- Delivery governance for multi-vendor programmes

## Staffing

When you need capacity and not a project, we place automation, data and QA engineers who work under your direction.`,
    },
  ];
  for (const [i, row] of serviceRows.entries()) {
    await db.insert(services).values({ ...row, order: i, published: true }).onConflictDoNothing({ target: services.slug });
  }

  // ---- Clients ----------------------------------------------------------
  // Published = names already shown on the current chiacon.com. Others stay hidden until
  // permission is confirmed; switch them on in /admin/clients.
  if (!(await db.select().from(clients).limit(1)).length) {
    const names: Array<[string, boolean]> = [
      ["Dabur", true],
      ["B. Braun", true],
      ["Aesculap", true],
      ["BGIS", true],
      ["Motherson", true],
      ["EXL", true],
      ["Axtria", true],
      ["Nestlé", false],
      ["G+D", false],
      ["Regal Rexnord", false],
    ];
    await db.insert(clients).values(names.map(([name, published], order) => ({ name, published, order })));
  }

  // ---- Case studies (anonymised) ---------------------------------------
  const caseRows = [
    {
      slug: "auditable-ai-insights-engine-fmcg",
      title: "Rebuilding an AI insights engine so that every figure can be traced",
      clientLabel: "A global FMCG company",
      industry: "FMCG & Consumer Goods",
      service: "Auditable AI",
      featured: true,
      summary:
        "An AI-written management report read well but could not be trusted. We redesigned the engine so that queries compute the numbers and the model only explains them.",
      challenge: `The business wanted automated, narrative insights on procurement and sales data, delivered by email to senior stakeholders. The first design asked a language model to read the data, do the calculations and write the commentary.

A claim-by-claim validation audit showed the problem: a large share of the statements in the report could not be traced back to the source data. For a report going to finance and business heads, that was a stop.`,
      approach: `We changed the architecture, not the prompt.

- **Deterministic aggregation.** All totals, variances and rankings are computed in SQL against the governed dataset.
- **Curated, parameterised tools.** The model can call a fixed set of approved queries. It cannot write free-form calculations.
- **Narration only.** The language model turns verified results into readable commentary and is not allowed to introduce new figures.
- **Regression test harness.** A fixed set of cases is re-run on every change, with each claim checked against source.`,
      outcome: `Every figure in the narrative now traces to a deterministic query, and the validation method is documented so that the client team can repeat the audit themselves. The regression harness guards against quality drift when data, prompts or models change.`,
      highlights: ["Queries compute, the model narrates", "Claim-by-claim faithfulness audit", "Regression harness on every release"],
      stack: ["SQL", "LLM narration", "Parameterised tools", "Regression testing"],
    },
    {
      slug: "provisioning-profitability-automation-gcc",
      title: "Provisioning and profitability reporting automated across GCC markets",
      clientLabel: "A consumer goods company, GCC finance",
      industry: "FMCG & Consumer Goods",
      service: "Data & Analytics",
      featured: true,
      summary:
        "Month-end provisioning moved from manual spreadsheets to an automated, controlled process, live in two markets and rolling out to two more.",
      challenge: `Regional finance teams prepared provisions and profitability views by hand each month, market by market. The work was slow, depended on a few individuals, and made it hard for the CFO's office to compare markets on a like-for-like basis.`,
      approach: `We worked with the finance team to standardise the provisioning logic, then automated data collection, calculation and reporting.

- One model for provisioning rules, configured per market
- Automated data preparation with reconciliation checks
- Profitability and provisioning reports for regional leadership
- Weekly status reporting to the finance sponsor through delivery`,
      outcome: `Provisioning is live in production in two GCC markets, with hypercare completed. Discovery is under way for two further markets using the same model, so each new country is a configuration exercise and not a new build.`,
      highlights: ["Live in two GCC markets", "Hypercare completed", "Two more markets in discovery"],
      stack: ["Power BI", "SQL", "Power Automate"],
    },
    {
      slug: "master-data-specification-bom-automation",
      title: "Automating specification and BOM changes in a master-data portal",
      clientLabel: "A consumer goods manufacturer",
      industry: "Manufacturing & Automotive",
      service: "Intelligent Process Automation",
      featured: true,
      summary:
        "Specification and bill-of-materials requests are created and changed in the master-data portal by an automation framework, in place of manual keying.",
      challenge: `Packaging, R&D and plant teams raise a steady flow of requests to create, change and copy material specifications and bills of materials. Each request was keyed into the master-data portal by hand: repetitive work with a real cost when an entry is wrong.`,
      approach: `We designed a framework that separates orchestration from portal interaction.

- **Power Automate** receives and orchestrates requests
- **Playwright** performs the steps in the master-data portal reliably and in parallel
- **A SQL data store** holds requests, status and a full run history

Delivery is sequenced: specification automation first, then BOM automation on the same framework.`,
      outcome: `The framework replaces a desktop-RPA design with a lighter, more maintainable stack, and gives the master-data team a status and history for every request. BOM automation reuses the same components.`,
      highlights: ["Power Automate + Playwright framework", "Full run history per request", "Specifications first, BOM next"],
      stack: ["Power Automate", "Playwright", "SQL Server"],
    },
    {
      slug: "uipath-to-playwright-test-migration",
      title: "Migrating a large regression suite from UiPath to Playwright",
      clientLabel: "A technology services company",
      industry: "Technology & IT Services",
      service: "Quality Assurance",
      featured: false,
      summary:
        "Around a thousand automated test cases are being moved from UiPath to Playwright, with an AI-assisted conversion approach piloted on a small batch first.",
      challenge: `The client's regression suite had grown to roughly a thousand automated cases in UiPath. Licence cost and maintenance effort were rising, and the engineering team wanted tests in code, alongside the product, in Playwright.`,
      approach: `- Agreed conversion standards and a target framework before migrating at volume
- Tracked progress case by case, with clear ownership on both sides
- Assessed AI-assisted conversion of UiPath workflows to Playwright in two steps, starting with a pilot of 20 to 30 cases to measure quality before scaling`,
      outcome: `The suite is moving to a code-based framework that the client's engineers can maintain and run in their pipeline. The pilot-first approach gives a measured basis for how much of the conversion can safely be automated.`,
      highlights: ["~1,000 test cases in scope", "Pilot-first AI-assisted conversion", "Tests in code, in the pipeline"],
      stack: ["Playwright", "Python", "UiPath"],
    },
  ];
  for (const [i, row] of caseRows.entries()) {
    await db.insert(caseStudies).values({ ...row, order: i, published: true }).onConflictDoNothing({ target: caseStudies.slug });
  }

  // ---- Insights ---------------------------------------------------------
  const newPosts = [
    {
      slug: "why-ai-pilots-stall-at-the-audit",
      title: "Why enterprise AI pilots stall at the audit",
      category: "Auditable AI",
      publishedAt: new Date("2026-11-10T04:00:00Z"),
      excerpt:
        "The demo goes well. Then someone asks where a number came from. Three questions decide whether an AI pilot reaches production, and none of them is about the model.",
      body: `Most AI pilots we are asked to review share a history. The demo went well. A sponsor was found. Users tried it. Then rollout stopped, usually after a meeting with finance, compliance or internal audit.

The cause is rarely model quality. It is that the solution cannot answer three plain questions.

## 1. Where did this answer come from?

If a response does not show the source, the record and the date the data was current, a reviewer has two options: trust it blindly or redo the work. Neither supports adoption. Citations are not a feature to add later. They shape how retrieval, storage and the interface are designed.

## 2. Do the numbers reconcile?

Language models are good at language. They are unreliable at arithmetic over large tables, and they are confident when wrong. If the model is adding, averaging or ranking, expect errors that look plausible.

The fix is architectural: compute in the database, narrate with the model.

## 3. Who approved it?

An answer that goes to a customer, a regulator or the board needs an owner. That means confidence thresholds, routing of doubtful cases to a named expert, and a record of who approved which version.

## What to do with a stalled pilot

Do not start by changing the model. Start with an assessment of the existing solution against these three questions, using real cases and a claim-by-claim review of the output. The result tells you whether to enhance what you have, re-engineer parts of it or rebuild, and what each option costs.`,
    },
    {
      slug: "let-sql-do-the-maths",
      title: "Let SQL do the maths: language models should narrate numbers, not compute them",
      category: "Auditable AI",
      publishedAt: new Date("2026-10-27T04:00:00Z"),
      excerpt:
        "Asking a language model to calculate your KPIs is the fastest route to a report nobody trusts. A simple division of labour fixes it.",
      body: `A common first design for AI reporting is to hand the model a dataset and ask for insights. It will produce them: fluent, well structured, and wrong in ways that are hard to spot.

## Why it goes wrong

A language model predicts text. When it writes "sales rose 12%", it has not necessarily divided one number by another. On small inputs it is often right. On real tables, with filters, currencies and partial periods, errors creep in, and nothing in the output tells you which sentence is affected.

## The division of labour

**Queries compute.** Every figure that will appear in the output is produced by a deterministic query against governed data.

**Tools are curated.** The model may only call a fixed set of approved, parameterised queries. It chooses which question to ask of the data; it does not write the calculation.

**The model narrates.** It receives verified results and turns them into commentary. It is instructed, and tested, not to introduce figures that were not in the results.

## How to prove it works

Take a sample of outputs. List every factual claim. Check each one against source. The share of claims that hold is your faithfulness score, and it is the number to show an audit committee.

Then turn that sample into a regression suite and run it whenever prompts, models or data change.

## What you gain

Reports that reconcile to the ledger, a method your own team can repeat, and an answer when someone asks how you know the AI is right.`,
    },
    {
      slug: "assess-before-you-build",
      title: "Assess before you build: the case for a decision gate",
      category: "Delivery",
      publishedAt: new Date("2026-10-13T04:00:00Z"),
      excerpt:
        "Fixed-price quotes for a system nobody has inspected are guesses. A short assessment with a signed-off gate protects both sides.",
      body: `When a client asks us to improve an existing automation or AI solution, the first request is usually for a price and a date. We can give a range. We cannot give a commitment worth having until we have seen the code, the data and the constraints.

## What an assessment covers

In two to four weeks we review the application and architecture, test output quality on real cases, check data sources for access, ownership and freshness, and confirm security and hosting requirements with IT.

## Three options, scored

Every assessment ends in the same choice: **enhance** what exists, **re-engineer** selected components, or **redevelop**. We score each option against criteria agreed at the start, with evidence, and with mandatory gates such as security that a high score elsewhere cannot offset.

## The decision gate

The output is a document, not a slide of intentions: current state, gap analysis, recommended option, target architecture, scope, plan and price. Business and IT sign it off before any build starts.

## Why this is better for the buyer

You pay a small, fixed fee to replace assumptions with facts. If the answer is that your existing solution is sound and needs modest work, you find out before funding a rebuild. If it does need rebuilding, you know why and what it will cost.`,
    },
  ];
  for (const row of newPosts) {
    await db.insert(posts).values({ ...row, published: true }).onConflictDoNothing({ target: posts.slug });
  }

  // Posts from the current Wix site, imported as DRAFTS with their original slugs so that old
  // /post/<slug> links redirect correctly. Paste each body from Wix in /admin/posts, then publish.
  const legacy: Array<[string, string, string, string, string]> = [
    ["how-to-choose-the-right-product-for-automation-testing", "How to Choose the Right Product for Automation Testing", "Quality Assurance", "2025-07-22", "Many automation testing tools promise to be faster and easier. What matters once the marketing noise fades?"],
    ["the-future-won-t-be-about-coding-it-ll-be-about-prompting-are-you-ready-to-speak-ai-s-language", "The future won't be about coding, it'll be about prompting. Are you ready to speak AI's language?", "AI", "2025-07-18", "Prompting is becoming a core skill as AI tools spread, much as search skills did a generation ago."],
    ["the-hidden-costs-of-manual-processes-and-how-ipa-solves-them", "The Hidden Costs of Manual Processes (And How IPA Solves Them)", "Intelligent Process Automation", "2025-07-15", "Manual work costs more than time: it costs money and morale. How intelligent process automation addresses it."],
    ["the-synergy-of-rpa-and-data-analytics-driving-intelligent-automation", "The Synergy of RPA and Data Analytics: Driving Intelligent Automation", "Intelligent Process Automation", "2025-06-21", "How combining process automation with analytics helps businesses optimise operations."],
    ["unlocking-efficiency-the-power-of-low-code-no-code-in-rpa-development", "Unlocking Efficiency: The Power of Low-Code/No-Code in RPA Development", "Intelligent Process Automation", "2025-06-17", "How low-code and no-code approaches speed up automation delivery."],
    ["how-ai-driven-rpa-and-data-analytics-are-shaping-business-in-2025", "How AI-Driven RPA and Data Analytics Are Shaping Business in 2025", "AI", "2025-06-16", "Pairing AI-driven automation with analytics is changing how businesses operate."],
    ["ai-user-feedback-integration-adapting-for-continuous-improvement-in-ai-performance", "AI User Feedback Integration: Adapting for Continuous Improvement in AI Performance", "AI", "2024-09-13", "Using user feedback to keep AI systems improving over time."],
    ["ai-bias-in-ai-models-addressing-unfair-and-unethical-outcomes", "AI Bias in AI Models: Addressing Unfair and Unethical Outcomes", "AI", "2024-09-12", "How bias in AI models produces unfair results, and what to do about it."],
    ["ai-factual-accuracy-ensuring-reliable-information-in-ai-systems", "AI Factual Accuracy: Ensuring Reliable Information in AI Systems", "AI", "2024-09-11", "Why factual accuracy matters for trustworthy AI systems."],
  ];
  for (const [slug, title, category, date, excerpt] of legacy) {
    await db
      .insert(posts)
      .values({
        slug,
        title,
        category,
        excerpt,
        published: false,
        publishedAt: new Date(`${date}T04:00:00Z`),
        body: "_Draft imported from the previous website. Paste the original article text here, then tick Published._",
      })
      .onConflictDoNothing({ target: posts.slug });
  }

  // ---- Jobs -------------------------------------------------------------
  const jobRows = [
    {
      slug: "tech-lead-data-analytics",
      title: "Tech Lead, Data & Analytics",
      department: "Data & Analytics",
      experience: "6+ years",
      summary: "Lead design and delivery of Power BI and Microsoft Fabric solutions for enterprise clients.",
      description: `## The role

You will lead the design and delivery of data and analytics solutions for our enterprise clients, and guide a team of engineers and analysts.

## What you will do

- Own solution design for data platforms, models and reporting
- Lead delivery on Power BI and Microsoft Fabric engagements
- Work directly with client finance and operations stakeholders
- Review the team's work and raise the standard of delivery

## What we look for

- 6+ years in data and analytics, with recent hands-on Power BI and SQL
- Experience leading a delivery team and facing clients
- Clear written and spoken communication`,
    },
    {
      slug: "it-business-development-manager",
      title: "IT Business Development Manager",
      department: "Business Development",
      experience: "4 to 10 years in IT sales",
      summary: "Build pipeline and close new enterprise accounts for our automation, AI and analytics services.",
      description: `## The role

You will open and grow enterprise accounts for Chiacon's automation, AI, analytics and QA services.

## What you will do

- Build and qualify a pipeline of enterprise opportunities
- Run the sales process from first meeting to signed statement of work
- Work with delivery leads on proposals and estimates
- Maintain accurate pipeline data in the CRM

## What we look for

- 4 to 10 years in IT services sales
- A record of closing new business with enterprise clients
- Understanding of automation, data or AI services`,
    },
    {
      slug: "qa-engineer-playwright",
      title: "QA Engineer (Playwright)",
      department: "Quality Assurance",
      experience: "3+ years",
      summary: "Design and build automated tests in Playwright for client web applications.",
      description: `## The role

You will design, build and maintain automated test suites in Playwright for our clients' applications.

## What you will do

- Write and maintain UI and API tests in Playwright
- Convert existing manual and legacy automated tests
- Integrate tests into CI pipelines and report results
- Work inside client sprint teams

## What we look for

- 3+ years in test automation, with hands-on Playwright
- Strong Python or TypeScript
- Careful, evidence-based defect reporting`,
    },
  ];
  for (const row of jobRows) {
    await db.insert(jobs).values({ ...row, location: "Gurugram, India", type: "Full-time", published: true }).onConflictDoNothing({ target: jobs.slug });
  }

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
