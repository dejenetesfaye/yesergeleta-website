/**
 * ElegantTemplate.tsx — Self-contained Elegant Wedding Invitation
 * 
 * Dependencies: react, framer-motion, lucide-react
 * Also requires the wedding CSS (see wedding-styles.css)
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Menu, X, ChevronLeft, ChevronRight, MapPin, ExternalLink, Sun, Moon, Quote, Music, Star, Clock, Wine, Utensils } from 'lucide-react';


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
    bridePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    groomPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
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
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800',
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
    { date: 'June 2020', title: 'First Meeting', description: 'We met at a coffee shop on a rainy afternoon.', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800' },
    { date: 'December 2021', title: 'First Trip Together', description: 'Our first vacation to Paris.', image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800' },
    { date: 'February 2025', title: 'The Proposal', description: 'On a starlit beach in Malibu, James got down on one knee.', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800' },
  ],
  bridesmaids: [
    { name: 'Sophia Chen', role: 'Maid of Honor', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', message: 'My best friend deserves all the happiness!' },
    { name: 'Isabella Martinez', role: 'Bridesmaid', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', message: 'So honored to stand by your side.' },
    { name: 'Charlotte Williams', role: 'Bridesmaid', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', message: 'Love you both so much!' },
  ],
  groomsmen: [
    { name: 'Ethan Park', role: 'Best Man', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', message: 'Brothers for life!' },
    { name: 'Liam Johnson', role: 'Groomsman', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', message: "Couldn't be happier for you two!" },
    { name: 'Noah Davis', role: 'Groomsman', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', message: "Here's to forever!" },
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
const ThemeToggle = ({ defaultDark = false }: { defaultDark?: boolean }) => {
  const [dark, setDark] = useState(defaultDark);

  useEffect(() => {
    const root = document.getElementById('template-root');
    if (!root) return;
    if (defaultDark) {
      dark ? root.classList.remove('light') : root.classList.add('light');
    } else {
      dark ? root.classList.add('dark') : root.classList.remove('dark');
    }
  }, [dark, defaultDark]);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={() => setDark(!dark)}
      className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
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
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#hero" className="font-display text-lg text-foreground">{coupleNames}</a>
        <div className="hidden md:flex items-center gap-6">
          {items.map((item) => (
            <a key={item.href} href={item.href} className="font-sans text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition">{item.label}</a>
          ))}
        </div>
        <button className="md:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-background/95 backdrop-blur-md border-t border-border overflow-hidden">
            <div className="px-4 py-4 space-y-3">
              {items.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="block font-sans text-sm text-muted-foreground hover:text-primary transition py-2">{item.label}</a>
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
  const overlayClass = variant === 'dark' || variant === 'cinematic' ? 'bg-gradient-to-b from-black/70 via-black/50 to-black/80' : 'bg-gradient-to-b from-black/30 via-black/20 to-black/50';

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={backgroundImage} alt="Wedding" className="w-full h-full object-cover" />
        <div className={`absolute inset-0 ${overlayClass}`} />
      </div>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="relative z-10 text-center px-4">
        <p className="font-sans text-xs md:text-sm uppercase tracking-[0.3em] text-cream/80 mb-4">We're Getting Married</p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-cream mb-2">{bride}</h1>
        <div className="flex items-center justify-center gap-4 my-3">
          <div className="w-16 h-px bg-primary/60" />
          <Heart size={20} className="text-primary" fill="currentColor" />
          <div className="w-16 h-px bg-primary/60" />
        </div>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-cream">{groom}</h1>
        <p className="font-serif text-lg md:text-xl text-cream/80 mt-6 italic">{formattedDate}</p>
        <motion.a href="#countdown" whileHover={{ scale: 1.05 }} className="inline-block mt-8 px-8 py-3 rounded-full border border-primary/50 text-cream font-sans text-xs uppercase tracking-widest hover:bg-primary/20 transition">Scroll Down</motion.a>
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

  return (
    <section className="wedding-section" id="countdown">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center">
        <h2 className="wedding-section-title">Save the Date</h2>
        <p className="wedding-section-subtitle">Counting down to our forever</p>
        <div className="flex justify-center gap-4 md:gap-8">
          {units.map((unit) => (
            <div key={unit.label} className="flex flex-col items-center">
              <div className="glass-card w-20 h-20 md:w-28 md:h-28 flex items-center justify-center mb-2">
                <span className="font-display text-3xl md:text-5xl font-bold text-primary">{String(unit.value).padStart(2, '0')}</span>
              </div>
              <span className="font-sans text-xs md:text-sm uppercase tracking-widest text-muted-foreground">{unit.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};


// ======================== GALLERY ========================
const Gallery = ({ images, columns = 3 }: { images: string[]; columns?: 2 | 3 | 4 }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const colClass = columns === 2 ? 'grid-cols-2' : columns === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3';

  const navigate = (dir: number) => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + dir + images.length) % images.length);
  };

  return (
    <section className="wedding-section" id="gallery">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <h2 className="wedding-section-title">Our Gallery</h2>
        <p className="wedding-section-subtitle">Moments captured in time</p>
        <div className={`grid ${colClass} gap-3 md:gap-4 max-w-5xl mx-auto`}>
          {images.map((img, i) => (
            <motion.div key={i} whileHover={{ scale: 1.03 }} className="cursor-pointer overflow-hidden rounded-lg aspect-square" onClick={() => setSelectedIndex(i)}>
              <img src={img} alt={`Gallery ${i + 1}`} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
            </motion.div>
          ))}
        </div>
      </motion.div>
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedIndex(null)}>
            <button onClick={() => setSelectedIndex(null)} className="absolute top-4 right-4 text-white/80 hover:text-white"><X size={32} /></button>
            <button onClick={(e) => { e.stopPropagation(); navigate(-1); }} className="absolute left-4 text-white/80 hover:text-white"><ChevronLeft size={40} /></button>
            <button onClick={(e) => { e.stopPropagation(); navigate(1); }} className="absolute right-4 text-white/80 hover:text-white"><ChevronRight size={40} /></button>
            <motion.img key={selectedIndex} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} src={images[selectedIndex]} alt="Full size" className="max-w-full max-h-[85vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};


// ======================== LOCATION ========================
const Location = ({ venue }: { venue: WeddingData['venue'] }) => (
  <section className="wedding-section" id="location">
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
      <h2 className="wedding-section-title">Wedding Venue</h2>
      <p className="wedding-section-subtitle">Where our journey begins</p>
      <div className="max-w-4xl mx-auto glass-card overflow-hidden">
        <div className="aspect-video w-full">
          <iframe src={venue.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Wedding venue map" />
        </div>
        <div className="p-6 md:p-8 text-center">
          <h3 className="font-display text-xl md:text-2xl mb-2 text-foreground">{venue.name}</h3>
          <p className="text-muted-foreground font-sans text-sm flex items-center justify-center gap-2 mb-4">
            <MapPin size={16} className="text-primary" /> {venue.address}
          </p>
          <a href={venue.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg gold-gradient-bg text-primary-foreground font-sans text-sm font-medium hover:opacity-90 transition">
            <ExternalLink size={16} /> Open in Maps
          </a>
        </div>
      </div>
    </motion.div>
  </section>
);


// ======================== TIMELINE ========================
const Timeline = ({ events }: { events: TimelineEvent[] }) => {
  const iconMap: Record<string, React.ReactNode> = {
    heart: <Heart size={18} />, music: <Music size={18} />, star: <Star size={18} />,
    glass: <Wine size={18} />, utensils: <Utensils size={18} />, party: <Star size={18} />,
  };
  return (
    <section className="wedding-section" id="timeline">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <h2 className="wedding-section-title">Event Schedule</h2>
        <p className="wedding-section-subtitle">A timeline of our special day</p>
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-primary/30" />
          {events.map((event, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className={`relative flex items-start mb-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <div className="hidden md:block md:w-1/2" />
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full gold-gradient-bg flex items-center justify-center text-primary-foreground z-10 shadow-lg">
                {iconMap[event.icon || 'heart'] || <Clock size={18} />}
              </div>
              <div className={`ml-20 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-10' : 'md:pl-10'}`}>
                <div className="glass-card p-5">
                  <span className="text-primary font-sans text-xs font-semibold uppercase tracking-widest">{event.time}</span>
                  <h4 className="font-display text-lg mt-1 text-foreground">{event.title}</h4>
                  <p className="text-muted-foreground font-sans text-sm mt-1">{event.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};


// ======================== WEDDING PARTY ========================
const WeddingParty = ({ bridesmaids, groomsmen }: { bridesmaids: PartyMember[]; groomsmen: PartyMember[] }) => (
  <section className="wedding-section" id="wedding-party">
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
      <h2 className="wedding-section-title">Wedding Party</h2>
      <p className="wedding-section-subtitle">The people who make it all special</p>
      <div className="max-w-5xl mx-auto">
        <h3 className="font-serif text-xl text-center text-primary mb-6 italic">Bridesmaids</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {bridesmaids.map((person, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-6 text-center">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-2 border-primary/30">
                <img src={person.image} alt={person.name} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <h4 className="font-display text-lg text-foreground">{person.name}</h4>
              <p className="text-primary font-sans text-xs uppercase tracking-widest mt-1">{person.role}</p>
              {person.message && <p className="text-muted-foreground font-serif text-sm mt-3 italic">"{person.message}"</p>}
            </motion.div>
          ))}
        </div>
        <h3 className="font-serif text-xl text-center text-primary mb-6 italic">Groomsmen</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {groomsmen.map((person, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-6 text-center">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-2 border-primary/30">
                <img src={person.image} alt={person.name} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <h4 className="font-display text-lg text-foreground">{person.name}</h4>
              <p className="text-primary font-sans text-xs uppercase tracking-widest mt-1">{person.role}</p>
              {person.message && <p className="text-muted-foreground font-serif text-sm mt-3 italic">"{person.message}"</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  </section>
);


// ======================== BLESSINGS ========================
const Blessings = ({ blessings }: { blessings: Blessing[] }) => (
  <section className="wedding-section" id="blessings">
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
      <h2 className="wedding-section-title">Blessings & Wishes</h2>
      <p className="wedding-section-subtitle">Words of love from those who care</p>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
        {blessings.map((b, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-6">
            <Quote size={20} className="text-primary/40 mb-2" />
            <p className="font-serif text-base italic text-foreground leading-relaxed">"{b.message}"</p>
            <p className="font-sans text-sm font-medium text-primary mt-4">— {b.name}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </section>
);


// ======================== RSVP FORM ========================
const RSVPForm = () => {
  const [form, setForm] = useState<RSVPFormData>({ name: '', phone: '', attendance: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.attendance) { alert('Please fill in all required fields'); return; }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="wedding-section" id="rsvp">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center glass-card p-12">
          <div className="text-5xl mb-4">💌</div>
          <h3 className="font-display text-2xl mb-2 text-foreground">Thank You!</h3>
          <p className="text-muted-foreground font-serif text-lg">Your response has been recorded. We can't wait to celebrate with you!</p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="wedding-section" id="rsvp">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <h2 className="wedding-section-title">RSVP</h2>
        <p className="wedding-section-subtitle">Kindly let us know if you'll be joining us</p>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-5">
          <div>
            <label className="block font-sans text-sm font-medium mb-1.5 text-foreground">Full Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition font-sans text-foreground" placeholder="Your full name" />
          </div>
          <div>
            <label className="block font-sans text-sm font-medium mb-1.5 text-foreground">Phone Number *</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition font-sans text-foreground" placeholder="Your phone number" />
          </div>
          <div>
            <label className="block font-sans text-sm font-medium mb-1.5 text-foreground">Will you attend? *</label>
            <div className="flex gap-3">
              {(['attending', 'not-attending'] as const).map((opt) => (
                <button key={opt} type="button" onClick={() => setForm({ ...form, attendance: opt })} className={`flex-1 py-3 rounded-lg border transition font-sans text-sm ${form.attendance === opt ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-foreground hover:border-primary/50'}`}>
                  {opt === 'attending' ? '🎉 Joyfully Accept' : '😔 Regretfully Decline'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-sans text-sm font-medium mb-1.5 text-foreground">Message (optional)</label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition font-sans text-foreground resize-none" rows={3} placeholder="A few words for the couple..." />
          </div>
          <button type="submit" className="w-full py-3.5 rounded-lg gold-gradient-bg text-primary-foreground font-sans font-semibold tracking-wide uppercase text-sm hover:opacity-90 transition">Send RSVP</button>
        </form>
      </motion.div>
    </section>
  );
};


// ======================== FOOTER ========================
const WeddingFooter = ({ bride, groom }: { bride: string; groom: string }) => (
  <footer className="py-12 text-center border-t border-border/30">
    <div className="flex items-center justify-center gap-2 mb-3">
      <div className="w-12 h-px bg-primary/40" />
      <Heart size={14} className="text-primary" fill="currentColor" />
      <div className="w-12 h-px bg-primary/40" />
    </div>
    <p className="font-display text-xl text-foreground">{bride} & {groom}</p>
    <p className="font-sans text-xs text-muted-foreground mt-2 uppercase tracking-widest">Made with love</p>
  </footer>
);


// ======================== MAIN TEMPLATE ========================
const navItems = [
  { label: 'Gallery', href: '#gallery' },
  { label: 'Schedule', href: '#timeline' },
  { label: 'Party', href: '#wedding-party' },
  { label: 'Wishes', href: '#blessings' },
  { label: 'RSVP', href: '#rsvp' },
];

const ElegantTemplate = () => {
  const data = sampleWeddingData;
  return (
    <div id="template-root" className="theme-elegant bg-background text-foreground min-h-screen transition-colors duration-500">
      <WeddingNav items={navItems} coupleNames={`${data.couple.bride} & ${data.couple.groom}`} />
      <ThemeToggle defaultDark={false} />
      <HeroSection bride={data.couple.bride} groom={data.couple.groom} date={data.date} backgroundImage={data.gallery[0]} variant="elegant" />
      <Countdown targetDate={data.date} />
      <div className="wedding-divider" />
      <Gallery images={data.gallery} columns={3} />
      <div className="wedding-divider" />
      <Timeline events={data.timeline} />
      <div className="wedding-divider" />
      <Location venue={data.venue} />
      <div className="wedding-divider" />
      <WeddingParty bridesmaids={data.bridesmaids} groomsmen={data.groomsmen} />
      <div className="wedding-divider" />
      <Blessings blessings={data.blessings} />
      <div className="wedding-divider" />
      <RSVPForm />
      <WeddingFooter bride={data.couple.bride} groom={data.couple.groom} />
    </div>
  );
};

export default ElegantTemplate;
