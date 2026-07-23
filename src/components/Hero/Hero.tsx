// src/components/Hero/Hero.tsx
import './Hero.css';

interface HeroProps {
  title?: string;
  claim?: string;
  imageUrl?: string;
}

export default function Hero({
  title   = 'Raúl\nDomingo',
  claim   = 'Desde las valles de Salta\nal mundo.',
  imageUrl = '/hero-1.png',
}: HeroProps) {
  const [first, second] = title.split('\n');

  return (
    <section id="hero" className="hero">
      <img
        src={imageUrl}
        alt="Raúl Domingo — Folklore de Vanguardia"
        className="hero__bg"
        loading="eager"
      />
      <div className="hero__overlay" aria-hidden="true" />

      <div className="hero__content">
        <span className="hero__eyebrow">Folklore de Vanguardia</span>

        <h1 className="hero__title">
          <span>{first}</span>
          {second && <span>{second}</span>}
        </h1>

        <p className="hero__claim">{claim}</p>

        <div className="hero__actions">
          <a
            href="https://open.spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary"
            id="hero-cta-listen"
          >
            ▶ Escuchar Ahora
          </a>
          <a
            href="#giras"
            className="btn btn--outline"
            id="hero-cta-shows"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#giras')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Ver Giras
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll" aria-hidden="true">
        <div className="hero__scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
