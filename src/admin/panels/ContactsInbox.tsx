// src/admin/panels/ContactsInbox.tsx
import { useCollection, orderBy } from '../../hooks/useFirestore';
import type { ContactRequest } from '../../types';

export default function ContactsInbox() {
  const { data: contacts, update, remove } = useCollection<ContactRequest>(
    'contact_requests',
    [orderBy('receivedAt', 'desc')]
  );

  const markRead = async (id: string) => {
    await update(id, { isRead: true });
  };

  const unread = contacts.filter((c) => !c.isRead).length;

  return (
    <div>
      {unread > 0 && (
        <div style={{
          background: 'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.2)',
          borderRadius:'var(--radius-sm)', padding:'0.875rem 1.25rem',
          marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.75rem',
        }}>
          <span style={{ fontFamily:'var(--font-title)', fontWeight:700, fontSize:'0.75rem',
                         letterSpacing:'0.08em', textTransform:'uppercase', color:'#3B82F6' }}>
            ● {unread} mensaje{unread > 1 ? 's' : ''} sin leer
          </span>
        </div>
      )}

      {contacts.length === 0 ? (
        <div className="admin-card" style={{ textAlign:'center', padding:'3rem' }}>
          <p style={{ fontFamily:'var(--font-body)', fontStyle:'italic', opacity:0.45 }}>
            No hay mensajes de contacto aún.
          </p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {contacts.map((c) => {
            const date = c.receivedAt?.toDate?.()
              ? c.receivedAt.toDate().toLocaleDateString('es-AR', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })
              : '—';

            return (
              <div key={c.id} className="admin-card" style={{
                borderLeft: c.isRead ? '3px solid var(--color-border)' : '3px solid #3B82F6',
                padding: '1.5rem',
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem' }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.25rem' }}>
                      {!c.isRead && (
                        <span className="admin-badge" style={{ background:'#3B82F6', color:'white', padding:'0.2rem 0.6rem', fontSize:'0.625rem' }}>
                          NUEVO
                        </span>
                      )}
                      <h3 style={{ fontFamily:'var(--font-title)', fontWeight:700, fontSize:'1rem', color:'var(--color-nocturno)' }}>
                        {c.name}
                      </h3>
                    </div>
                    <div style={{ fontFamily:'var(--font-title)', fontSize:'0.75rem', color:'var(--color-nocturno)', opacity:0.5, letterSpacing:'0.04em' }}>
                      {date}
                    </div>
                  </div>
                  <div className="admin-actions">
                    {!c.isRead && (
                      <button className="admin-btn-icon" onClick={() => markRead(c.id)} title="Marcar como leído">✓</button>
                    )}
                    <button
                      className="admin-btn-icon admin-btn-icon--delete"
                      onClick={() => { if(confirm('¿Eliminar este mensaje?')) remove(c.id); }}
                      title="Eliminar"
                    >✕</button>
                  </div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:'0.5rem 1.5rem', marginBottom:'1rem' }}>
                  {[
                    ['Email', c.email],
                    ['Teléfono', c.phone || '—'],
                    ['Organización', c.organization || '—'],
                    ['Tipo de evento', c.eventType],
                    ['Fecha tentativa', c.eventDate || '—'],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div style={{ fontFamily:'var(--font-title)', fontWeight:700, fontSize:'0.625rem',
                                    letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-nocturno)',
                                    opacity:0.4, marginBottom:'0.125rem' }}>
                        {label}
                      </div>
                      <div style={{ fontFamily:'var(--font-body)', fontSize:'0.9375rem', color:'var(--color-nocturno)' }}>
                        {label === 'Email' ? (
                          <a href={`mailto:${value}`} style={{ color:'var(--color-adobe)' }}>{value}</a>
                        ) : value}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background:'var(--color-card)', borderRadius:'var(--radius-sm)', padding:'1rem 1.25rem' }}>
                  <div style={{ fontFamily:'var(--font-title)', fontWeight:700, fontSize:'0.625rem',
                                letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-nocturno)',
                                opacity:0.4, marginBottom:'0.5rem' }}>
                    Mensaje
                  </div>
                  <p style={{ fontFamily:'var(--font-body)', lineHeight:1.7, color:'var(--color-nocturno)' }}>
                    {c.message}
                  </p>
                </div>

                <div style={{ marginTop:'1rem' }}>
                  <a
                    href={`mailto:${c.email}?subject=Re: Consulta de ${c.eventType} — Raúl Domingo`}
                    className="btn btn--outline btn--sm"
                  >
                    Responder por email
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
