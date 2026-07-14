// src/components/Contact/Contact.tsx
import { useState } from 'react';
import { useFadeIn } from '../../hooks/useFadeIn';
import { useCollection } from '../../hooks/useFirestore';
import { Timestamp } from 'firebase/firestore';
import type { ContactRequest, ContactFormData } from '../../types';
import './Contact.css';

const EVENT_TYPES = [
  'Festival',
  'Teatro / Auditorio',
  'Evento Privado',
  'Corporativo',
  'Peña / Club Social',
  'Otro',
];

const SOCIAL_LINKS = [
  { icon: '📸', label: 'Instagram', href: 'https://instagram.com' },
  { icon: '▶', label: 'YouTube', href: 'https://youtube.com' },
  { icon: '♬', label: 'TikTok', href: 'https://tiktok.com' },
  { icon: '🎵', label: 'Spotify', href: 'https://open.spotify.com' },
];

const EMPTY_FORM: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  organization: '',
  eventType: '',
  eventDate: '',
  message: '',
};

export default function Contact() {
  const [form, setForm] = useState<ContactFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const ref = useFadeIn();

  const { add } = useCollection<ContactRequest>('contact_requests');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message || !form.eventType) {
      setError('Por favor completá los campos obligatorios.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await add({
        ...form,
        isRead: false,
        receivedAt: Timestamp.now(),
      } as Omit<ContactRequest, 'id'>);
      setSubmitted(true);
      setForm(EMPTY_FORM);
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error. Por favor intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="section contact">
      <div className="container" ref={ref}>
        <div className="contact__inner">
          {/* Info */}
          <div className="contact__info fade-in">
            <div className="section-header">
              <div className="section-header__line" />
              <span className="eyebrow">Contrataciones</span>
              <h2>Contacto</h2>
            </div>
            <p className="contact__info-text">
              Para consultas de contrataciones, festivales, eventos privados o corporativos,
              completá el formulario y nos comunicaremos a la brevedad.
            </p>

            <div className="contact__social">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact__social-link"
                >
                  <span className="contact__social-icon" aria-hidden="true">{s.icon}</span>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="fade-in fade-in--delay-1">
            {submitted ? (
              <div className="contact__success">
                <span className="contact__success-icon">✓</span>
                <h3>¡Mensaje enviado!</h3>
                <p>Gracias por tu interés. Te respondemos en menos de 48 horas.</p>
              </div>
            ) : (
              <form
                className="contact__form"
                onSubmit={handleSubmit}
                noValidate
                id="contact-form"
              >
                <div className="contact__form-row">
                  <div className="form-group">
                    <label htmlFor="contact-name" className="form-label">
                      Nombre <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      className="input"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-email" className="form-label">
                      Email <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      className="input"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="contact__form-row">
                  <div className="form-group">
                    <label htmlFor="contact-phone" className="form-label">Teléfono</label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      className="input"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+54 ..."
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-org" className="form-label">Organización / Productora</label>
                    <input
                      id="contact-org"
                      name="organization"
                      type="text"
                      className="input"
                      value={form.organization}
                      onChange={handleChange}
                      placeholder="Nombre de tu empresa"
                    />
                  </div>
                </div>

                <div className="contact__form-row">
                  <div className="form-group">
                    <label htmlFor="contact-event-type" className="form-label">
                      Tipo de evento <span aria-hidden="true">*</span>
                    </label>
                    <select
                      id="contact-event-type"
                      name="eventType"
                      className="contact__select"
                      value={form.eventType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccionar…</option>
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-date" className="form-label">Fecha tentativa</label>
                    <input
                      id="contact-date"
                      name="eventDate"
                      type="date"
                      className="input"
                      value={form.eventDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message" className="form-label">
                    Mensaje <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    className="textarea"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Contanos sobre tu evento, el venue, la cantidad de espectadores esperada…"
                    required
                  />
                </div>

                {error && (
                  <p style={{ color: 'var(--color-adobe)', fontFamily: 'var(--font-title)', fontSize: '0.875rem' }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn btn--primary"
                  id="contact-submit"
                  disabled={submitting}
                  style={{ alignSelf: 'flex-start' }}
                >
                  {submitting ? 'Enviando…' : 'Enviar Consulta'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
