/**
 * GracefulTemplate.tsx — Self-contained "Graceful" Wedding Invitation
 * 
 * Features: Oval Hero portrait, Heart-shaped parents section, 
 * alternating Oval journey timeline, and floral gold aesthetic.
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Menu, X, ChevronLeft, ChevronRight, ChevronDown, MapPin, ExternalLink, Sun, Moon, Quote, Music, Star, Clock, Wine, Utensils, Send, QrCode, Volume2, VolumeX, Play } from 'lucide-react';

// ======================== TYPES ========================
interface WeddingData {
  couple: {
    bride: string;
    groom: string;
    heroPhoto: string;
    couplePhoto?: string;
  };
  parents: {
    photo: string;
    brideParents: string;
    groomParents: string;
  };
  date: string;
  venue: { name: string; address: string; mapUrl: string; mapEmbedUrl: string };
  gallery: string[];
  timeline: { time: string; title: string; description: string; icon?: string }[];
  story: { date: string; title: string; description: string; image: string }[];
  bridesmaids: { name: string; role: string; image: string; message?: string }[];
  groomsmen: { name: string; role: string; image: string; message?: string }[];
  videoUrl?: string;
  rsvpBg: string;
}

// ======================== COMPONENTS ========================

const GracefulNav = ({ bride, groom }: { bride: string; groom: string }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const items = [
    { label: 'Save the Date', href: '#hero' },
    { label: 'Parents', href: '#parents' },
    { label: 'Our Journey', href: '#story' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'RSVP', href: '#rsvp' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#hero" className="text-2xl font-display italic text-primary">{bride} & {groom}</a>
        <div className="hidden md:flex gap-8">
          {items.map(item => (
            <a key={item.href} href={item.href} className="text-xs uppercase tracking-widest font-sans font-bold text-muted-foreground hover:text-primary transition-colors">{item.label}</a>
          ))}
        </div>
        <button className="md:hidden text-primary" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="md:hidden bg-white border-t border-border">
            {items.map(item => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="block px-6 py-4 text-sm font-sans font-bold uppercase tracking-widest border-b border-border/50 text-center">{item.label}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const GracefulHero = ({ bride, groom, date, photo }: { bride: string; groom: string; date: string; photo: string }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(date).getTime() - Date.now();
      if (diff <= 0) return clearInterval(timer);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [date]);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 bg-cream/30">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center z-10 w-full px-6">
        <p className="font-display italic text-3xl md:text-4xl text-primary mb-2">Save the Date</p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-foreground mb-4">{bride} & {groom}</h1>
        <p className="text-xl md:text-2xl font-serif italic text-muted-foreground mb-12">12 . 06 . 2026</p>
        
        <div className="relative mx-auto w-[280px] h-[400px] md:w-[320px] md:h-[460px] group">
          <div className="absolute inset-0 rounded-[160px] border-2 border-primary/20 -m-2 group-hover:scale-105 transition-transform duration-700"></div>
          <div className="w-full h-full rounded-[160px] overflow-hidden border-4 border-white shadow-2xl">
            <img src={photo} alt="Couple" className="w-full h-full object-cover" />
          </div>
          {/* Floral Decoration Placeholder - in a real app these would be SVG or specific PNGs */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 opacity-90 animate-pulse">
             <div className="text-pink-400">🌸</div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-4 gap-4 md:gap-8 max-w-lg mx-auto">
          {[
            { v: timeLeft.days, l: 'Days' },
            { v: timeLeft.hours, l: 'Hours' },
            { v: timeLeft.mins, l: 'Mins' },
            { v: timeLeft.secs, l: 'Secs' },
          ].map(u => (
            <div key={u.l} className="text-center">
              <span className="block text-3xl md:text-4xl font-display font-bold text-primary">{u.v}</span>
              <span className="text-[10px] uppercase tracking-widest font-sans font-bold text-muted-foreground">{u.l}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

const GracefulParents = ({ brideParents, groomParents, photo }: { brideParents: string; groomParents: string; photo: string }) => {
  return (
    <section id="parents" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-12">Parents of the Bride & Groom</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          <div className="flex-1 text-center md:text-right">
            <h3 className="text-2xl font-display italic text-primary mb-2">{brideParents}</h3>
            <p className="text-xs uppercase tracking-widest font-sans text-muted-foreground">Parents of the Bride</p>
          </div>
          
          <div className="relative w-64 h-64 shrink-0">
             <motion.div 
               whileHover={{ scale: 1.05 }}
               style={{ clipPath: 'path("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")' }}
               className="w-full h-full bg-primary/10 p-2 overflow-hidden"
             >
                <div 
                  style={{ clipPath: 'path("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")' }}
                  className="w-full h-full"
                >
                  <img src={photo} className="w-full h-full object-cover scale-[13]" alt="Parents" />
                </div>
             </motion.div>
             <div className="absolute inset-0 border-2 border-primary/20 pointer-events-none" style={{ clipPath: 'path("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z") scale(1.05)' }}></div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-display italic text-primary mb-2">{groomParents}</h3>
            <p className="text-xs uppercase tracking-widest font-sans text-muted-foreground">Parents of the Groom</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const GracefulJourney = ({ story }: { story: WeddingData['story'] }) => {
  return (
    <section id="story" className="py-24 bg-cream/10">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-6xl font-display font-bold text-center mb-20 italic">Our Journey</h2>
        <div className="max-w-4xl mx-auto space-y-24">
          {story.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="w-64 h-80 rounded-[120px] overflow-hidden border-4 border-white shadow-xl bg-muted shrink-0 rotate-3 group-hover:rotate-0 transition-transform">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="text-center md:text-left">
                <span className="text-xs uppercase font-sans font-bold tracking-[.3em] text-primary/60 mb-2 block">{item.date}</span>
                <h3 className="text-3xl font-display font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground font-serif text-lg leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const GracefulRSVP = ({ backgroundImage }: { backgroundImage: string }) => {
  return (
    <section id="rsvp" className="relative py-32 flex items-center justify-center overflow-hidden min-h-[600px]">
      <div className="absolute inset-0">
        <img src={backgroundImage} className="w-full h-full object-cover" alt="RSVP background" />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative z-10 w-full max-w-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-12 rounded-2xl text-center text-white"
      >
        <Heart size={40} className="mx-auto text-primary mb-6" fill="currentColor" />
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Are You Joining Us?</h2>
        <p className="text-lg font-serif italic mb-10 text-white/80">Please let us know your presence by June 1, 2026</p>
        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6 text-left">
             <div className="space-y-2">
               <label className="text-xs font-sans uppercase font-bold tracking-widest text-white/50">Full Name</label>
               <input type="text" className="w-full bg-white/5 border border-white/20 rounded-lg p-4 focus:border-primary outline-none text-white" placeholder="Enter your name" />
             </div>
             <div className="space-y-2">
               <label className="text-xs font-sans uppercase font-bold tracking-widest text-white/50">Attendance</label>
               <select className="w-full bg-white/5 border border-white/20 rounded-lg p-4 focus:border-primary outline-none text-white appearance-none">
                 <option value="yes" className="text-charcoal">Yes, I'll be there</option>
                 <option value="no" className="text-charcoal">Sorry, I can't</option>
               </select>
             </div>
          </div>
          <button className="w-full py-5 bg-primary text-white font-sans font-bold uppercase tracking-widest rounded-lg hover:bg-gold-light transition-colors mt-8">Submit Reservation</button>
        </form>
      </motion.div>
    </section>
  );
};

// ======================== MAIN TEMPLATE ========================

const GracefulTemplate = ({ data }: { data: WeddingData }) => {
  const [dark, setDark] = useState(false);

  return (
    <div id="graceful-root" className={`min-h-screen font-serif transition-colors duration-500 ${dark ? 'dark' : ''}`}>
       <div className={`${dark ? 'bg-[#121212] text-white' : 'bg-white text-charcoal'}`}>
        <GracefulNav bride={data.couple.bride} groom={data.couple.groom} />
        
        <GracefulHero bride={data.couple.bride} groom={data.couple.groom} date={data.date} photo={data.couple.heroPhoto} />
        
        <GracefulParents brideParents={data.parents.brideParents} groomParents={data.parents.groomParents} photo={data.parents.photo} />
        
        <section className="relative h-[500px] flex items-center justify-center bg-muted">
           <img src={data.couple.couplePhoto || data.rsvpBg} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Video cover" />
           <div className="absolute inset-0 bg-black/30"></div>
           <motion.button 
             whileHover={{ scale: 1.1 }}
             className="relative z-10 w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center group"
           >
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl group-hover:bg-gold-light transition-colors">
                <Play size={28} fill="currentColor" className="ml-1" />
              </div>
           </motion.button>
        </section>

        <GracefulJourney story={data.story} />

        <section id="gallery" className="py-24 px-6 bg-white">
          <div className="container mx-auto">
             <h2 className="text-3xl md:text-5xl font-display font-bold text-center mb-16">Moments of Love</h2>
             <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {data.gallery.map((img, i) => (
                  <motion.div key={i} whileHover={{ y: -8 }} className="break-inside-avoid rounded-xl overflow-hidden border border-border shadow-md">
                    <img src={img} alt={`Gallery ${i}`} className="w-full h-auto" />
                  </motion.div>
                ))}
             </div>
          </div>
        </section>

        <GracefulRSVP backgroundImage={data.rsvpBg} />

        <section className="py-24 bg-cream/30 text-center px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-display italic font-bold text-primary">Join us on our special day</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 text-muted-foreground p-12 border border-primary/20 rounded-2xl bg-white/50 backdrop-blur-sm">
               <div className="space-y-4">
                 <h4 className="text-xl font-display font-bold text-foreground">Gift Registry</h4>
                 <p className="text-sm">Your presence is our best gift, but if you wish to contribute...</p>
                 <button className="px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-colors uppercase text-xs font-bold tracking-widest rounded-full">View Registry</button>
               </div>
               <div className="w-px h-24 bg-primary/20 hidden md:block"></div>
               <div className="space-y-4">
                 <h4 className="text-xl font-display font-bold text-foreground">Wedding Music</h4>
                 <p className="text-sm">We've curated a special playlist for the evening.</p>
                 <button className="px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-colors uppercase text-xs font-bold tracking-widest rounded-full">Explore Playlist</button>
               </div>
            </div>
          </motion.div>
        </section>

        <footer className="py-12 border-t border-border/50 text-center text-muted-foreground text-xs uppercase tracking-widest font-sans font-bold">
           <div className="container mx-auto px-6">
             <p className="mb-4">Sophia & Oliver • 12.06.2026</p>
             <p className="opacity-50 tracking-[.5em]">Luxe Minimal Template</p>
           </div>
        </footer>

        <button 
          onClick={() => setDark(!dark)}
          className="fixed bottom-6 left-6 z-[60] w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all bg-primary text-white"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
       </div>
    </div>
  );
};

export default GracefulTemplate;
