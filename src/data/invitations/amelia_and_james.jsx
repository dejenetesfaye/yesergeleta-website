import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sun, Moon, MapPin, Play, Pause, Volume2, VolumeX, Send, ChevronDown, ChevronUp, Camera, Bookmark } from 'lucide-react';

const P = {
  bg: '#FFFFFF', bgD: '#0F0F0F',
  card: '#F9F9F9', cardD: '#1A1A1A',
  pri: '#1A332E', priD: '#3E5F58',
  acc: '#D4AF37', accD: '#BFA12C',
  txt: '#111111', txtD: '#F2F2F2',
  mut: '#666666', mutD: '#999999',
  bdr: '#EEEEEE', bdrD: '#333333',
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
      <audio ref={ref} loop muted={mute} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" />
      <div style={{ position: 'fixed', bottom: 24, right: 80, zIndex: 100, display: 'flex', gap: 8 }}>
        <button onClick={toggle} style={{ width: 44, height: 44, borderRadius: 0, background: p, color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {play ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button onClick={() => setM(!mute)} style={{ width: 44, height: 44, borderRadius: 0, background: 'transparent', color: p, border: `1px solid ${p}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {mute ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </>
  );
}


function MDiv({ dark }) {
  const p = dark ? P.priD : P.pri;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', margin: '24px 0' }}>
      <div style={{ flex: 1, maxWidth: 40, height: 1, background: p }} />
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: p }}>M & J Edition</span>
      <div style={{ flex: 1, maxWidth: 40, height: 1, background: p }} />
    </div>
  );
}

function Wishes({ dark }) {
  const [name, setN] = useState('');
  const [msg, setM] = useState('');
  const [list, setL] = useState(() => {
    try { return JSON.parse(localStorage.getItem('amelia_james_wishes') || '[]'); } catch { return []; }
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
    localStorage.setItem('amelia_james_wishes', JSON.stringify(nl));
    setN(''); setM('');
    window.open(`https://t.me/yeserge_leta1?text=${encodeURIComponent(`📖 Guest Note from ${name}: ${msg}`)}`, '_blank');
  };

  return (
    <section style={{ padding: '100px 24px', background: dark ? '#0A0A0A' : '#FAFAFA' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: p, marginBottom: 8, textAlign: 'center' }}>Correspondence</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', fontWeight: 400, color: txt, textAlign: 'center', marginBottom: 40 }}>The Guest Book</h2>
        <form onSubmit={sub} style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 60 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Your Signature</label>
              <input value={name} onChange={e => setN(e.target.value)} placeholder="Name" required style={{ border: 'none', borderBottom: `1px solid ${bdr}`, padding: '12px 0', background: 'transparent', color: txt, outline: 'none', fontSize: '1rem', fontFamily: "'Playfair Display', serif" }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Your Message</label>
            <textarea value={msg} onChange={e => setM(e.target.value)} placeholder="Write your blessing..." rows={3} required style={{ border: 'none', borderBottom: `1px solid ${bdr}`, padding: '12px 0', background: 'transparent', color: txt, outline: 'none', fontSize: '1.1rem', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', resize: 'none' }} />
          </div>
          <button type="submit" style={{ alignSelf: 'center', padding: '16px 40px', background: p, color: 'white', border: 'none', borderRadius: 0, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}>Publish Entry</button>
        </form>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 32 }}>
          {list.map((w, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} style={{ padding: '24px 0', borderTop: `1px solid ${bdr}` }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontStyle: 'italic', color: txt, lineHeight: 1.4, marginBottom: 12 }}>"{w.msg}"</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: p }}>— {w.name}</p>
                <p style={{ fontSize: '0.65rem', color: mut }}>{w.date}</p>
              </div>
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
    { q: 'Is there a specific dress code for the gallery?', a: 'We request "Editorial Chic" — think high-fashion black tie. Bold colors, structural silhouettes, and sophisticated elegance.' },
    { q: 'Can I bring a camera to the event?', a: 'We have commissioned a team of world-class photographers. We invite you to be present with us, unplugged, durante la cerimonia.' },
    { q: 'Will there be a seated dinner?', a: 'Yes, a multi-course gourmet experience will be served in the Grand Atrium at 8:00 PM.' },
    { q: 'Is the venue accessible?', a: 'The Museum of Contemporary Art is fully accessible. Private elevators are available for all guests.' },
    { q: 'Where should I stay in the city?', a: 'We recommend the Grand Editorial Hotel, where we have reserved a block of suites for our guests.' },
  ];
  return (
    <section style={{ padding: '100px 24px', background: dark ? P.bgD : P.bg }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: p, marginBottom: 8, textAlign: 'center' }}>Inquiries</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', fontWeight: 400, color: txt, textAlign: 'center', marginBottom: 40 }}>Common FAQ</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {items.map((item, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${bdr}`, overflow: 'hidden' }}>
              <button onClick={() => setO(open === i ? null : i)} style={{ width: '100%', padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 400, color: txt }}>{item.q}</span>
                {open === i ? <ChevronUp size={18} color={p} /> : <ChevronDown size={18} color={mut} />}
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', paddingBottom: '24px', fontFamily: "'Inter', sans-serif", fontSize: '1rem', lineHeight: 1.8, color: mut }}>
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

export default function AmeliaAndJames() {
  const [dark, setD] = useState(false);
  const [sc, setSc] = useState(false);
  const cd = useCD('2026-09-12T16:00:00');
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
    <div style={{ background: bg, color: txt, minHeight: '100vh', fontFamily: "'Inter', sans-serif", transition: 'all 0.4s', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: sc ? (dark ? 'rgba(15,15,15,0.98)' : 'rgba(255,255,255,0.98)') : 'transparent', borderBottom: sc ? `1px solid ${bdr}` : 'none', transition: 'all 0.4s', padding: '0 40px', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.1em' }}>AM&JA</span>
        <div style={{ display: 'flex', gap: 32 }}>
          {['Profile', 'Story', 'Events', 'Gallery', 'Party', 'Journal', 'RSVP'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: mut, textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
        <button onClick={() => setD(!dark)} style={{ background: 'none', border: 'none', color: txt, cursor: 'pointer' }}>
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', height: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
        <div style={{ background: '#EAEAEA', overflow: 'hidden', position: 'relative' }}>
          <img src="/images/temp1.webp" alt="Amelia" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', bottom: 40, left: 40, color: 'white' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>The Bride</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '4rem', fontWeight: 400 }}>Amelia</h2>
          </div>
        </div>
        <div style={{ background: '#D9D9D9', overflow: 'hidden', position: 'relative' }}>
          <img src="/images/temp6.jpg" alt="James" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', top: 40, right: 40, color: 'white', textAlign: 'right' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>The Groom</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '4rem', fontWeight: 400 }}>James</h2>
          </div>
        </div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 10 }}>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5 }} style={{ background: bg, padding: '40px 60px', textAlign: 'center', border: `1px solid ${bdr}`, boxShadow: '0 20px 80px rgba(0,0,0,0.1)' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.5em', textTransform: 'uppercase', color: p, marginBottom: 20 }}>International Issue · Sept 2026</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '5rem', fontWeight: 700, lineHeight: 0.9, marginBottom: 20 }}>The <br /> Nuptials</h1>
            <div style={{ height: 2, width: 60, background: p, margin: '0 auto 20px' }} />
            <p style={{ fontSize: '1.2rem', fontWeight: 400, letterSpacing: '0.1em', color: txt }}>Amelia Vance & James Sterling</p>
          </motion.div>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section style={{ padding: '60px 40px', borderBottom: `1px solid ${bdr}`, textAlign: 'center' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: mut, marginBottom: 30 }}>Countdown to Launch</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 60 }}>
          {[['Days', cd.d], ['Hrs', cd.h], ['Min', cd.m], ['Sec', cd.s]].map(([l, v]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '4rem', fontWeight: 400, display: 'block', color: txt }}>{String(v).padStart(2, '0')}</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: p }}>{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT US */}
      <section id="profile" style={{ padding: '100px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: p, marginBottom: 12 }}>Feature Story</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3.5rem', fontWeight: 400, color: txt, marginBottom: 32, lineHeight: 1.1 }}>The Architects of <br /> A Modern Romance</h2>
            <div style={{ columns: 2, columnGap: 40, fontSize: '1rem', lineHeight: 1.8, color: mut }}>
              <p style={{ marginBottom: 20 }}><span style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', float: 'left', lineHeight: 0.8, marginRight: 8, marginTop: 4, color: p }}>A</span>melia Vance, a curator of fine arts, has spent a decade defining aesthetic excellence. Her eye for detail and uncompromising vision transformed the way we see the world. Then she met James.</p>
              <p>James Sterling, a pioneer in sustainable architecture, builds structures that stand the test of time. Their meeting wasn't just a coincidence; it was a collision of form and function. This September, they merge their lives in a ceremony that promises to be as timeless as their love.</p>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ aspectHeight: '1.2/1', background: '#EEE', overflow: 'hidden' }}>
              <img src="/images/couple_1.jpg" alt="Couple" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ position: 'absolute', bottom: -30, right: -30, background: p, padding: '30px', color: 'white', maxWidth: 240 }}>
              <p style={{ fontSize: '1rem', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', marginBottom: 12 }}>"We wanted a day that felt like a quiet conversation in a loud room."</p>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>— Amelia Vance</p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR LOVE STORY */}
      <section id="story" style={{ padding: '100px 40px', background: dark ? '#111' : '#F5F5F5' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: mut, marginBottom: 12 }}>Timeline</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', fontWeight: 400, color: txt, marginBottom: 60 }}>The Archival Record</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 80 }}>
            {[
              { year: '2021', title: 'The Vernissage', desc: 'They met at the opening of the Vance Gallery. One exchanged glance across a minimalist sculpture, and the conversation hasn\'t stopped since.' },
              { year: '2023', title: 'The Paris Commission', desc: 'While on a research trip in the Marais, they realized their creative partnership was becoming something far more permanent.' },
              { year: '2025', title: 'The Solstice', desc: 'James proposed in the gardens of the Sterling Estate during the longest day of the year. A commitment under the sun.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '4rem', fontWeight: 400, color: p, opacity: 0.3, marginBottom: -24 }}>{item.year}</p>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 400, color: txt, marginBottom: 16 }}>{item.title}</h4>
                <p style={{ maxWidth: 500, margin: '0 auto', fontSize: '1.1rem', color: mut, lineHeight: 1.8 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="events" style={{ padding: '100px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 0.4fr) 1fr', gap: 60 }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3.5rem', fontWeight: 400, color: txt, marginBottom: 20 }}>The Order of Events</h2>
            <div style={{ height: 4, width: 80, background: p }} />
          </div>
          <div style={{ display: 'grid', gap: 40 }}>
            {[
              { t: '16:00', e: 'Photographic Reception', d: 'Arrival of guests and cocktail hour in the Sculpture Garden.' },
              { t: '17:30', e: 'The Union', d: 'Vows at the Museum Chapel. Minimalist ceremony with string accompaniment.' },
              { t: '19:00', e: 'Grand Aperitivo', d: 'Celebratory drinks and contemporary bites.' },
              { t: '20:30', e: 'Dinner au Musée', d: 'A multi-course culinary event in the Grand Hall.' },
              { t: '22:30', e: 'Midnight Salon', d: 'Evening music and conversation under the moonlit dome.' },
            ].map((ev, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 30, paddingBottom: 30, borderBottom: `1px solid ${bdr}` }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: p }}>{ev.t}</span>
                <div>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: txt, marginBottom: 8 }}>{ev.e}</h4>
                  <p style={{ color: mut, fontSize: '1rem' }}>{ev.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section id="galaxies" style={{ padding: '100px 40px', background: dark ? '#111' : '#FAFAFA' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: p, marginBottom: 40, textAlign: 'center' }}>The Atlas</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
            {[
              { n: 'MCA Grand Chapel', t: 'The Ceremony', a: '14 Contemporary Way, Art District', maps: 'https://maps.google.com' },
              { n: 'The Atrium', t: 'The Reception', a: 'MCA Main Floor, Art District', maps: 'https://maps.google.com' },
              { n: 'MCA Mirror Room', t: 'The Afterparty', a: 'MCA Lower Level, Art District', maps: 'https://maps.google.com' },
            ].map((loc, i) => (
              <div key={i} style={{ padding: '40px', border: `1px solid ${bdr}`, background: bg }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: mut, marginBottom: 12 }}>{loc.t}</p>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: txt, marginBottom: 16 }}>{loc.n}</h4>
                <p style={{ fontSize: '0.95rem', color: mut, marginBottom: 24 }}>{loc.a}</p>
                <a href={loc.maps} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '14px', textAlign: 'center', border: `1px solid ${txt}`, color: txt, textDecoration: 'none', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>View on Map</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" style={{ padding: '100px 40px' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: mut, marginBottom: 32, textAlign: 'center' }}>Captured Moments</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, maxWidth: 1400, margin: '0 auto' }}>
          {['/images/couple_1.jpg', '/images/couple_2.jpg', '/images/couple_3.jpg', '/images/couple_4.jpg', '/images/temp5.jpg', '/images/hero3.jpg', '/images/temp3.webp', '/images/hero2.jpg'].map((img, i) => (
            <div key={i} style={{ aspectRatio: '4/5', overflow: 'hidden', gridColumn: i === 0 || i === 7 ? 'span 2' : 'span 1' }}>
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </section>

      {/* BRIDAL PARTY */}
      <section id="party" style={{ padding: '100px 40px', background: dark ? '#111' : '#F9F9F9' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: p, marginBottom: 16 }}>The Ensemble</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', fontWeight: 400, color: txt, marginBottom: 60 }}>The Wedding Party</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40 }}>
            {['Victoria', 'Juliet', 'Oliver', 'Theodore'].map((n, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ aspectRatio: '1', background: '#DDD', marginBottom: 20 }}>
                  <img src="/images/head1.jpg" alt={n} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem' }}>{n}</h4>
                <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: mut, marginTop: 4 }}>{i < 2 ? 'Honorary Muse' : 'Principal Guardian'}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section style={{ padding: '100px 40px', maxWidth: 1400, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: p, marginBottom: 32 }}>Moving Images</p>
        <div style={{ position: 'relative', width: '100%', paddingTop: '50%', background: '#000', overflow: 'hidden' }}>
          <iframe style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Amelia & James" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      </section>

      {/* WISHES & FAQ */}
      <Wishes dark={dark} />
      <FAQ dark={dark} />

      {/* TELEGRAM */}
      <section style={{ padding: '60px 40px', textAlign: 'center', borderTop: `1px solid ${bdr}` }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: mut, marginBottom: 20 }}>Press Inquiries</p>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: 24 }}>Reach Mission Control</h3>
        <a href="https://t.me/yeserge_leta1" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '16px 40px', border: `2px solid ${p}`, color: p, fontWeight: 700, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.8rem' }}>
          <Send size={18} /> @yeserge_leta1
        </a>
      </section>

      {/* RSVP */}
      <section id="rsvp" style={{ padding: '120px 40px', background: p, color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '4rem', fontWeight: 400, marginBottom: 20 }}>Confirm Your <br /> Presence</h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: 40, fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>RSVP by August 15, 2026</p>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 24 }} onSubmit={e => { e.preventDefault(); const fd = new FormData(e.target); const msg = `📖 RSVP — Amelia & James\nName: ${fd.get('name')}\nAttendance: ${fd.get('att')}\nGuests: ${fd.get('guests')}\nNote: ${fd.get('note')}`; window.open(`https://t.me/yeserge_leta1?text=${encodeURIComponent(msg)}`, '_blank'); e.target.reset(); }}>
            <input name="name" placeholder="Full Name" required style={{ border: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', padding: '16px 0', background: 'transparent', color: 'white', outline: 'none', fontSize: '1.2rem', textAlign: 'center' }} />
            <select name="att" required style={{ border: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', padding: '16px 0', background: 'transparent', color: 'white', outline: 'none', fontSize: '1.2rem', textAlign: 'center' }}>
              <option value="" style={{ color: 'black' }}>Status</option>
              <option style={{ color: 'black' }}>Confirming Attendance</option>
              <option style={{ color: 'black' }}>Regretfully Declining</option>
            </select>
            <input name="guests" type="number" placeholder="Guest Count" style={{ border: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', padding: '16px 0', background: 'transparent', color: 'white', outline: 'none', fontSize: '1.2rem', textAlign: 'center' }} />
            <button type="submit" style={{ marginTop: 20, padding: '20px', background: 'white', color: p, border: 'none', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.3em', cursor: 'pointer' }}>Confirm Spot</button>
          </form>
        </div>
      </section>

      {/* QR CODE */}
      <section style={{ padding: '100px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: p, marginBottom: 40 }}>Authorization</p>
        <div style={{ display: 'inline-block', padding: '60px', border: `1px solid ${bdr}`, textAlign: 'center' }}>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent('https://yesergeleta.com/entry?event=amelia-james-2026')}&bgcolor=FFFFFF&color=111111`} alt="Entry QR" style={{ width: 180, height: 180, marginBottom: 30 }} />
          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: 8 }}>Entry Pass</h4>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: mut }}>Issue No. 001 · Gallery Access</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '80px 40px', textAlign: 'center', borderTop: `1px solid ${bdr}` }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700, marginBottom: 12 }}>AM&JA</h2>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.5em', textTransform: 'uppercase', color: mut }}>The Editorial of a Lifetime · 2026</p>
      </footer>

      {/* FLOATING CONTROLS */}
      <button onClick={() => setD(!dark)} style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 100, width: 44, height: 44, background: txt, color: bg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {dark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <MusicPlayer dark={dark} />
    </div>
  );
}
