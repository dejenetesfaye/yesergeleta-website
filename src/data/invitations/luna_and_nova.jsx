import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sun, Moon, MapPin, Play, Pause, Volume2, VolumeX, Send, ChevronDown, ChevronUp, Star, Sparkles, Orbit } from 'lucide-react';

const P = {
  bg: '#050214', bgL: '#F0F0FF',
  card: '#0D0925', cardL: '#FFFFFF',
  pri: '#9D65FF', priL: '#6200EE',
  acc: '#FFD700', accL: '#FFC107',
  cyan: '#00F2FF', cyanL: '#00B8D4',
  txt: '#E0E0FF', txtL: '#1A1A2E',
  mut: '#8A8AAF', mutL: '#666688',
  bdr: '#1F1B3D', bdrL: '#E0E0F0',
};

function useCD(t) {
  const [s, ss] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const id = setInterval(() => {
      const diff = new Date(t) - Date.now();
      if (diff <= 0) return;
      ss({
        d: Math.floor(diff / 86400000),
        h: Math.floor(diff / 3600000 % 24),
        m: Math.floor(diff / 60000 % 60),
        s: Math.floor(diff / 1000 % 60)
      });
    }, 1000);
    return () => clearInterval(id);
  }, [t]);
  return s;
}

function MusicPlayer({ dark }) {
  const [play, setP] = useState(false);
  const [mute, setM] = useState(false);
  const ref = useRef(null);
  const p = dark ? P.pri : P.priL;

  useEffect(() => {
    const fn = () => {
      if (ref.current) {
        ref.current.play().then(() => setP(true)).catch(() => { });
      }
    };
    fn();
    window.addEventListener('click', fn, { once: true });
    window.addEventListener('touchstart', fn, { once: true });
    return () => {
      window.removeEventListener('click', fn);
      window.removeEventListener('touchstart', fn);
    };
  }, []);

  const toggle = () => {
    if (!ref.current) return;
    if (play) {
      ref.current.pause();
      setP(false);
    } else {
      ref.current.play().catch(() => { });
      setP(true);
    }
  };
  return (
    <>
      <audio ref={ref} loop muted={mute} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" />
      <div style={{ position: 'fixed', bottom: 24, right: 80, zIndex: 100, display: 'flex', gap: 8 }}>
        <button onClick={toggle} style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${p}, ${P.cyan})`, color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${P.cyan}50` }}>
          {play ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button onClick={() => setM(!mute)} style={{ width: 44, height: 44, borderRadius: '50%', background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', color: p, border: `1px solid ${p}40`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {mute ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </>
  );
}


function CDiv({ dark }) {
  const p = dark ? P.pri : P.priL;
  const a = dark ? P.acc : P.accL;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', margin: '20px 0' }}>
      <div style={{ flex: 1, maxWidth: 60, height: 1, background: `linear-gradient(to right, transparent, ${p})` }} />
      <Star size={14} fill={a} color={a} />
      <Heart size={14} fill={p} color={p} />
      <Star size={14} fill={a} color={a} />
      <div style={{ flex: 1, maxWidth: 60, height: 1, background: `linear-gradient(to left, transparent, ${p})` }} />
    </div>
  );
}

