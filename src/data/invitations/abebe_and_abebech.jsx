import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Menu, X, ChevronLeft, ChevronRight, MapPin, ExternalLink, Sun, Moon, Music, Star, Clock, Wine, Utensils } from 'lucide-react';

// ======================== DATA ========================
const weddingData = {
  couple: {
    bride: 'Abebech',
    groom: 'Abebe',
    bridePhoto: '/images/couple_2.jpg',
    groomPhoto: '/images/couple_1.jpg',
    aboutBride: 'A soul full of light and grace.',
    aboutGroom: 'A heart full of strength and love.',
  },
  date: '2026-05-20T10:00:00',
  venue: {
    name: 'Sheraton Addis',
    address: 'Addis Ababa, Ethiopia',
    mapUrl: 'https://maps.app.goo.gl/9M1m7M8V8u9t7J9r7',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d38.7578!3d9.0245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85f6f4073f4d%3A0x82f5c315f27d985c!2sSheraton%20Addis!5e0!3m2!1sen!2set!4v1600000000000',
  },
  gallery: [
    '/images/head1.jpg',
    '/images/couple_2.jpg',
    '/images/couple_3.jpg',
    '/images/couple_4.jpg',
  ],
  timeline: [
    { time: '10:00 AM', title: 'Ceremony', description: 'Exchange of vows at the grand hall', icon: 'heart' },
    { time: '12:30 PM', title: 'Reception', description: 'Celebration with family and friends', icon: 'party' },
  ],
  musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
};

// ======================== STYLES ========================
const S = {
  section: {
    padding: '80px 20px',
    width: '100%',
    boxSizing: 'border-box',
  },
  centered: {
    textAlign: 'center',
    width: '100%',
  },
  sectionTitle: {
    fontFamily: "'Cinzel', 'Cormorant Garamond', serif",
    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
    fontWeight: '600',
    letterSpacing: '0.08em',
    textAlign: 'center',
    marginBottom: '0.5rem',
  },
  sectionSubtitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.2rem',
    fontStyle: 'italic',
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: '2.5rem',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    margin: '16px auto 32px',
  },
  dividerLine: {
    width: '80px',
    height: '1px',
    background: 'hsl(var(--primary))',
    opacity: 0.5,
  },
};

// ======================== THEME TOGGLE ========================
const LIGHT_VARS = {
  '--background': '35 15% 96%',
  '--foreground': '25 15% 12%',
  '--card': '35 20% 95%',
  '--card-foreground': '25 15% 12%',
  '--primary': '36 75% 45%',
  '--primary-foreground': '35 15% 96%',
  '--muted': '30 15% 92%',
  '--muted-foreground': '25 10% 45%',
  '--border': '30 20% 85%',
};

const DARK_VARS = {
  '--background': '49 21% 32%',
  '--foreground': '35 25% 92%',
  '--card': '49 21% 25%',
  '--card-foreground': '35 25% 92%',
  '--primary': '45 80% 60%',
  '--primary-foreground': '49 21% 15%',
  '--muted': '49 15% 20%',
  '--muted-foreground': '49 10% 70%',
  '--border': '49 15% 38%',
};

const applyThemeVars = (vars) => {
  const root = document.getElementById('template-root');
  if (!root) return;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
};

