// src/hooks/useFadeIn.ts
import { useEffect, useRef } from 'react';

export function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    const targets = el.querySelectorAll('.fade-in');
    targets.forEach((t) => observer.observe(t));
    // Also observe the container itself if it has fade-in
    if (el.classList.contains('fade-in')) observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return ref;
}
