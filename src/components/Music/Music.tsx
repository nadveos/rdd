// src/components/Music/Music.tsx
import { useFadeIn } from '../../hooks/useFadeIn';
import type { AlbumItem } from '../../types';
import './Music.css';

const DEFAULT_ALBUMS: AlbumItem[] = [
  {
    id: '1',
    title: 'Monte y Sombra',
    year: '2023',
    genre: 'Folklore · Experimental',
    coverUrl: '/album1.png',
    spotifyUrl: 'https://open.spotify.com',
    order: 1,
  },
  {
    id: '2',
    title: 'Quebrada Adentro',
    year: '2021',
    genre: 'Folklore · Trova',
    coverUrl: '/album2.png',
    spotifyUrl: 'https://open.spotify.com',
    order: 2,
  },
  {
    id: '3',
    title: 'Tierra de Nadie',
    year: '2019',
    genre: 'Folklore · Fusión',
    coverUrl: '/album3.png',
    spotifyUrl: 'https://open.spotify.com',
    order: 3,
  },
];

interface MusicProps {
  albums?: AlbumItem[];
}

export default function Music({ albums = DEFAULT_ALBUMS }: MusicProps) {
  const ref = useFadeIn();

  return (
    <section id="musica" className="section music">
      <div className="container" ref={ref}>
        <div className="section-header fade-in">
          <div className="section-header__line" />
          <span className="eyebrow">Discografía</span>
          <h2>Música</h2>
        </div>

        <div className="music__grid">
          {albums.map((album, i) => (
            <article
              key={album.id}
              className={`album-card fade-in fade-in--delay-${Math.min(i + 1, 4)}`}
            >
              <div className="album-card__cover-wrap">
                <img
                  src={album.coverUrl}
                  alt={`Portada: ${album.title}`}
                  className="album-card__cover"
                  loading="lazy"
                />
                <div className="album-card__play-overlay" aria-hidden="true">
                  <span className="album-card__play-icon">▶</span>
                </div>
              </div>
              <div className="album-card__info">
                <h3 className="album-card__title">{album.title}</h3>
                <p className="album-card__meta">{album.year} · {album.genre}</p>
                {album.spotifyUrl && (
                  <a
                    href={album.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="album-card__cta"
                    aria-label={`Escuchar ${album.title} en Spotify`}
                  >
                    Escuchar en Spotify →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
