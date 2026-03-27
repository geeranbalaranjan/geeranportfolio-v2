import { useEffect, useState } from 'react'
import useRoomStore from '../store/useRoomStore'
import MonitorPage from './MonitorPage'

const NAV_ITEMS = ['ABOUT', 'EXPERIENCE', 'PROJECTS', 'CONTACT']

const URL_MAP = {
  home:       'geeran.me',
  about:      'geeran.me/about',
  experience: 'geeran.me/experience',
  projects:   'geeran.me/projects',
  contact:    'geeran.me/contact',
}

export default function MonitorUI() {
  const cameraState         = useRoomStore(s => s.cameraState)
  const monitorScreenBounds = useRoomStore(s => s.monitorScreenBounds)

  const [ready, setReady]           = useState(false)
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    if (cameraState !== 'monitor') { setReady(false); return }
    const t = setTimeout(() => setReady(true), 1300)
    return () => clearTimeout(t)
  }, [cameraState])

  useEffect(() => {
    if (!ready) setCurrentPage('home')
  }, [ready])

  if (!ready) return null
  if (!monitorScreenBounds || monitorScreenBounds.width < 10) return null

  const { left: rawLeft, top: rawTop, width: rawWidth, height: rawHeight, clipPoints } = monitorScreenBounds

  const vw = window.innerWidth
  const vh = window.innerHeight
  const top    = Math.max(0, rawTop)
  const left   = Math.max(0, rawLeft)
  const width  = Math.min(rawWidth,  vw - left)
  const height = Math.min(rawHeight, vh - top)

  // Shift clip points if top was clamped
  const topOffset  = top  - rawTop
  const leftOffset = left - rawLeft
  const clipPath = clipPoints && clipPoints.length >= 3
    ? `polygon(${clipPoints.map(p => `${p.x - leftOffset}px ${p.y - topOffset}px`).join(', ')})`
    : undefined

  return (
    <div style={{
      position: 'fixed',
      left,
      top,
      width,
      height,
      zIndex: 10,
      clipPath,
      overflowY: 'auto',
      overflowX: 'hidden',
      WebkitOverflowScrolling: 'touch',
      background: '#fafafa',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      pointerEvents: 'auto',
      fontFamily: 'Georgia, serif',
    }}>

      {/* Windows-style chrome */}
      <div style={{
        height: '42px',
        background: '#e8ede8',
        borderBottom: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        padding: '0 0 0 16px',
        flexShrink: 0,
      }}>
        {/* Tab */}
        <div style={{
          background: '#fafafa',
          borderTop: '2px solid #4a5568',
          borderLeft: '1px solid #ccc',
          borderRight: '1px solid #ccc',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          fontSize: '12px',
          fontFamily: 'monospace',
          color: '#333',
          gap: '8px',
        }}>
          Portfolio
        </div>

        {/* URL bar */}
        <div style={{
          flex: 1,
          margin: '8px 12px',
          background: '#fff',
          borderRadius: '20px',
          border: '1px solid #ccc',
          height: '26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontFamily: 'monospace',
          color: '#555',
          gap: '6px',
        }}>
          {URL_MAP[currentPage] || 'geeran.me'}
        </div>

        {/* Windows control buttons */}
        <div style={{ display: 'flex', height: '100%' }}>
          {['─', '□', '×'].map((symbol, i) => (
            <div key={i} style={{
              width: '46px',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: i === 2 ? '16px' : '14px',
              color: '#666',
              cursor: 'pointer',
              fontFamily: 'monospace',
              background: 'transparent',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = i === 2 ? '#e81123' : '#e0e0e0'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {symbol}
            </div>
          ))}
        </div>
      </div>

      {/* Content area — home or page */}
      {currentPage === 'home' ? (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Main content */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '8px',
            padding: '16px',
          }}>
            <h1 style={{
              fontSize: 'clamp(26px, 4vw, 52px)',
              fontWeight: 'bold',
              color: '#1a1a2e',
              margin: 0,
              fontFamily: 'Georgia, serif',
              lineHeight: 1.1,
            }}>
              Geeran Balaranjan
            </h1>
            <p style={{
              fontSize: 'clamp(13px, 1.2vw, 16px)',
              color: '#475569',
              fontFamily: 'monospace',
              letterSpacing: '0.2em',
              margin: 0,
              textTransform: 'uppercase',
            }}>
              Software Engineer
            </p>

            <div style={{ width: '30px', height: '1px', background: '#ccc', margin: '4px 0' }} />
            <nav style={{ display: 'flex', gap: 'clamp(8px, 2vw, 32px)', flexWrap: 'wrap', justifyContent: 'center' }}>
              {NAV_ITEMS.map(section => (
                <span
                  key={section}
                  onClick={() => setCurrentPage(section.toLowerCase())}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#1a1a2e'
                    e.currentTarget.style.borderBottomColor = '#1a1a2e'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#4a5568'
                    e.currentTarget.style.borderBottomColor = 'transparent'
                  }}
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 'clamp(12px, 1vw, 14px)',
                    letterSpacing: '0.15em',
                    color: '#4a5568',
                    cursor: 'pointer',
                    paddingBottom: '2px',
                    borderBottom: '1px solid transparent',
                    userSelect: 'none',
                  }}
                >
                  {section}
                </span>
              ))}
            </nav>
          </div>

          {/* Social links */}
          <div style={{
            display: 'flex',
            gap: 'clamp(16px, 2.5vw, 28px)',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 16px 24px',
            flexShrink: 0,
          }}>
            <a href="https://github.com/geeranbalaranjan" target="_blank" rel="noopener noreferrer"
              style={{ color: '#4a5568', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => e.currentTarget.style.color = '#1a1a2e'}
              onMouseLeave={e => e.currentTarget.style.color = '#4a5568'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/geeranbalaranjan/" target="_blank" rel="noopener noreferrer"
              style={{ color: '#4a5568', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => e.currentTarget.style.color = '#0077b5'}
              onMouseLeave={e => e.currentTarget.style.color = '#4a5568'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="https://x.com/GeeranBala" target="_blank" rel="noopener noreferrer"
              style={{ color: '#4a5568', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => e.currentTarget.style.color = '#000'}
              onMouseLeave={e => e.currentTarget.style.color = '#4a5568'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://substack.com/@geeranbalaranjan" target="_blank" rel="noopener noreferrer"
              style={{ color: '#4a5568', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ff6719'}
              onMouseLeave={e => e.currentTarget.style.color = '#4a5568'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
              </svg>
            </a>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
          <MonitorPage activePage={currentPage} onNavigate={setCurrentPage} />
        </div>
      )}

      {/* Scanline overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.02) 3px, rgba(0,0,0,0.02) 4px)',
        pointerEvents: 'none',
      }} />
    </div>
  )
}
