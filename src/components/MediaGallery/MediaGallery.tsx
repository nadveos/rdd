// src/components/MediaGallery/MediaGallery.tsx
import { useState } from 'react';
import { useFadeIn } from '../../hooks/useFadeIn';
import { useCollection, orderBy } from '../../hooks/useFirestore';
import type { MediaItem } from '../../types';
import './MediaGallery.css';

const DEMO_PHOTOS: MediaItem[] = [
  { id: 'p1', type: 'image', title: 'En vivo', imageUrl: '/gallery1.png', order: 1, isPublished: true },
  { id: 'p2', type: 'image', title: 'Estudio', imageUrl: '/gallery2.png', order: 2, isPublished: true },
  { id: 'p3', type: 'image', title: 'Quebrada', imageUrl: '/gallery3.png', order: 3, isPublished: true },
];

const DEMO_VIDEOS: MediaItem[] = [
  {
    id: 'v1',
    type: 'youtube',
    title: 'Raúl Domingo — Monte y Sombra (Sesión en Vivo)',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order: 1,
    isPublished: true,
  },
  {
    id: 'v2',
    type: 'youtube',
    title: 'Detrás de escena — Quebrada Adentro',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order: 2,
    isPublished: true,
  },
];

type Tab = 'fotos' | 'videos';

function buildEmbedUrl(item: MediaItem): string {
  if (!item.embedUrl) return '';
  if (item.type === 'youtube') return item.embedUrl;
  if (item.type === 'instagram') return item.embedUrl;
  if (item.type === 'facebook') return item.embedUrl;
  return item.embedUrl;
}

export default function MediaGallery() {
  const [activeTab, setActiveTab] = useState<Tab>('fotos');
  const ref = useFadeIn();

  const { data: firestoreMedia } = useCollection<MediaItem>('media', [orderBy('order', 'asc')]);

  const allMedia = firestoreMedia.length > 0
    ? firestoreMedia.filter((m) => m.isPublished)
    : [...DEMO_PHOTOS, ...DEMO_VIDEOS];

  const photos = allMedia.filter((m) => m.type === 'image');
  const videos = allMedia.filter((m) => m.type !== 'image');

  return (
    <section id="media" className="section media-gallery">
      <div className="container" ref={ref}>
        <div className="section-header fade-in">
          <div className="section-header__line" />
          <span className="eyebrow">Galería</span>
          <h2>Media</h2>
        </div>

        {/* Tabs */}
        <div className="media-tabs fade-in fade-in--delay-1" role="tablist">
          <button
            className={`media-tab${activeTab === 'fotos' ? ' active' : ''}`}
            onClick={() => setActiveTab('fotos')}
            role="tab"
            aria-selected={activeTab === 'fotos'}
            id="tab-fotos"
          >
            Fotos
          </button>
          <button
            className={`media-tab${activeTab === 'videos' ? ' active' : ''}`}
            onClick={() => setActiveTab('videos')}
            role="tab"
            aria-selected={activeTab === 'videos'}
            id="tab-videos"
          >
            Videos
          </button>
        </div>

        {/* Photos */}
        {activeTab === 'fotos' && (
          photos.length === 0 ? (
            <p className="media-gallery__empty">No hay fotos publicadas aún.</p>
          ) : (
            <div className="photos-grid fade-in fade-in--delay-2">
              {photos.map((item) => (
                <div key={item.id} className="photo-item">
                  <img src={item.imageUrl} alt={item.title} loading="lazy" />
                  <div className="photo-item__overlay" aria-hidden="true">
                    <span className="photo-item__icon">⊕</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Videos */}
        {activeTab === 'videos' && (
          videos.length === 0 ? (
            <p className="media-gallery__empty">No hay videos publicados aún.</p>
          ) : (
            <div className="videos-grid fade-in fade-in--delay-2">
              {videos.map((item) => (
                <div key={item.id} className={`video-item video-item--${item.type}`}>
                  <div className="video-item__embed">
                    <iframe
                      src={buildEmbedUrl(item)}
                      title={item.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  <div className="video-item__caption">{item.title}</div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </section>
  );
}
