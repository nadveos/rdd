// src/components/About/About.tsx
import { useFadeIn } from '../../hooks/useFadeIn';
import './About.css';

interface AboutProps {
  imageUrl?: string;
  text?: string;
  pullquote?: string;
}

export default function About({
  imageUrl = '/about.png',
  text,
  pullquote = '"El folklore no es un museo — es una lengua viva que respira con cada generación."',
}: AboutProps) {
  const ref = useFadeIn();

  const paragraphs = text
    ? text.split('\n').filter(Boolean)
    : [
      'Raúl Domingo nació entre los cerros de Salta, donde el viento arrastra memorias de siglos y la tierra tiene el color del tiempo. Desde niño, aprendió que el folklore no es nostalgia — es la voz más honesta que tiene un pueblo para hablar de sí mismo.',
      'Su propuesta artística, bautizada como "Folklore de Vanguardia", funde la raíz andina con una sensibilidad contemporánea: arreglos mínimos, silencios elocuentes, y una voz que sabe moverse entre el grito y el susurro con igual autoridad.',
      'Con tres álbumes de estudio y presentaciones en los festivales más importantes del norte argentino y América Latina, Raúl Domingo se ha consolidado como una de las voces más originales y necesarias de su generación.',
    ];

  return (
    <section id="bio" className="section about">
      <div className="container">
        <div className="about__inner" ref={ref}>
          {/* Foto */}
          <div className="about__image-wrap fade-in">
            <img src={imageUrl} alt="Raúl Domingo — Retrato" className="about__image" />
            <p className="about__image-caption">Foto: Raúl Domingo — Salta, Argentina</p>
          </div>

          {/* Texto */}
          <div className="about__text-col">
            <div className="section-header fade-in">
              <div className="section-header__line" />
              <span className="eyebrow">El Artista</span>
              <h2>Raíces que vuelan alto</h2>
            </div>

            <div className="about__body">
              {paragraphs.map((p, i) => (
                <p key={i} className={`fade-in fade-in--delay-${Math.min(i + 1, 4)}`}>{p}</p>
              ))}

              <div className="about__pullquote fade-in fade-in--delay-3">
                <p>{pullquote}</p>
              </div>
            </div>

            <div className="about__actions fade-in fade-in--delay-4">
              <a
                href="https://open.spotify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--outline"
              >
                Escuchar en Spotify
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
