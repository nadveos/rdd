// src/components/Footer/Footer.tsx
import './Footer.css';

const NAV_LINKS = [
  { label: 'Música',   href: '#musica' },
  { label: 'Giras',    href: '#giras' },
  { label: 'Bio',      href: '#bio' },
  { label: 'Media',    href: '#media' },
  { label: 'Prensa',   href: '#prensa' },
  { label: 'Contacto', href: '#contacto' },
];

const SOCIAL = [
  { icon: '📸', label: 'Instagram', href: 'https://instagram.com' },
  { icon: '▶',  label: 'YouTube',   href: 'https://youtube.com' },
  { icon: '♬',  label: 'TikTok',   href: 'https://tiktok.com' },
  { icon: '🎵', label: 'Spotify',   href: 'https://open.spotify.com' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__inner">
          <div>
            <p className="footer__logo">Raúl Domingo</p>
            <p className="footer__tagline">Folklore de Vanguardia</p>
          </div>

          <div className="footer__social">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label={s.label}
                title={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>

          <nav className="footer__nav" aria-label="Navegación footer">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="footer__nav-link"
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="footer__divider" aria-hidden="true" />

          <p className="footer__copy">
            © {year} Raúl Domingo. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
