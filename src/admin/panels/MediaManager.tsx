// src/admin/panels/MediaManager.tsx
import { useState, useRef } from 'react';
import { useCollection, orderBy } from '../../hooks/useFirestore';
import { useStorage } from '../../hooks/useStorage';
import type { MediaItem } from '../../types';

const MEDIA_TYPES = [
  { value: 'image',     label: '🖼 Imagen' },
  { value: 'youtube',   label: '▶ YouTube' },
  { value: 'tiktok',    label: '♬ TikTok' },
  { value: 'instagram', label: '📸 Instagram' },
  { value: 'facebook',  label: '👍 Facebook' },
];

const EMPTY_FORM = {
  type: 'image' as MediaItem['type'],
  title: '',
  embedUrl: '',
  thumbnailUrl: '',
  isPublished: true,
};

function getEmbedFromUrl(url: string, type: MediaItem['type']): string {
  if (type === 'youtube') {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
}

export default function MediaManager() {
  const { data: media, add, update, remove } = useCollection<MediaItem>('media', [orderBy('order', 'asc')]);
  const { upload, uploading, progress } = useStorage();
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rawUrl, setRawUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    setSaving(true);
    try {
      let imageUrl: string | undefined;

      // Handle image upload
      if (form.type === 'image' && fileInputRef.current?.files?.[0]) {
        imageUrl = await upload(fileInputRef.current.files[0], 'media/images');
      }

      const embedUrl = form.type !== 'image'
        ? getEmbedFromUrl(rawUrl, form.type)
        : undefined;

      await add({
        type: form.type,
        title: form.title,
        imageUrl,
        embedUrl,
        thumbnailUrl: form.thumbnailUrl || undefined,
        order: media.length + 1,
        isPublished: form.isPublished,
      } as Omit<MediaItem, 'id'>);

      setForm(EMPTY_FORM);
      setRawUrl('');
      setShowForm(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (item: MediaItem) => {
    await update(item.id, { isPublished: !item.isPublished });
  };

  const TYPE_LABEL: Record<string, string> = {
    image: '🖼', youtube: '▶', tiktok: '♬', instagram: '📸', facebook: '👍',
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display:'flex', justifyContent:'flex-end' }}>
        <button className="btn btn--primary btn--sm" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancelar' : '+ Agregar Media'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="admin-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontFamily:'var(--font-title)', fontWeight:700, fontSize:'0.875rem',
                       textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'1.5rem',
                       color:'var(--color-nocturno)' }}>
            Agregar Item de Media
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="media-type">Tipo *</label>
                <select id="media-type" name="type" className="input" value={form.type}
                  onChange={(e) => { handleChange(e); setRawUrl(''); }}>
                  {MEDIA_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="media-title">Título *</label>
                <input id="media-title" name="title" type="text" className="input"
                  value={form.title} onChange={handleChange} placeholder="Título del item" required />
              </div>
            </div>

            {/* Image upload */}
            {form.type === 'image' && (
              <div className="form-group" style={{ marginBottom:'1rem' }}>
                <label className="form-label" htmlFor="media-file">Archivo de imagen *</label>
                <input id="media-file" name="file" type="file" className="input"
                  accept="image/*" ref={fileInputRef} />
                {uploading && (
                  <div style={{ marginTop:'0.5rem' }}>
                    <div style={{ height:'4px', background:'var(--color-border)', borderRadius:'2px' }}>
                      <div style={{ height:'100%', width:`${progress}%`, background:'var(--color-adobe)', borderRadius:'2px', transition:'width 0.2s' }} />
                    </div>
                    <small style={{ fontFamily:'var(--font-title)', fontSize:'0.6875rem', opacity:0.6 }}>{progress}%</small>
                  </div>
                )}
              </div>
            )}

            {/* Video URL */}
            {form.type !== 'image' && (
              <div className="form-group" style={{ marginBottom:'1rem' }}>
                <label className="form-label" htmlFor="media-url">
                  URL del video ({form.type === 'youtube' ? 'URL de YouTube' : `URL de ${form.type}`}) *
                </label>
                <input id="media-url" type="url" className="input"
                  value={rawUrl} onChange={(e) => setRawUrl(e.target.value)}
                  placeholder={form.type === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'URL del video'} />
              </div>
            )}

            <div style={{ display:'flex', gap:'1.5rem', marginBottom:'1.5rem', alignItems:'center' }}>
              <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontFamily:'var(--font-title)', fontSize:'0.75rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', cursor:'pointer' }}>
                <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} />
                Publicar inmediatamente
              </label>
            </div>

            <button type="submit" className="btn btn--primary btn--sm" disabled={saving || uploading}>
              {saving || uploading ? 'Guardando…' : 'Guardar'}
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="admin-card">
        {media.length === 0 ? (
          <p style={{ fontFamily:'var(--font-body)', fontStyle:'italic', opacity:0.45, textAlign:'center', padding:'2rem 0' }}>
            No hay media cargada aún. Agregá fotos o videos.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Título</th>
                <th>Preview</th>
                <th>Publicado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {media.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span style={{ fontSize:'1.25rem' }}>{TYPE_LABEL[item.type]}</span>
                  </td>
                  <td style={{ fontWeight:600 }}>{item.title}</td>
                  <td>
                    {item.type === 'image' && item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title}
                        style={{ width:48, height:48, objectFit:'cover', borderRadius:'var(--radius-sm)' }} />
                    ) : item.embedUrl ? (
                      <span style={{ fontFamily:'var(--font-title)', fontSize:'0.6875rem', opacity:0.5, fontWeight:600 }}>
                        {item.embedUrl.slice(0, 30)}…
                      </span>
                    ) : '—'}
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggle(item)}
                      className={`admin-badge ${item.isPublished ? 'admin-badge--green' : 'admin-badge--gray'}`}
                      style={{ cursor:'pointer', border:'none' }}
                    >
                      {item.isPublished ? 'Sí' : 'No'}
                    </button>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button
                        className="admin-btn-icon admin-btn-icon--delete"
                        onClick={() => { if(confirm('¿Eliminar este item?')) remove(item.id); }}
                        title="Eliminar"
                      >✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
