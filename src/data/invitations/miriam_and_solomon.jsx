import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sun, Moon, MapPin, Play, Pause, Volume2, VolumeX, Send, ChevronDown, ChevronUp } from 'lucide-react';

const P = {
  bg: '#FFFBEF', bgD: '#0E0A00',
  card: '#FFFFFF', cardD: '#1C1500',
  pri: '#B8940A', priD: '#FFD700',
  amber: '#FF9500',
  deepGold: '#8A6C00', deepGoldD: '#E8B800',
  txt: '#1A1200', txtD: '#F5E8B0',
  mut: '#6A5010', mutD: '#A08820',
  bdr: '#E8D890', bdrD: '#3A2C00',
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
      <audio ref={ref} loop muted={mute} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" />
      <div style={{ position: 'fixed', bottom: 24, right: 80, zIndex: 100, display: 'flex', gap: 8 }}>
        <button onClick={toggle} style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${P.amber}, ${p})`, color: '#1A1200', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 20px ${P.amber}50` }}>
          {play ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button onClick={() => setM(!mute)} style={{ width: 44, height: 44, borderRadius: '50%', background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: p, border: `1px solid ${p}40`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {mute ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </>
  );
}


function GDiv({ dark }) {
  const p = dark ? P.priD : P.pri;
  const a = P.amber;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', margin: '20px 0' }}>
      <div style={{ height: 1, flex: 1, maxWidth: 100, background: `linear-gradient(to right, transparent, ${p})` }} />
      <div style={{ width: 8, height: 8, background: a, transform: 'rotate(45deg)' }} />
      <Heart size={14} fill={p} color={p} />
      <div style={{ width: 8, height: 8, background: a, transform: 'rotate(45deg)' }} />
      <div style={{ height: 1, flex: 1, maxWidth: 100, background: `linear-gradient(to left, transparent, ${p})` }} />
    </div>
  );
}

function Wishes({ dark }) {
  const [name, setN] = useState('');
  const [msg, setM] = useState('');
  const [list, setL] = useState(() => {
    try { return JSON.parse(localStorage.getItem('miriam_solomon_wishes') || '[]'); } catch { return []; }
  });
  const card = dark ? P.cardD : P.card;
  const bdr = dark ? P.bdrD : P.bdr;
  const p = dark ? P.priD : P.pri;
  const txt = dark ? P.txtD : P.txt;
  const mut = dark ? P.mutD : P.mut;

  const sub = (e) => {
    e.preventDefault();
    if (!name.trim() || !msg.trim()) return;
    const nl = [{ name, msg, date: new Date().toLocaleDateString() }, ...list];
    setL(nl);
    localStorage.setItem('miriam_solomon_wishes', JSON.stringify(nl));
    setN(''); setM('');
    window.open(`https://t.me/yeserge_leta1?text=${encodeURIComponent(`🌻 Golden Wish from ${name}: ${msg}`)}`, '_blank');
  };

  return (
    <section style={{ padding: '80px 24px', background: dark ? '#16100A' : '#FFF8E0' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '0.85rem', color: p, marginBottom: 8, textAlign: 'center' }}>ምኞቶቾን ይግለጹ</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '2.5rem', color: txt, textAlign: 'center' }}>Blessings & Wishes</h2>
        <GDiv dark={dark} />
        <form onSubmit={sub} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
          <input value={name} onChange={e => setN(e.target.value)} placeholder="Full Name / ሙሉ ስም" required style={{ padding: '14px 18px', background: card, border: `1px solid ${bdr}`, borderRadius: 4, color: txt, fontFamily: "'Crimson Text', serif", fontSize: '1.1rem', outline: 'none' }} />
          <textarea value={msg} onChange={e => setM(e.target.value)} placeholder="Your message / መልእክቶን እዚህ ይጻፉ..." rows={4} required style={{ padding: '14px 18px', background: card, border: `1px solid ${bdr}`, borderRadius: 4, color: txt, fontFamily: "'Crimson Text', serif", fontSize: '1.1rem', outline: 'none', resize: 'vertical' }} />
          <button type="submit" style={{ padding: '16px', background: `linear-gradient(135deg, ${P.pri}, ${P.amber})`, color: '#1A1200', border: 'none', borderRadius: 4, fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 20px ${P.amber}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Send size={18} /> Send / ላክ
          </button>
        </form>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {list.map((w, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: card, border: `1px solid ${bdr}`, borderRadius: 8, padding: '20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(to right, ${P.pri}, ${P.amber}, ${P.pri})` }} />
              <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: p, fontSize: '1.3rem', marginBottom: 4 }}>{w.name}</p>
              <p style={{ fontFamily: "'Crimson Text', serif", fontSize: '1.1rem', color: mut, lineHeight: 1.7, fontStyle: 'italic' }}>{w.msg}</p>
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
  const card = dark ? P.cardD : P.card;
  const bdr = dark ? P.bdrD : P.bdr;
  const p = dark ? P.priD : P.pri;
  const txt = dark ? P.txtD : P.txt;
  const mut = dark ? P.mutD : P.mut;
  const items = [
    { q: 'What is the "Golden Meskel" dress code?', a: 'We invite you to wear traditional Ethiopian attire with yellow accents or sunflowers. Formal wear in gold, amber, or cream is also perfect.' },
    { q: 'Is there parking at the Golden Palace?', a: 'Yes, valet and self-parking are available at the main entrance for all wedding guests.' },
    { q: 'Will there be a traditional coffee ceremony?', a: 'Yes, a full coffee ceremony will be the centerpiece of our guest receiving program!' },
    { q: 'Can I request a song for the Eskista dance?', a: 'Absolutely! Our DJ will be taking requests. Bring your best dance moves!' },
    { q: 'Is the venue accessible for elderly guests?', a: 'Yes, the Golden Palace is fully accessible with ramps and elevator services to the ballroom.' },
  ];
  return (
    <section style={{ padding: '80px 24px', background: dark ? '#16100A' : '#FFF8E0' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '0.8rem', color: p, marginBottom: 8, textAlign: 'center' }}>ጥያቄዎች</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '2.5rem', color: txt, textAlign: 'center' }}>Celestial FAQ</h2>
        <GDiv dark={dark} />
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item, i) => (
            <div key={i} style={{ background: card, border: `1px solid ${open === i ? p : bdr}`, borderRadius: 8, overflow: 'hidden', boxShadow: open === i ? `0 4px 20px ${p}20` : 'none', transition: 'all 0.3s' }}>
              <button onClick={() => setO(open === i ? null : i)} style={{ width: '100%', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 12 }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 600, color: txt }}>{item.q}</span>
                {open === i ? <ChevronUp size={18} color={P.amber} /> : <ChevronDown size={18} color={p} />}
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', padding: '0 24px 20px', fontFamily: "'Crimson Text', serif", fontSize: '1.1rem', lineHeight: 1.8, color: mut }}>
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

export default function MiriamAndSolomon() {
  const [dark, setD] = useState(false);
  const [sc, setSc] = useState(false);
  const cd = useCD('2026-12-20T17:00:00');
  useEffect(() => {
    const fn = () => setSc(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const bg = dark ? P.bgD : P.bg;
  const card = dark ? P.cardD : P.card;
  const p = dark ? P.priD : P.pri;
  const txt = dark ? P.txtD : P.txt;
  const mut = dark ? P.mutD : P.mut;
  const bdr = dark ? P.bdrD : P.bdr;

  return (
    <div style={{ background: bg, color: txt, minHeight: '100vh', fontFamily: "'Crimson Text', Georgia, serif", transition: 'all 0.4s', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Noto+Serif+Ethiopic:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: sc ? (dark ? 'rgba(14,10,0,0.97)' : 'rgba(255,251,239,0.97)') : 'transparent', backdropFilter: 'blur(12px)', borderBottom: sc ? `2px solid ${p}` : 'none', transition: 'all 0.4s', padding: '0 40px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '1rem', color: p, lineHeight: 1.2 }}>Miriam & Solomon</p>
          <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '0.7rem', color: mut }}>ሚሪያም & ሰለሞን</p>
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          {['About', 'Story', 'Timeline', 'Locations', 'Gallery', 'Party', 'Wishes', 'RSVP'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: '0.75rem', fontFamily: "'Crimson Text', serif", letterSpacing: '0.1em', color: mut, textDecoration: 'none', textTransform: 'uppercase' }}>{l}</a>
          ))}
        </div>
        <button onClick={() => setD(!dark)} style={{ background: 'none', border: `1px solid ${p}`, borderRadius: 4, width: 38, height: 38, color: p, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img src="/images/temp1.webp" alt="Hero" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: dark ? 'brightness(0.3) sepia(0.5)' : 'brightness(0.4) sepia(0.2)' }} />
        <div style={{ position: 'absolute', inset: 0, background: dark ? 'linear-gradient(to bottom, rgba(30,20,0,0.6), rgba(10,7,0,0.8))' : 'linear-gradient(to bottom, rgba(60,40,0,0.5), rgba(20,14,0,0.7))' }} />
        <div style={{ position: 'absolute', inset: 20, border: `2px solid rgba(255,215,0,0.5)`, pointerEvents: 'none' }} />
        {['top:16px;left:16px', 'top:16px;right:16px', 'bottom:16px;left:16px', 'bottom:16px;right:16px'].map((pos, i) => {
          const props = Object.fromEntries(pos.split(';').map(p => p.split(':')));
          return <div key={i} style={{ position: 'absolute', ...props, width: 30, height: 30, borderTop: i < 2 ? `3px solid ${p}` : 'none', borderBottom: i >= 2 ? `3px solid ${p}` : 'none', borderLeft: [0, 2].includes(i) ? `3px solid ${p}` : 'none', borderRight: [1, 3].includes(i) ? `3px solid ${p}` : 'none', pointerEvents: 'none' }} />
        })}

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }} style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '1.1rem', color: p, marginBottom: 8, textShadow: `0 0 20px rgba(255,215,0,0.4)` }}>🌻 Golden Meskel 🌻</p>
          <p style={{ fontFamily: "'Crimson Text', serif", fontStyle: 'italic', fontSize: '0.9rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>The Wedding of</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 700, color: 'white', textShadow: `0 0 40px rgba(255,200,0,0.4)`, lineHeight: 1.1, marginBottom: 4 }}>Miriam</h1>
          <GDiv dark={dark} />
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 700, color: 'white', textShadow: `0 0 40px rgba(255,200,0,0.4)`, lineHeight: 1.1, marginBottom: 24 }}>& Solomon</h1>
          <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '0.85rem', color: `rgba(255,200,0,0.8)`, marginBottom: 4 }}>ሚሪያም & ሰለሞን</p>
          <p style={{ fontFamily: "'Crimson Text', serif", fontStyle: 'italic', fontSize: '1.15rem', color: 'rgba(255,255,255,0.8)' }}>December 20, 2026 · Golden Habesha Palace</p>
        </motion.div>
      </section>

      {/* COUNTDOWN */}
      <section style={{ padding: '80px 24px', background: dark ? '#16100A' : '#FFF8E0', textAlign: 'center', position: 'relative' }}>
        <p style={{ fontFamily: "'Crimson Text', serif", fontStyle: 'italic', fontSize: '1.1rem', color: p, marginBottom: 4 }}>Until We Celebrate</p>
        <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", color: mut, fontSize: '0.85rem', marginBottom: 32 }}>ድሎታችን ድረስ</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          {[['Days', cd.d], ['Hours', cd.h], ['Minutes', cd.m], ['Seconds', cd.s]].map(([l, v]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ width: 96, height: 96, background: card, border: `2px solid ${p}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', boxShadow: `0 0 20px ${dark ? 'rgba(255,200,0,0.15)' : 'rgba(184,148,10,0.15)'}`, position: 'relative' }}>
                {[['-6px', '-6px'], ['-6px', 'auto'], ['auto', '-6px'], ['auto', 'auto']].map(([top, right], ci) => (
                  <div key={ci} style={{ position: 'absolute', top, right, bottom: top === 'auto' ? '-6px' : 'auto', left: right === 'auto' ? '-6px' : 'auto', width: 10, height: 10, background: P.amber, transform: 'rotate(45deg)' }} />
                ))}
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, color: p }}>{String(v).padStart(2, '0')}</span>
              </div>
              <span style={{ fontFamily: "'Crimson Text', serif", fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: mut }}>{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT US */}
      <section id="about" style={{ padding: '80px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <p style={{ fontFamily: "'Crimson Text', serif", fontStyle: 'italic', fontSize: '1rem', color: p, marginBottom: 8 }}>Their Story / ስለ እኛ</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '2.8rem', fontWeight: 700, color: txt }}>About Us</h2>
          <GDiv dark={dark} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
          {[
            { name: 'Miriam', role: 'The Bride', img: '/images/couple_3.jpg', desc: 'A warm soul whose laughter is like the sunflower fields of Meskel. Miriam brings joy and light to everyone she meets.' },
            { name: 'Solomon', role: 'The Groom', img: '/images/couple_4.jpg', desc: 'A man of integrity and depth, Solomon found his missing piece in Miriam. He is the anchor to her bright spirit.' },
          ].map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} style={{ background: card, border: `2px solid ${bdr}`, borderRadius: 4, overflow: 'hidden', paddingBottom: 20 }}>
              <div style={{ height: 280, overflow: 'hidden', borderBottom: `2px solid ${bdr}` }}>
                <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '24px 20px', textAlign: 'center' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: txt }}>{p.name}</h3>
                <p style={{ fontFamily: "'Crimson Text', serif", fontStyle: 'italic', color: P.amber, fontSize: '0.85rem', marginBottom: 12 }}>{p.role}</p>
                <GDiv dark={dark} />
                <p style={{ color: mut, lineHeight: 1.8, fontSize: '1rem', fontFamily: "'Crimson Text', serif", fontStyle: 'italic' }}>{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* OUR LOVE STORY */}
      <section id="story" style={{ padding: '80px 24px', background: dark ? '#16100A' : '#FFF8E0' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '0.85rem', color: p, marginBottom: 8, textAlign: 'center' }}>ጉዟችን</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '2.8rem', fontWeight: 700, color: txt, textAlign: 'center' }}>Our Love Story</h2>
          <GDiv dark={dark} />
          <div style={{ marginTop: 40, position: 'relative' }}>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: `linear-gradient(transparent, ${p}, transparent)`, transform: 'translateX(-50%)' }} />
            {[
              { year: '2021', title: 'The First Hello', am: 'የመጀመሪያው ሰላምታ', desc: 'A chance encounter at a friend\'s graduation. One cup of macchiato turned into a four-hour conversation about dreams and heritage.', side: 'left' },
              { year: '2023', title: 'Growing Together', am: 'አብሮ ማደግ', desc: 'Through the seasons, their bond strengthened like the roots of the ancient olive trees. They became each other\'s best friend.', side: 'right' },
              { year: '2025', title: 'The Meskel Proposal', am: 'የመስቀል ጥያቄ', desc: 'Under the warm sun of the Meskel festival, Solomon asked Miriam the most important question of their lives. The answer was written in the smiles of everyone around them.', side: 'left' },
              { year: '2026', title: 'The Golden Day', am: 'ወርቃማው ቀን', desc: 'Today marks the beginning of their official union. Two lives, one golden future.', side: 'right' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: item.side === 'left' ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ display: 'flex', justifyContent: item.side === 'left' ? 'flex-end' : 'flex-start', marginBottom: 50, position: 'relative' }}>
                <div style={{ position: 'absolute', left: '50%', top: 20, width: 14, height: 14, background: P.amber, transform: 'rotate(45deg) translateX(-50%)', border: `3px solid ${card}`, zIndex: 1 }} />
                <div style={{ width: '44%', background: card, border: `1px solid ${bdr}`, borderRadius: 4, padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <p style={{ fontFamily: "'Crimson Text', serif", fontWeight: 700, color: P.amber, fontSize: '0.9rem', marginBottom: 4 }}>{item.year}</p>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '1.2rem', fontWeight: 700, color: txt, marginBottom: 2 }}>{item.title}</h4>
                  <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '0.85rem', color: mut, marginBottom: 8 }}>{item.am}</p>
                  <p style={{ fontFamily: "'Crimson Text', serif", color: mut, fontSize: '1rem', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="timeline" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '0.85rem', color: p, marginBottom: 8 }}>የዝግጅቱ ሰሌዳ</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '2.5rem', fontWeight: 700, color: txt }}>Wedding Timeline</h2>
        <GDiv dark={dark} />
        <div style={{ maxWidth: 650, margin: '30px auto 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { time: '5:00 PM', timeAm: 'ከምሽቱ 11:00', icon: '🌻', title: 'Guest Arrival', desc: 'እንግዶች በደስታ መቀበያ ስርዓት' },
            { time: '6:00 PM', timeAm: 'ከምሽቱ 12:00', icon: '☕', title: 'Traditional Coffee', desc: 'የባህል የቡና ስርዓት' },
            { time: '7:00 PM', timeAm: 'ከምሽቱ 1:00', icon: '⛪', title: 'Holy Blessing', desc: 'የምርቃት እና የክብር ስርዓት' },
            { time: '8:30 PM', timeAm: 'ከምሽቱ 2:30', icon: '🍽️', title: 'Golden Banquet', desc: 'የራት እና የድሎት ድግስ' },
            { time: '10:00 PM', timeAm: 'ከምሽቱ 4:00', icon: '🎶', title: 'Eskista & Music', desc: 'የደስታ እና የእስኪስታ ምሽት' },
          ].map((e, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 24px', background: card, border: `1px solid ${bdr}`, borderLeft: `6px solid ${i % 2 === 0 ? p : P.amber}`, borderRadius: 4, textAlign: 'left', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '2rem', minWidth: 50, textAlign: 'center' }}>{e.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Crimson Text', serif", color: p, fontWeight: 600, fontSize: '0.9rem' }}>{e.time} / {e.timeAm}</p>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.2rem', color: txt }}>{e.title}</h4>
                <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", color: mut, fontSize: '0.9rem' }}>{e.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LOCATIONS */}
      <section id="locations" style={{ padding: '80px 24px', background: dark ? '#16100A' : '#FFF8E0', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '0.85rem', color: p, marginBottom: 8 }}>የቦታ መመሪያ</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '2.5rem', fontWeight: 700, color: txt }}>Event Locations</h2>
        <GDiv dark={dark} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginTop: 32 }}>
          {[
            { type: 'Ceremony & Banquet', name: 'Golden Habesha Palace', addr: 'Bole Road, Addis Ababa, Ethiopia', note: 'Opposite the Grand Cathedral', icon: '🏰', maps: 'https://maps.google.com' },
            { type: 'Traditional Welcoming', name: 'The Garden Plaza', addr: 'Bole Area, Addis Ababa', note: 'Entrance via the North Gate', icon: '🌻', maps: 'https://maps.google.com' },
          ].map((loc, i) => (
            <motion.div key={i} whileHover={{ y: -8 }} style={{ background: card, border: `2px solid ${bdr}`, borderRadius: 8, padding: '32px 24px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{loc.icon}</div>
              <p style={{ fontFamily: "'Crimson Text', serif", fontSize: '0.8rem', fontWeight: 700, color: P.amber, textTransform: 'uppercase', marginBottom: 8 }}>{loc.type}</p>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '1.4rem', fontWeight: 700, color: txt, marginBottom: 12 }}>{loc.name}</h4>
              <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '0.95rem', color: mut, marginBottom: 8 }}><MapPin size={14} color={p} /> {loc.addr}</p>
              <p style={{ fontSize: '0.9rem', color: mut, marginBottom: 20, fontStyle: 'italic' }}>{loc.note}</p>
              <a href={loc.maps} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '12px 28px', background: p, color: '#1A1200', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700, borderRadius: 4 }}>View Map / ካርታ</a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '0.85rem', color: p, marginBottom: 8 }}>የፎቶዎች ስብስብ</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '2.8rem', fontWeight: 700, color: txt }}>Gallery</h2>
        <GDiv dark={dark} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, maxWidth: 900, margin: '30px auto 0' }}>
          {['/images/couple_3.jpg', '/images/couple_4.jpg', '/images/couple_1.jpg', '/images/couple_2.jpg', '/images/temp1.webp', '/images/hero3.jpg'].map((img, i) => (
            <motion.div key={i} whileHover={{ scale: 1.04 }} style={{ overflow: 'hidden', aspectRatio: i === 0 || i === 5 ? '3/4' : '1', border: `3px solid ${dark ? 'rgba(255,200,0,0.25)' : 'rgba(184,148,10,0.3)'}` }}>
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* BRIDAL PARTY */}
      <section id="party" style={{ padding: '80px 24px', background: dark ? '#16100A' : '#FFF8E0', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '0.85rem', color: p, marginBottom: 8 }}>ሚዜዎች</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '2.5rem', fontWeight: 700, color: txt }}>Bridal Party</h2>
        <GDiv dark={dark} />
        <div style={{ marginTop: 40 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '1.4rem', fontWeight: 700, color: p, marginBottom: 24 }}>The Bridesmaids / ሚዜዎች</h3>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            {[{ n: 'Sara', r: 'Maid of Honor' }, { n: 'Betty', r: 'Bridesmaid' }, { n: 'Hannah', r: 'Bridesmaid' }, { n: 'Lydia', r: 'Bridesmaid' }].map((p, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} style={{ width: 140 }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px', border: `3px solid ${P.amber}`, padding: 4, background: card }}>
                  <img src="/images/head1.jpg" alt={p.n} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                </div>
                <p style={{ fontWeight: 700, fontSize: '1.1rem', color: txt }}>{p.n}</p>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: P.amber }}>{p.r}</p>
              </motion.div>
            ))}
          </div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '1.4rem', fontWeight: 700, color: P.amber, marginBottom: 24 }}>The Groomsmen / ሚዜዎች</h3>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[{ n: 'Daniel', r: 'Best Man' }, { n: 'Kebede', r: 'Groomsman' }, { n: 'Mulugeta', r: 'Groomsman' }, { n: 'Zerihun', r: 'Groomsman' }].map((p, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} style={{ width: 140 }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px', border: `3px solid ${p}`, padding: 4, background: card }}>
                  <img src="/images/head1.jpg" alt={p.n} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                </div>
                <p style={{ fontWeight: 700, fontSize: '1.1rem', color: txt }}>{p.n}</p>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: p }}>{p.r}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '0.85rem', color: p, marginBottom: 8 }}>የቪዲዮ ምስል</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '2.5rem', fontWeight: 700, color: txt, marginBottom: 32 }}>Golden Moments</h2>
        <div style={{ maxWidth: 850, margin: '0 auto', borderRadius: 12, overflow: 'hidden', border: `4px solid ${bdr}`, boxShadow: '0 8px 30px rgba(0,0,0,0.2)', position: 'relative', background: '#000', paddingTop: '56.25%' }}>
          <iframe style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Miriam & Solomon" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      </section>

      {/* WISHES & FAQ */}
      <Wishes dark={dark} />
      <FAQ dark={dark} />

      {/* TELEGRAM */}
      <section style={{ padding: '60px 24px', background: dark ? '#16100A' : '#FFF8E0', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '0.85rem', color: p, marginBottom: 8 }}>በቴሌግራም ያግኙን</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '2rem', fontWeight: 700, color: txt, marginBottom: 16 }}>Stay Connected</h2>
        <p style={{ color: mut, fontSize: '1rem', maxWidth: 460, margin: '0 auto 24px', lineHeight: 1.6 }}>Do you have any questions about the venue or the program? Message us directly on Telegram! / በቴሌግራም ያግኙን።</p>
        <a href="https://t.me/yeserge_leta1" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '16px 32px', background: '#0088cc', color: 'white', borderRadius: 4, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,136,204,0.3)', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', letterSpacing: '0.1em' }}>
          <Send size={18} /> @yeserge_leta1
        </a>
      </section>

      {/* RSVP */}
      <section id="rsvp" style={{ padding: '100px 24px', position: 'relative', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.85)), url(/images/hero3.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -1 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 500, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '1.1rem', color: p, marginBottom: 12 }}>ግብዣውን ያረጋግጡ</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '3.5rem', fontWeight: 700, color: 'white', marginBottom: 12 }}>RSVP</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 36, fontSize: '1.2rem', fontStyle: 'italic' }}>Join us by confirming by Nov 20, 2026</p>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 14 }} onSubmit={e => { e.preventDefault(); const fd = new FormData(e.target); const msg = `🌻 RSVP — Miriam & Solomon\nName: ${fd.get('name')}\nAttendance: ${fd.get('att')}\nGuests: ${fd.get('guests')}\nFood Note: ${fd.get('food')}`; window.open(`https://t.me/yeserge_leta1?text=${encodeURIComponent(msg)}`, '_blank'); e.target.reset(); }}>
            {[['name', 'Full Name / ሙሉ ስም', 'text'], ['food', 'Special Food Note / የምግብ ፍላጎት', 'text']].map(([id, ph, tp]) => (
              <input key={id} name={id} type={tp} placeholder={ph} required={id === 'name'} style={{ padding: '14px 20px', borderRadius: 4, border: `2px solid ${p}`, background: 'rgba(255,255,255,0.1)', color: 'white', fontFamily: "'Crimson Text', serif", fontSize: '1.1rem', outline: 'none', backdropFilter: 'blur(10px)' }} />
            ))}
            <select name="att" required style={{ padding: '14px 20px', borderRadius: 4, border: `2px solid ${p}`, background: 'rgba(255,255,255,0.1)', color: 'white', fontFamily: "'Crimson Text', serif", fontSize: '1.1rem', outline: 'none' }}>
              <option value="">Will you join? / ይመጣሉ?</option>
              <option>Joyfully Attending / እገኛለሁ</option>
              <option>Regretfully Absent / አልገኝም</option>
            </select>
            <input name="guests" type="number" min="1" max="10" placeholder="Guests / የእንግዶች ብዛት" style={{ padding: '14px 20px', borderRadius: 4, border: `2px solid ${p}`, background: 'rgba(255,255,255,0.1)', color: 'white', fontFamily: "'Crimson Text', serif", fontSize: '1.1rem', outline: 'none' }} />
            <button type="submit" style={{ padding: '18px', background: `linear-gradient(135deg, ${p}, ${P.amber})`, color: '#1A1200', border: 'none', borderRadius: 4, fontWeight: 700, fontSize: '1.2rem', textTransform: 'uppercase', cursor: 'pointer', boxShadow: `0 4px 30px rgba(255,215,0,0.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>Confirm / አረጋግጥ</button>
          </form>
        </div>
      </section>

      {/* QR CODE */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '0.85rem', color: p, marginBottom: 8 }}>የመግቢያ ኮድ</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '2.5rem', fontWeight: 700, color: txt, marginBottom: 12 }}>QR Boarding Pass</h2>
        <GDiv dark={dark} />
        <p style={{ color: mut, maxWidth: 500, margin: '0 auto 32px', fontSize: '1rem', fontStyle: 'italic' }}>Please show this code at the Golden Habesha Palace entrance. / እባክዎን ይህንን ኮድ መግቢያው ላይ ያሳዩ።</p>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: 32, background: card, border: `3px solid ${p}`, borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://yesergeleta.com/entry?event=miriam-solomon-2026')}&bgcolor=${dark ? '1C1500' : 'FFFFFF'}&color=FFD700`} alt="Entry QR" style={{ width: 220, height: 220, borderRadius: 4 }} />
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '1.5rem', color: p }}>Miriam & Solomon</p>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: mut, textTransform: 'uppercase', letterSpacing: '0.1em' }}>GOLDEN MESKEL WEDDING · 2026.12.20</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '60px 24px', textAlign: 'center', borderTop: `2px solid ${p}` }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '2.2rem', fontWeight: 700, color: p }}>Miriam & Solomon</p>
        <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '1.1rem', color: P.amber, marginTop: 4 }}>ሚሪያም & ሰለሞን</p>
        <p style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.25em', color: mut, marginTop: 12 }}>December 20, 2026 · Golden Meskel</p>
      </footer>

      {/* FLOATING CONTROLS */}
      <button onClick={() => setD(!dark)} style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 100, width: 44, height: 44, borderRadius: '50%', background: p, color: '#1A1200', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
        {dark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <MusicPlayer dark={dark} />
    </div>
  );
}
