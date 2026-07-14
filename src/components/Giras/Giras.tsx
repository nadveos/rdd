// src/components/Giras/Giras.tsx
import { useFadeIn } from '../../hooks/useFadeIn';
import { useCollection, orderBy } from '../../hooks/useFirestore';
import type { Show } from '../../types';
import { Timestamp } from 'firebase/firestore';
import './Giras.css';

// Static fallback shows for demo / no Firebase
const DEMO_SHOWS: Show[] = [
  {
    id: '1',
    date: Timestamp.fromDate(new Date('2026-08-15')),
    venue: 'Festival Nacional de Folklore',
    city: 'Cosquín',
    country: 'Argentina',
    ticketUrl: 'https://entradas.com',
    isSoldOut: false,
    isPublished: true,
  },
  {
    id: '2',
    date: Timestamp.fromDate(new Date('2026-09-06')),
    venue: 'Teatro Provincial',
    city: 'Salta',
    country: 'Argentina',
    ticketUrl: 'https://entradas.com',
    isSoldOut: false,
    isPublished: true,
  },
  {
    id: '3',
    date: Timestamp.fromDate(new Date('2026-10-20')),
    venue: 'Auditorio Nacional',
    city: 'Buenos Aires',
    country: 'Argentina',
    ticketUrl: 'https://entradas.com',
    isSoldOut: true,
    isPublished: true,
  },
  {
    id: '4',
    date: Timestamp.fromDate(new Date('2026-11-14')),
    venue: 'Festival Andino',
    city: 'Santiago de Chile',
    country: 'Chile',
    ticketUrl: 'https://entradas.com',
    isSoldOut: false,
    isPublished: true,
  },
];

const MONTHS_ES = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];

function formatDate(ts: Timestamp) {
  const d = ts.toDate();
  return {
    day:       String(d.getDate()).padStart(2, '0'),
    monthYear: `${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`,
  };
}

export default function Giras() {
  const { data: firestoreShows, loading } = useCollection<Show>('shows', [orderBy('date', 'asc')]);
  const ref = useFadeIn();

  const now = new Date();
  const shows = (firestoreShows.length > 0 ? firestoreShows : DEMO_SHOWS)
    .filter((s) => s.isPublished && s.date.toDate() >= now)
    .sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime());

  return (
    <section id="giras" className="section giras">
      <div className="container" ref={ref}>
        <div className="section-header fade-in">
          <div className="section-header__line" />
          <span className="eyebrow">Próximas Fechas</span>
          <h2>Giras & Shows</h2>
        </div>

        {loading ? (
          <p className="giras__empty">Cargando fechas…</p>
        ) : shows.length === 0 ? (
          <p className="giras__empty">No hay fechas próximas por el momento.<br />Seguí las redes para novedades.</p>
        ) : (
          <div className="giras__list">
            {shows.map((show, i) => {
              const { day, monthYear } = formatDate(show.date);
              return (
                <div key={show.id} className={`show-row fade-in fade-in--delay-${Math.min(i + 1, 4)}`}>
                  {/* Fecha */}
                  <div className="show-row__date">
                    <span className="show-row__day">{day}</span>
                    <span className="show-row__month-year">{monthYear}</span>
                  </div>

                  {/* Venue */}
                  <div className="show-row__venue-col">
                    <span className="show-row__venue">{show.venue}</span>
                    <span className="show-row__location">{show.city}, {show.country}</span>
                  </div>

                  {/* Acciones */}
                  <div className="show-row__actions">
                    {show.isSoldOut ? (
                      <span className="show-row__sold-out">Agotado</span>
                    ) : show.ticketUrl ? (
                      <a
                        href={show.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--outline btn--sm"
                        aria-label={`Entradas para ${show.venue}`}
                      >
                        Entradas
                      </a>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
