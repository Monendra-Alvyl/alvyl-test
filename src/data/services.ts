/*
 * Service pages (/services/<slug>) — one per Home "What we offer" card.
 * Copy is taken from the live site (www.alvyl.com): /design-service, /iot-and-cloud-service (SRE) and
 * /machine-learning-iot (all of it goes to IoT & Machine Learning). The live site has no Agentic AI page,
 * so that service's copy is new, as are the intros marked "new"; both should be confirmed.
 * Only named testimonials are shown (the live site's anonymous quotes are left out).
 */
import { asset } from '@/lib/asset'
import type { HeadingSegment } from './home'

export type ServiceBenefit = { title: string; body: string }
export type ServiceStep = { title: string; body: string }
export type ServiceFaq = { question: string; answer: string }

export type Service = {
  slug: string
  /** Card number on Home ("01"…"04"). */
  number: string
  title: string
  /** Hero headline lines. */
  titleLines: string[]
  intro: string
  image: string
  /** Search title and description (src/data/seo.ts). */
  seoTitle: string
  seoDescription: string
  capabilities: string[]
  benefits: ServiceBenefit[]
  /** "How we work": four steps from first call to results. */
  process: ServiceStep[]
  /** Service questions; the shared ones (sharedFaqs) follow them. Also FAQPage JSON-LD (seo.ts). */
  faqs: ServiceFaq[]
  testimonial?: { quote: string; name: string }
}

/*
 * new — the process steps and FAQs on every service page, the shared FAQs below and the rewritten SRE
 * and IoT intros and benefits are new copy (in the Agentic AI page's plain voice) to be confirmed.
 * The location line comes from the site's +91 contact number; add the city once it's confirmed.
 */
export const sharedFaqs: ServiceFaq[] = [
  {
    question: 'Where is Alvyl based?',
    answer:
      'Alvyl is based in India. We work with startups and enterprises in India and around the world, remotely and across time zones.',
  },
  {
    question: 'How does an engagement start?',
    answer:
      'With a discovery call. We learn your goals and constraints, then propose a scoped first phase with clear outcomes before any long-term commitment.',
  },
]

export const servicePage = {
  heroCta: { label: 'Schedule a Call', href: '/contact-us' },
  capabilitiesEyebrow: 'We build',
  /* Section headings carry the Alchemy italic accent, as every Figma section heading does. */
  capabilitiesHeading: [
    { text: 'What we ' },
    { text: 'build', accent: true },
  ] satisfies HeadingSegment[],
  benefitsEyebrow: 'Why Alvyl',
  benefitsHeading: [{ text: 'How we ' }, { text: 'help', accent: true }] satisfies HeadingSegment[],
  processEyebrow: 'How we work',
  processHeading: [
    { text: 'From first call to ' },
    { text: 'results', accent: true },
  ] satisfies HeadingSegment[],
  faqEyebrow: 'FAQ',
  faqHeading: [
    { text: 'Questions, ' },
    { text: 'answered', accent: true },
  ] satisfies HeadingSegment[],
  testimonialEyebrow: 'Client voice',
  otherEyebrow: 'Other services',
}

