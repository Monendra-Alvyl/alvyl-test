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
  testimonial?: { quote: string; name: string }
}

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
    /* new, from the live page's "System Resilience" block */
    intro:
      'Service disruption is the antithesis of customer trust. Our expertly managed SRE services prioritize your uptime.',
    image: asset('/assets/home/service-sre.png'),
    seoTitle: 'Site Reliability Engineering (SRE) Services | Alvyl',
    seoDescription:
      'Managed Site Reliability Engineering: incident prevention, SLI/SLO management, observability, chaos engineering, disaster recovery and postmortem analysis.',
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
        title: 'System Resilience',
        body: 'In the digital ecosystem, service disruption is the antithesis of customer trust. Alvyl’s expertly managed Site Reliability Engineering (SRE) services prioritize your uptime, eliminating this risk.',
      },
      {
        title: 'Proactive Incident Management',
        body: 'Alvyl’s SRE team leverages machine learning for real-time, intelligent monitoring and predictive analytics. We preempt potential system failures, turning them into actionable insights.',
      },
      {
        title: 'Adaptable SRE Frameworks',
        body: 'We offer tailored SRE frameworks that align with your specific system architecture, traffic patterns, and peak load times, delivering precision-engineered solutions.',
      },
      {
        title: 'Efficient Scalability',
        body: 'Our SRE solutions ensure system reliability accommodates your business growth. Through continuous load testing, performance tuning, and capacity planning, we maintain optimal service performance.',
      },
      {
        title: 'Enhanced Security Measures',
        body: 'Alvyl’s SRE services integrate advanced security measures, including intrusion detection systems and vulnerability assessments, directly into your infrastructure.',
      },
      {
        title: 'Root Cause Analysis',
        body: 'Our incident response protocols facilitate quick issue mitigation. Post-incident, we conduct rigorous postmortem analysis to isolate root causes and prevent recurrence.',
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
    seoTitle: 'Agentic AI Development: AI Agents & Copilots | Alvyl',
    seoDescription:
      'AI agents and copilots that plan, use your tools and finish workflows: multi-agent orchestration, API integration, knowledge assistants and guardrails.',
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
  },
  {
    slug: 'iot-machine-learning',
    number: '04',
    title: 'IoT & Machine Learning',
    titleLines: ['IoT & Machine', 'Learning'],
    intro:
      'With Alvyl by your side, innovation becomes an exhilarating journey. Our cutting-edge AI technologies, coupled with our unwavering expertise, pave the way for breakthroughs and ignite the spark of imagination.',
    image: asset('/assets/home/service-iot-ml.png'),
    seoTitle: 'IoT & Machine Learning Development | Alvyl',
    seoDescription:
      'Machine learning and IoT: computer vision, predictive analytics, anomaly detection, IoT device management, edge computing and cloud services.',
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
        title: 'Unlock Your Data',
        body: 'Data isn’t just numbers; it’s a strategic tool. Our advanced analytics can unlock your data’s potential, helping you identify trends, drive innovation, and stay ahead.',
      },
      {
        title: 'Flexible Growth',
        body: 'Our Cloud services offer you the flexibility to grow at your pace. Secure, scalable infrastructure meets your needs, saving time and cost. You only pay for what you use.',
      },
      {
        title: 'Actionable Strategies',
        body: 'Harness the full potential of your data with Alvyl’s AI-driven insights. Uncover the hidden intricacies of customer behavior, predict demand with uncanny accuracy, and optimize your supply chain with unparalleled precision.',
      },
      {
        title: 'Stay Ahead',
        body: 'In a dynamic and fiercely competitive landscape, staying ahead is paramount. We equip you with the tools to surge forward, foreseeing trends, optimizing processes, and delivering unparalleled customer experiences.',
      },
      {
        title: 'Security Comes First',
        body: 'We prioritize your data’s safety. Our security measures protect your IoT devices and Cloud infrastructure. With Alvyl, focus on your core business; we’ve got your security covered.',
      },
    ],
  },
]

export const servicePath = (slug: string) => `/services/${slug}`
