import { useState } from 'react'
import useRoomStore from '../store/useRoomStore'
import AboutSection from './sections/AboutSection'
import ProjectsSection from './sections/ProjectsSection'
import SkillsSection from './sections/SkillsSection'
import ExperienceSection from './sections/ExperienceSection'
import ContactSection from './sections/ContactSection'

const TABS = ['about', 'projects', 'skills', 'experience', 'contact']

const SECTION_MAP = {
  about: AboutSection,
  projects: ProjectsSection,
  skills: SkillsSection,
  experience: ExperienceSection,
  contact: ContactSection,
}

export default function PortfolioUI() {
  const sceneMode     = useRoomStore((s) => s.sceneMode)
  const activeSection = useRoomStore((s) => s.activeSection)
  const setSceneMode  = useRoomStore((s) => s.setSceneMode)
  const setActiveSection = useRoomStore((s) => s.setActiveSection)

  const isOpen = sceneMode === 'ui-open'
  const currentTab = activeSection || 'about'
  const ActiveSection = SECTION_MAP[currentTab] || AboutSection

  return (
    <div style={styles.overlay}>
      {/* Slide-in panel from right */}
      <div style={{ ...styles.panel, transform: isOpen ? 'translateX(0)' : 'translateX(110%)' }}>
        {/* Close button */}
        <button
          style={styles.closeBtn}
          onClick={() => setSceneMode('exploring')}
          aria-label="Close panel"
        >
          ✕
        </button>

        {/* Tab nav */}
        <nav style={styles.nav}>
          {TABS.map((tab) => (
            <button
              key={tab}
              style={{
                ...styles.tabBtn,
                ...(currentTab === tab ? styles.tabActive : {}),
              }}
              onClick={() => setActiveSection(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        {/* Section content */}
        <div style={styles.content}>
          <ActiveSection />
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 10,
  },
  panel: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '420px',
    height: '100%',
    background: 'rgba(18, 10, 28, 0.94)',
    backdropFilter: 'blur(16px)',
    borderLeft: '1px solid rgba(255, 45, 136, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    color: '#e8e0f0',
    fontFamily: 'system-ui, sans-serif',
    pointerEvents: 'auto',
    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'transparent',
    border: 'none',
    color: '#e8e0f0',
    fontSize: '20px',
    cursor: 'pointer',
    lineHeight: 1,
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'color 0.2s',
  },
  nav: {
    display: 'flex',
    gap: '4px',
    padding: '24px 20px 0',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    flexWrap: 'wrap',
  },
  tabBtn: {
    background: 'transparent',
    border: 'none',
    color: '#9080a0',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    padding: '10px 14px',
    letterSpacing: '0.5px',
    borderBottom: '2px solid transparent',
    transition: 'color 0.2s, border-color 0.2s',
    textTransform: 'uppercase',
  },
  tabActive: {
    color: '#ff2d88',
    borderBottom: '2px solid #ff2d88',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '32px 28px',
  },
}
