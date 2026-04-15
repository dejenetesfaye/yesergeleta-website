import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sun, Moon, MapPin, Play, Pause, Volume2, VolumeX, Send, ChevronDown, ChevronUp, Sparkles, Cloud } from 'lucide-react';

const P = {
  bg: 'linear-gradient(135deg, #E0F2FE 0%, #F0FDFA 50%, #FAF5FF 100%)',
  bgD: 'linear-gradient(135deg, #020617 0%, #0F172A 100%)',
  glass: 'rgba(255, 255, 255, 0.4)',
  glassD: 'rgba(30, 41, 59, 0.5)',
  pri: '#0EA5E9', priD: '#38BDF8',
  acc: '#A855F7', accD: '#C084FC',
  txt: '#0F172A', txtD: '#F1F5F9',
  mut: '#64748B', mutD: '#94A3B8',
  bdr: 'rgba(255, 255, 255, 0.5)',
  bdrD: 'rgba(255, 255, 255, 0.1)',
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
  const p = dark ? P.priD : P.pri;

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
      <audio ref={ref} loop muted={mute} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" />
      <div style={{ position: 'fixed', bottom: 24, right: 80, zIndex: 1000, display: 'flex', gap: 12 }}>
        <button onClick={toggle} style={{ width: 48, height: 48, borderRadius: '16px', background: dark ? p : p, color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 32px ${p}60` }}>
          {play ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button onClick={() => setM(!mute)} style={{ width: 48, height: 48, borderRadius: '16px', background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', color: p, border: `2px solid ${p}40`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
          {mute ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>
    </>
  );
}


function ADiv({ dark }) {
  const p = dark ? P.priD : P.pri;
  const a = dark ? P.accD : P.acc;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', margin: '24px 0' }}>
      <div style={{ flex: 1, maxWidth: 50, height: 2, background: `linear-gradient(to right, transparent, ${p})`, borderRadius: 10 }} />
      <Sparkles size={16} color={a} />
      <Heart size={16} fill={p} color={p} />
      <Sparkles size={16} color={a} />
      <div style={{ flex: 1, maxWidth: 50, height: 2, background: `linear-gradient(to left, transparent, ${p})`, borderRadius: 10 }} />
    </div>
  );
}

function Wishes({ dark }) {
  const [name, setN] = useState('');
  const [msg, setM] = useState('');
  const [list, setL] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sophia_oliver_wishes') || '[]'); } catch { return []; }
  });
  const glass = dark ? P.glassD : P.glass;
  const bdr = dark ? P.bdrD : P.bdr;
  const p = dark ? P.priD : P.pri;
  const txt = dark ? P.txtD : P.txt;
  const mut = dark ? P.mutD : P.mut;

  const sub = (e) => {
    e.preventDefault();
    if (!name.trim() || !msg.trim()) return;
    const nl = [{ name, msg, date: new Date().toLocaleDateString() }, ...list];
    setL(nl);
    localStorage.setItem('sophia_oliver_wishes', JSON.stringify(nl));
    setN(''); setM('');
    window.open(`https://t.me/yeserge_leta1?text=${encodeURIComponent(`🌌 Aurora Wish from ${name}: ${msg}`)}`, '_blank');
  };

  return (
    <section style={{ padding: '80px 24px', background: 'transparent' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', background: glass, backdropFilter: 'blur(16px)', border: `1px solid ${bdr}`, borderRadius: 32, padding: '48px 32px' }}>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: p, marginBottom: 8, textAlign: 'center' }}>Guest Signals</p>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.5rem', fontWeight: 700, color: txt, textAlign: 'center' }}>Aurora Wishes</h2>
        <ADiv dark={dark} />
        <form onSubmit={sub} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
          <input value={name} onChange={e => setN(e.target.value)} placeholder="Your Name" required style={{ padding: '16px 20px', background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)', border: `1px solid ${bdr}`, borderRadius: 16, color: txt, outline: 'none', fontSize: '1rem', fontFamily: "'Inter', sans-serif" }} />
          <textarea value={msg} onChange={e => setM(e.target.value)} placeholder="Type your ethereal blessing..." rows={4} required style={{ padding: '16px 20px', background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)', border: `1px solid ${bdr}`, borderRadius: 16, color: txt, outline: 'none', fontSize: '1rem', fontFamily: "'Inter', sans-serif", resize: 'none' }} />
          <button type="submit" style={{ padding: '18px', background: `linear-gradient(135deg, ${p}, ${dark ? P.accD : P.acc})`, color: 'white', border: 'none', borderRadius: 16, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: `0 8px 30px ${p}40` }}>
            <Send size={20} /> Transmit Blessing
          </button>
        </form>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {list.map((w, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.3)', border: `1px solid ${bdr}`, borderRadius: 20, padding: '24px' }}>
              <p style={{ fontWeight: 700, color: p, fontSize: '1.1rem', marginBottom: 4 }}>{w.name}</p>
              <p style={{ fontSize: '1rem', color: mut, lineHeight: 1.6 }}>{w.msg}</p>
              <p style={{ fontSize: '0.7rem', color: mut, marginTop: 12, opacity: 0.6 }}>{w.date}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ({ dark }) {
  const [open, setO] = useState(null);
  const glass = dark ? P.glassD : P.glass;
  const bdr = dark ? P.bdrD : P.bdr;
  const p = dark ? P.priD : P.pri;
  const txt = dark ? P.txtD : P.txt;
  const mut = dark ? P.mutD : P.mut;
  const items = [
    { q: 'What should I wear to the Aurora?', a: 'The dress code is "Luminous Formal". We encourage soft gradients, shimmering fabrics, and ethereal colors like sage, lavender, and sky blue.' },
    { q: 'Where can I park my chariot?', a: 'Valet parking is included at the Pearl Pavilion for all arriving guests.' },
    { q: 'Can I bring a Plus-One?', a: 'Invitations are specific. If your invite includes a guest, it will be noted in your digital profile.' },
    { q: 'Is the event child-friendly?', a: 'We have arranged an "Aurora Kids" lounge with professional attendants for guests with children.' },
    { q: 'Will the ceremony be outdoors?', a: 'Yes, the ceremony takes place on the Sky Deck. Please bring a light luminous wrap in case of a breeze.' },
  ];
  return (
    <section id="faq" style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: p, marginBottom: 8, textAlign: 'center' }}>Inquiry Chamber</p>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.5rem', fontWeight: 700, color: txt, textAlign: 'center' }}>Ethereal FAQ</h2>
        <ADiv dark={dark} />
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item, i) => (
            <div key={i} style={{ background: glass, backdropFilter: 'blur(12px)', border: `1px solid ${open === i ? p : bdr}`, borderRadius: 20, overflow: 'hidden' }}>
              <button onClick={() => setO(open === i ? null : i)} style={{ width: '100%', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', fontWeight: 600, color: txt }}>{item.q}</span>
                {open === i ? <ChevronUp size={20} color={p} /> : <ChevronDown size={20} color={mut} />}
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', padding: '0 24px 24px', fontSize: '1rem', lineHeight: 1.8, color: mut }}>
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

export default function SophiaAndOliver() {
  const [dark, setD] = useState(false);
  const [sc, setSc] = useState(false);
  const cd = useCD('2026-08-15T16:30:00');
  useEffect(() => {
    const fn = () => setSc(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const bg = dark ? P.bgD : P.bg;
  const glass = dark ? P.glassD : P.glass;
  const p = dark ? P.priD : P.pri;
  const a = dark ? P.accD : P.acc;
  const txt = dark ? P.txtD : P.txt;
  const mut = dark ? P.mutD : P.mut;
  const bdr = dark ? P.bdrD : P.bdr;

  return (
    <div style={{ background: bg, color: txt, minHeight: '100vh', fontFamily: "'Inter', sans-serif", transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Outfit:wght@300;400;600;700&family=Quicksand:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 50, width: '90%', maxWidth: 1000, height: 64, background: glass, backdropFilter: 'blur(20px)', border: `1px solid ${bdr}`, borderRadius: 24, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={24} color={p} />
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', fontWeight: 700, color: txt }}>S & O</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['About', 'Story', 'Events', 'Party', 'Gallery', 'RSVP'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: '0.8rem', fontWeight: 600, color: mut, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{l}</a>
          ))}
        </div>
        <button onClick={() => setD(!dark)} style={{ borderRadius: 12, width: 40, height: 40, background: 'transparent', border: `1px solid ${bdr}`, color: p, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>

      {/* HERO */}
      <section style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(192, 132, 252, 0.2) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }} style={{ textAlign: 'center', zIndex: 10, padding: '0 24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 20px', background: glass, backdropFilter: 'blur(10px)', border: `1px solid ${bdr}`, borderRadius: 40, marginBottom: 24 }}>
            <Sparkles size={16} color={p} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: mut }}>Under the Aurora Sky</span>
          </div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(4rem, 12vw, 8rem)', fontWeight: 700, lineHeight: 0.9, letterSpacing: '-0.02em', background: `linear-gradient(135deg, ${p}, ${a})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 20 }}>Sophia <br /> & Oliver</h1>
          <ADiv dark={dark} />
          <p style={{ fontSize: '1.4rem', fontWeight: 400, color: txt, opacity: 0.8, letterSpacing: '0.05em' }}>August 15, 2026 · The Pearl Pavilion</p>
        </motion.div>
      </section>

      {/* COUNTDOWN */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          {[['DAYS', cd.d], ['HRS', cd.h], ['MINS', cd.m], ['SECS', cd.s]].map(([l, v]) => (
            <div key={l} style={{ width: 110, height: 110, background: glass, backdropFilter: 'blur(12px)', border: `1px solid ${bdr}`, borderRadius: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 700, color: p, fontFamily: "'Outfit', sans-serif" }}>{String(v).padStart(2, '0')}</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: mut }}>{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT US */}
      <section id="about" style={{ padding: '100px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
          {[
            { name: 'Sophia Hayes', role: 'The Luminous Bride', img: '/images/couple_4.jpg', desc: 'A lover of morning dew and glass art. Sophia found her reflection in Oliver\'s steady gaze and decided her future was clear.' },
            { name: 'Oliver Thorne', role: 'The Radiant Groom', img: '/images/couple_3.jpg', desc: 'An architect of light and space. Oliver saw Sophia as the final piece of his masterpiece — the soul of his structural world.' }
          ].map((item, i) => (
            <motion.div key={i} whileHover={{ y: -10 }} style={{ background: glass, backdropFilter: 'blur(20px)', border: `1px solid ${bdr}`, borderRadius: 40, overflow: 'hidden', padding: 24, textAlign: 'center' }}>
              <div style={{ width: 220, height: 220, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 24px', border: `4px solid ${bdr}` }}>
                <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: 700, color: txt }}>{item.name}</h3>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: p, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>{item.role}</p>
              <p style={{ fontSize: '1rem', lineHeight: 1.8, color: mut, fontStyle: 'italic' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LOVE STORY */}
      <section id="story" style={{ padding: '100px 24px', position: 'relative' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: p, marginBottom: 8, textAlign: 'center' }}>The Light Path</p>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '3rem', fontWeight: 700, color: txt, textAlign: 'center' }}>Our Aurora Story</h2>
          <ADiv dark={dark} />
          <div style={{ marginTop: 60, display: 'flex', flexDirection: 'column', gap: 40 }}>
            {[
              { year: '2021', title: 'The Prism Refraction', desc: 'Met under the glass dome of the City Library. One shared book on light physics changed everything.' },
              { year: '2023', title: 'The Crystal Valley', desc: 'A winter trek through the crystal caves. Deep in the earth, they realized their hearts were perfectly transparent to each other.' },
              { year: '2025', title: 'The Dawn Promise', desc: 'Oliver proposed at the first light of dawn on the White Cliffs. The sunrise wasn\'t the only thing glowing.' }
            ].map((item, i) => (
              <motion.div key={i} whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }} style={{ background: glass, border: `1px solid ${bdr}`, borderRadius: 24, padding: 32, maxWidth: 500, alignSelf: i % 2 === 0 ? 'flex-start' : 'flex-end' }}>
                <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: p, marginBottom: 8 }}>{item.year}: {item.title}</h4>
                <p style={{ fontSize: '1rem', color: mut, lineHeight: 1.7 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="events" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.5rem', fontWeight: 700, color: txt }}>The Golden Hours</h2>
          <ADiv dark={dark} />
          <div style={{ display: 'grid', gap: 16, marginTop: 40 }}>
            {[
              { t: '16:30', e: 'Guest Reflection', d: 'Welcome drinks and light prisms in the foyer.' },
              { t: '17:30', e: 'The Luminous Vows', d: 'Exchange of promises at the Pearl Pavilion.' },
              { t: '19:00', e: 'Glow Cocktails', d: 'Interactive light bar and terrace lounge.' },
              { t: '20:30', e: 'Radiant Feast', d: 'A culinary experience under the aurora lighting.' },
              { t: '22:30', e: 'Prism Afterparty', d: 'Dancing until the stars fade.' }
            ].map((ev, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 24, padding: 24, background: glass, border: `1px solid ${bdr}`, borderRadius: 24, textAlign: 'left' }}>
                <div style={{ width: 80, height: 80, borderRadius: 20, background: p, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', flexShrink: 0 }}>{ev.t}</div>
                <div>
                  <h4 style={{ fontSize: '1.3rem', fontWeight: 700, color: txt }}>{ev.e}</h4>
                  <p style={{ color: mut }}>{ev.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {[
            { n: 'Pearl Pavilion', t: 'Ceremony Site', a: '88 Lighthouse Cove, Azure Shore', note: 'Outdoor Sky Deck entrance', icon: '🏛️' },
            { n: 'The Glass Atrium', t: 'Reception Hall', a: '88 Lighthouse Cove, Azure Shore', note: 'Main Hall Floor', icon: '💎' },
            { n: 'The Glow Lounge', t: 'Afterparty Space', a: 'Shorefront Promenade 12', note: 'Lounge Level 2', icon: '✨' }
          ].map((loc, i) => (
            <div key={i} style={{ padding: 40, textAlign: 'center', background: glass, border: `1px solid ${bdr}`, borderRadius: 32 }}>
              <div style={{ fontSize: '3rem', marginBottom: 20 }}>{loc.icon}</div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: p, textTransform: 'uppercase', marginBottom: 8 }}>{loc.t}</p>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 700, color: txt, marginBottom: 12 }}>{loc.n}</h4>
              <p style={{ fontSize: '0.9rem', color: mut, marginBottom: 24 }}><MapPin size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {loc.a}</p>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '12px 28px', border: `2px solid ${p}`, color: p, fontWeight: 700, textDecoration: 'none', borderRadius: 16 }}>Open Maps</a>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" style={{ padding: '100px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.5rem', fontWeight: 700, color: txt }}>Memory Refractions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 40, maxWidth: 1200, margin: '40px auto 0' }}>
          {['/images/couple_4.jpg', '/images/couple_3.jpg', '/images/couple_1.jpg', '/images/couple_2.jpg', '/images/temp5.jpg', '/images/hero3.jpg', '/images/temp3.webp', '/images/hero2.jpg'].map((img, i) => (
            <div key={i} style={{ borderRadius: 24, overflow: 'hidden', aspectRatio: '1', border: `4px solid ${bdr}` }}>
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </section>

      {/* BRIDAL PARTY */}
      <section id="party" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.5rem', fontWeight: 700, color: txt }}>The Crystal Crew</h2>
        <ADiv dark={dark} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', marginTop: 40 }}>
          {['Elena', 'Maya', 'Lucas', 'Julian'].map((n, i) => (
            <div key={i} style={{ width: 150 }}>
              <div style={{ width: 120, height: 120, borderRadius: '35%', overflow: 'hidden', margin: '0 auto 16px', border: `3px solid ${p}`, background: glass }}>
                <img src="/images/head1.jpg" alt={n} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h4 style={{ fontWeight: 700, fontSize: '1.2rem' }}>{n}</h4>
              <p style={{ fontSize: '0.75rem', color: mut, fontWeight: 600, textTransform: 'uppercase' }}>{i < 2 ? 'Luminous Muse' : 'Radiant Sentinel'}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VIDEO */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', background: glass, border: `1px solid ${bdr}`, borderRadius: 32, padding: 12, overflow: 'hidden' }}>
          <div style={{ width: '100%', paddingTop: '56.25%', position: 'relative', borderRadius: 24, overflow: 'hidden' }}>
            <iframe style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Sophia & Oliver" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        </div>
      </section>

      {/* WISHES & FAQ */}
      <Wishes dark={dark} />
      <FAQ dark={dark} />

      {/* TELEGRAM */}
      <section style={{ padding: '60px 24px', textAlign: 'center' }}>
        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2rem', marginBottom: 20 }}>Signals & Support</h3>
        <a href="https://t.me/yeserge_leta1" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '16px 40px', background: p, color: 'white', borderRadius: 20, fontWeight: 700, textDecoration: 'none', boxShadow: `0 8px 30px ${p}40` }}>
          <Send size={18} /> Join Telegram Frequency
        </a>
      </section>

      {/* RSVP */}
      <section id="rsvp" style={{ padding: '100px 24px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 500, background: glass, backdropFilter: 'blur(30px)', border: `1px solid ${bdr}`, borderRadius: 40, padding: 60, textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '3rem', fontWeight: 700, marginBottom: 12 }}>Join the Glow</h2>
          <p style={{ color: mut, marginBottom: 40 }}>Please RSVP by July 1, 2026</p>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }} onSubmit={e => { e.preventDefault(); const fd = new FormData(e.target); const msg = `🌌 RSVP — Sophia & Oliver\nName: ${fd.get('name')}\nAttendance: ${fd.get('att')}\nGuests: ${fd.get('guests')}\nNote: ${fd.get('note')}`; window.open(`https://t.me/yeserge_leta1?text=${encodeURIComponent(msg)}`, '_blank'); e.target.reset(); }}>
            <input name="name" placeholder="Full Name" required style={{ padding: '16px 20px', borderRadius: 20, border: `1px solid ${bdr}`, background: 'rgba(255,255,255,0.2)', color: txt, outline: 'none' }} />
            <select name="att" required style={{ padding: '16px 20px', borderRadius: 20, border: `1px solid ${bdr}`, background: 'rgba(255,255,255,0.2)', color: txt, outline: 'none' }}>
              <option value="">Will you attend?</option>
              <option>Confirming Attendance ✨</option>
              <option>Gracefully Declining</option>
            </select>
            <input name="guests" type="number" placeholder="Guest Count" style={{ padding: '16px 20px', borderRadius: 20, border: `1px solid ${bdr}`, background: 'rgba(255,255,255,0.2)', color: txt, outline: 'none' }} />
            <button type="submit" style={{ marginTop: 20, padding: 20, background: `linear-gradient(135deg, ${p}, ${a})`, color: 'white', border: 'none', borderRadius: 20, fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>Publish RSVP</button>
          </form>
        </div>
      </section>

      {/* QR CODE */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '48px', background: glass, backdropFilter: 'blur(12px)', border: `1px solid ${bdr}`, borderRadius: 40 }}>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent('https://yesergeleta.com/entry?event=sophia-oliver-2026')}&bgcolor=FFFFFF&color=0EA5E9`} alt="QR Pass" style={{ width: 180, height: 180, borderRadius: 20 }} />
          <p style={{ marginTop: 24, fontSize: '1.2rem', fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>Luminous Entry</p>
          <p style={{ color: mut, fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Aug 15 · Pearl Pavilion</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '80px 24px', textAlign: 'center' }}>
        <Sparkles size={32} color={p} style={{ marginBottom: 16 }} />
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: 700 }}>Sophia & Oliver</h2>
        <p style={{ color: mut, fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3em', marginTop: 12 }}>Reflecting Love Forever · 2026</p>
      </footer>

      <MusicPlayer dark={dark} />
    </div>
  );
}
