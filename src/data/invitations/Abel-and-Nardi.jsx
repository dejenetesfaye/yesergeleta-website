import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sun, Moon, MapPin, Play, Pause, Volume2, VolumeX, Send, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';

/* ─── COLOUR PALETTE (Vintage Retro) ─── */
const P = {
  bg: '#FDF6EC', bgD: '#1A1004',
  card: '#FFF8F0', cardD: '#251A0A',
  pri: '#8B5E3C', priD: '#D4A76A',
  acc: '#C4826A', accD: '#E8A080',
  txt: '#3D2314', txtD: '#F5E6CE',
  mut: '#8B6F5A', mutD: '#9E8068',
  bdr: '#E8D5B7', bdrD: '#4A3520',
  gold: '#C8A97E',
};

function useCountdown(target) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const id = setInterval(() => {
      const diff = new Date(target) - Date.now();
      if (diff <= 0) return;
      setT({ d: Math.floor(diff / 86400000), h: Math.floor(diff / 3600000 % 24), m: Math.floor(diff / 60000 % 60), s: Math.floor(diff / 1000 % 60) });
    }, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

/* ─── FLOATING MUSIC PLAYER ─── */
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
    // Interaction listeners for modern browsers
    window.addEventListener('scroll', fn, { once: true });
    window.addEventListener('click', fn, { once: true });
    window.addEventListener('touchstart', fn, { once: true });
    return () => {
      window.removeEventListener('scroll', fn);
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
      <audio ref={ref} loop muted={mute} src="/images/Nardi and abel/Michael%20Bubl%C3%A9%20-%20Feeling%20Good%20(mp3cut.net).mp3" />
      <div style={{ position: 'fixed', bottom: 24, right: 80, zIndex: 100, display: 'flex', gap: 8 }}>
        <button onClick={toggle} style={{ width: 44, height: 44, borderRadius: '50%', background: p, color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
          {play ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button onClick={() => setM(!mute)} style={{ width: 44, height: 44, borderRadius: '50%', background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: p, border: `1px solid ${p}40`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {mute ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </>
  );
}

/* ─── ORNAMENTAL DIVIDER ─── */
function OrnDivider({ gold }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', margin: '18px 0' }}>
      <div style={{ flex: 1, maxWidth: 80, height: 1, background: `linear-gradient(to right,transparent,${gold})` }} />
      <div style={{ width: 6, height: 6, background: gold, transform: 'rotate(45deg)' }} />
      <Heart size={13} fill={gold} color={gold} />
      <div style={{ width: 6, height: 6, background: gold, transform: 'rotate(45deg)' }} />
      <div style={{ flex: 1, maxWidth: 80, height: 1, background: `linear-gradient(to left,transparent,${gold})` }} />
    </div>
  );
}

/* ─── FAQ ACCORDION ─── */
function FAQ({ dark }) {
  const [open, setOpen] = useState(null);
  const card = dark ? P.cardD : P.card;
  const pri = dark ? P.priD : P.pri;
  const bdr = dark ? P.bdrD : P.bdr;
  const txt = dark ? P.txtD : P.txt;
  const mut = dark ? P.mutD : P.mut;
  const items = [
    { q: 'Is there a dress code?', a: 'We request smart-casual or semi-formal attire. Feel free to wear floral or nature-inspired colours in the spirit of our vintage garden theme.' },
    { q: 'Can I bring children?', a: 'We warmly welcome children at the ceremony. For the evening reception, we ask that little ones be put to bed by 9 PM so the adults can dance freely!' },
    { q: 'Is parking available?', a: 'Yes, complimentary parking is available at the venue. There is also a shuttle service running from Highland Square every 30 minutes.' },
    { q: 'What if I have dietary restrictions?', a: 'Please note any dietary requirements in your RSVP form. We have vegetarian, vegan, and gluten-free options available.' },
    { q: 'Will there be a gift registry?', a: 'Your presence is the greatest gift. If you wish, we have a small registry at The Garden Gift Shop — details on the RSVP confirmation.' },
    { q: 'Can I share photos on social media?', a: `Absolutely! Please use the hashtag #AbelAndNardi2026 to share your memories. We'd love to see your photos!` },
  ];
  return (
    <section id="faq" style={{ padding: '80px 24px', background: dark ? '#1E1408' : '#FFFBF5' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.2rem', fontStyle: 'italic', color: pri, marginBottom: 8, textAlign: 'center' }}>Frequently Asked</h2>
        <OrnDivider gold={P.gold} />
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((item, i) => (
            <div key={i} style={{ background: card, border: `1px solid ${bdr}`, borderRadius: 8, overflow: 'hidden' }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', color: txt, fontWeight: 600 }}>{item.q}</span>
                {open === i ? <ChevronUp size={16} color={pri} /> : <ChevronDown size={16} color={pri} />}
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden', padding: '0 20px 16px', fontFamily: "'Cormorant Garamond',serif", fontSize: '1.05rem', lineHeight: 1.8, color: mut }}>
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

/* ─── WISHES SECTION ─── */
function Wishes({ dark }) {
  const [name, setName] = useState(''); const [msg, setMsg] = useState('');
  const [list, setList] = useState(() => { try { return JSON.parse(localStorage.getItem('abel_nardi_wishes') || '[]'); } catch { return []; } });
  const card = dark ? P.cardD : P.card;
  const pri = dark ? P.priD : P.pri;
  const bdr = dark ? P.bdrD : P.bdr;
  const txt = dark ? P.txtD : P.txt;
  const mut = dark ? P.mutD : P.mut;
  const submit = (e) => {
    e.preventDefault(); if (!name.trim() || !msg.trim()) return;
    const newList = [{ name, msg, date: new Date().toLocaleDateString() }, ...list];
    setList(newList); localStorage.setItem('abel_nardi_wishes', JSON.stringify(newList)); setName(''); setMsg('');
    window.open(`https://t.me/yeserge_leta1?text=${encodeURIComponent(`💐 Wish for Abel & Nardi from ${name}: ${msg}`)}`, '_blank');
  };
  return (
    <section id="wishes" style={{ padding: '80px 24px', background: dark ? '#1E1408' : '#FFF8F0' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.2rem', fontStyle: 'italic', color: pri, textAlign: 'center' }}>Blessings & Wishes</h2>
        <OrnDivider gold={P.gold} />
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" style={{ padding: '12px 16px', background: card, border: `1px solid ${bdr}`, borderRadius: 8, color: txt, fontFamily: "'Cormorant Garamond',serif", fontSize: '1rem', outline: 'none' }} />
          <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Your message to the couple..." rows={4} style={{ padding: '12px 16px', background: card, border: `1px solid ${bdr}`, borderRadius: 8, color: txt, fontFamily: "'Cormorant Garamond',serif", fontSize: '1rem', outline: 'none', resize: 'vertical' }} />
          <button type="submit" style={{ padding: '14px', background: `linear-gradient(135deg,${P.gold},${P.acc})`, color: 'white', border: 'none', borderRadius: 8, fontFamily: "'Bellefair',serif", fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Send size={16} /> Send Blessing
          </button>
        </form>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {list.map((w, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: card, border: `1px solid ${bdr}`, borderRadius: 8, padding: '16px 20px' }}>
              <p style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, color: pri, marginBottom: 4 }}>{w.name}</p>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.05rem', color: mut, lineHeight: 1.7 }}>{w.msg}</p>
              <p style={{ fontSize: '0.7rem', color: mut, marginTop: 6, opacity: 0.6 }}>{w.date}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AbelAndNardi() {
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isOpened, setIsOpened] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleScroll(); handleResize();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const cd = useCountdown('2026-05-02T16:00:00');

  const bg = dark ? P.bgD : P.bg;
  const card = dark ? P.cardD : P.card;
  const pri = dark ? P.priD : P.pri;
  const acc = dark ? P.accD : P.acc;
  const txt = dark ? P.txtD : P.txt;
  const mut = dark ? P.mutD : P.mut;
  const bdr = dark ? P.bdrD : P.bdr;

  const navLinks = ['About', 'Story', 'Events', 'Locations', 'Bridal Party', 'Gallery', 'Wishes', 'RSVP'];

  return (
    <div style={{ background: bg, color: txt, minHeight: '100vh', fontFamily: "'Cormorant Garamond',Georgia,serif", transition: 'all 0.4s' }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Bellefair&display=swap" rel="stylesheet" />

      {/* ── PRE-LOADER / ENVELOPE SPLASH ── */}
      <AnimatePresence>
        {!hasEntered && (
          <motion.div
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at center, #2C1A0A 0%, #0D0804 100%)' }}
          >
            {/* Ambient particle dots */}
            {[...Array(8)].map((_, i) => (
              <motion.div key={i}
                animate={{ y: [0, -20, 0], opacity: [0.15, 0.45, 0.15] }}
                transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
                style={{ position: 'absolute', width: i % 2 === 0 ? 3 : 2, height: i % 2 === 0 ? 3 : 2, borderRadius: '50%', background: P.gold, left: `${8 + i * 10}%`, top: `${15 + (i % 4) * 18}%` }}
              />
            ))}

            {/* Title above envelope */}
            <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
              style={{ textAlign: 'center', marginBottom: 52, zIndex: 2 }}
            >
              <p style={{ fontFamily: "'Bellefair',serif", fontSize: '0.7rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: P.gold, marginBottom: 12 }}>
                You are cordially invited
              </p>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: isMobile ? '2rem' : '3rem', fontStyle: 'italic', color: '#FDF6EC', margin: 0, fontWeight: 400, lineHeight: 1.1 }}>
                Abel & Nardi
              </h1>
              <div style={{ width: 60, height: 1, background: `linear-gradient(to right, transparent, ${P.gold}, transparent)`, margin: '16px auto 0' }} />
            </motion.div>

            {/* Envelope wrapper — matches reference CSS structure */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: isOpened ? 50 : 0, opacity: 1 }}
              transition={{ delay: isOpened ? 0 : 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: 'relative', width: isMobile ? 300 : 480, height: isMobile ? 200 : 300, zIndex: 2 }}
            >
              {/* ── back-fold: rectangle behind everything ── */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: '67%',
                background: 'linear-gradient(160deg, #C8A97E 0%, #B8924A 100%)',
                borderRadius: '0 0 4px 4px',
                zIndex: 0,
              }} />

              {/* ── letter: the invitation card, sits inside, slides UP on open ── */}
              <motion.div
                animate={{ height: isOpened ? '140%' : '40%' }}
                transition={{ delay: isOpened ? 0.4 : 0, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'absolute', bottom: 0, left: '10%', right: '10%',
                  height: '40%',
                  background: 'linear-gradient(160deg, #FFFEF9 0%, #FFF8EE 100%)',
                  border: `1px solid ${P.bdr}`,
                  borderRadius: 3,
                  zIndex: 1,
                  overflow: 'hidden',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 6,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                  padding: isMobile ? '10px' : '16px',
                }}
              >
                <p style={{ fontFamily: "'Bellefair',serif", fontSize: '0.55rem', letterSpacing: '0.35em', color: P.gold, textTransform: 'uppercase', margin: 0 }}>Wedding Invitation</p>
                <div style={{ width: 38, height: 1, background: `linear-gradient(to right, transparent, ${P.gold}, transparent)` }} />
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: isMobile ? '1rem' : '1.5rem', fontStyle: 'italic', margin: 0, color: P.pri, textAlign: 'center', lineHeight: 1.2 }}>Abel & Nardi</h3>
                <div style={{ width: 38, height: 1, background: `linear-gradient(to right, transparent, ${P.gold}, transparent)` }} />
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? '0.7rem' : '0.85rem', margin: 0, color: P.mut, fontStyle: 'italic' }}>May 2, 2026</p>
              </motion.div>

              {/* ── top-fold: the animated flap, triangle pointing DOWN ── */}
              <motion.div
                initial={{ rotateX: 0, zIndex: 4 }}
                animate={{
                  rotateX: isOpened ? 180 : 0,
                  zIndex: isOpened ? 0 : 4,
                }}
                transition={{
                  rotateX: { duration: 0.5, delay: isOpened ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] },
                  zIndex: { delay: isOpened ? 0.2 : 0.3 },
                }}
                style={{
                  position: 'absolute', top: '33%', left: 0, right: 0, height: 0,
                  borderStyle: 'solid',
                  borderWidth: `${isMobile ? 67 : 100}px ${isMobile ? 150 : 240}px 0 ${isMobile ? 150 : 240}px`,
                  borderColor: `${P.gold} transparent transparent transparent`,
                  transformOrigin: '50% 0%',
                }}
              />

              {/* ── body: front face triangle covering the bottom ── */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, width: 0, height: 0,
                borderStyle: 'solid',
                borderWidth: `0 0 ${isMobile ? 133 : 200}px ${isMobile ? 300 : 480}px`,
                borderColor: `transparent transparent #D4A76A transparent`,
                zIndex: 2,
                borderRadius: '0 0 4px 0',
              }} />

              {/* ── left-fold: left side triangle ── */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, width: 0, height: 0,
                borderStyle: 'solid',
                borderWidth: `${isMobile ? 67 : 100}px 0 ${isMobile ? 67 : 100}px ${isMobile ? 150 : 240}px`,
                borderColor: `transparent transparent transparent #C8A060`,
                zIndex: 2,
              }} />

              {/* ── WAX SEAL — positioned at center of envelope ── */}
              <div style={{ position: 'absolute', left: '50%', top: '70%', transform: 'translate(-50%, -50%)', zIndex: 20 }}>
                <motion.div
                  animate={{ scale: isOpened ? 0 : 1, opacity: isOpened ? 0 : 1 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => { setIsOpened(true); setTimeout(() => setHasEntered(true), 2700); }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                >
                  <div style={{ position: 'relative', width: isMobile ? 70 : 90, height: isMobile ? 70 : 90 }}>
                    <img
                      src="/images/Nardi and abel/wax seal.png"
                      alt="Open Invitation"
                      style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.65))' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                      <span style={{ fontFamily: "'Playfair Display',serif", fontSize: isMobile ? '0.75rem' : '0.9rem', fontStyle: 'italic', fontWeight: 700, color: '#FFF8E8', letterSpacing: '0.04em', textShadow: '0 1px 4px rgba(0,0,0,0.7)', lineHeight: 1, userSelect: 'none' }}>A & N</span>
                    </div>
                  </div>
                  <p style={{ marginTop: 10, fontFamily: "'Bellefair',serif", color: 'rgba(0, 0, 0, 0.75)', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.3em', fontSize: '0.6rem', textAlign: 'center', pointerEvents: 'none' }}>
                    Open Invitation
                  </p>
                </motion.div>
              </div>
            </motion.div>{/* end envelope wrapper */}

            {/* Shadow under envelope */}
            <motion.div
              animate={{ width: isOpened ? 200 : 350, opacity: isOpened ? 0.2 : 0.5 }}
              transition={{ duration: 0.5 }}
              style={{ width: 350, height: 24, borderRadius: '50%', background: 'radial-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0), rgba(0,0,0,0))', marginTop: 12, zIndex: 1 }}
            />
          </motion.div>
        )}
      </AnimatePresence>



      {/* ── NAV ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: scrolled ? (dark ? 'rgba(26,16,4,0.95)' : 'rgba(253,246,236,0.95)') : 'transparent', backdropFilter: scrolled ? 'blur(10px)' : 'none', borderBottom: scrolled ? `1px solid ${bdr}` : 'none', transition: 'all 0.4s', padding: isMobile ? '0 20px' : '0 32px', height: isMobile ? 60 : 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '1.1rem' : '1.3rem', fontWeight: 700, color: pri }}>A & N</span>

        {!isMobile ? (
          <div style={{ display: 'flex', gap: 24 }}>
            {navLinks.map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(' ', '')}`} style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: mut, textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        ) : (
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', color: pri, cursor: 'pointer', padding: 8 }}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setDark(!dark)} style={{ background: 'none', border: 'none', color: pri, cursor: 'pointer' }}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isMobile && menuOpen && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              style={{ position: 'absolute', top: 60, left: 0, right: 0, background: dark ? '#1A1004' : '#FDF6EC', borderBottom: `1px solid ${bdr}`, padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, zIndex: 999 }}>
              {navLinks.map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(' ', '')}`} onClick={() => setMenuOpen(false)} style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: txt, textDecoration: 'none', textAlign: 'center' }}>{l}</a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO (Video) ── */}
      <section id="hero" style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <video autoPlay loop muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}>
          <source src="/images/Nardi and abel/❤️Twice_over_June_26th_ended_up_as_the_most_meaningful_day_of_my.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(0,0,0,0.3),rgba(0,0,0,0.7))' }} />
        <div style={{ position: 'absolute', inset: 20, border: '1px solid rgba(200,169,126,0.5)', pointerEvents: 'none' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: 'white', padding: '0 24px' }}>
          <p style={{ fontFamily: "'Bellefair',serif", fontSize: '0.8rem', letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.8, marginBottom: 12 }}>Together We Say</p>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(3.5rem,9vw,6.5rem)', fontStyle: 'italic', fontWeight: 700, lineHeight: 1.05, marginBottom: 8 }}>Abel & Nardi</h1>
          <OrnDivider gold={P.gold} />
          <p style={{ fontSize: '1.2rem', fontStyle: 'italic', opacity: 0.85, letterSpacing: '0.06em' }}>May 2, 2026</p>
          <p style={{ fontFamily: "'Bellefair',serif", fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.7, marginTop: 8 }}>The Eternal Celebration</p>
        </motion.div>
      </section>

      {/* ── COUNTDOWN ── */}
      <section style={{ padding: '80px 24px', background: dark ? '#1E1408' : '#FFFBF5', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', fontStyle: 'italic', color: pri, marginBottom: 36 }}>Counting Down to Forever</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? 12 : 28, flexWrap: 'nowrap', overflow: 'hidden' }}>
          {[['Days', cd.d], ['Hours', cd.h], ['Min', cd.m], ['Sec', cd.s]].map(([l, v]) => (
            <div key={l} style={{ textAlign: 'center', minWidth: 0 }}>
              <div style={{ width: isMobile ? 70 : 88, height: isMobile ? 70 : 88, borderRadius: '50%', border: `2px solid ${P.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', background: card, boxShadow: `0 4px 20px rgba(200,169,126,0.2)` }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 700, color: pri }}>{String(v).padStart(2, '0')}</span>
              </div>
              <span style={{ fontFamily: "'Bellefair', serif", fontSize: isMobile ? '0.55rem' : '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: mut, whiteSpace: 'nowrap' }}>{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT US ── */}
      <section id="about" style={{ padding: '80px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.5rem', fontStyle: 'italic', color: pri }}>About Us</h2>
          <OrnDivider gold={P.gold} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 32 }}>
          {[
            { name: 'Nardi', role: 'The Bride', img: '/images/Nardi and abel/IMG_2360.PNG', desc: 'A soul filled with grace and light, Nardi has always dreamed of a love that feels like home. Her journey with Abel is the start of her most beautiful chapter.' },
            { name: 'Abel', role: 'The Groom', img: '/images/Nardi and abel/IMG_2375.PNG', desc: `Strong, kind, and constant, Abel found his perfect match in Nardi's radiant spirit. He is dedicated to building a life of joy and purpose by her side.` },
          ].map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              style={{ background: card, border: `1px solid ${bdr}`, borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ height: 320, overflow: 'hidden' }}>
                <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '24px 20px', textAlign: 'center' }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.6rem', fontStyle: 'italic', color: pri, marginBottom: 4 }}>{p.name}</h3>
                <p style={{ fontFamily: "'Bellefair',serif", fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: P.gold, marginBottom: 12 }}>{p.role}</p>
                <OrnDivider gold={P.gold} />
                <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: mut, fontStyle: 'italic' }}>{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── OUR LOVE STORY ── */}
      <section id="story" style={{ padding: '80px 24px', background: dark ? '#1E1408' : '#FFF5E8' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.5rem', fontStyle: 'italic', color: pri, textAlign: 'center' }}>Our Love Story</h2>
          <OrnDivider gold={P.gold} />
          <div style={{ marginTop: 40, position: 'relative' }}>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom,transparent,${P.gold},transparent)`, transform: 'translateX(-50%)', pointerEvents: 'none' }} />
            {[
              { year: '2022', title: 'The First Meeting', desc: 'A serendipitous moment that changed everything. They discovered a shared passion for life\'s beautiful details and a connection like no other.', img: '/images/Nardi and abel/IMG_2375.PNG', side: 'left' },
              { year: '2024', title: 'Growing Together', desc: 'Through shared adventures and quiet moments, their love grew into a sanctuary. A promise made to always be each other\'s greatest supporter.', img: '/images/Nardi and abel/IMG_2376.PNG', side: 'right' },
              { year: '2025', title: 'The Proposal', desc: 'On a day filled with magic, Abel asked Nardi to spend forever with him. Surrounded by beauty, she happily said yes.', img: '/images/Nardi and abel/IMG_2371.PNG', side: 'left' },
              { year: '2026', title: 'Forever Begins', desc: 'Today, they invite you to witness the beginning of their journey as husband and wife.', img: '/images/Nardi and abel/IMG_2378.PNG', side: 'right' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: item.side === 'left' ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                style={{ display: 'flex', justifyContent: item.side === 'left' ? 'flex-end' : 'flex-start', marginBottom: 48, position: 'relative' }}>
                <div style={{ position: 'absolute', left: '50%', top: 20, width: 16, height: 16, borderRadius: '50%', background: P.gold, transform: 'translateX(-50%)', border: `3px solid ${card}`, zIndex: 1 }} />
                <div style={{ width: isMobile ? '85%' : '44%', background: card, border: `1px solid ${bdr}`, borderRadius: 10, overflow: 'hidden', boxShadow: `0 4px 20px rgba(0,0,0,0.06)` }}>
                  <div style={{ height: 160, overflow: 'hidden' }}>
                    <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '16px 18px' }}>
                    <p style={{ fontFamily: "'Bellefair',serif", fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: P.gold, marginBottom: 4 }}>{item.year}</p>
                    <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', fontStyle: 'italic', color: pri, marginBottom: 8 }}>{item.title}</h4>
                    <p style={{ fontSize: '0.95rem', color: mut, lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE (Wedding Day) ── */}
      <section id="events" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Bellefair',serif", fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.3em', color: P.gold, marginBottom: 8 }}>May 2, 2026</p>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.5rem', fontStyle: 'italic', color: pri }}>Wedding Day Timeline</h2>
        <OrnDivider gold={P.gold} />
        <div style={{ maxWidth: 600, margin: '30px auto 0', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { time: '2:30 PM', icon: '🌸', title: 'Guest Arrival', desc: 'Welcome drinks & gathering at the venue' },
            { time: '3:00 PM', icon: '💍', title: 'Ceremony Begins', desc: 'Exchange of vows and rings' },
            { time: '4:00 PM', icon: '📸', title: 'Photography Session', desc: 'Portraits of the happy couple' },
            { time: '5:00 PM', icon: '🥂', title: 'Reception', desc: 'Grand entrance and welcome toast' },
            { time: '7:00 PM', icon: '🍽️', title: 'Wedding Dinner', desc: 'Celebratory feast and toasts' },
            { time: '9:00 PM', icon: '💃', title: 'Celebration & Dancing', desc: 'The party begins!' },
          ].map((e, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              style={{ display: 'flex', gap: 20, alignItems: 'flex-start', paddingBottom: 28, position: 'relative', textAlign: 'left' }}>
              {i < 5 && <div style={{ position: 'absolute', left: 28, top: 40, bottom: -8, width: 2, background: `linear-gradient(to bottom,${P.gold}40,transparent)` }} />}
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: card, border: `2px solid ${P.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0, boxShadow: `0 2px 12px rgba(200,169,126,0.3)` }}>{e.icon}</div>
              <div style={{ paddingTop: 12 }}>
                <p style={{ fontFamily: "'Bellefair',serif", fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: P.gold, marginBottom: 2 }}>{e.time}</p>
                <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', color: pri, marginBottom: 4 }}>{e.title}</h4>
                <p style={{ fontSize: '0.95rem', color: mut, lineHeight: 1.6 }}>{e.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── LOCATIONS ── */}
      <section id="locations" style={{ padding: '80px 24px', background: dark ? '#1E1408' : '#FFF5E8' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.5rem', fontStyle: 'italic', color: pri, textAlign: 'center' }}>Event Locations</h2>
          <OrnDivider gold={P.gold} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, marginTop: 32 }}>
            {[
              { type: 'Ceremony', icon: '💍', name: 'Main Cathedral', address: 'Addis Ababa, Ethiopia', time: '3:00 PM', maps: 'https://maps.google.com/?q=Addis+Ababa' },
              { type: 'Reception', icon: '🥂', name: 'Grand Ballroom', address: 'Addis Ababa, Ethiopia', time: '5:00 PM', maps: 'https://maps.google.com/?q=Addis+Ababa' },
            ].map((loc, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ background: card, border: `1px solid ${bdr}`, borderRadius: 12, padding: '28px 24px', textAlign: 'center', boxShadow: `0 4px 20px rgba(0,0,0,0.05)` }}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>{loc.icon}</div>
                <p style={{ fontFamily: "'Bellefair',serif", fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.25em', color: P.gold, marginBottom: 8 }}>{loc.type}</p>
                <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', fontStyle: 'italic', color: pri, marginBottom: 6 }}>{loc.name}</h4>
                <p style={{ fontSize: '0.85rem', color: mut, marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><MapPin size={13} color={P.gold} />{loc.address}</p>
                <p style={{ fontFamily: "'Bellefair',serif", fontSize: '0.75rem', color: acc, marginBottom: 16 }}>{loc.time}</p>
                <a href={loc.maps} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '8px 20px', border: `1px solid ${P.gold}`, borderRadius: 20, fontSize: '0.75rem', fontFamily: "'Bellefair',serif", textTransform: 'uppercase', letterSpacing: '0.15em', color: pri, textDecoration: 'none' }}>Get Directions</a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRIDAL PARTY ── */}
      <section id="bridalparty" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.5rem', fontStyle: 'italic', color: pri, textAlign: 'center' }}>The Bridal Party</h2>
          <OrnDivider gold={P.gold} />
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', marginTop: 30 }}>
            {[{ name: 'Zena', role: 'Maid of Honor' }, { name: 'Selam', role: 'Bridesmaid' }, { name: 'Dawit', role: 'Best Man' }, { name: 'Yonatan', role: 'Groomsman' }].map((p, i) => (
              <motion.div key={i} whileHover={{ y: -6 }} style={{ textAlign: 'center', width: 140 }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 10px', border: `3px solid ${P.gold}`, background: bdr }}>
                  <img src={i % 2 === 0 ? '/images/Nardi and abel/IMG_2367.PNG' : '/images/Nardi and abel/IMG_2368.PNG'} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                </div>
                <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', color: pri, fontWeight: 600 }}>{p.name}</p>
                <p style={{ fontFamily: "'Bellefair',serif", fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: P.gold }}>{p.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="gallery" style={{ padding: '80px 24px', background: dark ? '#1E1408' : '#FFF5E8', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.5rem', fontStyle: 'italic', color: pri }}>Our Gallery</h2>
          <OrnDivider gold={P.gold} />

          <div style={{ position: 'relative', marginTop: 40, padding: isMobile ? '0' : '0 60px' }}>
            {/* Slider Container */}
            <div style={{ overflow: 'hidden' }}>
              <motion.div
                animate={{ x: `-${(galleryIndex * (100 / (isMobile ? 1 : 3)))}%` }}
                transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                style={{ display: 'flex', gap: 20 }}
              >
                {[
                  '/images/Nardi and abel/IMG_2350.PNG',
                  '/images/Nardi and abel/IMG_2351.PNG',
                  '/images/Nardi and abel/IMG_2352.PNG',
                  '/images/Nardi and abel/IMG_2353.PNG',
                  '/images/Nardi and abel/IMG_2355.PNG',
                  '/images/Nardi and abel/IMG_2356.PNG',
                  '/images/Nardi and abel/IMG_2358.PNG',
                  '/images/Nardi and abel/IMG_2360.PNG',
                  '/images/Nardi and abel/IMG_2361.PNG',
                  '/images/Nardi and abel/IMG_2362.PNG',
                  '/images/Nardi and abel/IMG_2363.PNG',
                  '/images/Nardi and abel/IMG_2364.PNG',
                  '/images/Nardi and abel/IMG_2367.PNG',
                  '/images/Nardi and abel/IMG_2368.PNG',
                  '/images/Nardi and abel/IMG_2369.PNG',
                  '/images/Nardi and abel/IMG_2371.PNG',
                  '/images/Nardi and abel/IMG_2375.PNG',
                  '/images/Nardi and abel/IMG_2376.PNG',
                  '/images/Nardi and abel/IMG_2377.PNG',
                  '/images/Nardi and abel/IMG_2378.PNG'
                ].map((img, i) => (
                  <div key={i} style={{ flex: `0 0 calc(${100 / (isMobile ? 1 : 3)}% - ${isMobile ? 0 : 14}px)`, aspectRatio: '4/5', borderRadius: 12, overflow: 'hidden', border: `3px solid ${card}`, boxShadow: `0 4px 16px rgba(0,0,0,0.08)` }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Controls */}
            <button
              onClick={() => setGalleryIndex(prev => Math.max(0, prev - 1))}
              disabled={galleryIndex === 0}
              style={{ position: 'absolute', left: isMobile ? 10 : 0, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, borderRadius: '50%', background: card, border: `1px solid ${bdr}`, color: pri, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: galleryIndex === 0 ? 'default' : 'pointer', opacity: galleryIndex === 0 ? 0.3 : 1, zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setGalleryIndex(prev => Math.min(17, prev + 1))}
              disabled={galleryIndex >= (isMobile ? 19 : 17)}
              style={{ position: 'absolute', right: isMobile ? 10 : 0, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, borderRadius: '50%', background: card, border: `1px solid ${bdr}`, color: pri, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: galleryIndex >= (isMobile ? 19 : 17) ? 'default' : 'pointer', opacity: galleryIndex >= (isMobile ? 19 : 17) ? 0.3 : 1, zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* ── VIDEO ── */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.5rem', fontStyle: 'italic', color: pri, marginBottom: 32 }}>Our Story in Motion</h2>
        <div style={{ maxWidth: 650, maxHeight: 500, margin: '0 auto', borderRadius: 12, overflow: 'hidden', border: `4px solid ${card}`, boxShadow: `0 8px 40px rgba(0,0,0,0.15)`, position: 'relative', background: '#000' }}>
          <video controls style={{ width: '100%', maxHeight: 500, display: 'block', objectFit: 'contain' }}>
            <source src="/images/Nardi and abel/❤️Twice_over_June_26th_ended_up_as_the_most_meaningful_day_of_my.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      {/* ── TELEGRAM BOT ── */}
      <section style={{ padding: '60px 24px', background: dark ? '#1E1408' : '#FFF5E8', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', fontStyle: 'italic', color: pri, marginBottom: 16 }}>Share Your Memories</h2>
        <p style={{ color: mut, fontStyle: 'italic', marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>Express your love and blessings in messages, voice notes, photos, or videos, and help preserve the magic of this special day forever. 💌</p>
        <a href="https://t.me/yeserge_leta1" target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 28px', background: '#0088cc', color: 'white', borderRadius: 30, fontFamily: "'Bellefair',serif", fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.15em', textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,136,204,0.35)' }}>
          Telegram Bot
        </a>
      </section>

      {/* ── BRIDAL WISHES ── */}
      <Wishes dark={dark} />

      {/* ── FAQ ── */}
      <FAQ dark={dark} />

      {/* ── RSVP ── */}
      <section id="rsvp" style={{ position: 'relative', padding: '80px 24px', textAlign: 'center', overflow: 'hidden' }}>
        <video autoPlay loop muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}>
          <source src="/images/Nardi and abel/202604161158.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 560, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Bellefair',serif", fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.3em', color: P.gold, marginBottom: 8 }}>Will You Join Us?</p>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.5rem', fontStyle: 'italic', color: 'white', marginBottom: 8 }}>RSVP</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', marginBottom: 28 }}>Kindly respond before May 1, 2026</p>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 14 }} onSubmit={e => {
            e.preventDefault();
            const fd = new FormData(e.target); const msg = `RSVP from ${fd.get('name')} — ${fd.get('attendance')} — Guests: ${fd.get('guests')}`;
            window.open(`https://t.me/yeserge_leta1?text=${encodeURIComponent(msg)}`, '_blank'); e.target.reset();
          }}>
            <input name="name" type="text" placeholder="Your Full Name" required style={{ padding: '13px 18px', borderRadius: 8, background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', outline: 'none' }} />
            <select name="attendance" required style={{ padding: '13px 18px', borderRadius: 8, background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', outline: 'none' }}>
              <option value="">Attendance</option>
              <option value="Joyfully Accepts">Joyfully Accepts</option>
              <option value="Regretfully Declines">Regretfully Declines</option>
            </select>
            <input name="guests" type="number" min="1" max="5" placeholder="Number of Guests" style={{ padding: '13px 18px', borderRadius: 8, background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }} />
            <button type="submit" style={{ padding: '16px', background: `linear-gradient(135deg,${P.gold},${P.acc})`, color: 'white', border: 'none', borderRadius: 8, fontFamily: "'Bellefair',serif", textTransform: 'uppercase', cursor: 'pointer' }}>
              Confirm My Attendance
            </button>
          </form>
        </div>
      </section>

      {/* ── QR CODE ENTRY ── */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.2rem', fontStyle: 'italic', color: pri, marginBottom: 16 }}>Have Your QR Code Entry</h2>
        <OrnDivider gold={P.gold} />
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 24, background: card, borderRadius: 16, border: `2px solid ${bdr}`, boxShadow: `0 8px 40px rgba(200,169,126,0.2)` }}>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://yesergeleta.com/entry?id=abel-nardi-2026&name=Guest')}&bgcolor=fff8f0&color=8B5E3C`} alt="QR Code" style={{ width: 200, height: 200, borderRadius: 8 }} />
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', color: pri, fontSize: '1.1rem' }}>Abel & Nardi · May 2, 2026</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '40px 24px', textAlign: 'center', borderTop: `1px solid ${bdr}`, background: dark ? '#130D04' : '#FDF0E0' }}>
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', fontStyle: 'italic', color: pri, marginBottom: 8 }}>Abel & Nardi</p>
        <OrnDivider gold={P.gold} />
        <p style={{ fontFamily: "'Bellefair',serif", fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: mut }}>May 2, 2026</p>
      </footer>

      <MusicPlayer dark={dark} />
    </div>
  );
}
