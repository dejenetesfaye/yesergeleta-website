import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sun, Moon, MapPin, Music, Volume2, VolumeX, ChevronDown, ChevronUp, Send, QrCode, Play, Pause } from 'lucide-react';

/* ─── COLOUR PALETTE ─── */
const P = {
  bg:     '#FDF6EC', bgD:   '#1A1004',
  card:   '#FFF8F0', cardD: '#251A0A',
  pri:    '#8B5E3C', priD:  '#D4A76A',
  acc:    '#C4826A', accD:  '#E8A080',
  txt:    '#3D2314', txtD:  '#F5E6CE',
  mut:    '#8B6F5A', mutD:  '#9E8068',
  bdr:    '#E8D5B7', bdrD:  '#4A3520',
  gold:   '#C8A97E',
};

function useCountdown(target) {
  const [t, setT] = useState({ d:0,h:0,m:0,s:0 });
  useEffect(()=>{
    const id = setInterval(()=>{
      const diff = new Date(target)-Date.now();
      if(diff<=0) return;
      setT({ d:Math.floor(diff/86400000), h:Math.floor(diff/3600000%24), m:Math.floor(diff/60000%60), s:Math.floor(diff/1000%60) });
    },1000);
    return ()=>clearInterval(id);
  },[target]);
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
      <audio ref={ref} loop muted={mute} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
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
    <div style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'center', margin:'18px 0' }}>
      <div style={{ flex:1, maxWidth:80, height:1, background:`linear-gradient(to right,transparent,${gold})` }}/>
      <div style={{ width:6,height:6, background:gold, transform:'rotate(45deg)' }}/>
      <Heart size={13} fill={gold} color={gold}/>
      <div style={{ width:6,height:6, background:gold, transform:'rotate(45deg)' }}/>
      <div style={{ flex:1, maxWidth:80, height:1, background:`linear-gradient(to left,transparent,${gold})` }}/>
    </div>
  );
}

