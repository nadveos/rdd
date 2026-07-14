// src/admin/panels/ShowsManager.tsx
import { useState } from 'react';
import { useCollection, orderBy } from '../../hooks/useFirestore';
import { Timestamp } from 'firebase/firestore';
import type { Show } from '../../types';

const EMPTY_FORM = {
  date: '',
  venue: '',
  city: '',
  country: 'Argentina',
  ticketUrl: '',
  isSoldOut: false,
  isPublished: true,
};

export default function ShowsManager() {
  const { data: shows, add, update, remove } = useCollection<Show>('shows', [orderBy('date', 'asc')]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.venue || !form.city) return;
    setSaving(true);
    try {
      const showData: Omit<Show, 'id'> = {
        date: Timestamp.fromDate(new Date(form.date)),
        venue: form.venue,
        city: form.city,
        country: form.country,
        ticketUrl: form.ticketUrl || undefined,
        isSoldOut: form.isSoldOut,
        isPublished: form.isPublished,
      };
      if (editing) {
        await update(editing, showData);
      } else {
        await add(showData);
      }
      setForm(EMPTY_FORM);
      setEditing(null);
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (show: Show) => {
    const d = show.date.toDate();
    const pad = (n: number) => String(n).padStart(2, '0');
    const dateStr = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    setForm({
      date: dateStr,
      venue: show.venue,
      city: show.city,
      country: show.country,
      ticketUrl: show.ticketUrl ?? '',
      isSoldOut: show.isSoldOut,
      isPublished: show.isPublished,
    });
    setEditing(show.id);
    setShowForm(true);
  };

  const handleToggle = async (show: Show, field: 'isPublished' | 'isSoldOut') => {
    await update(show.id, { [field]: !show[field] });
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display:'flex', justifyContent:'flex-end' }}>
        <button
          className="btn btn--primary btn--sm"
          onClick={() => { setForm(EMPTY_FORM); setEditing(null); setShowForm((v) => !v); }}
        >
          {showForm ? 'Cancelar' : '+ Nuevo Show'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="admin-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontFamily:'var(--font-title)', fontWeight:700, fontSize:'0.875rem',
                       textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'1.5rem',
                       color:'var(--color-nocturno)' }}>
            {editing ? 'Editar Show' : 'Nuevo Show'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="show-date">Fecha *</label>
                <input id="show-date" name="date" type="date" className="input" value={form.date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="show-venue">Venue *</label>
                <input id="show-venue" name="venue" type="text" className="input" value={form.venue} onChange={handleChange} placeholder="Nombre del lugar" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="show-city">Ciudad *</label>
                <input id="show-city" name="city" type="text" className="input" value={form.city} onChange={handleChange} placeholder="Ciudad" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="show-country">País</label>
                <input id="show-country" name="country" type="text" className="input" value={form.country} onChange={handleChange} placeholder="País" />
              </div>
              <div className="form-group" style={{ gridColumn:'1/-1' }}>
                <label className="form-label" htmlFor="show-ticket">URL de Entradas</label>
                <input id="show-ticket" name="ticketUrl" type="url" className="input" value={form.ticketUrl} onChange={handleChange} placeholder="https://..." />
              </div>
            </div>
            <div style={{ display:'flex', gap:'1.5rem', marginBottom:'1.5rem', alignItems:'center' }}>
              <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontFamily:'var(--font-title)', fontSize:'0.75rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', cursor:'pointer' }}>
                <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} />
                Publicado
              </label>
              <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontFamily:'var(--font-title)', fontSize:'0.75rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', cursor:'pointer' }}>
                <input type="checkbox" name="isSoldOut" checked={form.isSoldOut} onChange={handleChange} />
                Agotado
              </label>
            </div>
            <button type="submit" className="btn btn--primary btn--sm" disabled={saving}>
              {saving ? 'Guardando…' : editing ? 'Actualizar Show' : 'Crear Show'}
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="admin-card">
        {shows.length === 0 ? (
          <p style={{ fontFamily:'var(--font-body)', fontStyle:'italic', opacity:0.45, textAlign:'center', padding:'2rem 0' }}>
            No hay shows cargados. Agregá el primero.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Venue</th>
                <th>Ciudad / País</th>
                <th>Publicado</th>
                <th>Agotado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {shows.map((show) => {
                const d = show.date.toDate();
                const dateStr = d.toLocaleDateString('es-AR', { day:'2-digit', month:'short', year:'numeric' });
                return (
                  <tr key={show.id}>
                    <td style={{ fontWeight:700 }}>{dateStr}</td>
                    <td>{show.venue}</td>
                    <td style={{ opacity:0.65 }}>{show.city}, {show.country}</td>
                    <td>
                      <button
                        onClick={() => handleToggle(show, 'isPublished')}
                        className={`admin-badge ${show.isPublished ? 'admin-badge--green' : 'admin-badge--gray'}`}
                        style={{ cursor:'pointer', border:'none' }}
                        title="Clic para cambiar"
                      >
                        {show.isPublished ? 'Sí' : 'No'}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggle(show, 'isSoldOut')}
                        className={`admin-badge ${show.isSoldOut ? 'admin-badge--red' : 'admin-badge--gray'}`}
                        style={{ cursor:'pointer', border:'none' }}
                        title="Clic para cambiar"
                      >
                        {show.isSoldOut ? 'Sí' : 'No'}
                      </button>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button className="admin-btn-icon" onClick={() => handleEdit(show)} title="Editar">✎</button>
                        <button className="admin-btn-icon admin-btn-icon--delete" onClick={() => { if(confirm('¿Eliminar este show?')) remove(show.id); }} title="Eliminar">✕</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
