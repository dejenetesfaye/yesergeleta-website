import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sun, Moon, MapPin, Volume2, VolumeX, Play, Pause, Send, ChevronDown, ChevronUp, Menu, X } from 'lucide-react';

const P = {
  bg:'#080808', bgL:'#F0ECE8', card:'#141414', cardL:'#FFFFFF',
  pri:'#D4AF37', priL:'#8B6914', crim:'#C0392B', crimL:'#8B0000',
  txt:'#E8E0D0', txtL:'#1A1008', mut:'#888', mutL:'#666',
  bdr:'#2A2A2A', bdrL:'#E0D4C8',
};

function useCD(t){const[s,set]=useState({d:0,h:0,m:0,s:0});useEffect(()=>{const id=setInterval(()=>{const diff=new Date(t)-Date.now();if(diff<=0)return;set({d:Math.floor(diff/86400000),h:Math.floor(diff/3600000%24),m:Math.floor(diff/60000%60),s:Math.floor(diff/1000%60)});},1000);return()=>clearInterval(id);},[t]);return s;}

function MusicPlayer({ dark }) {
  const [play, setPlay] = useState(false);
  const [mute, setMute] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const fn = () => {
      if (ref.current) {
        ref.current.play().then(() => setPlay(true)).catch(() => { });
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

  const toggle = () => { if (!ref.current) return; if (play) { ref.current.pause(); setPlay(false); } else { ref.current.play().catch(() => { }); setPlay(true); } };
  return (<>
    <audio ref={ref} loop muted={mute} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" />
    <div style={{ position: 'fixed', bottom: 24, right: 80, zIndex: 100, display: 'flex', gap: 8 }}>
      <button onClick={toggle} style={{ width: 44, height: 44, borderRadius: '50%', background: P.crim, color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(192,57,43,0.5)' }}>
        {play ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <button onClick={() => setMute(!mute)} style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {mute ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </div>
  </>);
}


function NDiv({dark}){const c=dark?P.pri:P.priL;return(
  <div style={{display:'flex',alignItems:'center',gap:8,justifyContent:'center',margin:'16px 0'}}>
    <div style={{flex:1,maxWidth:80,height:1,background:`linear-gradient(to right,transparent,${c})`}}/>
    <div style={{width:6,height:6,background:P.crim,transform:'rotate(45deg)'}}/>
    <Heart size={13} fill={c} color={c}/>
    <div style={{width:6,height:6,background:P.crim,transform:'rotate(45deg)'}}/>
    <div style={{flex:1,maxWidth:80,height:1,background:`linear-gradient(to left,transparent,${c})`}}/>
  </div>
);}

function Wishes({dark}){
  const[name,setN]=useState('');const[msg,setM]=useState('');
  const[list,setL]=useState(()=>{try{return JSON.parse(localStorage.getItem('noah_eve_wishes')||'[]');}catch{return[];}});
  const bg=dark?P.bg:P.bgL;const card=dark?P.card:P.cardL;const bdr=dark?P.bdr:P.bdrL;
  const pri=dark?P.pri:P.priL;const txt=dark?P.txt:P.txtL;const mut=dark?P.mut:P.mutL;
  const sub=(e)=>{e.preventDefault();if(!name.trim()||!msg.trim())return;
    const nl=[{name,msg,date:new Date().toLocaleDateString()},...list];
    setL(nl);localStorage.setItem('noah_eve_wishes',JSON.stringify(nl));setN('');setM('');
    window.open(`https://t.me/yeserge_leta1?text=${encodeURIComponent(`🖤 Wish for Noah & Eve from ${name}: ${msg}`)}`,'_blank');
  };
  return(
    <section style={{padding:'80px 24px',background:dark?'#0D0D0D':P.bgL}}>
      <div style={{maxWidth:700,margin:'0 auto'}}>
        <p style={{fontFamily:"'Cinzel',serif",fontSize:'0.6rem',letterSpacing:'0.4em',color:P.crim,textTransform:'uppercase',marginBottom:10,textAlign:'center'}}>Leave Your Mark</p>
        <h2 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:'2rem',color:dark?'white':P.txtL,textAlign:'center'}}>Blessings & Wishes</h2>
        <NDiv dark={dark}/>
        <form onSubmit={sub} style={{display:'flex',flexDirection:'column',gap:12,marginBottom:28}}>
          <input value={name} onChange={e=>setN(e.target.value)} placeholder="Your Name" style={{padding:'13px 18px',background:card,border:`1px solid ${bdr}`,borderRadius:4,color:txt,fontFamily:"'EB Garamond',serif",fontSize:'1rem',outline:'none'}}/>
          <textarea value={msg} onChange={e=>setM(e.target.value)} placeholder="Your message to the couple…" rows={4} style={{padding:'13px 18px',background:card,border:`1px solid ${bdr}`,borderRadius:4,color:txt,fontFamily:"'EB Garamond',serif",fontSize:'1rem',outline:'none',resize:'vertical'}}/>
          <button type="submit" style={{padding:'14px',background:`linear-gradient(135deg,${P.crim},#8B0000)`,color:'white',border:'none',borderRadius:4,fontFamily:"'Cinzel',serif",fontSize:'0.7rem',letterSpacing:'0.25em',textTransform:'uppercase',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,boxShadow:'0 4px 20px rgba(192,57,43,0.4)'}}>
            <Send size={14}/> Send Blessing
          </button>
        </form>
        {list.map((w,i)=>(
          <motion.div key={i} initial={{opacity:0}} animate={{opacity:1}} style={{background:card,border:`1px solid ${bdr}`,borderLeft:`3px solid ${P.crim}`,borderRadius:4,padding:'14px 18px',marginBottom:10}}>
            <p style={{fontFamily:"'Cinzel',serif",fontSize:'0.85rem',color:dark?P.pri:P.priL,marginBottom:4}}>{w.name}</p>
            <p style={{fontFamily:"'EB Garamond',serif",color:mut,lineHeight:1.7}}>{w.msg}</p>
            <p style={{fontSize:'0.65rem',color:mut,marginTop:6,opacity:0.5}}>{w.date}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FAQ({dark}){
  const[open,setO]=useState(null);
  const card=dark?P.card:P.cardL;const bdr=dark?P.bdr:P.bdrL;
  const pri=dark?P.pri:P.priL;const txt=dark?P.txt:P.txtL;const mut=dark?P.mut:P.mutL;
  const items=[
    {q:'Is there a dress code?',a:'We request formal or black-tie attire. Black, charcoal, deep navy, or dramatic red are all welcomed. Please avoid white or ivory.'},
    {q:'Is the event 18+ only?',a:'The evening reception is adults only. The ceremony is family-friendly and children are welcome to attend.'},
    {q:'Is parking available at the Grand Noir Ballroom?',a:'Yes, complimentary valet parking is available from 6:30 PM at the main entrance.'},
    {q:'Will there be a photographer/videographer?',a:'Yes, our team will capture every moment. We ask that guests refrain from flash photography during the ceremony.'},
    {q:'Can I live stream the wedding?',a:'Yes, we will share a private online stream link to all confirmed guests. Details in your RSVP confirmation.'},
    {q:'How do I contact you directly?',a:'Reach us on Telegram @yeserge_leta1 or via the Telegram button on this page.'},
  ];
  return(
    <section style={{padding:'80px 24px',background:dark?'#0D0D0D':P.bgL}}>
      <div style={{maxWidth:720,margin:'0 auto'}}>
        <p style={{fontFamily:"'Cinzel',serif",fontSize:'0.6rem',letterSpacing:'0.4em',color:P.crim,textTransform:'uppercase',marginBottom:10,textAlign:'center'}}>Questions</p>
        <h2 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:'2rem',color:dark?'white':P.txtL,textAlign:'center'}}>FAQ</h2>
        <NDiv dark={dark}/>
        <div style={{marginTop:20,display:'flex',flexDirection:'column',gap:6}}>
          {items.map((item,i)=>(
            <div key={i} style={{background:card,border:`1px solid ${bdr}`,borderRadius:4,overflow:'hidden',position:'relative'}}>
              <div style={{position:'absolute',top:0,left:0,width:3,height:'100%',background:open===i?P.crim:bdr}}/>
              <button onClick={()=>setO(open===i?null:i)} style={{width:'100%',padding:'16px 20px 16px 24px',display:'flex',justifyContent:'space-between',alignItems:'center',background:'none',border:'none',cursor:'pointer',textAlign:'left'}}>
                <span style={{fontFamily:"'Cinzel',serif",fontSize:'0.85rem',color:txt,fontWeight:600}}>{item.q}</span>
                {open===i?<ChevronUp size={15} color={P.crim}/>:<ChevronDown size={15} color={pri}/>}
              </button>
              <AnimatePresence>
                {open===i&&(<motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} style={{overflow:'hidden',padding:'0 24px 16px',fontFamily:"'EB Garamond',serif",fontSize:'1.05rem',lineHeight:1.8,color:mut}}>{item.a}</motion.div>)}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function NoahAndEve(){
  const[dark,setD]=useState(true);  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sc, setSc] = useState(false);
  const cd = useCD('2026-12-05T16:00:00');

  useEffect(() => {
    const handleScroll = () => setSc(window.scrollY > 60);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    
    handleScroll();
    handleResize();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const bg=dark?P.bg:P.bgL;const card=dark?P.card:P.cardL;const pri=dark?P.pri:P.priL;
  const crim=dark?P.crim:P.crimL;const txt=dark?P.txt:P.txtL;const mut=dark?P.mut:P.mutL;const bdr=dark?P.bdr:P.bdrL;
  const p = pri;

  return(
    <div style={{background:bg,color:txt,minHeight:'100vh',fontFamily:"'EB Garamond',Georgia,serif",transition:'all 0.4s'}}>
      <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&display=swap" rel="stylesheet"/>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: sc ? (dark ? 'rgba(8,8,8,0.98)' : 'rgba(240,236,232,0.98)') : 'transparent', borderBottom: sc ? `1px solid ${bdr}` : 'none', transition: 'all 0.4s', padding: isMobile ? '0 20px' : '0 40px', height: isMobile ? 64 : 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '1.2rem' : '1.5rem', fontWeight: 600, color: p, letterSpacing: '0.1em' }}>NOAH & EVE</span>
        
        {!isMobile ? (
          <div style={{ display: 'flex', gap: 32 }}>
            {['Inspiration', 'Legend', 'Timeline', 'Coordinates', 'Gallery', 'Ensemble', 'Messages', 'Confirm'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: mut, textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        ) : (
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', color: p, cursor: 'pointer', padding: 8 }}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setD(!dark)} style={{ background: 'none', border: `1px solid ${bdr}`, borderRadius: 4, padding: '6px 10px', color: p, cursor: 'pointer' }}>
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isMobile && menuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ position: 'absolute', top: 64, left: 0, right: 0, background: dark ? '#080808' : '#F0ECE8', borderBottom: `1px solid ${bdr}`, padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, zIndex: 999 }}
            >
              {['Inspiration', 'Legend', 'Timeline', 'Coordinates', 'Gallery', 'Ensemble', 'Messages', 'Confirm'].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)} style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: txt, textDecoration: 'none', textAlign: 'center' }}>{l}</a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section style={{position:'relative',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
        <img src="/images/temp4.jpg" alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.3)'}}/>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at center,transparent 20%,rgba(8,8,8,0.85) 100%)'}}/>
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:4,background:`linear-gradient(to right,transparent,${crim},${pri},${crim},transparent)`}}/>
        <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:1.2}} style={{position:'relative',zIndex:10,textAlign:'center'}}>
          <p style={{fontFamily:"'Cinzel',serif",fontSize:'0.65rem',letterSpacing:'0.5em',color:crim,textTransform:'uppercase',marginBottom:20}}>★ The Wedding of ★</p>
          <h1 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:'clamp(2.5rem,7vw,5.5rem)',color:'white',lineHeight:1.1,textShadow:`0 0 40px rgba(212,175,55,0.3)`,marginBottom:8}}>Noah</h1>
          <NDiv dark={dark}/>
          <h1 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:'clamp(2.5rem,7vw,5.5rem)',color:'white',lineHeight:1.1,textShadow:`0 0 40px rgba(212,175,55,0.3)`,marginBottom:24}}>& Eve</h1>
          <p style={{fontFamily:"'EB Garamond',serif",fontSize:'1.2rem',fontStyle:'italic',color:'rgba(255,255,255,0.75)',letterSpacing:'0.06em'}}>September 10, 2026 · Grand Noir Ballroom, Chicago</p>
        </motion.div>
        {/* corner ornaments */}
        {[['top:20px','left:20px'],['top:20px','right:20px'],['bottom:20px','left:20px'],['bottom:20px','right:20px']].map((pos,i)=>(
          <div key={i} style={{position:'absolute',...Object.fromEntries(pos.map(p=>p.split(':'))),width:24,height:24,borderTop:i<2?`2px solid rgba(212,175,55,0.5)`:'none',borderBottom:i>=2?`2px solid rgba(212,175,55,0.5)`:'none',borderLeft:[0,2].includes(i)?`2px solid rgba(212,175,55,0.5)`:'none',borderRight:[1,3].includes(i)?`2px solid rgba(212,175,55,0.5)`:'none',pointerEvents:'none'}}/>
        ))}
      </section>

      {/* COUNTDOWN */}
      <section style={{padding:'80px 24px',textAlign:'center',background:dark?'#0D0D0D':P.bgL}}>
        <p style={{fontFamily:"'Cinzel',serif",fontSize:'0.6rem',letterSpacing:'0.4em',color:crim,textTransform:'uppercase',marginBottom:12}}>Time Remaining</p>
        <h2 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:'2rem',color:dark?'white':txt,marginBottom:36}}>Until Our Night</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? 8 : 20, flexWrap: 'nowrap', overflow: 'hidden' }}>
          {[['Days', cd.d], ['Hours', cd.h], ['Mins', cd.m], ['Secs', cd.s]].map(([l, v]) => (
            <motion.div key={l} whileHover={{ scale: 1.05 }} style={{ minWidth: 0 }}>
              <div style={{ background: card, border: `1px solid ${pri}`, padding: isMobile ? '12px 4px' : '20px 8px', minWidth: isMobile ? 70 : 88, textAlign: 'center', position: 'relative', boxShadow: `0 0 20px rgba(212,175,55,0.15)` }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right,${crim},${pri})` }} />
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.5rem' : '2.2rem', fontWeight: 700, color: pri, display: 'block' }}>{String(v).padStart(2, '0')}</span>
              </div>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '0.5rem' : '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: mut, textAlign: 'center', marginTop: 8, whiteSpace: 'nowrap' }}>{l}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ABOUT US */}
      <section id="story" style={{padding:'80px 24px',maxWidth:1000,margin:'0 auto'}}>
        <p style={{fontFamily:"'Cinzel',serif",fontSize:'0.6rem',letterSpacing:'0.4em',color:crim,textTransform:'uppercase',marginBottom:10,textAlign:'center'}}>Meet the Couple</p>
        <h2 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:'2.2rem',color:dark?'white':txt,textAlign:'center'}}>About Noah & Eve</h2>
        <NDiv dark={dark}/>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:32,marginTop:32}}>
          {[
            {name:'Noah Blackwood',role:'The Groom',img:'/images/couple_2.jpg',desc:'A renowned photographer who sees beauty in shadows. Noah captures moments the eye forgets — and the heart never will. He has been quietly building a world for Eve for four years.'},
            {name:'Eve Sinclair',role:'The Bride',img:'/images/couple_1.jpg',desc:'A cellist and composer who speaks in music what words cannot hold. Eve fills every room with warmth, even the darkest ones — especially the ones Noah inhabits.'},
          ].map((p,i)=>(
            <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.15}}
              style={{background:card,border:`1px solid ${bdr}`,borderRadius:4,overflow:'hidden',position:'relative'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(to right,${crim},${pri})`}}/>
              <div style={{height:280,overflow:'hidden',filter:dark?'brightness(0.85) contrast(1.05)':'none'}}>
                <img src={p.img} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              </div>
              <div style={{padding:'24px 20px',textAlign:'center'}}>
                <h3 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:'1.3rem',color:dark?'white':txt,marginBottom:4}}>{p.name}</h3>
                <p style={{fontFamily:"'Cinzel',serif",fontSize:'0.6rem',letterSpacing:'0.2em',textTransform:'uppercase',color:pri,marginBottom:12}}>{p.role}</p>
                <NDiv dark={dark}/>
                <p style={{fontFamily:"'EB Garamond',serif",fontSize:'1.05rem',lineHeight:1.8,color:mut,fontStyle:'italic'}}>{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LOVE STORY */}
      <section style={{padding:'80px 24px',background:dark?'#0D0D0D':P.bgL}}>
        <div style={{maxWidth:800,margin:'0 auto'}}>
          <p style={{fontFamily:"'Cinzel',serif",fontSize:'0.6rem',letterSpacing:'0.4em',color:crim,textTransform:'uppercase',marginBottom:10,textAlign:'center'}}>How We Found Each Other</p>
          <h2 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:'2.2rem',color:dark?'white':txt,textAlign:'center'}}>Our Love Story</h2>
          <NDiv dark={dark}/>
          <div style={{marginTop:40,display:'flex',flexDirection:'column',gap:0,position:'relative'}}>
            <div style={{position:'absolute',left:23,top:0,bottom:0,width:2,background:`linear-gradient(to bottom,${crim},${pri},transparent)`}}/>
            {[
              {year:'Winter 2022',icon:'🥃',title:'A Jazz Club in the Rain',desc:'Noah was shooting the band. Eve\'s cello solo stopped the room. When she stepped off stage, he said "I\'ve never photographed music before." She laughed. That was it.'},
              {year:'Summer 2023',icon:'📷',title:'The Photo Series',desc:'Noah asked if he could photograph Eve for a project. She said yes, not knowing he\'d spend the whole shoot telling her his deepest fears. She told him hers. They stayed until 4 AM.'},
              {year:'Spring 2024',icon:'💎',title:'The Midnight Proposal',desc:'He arranged a private jazz trio on the rooftop where they first talked. He proposed between the second and third movement. She said yes before the third note.'},
              {year:'September 2026',icon:'🖤',title:'The Night of a Lifetime',desc:'Tonight, Noah and Eve step into forever beneath candlelight and jazz, surrounded by every person who made their story possible.'},
            ].map((item,i)=>(
              <motion.div key={i} initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.1}}
                style={{display:'flex',gap:24,alignItems:'flex-start',paddingBottom:36,paddingLeft:8}}>
                <div style={{width:32,height:32,borderRadius:'50%',background:dark?'#0D0D0D':P.bgL,border:`2px solid ${pri}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'1rem',zIndex:1,position:'relative'}}>{item.icon}</div>
                <div style={{background:card,border:`1px solid ${bdr}`,borderRadius:4,padding:'18px 20px',flex:1}}>
                  <p style={{fontFamily:"'Cinzel',serif",fontSize:'0.6rem',letterSpacing:'0.2em',color:crim,textTransform:'uppercase',marginBottom:4}}>{item.year}</p>
                  <h4 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:'1.05rem',color:dark?'white':txt,marginBottom:8}}>{item.title}</h4>
                  <p style={{fontFamily:"'EB Garamond',serif",fontSize:'1rem',lineHeight:1.8,color:mut}}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="timeline" style={{padding:'80px 24px',textAlign:'center'}}>
        <p style={{fontFamily:"'Cinzel',serif",fontSize:'0.6rem',letterSpacing:'0.4em',color:crim,textTransform:'uppercase',marginBottom:10}}>September 10, 2026</p>
        <h2 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:'2.2rem',color:dark?'white':txt,marginBottom:10}}>The Evening Program</h2>
        <NDiv dark={dark}/>
        <div style={{maxWidth:580,margin:'24px auto 0',display:'flex',flexDirection:'column',gap:16}}>
          {[
            {t:'7:00 PM',icon:'✨',title:'Grand Entrance',desc:'Guests are welcomed into the candlelit foyer'},
            {t:'7:30 PM',icon:'💍',title:'Marriage Ceremony',desc:'Vows exchanged beneath the chandelier'},
            {t:'8:30 PM',icon:'📷',title:'Portrait Session',desc:'Couple portraits in the garden courtyard'},
            {t:'9:00 PM',icon:'🥂',title:'Champagne Toast',desc:'Celebratory toast & live jazz trio'},
            {t:'9:30 PM',icon:'🍽️',title:'Five-Course Dinner',desc:'Noir-inspired gourmet tasting menu'},
            {t:'11:00 PM',icon:'💃',title:'Dancing & Celebration',desc:'Late-night dancing & midnight dessert'},
          ].map((e,i)=>(
            <motion.div key={i} initial={{opacity:0,x:i%2===0?-20:20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.07}}
              style={{display:'flex',gap:20,alignItems:'center',background:card,border:`1px solid ${bdr}`,borderRadius:4,padding:'16px 20px',textAlign:'left',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',left:0,top:0,bottom:0,width:3,background:`linear-gradient(to bottom,${crim},${pri})`}}/>
              <span style={{fontSize:'1.5rem',flexShrink:0}}>{e.icon}</span>
              <div style={{flex:1}}>
                <p style={{fontFamily:"'Cinzel',serif",fontSize:'0.6rem',color:pri,letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:2}}>{e.t}</p>
                <h4 style={{fontFamily:"'Cinzel',serif",fontSize:'0.95rem',color:dark?'white':txt,marginBottom:4}}>{e.title}</h4>
                <p style={{fontFamily:"'EB Garamond',serif",color:mut,fontSize:'0.95rem'}}>{e.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LOCATIONS */}
      <section id="locations" style={{padding:'80px 24px',background:dark?'#0D0D0D':P.bgL}}>
        <div style={{maxWidth:1000,margin:'0 auto'}}>
          <p style={{fontFamily:"'Cinzel',serif",fontSize:'0.6rem',letterSpacing:'0.4em',color:crim,textTransform:'uppercase',marginBottom:10,textAlign:'center'}}>Find Us Here</p>
          <h2 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:'2.2rem',color:dark?'white':txt,textAlign:'center'}}>Event Locations</h2>
          <NDiv dark={dark}/>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20,marginTop:32}}>
            {[
              {type:'Ceremony',icon:'⛪',name:'Grand Noir Ballroom',address:'15 Midnight Ave, Chicago, IL 60601',time:'7:30 PM',maps:'https://maps.google.com/?q=Chicago+IL'},
              {type:'Reception',icon:'🥂',name:'The Raven Lounge',address:'15 Midnight Ave, Chicago, IL 60601',time:'9:00 PM',maps:'https://maps.google.com/?q=Chicago+IL'},
              {type:'After Party',icon:'🎷',name:'The Jazz Cellar',address:'8 Blue Note Street, Chicago, IL 60602',time:'11:30 PM',maps:'https://maps.google.com/?q=Chicago+IL'},
            ].map((loc,i)=>(
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}
                style={{background:card,border:`1px solid ${bdr}`,borderRadius:4,padding:'28px 24px',textAlign:'center',position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(to right,${crim},${pri})`}}/>
                <div style={{fontSize:'2rem',marginBottom:12}}>{loc.icon}</div>
                <p style={{fontFamily:"'Cinzel',serif",fontSize:'0.6rem',letterSpacing:'0.25em',color:crim,textTransform:'uppercase',marginBottom:6}}>{loc.type}</p>
                <h4 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:'1.1rem',color:dark?'white':txt,marginBottom:6}}>{loc.name}</h4>
                <p style={{fontFamily:"'EB Garamond',serif",fontSize:'0.9rem',color:mut,marginBottom:4,display:'flex',alignItems:'center',justifyContent:'center',gap:6}}><MapPin size={12} color={pri}/>{loc.address}</p>
                <p style={{fontFamily:"'Cinzel',serif",fontSize:'0.65rem',color:pri,letterSpacing:'0.15em',marginBottom:16}}>{loc.time}</p>
                <a href={loc.maps} target="_blank" rel="noopener noreferrer" style={{display:'inline-block',padding:'8px 18px',border:`1px solid ${pri}`,borderRadius:4,fontFamily:"'Cinzel',serif",fontSize:'0.6rem',letterSpacing:'0.15em',textTransform:'uppercase',color:pri,textDecoration:'none'}}>Directions</a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" style={{padding:'80px 24px',textAlign:'center'}}>
        <p style={{fontFamily:"'Cinzel',serif",fontSize:'0.6rem',letterSpacing:'0.4em',color:crim,textTransform:'uppercase',marginBottom:10}}>Captured in Dark & Light</p>
        <h2 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:'2.2rem',color:dark?'white':txt,marginBottom:10}}>Gallery</h2>
        <NDiv dark={dark}/>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:4,maxWidth:900,margin:'28px auto 0'}}>
          {['/images/couple_3.jpg','/images/temp4.jpg','/images/couple_4.jpg','/images/couple_1.jpg','/images/couple_2.jpg','/images/hero3.jpg'].map((img,i)=>(
            <motion.div key={i} whileHover={{scale:1.03}} style={{overflow:'hidden',aspectRatio:i===1||i===4?'2/3':'1',border:`1px solid ${pri}40`,filter:dark?'brightness(0.78) contrast(1.1)':'none'}}>
              <img src={img} alt="" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BRIDAL PARTY */}
      <section id="party" style={{padding:'80px 24px',background:dark?'#0D0D0D':P.bgL,textAlign:'center'}}>
        <p style={{fontFamily:"'Cinzel',serif",fontSize:'0.6rem',letterSpacing:'0.4em',color:crim,textTransform:'uppercase',marginBottom:10}}>Our Beloved Circle</p>
        <h2 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:'2.2rem',color:dark?'white':txt}}>Bridesmaids & Groomsmen</h2>
        <NDiv dark={dark}/>
        {[{title:'Bridesmaids',people:[{n:'Diana',r:'Maid of Honor'},{n:'Isolde',r:'Bridesmaid'},{n:'Nora',r:'Bridesmaid'},{n:'Vera',r:'Junior Bridesmaid'}],accent:crim},
          {title:'Groomsmen',people:[{n:'Elias',r:'Best Man'},{n:'Marcus',r:'Groomsman'},{n:'Dorian',r:'Groomsman'},{n:'Victor',r:'Ring Bearer'}],accent:pri}
        ].map((group,gi)=>(
          <div key={gi} style={{marginTop:gi===0?32:24}}>
            <h3 style={{fontFamily:"'Cinzel',serif",fontSize:'0.85rem',letterSpacing:'0.2em',textTransform:'uppercase',color:group.accent,marginBottom:20}}>{group.title}</h3>
            <div style={{display:'flex',gap:24,justifyContent:'center',flexWrap:'wrap'}}>
              {group.people.map((p,i)=>(
                <motion.div key={i} whileHover={{y:-6}} style={{textAlign:'center',width:120}}>
                  <div style={{width:90,height:90,borderRadius:'50%',overflow:'hidden',margin:'0 auto 10px',border:`2px solid ${group.accent}`,background:bdr,filter:dark?'brightness(0.8)':'none'}}>
                    <img src="/images/head1.jpg" alt={p.n} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  </div>
                  <p style={{fontFamily:"'Cinzel',serif",fontSize:'0.8rem',color:dark?'white':txt,marginBottom:2}}>{p.n}</p>
                  <p style={{fontFamily:"'Cinzel',serif",fontSize:'0.55rem',letterSpacing:'0.15em',textTransform:'uppercase',color:group.accent}}>{p.r}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* VIDEO */}
      <section style={{padding:'80px 24px',textAlign:'center'}}>
        <p style={{fontFamily:"'Cinzel',serif",fontSize:'0.6rem',letterSpacing:'0.4em',color:crim,textTransform:'uppercase',marginBottom:10}}>Our Story Told Visually</p>
        <h2 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:'2.2rem',color:dark?'white':txt,marginBottom:28}}>Video</h2>
        <div style={{maxWidth:800,margin:'0 auto',borderRadius:4,overflow:'hidden',border:`2px solid ${pri}40`,boxShadow:`0 0 60px rgba(212,175,55,0.15)`,position:'relative',background:'#000',paddingTop:'56.25%'}}>
          <iframe style={{position:'absolute',inset:0,width:'100%',height:'100%',border:'none'}}
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Noah & Eve"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>
        </div>
      </section>

      {/* WISHES */}
      <Wishes dark={dark}/>

      {/* FAQ */}
      <FAQ dark={dark}/>

      {/* TELEGRAM */}
      <section style={{padding:'60px 24px',background:dark?'#0D0D0D':P.bgL,textAlign:'center'}}>
        <p style={{fontFamily:"'Cinzel',serif",fontSize:'0.6rem',letterSpacing:'0.4em',color:crim,textTransform:'uppercase',marginBottom:10}}>Direct Line</p>
        <h2 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:'2rem',color:dark?'white':txt,marginBottom:16}}>Reach Us on Telegram</h2>
        <p style={{fontFamily:"'EB Garamond',serif",fontStyle:'italic',color:mut,marginBottom:24,maxWidth:440,margin:'0 auto 24px'}}>Send us your questions, well wishes, or just say hello. We're always available via Telegram.</p>
        <a href="https://t.me/yeserge_leta1" target="_blank" rel="noopener noreferrer"
          style={{display:'inline-flex',alignItems:'center',gap:10,padding:'14px 28px',background:'#0088cc',color:'white',borderRadius:4,fontFamily:"'Cinzel',serif",fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.2em',textDecoration:'none',boxShadow:'0 4px 20px rgba(0,136,204,0.4)'}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.68 7.93c-.12.56-.44.7-.88.43l-2.44-1.8-1.18 1.13c-.13.13-.24.24-.49.24l.17-2.49 4.49-4.06c.19-.17-.04-.27-.3-.1L7.69 14.6l-2.4-.75c-.52-.16-.53-.52.11-.77l9.38-3.62c.44-.15.82.11.86.34z"/></svg>
          @yeserge_leta1
        </a>
      </section>

      {/* RSVP */}
      <section id="rsvp" style={{padding:'80px 24px',background:dark?'#0D0D0D':P.bgL,textAlign:'center'}}>
        <p style={{fontFamily:"'Cinzel',serif",fontSize:'0.6rem',letterSpacing:'0.4em',color:crim,textTransform:'uppercase',marginBottom:10}}>Reserve Your Seat</p>
        <h2 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:'2.2rem',color:dark?'white':txt,marginBottom:8}}>RSVP</h2>
        <p style={{fontFamily:"'EB Garamond',serif",fontStyle:'italic',color:mut,marginBottom:36}}>Please respond by August 1, 2026</p>
        <form style={{maxWidth:480,margin:'0 auto',display:'flex',flexDirection:'column',gap:14}} onSubmit={e=>{e.preventDefault();const fd=new FormData(e.target);const msg=`RSVP — Noah & Eve\nName: ${fd.get('name')}\nEmail: ${fd.get('email')}\nAttendance: ${fd.get('att')}\nGuests: ${fd.get('guests')}`;window.open(`https://t.me/yeserge_leta1?text=${encodeURIComponent(msg)}`,'_blank');e.target.reset();}}>
          {[['name','Full Name','text'],['email','Email Address','email']].map(([id,ph,tp])=>(
            <input key={id} name={id} type={tp} placeholder={ph} required style={{padding:'14px 18px',background:card,border:`1px solid ${bdr}`,borderRadius:4,color:txt,fontFamily:"'EB Garamond',serif",fontSize:'1rem',outline:'none'}}/>
          ))}
          <select name="att" required style={{padding:'14px 18px',background:card,border:`1px solid ${bdr}`,borderRadius:4,color:txt,fontFamily:"'EB Garamond',serif",fontSize:'1rem',outline:'none'}}>
            <option value="">Attendance</option>
            <option>Joyfully Accepts</option>
            <option>Regretfully Declines</option>
          </select>
          <input name="guests" type="number" min="1" max="5" placeholder="Number of Guests" style={{padding:'14px 18px',background:card,border:`1px solid ${bdr}`,borderRadius:4,color:txt,fontFamily:"'EB Garamond',serif",fontSize:'1rem',outline:'none'}}/>
          <button type="submit" style={{padding:'16px',background:`linear-gradient(135deg,${crim},#8B0000)`,color:'white',border:'none',borderRadius:4,fontFamily:"'Cinzel',serif",fontSize:'0.7rem',letterSpacing:'0.25em',textTransform:'uppercase',cursor:'pointer',boxShadow:'0 4px 20px rgba(192,57,43,0.4)',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
            <Send size={14}/> Confirm Attendance
          </button>
        </form>
      </section>

      {/* QR CODE */}
      <section style={{padding:'80px 24px',textAlign:'center',background:dark?'#0D0D0D':P.bgL}}>
        <p style={{fontFamily:"'Cinzel',serif",fontSize:'0.6rem',letterSpacing:'0.4em',color:crim,textTransform:'uppercase',marginBottom:10}}>Your Entry Pass</p>
        <h2 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:'2rem',color:dark?'white':txt,marginBottom:10}}>QR Code Entry</h2>
        <NDiv dark={dark}/>
        <p style={{fontFamily:"'EB Garamond',serif",fontStyle:'italic',color:mut,maxWidth:460,margin:'0 auto 28px'}}>Present this QR code at the Grand Noir Ballroom entrance for seamless, VIP-style entry.</p>
        <div style={{display:'inline-flex',flexDirection:'column',alignItems:'center',gap:16,padding:28,background:card,border:`1px solid ${pri}`,borderRadius:4,boxShadow:`0 0 40px rgba(212,175,55,0.2)`}}>
          <div style={{position:'relative'}}>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://yesergeleta.com/entry?event=noah-eve-2026')}&bgcolor=141414&color=D4AF37`} alt="QR Entry" style={{width:200,height:200,borderRadius:4,display:'block'}}/>
            <div style={{position:'absolute',inset:0,border:`1px solid ${pri}40`,pointerEvents:'none'}}/>
          </div>
          <div style={{textAlign:'center'}}>
            <p style={{fontFamily:"'Cinzel Decorative',serif",fontSize:'1rem',color:pri}}>Noah & Eve</p>
            <p style={{fontFamily:"'Cinzel',serif",fontSize:'0.6rem',letterSpacing:'0.2em',color:mut,textTransform:'uppercase'}}>September 10, 2026 · 7:00 PM</p>
          </div>
        </div>
      </section>

      <footer style={{padding:'40px 24px',textAlign:'center',borderTop:`1px solid ${bdr}`}}>
        <p style={{fontFamily:"'Cinzel Decorative',serif",fontSize:'1.5rem',color:pri}}>Noah & Eve</p>
        <p style={{fontFamily:"'Cinzel',serif",fontSize:'0.55rem',letterSpacing:'0.3em',color:mut,marginTop:6,textTransform:'uppercase'}}>September 10, 2026 · Midnight Noir</p>
      </footer>

      <button onClick={()=>setD(!dark)} style={{position:'fixed',bottom:24,left:24,zIndex:100,width:44,height:44,borderRadius:'50%',background:pri,color:'#000',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 4px 20px rgba(212,175,55,0.5)`}}>
        {dark?<Sun size={18}/>:<Moon size={18}/>}
      </button>
      <MusicPlayer dark={dark}/>
    </div>
  );
}
