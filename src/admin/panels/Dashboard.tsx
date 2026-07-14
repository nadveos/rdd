// src/admin/panels/Dashboard.tsx
import { useCollection, orderBy } from '../../hooks/useFirestore';
import type { Show, MediaItem, ContactRequest } from '../../types';

function StatCard({ icon, value, label, color }: { icon: string; value: number | string; label: string; color: string }) {
  return (
    <div style={{
      background: 'white',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-sm)',
      padding: '1.75rem',
      borderTop: `3px solid ${color}`,
    }}>
      <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{icon}</div>
      <div style={{
        fontFamily: 'var(--font-title)', fontWeight: 900,
        fontSize: '2rem', color: 'var(--color-nocturno)', lineHeight: 1,
      }}>{value}</div>
      <div style={{
        fontFamily: 'var(--font-title)', fontWeight: 600,
        fontSize: '0.6875rem', letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'var(--color-nocturno)',
        opacity: 0.5, marginTop: '0.375rem',
      }}>{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const { data: shows }    = useCollection<Show>('shows', [orderBy('date', 'asc')]);
  const { data: media }    = useCollection<MediaItem>('media', []);
  const { data: contacts } = useCollection<ContactRequest>('contact_requests', []);

  const now = new Date();
  const upcomingShows = shows.filter(
    (s) => s.isPublished && s.date.toDate() >= now
  ).length;
  const unreadContacts = contacts.filter((c) => !c.isRead).length;
  const publishedMedia = media.filter((m) => m.isPublished).length;

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem',
      }}>
        <StatCard icon="📅" value={upcomingShows} label="Shows Próximos" color="var(--color-adobe)" />
        <StatCard icon="🖼"  value={publishedMedia} label="Items de Media"  color="var(--color-monte)" />
        <StatCard icon="✉"  value={unreadContacts} label="Mensajes Nuevos"  color="#3B82F6" />
        <StatCard icon="📋" value={contacts.length} label="Total Contactos" color="var(--color-nocturno)" />
      </div>

      <div className="admin-card">
        <h3 style={{ fontFamily:'var(--font-title)', fontWeight:700, fontSize:'0.875rem',
                     letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'1rem',
                     color:'var(--color-nocturno)', opacity:0.6 }}>
          Próximos Shows
        </h3>
        {shows.length === 0 ? (
          <p style={{ fontFamily:'var(--font-body)', fontStyle:'italic', opacity:0.45 }}>
            No hay shows cargados aún.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Venue</th>
                <th>Ciudad</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {shows.slice(0, 5).map((show) => {
                const d = show.date.toDate();
                const dateStr = d.toLocaleDateString('es-AR', { day:'2-digit', month:'short', year:'numeric' });
                return (
                  <tr key={show.id}>
                    <td>{dateStr}</td>
                    <td>{show.venue}</td>
                    <td>{show.city}, {show.country}</td>
                    <td>
                      {show.isSoldOut ? (
                        <span className="admin-badge admin-badge--red">Agotado</span>
                      ) : show.isPublished ? (
                        <span className="admin-badge admin-badge--green">Publicado</span>
                      ) : (
                        <span className="admin-badge admin-badge--gray">Borrador</span>
                      )}
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