function Wishes({ dark }) {
  const [name, setN] = useState('');
  const [msg, setM] = useState('');
  const [list, setL] = useState(() => {
    try { return JSON.parse(localStorage.getItem('luna_nova_wishes') || '[]'); } catch { return []; }
  });
  const card = dark ? P.card : P.cardL;
  const bdr = dark ? P.bdr : P.bdrL;
  const p = dark ? P.pri : P.priL;
  const txt = dark ? P.txt : P.txtL;
  const mut = dark ? P.mut : P.mutL;

  const sub = (e) => {
    e.preventDefault();
    if (!name.trim() || !msg.trim()) return;
    const nl = [{ name, msg, date: new Date().toLocaleDateString() }, ...list];
    setL(nl);
    localStorage.setItem('luna_nova_wishes', JSON.stringify(nl));
    setN(''); setM('');
    window.open(`https://t.me/yeserge_leta1?text=${encodeURIComponent(`✨ Galactic Wish from ${name}: ${msg}`)}`, '_blank');
  };

  return (
    <section style={{ padding: '80px 24px', background: dark ? 'rgba(157,101,255,0.03)' : P.bgL, position: 'relative' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: P.cyan, marginBottom: 8, textAlign: 'center' }}>Space Transmission</p>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2.5rem', fontWeight: 700, color: txt, textAlign: 'center' }}>Blessings & Wishes</h2>
        <CDiv dark={dark} />
        <form onSubmit={sub} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
          <input value={name} onChange={e => setN(e.target.value)} placeholder="Your Name" style={{ padding: '14px 20px', background: card, border: `1px solid ${bdr}`, borderRadius: 8, color: txt, fontFamily: "'Inter', sans-serif", fontSize: '1rem', outline: 'none' }} />
          <textarea value={msg} onChange={e => setM(e.target.value)} placeholder="Type your celestial message here..." rows={4} style={{ padding: '14px 20px', background: card, border: `1px solid ${bdr}`, borderRadius: 8, color: txt, fontFamily: "'Inter', sans-serif", fontSize: '1rem', outline: 'none', resize: 'vertical' }} />
          <button type="submit" style={{ padding: '16px', background: `linear-gradient(135deg, ${P.pri}, ${P.cyan})`, color: 'white', border: 'none', borderRadius: 8, fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: `0 0 30px ${P.pri}40` }}>
            <Send size={18} /> Launch Message
          </button>
        </form>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {list.map((w, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: card, border: `1px solid ${bdr}`, borderRadius: 12, padding: '20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 2, background: `linear-gradient(to right, ${P.pri}, ${P.cyan})` }} />
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: p, fontSize: '1.1rem', marginBottom: 4 }}>{w.name}</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1rem', color: mut, lineHeight: 1.6 }}>{w.msg}</p>
              <p style={{ fontSize: '0.7rem', color: mut, marginTop: 8, opacity: 0.6 }}>{w.date}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ({ dark }) {
  const [open, setO] = useState(null);
  const card = dark ? P.card : P.cardL;
  const bdr = dark ? P.bdr : P.bdrL;
  const p = dark ? P.pri : P.priL;
  const txt = dark ? P.txt : P.txtL;
  const mut = dark ? P.mut : P.mutL;
  const items = [
    { q: 'What is the "Cosmic" dress code?', a: 'Think stardust and midnight skies! We encourage deep blues, purples, silvers, and anything that shimmers. Black-tie creative is the vibe.' },
    { q: 'Will there be space for docking (parking)?', a: 'Yes, full valet docking is available at the Observatory entrance from 5:00 PM.' },
    { q: 'Are young astronauts (children) allowed?', a: 'We welcome junior explorers to the ceremony! The reception will transition to a more adult-focused "Space Station" vibe after 9 PM.' },
    { q: 'What if I have dietary orbits?', a: 'Please specify any dietary requirements in your RSVP. Our cosmic catering team will ensure your fuel is perfectly balanced.' },
    { q: 'Can I bring a +1 across the galaxy?', a: 'Due to the limited capacity of our launch vehicle (venue), plus-ones are only by invitation. Check your specific envelope!' },
    { q: 'Will the ceremony be streamed to Earth?', a: 'Yes! For our relatives on other continents, we will provide a private live link 30 minutes before launch.' },
  ];
  return (
    <section style={{ padding: '80px 24px', background: dark ? P.bg : P.bgL }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: P.cyan, marginBottom: 8, textAlign: 'center' }}>Information Protocol</p>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2.5rem', fontWeight: 700, color: txt, textAlign: 'center' }}>Celestial FAQ</h2>
        <CDiv dark={dark} />
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item, i) => (
            <div key={i} style={{ background: card, border: `1px solid ${open === i ? p : bdr}`, borderRadius: 12, overflow: 'hidden', boxShadow: open === i ? `0 0 30px ${p}20` : 'none', transition: 'all 0.3s' }}>
              <button onClick={() => setO(open === i ? null : i)} style={{ width: '100%', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.05rem', fontWeight: 600, color: txt }}>{item.q}</span>
                {open === i ? <ChevronUp size={18} color={P.cyan} /> : <ChevronDown size={18} color={p} />}
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', padding: '0 24px 20px', fontFamily: "'Inter', sans-serif", fontSize: '1rem', lineHeight: 1.8, color: mut }}>
                    {item.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LunaAndNova() {
  const [dark, setD] = useState(true);
  const [sc, setSc] = useState(false);
  const cd = useCD('2026-11-28T18:00:00');
  useEffect(() => {
    const fn = () => setSc(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const bg = dark ? P.bg : P.bgL;
  const card = dark ? P.card : P.cardL;
  const p = dark ? P.pri : P.priL;
  const txt = dark ? P.txt : P.txtL;
  const mut = dark ? P.mut : P.mutL;
  const bdr = dark ? P.bdr : P.bdrL;

  return (
    <div style={{ background: bg, color: txt, minHeight: '100vh', fontFamily: "'Inter', sans-serif", transition: 'all 0.4s', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: sc ? (dark ? 'rgba(5,2,20,0.95)' : 'rgba(240,240,255,0.95)') : 'transparent', backdropFilter: 'blur(12px)', borderBottom: sc ? `1px solid ${bdr}` : 'none', transition: 'all 0.4s', padding: '0 40px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Orbit size={24} color={P.cyan} />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.2rem', fontWeight: 700, color: p, letterSpacing: '0.1em' }}>L & N</span>
        </div>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {['About', 'Story', 'Mission', 'Galaxies', 'Crew', 'Memories', 'RSVP'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', color: mut, textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif" }}>{l}</a>
          ))}
        </div>
        <button onClick={() => setD(!dark)} style={{ background: 'none', border: `1px solid ${p}`, borderRadius: 20, padding: '8px 16px', color: p, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
          {dark ? <Sun size={14} /> : <Moon size={14} />} {dark ? 'Sun' : 'Moon'}
        </button>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Starfield background */}
        <div style={{ position: 'absolute', inset: -100, background: dark ? 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)' : 'radial-gradient(ellipse at bottom, #E0E0FF 0%, #FFFFFF 100%)', zIndex: -1 }} />
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }} transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }} style={{ position: 'absolute', top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, width: Math.random() * 3, height: Math.random() * 3, borderRadius: '50%', background: i % 2 === 0 ? P.cyan : 'white', boxShadow: `0 0 10px ${P.cyan}`, pointerEvents: 'none' }} />
        ))}

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5 }} style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 800, padding: '0 24px' }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.5em', textTransform: 'uppercase', color: P.cyan, marginBottom: 16 }}>Two Stars Align</p>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(3rem, 10vw, 7rem)', fontWeight: 700, lineHeight: 0.9, marginBottom: 12, background: `linear-gradient(135deg, white, ${P.pri}, ${P.cyan})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 30px rgba(157,101,255,0.4))' }}>Luna & Nova</h1>
          <CDiv dark={dark} />
          <p style={{ fontSize: '1.2rem', fontWeight: 500, letterSpacing: '0.1em', color: mut, marginBottom: 32 }}>November 28, 2026 · The Stellar Observatory</p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ padding: '16px 32px', borderRadius: 40, background: 'rgba(255,255,255,0.1)', border: `2px solid ${P.cyan}`, color: 'white', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>Launch Mission</motion.button>
        </motion.div>

        {/* Floating astronaut or something */}
        <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 6, repeat: Infinity }} style={{ position: 'absolute', bottom: '10%', right: '10%', width: 150, opacity: 0.4, pointerEvents: 'none' }}>
          <Orbit size={100} color={P.pri} />
        </motion.div>
      </section>

      {/* COUNTDOWN */}
      <section style={{ padding: '80px 24px', textAlign: 'center', position: 'relative' }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: P.cyan, marginBottom: 32 }}>T-Minus Launch</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          {[['Days', cd.d], ['Hours', cd.h], ['Minutes', cd.m], ['Seconds', cd.s]].map(([l, v]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ width: 100, height: 100, borderRadius: 20, background: card, border: `2px solid ${P.bdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: `0 0 40px ${P.pri}20`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: `linear-gradient(45deg, transparent, ${P.cyan}, transparent)` }} />
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2.5rem', fontWeight: 700, color: p }}>{String(v).padStart(2, '0')}</span>
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', color: mut }}>{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT US */}
      <section id="about" style={{ padding: '80px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: P.cyan, marginBottom: 8 }}>Individual Orbits</p>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2.5rem', fontWeight: 700, color: txt }}>Meet the Explorers</h2>
          <CDiv dark={dark} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
          {[
            { name: 'Luna Vance', role: 'Mission Commander', img: '/images/couple_1.jpg', desc: 'An astrophysicist who spent her life looking at the stars, never expecting to find one walking on Earth. Luna brings the logic, the maps, and the light.' },
            { name: 'Nova Sterling', role: 'Flight Engineer', img: '/images/couple_2.jpg', desc: 'A software architect who builds worlds in code. Nova was a solitary satellite until he entered Luna\'s gravitational pull. He hasn\'t left orbit since.' },
          ].map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} style={{ background: card, border: `1px solid ${bdr}`, borderRadius: 24, overflow: 'hidden', position: 'relative' }}>
              <div style={{ height: 320, overflow: 'hidden' }}>
                <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: dark ? 'grayscale(0.5) brightness(0.8)' : 'none' }} />
              </div>
              <div style={{ padding: '24px', textAlign: 'center' }}>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.8rem', fontWeight: 700, color: P.pri }}>{p.name}</h3>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: P.cyan, marginBottom: 12 }}>{p.role}</p>
                <p style={{ fontSize: '1rem', lineHeight: 1.7, color: mut, fontStyle: 'italic' }}>{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* OUR LOVE STORY */}
      <section id="story" style={{ padding: '80px 24px', background: dark ? 'rgba(157,101,255,0.02)' : P.bgL }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: P.cyan, marginBottom: 8, textAlign: 'center' }}>Mission History</p>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2.5rem', fontWeight: 700, color: txt, textAlign: 'center' }}>The Alignment</h2>
          <CDiv dark={dark} />
          <div style={{ marginTop: 40, position: 'relative' }}>
            {/* Mission Path */}
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, transparent, ${P.pri}, ${P.cyan}, transparent)`, transform: 'translateX(-50%)' }} />
            {[
              { date: 'Year 2022', title: 'First Encounter', desc: 'At a planetary science conference, arguing over the atmospheric composition of Europa. They ended up talking until the building closed.', img: '/images/couple_3.jpg', side: 'left' },
              { date: 'Year 2023', title: 'The Launch', desc: 'Their first trip together to the Mauna Kea Observatory. Under a truly dark sky, Nova realized he didn\'t want to observe the stars without Luna by his side.', img: '/images/couple_4.jpg', side: 'right' },
              { date: 'Year 2025', title: 'The Event Horizon', desc: 'During a total solar eclipse, as the sun was obscured, Nova pulled out a ring that mirrored the corona. Luna didn\'t wait for the sun to return to say yes.', img: '/images/couple_1.jpg', side: 'left' },
              { date: 'Nov 2026', title: 'Eternal Link', desc: 'Today, they formalize their binary system, pledging to orbit one another for the rest of their days.', img: '/images/hero3.jpg', side: 'right' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: item.side === 'left' ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ display: 'flex', justifyContent: item.side === 'left' ? 'flex-end' : 'flex-start', marginBottom: 60, position: 'relative' }}>
                <div style={{ position: 'absolute', left: '50%', top: 20, width: 20, height: 20, borderRadius: '50%', background: P.cyan, transform: 'translateX(-50%)', border: `4px solid ${bg}`, boxShadow: `0 0 15px ${P.cyan}` }} />
                <div style={{ width: '45%', background: card, border: `1px solid ${bdr}`, borderRadius: 20, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                  <div style={{ height: 180, overflow: 'hidden' }}>
                    <img src={item.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.7rem', fontWeight: 700, color: P.cyan, marginBottom: 4 }}>{item.date}</p>
                    <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.2rem', fontWeight: 700, color: P.pri, marginBottom: 8 }}>{item.title}</h4>
                    <p style={{ fontSize: '0.95rem', color: mut, lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="mission" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: P.cyan, marginBottom: 8 }}>Flight Plan</p>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2.5rem', fontWeight: 700, color: txt }}>Mission Schedule</h2>
        <CDiv dark={dark} />
        <div style={{ maxWidth: 650, margin: '30px auto 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { time: '17:00', icon: '🚀', title: 'Boarding & Fueling', desc: 'Guest arrival & celestial appetizers' },
            { time: '18:00', icon: '💍', title: 'The Link Ceremony', desc: 'Vows at the Event Horizon Arbour' },
            { time: '19:30', icon: '🥂', title: 'Anti-Gravity Reception', desc: 'Champagne & cosmic cocktails' },
            { time: '20:30', icon: '🍽️', title: 'Galactic Banquet', desc: 'A five-course journey through the stars' },
            { time: '22:00', icon: '💃', title: 'The Big Bang Party', desc: 'Intergalactic beats & dancing until late' },
            { time: '00:00', icon: '✨', title: 'Stardust Send-off', desc: 'Sparklers & final launch' },
          ].map((e, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ display: 'flex', gap: 20, alignItems: 'center', padding: '16px 24px', background: card, border: `1px solid ${bdr}`, borderRadius: 16, textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: P.pri }} />
              <div style={{ fontSize: '1.8rem', minWidth: 50, textAlign: 'center' }}>{e.icon}</div>
              <div>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: P.cyan, marginBottom: 2 }}>{e.time} GST</p>
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 600, color: txt, marginBottom: 2 }}>{e.title}</h4>
                <p style={{ fontSize: '0.9rem', color: mut }}>{e.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LOCATIONS */}
      <section id="galaxies" style={{ padding: '80px 24px', background: dark ? 'rgba(157,101,255,0.02)' : P.bgL }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: P.cyan, marginBottom: 8, textAlign: 'center' }}>Navigational Coordinates</p>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2.5rem', fontWeight: 700, color: txt, textAlign: 'center' }}>Base Stations</h2>
          <CDiv dark={dark} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginTop: 32 }}>
            {[
              { name: 'The Stellar Observatory', type: 'Ceremony Site', coord: '34° 07\' N, 118° 18\' W', note: 'Outdoor deck, high altitude', maps: 'https://maps.google.com' },
              { name: 'Nebula Hall', type: 'Reception Deck', coord: '34° 07\' N, 118° 18\' W', note: 'Main hangar floor', maps: 'https://maps.google.com' },
              { name: 'The Moon Bar', type: 'Lounge & Drinks', coord: '34° 08\' N, 118° 19\' W', note: 'Sub-level star viewing lounge', maps: 'https://maps.google.com' },
            ].map((loc, i) => (
              <motion.div key={i} whileHover={{ y: -8 }} style={{ background: card, border: `1px solid ${bdr}`, borderRadius: 24, padding: '32px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 40, background: `linear-gradient(to bottom, ${P.pri}20, transparent)` }} />
                <Orbit size={40} color={P.cyan} style={{ marginBottom: 16 }} />
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.7rem', fontWeight: 700, color: P.cyan, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>{loc.type}</p>
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.4rem', fontWeight: 700, color: txt, marginBottom: 12 }}>{loc.name}</h4>
                <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '0.85rem', color: mut, marginBottom: 8 }}><MapPin size={14} color={P.pri} /> {loc.coord}</p>
                <p style={{ fontSize: '0.8rem', color: mut, marginBottom: 20, fontStyle: 'italic' }}>{loc.note}</p>
                <a href={loc.maps} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: 40, border: `1.5px solid ${P.cyan}`, color: P.cyan, textDecoration: 'none', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em' }}>Open Charts</a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="memories" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: P.cyan, marginBottom: 8 }}>Deep Space Images</p>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2.5rem', fontWeight: 700, color: txt }}>Memory Bank</h2>
        <CDiv dark={dark} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, maxWidth: 1100, margin: '30px auto 0' }}>
          {['/images/couple_1.jpg', '/images/couple_2.jpg', '/images/couple_3.jpg', '/images/couple_4.jpg', '/images/temp6.jpg', '/images/hero3.jpg', '/images/temp3.webp', '/images/hero2.jpg'].map((img, i) => (
            <motion.div key={i} whileHover={{ scale: 1.03 }} style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: i % 3 === 0 ? '3/4' : '4/3', border: `2px solid ${bdr}`, position: 'relative' }}>
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: dark ? 'brightness(0.9) contrast(1.1) saturate(0.8)' : 'none' }} />
              <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 40px rgba(0,242,255,0.1)' }} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* BRIDAL PARTY */}
      <section id="crew" style={{ padding: '80px 24px', background: dark ? 'rgba(157,101,255,0.02)' : P.bgL, textAlign: 'center' }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: P.cyan, marginBottom: 8 }}>The Mission Crew</p>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2.5rem', fontWeight: 700, color: txt }}>Bridal Party</h2>
        <CDiv dark={dark} />
        <div style={{ marginTop: 40 }}>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.2rem', fontWeight: 600, color: P.pri, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: 24 }}>Stellar Maidens</h3>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            {[{ n: 'Stella', r: 'Lead Satellite' }, { n: 'Lyra', r: 'Celestial Guide' }, { n: 'Celeste', r: 'Stardust Bearer' }, { n: 'Andromeda', r: 'Light Keeper' }].map((p, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} style={{ width: 140 }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px', border: `3px solid ${P.pri}`, padding: 4, background: bg }}>
                  <img src="/images/head1.jpg" alt={p.n} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                </div>
                <p style={{ fontWeight: 700, fontSize: '1rem', color: txt }}>{p.n}</p>
                <p style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', color: P.cyan }}>{p.r}</p>
              </motion.div>
            ))}
          </div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.2rem', fontWeight: 600, color: P.pri, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: 24 }}>Galactic Guardians</h3>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[{ n: 'Orion', r: 'Mission Sentinel' }, { n: 'Draco', r: 'Orbit Master' }, { n: 'Phoenix', r: 'Comet Pilot' }, { n: 'Aries', r: 'Void Navigator' }].map((p, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} style={{ width: 140 }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px', border: `3px solid ${P.cyan}`, padding: 4, background: bg }}>
                  <img src="/images/head1.jpg" alt={p.n} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                </div>
                <p style={{ fontWeight: 700, fontSize: '1rem', color: txt }}>{p.n}</p>
                <p style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', color: P.pri }}>{p.r}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: P.cyan, marginBottom: 8 }}>Project Alpha-Beta</p>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2.5rem', fontWeight: 700, color: txt, marginBottom: 32 }}>Mission Reel</h2>
        <div style={{ maxWidth: 850, margin: '0 auto', borderRadius: 20, overflow: 'hidden', border: `3px solid ${bdr}`, boxShadow: `0 0 60px ${P.pri}30`, position: 'relative', background: '#000', paddingTop: '56.25%' }}>
          <iframe style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Luna & Nova" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      </section>

      {/* WISHES & FAQ */}
      <Wishes dark={dark} />
      <FAQ dark={dark} />

      {/* TELEGRAM */}
      <section style={{ padding: '60px 24px', background: dark ? P.bg : P.bgL, textAlign: 'center' }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: P.cyan, marginBottom: 8 }}>Frequency Open</p>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2rem', fontWeight: 600, color: txt, marginBottom: 16 }}>Broadcast to Mission Control</h2>
        <p style={{ color: mut, fontSize: '0.95rem', maxWidth: 460, margin: '0 auto 24px', lineHeight: 1.6 }}>Our comms are open on the Telegram network. Reach out for any questions or to send a personal signal.</p>
        <a href="https://t.me/yeserge_leta1" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '16px 32px', background: '#0088cc', color: 'white', borderRadius: 40, fontWeight: 700, textDecoration: 'none', boxShadow: '0 10px 30px rgba(0,136,204,0.4)', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
          <Send size={18} /> @yeserge_leta1
        </a>
      </section>

      {/* RSVP */}
      <section id="rsvp" style={{ padding: '100px 24px', position: 'relative', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(5,2,20,0.8), rgba(5,2,20,0.9)), url(/images/hero3.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -1 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 500, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.4em', textTransform: 'uppercase', color: P.cyan, marginBottom: 12 }}>Ready for Takeoff?</p>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '3rem', fontWeight: 700, color: 'white', marginBottom: 12 }}>RSVP</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 36, fontSize: '1.1rem' }}>Secure your boarding pass by Oct 1, 2026</p>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 14 }} onSubmit={e => { e.preventDefault(); const fd = new FormData(e.target); const msg = `🚀 RSVP — Luna & Nova\nName: ${fd.get('name')}\nAttendance: ${fd.get('att')}\nGuests: ${fd.get('guests')}\nSpecial Fuel: ${fd.get('fuel')}`; window.open(`https://t.me/yeserge_leta1?text=${encodeURIComponent(msg)}`, '_blank'); e.target.reset(); }}>
            {[['name', 'Full Name', 'text'], ['email', 'Email Address', 'email'], ['fuel', 'Dietary Fuel Needs (Optional)', 'text']].map(([id, ph, tp]) => (
              <input key={id} name={id} type={tp} placeholder={ph} required style={{ padding: '14px 20px', borderRadius: 12, border: `1.5px solid rgba(0,242,255,0.3)`, background: 'rgba(255,255,255,0.05)', color: 'white', fontFamily: "'Inter', sans-serif", fontSize: '1rem', outline: 'none', backdropFilter: 'blur(10px)' }} />
            ))}
            <select name="att" required style={{ padding: '14px 20px', borderRadius: 12, border: `1.5px solid rgba(0,242,255,0.3)`, background: 'rgba(255,255,255,0.05)', color: 'white', fontFamily: "'Inter', sans-serif", fontSize: '1rem', outline: 'none', backdropFilter: 'blur(10px)' }}>
              <option value="">Status</option>
              <option>Confirm Boarding 🚀</option>
              <option>Mission Aborted 🛰️</option>
            </select>
            <input name="guests" type="number" min="1" max="5" placeholder="Number of Crew" style={{ padding: '14px 20px', borderRadius: 12, border: `1.5px solid rgba(0,242,255,0.3)`, background: 'rgba(255,255,255,0.05)', color: 'white', fontFamily: "'Inter', sans-serif", fontSize: '1rem', outline: 'none' }} />
            <button type="submit" style={{ padding: '18px', background: `linear-gradient(135deg, ${P.pri}, ${P.cyan})`, color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer', boxShadow: `0 0 30px ${P.pri}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>Confirm Mission</button>
          </form>
        </div>
      </section>

      {/* QR CODE */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: P.cyan, marginBottom: 8 }}>Entry Authorization</p>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2.5rem', fontWeight: 700, color: txt, marginBottom: 12 }}>QR Boarding Pass</h2>
        <CDiv dark={dark} />
        <p style={{ color: mut, maxWidth: 480, margin: '0 auto 32px', fontSize: '0.95rem', fontStyle: 'italic' }}>Please have this digital clearance badge ready at the entrance gate of the Stellar Observatory.</p>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: 32, background: card, border: `2px solid ${P.pri}`, borderRadius: 32, boxShadow: `0 0 50px ${P.pri}30`, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 32, border: `1px solid ${P.cyan}40`, pointerEvents: 'none', margin: -6 }} />
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://yesergeleta.com/entry?mission=luna-nova-2026')}&bgcolor=${dark ? '0D0925' : 'FFFFFF'}&color=00F2FF`} alt="Boarding QR" style={{ width: 200, height: 200, borderRadius: 12 }} />
          <div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.4rem', fontWeight: 700, color: P.pri, letterSpacing: '0.1em' }}>MISSION LUNA & NOVA</p>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: mut, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Auth Level: Galactic Guest · 2026.11.28</p>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '60px 24px', textAlign: 'center', borderTop: `1px solid ${bdr}` }}>
        <Orbit size={32} color={P.cyan} style={{ marginBottom: 16 }} />
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.8rem', fontWeight: 700, color: p }}>Luna & Nova</p>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3em', color: mut, marginTop: 8 }}>Beyond the Stars and Back · 2026</p>
      </footer>

      {/* FLOATING CONTROLS */}
      <button onClick={() => setD(!dark)} style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 100, width: 44, height: 44, borderRadius: '50%', background: p, color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 20px ${p}50` }}>
        {dark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <MusicPlayer dark={dark} />
    </div>
  );
}
