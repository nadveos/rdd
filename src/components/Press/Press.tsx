// src/components/Press/Press.tsx
import { useFadeIn } from '../../hooks/useFadeIn';
import type { PressQuote } from '../../types';
import './Press.css';

const DEFAULT_QUOTES: PressQuote[] = [
  {
    quote: 'Raúl Domingo reinventa el folklore desde adentro — sin traicionarlo, lo expande hacia horizontes que nadie había visto venir.',
    source: 'La Nación',
    author: 'María Eugenia Velásquez',
  },
  {
    quote: 'Una voz que lleva el peso de los cerros y la ligereza del viento. Raúl Domingo es la prueba de que el folklore tiene mucho por decir.',
    source: 'Página 12',
    author: 'Hernán Gómez',
  },
  {
    quote: 'Primitivo y moderno a la vez. Su propuesta no busca convencer — simplemente arrebata.',
    source: 'Rolling Stone Argentina',
    author: 'Camila Ríos',
  },
];

interface PressProps {
  quotes?: PressQuote[];
}

export default function Press({ quotes = DEFAULT_QUOTES }: PressProps) {
  const ref = useFadeIn();

  return (
    <section id="prensa" className="section press">
      <div className="container" ref={ref}>
        <div className="section-header fade-in">
          <div className="section-header__line" />
          <span className="eyebrow">Medios</span>
          <h2>En los Medios</h2>
        </div>

        <div className="press__grid">
          {quotes.map((q, i) => (
            <article key={i} className={`press-card fade-in fade-in--delay-${Math.min(i + 1, 4)}`}>
              <span className="press-card__quote-mark" aria-hidden="true">"</span>
              <p className="press-card__text">{q.quote}</p>
              <p className="press-card__source">{q.source}</p>
              {q.author && <p className="press-card__author">{q.author}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
