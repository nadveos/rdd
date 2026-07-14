// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Music from './components/Music/Music';
import Giras from './components/Giras/Giras';
import MediaGallery from './components/MediaGallery/MediaGallery';
import Press from './components/Press/Press';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import AdminLayout from './admin/AdminLayout';
import './App.css';

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || 'studio-rd-vk3m8p';

function PublicSite() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <About />
        <Music />
        <Giras />
        <MediaGallery />
        <Press />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicSite />} />
        <Route path={`/${ADMIN_PATH}`} element={<AdminLayout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
