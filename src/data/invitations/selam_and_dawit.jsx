import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sun, Moon, MapPin, Play, Pause, Volume2, VolumeX, Send, ChevronDown, ChevronUp, Music } from 'lucide-react';

const P = {
  bg: '#FDF5EE', bgD: '#1A0808',
  card: '#FFFFFF', cardD: '#280E0E',
  pri: '#B8780A', priD: '#D4A040',
  crim: '#C41818', crimD: '#E84848',
  emerald: '#1A5C3A', emeraldD: '#2E8B57',
  txt: '#2A1505', txtD: '#F5E6D0',
  mut: '#7A5040', mutD: '#9A7060',
  bdr: '#E8D5C0', bdrD: '#4A2020',
  gold: '#D4A040',
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
      <audio ref={ref} loop muted={mute} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" />
      <div style={{ position: 'fixed', bottom: 24, right: 80, zIndex: 100, display: 'flex', gap: 8 }}>
        <button onClick={toggle} style={{ width: 44, height: 44, borderRadius: 4, background: `linear-gradient(135deg, ${P.crim}, ${p})`, color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 20px ${P.crim}40` }}>
          {play ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button onClick={() => setM(!mute)} style={{ width: 44, height: 44, borderRadius: 4, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: p, border: `1px solid ${p}40`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {mute ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </>
  );
}


function HDiv({ dark }) {
  const g = P.gold;
  const c = dark ? P.crimD : P.crim;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', margin: '20px 0' }}>
      <div style={{ flex: 1, maxWidth: 80, height: 2, background: `linear-gradient(to right, transparent, ${g})` }} />
      <div style={{ width: 10, height: 10, background: c, transform: 'rotate(45deg)' }} />
      <Heart size={14} fill={g} color={g} />
      <div style={{ width: 10, height: 10, background: c, transform: 'rotate(45deg)' }} />
      <div style={{ flex: 1, maxWidth: 80, height: 2, background: `linear-gradient(to left, transparent, ${g})` }} />
    </div>
  );
}

function Wishes({ dark }) {
  const [name, setN] = useState('');
  const [msg, setM] = useState('');
  const [list, setL] = useState(() => {
    try { return JSON.parse(localStorage.getItem('selam_dawit_wishes') || '[]'); } catch { return []; }
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
    localStorage.setItem('selam_dawit_wishes', JSON.stringify(nl));
    setN(''); setM('');
    window.open(`https://t.me/yeserge_leta1?text=${encodeURIComponent(`🇪🇹 Wish from ${name}: ${msg}`)}`, '_blank');
  };

  return (
    <section style={{ padding: '80px 24px', background: dark ? '#220A0A' : '#FAF0E6' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '0.85rem', color: p, marginBottom: 8, textAlign: 'center' }}>መልክት ይተውልን</p>
        <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '2.2rem', color: txt, textAlign: 'center' }}>Blessings & Wishes</h2>
        <HDiv dark={dark} />
        <form onSubmit={sub} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
          <input value={name} onChange={e => setN(e.target.value)} placeholder="Full Name / ሙሉ ስም" required style={{ padding: '14px 18px', background: card, border: `2px solid ${bdr}`, borderRadius: 4, color: txt, fontFamily: "'Lora', serif", fontSize: '1rem', outline: 'none' }} />
          <textarea value={msg} onChange={e => setM(e.target.value)} placeholder="Your blessing / ምኞቶቾን እዚህ ይጻፉ..." rows={4} required style={{ padding: '14px 18px', background: card, border: `2px solid ${bdr}`, borderRadius: 4, color: txt, fontFamily: "'Lora', serif", fontSize: '1rem', outline: 'none', resize: 'vertical' }} />
          <button type="submit" style={{ padding: '16px', background: `linear-gradient(135deg, ${P.crim}, #8B0000)`, color: 'white', border: 'none', borderRadius: 4, fontFamily: "'Libre Baskerville', serif", fontSize: '1rem', fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 20px rgba(196,24,24,0.35)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Send size={18} /> Send Blessing / ላክ
          </button>
        </form>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {list.map((w, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: card, border: `2px solid ${bdr}`, borderRadius: 8, padding: '20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(to right, ${P.crim}, ${P.gold}, ${P.emerald})` }} />
              <p style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 700, color: p, fontSize: '1.2rem', marginBottom: 4 }}>{w.name}</p>
              <p style={{ fontFamily: "'Lora', serif", fontSize: '1rem', color: mut, lineHeight: 1.7, fontStyle: 'italic' }}>{w.msg}</p>
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
    { q: 'Is there a specific dress code? / የአለባበስ ሁኔታ?', a: 'Traditional Habesha attire is highly encouraged! Otherwise, semi-formal or formal wear is requested. / የሃበሻ ልብስ እንዲለበስ እናበረታታለን። አለበለዚያ መደበኛ ልብስ።' },
    { q: 'Are children allowed? / ልጆች ተፈቅደዋል?', a: 'Yes, children are more than welcome to join our celebration! / አዎ፣ ልጆች በደስታ ይፈቀዳሉ።' },
    { q: 'Is there parking at the Royal Hall? / የመኪና ማቆሚያ አለ?', a: 'Yes, secure parking is available within the venue grounds for all guests. / አዎ፣ ግቢው ውስጥ በቂ የመኪና ማቆሚያ አለ።' },
    { q: 'What time should I arrive? / መቼ መድረስ አለብኝ?', a: 'Please arrive by 2:30 PM for the guest receiving program. / እባክዎን እንግዶች ከምሽቱ 8:30 ጀምሮ ይገኙ።' },
    { q: 'How can I send a wedding gift? / የሰርግ ስጦታ እንዴት መላክ እችላለሁ?', a: 'Your presence is our greatest gift. If you wish to give something more, we will have a gift station at the reception. / መገኘትዎ ትልቁ ስጦታችን ነው። ተጨማሪ ስጦታ ለሚፈልጉ የዝግጅቱ ቦታ ላይ እናዘጋጃለን።' },
  ];
  return (
    <section style={{ padding: '80px 24px', background: dark ? '#220A0A' : '#FAF0E6' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '0.8rem', color: p, marginBottom: 8, textAlign: 'center' }}>ተደጋጋሚ ጥያቄዎች</p>
        <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '2.5rem', color: txt, textAlign: 'center' }}>FAQ</h2>
        <HDiv dark={dark} />
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item, i) => (
            <div key={i} style={{ background: card, border: `2px solid ${open === i ? p : bdr}`, borderRadius: 8, overflow: 'hidden', boxShadow: open === i ? `0 4px 20px ${p}20` : 'none', transition: 'all 0.3s' }}>
              <button onClick={() => setO(open === i ? null : i)} style={{ width: '100%', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 12 }}>
                <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.05rem', fontWeight: 700, color: txt }}>{item.q}</span>
                {open === i ? <ChevronUp size={18} color={P.crim} /> : <ChevronDown size={18} color={p} />}
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', padding: '0 24px 20px', fontFamily: "'Lora', serif", fontSize: '1rem', lineHeight: 1.8, color: mut }}>
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

export default function SelamAndDawit() {
  const [dark, setD] = useState(false);
  const [sc, setSc] = useState(false);
  const cd = useCD('2026-10-05T15:00:00');
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
    <div style={{ background: bg, color: txt, minHeight: '100vh', fontFamily: "'Libre Baskerville', Georgia, serif", transition: 'all 0.4s', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,600;1,400;1,600&family=Noto+Serif+Ethiopic:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: sc ? (dark ? 'rgba(26,8,8,0.96)' : 'rgba(253,245,238,0.96)') : 'transparent', backdropFilter: sc ? 'blur(10px)' : 'none', borderBottom: sc ? `2px solid ${P.gold}` : 'none', transition: 'all 0.4s', padding: '0 40px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, border: `2px solid ${P.gold}`, transform: 'rotate(45deg)' }} />
            <div style={{ position: 'absolute', inset: 6, background: P.crim, transform: 'rotate(45deg)' }} />
          </div>
          <span style={{ fontFamily: "'Lora', serif", fontSize: '1.2rem', color: p, fontStyle: 'italic' }}>ሰላም & ዳዊት</span>
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          {['About', 'Story', 'Timeline', 'Locations', 'Gallery', 'Party', 'Wishes', 'RSVP'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: '0.75rem', fontFamily: "'Lora', serif", letterSpacing: '0.1em', color: mut, textDecoration: 'none', textTransform: 'uppercase' }}>{l}</a>
          ))}
        </div>
        <button onClick={() => setD(!dark)} style={{ background: 'none', border: `2px solid ${P.gold}`, borderRadius: 4, padding: '6px 10px', color: P.gold, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
          {dark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img src="/images/temp3.webp" alt="Hero" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(80,20,0,0.5) 0%, rgba(20,5,0,0.7) 100%)' }} />
        <div style={{ position: 'absolute', inset: 16, border: `3px solid ${P.gold}`, opacity: 0.5, pointerEvents: 'none' }} />
        {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h]) => (
          <div key={`${v}-${h}`} style={{ position: 'absolute', [v]: 12, [h]: 12, width: 40, height: 40, borderTop: v === 'top' ? `3px solid ${P.gold}` : 'none', borderBottom: v === 'bottom' ? `3px solid ${P.gold}` : 'none', borderLeft: h === 'left' ? `3px solid ${P.gold}` : 'none', borderRight: h === 'right' ? `3px solid ${P.gold}` : 'none', pointerEvents: 'none' }} />
        ))}

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: 'white' }}>
          <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '0.9rem', color: `rgba(212,160,64,0.9)`, letterSpacing: '0.1em', marginBottom: 12 }}>እንኳን ደህና መጡ</p>
          <p style={{ fontFamily: "'Lora', serif", fontSize: '0.85rem', fontStyle: 'italic', letterSpacing: '0.3em', textTransform: 'uppercase', color: `rgba(255,255,255,0.7)`, marginBottom: 16 }}>The Royal Wedding of</p>
          <h1 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 700, color: 'white', textShadow: `0 2px 20px rgba(212,160,64,0.4)`, marginBottom: 4 }}>Selam</h1>
          <HDiv dark={dark} />
          <h1 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 700, color: 'white', textShadow: `0 2px 20px rgba(212,160,64,0.4)`, marginBottom: 24 }}>& Dawit</h1>
          <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: '1.1rem', color: `rgba(255,255,255,0.8)`, letterSpacing: '0.06em' }}>October 5, 2026 · Habesha Royal Hall</p>
        </motion.div>
      </section>

      {/* COUNTDOWN */}
      <section style={{ padding: '80px 24px', textAlign: 'center', background: dark ? '#220A0A' : '#FAF0E6', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(to right, ${P.crim}, ${P.gold}, ${P.emerald}, ${P.gold}, ${P.crim})` }} />
        <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: P.gold, fontSize: '1rem', marginBottom: 6 }}>Counting down to our celebration</p>
        <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", color: mut, fontSize: '0.9rem', marginBottom: 30 }}>ድሎታችን ድረስ</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
          {[['Days', cd.d], ['Hours', cd.h], ['Minutes', cd.m], ['Seconds', cd.s]].map(([l, v]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ width: 90, height: 90, border: `2px solid ${P.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', background: card, position: 'relative' }}>
                <div style={{ position: 'absolute', top: -4, left: -4, width: 8, height: 8, background: P.crim, transform: 'rotate(45deg)' }} />
                <div style={{ position: 'absolute', top: -4, right: -4, width: 8, height: 8, background: P.crim, transform: 'rotate(45deg)' }} />
                <div style={{ position: 'absolute', bottom: -4, left: -4, width: 8, height: 8, background: P.crim, transform: 'rotate(45deg)' }} />
                <div style={{ position: 'absolute', bottom: -4, right: -4, width: 8, height: 8, background: P.crim, transform: 'rotate(45deg)' }} />
                <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '2rem', fontWeight: 700, color: p }}>{String(v).padStart(2, '0')}</span>
              </div>
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: mut, fontFamily: "'Lora', serif" }}>{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT US */}
      <section id="about" style={{ padding: '80px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: P.gold, fontSize: '0.9rem', marginBottom: 8 }}>Meet the Couple / ስለ እኛ</p>
          <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '2.5rem', fontWeight: 700, color: txt }}>About Us</h2>
          <HDiv dark={dark} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
          {[
            { name: 'Selam', role: 'The Bride', img: '/images/couple_1.jpg', desc: 'A dancer and teacher who carries the grace of her ancestors in every step she takes. Selam believes in the power of tradition and love.' },
            { name: 'Dawit', role: 'The Groom', img: '/images/couple_2.jpg', desc: 'An engineer building bridges — between his culture, his family, and his future with Selam. Dawit is a man of vision and heart.' },
          ].map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} style={{ background: card, border: `2px solid ${bdr}`, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(to right, ${P.crim}, ${P.gold}, ${P.emerald})` }} />
              <div style={{ height: 280, overflow: 'hidden' }}>
                <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '24px 20px', textAlign: 'center' }}>
                <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.8rem', fontWeight: 700, color: txt }}>{p.name}</h3>
                <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: P.gold, fontSize: '0.85rem', marginBottom: 12 }}>{p.role}</p>
                <HDiv dark={dark} />
                <p style={{ color: mut, lineHeight: 1.8, fontSize: '0.95rem', fontFamily: "'Lora', serif", fontStyle: 'italic' }}>{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* OUR LOVE STORY */}
      <section id="story" style={{ padding: '80px 24px', background: dark ? '#220A0A' : '#FAF0E6' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '0.85rem', color: p, marginBottom: 8, textAlign: 'center' }}>እንዴት እንደተገናኘን</p>
          <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '2.5rem', fontWeight: 700, color: txt, textAlign: 'center' }}>Our Love Story</h2>
          <HDiv dark={dark} />
          <div style={{ marginTop: 40, position: 'relative' }}>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: P.gold, transform: 'translateX(-50%)' }} />
            {[
              { year: '2020', title: 'The First Meeting', am: 'የመጀመሪያው እይታ', desc: 'Met at a community gathering in Addis. Dawit couldn\'t help but notice Selam\'s traditional dance. He asked for her number under the big acacia tree.', side: 'left' },
              { year: '2022', title: 'The Journey', am: 'ጉዟችን', desc: 'Two years of shared laughter, coffee ceremonies, and growing together. They realized their paths were meant to be one.', side: 'right' },
              { year: '2025', title: 'The Proposal', am: 'ጥያቄው', desc: 'At the hills overlooking the city during Meskel. Dawit asked Selam to spend the rest of her life with him. She said "Awo" before he could finish.', side: 'left' },
              { year: '2026', title: 'The Royal Wedding', am: 'የንጉሳዊው ሰርግ', desc: 'Today, surrounded by heritage and family, they start their forever.', side: 'right' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: item.side === 'left' ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ display: 'flex', justifyContent: item.side === 'left' ? 'flex-end' : 'flex-start', marginBottom: 50, position: 'relative' }}>
                <div style={{ position: 'absolute', left: '50%', top: 20, width: 16, height: 16, background: P.crim, border: `3px solid ${card}`, borderRadius: '50%', transform: 'translateX(-50%)', zIndex: 1 }} />
                <div style={{ width: '45%', background: card, border: `2px solid ${bdr}`, borderRadius: 8, padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                  <p style={{ fontFamily: "'Lora', serif", fontWeight: 700, color: P.gold, fontSize: '0.8rem', marginBottom: 4 }}>{item.year}</p>
                  <h4 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.2rem', fontWeight: 700, color: txt, marginBottom: 2 }}>{item.title}</h4>
                  <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '0.85rem', color: mut, marginBottom: 8 }}>{item.am}</p>
                  <p style={{ fontFamily: "'Lora', serif", color: mut, fontSize: '0.95rem', fontStyle: 'italic', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="timeline" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '0.85rem', color: p, marginBottom: 8 }}>የሰርጉ ፕሮግራም</p>
        <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '2.5rem', fontWeight: 700, color: txt }}>Wedding Timeline</h2>
        <HDiv dark={dark} />
        <div style={{ maxWidth: 600, margin: '30px auto 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { time: '3:00 PM', timeAm: 'ከምሽቱ 9:00', icon: '☕', title: 'Guest Arrival & Coffee', desc: 'እንግዶች ወለሉ እና የቡና ስርዓት' },
            { time: '4:00 PM', timeAm: 'ከምሽቱ 10:00', icon: '⛪', title: 'Ceremony Blessings', desc: 'ቅዱስ ጋብቻ እና ምርቃት' },
            { time: '5:30 PM', timeAm: 'ከምሽቱ 11:30', icon: '🥁', title: 'Traditional Dancing', desc: 'የባህል እስኪስታ እና ደስታ' },
            { time: '7:00 PM', timeAm: 'ከምሽቱ 1:00', icon: '🍽️', title: 'Grand Banquet', desc: 'የራት ግብዣ' },
            { time: '9:00 PM', timeAm: 'ከምሽቱ 3:00', icon: '💃', title: 'Evening Celebration', desc: 'የምሽት ጭፈራ' },
          ].map((e, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ display: 'flex', gap: 20, alignItems: 'center', padding: '18px 24px', border: `2px solid ${bdr}`, borderRadius: 8, background: card, textAlign: 'left', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: P.emerald }} />
              <div style={{ fontSize: '1.8rem', minWidth: 50, textAlign: 'center' }}>{e.icon}</div>
              <div>
                <p style={{ fontFamily: "'Lora', serif", color: p, fontWeight: 700, fontSize: '0.8rem' }}>{e.time} / {e.timeAm}</p>
                <h4 style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 700, color: txt, marginBottom: 2 }}>{e.title}</h4>
                <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", color: mut, fontSize: '0.85rem' }}>{e.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LOCATIONS */}
      <section id="locations" style={{ padding: '80px 24px', background: dark ? '#220A0A' : '#FAF0E6' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '0.85rem', color: p, marginBottom: 8, textAlign: 'center' }}>የቦታ መመሪያ</p>
          <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '2.5rem', fontWeight: 700, color: txt, textAlign: 'center' }}>Event Locations</h2>
          <HDiv dark={dark} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginTop: 32 }}>
            {[
              { type: 'Ceremony & Reception', name: 'Habesha Royal Hall', addr: 'Bole Area, Addis Ababa, Ethiopia', note: 'Entrance behind the main gate', icon: '🏰', maps: 'https://maps.google.com' },
              { type: 'Photo Session', name: 'Mount Entoto Park', addr: 'Entoto, Addis Ababa, Ethiopia', note: 'Family & Friends join at 4PM', icon: '🌲', maps: 'https://maps.google.com' },
              { type: 'Traditional Dinner', name: 'Family Estate', addr: 'Old Airport District, Addis Ababa', note: 'Private family gathering', icon: '🏠', maps: 'https://maps.google.com' },
            ].map((loc, i) => (
              <motion.div key={i} whileHover={{ y: -8 }} style={{ background: card, border: `2px solid ${bdr}`, borderRadius: 12, padding: '32px 24px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{loc.icon}</div>
                <p style={{ fontFamily: "'Lora', serif", fontSize: '0.75rem', fontWeight: 700, color: P.crim, textTransform: 'uppercase', marginBottom: 8 }}>{loc.type}</p>
                <h4 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.4rem', fontWeight: 700, color: txt, marginBottom: 12 }}>{loc.name}</h4>
                <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '0.9rem', color: mut, marginBottom: 8 }}><MapPin size={14} color={P.gold} /> {loc.addr}</p>
                <p style={{ fontSize: '0.85rem', color: mut, marginBottom: 20, fontStyle: 'italic' }}>{loc.note}</p>
                <a href={loc.maps} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: 4, background: P.crim, color: 'white', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700 }}>Open Map / ካርታ</a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '0.85rem', color: p, marginBottom: 8 }}>የፎቶዎች ስብስብ</p>
        <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '2.5rem', fontWeight: 700, color: txt }}>Gallery</h2>
        <HDiv dark={dark} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, maxWidth: 1100, margin: '30px auto 0' }}>
          {['/images/couple_1.jpg', '/images/couple_2.jpg', '/images/couple_3.jpg', '/images/couple_4.jpg', '/images/temp3.webp', '/images/hero3.jpg', '/images/hero2.jpg', '/images/temp1.webp'].map((img, i) => (
            <motion.div key={i} whileHover={{ scale: 1.03 }} style={{ borderRadius: 8, overflow: 'hidden', aspectRatio: i % 3 === 0 ? '3/4' : '4/3', border: `3px solid ${P.gold}`, position: 'relative' }}>
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* BRIDAL PARTY */}
      <section id="party" style={{ padding: '80px 24px', background: dark ? '#220A0A' : '#FAF0E6', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '0.85rem', color: p, marginBottom: 8 }}>ሚዜዎች</p>
        <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '2.5rem', fontWeight: 700, color: txt }}>Bridesmaids & Groomsmen</h2>
        <HDiv dark={dark} />
        <div style={{ marginTop: 40 }}>
          <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.4rem', fontWeight: 700, color: P.crim, marginBottom: 24 }}>The Bridesmaids / ሚዜዎች</h3>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            {[{ n: 'Helen', r: 'Maid of Honor' }, { n: 'Eden', r: 'Bridesmaid' }, { n: 'Mekdes', r: 'Bridesmaid' }, { n: 'Tsion', r: 'Bridesmaid' }].map((p, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} style={{ width: 140 }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px', border: `3px solid ${P.gold}`, background: card }}>
                  <img src="/images/head1.jpg" alt={p.n} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <p style={{ fontWeight: 700, fontSize: '1.1rem', color: txt }}>{p.n}</p>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: P.gold }}>{p.r}</p>
              </motion.div>
            ))}
          </div>
          <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.4rem', fontWeight: 700, color: P.emeraldD, marginBottom: 24 }}>The Groomsmen / ሚዜዎች</h3>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[{ n: 'Abebe', r: 'Best Man' }, { n: 'Yonas', r: 'Groomsman' }, { n: 'Samuel', r: 'Groomsman' }, { n: 'Getnet', r: 'Groomsman' }].map((p, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} style={{ width: 140 }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px', border: `3px solid ${P.emerald}`, background: card }}>
                  <img src="/images/head1.jpg" alt={p.n} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <p style={{ fontWeight: 700, fontSize: '1.1rem', color: txt }}>{p.n}</p>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: P.emerald }}>{p.r}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '0.85rem', color: p, marginBottom: 8 }}>የቪዲዮ ማስታወሻ</p>
        <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '2.5rem', fontWeight: 700, color: txt, marginBottom: 32 }}>Video Story</h2>
        <div style={{ maxWidth: 850, margin: '0 auto', borderRadius: 8, overflow: 'hidden', border: `4px solid ${P.gold}`, boxShadow: '0 10px 30px rgba(0,0,0,0.2)', position: 'relative', background: '#000', paddingTop: '56.25%' }}>
          <iframe style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Selam & Dawit" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      </section>

      {/* WISHES & FAQ */}
      <Wishes dark={dark} />
      <FAQ dark={dark} />

      {/* TELEGRAM */}
      <section style={{ padding: '60px 24px', background: dark ? '#220A0A' : '#FAF0E6', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '0.85rem', color: p, marginBottom: 8 }}>በቴሌግራም ያግኙን</p>
        <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '2rem', fontWeight: 700, color: txt, marginBottom: 16 }}>Connect With Us</h2>
        <p style={{ color: mut, fontSize: '1rem', maxWidth: 460, margin: '0 auto 24px', lineHeight: 1.6 }}>Have any burning questions or just want to say hi? Contact us on Telegram, we reply quickly! / በቴሌግራም መልእክት ይላኩልን።</p>
        <a href="https://t.me/yeserge_leta1" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '16px 32px', background: '#0088cc', color: 'white', borderRadius: 4, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,136,204,0.3)', fontFamily: "'Libre Baskerville', serif", letterSpacing: '0.1em', fontSize: '0.9rem' }}>
          <Send size={18} /> Message Us / ቴሌግራም
        </a>
      </section>

      {/* RSVP */}
      <section id="rsvp" style={{ padding: '100px 24px', position: 'relative', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(/images/hero3.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -1 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 500, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '1rem', color: P.gold, marginBottom: 12 }}>ግብዣውን ይቀበሉ</p>
          <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '3rem', fontWeight: 700, color: 'white', marginBottom: 12 }}>RSVP</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 36, fontSize: '1.2rem', fontStyle: 'italic' }}>Please confirm attendance by Sep 15, 2026</p>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 14 }} onSubmit={e => { e.preventDefault(); const fd = new FormData(e.target); const msg = `🇪🇹 RSVP — Selam & Dawit\nName: ${fd.get('name')}\nAttendance: ${fd.get('att')}\nGuests: ${fd.get('guests')}\nNote: ${fd.get('note')}`; window.open(`https://t.me/yeserge_leta1?text=${encodeURIComponent(msg)}`, '_blank'); e.target.reset(); }}>
            {[['name', 'Full Name / ሙሉ ስም', 'text'], ['note', 'Guest Note / ልዩ መልክት(ካለዎት)', 'text']].map(([id, ph, tp]) => (
              <input key={id} name={id} type={tp} placeholder={ph} required={id === 'name'} style={{ padding: '14px 20px', borderRadius: 4, border: `2px solid ${P.gold}`, background: 'rgba(255,255,255,0.1)', color: 'white', fontFamily: "'Lora', serif", fontSize: '1.1rem', outline: 'none', backdropFilter: 'blur(10px)' }} />
            ))}
            <select name="att" required style={{ padding: '14px 20px', borderRadius: 4, border: `2px solid ${P.gold}`, background: 'rgba(255,255,255,0.1)', color: 'white', fontFamily: "'Lora', serif", fontSize: '1.1rem', outline: 'none' }}>
              <option value="">Will you attend? / ይገኛሉ?</option>
              <option>I will attend / እገኛለሁ</option>
              <option>I cannot attend / አልገኝም</option>
            </select>
            <input name="guests" type="number" min="1" max="10" placeholder="Guests count / የእንግዶች ብዛት" style={{ padding: '14px 20px', borderRadius: 4, border: `2px solid ${P.gold}`, background: 'rgba(255,255,255,0.1)', color: 'white', fontFamily: "'Lora', serif", fontSize: '1.1rem', outline: 'none' }} />
            <button type="submit" style={{ padding: '18px', background: `linear-gradient(135deg, ${P.crim}, #8B0000)`, color: 'white', border: 'none', borderRadius: 4, fontWeight: 700, fontSize: '1.1rem', textTransform: 'uppercase', cursor: 'pointer', boxShadow: `0 4px 20px rgba(196,24,24,0.5)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>Confirm Attendance / አረጋግጥ</button>
          </form>
        </div>
      </section>

      {/* QR CODE */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '0.85rem', color: p, marginBottom: 8 }}>የመግቢያ ፈቃድ</p>
        <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '2.5rem', fontWeight: 700, color: txt, marginBottom: 12 }}>QR Code Entry</h2>
        <HDiv dark={dark} />
        <p style={{ color: mut, maxWidth: 500, margin: '0 auto 32px', fontSize: '1rem', fontStyle: 'italic' }}>Please present this digital pass at the venue entrance for seamless admission. / እባክዎን ይህንን ኮድ መግቢያው ላይ ያሳዩ።</p>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: 32, background: card, border: `3px solid ${P.gold}`, borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://yesergeleta.com/entry?event=selam-dawit-2026')}&bgcolor=${dark ? '280E0E' : 'FFFFFF'}&color=D4A040`} alt="Entry QR" style={{ width: 220, height: 220, borderRadius: 4 }} />
          <div>
            <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.4rem', fontWeight: 700, color: p }}>Selam & Dawit</p>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: mut, textTransform: 'uppercase', letterSpacing: '0.1em' }}>HABESHA ROYAL WEDDING · 2026.10.05</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '60px 24px', textAlign: 'center', borderTop: `2px solid ${P.gold}` }}>
        <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '2rem', fontWeight: 700, color: p }}>Selam & Dawit</p>
        <p style={{ fontFamily: "'Noto Serif Ethiopic', serif", fontSize: '1.1rem', color: P.gold, marginTop: 4 }}>ሰላም & ዳዊት</p>
        <p style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', color: mut, marginTop: 12 }}>October 5, 2026 · Royal Habesha</p>
      </footer>

      {/* FLOATING CONTROLS */}
      <button onClick={() => setD(!dark)} style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 100, width: 44, height: 44, borderRadius: 4, background: p, color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
        {dark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <MusicPlayer dark={dark} />
    </div>
  );
}
