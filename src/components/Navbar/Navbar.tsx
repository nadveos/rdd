// src/components/Navbar/Navbar.tsx
import { useState, useEffect } from 'react';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Música',   href: '#musica' },
  { label: 'Giras',    href: '#giras' },
  { label: 'Bio',      href: '#bio' },
  { label: 'Media',    href: '#media' },
  { label: 'Prensa',   href: '#prensa' },
  { label: 'Contacto', href: '#contacto' },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLink = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Navegación principal">
        <a href="#hero" className="navbar__logo" onClick={() => handleLink('#hero')}>
          Raúl Domingo
        </a>

        {/* Desktop links */}
        <div className="navbar__links" role="menubar">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="navbar__link"
              role="menuitem"
              onClick={(e) => { e.preventDefault(); handleLink(link.href); }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contacto"
            className="btn btn--primary navbar__cta"
            onClick={(e) => { e.preventDefault(); handleLink('#contacto'); }}
          >
            Contratar
          </a>
        </div>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`navbar__mobile${menuOpen ? ' open' : ''}`} role="dialog" aria-modal="true">
        <button className="navbar__mobile-close" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">
          ✕
        </button>
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="navbar__link"
            onClick={(e) => { e.preventDefault(); handleLink(link.href); }}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contacto"
          className="btn btn--primary"
          onClick={(e) => { e.preventDefault(); handleLink('#contacto'); setMenuOpen(false); }}
        >
          Contratar
        </a>
      </div>
    </>
  );
}