/* ─── FAQ ACCORDION ─── */
function FAQ({ dark }) {
  const [open, setOpen] = useState(null);
  const bg  = dark ? P.bgD  : P.bg;
  const card= dark ? P.cardD: P.card;
  const pri = dark ? P.priD : P.pri;
  const bdr = dark ? P.bdrD : P.bdr;
  const txt = dark ? P.txtD : P.txt;
  const mut = dark ? P.mutD : P.mut;
  const items = [
    { q:'Is there a dress code?', a:'We request smart-casual or semi-formal attire. Feel free to wear floral or nature-inspired colours in the spirit of our vintage garden theme.' },
    { q:'Can I bring children?', a:'We warmly welcome children at the ceremony. For the evening reception, we ask that little ones be put to bed by 9 PM so the adults can dance freely!' },
    { q:'Is parking available?', a:'Yes, complimentary parking is available at The Garden Pavilion. There is also a shuttle service running from Highland Square every 30 minutes.' },
    { q:'What if I have dietary restrictions?', a:'Please note any dietary requirements in your RSVP form. We have vegetarian, vegan, and gluten-free options available.' },
    { q:'Will there be a gift registry?', a:'Your presence is the greatest gift. If you wish, we have a small registry at The Garden Gift Shop — details on the RSVP confirmation.' },
    { q:'Can I share photos on social media?', a:`Absolutely! Please use the hashtag #MiaAndLeo2026 to share your memories. We'd love to see your photos!` },
  ];
  return (
    <section style={{ padding:'80px 24px', background: dark?'#1E1408':'#FFFBF5' }}>
      <div style={{ maxWidth:720, margin:'0 auto' }}>
        <p style={{ fontFamily:"'Bellefair',serif", fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.3em', color:P.gold, marginBottom:8, textAlign:'center' }}>Questions & Answers</p>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2.2rem', fontStyle:'italic', color:pri, marginBottom:8, textAlign:'center' }}>Frequently Asked</h2>
        <OrnDivider gold={P.gold}/>
        <div style={{ marginTop:24, display:'flex', flexDirection:'column', gap:8 }}>
          {items.map((item,i)=>(
            <div key={i} style={{ background:card, border:`1px solid ${bdr}`, borderRadius:8, overflow:'hidden' }}>
              <button onClick={()=>setOpen(open===i?null:i)} style={{ width:'100%', padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', background:'none', border:'none', cursor:'pointer', textAlign:'left' }}>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', color:txt, fontWeight:600 }}>{item.q}</span>
                {open===i ? <ChevronUp size={16} color={pri}/> : <ChevronDown size={16} color={pri}/>}
              </button>
              <AnimatePresence>
                {open===i && (
                  <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
                    style={{ overflow:'hidden', padding:'0 20px 16px', fontFamily:"'Cormorant Garamond',serif", fontSize:'1.05rem', lineHeight:1.8, color:mut }}>
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
  const [name,setName]=useState(''); const [msg,setMsg]=useState('');
  const [list,setList]=useState(()=> { try{ return JSON.parse(localStorage.getItem('mia_leo_wishes')||'[]'); }catch{ return []; } });
  const card= dark ? P.cardD: P.card;
  const pri = dark ? P.priD : P.pri;
  const bdr = dark ? P.bdrD : P.bdr;
  const txt = dark ? P.txtD : P.txt;
  const mut = dark ? P.mutD : P.mut;
  const submit = (e)=>{ e.preventDefault(); if(!name.trim()||!msg.trim()) return;
    const newList=[{name,msg,date:new Date().toLocaleDateString()},...list];
    setList(newList); localStorage.setItem('mia_leo_wishes',JSON.stringify(newList)); setName(''); setMsg('');
    window.open(`https://t.me/yeserge_leta1?text=${encodeURIComponent(`💐 Wish for Mia & Leo from ${name}: ${msg}`)}`, '_blank');
  };
  return (
    <section style={{ padding:'80px 24px', background: dark?'#1E1408':'#FFF8F0' }}>
      <div style={{ maxWidth:700, margin:'0 auto' }}>
        <p style={{ fontFamily:"'Bellefair',serif", fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.3em', color:P.gold, marginBottom:8, textAlign:'center' }}>Leave a Message</p>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2.2rem', fontStyle:'italic', color:pri, textAlign:'center' }}>Blessings & Wishes</h2>
        <OrnDivider gold={P.gold}/>
        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:32 }}>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your Name" style={{ padding:'12px 16px', background:card, border:`1px solid ${bdr}`, borderRadius:8, color:txt, fontFamily:"'Cormorant Garamond',serif", fontSize:'1rem', outline:'none' }}/>
          <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Your message to the couple..." rows={4} style={{ padding:'12px 16px', background:card, border:`1px solid ${bdr}`, borderRadius:8, color:txt, fontFamily:"'Cormorant Garamond',serif", fontSize:'1rem', outline:'none', resize:'vertical' }}/>
          <button type="submit" style={{ padding:'14px', background:`linear-gradient(135deg,${P.gold},${P.acc})`, color:'white', border:'none', borderRadius:8, fontFamily:"'Bellefair',serif", fontSize:'0.85rem', textTransform:'uppercase', letterSpacing:'0.2em', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <Send size={16}/> Send Blessing
          </button>
        </form>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {list.map((w,i)=>(
            <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} style={{ background:card, border:`1px solid ${bdr}`, borderRadius:8, padding:'16px 20px' }}>
              <p style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, color:pri, marginBottom:4 }}>{w.name}</p>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.05rem', color:mut, lineHeight:1.7 }}>{w.msg}</p>
              <p style={{ fontSize:'0.7rem', color:mut, marginTop:6, opacity:0.6 }}>{w.date}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function MiaAndLeo() {
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const cd = useCountdown('2026-08-22T16:00:00');

  useEffect(()=>{ const fn=()=>setScrolled(window.scrollY>60); window.addEventListener('scroll',fn); return ()=>window.removeEventListener('scroll',fn); },[]);

  const bg   = dark ? P.bgD   : P.bg;
  const card = dark ? P.cardD : P.card;
  const pri  = dark ? P.priD  : P.pri;
  const acc  = dark ? P.accD  : P.acc;
  const txt  = dark ? P.txtD  : P.txt;
  const mut  = dark ? P.mutD  : P.mut;
  const bdr  = dark ? P.bdrD  : P.bdr;

  const S = (style) => ({ fontFamily:"'Cormorant Garamond',serif", ...style });
  const navLinks = ['About','Story','Events','Locations','Bridal Party','Gallery','Wishes','RSVP'];

  return (
    <div style={{ background:bg, color:txt, minHeight:'100vh', fontFamily:"'Cormorant Garamond',Georgia,serif", transition:'all 0.4s' }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Bellefair&display=swap" rel="stylesheet"/>

      {/* ── NAV ── */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:50, background:scrolled?(dark?'rgba(26,16,4,0.95)':'rgba(253,246,236,0.95)'):'transparent', backdropFilter:scrolled?'blur(10px)':'none', borderBottom:scrolled?`1px solid ${bdr}`:'none', transition:'all 0.4s', padding:'0 32px', height:68, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', fontStyle:'italic', color:pri }}>Mia & Leo</span>
        <div style={{ display:'flex', gap:24, alignItems:'center' }}>
          <div style={{ display:'flex', gap:20 }}>
            {navLinks.map(l=>(
              <a key={l} href={`#${l.toLowerCase().replace(' ','-')}`} style={{ fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.15em', fontFamily:"'Bellefair',serif", color:mut, textDecoration:'none' }}>{l}</a>
            ))}
          </div>
          <button onClick={()=>setDark(!dark)} style={{ background:'none', border:`1px solid ${bdr}`, borderRadius:'50%', width:36, height:36, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:pri }}>
            {dark?<Sun size={15}/>:<Moon size={15}/>}
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{ position:'relative', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
        <img src="/images/temp3.webp" alt="Hero" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}/>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,rgba(0,0,0,0.25),rgba(0,0,0,0.6))' }}/>
        {/* Ornate inset border */}
        <div style={{ position:'absolute', inset:20, border:'1px solid rgba(200,169,126,0.5)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', inset:28, border:'1px solid rgba(200,169,126,0.2)', pointerEvents:'none' }}/>
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:1}} style={{ position:'relative', zIndex:10, textAlign:'center', color:'white', padding:'0 24px' }}>
          <p style={{ fontFamily:"'Bellefair',serif", fontSize:'0.8rem', letterSpacing:'0.4em', textTransform:'uppercase', opacity:0.8, marginBottom:12 }}>Together We Say</p>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(3.5rem,9vw,6.5rem)', fontStyle:'italic', fontWeight:700, lineHeight:1.05, marginBottom:8 }}>Mia & Leo</h1>
          <OrnDivider gold={P.gold}/>
          <p style={{ fontSize:'1.2rem', fontStyle:'italic', opacity:0.85, letterSpacing:'0.06em' }}>August 22, 2026 · The Garden Pavilion</p>
          <p style={{ fontFamily:"'Bellefair',serif", fontSize:'0.75rem', letterSpacing:'0.3em', textTransform:'uppercase', opacity:0.7, marginTop:8 }}>Highland Gardens, California</p>
        </motion.div>
      </section>

      {/* ── COUNTDOWN ── */}
      <section style={{ padding:'80px 24px', background:dark?'#1E1408':'#FFFBF5', textAlign:'center' }}>
        <p style={{ fontFamily:"'Bellefair',serif", fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.3em', color:P.gold, marginBottom:8 }}>The Big Day Approaches</p>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2rem', fontStyle:'italic', color:pri, marginBottom:36 }}>Counting Down to Forever</h2>
        <div style={{ display:'flex', justifyContent:'center', gap:28, flexWrap:'wrap' }}>
          {[['Days',cd.d],['Hours',cd.h],['Minutes',cd.m],['Seconds',cd.s]].map(([l,v])=>(
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ width:88, height:88, borderRadius:'50%', border:`2px solid ${P.gold}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px', background:card, boxShadow:`0 4px 20px rgba(200,169,126,0.2)` }}>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'2rem', fontWeight:700, color:pri }}>{String(v).padStart(2,'0')}</span>
              </div>
              <span style={{ fontFamily:"'Bellefair',serif", fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.25em', color:mut }}>{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT US ── */}
      <section id="about" style={{ padding:'80px 24px', maxWidth:1000, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:50 }}>
          <p style={{ fontFamily:"'Bellefair',serif", fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.3em', color:P.gold, marginBottom:8 }}>Meet the Couple</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2.5rem', fontStyle:'italic', color:pri }}>About Us</h2>
          <OrnDivider gold={P.gold}/>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:32 }}>
          {[
            { name:'Mia Rosewood', role:'The Bride', img:'/images/couple_1.jpg', desc:'A florist and dreamer from Sonoma Valley, Mia has always believed love should smell like lavender and taste like honey. She brings warmth and creativity to everything she touches.' },
            { name:'Leonardo Hart', role:'The Groom', img:'/images/couple_2.jpg', desc:`An architect who finds beauty in structure and detail, Leo fell in love with Mia's wild spirit. He has been quietly building their future together — one beautiful memory at a time.` },
          ].map((p,i)=>(
            <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.15}}
              style={{ background:card, border:`1px solid ${bdr}`, borderRadius:12, overflow:'hidden' }}>
              <div style={{ height:280, overflow:'hidden' }}>
                <img src={p.img} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
              </div>
              <div style={{ padding:'24px 20px', textAlign:'center' }}>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.6rem', fontStyle:'italic', color:pri, marginBottom:4 }}>{p.name}</h3>
                <p style={{ fontFamily:"'Bellefair',serif", fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.2em', color:P.gold, marginBottom:12 }}>{p.role}</p>
                <OrnDivider gold={P.gold}/>
                <p style={{ fontSize:'1rem', lineHeight:1.8, color:mut, fontStyle:'italic' }}>{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── OUR LOVE STORY ── */}
      <section id="story" style={{ padding:'80px 24px', background:dark?'#1E1408':'#FFF5E8' }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          <p style={{ fontFamily:"'Bellefair',serif", fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.3em', color:P.gold, marginBottom:8, textAlign:'center' }}>How It All Began</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2.5rem', fontStyle:'italic', color:pri, textAlign:'center' }}>Our Love Story</h2>
          <OrnDivider gold={P.gold}/>
          <div style={{ marginTop:40, position:'relative' }}>
            {/* Vertical line */}
            <div style={{ position:'absolute', left:'50%', top:0, bottom:0, width:2, background:`linear-gradient(to bottom,transparent,${P.gold},transparent)`, transform:'translateX(-50%)', pointerEvents:'none' }}/>
            {[
              { year:'2019', title:'The Rainy Bookshop', desc:'A rainy Tuesday in October. Both reached for the same copy of Pablo Neruda\'s "Twenty Love Poems." Leo insisted she take it. She said she\'d give it back over coffee.', img:'/images/couple_3.jpg', side:'left' },
              { year:'2021', title:'The Road Trip', desc:'They drove 2,000 miles along the Pacific Coast with no plan, discovering hidden coves, tiny towns, and just how perfectly they fit together.', img:'/images/couple_4.jpg', side:'right' },
              { year:'2023', title:'The Proposal', desc:'Leo hid the ring in a hollowed-out copy of that same Pablo Neruda book. She found it mid-read on a Sunday morning. She said yes before she even opened the box.', img:'/images/couple_1.jpg', side:'left' },
              { year:'2026', title:'Forever Begins', desc:'Today, surrounded by the people they love most, Mia and Leo begin the next great chapter of their love story.', img:'/images/hero3.jpg', side:'right' },
            ].map((item,i)=>(
              <motion.div key={i} initial={{opacity:0,x:item.side==='left'?-40:40}} whileInView={{opacity:1,x:0}} viewport={{once:true}}
                style={{ display:'flex', justifyContent:item.side==='left'?'flex-end':'flex-start', marginBottom:48, position:'relative' }}>
                {/* Centre dot */}
                <div style={{ position:'absolute', left:'50%', top:20, width:16, height:16, borderRadius:'50%', background:P.gold, transform:'translateX(-50%)', border:`3px solid ${card}`, zIndex:1 }}/>
                <div style={{ width:'44%', background:card, border:`1px solid ${bdr}`, borderRadius:10, overflow:'hidden', boxShadow:`0 4px 20px rgba(0,0,0,0.06)` }}>
                  <div style={{ height:160, overflow:'hidden' }}>
                    <img src={item.img} alt={item.title} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                  </div>
                  <div style={{ padding:'16px 18px' }}>
                    <p style={{ fontFamily:"'Bellefair',serif", fontSize:'0.65rem', letterSpacing:'0.25em', textTransform:'uppercase', color:P.gold, marginBottom:4 }}>{item.year}</p>
                    <h4 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', fontStyle:'italic', color:pri, marginBottom:8 }}>{item.title}</h4>
                    <p style={{ fontSize:'0.95rem', color:mut, lineHeight:1.7 }}>{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE (Wedding Day) ── */}
      <section id="events" style={{ padding:'80px 24px', textAlign:'center' }}>
        <p style={{ fontFamily:"'Bellefair',serif", fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.3em', color:P.gold, marginBottom:8 }}>August 22, 2026</p>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2.5rem', fontStyle:'italic', color:pri }}>Wedding Day Timeline</h2>
        <OrnDivider gold={P.gold}/>
        <div style={{ maxWidth:600, margin:'30px auto 0', display:'flex', flexDirection:'column', gap:0 }}>
          {[
            { time:'2:30 PM', icon:'🌸', title:'Guest Arrival', desc:'Welcome drinks & garden stroll' },
            { time:'3:00 PM', icon:'💍', title:'Ceremony Begins', desc:'Exchange of vows at the rose arbour' },
            { time:'4:00 PM', icon:'📸', title:'Golden Hour Photos', desc:'Portraits in the lavender garden' },
            { time:'5:00 PM', icon:'🥂', title:'Cocktail Reception', desc:'Champagne & canapés on the terrace' },
            { time:'7:00 PM', icon:'🍽️', title:'Wedding Dinner', desc:'Three-course farm-to-table dinner' },
            { time:'9:00 PM', icon:'💃', title:'Celebration & Dancing', desc:'Live folk band & dancing until midnight' },
          ].map((e,i)=>(
            <motion.div key={i} initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.07}}
              style={{ display:'flex', gap:20, alignItems:'flex-start', paddingBottom:28, position:'relative', textAlign:'left' }}>
              {/* vertical track */}
              {i<5&&<div style={{ position:'absolute', left:28, top:40, bottom:-8, width:2, background:`linear-gradient(to bottom,${P.gold}40,transparent)` }}/>}
              <div style={{ width:56, height:56, borderRadius:'50%', background:card, border:`2px solid ${P.gold}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0, boxShadow:`0 2px 12px rgba(200,169,126,0.3)` }}>{e.icon}</div>
              <div style={{ paddingTop:12 }}>
                <p style={{ fontFamily:"'Bellefair',serif", fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.2em', color:P.gold, marginBottom:2 }}>{e.time}</p>
                <h4 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', color:pri, marginBottom:4 }}>{e.title}</h4>
                <p style={{ fontSize:'0.95rem', color:mut, lineHeight:1.6 }}>{e.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── LOCATIONS ── */}
      <section id="locations" style={{ padding:'80px 24px', background:dark?'#1E1408':'#FFF5E8' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <p style={{ fontFamily:"'Bellefair',serif", fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.3em', color:P.gold, marginBottom:8, textAlign:'center' }}>Where to Find Us</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2.5rem', fontStyle:'italic', color:pri, textAlign:'center' }}>Event Locations</h2>
          <OrnDivider gold={P.gold}/>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24, marginTop:32 }}>
            {[
              { type:'Ceremony', icon:'💍', name:'The Garden Pavilion', address:'88 Vintage Lane, Highland Gardens, CA 91210', time:'3:00 PM', maps:'https://maps.google.com/?q=Highland+Gardens+CA' },
              { type:'Reception', icon:'🥂', name:'The Rose Manor', address:'12 Manor Court, Highland Gardens, CA 91210', time:'5:00 PM', maps:'https://maps.google.com/?q=Highland+Gardens+CA' },
              { type:'After Party', icon:'🎶', name:'The Cellar Bar', address:'4 Vineyard Road, Highland Gardens, CA 91212', time:'11:00 PM', maps:'https://maps.google.com/?q=Highland+Gardens+CA' },
            ].map((loc,i)=>(
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}
                style={{ background:card, border:`1px solid ${bdr}`, borderRadius:12, padding:'28px 24px', textAlign:'center', boxShadow:`0 4px 20px rgba(0,0,0,0.05)` }}>
                <div style={{ fontSize:'2rem', marginBottom:12 }}>{loc.icon}</div>
                <p style={{ fontFamily:"'Bellefair',serif", fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.25em', color:P.gold, marginBottom:8 }}>{loc.type}</p>
                <h4 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.3rem', fontStyle:'italic', color:pri, marginBottom:6 }}>{loc.name}</h4>
                <p style={{ fontSize:'0.85rem', color:mut, marginBottom:4, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}><MapPin size={13} color={P.gold}/>{loc.address}</p>
                <p style={{ fontFamily:"'Bellefair',serif", fontSize:'0.75rem', color:acc, marginBottom:16 }}>{loc.time}</p>
                <a href={loc.maps} target="_blank" rel="noopener noreferrer" style={{ display:'inline-block', padding:'8px 20px', border:`1px solid ${P.gold}`, borderRadius:20, fontSize:'0.75rem', fontFamily:"'Bellefair',serif", textTransform:'uppercase', letterSpacing:'0.15em', color:pri, textDecoration:'none' }}>Get Directions</a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="gallery" style={{ padding:'80px 24px' }}>
        <div style={{ maxWidth:1000, margin:'0 auto', textAlign:'center' }}>
          <p style={{ fontFamily:"'Bellefair',serif", fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.3em', color:P.gold, marginBottom:8 }}>Captured Moments</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2.5rem', fontStyle:'italic', color:pri }}>Our Gallery</h2>
          <OrnDivider gold={P.gold}/>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12, marginTop:32 }}>
            {['/images/couple_1.jpg','/images/couple_2.jpg','/images/couple_3.jpg','/images/couple_4.jpg','/images/temp1.webp','/images/temp3.webp','/images/hero3.jpg','/images/hero2.jpg'].map((img,i)=>(
              <motion.div key={i} whileHover={{scale:1.03}} style={{ borderRadius:10, overflow:'hidden', aspectRatio: i%3===0?'3/4':'4/3', border:`3px solid ${card}`, boxShadow:`0 4px 16px rgba(0,0,0,0.08)` }}>
                <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.4s' }}/>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRIDAL PARTY ── */}
      <section id="bridal-party" style={{ padding:'80px 24px', background:dark?'#1E1408':'#FFF5E8' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <p style={{ fontFamily:"'Bellefair',serif", fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.3em', color:P.gold, marginBottom:8, textAlign:'center' }}>With Love & Gratitude</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2.5rem', fontStyle:'italic', color:pri, textAlign:'center' }}>Bridesmaids & Groomsmen</h2>
          <OrnDivider gold={P.gold}/>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', fontStyle:'italic', color:pri, textAlign:'center', marginTop:30, marginBottom:20 }}>Bridesmaids</h3>
          <div style={{ display:'flex', gap:20, justifyContent:'center', flexWrap:'wrap', marginBottom:40 }}>
            {[{name:'Clara',role:'Maid of Honor'},{name:'Sophie',role:'Bridesmaid'},{name:'Emma',role:'Bridesmaid'},{name:'Rose',role:'Flower Girl'}].map((p,i)=>(
              <motion.div key={i} whileHover={{y:-6}} style={{ textAlign:'center', width:140 }}>
                <div style={{ width:100, height:100, borderRadius:'50%', overflow:'hidden', margin:'0 auto 10px', border:`3px solid ${P.gold}`, background:bdr }}>
                  <img src="/images/head1.jpg" alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                </div>
                <p style={{ fontFamily:"'Playfair Display',serif", fontStyle:'italic', color:pri, fontWeight:600 }}>{p.name}</p>
                <p style={{ fontFamily:"'Bellefair',serif", fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.15em', color:P.gold }}>{p.role}</p>
              </motion.div>
            ))}
          </div>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', fontStyle:'italic', color:pri, textAlign:'center', marginBottom:20 }}>Groomsmen</h3>
          <div style={{ display:'flex', gap:20, justifyContent:'center', flexWrap:'wrap' }}>
            {[{name:'James',role:'Best Man'},{name:'Oliver',role:'Groomsman'},{name:'Will',role:'Groomsman'},{name:'Ben',role:'Ring Bearer'}].map((p,i)=>(
              <motion.div key={i} whileHover={{y:-6}} style={{ textAlign:'center', width:140 }}>
                <div style={{ width:100, height:100, borderRadius:'50%', overflow:'hidden', margin:'0 auto 10px', border:`3px solid ${acc}`, background:bdr }}>
                  <img src="/images/head1.jpg" alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                </div>
                <p style={{ fontFamily:"'Playfair Display',serif", fontStyle:'italic', color:pri, fontWeight:600 }}>{p.name}</p>
                <p style={{ fontFamily:"'Bellefair',serif", fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.15em', color:acc }}>{p.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIDEO ── */}
      <section style={{ padding:'80px 24px', textAlign:'center' }}>
        <p style={{ fontFamily:"'Bellefair',serif", fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.3em', color:P.gold, marginBottom:8 }}>A Glimpse of Our Love</p>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2.5rem', fontStyle:'italic', color:pri, marginBottom:32 }}>Our Story in Motion</h2>
        <div style={{ maxWidth:800, margin:'0 auto', borderRadius:12, overflow:'hidden', border:`4px solid ${card}`, boxShadow:`0 8px 40px rgba(0,0,0,0.15)`, position:'relative', background:'#000', paddingTop:'56.25%' }}>
          <iframe style={{ position:'absolute', inset:0, width:'100%', height:'100%', border:'none' }}
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Wedding Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>
        </div>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic', color:mut, marginTop:16, fontSize:'1rem' }}>Filmed by Garden Rose Films · 2026</p>
      </section>

      {/* ── BRIDAL WISHES ── */}
      <Wishes dark={dark}/>

      {/* ── FAQ ── */}
      <FAQ dark={dark}/>

      {/* ── TELEGRAM BOT ── */}
      <section style={{ padding:'60px 24px', background:dark?'#1E1408':'#FFF5E8', textAlign:'center' }}>
        <p style={{ fontFamily:"'Bellefair',serif", fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.3em', color:P.gold, marginBottom:8 }}>Stay Connected</p>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2rem', fontStyle:'italic', color:pri, marginBottom:16 }}>Chat With Us on Telegram</h2>
        <p style={{ color:mut, fontStyle:'italic', marginBottom:24, maxWidth:500, margin:'0 auto 24px' }}>Have a question? Want to send a personal message? Reach us directly on Telegram — we reply with love. 💌</p>
        <a href="https://t.me/yeserge_leta1" target="_blank" rel="noopener noreferrer"
          style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'14px 28px', background:'#0088cc', color:'white', borderRadius:30, fontFamily:"'Bellefair',serif", fontSize:'0.9rem', textTransform:'uppercase', letterSpacing:'0.15em', textDecoration:'none', boxShadow:'0 4px 20px rgba(0,136,204,0.35)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.68 7.93c-.12.56-.44.7-.88.43l-2.44-1.8-1.18 1.13c-.13.13-.24.24-.49.24l.17-2.49 4.49-4.06c.19-.17-.04-.27-.3-.1L7.69 14.6l-2.4-.75c-.52-.16-.53-.52.11-.77l9.38-3.62c.44-.15.82.11.86.34z"/></svg>
          Message Us on Telegram
        </a>
      </section>

      {/* ── RSVP ── */}
      <section id="rsvp" style={{ position:'relative', padding:'80px 24px', textAlign:'center', overflow:'hidden' }}>
        <img src="/images/hero3.jpg" alt="bg" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}/>
        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.65)' }}/>
        <div style={{ position:'absolute', inset:20, border:'1px solid rgba(200,169,126,0.3)', pointerEvents:'none' }}/>
        <div style={{ position:'relative', zIndex:2, maxWidth:560, margin:'0 auto' }}>
          <p style={{ fontFamily:"'Bellefair',serif", fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.3em', color:P.gold, marginBottom:8 }}>Will You Join Us?</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2.5rem', fontStyle:'italic', color:'white', marginBottom:8 }}>RSVP</h2>
          <p style={{ color:'rgba(255,255,255,0.7)', fontStyle:'italic', marginBottom:28 }}>Kindly respond before July 1, 2026</p>
          <form style={{ display:'flex', flexDirection:'column', gap:14 }} onSubmit={e=>{ e.preventDefault();
            const fd=new FormData(e.target); const msg=`RSVP from ${fd.get('name')} — ${fd.get('attendance')} — Guests: ${fd.get('guests')} — Diet: ${fd.get('diet')}`;
            window.open(`https://t.me/yeserge_leta1?text=${encodeURIComponent(msg)}`,'_blank'); e.target.reset();
          }}>
            {[['name','Your Full Name','text'],['email','Email Address','email']].map(([id,ph,tp])=>(
              <input key={id} name={id} type={tp} placeholder={ph} required style={{ padding:'13px 18px', borderRadius:8, border:'1px solid rgba(200,169,126,0.4)', background:'rgba(255,255,255,0.1)', color:'white', fontFamily:"'Cormorant Garamond',serif", fontSize:'1rem', backdropFilter:'blur(8px)', outline:'none' }}/>
            ))}
            <select name="attendance" required style={{ padding:'13px 18px', borderRadius:8, border:'1px solid rgba(200,169,126,0.4)', background:'rgba(255,255,255,0.1)', color:'white', fontFamily:"'Cormorant Garamond',serif", fontSize:'1rem', outline:'none' }}>
              <option value="">Attendance</option>
              <option value="Joyfully Accepts">Joyfully Accepts</option>
              <option value="Regretfully Declines">Regretfully Declines</option>
            </select>
            <input name="guests" type="number" min="1" max="5" placeholder="Number of Guests" style={{ padding:'13px 18px', borderRadius:8, border:'1px solid rgba(200,169,126,0.4)', background:'rgba(255,255,255,0.1)', color:'white', fontFamily:"'Cormorant Garamond',serif", fontSize:'1rem', outline:'none' }}/>
            <input name="diet" type="text" placeholder="Dietary requirements (optional)" style={{ padding:'13px 18px', borderRadius:8, border:'1px solid rgba(200,169,126,0.4)', background:'rgba(255,255,255,0.1)', color:'white', fontFamily:"'Cormorant Garamond',serif", fontSize:'1rem', outline:'none' }}/>
            <button type="submit" style={{ padding:'16px', background:`linear-gradient(135deg,${P.gold},${P.acc})`, color:'white', border:'none', borderRadius:8, fontFamily:"'Bellefair',serif", fontSize:'0.85rem', textTransform:'uppercase', letterSpacing:'0.2em', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <Send size={15}/> Confirm My Attendance
            </button>
          </form>
        </div>
      </section>

      {/* ── QR CODE ENTRY ── */}
      <section style={{ padding:'80px 24px', textAlign:'center' }}>
        <p style={{ fontFamily:"'Bellefair',serif", fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.3em', color:P.gold, marginBottom:8 }}>Your Entry Pass</p>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2.2rem', fontStyle:'italic', color:pri, marginBottom:16 }}>QR Code Entry</h2>
        <OrnDivider gold={P.gold}/>
        <p style={{ color:mut, fontStyle:'italic', maxWidth:480, margin:'0 auto 28px' }}>Show this QR code at the gate for seamless entry. Your invitation code is unique to you — please do not share it.</p>
        <div style={{ display:'inline-flex', flexDirection:'column', alignItems:'center', gap:16, padding:24, background:card, borderRadius:16, border:`2px solid ${bdr}`, boxShadow:`0 8px 40px rgba(200,169,126,0.2)` }}>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://yesergeleta.com/entry?id=mia-leo-2026&name=Guest')}&bgcolor=fff8f0&color=8B5E3C`} alt="QR Entry Code" style={{ width:200, height:200, borderRadius:8 }}/>
          <div style={{ textAlign:'center' }}>
            <p style={{ fontFamily:"'Playfair Display',serif", fontStyle:'italic', color:pri, fontSize:'1.1rem' }}>Mia & Leo · August 22, 2026</p>
            <p style={{ fontFamily:"'Bellefair',serif", fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.2em', color:P.gold }}>The Garden Pavilion · 3:00 PM</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding:'40px 24px', textAlign:'center', borderTop:`1px solid ${bdr}`, background:dark?'#130D04':'#FDF0E0' }}>
        <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.8rem', fontStyle:'italic', color:pri, marginBottom:8 }}>Mia & Leo</p>
        <OrnDivider gold={P.gold}/>
        <p style={{ fontFamily:"'Bellefair',serif", fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.2em', color:mut }}>August 22, 2026 · Vintage Retro Template</p>
      </footer>

      {/* ── FLOATING CONTROLS ── */}
      <button onClick={()=>setDark(!dark)} style={{ position:'fixed', bottom:24, left:24, zIndex:100, width:44, height:44, borderRadius:'50%', background:pri, color:'white', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
        {dark?<Sun size={18}/>:<Moon size={18}/>}
      </button>
      <MusicPlayer dark={dark}/>
    </div>
  );
}
