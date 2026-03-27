import React from 'react'
import emailjs from '@emailjs/browser'

export default function MonitorPage({ activePage, onNavigate }) {
  const navItems = ['ABOUT', 'EXPERIENCE', 'PROJECTS', 'CONTACT']
  const isMobile = window.innerWidth < 768

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      height: '100%',
      fontFamily: 'Georgia, serif',
      background: '#fafafa',
      overflow: 'hidden',
    }}>

      {/* Left sidebar */}
      <div style={{
        width: isMobile ? '90px' : '180px',
        minWidth: isMobile ? '90px' : '180px',
        borderRight: '1px solid #ccc',
        padding: isMobile ? '16px 4px' : '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        background: '#f0f0f0',
        overflowY: 'auto',
      }}>
        {/* Logo / name — hide on mobile */}
        {!isMobile && (
          <div style={{
            fontFamily: 'Georgia, serif',
            fontWeight: 'bold',
            fontSize: '15px',
            color: '#1a1a2e',
            marginBottom: '20px',
            lineHeight: 1.3,
          }}>
            Geeran<br />Balaranjan
            <div style={{
              fontFamily: 'monospace',
              fontSize: '10px',
              fontWeight: 'normal',
              color: '#475569',
              marginTop: '2px',
              letterSpacing: '0.05em',
            }}>
              Portfolio
            </div>
          </div>
        )}

        {/* Nav items */}
        {navItems.map(item => (
          <div
            key={item}
            onClick={() => onNavigate(item.toLowerCase())}
            style={{
              fontFamily: 'monospace',
              fontSize: isMobile ? '9px' : '12px',
              letterSpacing: isMobile ? '0.04em' : '0.08em',
              color: activePage === item.toLowerCase() ? '#1a1a2e' : '#4a5568',
              cursor: 'pointer',
              padding: isMobile ? '10px 4px' : '6px 8px',
              borderRadius: '3px',
              background: activePage === item.toLowerCase() ? 'rgba(0,0,0,0.06)' : 'transparent',
              borderLeft: activePage === item.toLowerCase() ? '2px solid #1a1a2e' : '2px solid transparent',
              textAlign: isMobile ? 'center' : 'left',
              transition: 'all 0.15s',
              userSelect: 'none',
              wordBreak: 'break-word',
              lineHeight: 1.2,
            }}
            onMouseEnter={e => {
              if (activePage !== item.toLowerCase()) {
                e.currentTarget.style.color = '#1a1a2e'
                e.currentTarget.style.background = 'rgba(0,0,0,0.03)'
              }
            }}
            onMouseLeave={e => {
              if (activePage !== item.toLowerCase()) {
                e.currentTarget.style.color = '#4a5568'
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            {isMobile
              ? item
              : (activePage === item.toLowerCase() ? '• ' : '') + item
            }
          </div>
        ))}

        {/* Back to home */}
        <div
          onClick={() => onNavigate('home')}
          style={{
            fontFamily: 'monospace',
            fontSize: isMobile ? '14px' : '11px',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: isMobile ? '10px 4px' : '6px 8px',
            marginTop: isMobile ? '8px' : '16px',
            letterSpacing: '0.05em',
            textAlign: isMobile ? 'center' : 'left',
            transition: 'color 0.15s',
            userSelect: 'none',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#4a5568'}
          onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
        >
          {isMobile ? '←' : '← Home'}
        </div>
      </div>

      {/* Main content area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: isMobile ? '16px 12px' : '32px 40px',
        position: 'relative',
      }}>
        <PageContent page={activePage} />
      </div>
    </div>
  )
}

function PageContent({ page }) {
  const pages = {
    about:      <AboutPage />,
    experience: <ExperiencePage />,
    projects:   <ProjectsPage />,
    contact:    <ContactPage />,
  }
  return pages[page] || null
}

function AboutPage() {
  const photoStyle = {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
    borderRadius: '4px',
    display: 'block',
    background: '#e2e8f0',
  }

  return (
    <div style={{ maxWidth: '620px' }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#1a1a2e', margin: '0 0 8px 0' }}>
        About Me
      </h1>
      <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '0 0 24px 0' }} />

      {/* Intro line */}
      <p style={{ fontFamily: 'monospace', fontSize: '13px', color: '#1a1a2e', marginBottom: '20px', letterSpacing: '0.03em' }}>
        print("Hello, World!")
      </p>

      {/* Hero photo */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ width: '220px', height: '260px', overflow: 'hidden', borderRadius: '4px', margin: '0 auto' }}>
          <img src="/geeran.jpg" alt="Geeran" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover', objectPosition: 'top' }} />
        </div>
      </div>

      {/* Body text */}
      <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#475569', lineHeight: 1.85, marginBottom: '16px' }}>
        I'm Geeran, a third-year computer science student at Wilfrid Laurier University, pursuing a minor in leadership studies and a concentration in big data. For as long as I can remember, I've been drawn to solving problems and understanding how things worked. That curiosity eventually evolved into a passion for technology.
      </p>
      <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#475569', lineHeight: 1.85, marginBottom: '16px' }}>
        I began my programming journey in a grade ten computer science class. I remember thinking how cool it was to turn a few lines of code into a functional program, and since then, I've continued to challenge myself through hackathons, personal projects, and hands-on experience.
      </p>
      <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#475569', lineHeight: 1.85, marginBottom: '28px' }}>
        These days, I'm focused on building a strong foundation in software engineering and data, while also building projects that I think could have a real impact. I enjoy the process of learning, building, and improving, and I'm always looking for opportunities to grow both technically, and as a leader.
      </p>

      {/* Photo grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
        <div>
          <img src="/baby-geeran.PNG" alt="Baby Geeran" style={photoStyle} />
          <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#94a3b8', marginTop: '5px', textAlign: 'center' }}>early debugging session</p>
        </div>
        <div>
          <img src="/louis.PNG" alt="Geeran and Louis" style={{ ...photoStyle, objectPosition: 'top' }} />
          <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#94a3b8', marginTop: '5px', textAlign: 'center' }}>me & louis</p>
        </div>
        <div>
          <img src="/winningAtMchacks.JPG" alt="Winning at McHacks" style={photoStyle} />
          <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#94a3b8', marginTop: '5px', textAlign: 'center' }}>McHacks 2026 — top 3</p>
        </div>
      </div>
    </div>
  )
}

const EXPERIENCES = [
  {
    role: 'Software Engineer Intern',
    company: 'Riipen',
    period: 'January 2024 – April 2024',
    logo: '/riipen.png',
    bullets: [
      'Delivered three client-facing web applications by implementing responsive front-end components and integrating backend data flows using HTML, CSS, and JavaScript across production features and client requirements.',
      'Improved page load time by 30% by optimizing SQL queries and restructuring indexes in a MySQL database, reducing query latency and backend load on high-traffic endpoints and core application flows.',
      'Built a monitoring dashboard using JavaScript and Chart.js to visualize API latency, query performance, and user interaction metrics, reducing manual performance checks by 40% and improving issue response time by 25%.',
    ],
  },
  {
    role: 'Outreach Coordinator',
    company: 'Laurier Computing Society',
    period: 'August 2023 – April 2025',
    logo: '/lauriercomputingsociety.png',
    bullets: [
      'Facilitated communication between the Laurier Computing Society and first-year students, resulting in a 15% increase in first-year engagement with club events and workshops.',
      'Supported digital outreach efforts by maintaining event pages, optimizing communication workflows, and leveraging analytics to improve turnout, communication clarity, and response rates across multiple academic semesters.',
      'Planned and executed orientation sessions, networking events, and hands-on workshops for 200+ students, collaborating closely with executives, sponsors, and external partners to support student onboarding and professional development.',
    ],
  },
  {
    role: 'Social Media Coordinator',
    company: 'HawkHacks',
    period: 'September 2023 – April 2024',
    logo: '/hawkhacks.png',
    bullets: [
      'Developed and executed comprehensive social media strategies for HawkHacks, a hackathon run by Wilfrid Laurier University.',
      'Created and curated compelling content across social media platforms (TikTok, Instagram, LinkedIn) leading to a 20% growth in online engagement and event participation.',
      'Collaborated with the marketing, design, and event planning teams within the club to ensure cohesive branding and messaging across all platforms.',
    ],
  },
]

function ExperiencePage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#1a1a2e', margin: '0 0 8px 0' }}>
        Experience
      </h1>
      <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '0 0 4px 0' }} />
      <div>
        {EXPERIENCES.map(exp => <ExperienceCard key={exp.role + exp.company} exp={exp} />)}
      </div>
    </div>
  )
}

function ExperienceCard({ exp }) {
  const [open, setOpen] = React.useState(false)

  return (
    <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: open ? '20px' : '0' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '16px 0',
          cursor: 'pointer',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <img
            src={exp.logo}
            alt={exp.company}
            style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '4px', flexShrink: 0, background: '#f0f0f0', padding: '2px' }}
          />
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '15px', color: '#1a1a2e', fontWeight: 'bold' }}>
              {exp.role}
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#475569', marginTop: '2px' }}>
              {exp.company}
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#94a3b8', marginTop: '2px', letterSpacing: '0.03em' }}>
              {exp.period}
            </div>
          </div>
        </div>
        <span style={{
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#94a3b8',
          flexShrink: 0,
          paddingTop: '2px',
          display: 'inline-block',
          transition: 'transform 0.2s',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>
          ▾
        </span>
      </div>

      {open && (
        <ul style={{ margin: '0 0 4px 0', padding: '0 0 0 16px', listStyle: 'none' }}>
          {exp.bullets.map((b, i) => (
            <li key={i} style={{
              fontFamily: 'monospace',
              fontSize: '12px',
              color: '#475569',
              lineHeight: 1.75,
              marginBottom: '8px',
              display: 'flex',
              gap: '8px',
            }}>
              <span style={{ color: '#cbd5e1', flexShrink: 0 }}>—</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const PROJECTS = [
  {
    title: 'Pitch Coach',
    stack: 'React, Node.js, Express, OpenAI (GPT-4), Web Speech API, face-api.js',
    url: 'https://github.com/geeranbalaranjan/pitch-coach',
    bullets: [
      'Designed and built a full-stack AI-powered pitch coaching platform that provides real-time feedback on speech clarity, pacing, and filler words using React, Express, and GPT-4o during live and recorded pitches.',
      'Integrated speech-to-text pipelines and linguistic analysis to extract delivery metrics, enabling structured, actionable feedback for public speaking, interviews, and startup pitch presentations.',
      'Implemented facial expression analysis with face-api.js to evaluate emotional delivery, engagement, and expressiveness during spoken pitches, combining visual signals with speech-based metrics into a unified, multimodal coaching experience.',
    ],
  },
  {
    title: 'TradeRisk',
    stack: 'Python, Gemini API, React (Next.js), Backboard.io, Trade Data APIs',
    url: 'https://github.com/geeranbalaranjan/trade-risk',
    bullets: [
      'Built a machine learning pipeline that analyzes trade risks using Python, React (Next.js), and Backboard.io to model the downstream economic impact of tariffs and geopolitical policy shocks across 200+ global trading partners.',
      'Trained convolutional neural networks on historical trade flows, tariff schedules, and macroeconomic indicators using Python and Gemini API, enabling prediction of import/export volatility, sector-level exposure, and systemic trade risk.',
      'Processed and normalized millions of raw trade records into a unified analytical dataset, enabling sub-second risk projections across countries, industries, and policy scenarios.',
    ],
  },
  {
    title: 'CareCompass',
    stack: 'TypeScript, React (Next.js), FastAPI, Google Maps API, Athena AI',
    url: 'https://github.com/geeranbalaranjan/CareCompass',
    bullets: [
      'Developed an AI-driven healthcare routing platform that guides users to the fastest appropriate care by evaluating medical urgency, wait times, and travel constraints rather than defaulting to proximity.',
      'Integrated a FastAPI backend using Google Maps APIs and an AI reasoning layer to deliver real-time, explainable routing recommendations that account for medical urgency, travel time, and location-based constraints.',
      'Achieved Top 3 in the Athena AI Agent Challenge at McHacks 2026 for building a real-time healthcare decision system.',
    ],
  },
  {
    title: 'Bizy',
    stack: 'Next.js 14, TypeScript, Tailwind CSS, Google Gemini AI, Auth0',
    url: 'https://github.com/geeranbalaranjan/bizy',
    liveUrl: 'https://bizy-lovat.vercel.app/',
    bullets: [
      'Built an AI-powered platform supporting Canadian small business founders with a viability scan, launch roadmap, compliance hub, and instant storefront using Next.js, TypeScript, and Tailwind CSS.',
      'Integrated Google Gemini AI to generate actionable insights for business strategy, automate market research, and provide instant recommendations on compliance, feasibility, and growth opportunities for early-stage ventures.',
      'Implemented secure authentication with Auth0, modular React components, and global state management using context and custom hooks to ensure seamless onboarding, real-time user feedback, and scalable application performance.',
    ],
  },
  {
    title: 'LegacySec',
    stack: 'Python, COBOL, Rule-based Scanning, JSON/HTML Reporting',
    url: 'https://github.com/geeranbalaranjan/legacy-code-security-scanner',
    bullets: [
      'Developed an offline-first MVP security scanner for legacy codebases, starting with COBOL, to address challenges in modernizing legacy enterprise systems at IBM using Python, rule-driven analysis, and automated reporting.',
      'Implemented COBOL-aware line scanning with comment filtering, severity tagging, and remediation suggestions, producing structured JSON/HTML reports with file, line, snippet, and severity metadata to support CI/CD workflows.',
      'Designed an extensible ruleset system with YAML-based definitions, supporting regex patterns, conditional matching, CWE references, and multi-language adaptability, enabling developers to customize scans for legacy code security requirements.',
    ],
  },
  {
    title: 'Scanalytics',
    stack: 'Next.js, React, Tailwind CSS, Python, FastAPI, PostgreSQL (JSONB), Docker, Gemini AI',
    url: 'https://github.com/geeranbalaranjan/scanalytics',
    liveUrl: 'https://scanalytics.tech',
    bullets: [
      'Built an AI-native custom analytics platform that inverts the traditional analytics model — instead of adapting data to a fixed schema, users describe their product and the AI Architect generates a bespoke JavaScript SDK with domain-specific tracking methods (e.g., analytics.trackCatMeow()).',
      'Designed a "Generic Storage, Custom Interface" architecture using PostgreSQL JSONB for schema-less event ingestion via a Python FastAPI backend, enabling universal compatibility across any product type without schema migrations.',
      'Integrated a Gemini-powered AI Analyst that writes custom SQL queries on the fly as data flows in, automatically generating a tailored dashboard with insights relevant to each user\'s specific business goals.',
    ],
  },
  {
    title: 'Backchannel',
    stack: 'Next.js 14, TypeScript, Tailwind CSS, Supabase (Auth, Postgres, Realtime)',
    url: 'https://github.com/geeranbalaranjan/backchannel',
    bullets: [
      'Built a live classroom chat platform — "Twitch chat for lectures" — where students join via QR code and chat under a pseudonym, while instructors see real identities and can pin, hide, and mute in a dedicated teacher view.',
      'Architected a privacy-first identity model using Supabase Auth (Google OAuth) and a server-only service role key: real names and emails are never sent to the client or included in Realtime payloads, and join secrets are validated exclusively server-side.',
      'Implemented real-time upvotes, emoji reactions, and a pinned-questions panel using Supabase Realtime subscriptions, with relative timestamps (mm:ss since lecture start) and a session lock that blocks new joins on demand.',
    ],
  },
  {
    title: 'Job Scraper',
    stack: 'JavaScript, Chrome Extension (Manifest V3), HTML, CSS',
    url: 'https://github.com/geeranbalaranjan/job-scraper-chrome-extension',
    bullets: [
      'Built a Manifest V3 Chrome extension that lets non-technical users scrape any website with a single click, with everything running locally — no backend servers or external APIs, and data never leaving the browser.',
      'Implemented configurable CSS selector-based scraping with default presets for Gmail, LinkedIn, and Indeed, and an optional "Load more" click-through for infinite scroll pages, with real-time popup metrics (pages, items, duration).',
      'Supported flexible data export as CSV, JSON, or clipboard copy, with a customizable settings pane for editing list and detail selectors via a JSON array interface.',
    ],
  },
  {
    title: 'OS Kernel Sample',
    stack: 'ANSI C, GNU Make, GRUB, QEMU, GitHub Actions',
    url: 'https://github.com/geeranbalaranjan/os-kernel',
    bullets: [
      'Built a modular, multiboot-compliant kernel from scratch covering bootloader setup, memory management (bump & buddy allocators), a round-robin process scheduler with context switching, an in-memory RAM-disk filesystem, and basic VGA/keyboard/PIT timer drivers.',
      'Wrote host-mode unit tests with AddressSanitizer targeting ≥80% code coverage for core modules, plus allocator and scheduler benchmarks via make bench, keeping kernel logic independently testable without booting.',
      'Set up a GitHub Actions CI pipeline that builds the ISO, runs host unit tests, and executes QEMU smoke tests on every push, ensuring the kernel boots correctly under both QEMU and bare-metal targets.',
    ],
  },
  {
    title: 'Password Visualizer',
    stack: 'React, TypeScript, Vite, CSS',
    url: 'https://github.com/geeranbalaranjan/password-visualizer',
    bullets: [
      'Built a client-side password strength analyzer that calculates entropy-based scoring (0–100) and detects predictable patterns — repeats, sequences, years, and common words — with no network requests; passwords never leave the browser.',
      'Implemented a segmented strength meter grading passwords from Very Weak to Excellent, surfacing specific deductions as "issues found" and actionable improvement tips as interactive pills.',
      'Added a one-click strong passphrase generator alongside Show/Hide and Copy utilities, built entirely with React hooks (useState, useMemo) and pure CSS — no external UI dependencies.',
    ],
  },
  {
    title: 'Previous Portfolio',
    stack: 'React, Next.js, Tailwind CSS, Three.js, React Three Fiber, Netlify',
    url: 'https://github.com/geeranbalaranjan/geeranportfolio',
    bullets: [
      'Designed and built a personal portfolio site with interactive 3D elements and animations using Three.js and React Three Fiber, featuring a cyberpunk-inspired UI with responsive layout across desktop and mobile.',
      'Structured the site with dedicated sections for projects, resume, and contact, built with React and Next.js for fast rendering and clean routing.',
      'Deployed on Netlify with a component-driven architecture using Tailwind CSS for consistent, maintainable styling.',
    ],
  },
  {
    title: 'Dating App Frontend',
    stack: 'JavaScript, HTML, CSS',
    url: 'https://github.com/geeranbalaranjan/dating-app-frontend',
    bullets: [
      'Built a responsive social platform interface using JavaScript and HTML/CSS, implementing dynamic profile rendering, conditional matching logic, and reusable component architecture to support scalable feature growth.',
      'Developed complex state-driven UI flows for swiping, filtering, and user preference management, optimizing state updates and reducing unnecessary re-renders to improve perceived responsiveness under active usage.',
      'Implemented responsive layout systems using CSS Flexbox and media queries, ensuring consistent rendering across desktop and mobile breakpoints while maintaining reusable styling patterns for long-term maintainability.',
    ],
  },
]

function ProjectCard({ project }) {
  const [open, setOpen] = React.useState(false)

  return (
    <div style={{
      borderBottom: '1px solid #e2e8f0',
      paddingBottom: open ? '20px' : '0',
    }}>
      {/* Header row — always visible */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '16px 0',
          cursor: 'pointer',
          gap: '12px',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '15px', color: '#1a1a2e', fontWeight: 'bold' }}>
              {project.title}
            </span>
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ fontFamily: 'monospace', fontSize: '10px', color: '#94a3b8', letterSpacing: '0.05em', textDecoration: 'none', borderBottom: '1px solid #e2e8f0' }}
              onMouseEnter={e => e.currentTarget.style.color = '#475569'}
              onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
            >
              GitHub ↗
            </a>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                onClick={e => e.stopPropagation()}
                style={{ fontFamily: 'monospace', fontSize: '10px', color: '#94a3b8', letterSpacing: '0.05em', textDecoration: 'none', borderBottom: '1px solid #e2e8f0' }}
                onMouseEnter={e => e.currentTarget.style.color = '#475569'}
                onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
              >
                Live ↗
              </a>
            )}
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#94a3b8', marginTop: '4px', letterSpacing: '0.03em' }}>
            {project.stack}
          </div>
        </div>
        <span style={{
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#94a3b8',
          flexShrink: 0,
          paddingTop: '2px',
          transition: 'transform 0.2s',
          display: 'inline-block',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>
          ▾
        </span>
      </div>

      {/* Dropdown body */}
      {open && (
        <ul style={{ margin: '0 0 4px 0', padding: '0 0 0 16px', listStyle: 'none' }}>
          {project.bullets.map((b, i) => (
            <li key={i} style={{
              fontFamily: 'monospace',
              fontSize: '12px',
              color: '#475569',
              lineHeight: 1.75,
              marginBottom: '8px',
              display: 'flex',
              gap: '8px',
            }}>
              <span style={{ color: '#cbd5e1', flexShrink: 0 }}>—</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ProjectsPage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#1a1a2e', margin: '0 0 8px 0' }}>
        Projects
      </h1>
      <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '0 0 4px 0' }} />
      <div>
        {PROJECTS.map(p => <ProjectCard key={p.title} project={p} />)}
      </div>
    </div>
  )
}

function ContactPage() {
  const formRef = React.useRef(null)
  const [form, setForm] = React.useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = React.useState(false)
  const [status, setStatus] = React.useState(null) // null | 'success' | 'error'

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      setForm({ name: '', email: '', message: '' })
      setStatus('success')
    } catch (error) {
      console.error('EmailJS Error:', error)
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#1a1a2e',
    background: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  }

  const labelStyle = {
    display: 'block',
    fontFamily: 'monospace',
    fontSize: '11px',
    letterSpacing: '0.08em',
    color: '#475569',
    marginBottom: '6px',
    textTransform: 'uppercase',
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#1a1a2e', margin: '0 0 8px 0' }}>
        Contact
      </h1>
      <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '0 0 8px 0' }} />
      <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#94a3b8', marginBottom: '28px', lineHeight: 1.6 }}>
        Send me a message and I'll get back to you.
      </p>

      <form ref={formRef} onSubmit={handleSubmit} style={{ maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label style={labelStyle}>Name</label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your name"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#1a1a2e'}
            onBlur={e => e.target.style.borderColor = '#ccc'}
          />
        </div>

        <div>
          <label style={labelStyle}>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#1a1a2e'}
            onBlur={e => e.target.style.borderColor = '#ccc'}
          />
        </div>

        <div>
          <label style={labelStyle}>Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows={5}
            placeholder="What's on your mind?"
            style={{ ...inputStyle, resize: 'vertical', minHeight: '110px' }}
            onFocus={e => e.target.style.borderColor = '#1a1a2e'}
            onBlur={e => e.target.style.borderColor = '#ccc'}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            alignSelf: 'flex-start',
            padding: '9px 22px',
            fontFamily: 'monospace',
            fontSize: '12px',
            letterSpacing: '0.08em',
            color: '#fafafa',
            background: loading ? '#94a3b8' : '#1a1a2e',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
          }}
        >
          {loading ? 'SENDING...' : 'SEND MESSAGE'}
        </button>

        {status === 'success' && (
          <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#16a34a' }}>
            Message sent! I'll be in touch soon.
          </p>
        )}
        {status === 'error' && (
          <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#dc2626' }}>
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </div>
  )
}
