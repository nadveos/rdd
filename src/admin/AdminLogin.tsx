// src/admin/AdminLogin.tsx
import { useState, useEffect } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import './AdminLogin.css';

const PIN_LENGTH = parseInt(import.meta.env.VITE_ADMIN_PIN?.length || '6', 10);
const KEYS = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

export default function AdminLogin() {
  const [pin, setPin] = useState('');
  const { login, error } = useAdminAuth();

  const handleKey = (key: string) => {
    if (key === '⌫') {
      setPin((p) => p.slice(0, -1));
    } else if (key === '') {
      return;
    } else if (pin.length < PIN_LENGTH) {
      setPin((p) => p + key);
    }
  };

  // Auto-submit when PIN is complete
  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      const timeout = setTimeout(() => {
        const ok = login(pin);
        if (!ok) setPin('');
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [pin, login]);

  // Keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) handleKey(e.key);
      if (e.key === 'Backspace') handleKey('⌫');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <p className="admin-login__logo">R.D.</p>
        <p className="admin-login__sub">Panel de Gestión</p>

        {/* PIN dots */}
        <div className="admin-login__pin-wrap" aria-label="PIN ingresado">
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <div
              key={i}
              className={`admin-login__dot${i < pin.length ? ' filled' : ''}`}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="admin-login__keypad" role="group" aria-label="Teclado numérico">
          {KEYS.map((key, i) => (
            <button
              key={i}
              className={`admin-login__key${key === '' ? ' admin-login__key--empty' : ''}${key === '⌫' ? ' admin-login__key--delete' : ''}`}
              onClick={() => handleKey(key)}
              aria-label={key === '⌫' ? 'Borrar' : key === '' ? undefined : key}
              disabled={key === ''}
              tabIndex={key === '' ? -1 : 0}
            >
              {key}
            </button>
          ))}
        </div>

        <p className="admin-login__error" role="alert">{error}</p>
      </div>
    </div>
  );
}