export const services: Service[] = [
  {
    slug: 'product-design',
    number: '01',
    title: 'End-to-End Product Design',
    titleLines: ['End-to-End', 'Product Design'],
    /* new */
    intro:
      'Clarity, empathy, and rhythm — from brand and UX research to UI, motion and the design systems that keep it all consistent.',
    image: asset('/assets/home/service-product-design.png'),
    seoTitle: 'Product Design Services: UX, UI & Branding | Alvyl',
    seoDescription:
      'Strategic, human-centered product design: UX and UI design, brand identity, mobile apps, design systems, motion and e-commerce design.',
    capabilities: [
      'Brand Designs',
      'User Experience (UX) Design',
      'User Interface (UI) Design',
      'Brand Identity Design',
      'Mobile Application Design',
      'System Design',
      'Brand Strategy and Positioning',
      'Augmented Reality Design',
      'Virtual Reality Design',
      'Motion Graphics Design',
      'Media Graphics Design',
      'SEO Design',
      'E-commerce Design',
    ],
    benefits: [
      {
        title: 'Strategic Design Thinking',
        body: 'Our design isn’t just about aesthetics; it’s about crafting meaningful experiences. Our creative team works diligently to grasp your brand, audience, and market, merging art with insights to create designs that align with your goals, giving you the edge you need.',
      },
      {
        title: 'Human-Centered Design',
        body: 'Experience empathy in design with our Human-Centered Design services. We focus on creating experiences that put your users at the heart, designing with compassion, inclusivity, and a deep understanding of your audience’s needs and experiences.',
      },
      {
        title: 'AI-Driven Design',
        body: 'Harness the transformative power of Artificial Intelligence with our AI-Driven Design services. Watch as your ideas take shape dynamically, evolving through a process that seamlessly integrates your vision with intelligent design automation and predictive algorithms.',
      },
      {
        title: 'Virtual User Testing',
        body: 'Venture into the digital landscape with our Virtual User Testing services. We empower you with actionable insights and feedback, crafting a virtual crucible where your designs are tested, honed, and perfected before they even touch the real world.',
      },
      {
        title: 'Voice User Interface (VUI) Design',
        body: 'Speak the language of the future with our Voice User Interface (VUI) Design services. As we design intuitive voice interactions for your brand, your users will experience a new dimension of convenience, engagement, and brand interaction.',
      },
      {
        title: 'Decode Complexity',
        body: 'Turn data into stories with our Data Visualization services. Our designs will transform your complex data sets into visually engaging narratives, fostering understanding and empowering decision-making.',
      },
    ],
    process: [
      {
        title: 'Discover',
        body: 'Research with your users and stakeholders to understand the problem, the market and what success looks like.',
      },
      {
        title: 'Define',
        body: 'User journeys, information architecture and a clear direction the whole team agrees on.',
      },
      {
        title: 'Design',
        body: 'Interfaces, prototypes and a design system, tested with real users and refined until they work.',
      },
      {
        title: 'Deliver',
        body: 'Developer-ready handoff, support while it’s built, and iteration once it’s in people’s hands.',
      },
    ],
    faqs: [
      {
        question: 'Do you also build what you design?',
        answer:
          'Yes. Our engineers can build it with you, or we hand your team developer-ready designs and a design system.',
      },
    ],
    testimonial: {
      quote:
        'They treat your project with the commitment and care as if it’s their own masterpiece.',
      name: 'Ratna Garba',
    },
  },
  {
    slug: 'site-reliability-engineering',
    number: '02',
    title: 'Site Reliability Engineering',
    titleLines: ['Site Reliability', 'Engineering'],
    /* new */
    intro:
      'Fewer incidents, faster recovery and reliability you can measure. We set clear targets, catch problems early and fix their causes, with your team or for it.',
    image: asset('/assets/home/service-sre.png'),
    seoTitle: 'Site Reliability Engineering (SRE) Services | Alvyl',
    seoDescription:
      'Managed SRE from India for teams worldwide: SLOs and error budgets, observability, incident response, chaos engineering, disaster recovery and postmortems.',
    capabilities: [
      'Incident Prevention',
      'Performance Optimization',
      'Security Fortification',
      'Continuous Automation',
      'Disaster Recovery',
      'Capacity Management',
      'Error Budgeting',
      'SLI/SLO Management',
      'Chaos Engineering',
      'Dependency Mapping',
      'System Observability',
      'Postmortem Analysis',
    ],
    benefits: [
      {
        title: 'Clear Reliability Targets',
        body: 'We agree SLIs and SLOs with you for the user journeys that matter, then use error budgets to balance shipping speed against stability.',
      },
      {
        title: 'See Problems Early',
        body: 'Metrics, logs and traces in one view, with alerts tuned to real user impact, so issues surface before customers notice, without the alert noise.',
      },
      {
        title: 'Calm, Fast Incident Response',
        body: 'Clear on-call rotations, runbooks and escalation paths, so incidents are handled quickly and the right people are involved.',
      },
      {
        title: 'Fix the Cause, Not the Symptom',
        body: 'Blameless postmortems after every major incident, with tracked follow-ups that stop the same failure from coming back.',
      },
      {
        title: 'Automate the Toil',
        body: 'Repetitive operational work, from deploys and scaling to recovery steps, becomes code, freeing your engineers for product work.',
      },
      {
        title: 'Ready for Peaks and Failures',
        body: 'Load testing, capacity planning, chaos experiments and tested disaster recovery, so traffic spikes and outages hold no surprises.',
      },
    ],
    process: [
      {
        title: 'Assess',
        body: 'We review your architecture, recent incidents and monitoring, and rank the biggest reliability risks.',
      },
      {
        title: 'Set targets',
        body: 'Together we define SLOs for the services that matter most and agree how error budgets guide releases.',
      },
      {
        title: 'Instrument & automate',
        body: 'We close observability gaps, tune alerting, write runbooks and automate the riskiest manual steps.',
      },
      {
        title: 'Run & improve',
        body: 'We work alongside your team, review every major incident and keep improving against the targets.',
      },
    ],
    faqs: [
      {
        question: 'Do you work with our existing team and tools?',
        answer:
          'Yes. We work inside your cloud, monitoring and incident tools, and can support your engineers or take reliability work off their hands.',
      },
      {
        question: 'Which platforms do you cover?',
        answer:
          'Cloud and container platforms, CI/CD pipelines, databases and the observability stack around them. We’ll confirm the fit for your setup on the first call.',
      },
    ],
  },
  {
    slug: 'agentic-ai',
    number: '03',
    title: 'Agentic AI',
    titleLines: ['Agentic AI'],
    /* new — the live site has no Agentic AI page; all copy for this service is new and should be confirmed */
    intro:
      'AI agents that plan, use your tools and get real work done — from customer support to back-office workflows — with your people in control.',
    image: asset('/assets/home/service-agentic-ai.png'),
    seoTitle: 'Agentic AI Development Company in India | Alvyl',
    seoDescription:
      'AI agents and copilots built in India that plan, use your tools and finish workflows: multi-agent orchestration, API integration, RAG and guardrails.',
    capabilities: [
      'AI Agents & Copilots',
      'Multi-Agent Orchestration',
      'Tool & API Integration',
      'Workflow Automation',
      'Knowledge Assistants (RAG)',
      'Guardrails & Human-in-the-Loop',
      'Agent Evaluation & Monitoring',
      'Model Selection & Fine-Tuning',
    ],
    benefits: [
      {
        title: 'Work, Not Just Answers',
        body: 'Our agents take action. They plan the steps, call your systems and finish the task, instead of stopping at a chat reply.',
      },
      {
        title: 'Built Into Your Systems',
        body: 'We connect agents to the tools you already use — CRMs, ticketing, databases and internal APIs — through secure, permissioned integrations.',
      },
      {
        title: 'Grounded in Your Knowledge',
        body: 'Agents answer from your own documents and data, and show their sources, so responses stay accurate and on-brand.',
      },
      {
        title: 'People Stay in Control',
        body: 'Approval steps, guardrails and clear limits on what each agent may do, so sensitive actions always get a human check.',
      },
      {
        title: 'Measured and Monitored',
        body: 'We test agents against real scenarios before launch, then track quality, cost and failures in production and keep improving them.',
      },
      {
        title: 'Start Small, Scale Fast',
        body: 'We begin with one high-value workflow, prove the result, then extend agents across your teams.',
      },
    ],
    process: [
      {
        title: 'Pick the workflow',
        body: 'We find one high-value, repeatable task and agree how success will be measured.',
      },
      {
        title: 'Prototype',
        body: 'A working agent connected to your tools and data, tested against real cases from your team.',
      },
      {
        title: 'Guard & launch',
        body: 'We add guardrails, approval steps and monitoring, then launch with the people who will use it.',
      },
      {
        title: 'Measure & extend',
        body: 'We track quality, cost and time saved, then extend agents to the next workflows.',
      },
    ],
    faqs: [
      {
        question: 'Is our data safe with AI agents?',
        answer:
          'Agents only get the access each task needs, sensitive actions wait for a human approval, and we can choose models and hosting that keep your data within your environment.',
      },
      {
        question: 'Which models do you use?',
        answer:
          'Whichever fits the task, cost and data rules: leading hosted models or open models you run yourself. We test the options on your own cases before choosing.',
      },
    ],
  },
  {
    slug: 'iot-machine-learning',
    number: '04',
    title: 'IoT & Machine Learning',
    titleLines: ['IoT & Machine', 'Learning'],
    /* new */
    intro:
      'Connected devices and machine learning that turn sensor data into decisions, from the device and the edge to the cloud and the dashboard.',
    image: asset('/assets/home/service-iot-ml.png'),
    seoTitle: 'IoT & Machine Learning Development | Alvyl',
    seoDescription:
      'IoT and machine learning from India: connected devices, edge computing, computer vision, predictive maintenance, anomaly detection and cloud dashboards.',
    capabilities: [
      'Computer Vision Solutions',
      'Neural Networks',
      'Speech Recognition and Synthesis',
      'Predictive Analytics',
      'Recommendation Systems',
      'Anomaly Detection',
      'IoT Device Management',
      'Edge Computing Services',
      'Data Analytics & Visualization',
      'Cloud Application Development',
      'Cloud Management & Integration',
      'Serverless Computing Services',
    ],
    benefits: [
      {
        title: 'From Device to Decision',
        body: 'We connect sensors, machines and gateways to the cloud, then turn their data into alerts, dashboards and actions your team can use.',
      },
      {
        title: 'Predict, Don’t React',
        body: 'Anomaly detection and predictive models flag failures and demand changes early, so maintenance and stock are planned, not rushed.',
      },
      {
        title: 'Vision on the Floor',
        body: 'Computer vision for inspection, counting and safety, running where it’s needed: on the device, at the edge or in the cloud.',
      },
      {
        title: 'Edge When It Matters',
        body: 'Models run on the device or gateway when speed, bandwidth or privacy demand it, and in the cloud when scale does.',
      },
      {
        title: 'Fleets You Can Manage',
        body: 'Provisioning, monitoring and over-the-air updates keep every device healthy, secure and up to date.',
      },
      {
        title: 'Secure by Design',
        body: 'Device identity, encrypted data and least-privilege access protect your devices, data and cloud from day one.',
      },
    ],
    process: [
      {
        title: 'Discover',
        body: 'We map your devices, your data and the decision you want to improve.',
      },
      {
        title: 'Prove it',
        body: 'A focused pilot on real data shows what the models and the hardware can deliver.',
      },
      {
        title: 'Build & connect',
        body: 'We build the device, edge and cloud pieces, plus the dashboards and alerts people use every day.',
      },
      {
        title: 'Scale & run',
        body: 'We roll out across sites, monitor devices and models, and retrain as conditions change.',
      },
    ],
    faqs: [
      {
        question: 'Can you work with our existing hardware?',
        answer:
          'Usually, yes. We start from the devices and data you already have, and recommend new sensors or gateways only where they’re needed.',
      },
      {
        question: 'Do we need a lot of data to start?',
        answer:
          'Not always. A pilot shows how much data the problem really needs, and we can begin collecting the right data while the first models are built.',
      },
    ],
  },
]

export const servicePath = (slug: string) => `/services/${slug}`
