/**
 * ImperialTemplate.tsx — Self-contained Imperial Wedding Invitation
 * 
 * Dependencies: react, framer-motion, lucide-react
 * Also requires the wedding CSS (see wedding-styles.css)
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Menu, X, ChevronLeft, ChevronRight, ChevronDown, MapPin, ExternalLink, Sun, Moon, Quote, Music, Star, Clock, Wine, Utensils, Send, QrCode, Volume2, VolumeX } from 'lucide-react';


// ======================== TYPES ========================
interface WeddingData {
  couple: {
    bride: string;
    groom: string;
    bridePhoto?: string;
    groomPhoto?: string;
    aboutBride?: string;
    aboutGroom?: string;
  };
  date: string;
  venue: { name: string; address: string; mapUrl: string; mapEmbedUrl: string };
  gallery: string[];
  timeline: TimelineEvent[];
  story: LoveStoryItem[];
  bridesmaids: PartyMember[];
  groomsmen: PartyMember[];
  blessings: Blessing[];
  faq: FAQItem[];
  videoUrl?: string;
  telegramLink?: string;
  qrCodeImage?: string;
  musicUrl?: string;
}
interface TimelineEvent { time: string; title: string; description: string; icon?: string }
interface LoveStoryItem { date: string; title: string; description: string; image?: string }
interface PartyMember { name: string; role: string; image: string; message?: string }
interface Blessing { name: string; message: string; avatar?: string }
interface FAQItem { question: string; answer: string }
interface RSVPFormData { name: string; phone: string; attendance: 'attending' | 'not-attending' | ''; message: string }


// ======================== SAMPLE DATA ========================
// Replace these with your actual image imports or URLs
const sampleWeddingData: WeddingData = {
  couple: {
    bride: 'Amelia',
    groom: 'James',
    bridePhoto: '/images/couple_1.jpg',
    groomPhoto: '/images/couple_2.jpg',
    aboutBride: 'A passionate artist who loves sunsets and long walks on the beach.',
    aboutGroom: 'A dedicated architect who designs dreams into reality.',
  },
  date: '2026-09-15T16:00:00',
  venue: {
    name: 'The Grand Rosewood Estate',
    address: '1234 Blossom Lane, Beverly Hills, CA 90210',
    mapUrl: 'https://maps.google.com/?q=Beverly+Hills+CA',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.7!2d-118.4!3d34.07!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDA0JzEyLjAiTiAxMTjCsDI0JzAwLjAiVw!5e0!3m2!1sen!2sus!4v1600000000000',
  },
  gallery: [
    '/images/temp1.webp',
    '/images/temp2.jpg',
    '/images/temp3.webp',
    '/images/temp4.jpg',
    '/images/temp5.jpg',
    '/images/temp6.jpg',
    '/images/couple_3.jpg',
    '/images/couple_4.jpg',
  ],
  timeline: [
    { time: '3:00 PM', title: 'Guest Arrival', description: 'Welcome cocktails in the garden', icon: 'glass' },
    { time: '4:00 PM', title: 'Ceremony', description: 'Exchange of vows under the rose arch', icon: 'heart' },
    { time: '5:00 PM', title: 'Cocktail Hour', description: 'Celebrate with drinks and live music', icon: 'music' },
    { time: '6:30 PM', title: 'Reception & Dinner', description: 'Fine dining and heartfelt toasts', icon: 'utensils' },
    { time: '8:00 PM', title: 'First Dance', description: "The couple's first dance as newlyweds", icon: 'star' },
    { time: '9:00 PM', title: 'Party & Dancing', description: 'Dance the night away!', icon: 'party' },
  ],
  story: [
    { date: 'June 2020', title: 'First Meeting', description: 'We met at a coffee shop on a rainy afternoon.', image: '/images/8e3952f352d51710d93bb12a8518ffe6.jpg' },
    { date: 'December 2021', title: 'First Trip Together', description: 'Our first vacation to Paris.', image: '/images/couple_3.jpg' },
    { date: 'February 2025', title: 'The Proposal', description: 'On a starlit beach in Malibu, James got down on one knee.', image: '/images/couple_4.jpg' },
  ],
  bridesmaids: [
    { name: 'Sophia Chen', role: 'Maid of Honor', image: '/images/head1.jpg', message: 'My best friend deserves all the happiness!' },
    { name: 'Isabella Martinez', role: 'Bridesmaid', image: '/images/head1.jpg', message: 'So honored to stand by your side.' },
    { name: 'Charlotte Williams', role: 'Bridesmaid', image: '/images/head1.jpg', message: 'Love you both so much!' },
  ],
  groomsmen: [
    { name: 'Ethan Park', role: 'Best Man', image: '/images/head1.jpg', message: 'Brothers for life!' },
    { name: 'Liam Johnson', role: 'Groomsman', image: '/images/head1.jpg', message: "Couldn't be happier for you two!" },
    { name: 'Noah Davis', role: 'Groomsman', image: '/images/head1.jpg', message: "Here's to forever!" },
  ],
  blessings: [
    { name: 'Sarah & Tom', message: 'Wishing you a lifetime of love and laughter.' },
    { name: 'Mom & Dad', message: 'Our little girl is all grown up. So proud of you both.' },
    { name: 'Uncle Robert', message: 'May your love be as endless as the ocean.' },
    { name: 'The Hendersons', message: "Cheers to the most beautiful couple!" },
  ],
  faq: [
    { question: 'What is the dress code?', answer: 'Semi-formal / cocktail attire.' },
    { question: 'Can I bring a plus one?', answer: 'Please refer to your invitation for reserved seats.' },
    { question: 'Is there parking available?', answer: 'Yes! Free valet parking at the venue entrance.' },
    { question: 'Will there be vegetarian options?', answer: 'Absolutely! Our menu includes vegetarian and vegan dishes.' },
  ],
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  telegramLink: 'https://t.me/yourweddingbot',
  musicUrl: '',
};


// ======================== THEME TOGGLE ========================
// ======================== THEME TOGGLE ========================
const ThemeToggle = () => {
  const [dark, setDark] = useState(false); // Initialize in light mode by default

  useEffect(() => {
    const root = document.getElementById('template-root');
    if (!root) return;

    // Imperial CSS is natively dark. So if dark is false, we must add '.light'
    if (dark) {
      root.classList.remove('light');
      root.classList.add('dark-active'); // optional state indicator
    } else {
      root.classList.add('light');
      root.classList.remove('dark-active');
    }
  }, [dark]);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={() => setDark(!dark)}
      className={`fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full border-2 shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 ${dark ? 'bg-zinc-200 border-primary text-black' : 'bg-white border-border text-primary'}`}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? <Sun size={20} className="text-primary" /> : <Moon size={20} className="text-primary" />}
    </motion.button>
  );
};


// ======================== NAVIGATION ========================
const WeddingNav = ({ items, coupleNames }: { items: { label: string; href: string }[]; coupleNames: string }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="w-full px-6 md:px-24 h-20 flex items-center justify-between relative">
        <a href="#hero" style={{ fontFamily: "'Cormorant Garamond', serif" }} className="hidden md:block text-3xl lg:text-4xl font-bold italic text-foreground md:ml-20">
          {coupleNames}
        </a>
        <div className="hidden md:flex items-center gap-10 md:mr-20">
          {items.map((item) => (
            <a key={item.href} href={item.href} style={{ fontFamily: "'Cinzel', serif" }} className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition">{item.label}</a>
          ))}
        </div>
        <button className="md:hidden absolute right-6 text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-background/95 backdrop-blur-md border-t border-border overflow-hidden">
            <div className="px-4 py-4 space-y-3">
              {items.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02, backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'block',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    background: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    color: 'hsl(var(--foreground))',
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    textDecoration: 'none',
                    textAlign: 'center',
                    boxShadow: scrolled ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};


// ======================== HERO SECTION ========================
const HeroSection = ({ bride, groom, date, backgroundImage, variant = 'minimal' }: { bride: string; groom: string; date: string; backgroundImage: string; variant?: 'minimal' | 'elegant' | 'dark' | 'cinematic' }) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const overlayClass = variant === 'dark' || variant === 'cinematic'
    ? 'bg-gradient-to-b from-black/70 via-black/50 to-black/80'
    : 'bg-gradient-to-b from-black/10 via-black/10 to-black/30';

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={backgroundImage} alt="Wedding" className="w-full h-full object-cover" />
        <div className={`absolute inset-0 ${overlayClass}`} />
      </div>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="relative z-10 text-center px-4">
        <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl md:text-5xl italic text-cream mb-4">We're Getting Married</p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-cream mb-2">{bride}</h1>
        <div className="flex items-center justify-center gap-4 my-3">
          <div className="w-16 h-px bg-primary/60" />
          <Heart size={20} className="text-primary" fill="currentColor" />
          <div className="w-16 h-px bg-primary/60" />
        </div>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-cream">{groom}</h1>
        <p className="font-serif text-lg md:text-xl text-cream/80 mt-6 italic">{formattedDate}</p>
        <motion.a
          href="#countdown"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', borderRadius: '8px', background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', fontFamily: "'Montserrat', sans-serif", fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', marginTop: '32px' }}
          className="hover:opacity-80 transition-opacity"
        >
          Scroll Down
        </motion.a>
      </motion.div>
    </section>
  );
};


// ======================== COUNTDOWN ========================
const Countdown = ({ targetDate }: { targetDate: string }) => {
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

  const S_section = { padding: '80px 20px', width: '100%', boxSizing: 'border-box' as const, background: 'hsl(var(--background))' };
  const S_centered = { textAlign: 'center' as const, width: '100%', maxWidth: '800px', margin: '0 auto' };
  const S_sectionTitle = { fontFamily: "'Cinzel', 'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '600', letterSpacing: '0.08em', textAlign: 'center' as const, marginBottom: '0.5rem', color: 'hsl(var(--foreground))' };
  const S_sectionSubtitle = { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontStyle: 'italic', textAlign: 'center' as const, opacity: 0.7, marginBottom: '2.5rem', color: 'hsl(var(--foreground))' };

  return (
    <section id="countdown" style={S_section}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={S_centered}>
        <h2 style={S_sectionTitle}>Save the Date</h2>
        <p style={S_sectionSubtitle}>Counting down to our forever</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyItems: 'center', justifyContent: 'center', gap: '24px', marginTop: '32px' }}>
          {units.map((unit) => (
            <div key={unit.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--primary))', borderRadius: '16px', width: '110px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: '2.8rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>{String(unit.value).padStart(2, '0')}</span>
              </div>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'hsl(var(--muted-foreground))' }}>{unit.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};


// ======================== ABOUT US ========================
const AboutUs = ({ couple }: { couple: WeddingData['couple'] }) => {
  const S_section = { padding: '80px 20px', width: '100%', boxSizing: 'border-box' as const, background: 'hsl(var(--background))' };
  const S_centered = { textAlign: 'center' as const, width: '100%' };
  const S_sectionTitle = { fontFamily: "'Cinzel', 'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '600', letterSpacing: '0.08em', textAlign: 'center' as const, marginBottom: '0.5rem', color: 'hsl(var(--foreground))' };
  const S_sectionSubtitle = { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontStyle: 'italic', textAlign: 'center' as const, opacity: 0.7, marginBottom: '2.5rem', color: 'hsl(var(--foreground))' };
  const S_divider = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '16px auto 32px' };
  const S_dividerLine = { width: '80px', height: '1px', background: 'hsl(var(--primary))', opacity: 0.5 };

  return (
    <section id="about" style={S_section}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={S_centered}>
        <h2 style={S_sectionTitle}>About Us</h2>
        <div style={S_divider}>
          <div style={S_dividerLine} />
          <Heart size={14} color="hsl(var(--primary))" fill="hsl(var(--primary))" />
          <div style={S_dividerLine} />
        </div>
        <p style={S_sectionSubtitle}>Two hearts, one love</p>
      </motion.div>
      <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ flex: '1 1 300px', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', padding: '40px 20px', textAlign: 'center' }}>
          {couple.bridePhoto && <div style={{ width: '160px', height: '160px', borderRadius: '50%', margin: '0 auto 24px', overflow: 'hidden', border: '1px solid hsl(var(--primary))', opacity: 0.9, padding: '4px' }}><img src={couple.bridePhoto} alt={couple.bride} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /></div>}
          <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '2rem', color: 'hsl(var(--foreground))', fontWeight: 600 }}>{couple.bride}</h3>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: 'hsl(var(--primary))', textTransform: 'uppercase', margin: '8px 0 16px' }}>The Bride</p>
          {couple.aboutBride && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: 'hsl(var(--foreground))', opacity: 0.8, lineHeight: 1.6 }}>{couple.aboutBride}</p>}
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ flex: '1 1 300px', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', padding: '40px 20px', textAlign: 'center' }}>
          {couple.groomPhoto && <div style={{ width: '160px', height: '160px', borderRadius: '50%', margin: '0 auto 24px', overflow: 'hidden', border: '1px solid hsl(var(--primary))', opacity: 0.9, padding: '4px' }}><img src={couple.groomPhoto} alt={couple.groom} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /></div>}
          <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '2rem', color: 'hsl(var(--foreground))', fontWeight: 600 }}>{couple.groom}</h3>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: 'hsl(var(--primary))', textTransform: 'uppercase', margin: '8px 0 16px' }}>The Groom</p>
          {couple.aboutGroom && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: 'hsl(var(--foreground))', opacity: 0.8, lineHeight: 1.6 }}>{couple.aboutGroom}</p>}
        </motion.div>
      </div>
    </section>
  );
};


// ======================== VIDEO SECTION ========================
const VideoSection = ({ url }: { url: string }) => {
  const S_section = { padding: '80px 20px', width: '100%', boxSizing: 'border-box' as const, background: 'hsl(var(--background))' };
  const S_centered = { textAlign: 'center' as const, width: '100%' };
  const S_sectionTitle = { fontFamily: "'Cinzel', 'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '600', letterSpacing: '0.08em', textAlign: 'center' as const, marginBottom: '0.5rem', color: 'hsl(var(--foreground))' };
  const S_sectionSubtitle = { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontStyle: 'italic', textAlign: 'center' as const, opacity: 0.7, marginBottom: '2.5rem', color: 'hsl(var(--foreground))' };
  const S_divider = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '16px auto 32px' };
  const S_dividerLine = { width: '80px', height: '1px', background: 'hsl(var(--primary))', opacity: 0.5 };

  return (
    <section id="video" style={S_section}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={S_centered}>
        <h2 style={S_sectionTitle}>Our Video</h2>
        <div style={S_divider}>
          <div style={S_dividerLine} />
          <Heart size={14} color="hsl(var(--primary))" fill="hsl(var(--primary))" />
          <div style={S_dividerLine} />
        </div>
        <p style={S_sectionSubtitle}>A glimpse into our journey</p>
      </motion.div>
      <div style={{ maxWidth: '900px', margin: '0 auto', border: '1px solid hsl(var(--border))', borderRadius: '8px', overflow: 'hidden', padding: '10px', background: 'hsl(var(--background))' }}>
        <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '4px', overflow: 'hidden' }}>
          <iframe src={url} width="100%" height="100%" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Wedding video" style={{ border: 0 }} />
        </div>
      </div>
    </section>
  );
};


// ======================== GALLERY ========================
const Gallery = ({ images, columns = 3 }: { images: string[]; columns?: 2 | 3 | 4 }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const S_section = { padding: '80px 20px', width: '100%', boxSizing: 'border-box' as const, background: 'hsl(var(--background))' };
  const S_centered = { textAlign: 'center' as const, width: '100%' };
  const S_sectionTitle = { fontFamily: "'Cinzel', 'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '600', letterSpacing: '0.08em', textAlign: 'center' as const, marginBottom: '0.5rem', color: 'hsl(var(--foreground))' };
  const S_sectionSubtitle = { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontStyle: 'italic', textAlign: 'center' as const, opacity: 0.7, marginBottom: '2.5rem', color: 'hsl(var(--foreground))' };
  const S_divider = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '16px auto 32px' };
  const S_dividerLine = { width: '80px', height: '1px', background: 'hsl(var(--primary))', opacity: 0.5 };

  const navigate = (dir: number) => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + dir + images.length) % images.length);
  };

  return (
    <section id="gallery" style={S_section}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={S_centered}>
        <h2 style={S_sectionTitle}>Our Gallery</h2>
        <div style={S_divider}>
          <div style={S_dividerLine} />
          <Heart size={14} color="hsl(var(--primary))" fill="hsl(var(--primary))" />
          <div style={S_dividerLine} />
        </div>
        <p style={S_sectionSubtitle}>Moments captured in time</p>
      </motion.div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`, gap: '16px', padding: '0 10px' }}>
        {images.map((img, i) => (
          <motion.div key={i} whileHover={{ scale: 1.02 }} style={{ cursor: 'pointer', overflow: 'hidden', borderRadius: '8px', border: '1px solid hsl(var(--border))', padding: '6px', background: 'hsl(var(--background))' }} onClick={() => setSelectedIndex(i)}>
            <img src={img} alt={`Gallery ${i + 1}`} loading="lazy" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '4px' }} />
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setSelectedIndex(null)}>
            <button onClick={() => setSelectedIndex(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={32} /></button>
            <button onClick={(e) => { e.stopPropagation(); navigate(-1); }} style={{ position: 'absolute', left: '20px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><ChevronLeft size={40} /></button>
            <button onClick={(e) => { e.stopPropagation(); navigate(1); }} style={{ position: 'absolute', right: '20px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><ChevronRight size={40} /></button>
            <motion.img key={selectedIndex} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} src={images[selectedIndex]} alt="Full size" style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '8px' }} onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};


// ======================== LOVE STORY ========================
const LoveStory = ({ story }: { story: LoveStoryItem[] }) => {
  const S_section = { padding: '80px 20px', width: '100%', boxSizing: 'border-box' as const, background: 'hsl(var(--background))' };
  const S_centered = { textAlign: 'center' as const, width: '100%' };
  const S_sectionTitle = { fontFamily: "'Cinzel', 'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '600', letterSpacing: '0.08em', textAlign: 'center' as const, marginBottom: '0.5rem', color: 'hsl(var(--foreground))' };
  const S_sectionSubtitle = { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontStyle: 'italic', textAlign: 'center' as const, opacity: 0.7, marginBottom: '2.5rem', color: 'hsl(var(--foreground))' };
  const S_divider = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '16px auto 32px' };
  const S_dividerLine = { width: '80px', height: '1px', background: 'hsl(var(--primary))', opacity: 0.5 };

  return (
    <section id="love-story" style={S_section}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={S_centered}>
        <h2 style={S_sectionTitle}>Our Love Story</h2>
        <div style={S_divider}>
          <div style={S_dividerLine} />
          <Heart size={14} color="hsl(var(--primary))" fill="hsl(var(--primary))" />
          <div style={S_dividerLine} />
        </div>
        <p style={S_sectionSubtitle}>How it all began</p>
      </motion.div>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column' as const, gap: '40px' }}>
        {story.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} style={{ display: 'flex', flexDirection: i % 2 === 0 ? 'row' : 'row-reverse', gap: '32px', alignItems: 'center', flexWrap: 'wrap', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', overflow: 'hidden' }}>
            {item.image && (
              <div style={{ flex: '1 1 300px', padding: '8px', borderRight: i % 2 === 0 ? '1px solid hsl(var(--border))' : 'none', borderLeft: i % 2 === 0 ? 'none' : '1px solid hsl(var(--border))' }}>
                <img src={item.image} alt={item.title} loading="lazy" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: '4px' }} />
              </div>
            )}
            <div style={{ flex: '1 1 300px', textAlign: 'center', padding: '24px' }}>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: 'hsl(var(--primary))', textTransform: 'uppercase' }}>{item.date}</span>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.8rem', color: 'hsl(var(--foreground))', margin: '8px 0 16px', fontWeight: 600 }}>{item.title}</h3>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: 'hsl(var(--foreground))', opacity: 0.8, lineHeight: 1.6 }}>{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};


// ======================== TIMELINE ========================
const Timeline = ({ events }: { events: TimelineEvent[] }) => {
  const iconMap: Record<string, React.ReactNode> = {
    heart: <Heart size={18} fill="currentColor" />, music: <Music size={18} />, star: <Star size={18} />,
    glass: <Wine size={18} />, utensils: <Utensils size={18} />, party: <Star size={18} />,
  };

  const S_section = { padding: '80px 20px', width: '100%', boxSizing: 'border-box' as const, background: 'hsl(var(--background))' };
  const S_centered = { textAlign: 'center' as const, width: '100%' };
  const S_sectionTitle = { fontFamily: "'Cinzel', 'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '600', letterSpacing: '0.08em', textAlign: 'center' as const, marginBottom: '0.5rem', color: 'hsl(var(--foreground))' };
  const S_sectionSubtitle = { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontStyle: 'italic', textAlign: 'center' as const, opacity: 0.7, marginBottom: '2.5rem', color: 'hsl(var(--foreground))' };
  const S_divider = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '16px auto 32px' };
  const S_dividerLine = { width: '80px', height: '1px', background: 'hsl(var(--primary))', opacity: 0.5 };

  const S_tItem = { background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column' as const, gap: '8px' };

  return (
    <section id="timeline" style={S_section}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={S_centered}>
        <h2 style={S_sectionTitle}>Event Schedule</h2>
        <div style={S_divider}>
          <div style={S_dividerLine} />
          <Heart size={14} color="hsl(var(--primary))" fill="hsl(var(--primary))" />
          <div style={S_dividerLine} />
        </div>
        <p style={S_sectionSubtitle}>A timeline of our special day</p>
      </motion.div>
      <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '20px 0' }}>
        {events.map((event, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '24px' }}>
            <div style={{ flexShrink: 0, width: '48px', height: '48px', borderRadius: '50%', background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {iconMap[event.icon || 'heart'] || <Clock size={20} />}
            </div>
            <div style={{ flex: 1, ...S_tItem }}>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: 'hsl(var(--primary))', textTransform: 'uppercase' }}>{event.time}</span>
              <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', fontWeight: 600, color: 'hsl(var(--foreground))', margin: '4px 0' }}>{event.title}</h4>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.9rem', color: 'hsl(var(--foreground))', opacity: 0.8, lineHeight: 1.6 }}>{event.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};


// ======================== LOCATION ========================
const Location = ({ venue }: { venue: WeddingData['venue'] }) => {
  const S_section = { padding: '80px 20px', width: '100%', boxSizing: 'border-box' as const, background: 'hsl(var(--background))' };
  const S_centered = { textAlign: 'center' as const, width: '100%' };
  const S_sectionTitle = { fontFamily: "'Cinzel', 'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '600', letterSpacing: '0.08em', textAlign: 'center' as const, marginBottom: '0.5rem', color: 'hsl(var(--foreground))' };
  const S_sectionSubtitle = { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontStyle: 'italic', textAlign: 'center' as const, opacity: 0.7, marginBottom: '2.5rem', color: 'hsl(var(--foreground))' };
  const S_divider = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '16px auto 32px' };
  const S_dividerLine = { width: '80px', height: '1px', background: 'hsl(var(--primary))', opacity: 0.5 };

  return (
    <section id="location" style={S_section}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={S_centered}>
        <h2 style={S_sectionTitle}>Wedding Venue</h2>
        <div style={S_divider}>
          <div style={S_dividerLine} />
          <Heart size={14} color="hsl(var(--primary))" fill="hsl(var(--primary))" />
          <div style={S_dividerLine} />
        </div>
        <p style={S_sectionSubtitle}>Where our journey begins</p>
      </motion.div>
      <div style={{ maxWidth: '800px', margin: '0 auto', border: '1px solid hsl(var(--border))', borderRadius: '8px', overflow: 'hidden', background: 'hsl(var(--background))' }}>
        <div style={{ width: '100%', aspectRatio: '16/9' }}>
          <iframe src={venue.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Wedding venue map" />
        </div>
        <div style={{ padding: '32px 24px', textAlign: 'center' }}>
          <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.5rem', fontWeight: 600, color: 'hsl(var(--foreground))', marginBottom: '8px' }}>{venue.name}</h3>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.9rem', color: 'hsl(var(--foreground))', opacity: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
            <MapPin size={16} color="hsl(var(--primary))" /> {venue.address}
          </p>
          <a href={venue.mapUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '8px', background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', fontFamily: "'Montserrat', sans-serif", fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', transition: 'opacity 0.2s' }}>
            <ExternalLink size={16} /> Open in Maps
          </a>
        </div>
      </div>
    </section>
  );
};


// ======================== TELEGRAM CTA ========================
const TelegramCTA = ({ link }: { link: string }) => {
  const S_section = { padding: '80px 20px', width: '100%', boxSizing: 'border-box' as const, background: 'hsl(var(--background))' };
  const S_centered = { textAlign: 'center' as const, width: '100%' };
  const S_sectionTitle = { fontFamily: "'Cinzel', 'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '600', letterSpacing: '0.08em', textAlign: 'center' as const, marginBottom: '0.5rem', color: 'hsl(var(--foreground))' };
  const S_sectionSubtitle = { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontStyle: 'italic', textAlign: 'center' as const, opacity: 0.7, marginBottom: '2.5rem', color: 'hsl(var(--foreground))' };
  const S_divider = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '16px auto 32px' };
  const S_dividerLine = { width: '80px', height: '1px', background: 'hsl(var(--primary))', opacity: 0.5 };

  return (
    <section id="telegram" style={S_section}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={S_centered}>
        <Send size={32} color="hsl(var(--primary))" style={{ margin: '0 auto 16px' }} />
        <h2 style={S_sectionTitle}>Join Our Telegram</h2>
        <div style={S_divider}>
          <div style={S_dividerLine} />
          <Heart size={14} color="hsl(var(--primary))" fill="hsl(var(--primary))" />
          <div style={S_dividerLine} />
        </div>
        <p style={{ ...S_sectionSubtitle, maxWidth: '500px', margin: '0 auto 32px' }}>Stay updated with real-time wedding announcements and connect with other guests.</p>
        <a href={link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', borderRadius: '8px', background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', fontFamily: "'Montserrat', sans-serif", fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', transition: 'opacity 0.2s', margin: '0 auto' }}>
          <Send size={16} /> Open Telegram Bot
        </a>
      </motion.div>
    </section>
  );
};


// ======================== MUSIC TOGGLE ========================
const MusicToggle = ({ musicUrl }: { musicUrl: string }) => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      playing ? audioRef.current.play().catch(() => setPlaying(false)) : audioRef.current.pause();
    }
  }, [playing]);

  if (!musicUrl) return null;

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop />
      <button onClick={() => setPlaying(!playing)} className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full gold-gradient-bg text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform" aria-label={playing ? 'Mute music' : 'Play music'}>
        {playing ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </>
  );
};


// ======================== WEDDING PARTY ========================
const WeddingParty = ({ bridesmaids, groomsmen }: { bridesmaids: PartyMember[]; groomsmen: PartyMember[] }) => {
  const S_section = { padding: '80px 20px', width: '100%', boxSizing: 'border-box' as const, background: 'hsl(var(--background))' };
  const S_centered = { textAlign: 'center' as const, width: '100%' };
  const S_sectionTitle = { fontFamily: "'Cinzel', 'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '600', letterSpacing: '0.08em', textAlign: 'center' as const, marginBottom: '0.5rem', color: 'hsl(var(--foreground))' };
  const S_sectionSubtitle = { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontStyle: 'italic', textAlign: 'center' as const, opacity: 0.7, marginBottom: '2.5rem', color: 'hsl(var(--foreground))' };
  const S_divider = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '16px auto 32px' };
  const S_dividerLine = { width: '80px', height: '1px', background: 'hsl(var(--primary))', opacity: 0.5 };

  return (
    <section id="wedding-party" style={S_section}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={S_centered}>
        <h2 style={S_sectionTitle}>Wedding Party</h2>
        <div style={S_divider}>
          <div style={S_dividerLine} />
          <Heart size={14} color="hsl(var(--primary))" fill="hsl(var(--primary))" />
          <div style={S_dividerLine} />
        </div>
        <p style={S_sectionSubtitle}>The people who make it all special</p>
      </motion.div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column' as const, gap: '60px' }}>
        <div>
          <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.5rem', textAlign: 'center', color: 'hsl(var(--primary))', marginBottom: '32px', fontWeight: 600 }}>Bridesmaids</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {bridesmaids.map((person, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', padding: '32px 20px', textAlign: 'center' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 20px', overflow: 'hidden', border: '1px solid hsl(var(--primary))', padding: '4px' }}>
                  <img src={person.image} alt={person.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                </div>
                <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', color: 'hsl(var(--foreground))', fontWeight: 600 }}>{person.name}</h4>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: 'hsl(var(--primary))', textTransform: 'uppercase', margin: '8px 0 16px' }}>{person.role}</p>
                {person.message && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: 'hsl(var(--foreground))', opacity: 0.8, fontStyle: 'italic' }}>"{person.message}"</p>}
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.5rem', textAlign: 'center', color: 'hsl(var(--primary))', marginBottom: '32px', fontWeight: 600 }}>Groomsmen</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {groomsmen.map((person, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', padding: '32px 20px', textAlign: 'center' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 20px', overflow: 'hidden', border: '1px solid hsl(var(--primary))', padding: '4px' }}>
                  <img src={person.image} alt={person.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                </div>
                <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', color: 'hsl(var(--foreground))', fontWeight: 600 }}>{person.name}</h4>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: 'hsl(var(--primary))', textTransform: 'uppercase', margin: '8px 0 16px' }}>{person.role}</p>
                {person.message && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: 'hsl(var(--foreground))', opacity: 0.8, fontStyle: 'italic' }}>"{person.message}"</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};


// ======================== BLESSINGS ========================
const Blessings = ({ blessings }: { blessings: Blessing[] }) => {
  const S_section = { padding: '80px 20px', width: '100%', boxSizing: 'border-box' as const, background: 'hsl(var(--background))' };
  const S_centered = { textAlign: 'center' as const, width: '100%' };
  const S_sectionTitle = { fontFamily: "'Cinzel', 'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '600', letterSpacing: '0.08em', textAlign: 'center' as const, marginBottom: '0.5rem', color: 'hsl(var(--foreground))' };
  const S_sectionSubtitle = { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontStyle: 'italic', textAlign: 'center' as const, opacity: 0.7, marginBottom: '2.5rem', color: 'hsl(var(--foreground))' };
  const S_divider = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '16px auto 32px' };
  const S_dividerLine = { width: '80px', height: '1px', background: 'hsl(var(--primary))', opacity: 0.5 };

  return (
    <section id="blessings" style={S_section}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={S_centered}>
        <h2 style={S_sectionTitle}>Blessings & Wishes</h2>
        <div style={S_divider}>
          <div style={S_dividerLine} />
          <Heart size={14} color="hsl(var(--primary))" fill="hsl(var(--primary))" />
          <div style={S_dividerLine} />
        </div>
        <p style={S_sectionSubtitle}>Words of love from those who care</p>
      </motion.div>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {blessings.map((b, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', padding: '32px', display: 'flex', flexDirection: 'column' as const }}>
            <Quote size={24} color="hsl(var(--primary))" style={{ opacity: 0.4, marginBottom: '16px' }} />
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontStyle: 'italic', color: 'hsl(var(--foreground))', lineHeight: 1.6, flex: 1 }}>"{b.message}"</p>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', color: 'hsl(var(--primary))', textTransform: 'uppercase', marginTop: '24px' }}>— {b.name}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};


// ======================== FAQ (Custom Accordion) ========================
const FAQAccordionItem = ({ item }: { item: FAQItem }) => {
  const [open, setOpen] = useState(false);

  const S_accordionItem = {
    background: 'hsl(var(--background))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    marginBottom: '12px',
    overflow: 'hidden' as const,
    fontFamily: "'Montserrat', sans-serif",
  };

  const S_accordionButton = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 20px',
    background: 'transparent',
    border: 'none',
    color: 'hsl(var(--foreground))',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'left' as const,
  };

  const S_accordionContent = {
    padding: '0 20px 20px',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '0.85rem',
    color: 'hsl(var(--foreground))',
    opacity: 0.8,
    lineHeight: 1.6,
  };

  return (
    <div style={S_accordionItem}>
      <button onClick={() => setOpen(!open)} style={S_accordionButton}>
        <span style={{ paddingRight: '16px' }}>{item.question}</span>
        <ChevronDown size={20} color="hsl(var(--primary))" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
            <p style={S_accordionContent}>{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = ({ items }: { items: FAQItem[] }) => {
  const S_section = { padding: '80px 20px', width: '100%', boxSizing: 'border-box' as const, background: 'hsl(var(--background))' };
  const S_centered = { textAlign: 'center' as const, width: '100%' };
  const S_sectionTitle = { fontFamily: "'Cinzel', 'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '600', letterSpacing: '0.08em', textAlign: 'center' as const, marginBottom: '0.5rem', color: 'hsl(var(--foreground))' };
  const S_sectionSubtitle = { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontStyle: 'italic', textAlign: 'center' as const, opacity: 0.7, marginBottom: '2.5rem', color: 'hsl(var(--foreground))' };
  const S_divider = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '16px auto 32px' };
  const S_dividerLine = { width: '80px', height: '1px', background: 'hsl(var(--primary))', opacity: 0.5 };

  return (
    <section id="faq" style={S_section}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={S_centered}>
        <h2 style={S_sectionTitle}>FAQ</h2>
        <div style={S_divider}>
          <div style={S_dividerLine} />
          <Heart size={14} color="hsl(var(--primary))" fill="hsl(var(--primary))" />
          <div style={S_dividerLine} />
        </div>
        <p style={S_sectionSubtitle}>Everything you need to know</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {items.map((item, i) => <FAQAccordionItem key={i} item={item} />)}
        </div>
      </motion.div>
    </section>
  );
};


// ======================== RSVP FORM ========================
const RSVPForm = () => {
  const [form, setForm] = useState<RSVPFormData>({ name: '', phone: '', attendance: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.attendance) { alert('Please fill in all required fields'); return; }
    setSubmitted(true);
  };

  const inputStyle = { width: '100%', padding: '12px 16px', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontFamily: "'Montserrat', sans-serif", fontSize: '0.9rem', background: 'hsl(var(--background))', color: 'hsl(var(--foreground))', boxSizing: 'border-box' as const, outline: 'none', transition: 'border-color 0.2s' };

  const S_section = { padding: '80px 20px', width: '100%', boxSizing: 'border-box' as const };
  const S_centered = { textAlign: 'center' as const, width: '100%' };
  const S_sectionTitle = { fontFamily: "'Cinzel', 'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '600', letterSpacing: '0.08em', textAlign: 'center' as const, marginBottom: '0.5rem', color: 'hsl(var(--foreground))' };
  const S_sectionSubtitle = { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontStyle: 'italic', textAlign: 'center' as const, opacity: 0.7, marginBottom: '2.5rem', color: 'hsl(var(--foreground))' };
  const S_divider = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '16px auto 32px' };
  const S_dividerLine = { width: '80px', height: '1px', background: 'hsl(var(--primary))', opacity: 0.5 };

  if (submitted) {
    return (
      <section id="rsvp" style={{ ...S_section, background: 'hsl(var(--background))' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '16px', padding: '60px 40px' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>💌</div>
          <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.8rem', marginBottom: '8px', color: 'hsl(var(--foreground))' }}>Thank You!</h3>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', color: 'hsl(var(--muted-foreground))', fontStyle: 'italic' }}>Your response has been recorded. We can't wait to celebrate with you!</p>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="rsvp" style={{ ...S_section, background: 'hsl(var(--background))' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={S_centered}>
        <h2 style={S_sectionTitle}>RSVP</h2>
        <div style={S_divider}><div style={S_dividerLine} /><Heart size={14} color="hsl(var(--primary))" fill="hsl(var(--primary))" /><div style={S_dividerLine} /></div>
        <p style={S_sectionSubtitle}>Kindly let us know if you'll be joining us</p>
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
              {(['attending', 'not-attending'] as const).map((opt) => (
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
const WeddingFooter = ({ bride, groom }: { bride: string; groom: string }) => (
  <footer style={{ padding: '60px 20px', textAlign: 'center', background: 'hsl(var(--primary))' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
      <div style={{ width: '60px', height: '1px', background: 'hsl(var(--primary-foreground))', opacity: 0.5 }} />
      <Heart size={14} color="hsl(var(--primary-foreground))" fill="hsl(var(--primary-foreground))" />
      <div style={{ width: '60px', height: '1px', background: 'hsl(var(--primary-foreground))', opacity: 0.5 }} />
    </div>
    <p style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', color: 'hsl(var(--primary-foreground))', marginBottom: '8px' }}>{bride} & {groom}</p>
    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: 'hsl(var(--primary-foreground))', opacity: 0.9, textTransform: 'uppercase' }}>Made with love</p>
  </footer>
);


// ======================== MAIN TEMPLATE ========================
const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Story', href: '#love-story' },
  { label: 'Schedule', href: '#timeline' },
  { label: 'Party', href: '#wedding-party' },
  { label: 'FAQ', href: '#faq' },
  { label: 'RSVP', href: '#rsvp' },
];

const ImperialTemplate = () => {
  const data = sampleWeddingData;
  return (
    <div id="template-root" className="theme-imperial text-foreground min-h-screen transition-colors duration-500" style={{ background: 'hsl(var(--background))' }}>
      <WeddingNav items={navItems} coupleNames={`${data.couple.bride} & ${data.couple.groom}`} />
      <ThemeToggle />
      {data.musicUrl && <MusicToggle musicUrl={data.musicUrl} />}
      <HeroSection bride={data.couple.bride} groom={data.couple.groom} date={data.date} backgroundImage={data.gallery[0]} variant="elegant" />
      <Countdown targetDate={data.date} />
      <div className="wedding-divider" />
      <AboutUs couple={data.couple} />
      <div className="wedding-divider" />
      {data.videoUrl && <VideoSection url={data.videoUrl} />}
      <div className="wedding-divider" />
      <Gallery images={data.gallery} columns={4} />
      <div className="wedding-divider" />
      <LoveStory story={data.story} />
      <div className="wedding-divider" />
      <Timeline events={data.timeline} />
      <div className="wedding-divider" />
      <Location venue={data.venue} />
      <div className="wedding-divider" />
      {data.telegramLink && <TelegramCTA link={data.telegramLink} />}
      <div className="wedding-divider" />
      <WeddingParty bridesmaids={data.bridesmaids} groomsmen={data.groomsmen} />
      <div className="wedding-divider" />
      <Blessings blessings={data.blessings} />
      <div className="wedding-divider" />
      <FAQ items={data.faq} />
      <div className="wedding-divider" />
      <RSVPForm />
      <div className="wedding-divider" />
      <section id="qr-entry" style={{ padding: '80px 20px', width: '100%', boxSizing: 'border-box', background: 'hsl(var(--background))' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', padding: '60px 40px' }}>
          <QrCode size={40} color="hsl(var(--primary))" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontFamily: "'Cinzel', 'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '600', letterSpacing: '0.08em', marginBottom: '8px', color: 'hsl(var(--foreground))' }}>Event Access</h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontStyle: 'italic', opacity: 0.7, marginBottom: '32px', color: 'hsl(var(--foreground))' }}>Show this QR code at the entrance for quick check-in</p>
          <div style={{ width: '200px', height: '200px', margin: '0 auto', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <QrCode size={140} color="hsl(var(--foreground))" style={{ opacity: 0.8 }} />
          </div>
        </motion.div>
      </section>
      <WeddingFooter bride={data.couple.bride} groom={data.couple.groom} />
    </div>
  );
};

export default ImperialTemplate;