const ThemeToggle = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => { applyThemeVars(LIGHT_VARS); }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    applyThemeVars(next ? DARK_VARS : LIGHT_VARS);
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={toggle}
      title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={{
        position: 'fixed', bottom: '24px', left: '24px', zIndex: 9999,
        width: '48px', height: '48px', borderRadius: '50%',
        background: dark ? '#555037' : '#f5f0e8',
        border: `1px solid ${dark ? '#7a7350' : '#d4c5a9'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease',
      }}
    >
      {dark
        ? <Sun size={20} color="#FFD700" />
        : <Moon size={20} color="#7a6030" />}
    </motion.button>
  );
};

// ======================== NAV ========================
const WeddingNav = ({ coupleNames }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { label: 'Gallery', href: '#gallery' },
    { label: 'Schedule', href: '#timeline' },
    { label: 'Location', href: '#location' },
    { label: 'RSVP', href: '#rsvp' },
  ];
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, transition: 'all 0.3s', background: scrolled ? 'hsla(var(--background) / 0.92)' : 'transparent', backdropFilter: scrolled ? 'blur(10px)' : 'none', boxShadow: scrolled ? '0 1px 8px rgba(0,0,0,0.08)' : 'none' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="#hero" style={{ fontFamily: "'Cinzel', serif", fontSize: '1.1rem', color: 'hsl(var(--foreground))', textDecoration: 'none' }}>{coupleNames}</a>
        <div style={{ display: 'flex', gap: '28px' }}>
          {navItems.map(item => (
            <a key={item.href} href={item.href} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))', textDecoration: 'none' }}>{item.label}</a>
          ))}
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none' }} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

// ======================== HERO ========================
const HeroSection = ({ bride, groom, date, backgroundImage }) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <section id="hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <img src={backgroundImage} alt="Wedding" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 20px', width: '100%' }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.8rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.95)', marginBottom: '16px', textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>We're Getting Married</p>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: '500', color: 'white', marginBottom: '8px', letterSpacing: '0.05em', textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}>{bride}</h1>
        <div style={S.divider}>
          <div style={{ ...S.dividerLine, background: 'rgba(255,255,255,0.8)' }} />
          <Heart size={18} fill="white" color="white" />
          <div style={{ ...S.dividerLine, background: 'rgba(255,255,255,0.8)' }} />
        </div>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: '500', color: 'white', letterSpacing: '0.05em', textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}>{groom}</h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: 'rgba(255,255,255,0.95)', marginTop: '24px', fontStyle: 'italic', textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>{formattedDate}</p>
        <motion.a href="#countdown" whileHover={{ scale: 1.05 }} style={{ display: 'inline-block', marginTop: '32px', padding: '12px 36px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.7)', color: 'white', fontFamily: "'Montserrat', sans-serif", fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', cursor: 'pointer', background: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(4px)' }}>Scroll Down</motion.a>
      </motion.div>
    </section>
  );
};

// ======================== COUNTDOWN ========================
const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) { clearInterval(timer); return; }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);
  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];
  return (
    <section id="countdown" style={{ ...S.section, background: 'hsl(var(--background))' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={S.centered}>
        <h2 style={S.sectionTitle}>Save the Date</h2>
        <div style={S.divider}><div style={S.dividerLine} /><Heart size={14} color="hsl(var(--primary))" fill="hsl(var(--primary))" /><div style={S.dividerLine} /></div>
        <p style={S.sectionSubtitle}>Counting down to our forever</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {units.map(unit => (
            <div key={unit.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '8px' }}>
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: '2.2rem', fontWeight: '600', color: 'hsl(var(--primary))' }}>{String(unit.value).padStart(2, '0')}</span>
              </div>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>{unit.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

// ======================== GALLERY ========================
const Gallery = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const navigate = dir => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + dir + images.length) % images.length);
  };
  return (
    <section id="gallery" style={{ ...S.section, background: 'hsl(var(--muted) / 0.3)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={S.centered}>
        <h2 style={S.sectionTitle}>Our Gallery</h2>
        <div style={S.divider}><div style={S.dividerLine} /><Heart size={14} color="hsl(var(--primary))" fill="hsl(var(--primary))" /><div style={S.dividerLine} /></div>
        <p style={S.sectionSubtitle}>Moments captured in time</p>
      </motion.div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', maxWidth: '900px', margin: '0 auto' }}>
        {images.map((img, i) => (
          <motion.div key={i} whileHover={{ scale: 1.03 }} style={{ cursor: 'pointer', overflow: 'hidden', borderRadius: '12px', aspectRatio: '4/3' }} onClick={() => setSelectedIndex(i)}>
            <img src={img} alt={`Gallery ${i + 1}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setSelectedIndex(null)}>
            <button onClick={() => setSelectedIndex(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}><X size={32} /></button>
            <button onClick={e => { e.stopPropagation(); navigate(-1); }} style={{ position: 'absolute', left: '20px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}><ChevronLeft size={40} /></button>
            <button onClick={e => { e.stopPropagation(); navigate(1); }} style={{ position: 'absolute', right: '20px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}><ChevronRight size={40} /></button>
            <motion.img key={selectedIndex} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} src={images[selectedIndex]} alt="Full size" style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '8px' }} onClick={e => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// ======================== TIMELINE ========================
const Timeline = ({ events }) => {
  const iconMap = {
    heart: <Heart size={18} />, music: <Music size={18} />, star: <Star size={18} />,
    glass: <Wine size={18} />, utensils: <Utensils size={18} />, party: <Star size={18} />,
  };
  return (
    <section id="timeline" style={{ ...S.section, background: 'hsl(var(--background))' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={S.centered}>
        <h2 style={S.sectionTitle}>Event Schedule</h2>
        <div style={S.divider}><div style={S.dividerLine} /><Heart size={14} color="hsl(var(--primary))" fill="hsl(var(--primary))" /><div style={S.dividerLine} /></div>
        <p style={S.sectionSubtitle}>A timeline of our special day</p>
      </motion.div>
      <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'hsl(var(--primary) / 0.3)', transform: 'translateX(-50%)' }} />
        {events.map((event, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} style={{ display: 'flex', justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start', marginBottom: '32px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '50%', top: '20px', transform: 'translateX(-50%)', width: '44px', height: '44px', borderRadius: '50%', background: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(var(--primary-foreground))', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              {iconMap[event.icon || 'heart'] || <Clock size={18} />}
            </div>
            <div style={{ width: '44%', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', textAlign: i % 2 === 0 ? 'right' : 'left' }}>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'hsl(var(--primary))' }}>{event.time}</span>
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', marginTop: '4px', color: 'hsl(var(--foreground))' }}>{event.title}</h4>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginTop: '4px' }}>{event.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// ======================== LOCATION ========================
const Location = ({ venue }) => (
  <section id="location" style={{ ...S.section, background: 'hsl(var(--muted) / 0.3)' }}>
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={S.centered}>
      <h2 style={S.sectionTitle}>Wedding Venue</h2>
      <div style={S.divider}><div style={S.dividerLine} /><Heart size={14} color="hsl(var(--primary))" fill="hsl(var(--primary))" /><div style={S.dividerLine} /></div>
      <p style={S.sectionSubtitle}>Where our journey begins</p>
    </motion.div>
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} style={{ maxWidth: '900px', margin: '0 auto', borderRadius: '16px', overflow: 'hidden', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
      <div style={{ aspectRatio: '16/7', width: '100%' }}>
        <iframe src={venue.mapEmbedUrl} width="100%" height="100%" style={{ border: 0, display: 'block' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Wedding venue map" />
      </div>
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.6rem', marginBottom: '8px', color: 'hsl(var(--foreground))' }}>{venue.name}</h3>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '20px' }}>
          <MapPin size={15} color="hsl(var(--primary))" /> {venue.address}
        </p>
        <a href={venue.mapUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', borderRadius: '8px', background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', fontFamily: "'Montserrat', sans-serif", fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', transition: 'opacity 0.2s' }}>
          <ExternalLink size={15} /> Open in Maps
        </a>
      </div>
    </motion.div>
  </section>
);

// ======================== RSVP ========================
const RSVPForm = () => {
  const [form, setForm] = useState({ name: '', phone: '', attendance: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.attendance) { alert('Please fill in all required fields'); return; }
    setSubmitted(true);
  };
  if (submitted) {
    return (
      <section id="rsvp" style={{ ...S.section, background: 'hsl(var(--background))' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '16px', padding: '60px 40px' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>💌</div>
          <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.8rem', marginBottom: '8px', color: 'hsl(var(--foreground))' }}>Thank You!</h3>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', color: 'hsl(var(--muted-foreground))', fontStyle: 'italic' }}>Your response has been recorded. We can't wait to celebrate with you!</p>
        </motion.div>
      </section>
    );
  }
  const inputStyle = { width: '100%', padding: '12px 16px', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontFamily: "'Montserrat', sans-serif", fontSize: '0.9rem', background: 'hsl(var(--background))', color: 'hsl(var(--foreground))', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s' };
  return (
    <section id="rsvp" style={{ ...S.section, background: 'hsl(var(--background))' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={S.centered}>
        <h2 style={S.sectionTitle}>RSVP</h2>
        <div style={S.divider}><div style={S.dividerLine} /><Heart size={14} color="hsl(var(--primary))" fill="hsl(var(--primary))" /><div style={S.dividerLine} /></div>
        <p style={S.sectionSubtitle}>Kindly let us know if you'll be joining us</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: '540px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontFamily: "'Montserrat', sans-serif", fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'hsl(var(--foreground))' }}>Full Name *</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="Your full name" />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: "'Montserrat', sans-serif", fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'hsl(var(--foreground))' }}>Phone Number *</label>
            <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} placeholder="Your phone number" />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: "'Montserrat', sans-serif", fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px', color: 'hsl(var(--foreground))' }}>Will you attend? *</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['attending', 'not-attending'].map(opt => (
                <button key={opt} type="button" onClick={() => setForm({ ...form, attendance: opt })} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: `1px solid ${form.attendance === opt ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`, background: form.attendance === opt ? 'hsl(var(--primary))' : 'hsl(var(--background))', color: form.attendance === opt ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))', fontFamily: "'Montserrat', sans-serif", fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {opt === 'attending' ? '🎉 Joyfully Accept' : '😔 Regretfully Decline'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: "'Montserrat', sans-serif", fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'hsl(var(--foreground))' }}>Message (optional)</label>
            <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ ...inputStyle, resize: 'none' }} rows={3} placeholder="A few words for the couple..." />
          </div>
          <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: '8px', background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', fontFamily: "'Montserrat', sans-serif", fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}>Send RSVP</button>
        </form>
      </motion.div>
    </section>
  );
};

// ======================== FOOTER ========================
const WeddingFooter = ({ bride, groom }) => (
  <footer style={{ padding: '48px 20px', textAlign: 'center', borderTop: '1px solid hsl(var(--border) / 0.3)', background: 'hsl(var(--background))' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
      <div style={{ width: '48px', height: '1px', background: 'hsl(var(--primary) / 0.4)' }} />
      <Heart size={13} color="hsl(var(--primary))" fill="hsl(var(--primary))" />
      <div style={{ width: '48px', height: '1px', background: 'hsl(var(--primary) / 0.4)' }} />
    </div>
    <p style={{ fontFamily: "'Cinzel', serif", fontSize: '1.3rem', color: 'hsl(var(--foreground))' }}>{bride} & {groom}</p>
    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))', marginTop: '8px' }}>Made with love</p>
  </footer>
);

// ======================== MAIN ========================
const AbebeAndAbebech = () => {
  const data = weddingData;
  return (
    <div id="template-root" style={{ fontFamily: "'Montserrat', sans-serif", color: 'hsl(var(--foreground))', minHeight: '100vh', background: 'hsl(var(--background))' }} className="theme-elegant">
      <WeddingNav coupleNames={`${data.couple.bride} & ${data.couple.groom}`} />
      <HeroSection bride={data.couple.bride} groom={data.couple.groom} date={data.date} backgroundImage={data.gallery[0]} />
      <Countdown targetDate={data.date} />
      <Gallery images={data.gallery} />
      <Timeline events={data.timeline} />
      <Location venue={data.venue} />
      <RSVPForm />
      <WeddingFooter bride={data.couple.bride} groom={data.couple.groom} />
      <ThemeToggle defaultDark={false} />
    </div>
  );
};

export default AbebeAndAbebech;
