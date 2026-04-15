import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sun, Moon, MapPin, Play, Pause, Volume2, VolumeX, Send, ChevronDown, ChevronUp } from 'lucide-react';

const P = {
  bg:'#FAF8FF', bgD:'#12101A',
  card:'#FFFFFF', cardD:'#1E1A2E',
  pri:'#7B5EA7', priD:'#C4AAFF',
  acc:'#F0A8C0', accD:'#FF90B8',
  mint:'#4ABFB0', mintD:'#7BCFC0',
  txt:'#2D2040', txtD:'#EDE8FF',
  mut:'#7060A0', mutD:'#9080B0',
  bdr:'#E8E0FF', bdrD:'#3A3050',
};

function useCD(t){const[s,ss]=useState({d:0,h:0,m:0,s:0});useEffect(()=>{const id=setInterval(()=>{const diff=new Date(t)-Date.now();if(diff<=0)return;ss({d:Math.floor(diff/86400000),h:Math.floor(diff/3600000%24),m:Math.floor(diff/60000%60),s:Math.floor(diff/1000%60)});},1000);return()=>clearInterval(id);},[t]);return s;}

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

  const toggle = () => { if (!ref.current) return; if (play) { ref.current.pause(); setP(false); } else { ref.current.play().catch(() => { }); setP(true); } };
  return (<>
    <audio ref={ref} loop muted={mute} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" />
    <div style={{ position: 'fixed', bottom: 24, right: 80, zIndex: 100, display: 'flex', gap: 8 }}>
      <button onClick={toggle} style={{ width: 44, height: 44, borderRadius: 100, background: `linear-gradient(135deg,${p},${P.acc})`, color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 20px ${p}50` }}>
        {play ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <button onClick={() => setM(!mute)} style={{ width: 44, height: 44, borderRadius: 100, background: dark ? 'rgba(196,170,255,0.2)' : 'rgba(123,94,167,0.1)', color: p, border: `1.5px solid ${p}40`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {mute ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </div>
  </>);
}


function PDiv({dark}){
  const p=dark?P.priD:P.pri;const a=dark?P.accD:P.acc;
  return(<div style={{display:'flex',alignItems:'center',gap:10,justifyContent:'center',margin:'16px 0'}}>
    <div style={{flex:1,maxWidth:70,height:2,background:`linear-gradient(to right,transparent,${p})`,borderRadius:99}}/>
    <div style={{width:8,height:8,borderRadius:'50%',background:a}}/>
    <Heart size={14} fill={p} color={p}/>
    <div style={{width:8,height:8,borderRadius:'50%',background:a}}/>
    <div style={{flex:1,maxWidth:70,height:2,background:`linear-gradient(to left,transparent,${p})`,borderRadius:99}}/>
  </div>);
}

function Wishes({dark}){
  const[name,setN]=useState('');const[msg,setM]=useState('');
  const[list,setL]=useState(()=>{try{return JSON.parse(localStorage.getItem('maya_sam_wishes')||'[]');}catch{return[];}});
  const card=dark?P.cardD:P.card;const bdr=dark?P.bdrD:P.bdr;
  const p=dark?P.priD:P.pri;const txt=dark?P.txtD:P.txt;const mut=dark?P.mutD:P.mut;
  const sub=(e)=>{e.preventDefault();if(!name.trim()||!msg.trim())return;
    const nl=[{name,msg,date:new Date().toLocaleDateString()},...list];
    setL(nl);localStorage.setItem('maya_sam_wishes',JSON.stringify(nl));setN('');setM('');
    window.open(`https://t.me/yeserge_leta1?text=${encodeURIComponent(`🌸 Wish for Maya & Sam from ${name}: ${msg}`)}`,'_blank');
  };
  return(
    <section style={{padding:'80px 24px',background:dark?'rgba(196,170,255,0.05)':P.bg,position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:-80,right:-80,width:300,height:300,borderRadius:'40% 60% 60% 40% / 60% 40% 60% 40%',background:dark?'rgba(240,168,192,0.06)':'rgba(240,168,192,0.12)',pointerEvents:'none'}}/>
      <div style={{maxWidth:680,margin:'0 auto',position:'relative',zIndex:1}}>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.2em',textTransform:'uppercase',color:dark?P.accD:P.acc,marginBottom:8,textAlign:'center'}}>Leave Us a Message</p>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.2rem',fontStyle:'italic',color:dark?P.txtD:P.txt,textAlign:'center'}}>Blessings & Wishes 💐</h2>
        <PDiv dark={dark}/>
        <form onSubmit={sub} style={{display:'flex',flexDirection:'column',gap:12,marginBottom:28}}>
          <input value={name} onChange={e=>setN(e.target.value)} placeholder="Your Name" style={{padding:'13px 18px',background:card,border:`1.5px solid ${bdr}`,borderRadius:100,color:txt,fontFamily:"'DM Sans',sans-serif",fontSize:'0.95rem',outline:'none',textAlign:'center'}}/>
          <textarea value={msg} onChange={e=>setM(e.target.value)} placeholder="Share your love & wishes with Maya & Sam…" rows={4} style={{padding:'13px 18px',background:card,border:`1.5px solid ${bdr}`,borderRadius:20,color:txt,fontFamily:"'DM Sans',sans-serif",fontSize:'0.95rem',outline:'none',resize:'vertical'}}/>
          <button type="submit" style={{padding:'14px',background:`linear-gradient(135deg,${p},${dark?P.accD:P.acc})`,color:'white',border:'none',borderRadius:100,fontFamily:"'DM Sans',sans-serif",fontSize:'0.9rem',fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,boxShadow:`0 8px 24px ${p}40`}}>
            <Send size={15}/> Send Blessing 🌸
          </button>
        </form>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {list.map((w,i)=>(
            <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} style={{background:card,border:`1.5px solid ${bdr}`,borderRadius:16,padding:'16px 20px',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(to right,${p},${dark?P.accD:P.acc},${dark?P.mintD:P.mint})`}}/>
              <p style={{fontFamily:"'DM Serif Display',serif",fontStyle:'italic',color:p,marginBottom:4,fontSize:'1.1rem'}}>{w.name}</p>
              <p style={{fontFamily:"'DM Sans',sans-serif",color:mut,lineHeight:1.7,fontSize:'0.95rem'}}>{w.msg}</p>
              <p style={{fontSize:'0.65rem',color:mut,marginTop:6,opacity:0.5}}>{w.date}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ({dark}){
  const[open,setO]=useState(null);
  const card=dark?P.cardD:P.card;const bdr=dark?P.bdrD:P.bdr;
  const p=dark?P.priD:P.pri;const txt=dark?P.txtD:P.txt;const mut=dark?P.mutD:P.mut;
  const items=[
    {q:'What is the dress code? 👗',a:'We love colour! Please wear pastel, floral, or garden-inspired outfits. Think lavender, blush, mint, or soft yellow. No black please — we want the photos to pop!'},
    {q:'Are children welcome? 👶',a:'Absolutely! We love little ones. We have a dedicated kids corner with activities during the reception.'},
    {q:'Is the venue wheelchair accessible? ♿',a:'Yes, the Garden of Serene is fully accessible. Please let us know in your RSVP if you need any special arrangements.'},
    {q:'Will there be a shuttle service? 🚌',a:'Yes! A shuttle runs from Fairview Square every 30 minutes starting at 1:30 PM. The last shuttle returns at midnight.'},
    {q:'Can I request a song? 🎵',a:'Yes! Include your must-play song in the RSVP form and we\'ll pass it to our DJ. 73% of requests get played — no promises for anything too spicy!'},
    {q:'Where can I stay nearby? 🏨',a:'We\'ve reserved a block of rooms at The Bloom Hotel (5 minutes away) at a special rate. Use code MAYASAM26 when booking.'},
  ];
  return(
    <section style={{padding:'80px 24px',background:dark?'rgba(196,170,255,0.05)':P.bg,position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',bottom:-80,left:-80,width:250,height:250,borderRadius:'60% 40% 40% 60% / 40% 60% 40% 60%',background:dark?'rgba(75,191,176,0.06)':'rgba(75,191,176,0.1)',pointerEvents:'none'}}/>
      <div style={{maxWidth:720,margin:'0 auto',position:'relative',zIndex:1}}>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.2em',textTransform:'uppercase',color:dark?P.mintD:P.mint,marginBottom:8,textAlign:'center'}}>Got Questions?</p>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.2rem',fontStyle:'italic',color:dark?P.txtD:P.txt,textAlign:'center'}}>FAQ</h2>
        <PDiv dark={dark}/>
        <div style={{marginTop:20,display:'flex',flexDirection:'column',gap:10}}>
          {items.map((item,i)=>(
            <div key={i} style={{background:card,border:`1.5px solid ${open===i?p:bdr}`,borderRadius:16,overflow:'hidden',transition:'border-color 0.3s',boxShadow:open===i?`0 4px 20px ${p}20`:'none'}}>
              <button onClick={()=>setO(open===i?null:i)} style={{width:'100%',padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',background:'none',border:'none',cursor:'pointer',textAlign:'left',gap:12}}>
                <span style={{fontFamily:"'DM Serif Display',serif",fontStyle:'italic',fontSize:'1.05rem',color:txt}}>{item.q}</span>
                {open===i?<ChevronUp size={16} color={p}/>:<ChevronDown size={16} color={p}/>}
              </button>
              <AnimatePresence>
                {open===i&&(<motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} style={{overflow:'hidden',padding:'0 20px 16px',fontFamily:"'DM Sans',sans-serif",fontSize:'0.9rem',lineHeight:1.8,color:mut}}>{item.a}</motion.div>)}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function MayaAndSam(){
  const[dark,setD]=useState(false);const[sc,setSc]=useState(false);
  const cd=useCD('2026-07-14T15:00:00');
  useEffect(()=>{const fn=()=>setSc(window.scrollY>60);window.addEventListener('scroll',fn);return()=>window.removeEventListener('scroll',fn);},[]);

  const bg=dark?P.bgD:P.bg;const card=dark?P.cardD:P.card;const p=dark?P.priD:P.pri;
  const acc=dark?P.accD:P.acc;const mint=dark?P.mintD:P.mint;
  const txt=dark?P.txtD:P.txt;const mut=dark?P.mutD:P.mut;const bdr=dark?P.bdrD:P.bdr;

  const Blob=(props)=><div style={{position:'absolute',borderRadius:'40% 60% 60% 40% / 60% 40% 60% 40%',pointerEvents:'none',...props.style}}/>;

  return(
    <div style={{background:bg,color:txt,minHeight:'100vh',fontFamily:"'DM Sans',sans-serif",transition:'all 0.4s',overflowX:'hidden'}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Serif+Display:ital@0;1&family=Satisfy&display=swap" rel="stylesheet"/>

      {/* NAV */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:50,background:sc?(dark?'rgba(18,16,26,0.95)':'rgba(250,248,255,0.95)'):'transparent',backdropFilter:'blur(12px)',borderBottom:sc?`1px solid ${bdr}`:'none',transition:'all 0.4s',padding:'0 40px',height:68,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span style={{fontFamily:"'Satisfy',cursive",fontSize:'1.4rem',color:p}}>Maya & Sam</span>
        <div style={{display:'flex',gap:24}}>
          {['About','Story','Timeline','Locations','Gallery','Party','Wishes','RSVP'].map(l=>(
            <a key={l} href={`#${l.toLowerCase()}`} style={{fontSize:'0.8rem',fontWeight:500,color:mut,textDecoration:'none'}}>{l}</a>
          ))}
        </div>
        <button onClick={()=>setD(!dark)} style={{background:dark?'rgba(196,170,255,0.15)':'rgba(123,94,167,0.08)',border:'none',borderRadius:20,padding:'8px 12px',color:p,cursor:'pointer',display:'flex',alignItems:'center',gap:6,fontSize:'0.8rem'}}>
          {dark?<Sun size={14}/>:<Moon size={14}/>}
        </button>
      </nav>

      {/* HERO */}
      <section style={{position:'relative',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',paddingTop:80}}>
        <Blob style={{width:500,height:500,background:dark?'rgba(196,170,255,0.08)':'rgba(123,94,167,0.07)',top:-100,right:-100}}/>
        <Blob style={{width:350,height:350,background:dark?'rgba(240,168,192,0.08)':'rgba(240,168,192,0.12)',bottom:-80,left:-80,borderRadius:'70% 30% 30% 70% / 70% 70% 30% 30%'}}/>
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:1}} style={{position:'relative',zIndex:10,textAlign:'center',padding:'0 24px'}}>
          <motion.div animate={{y:[0,-10,0]}} transition={{repeat:Infinity,duration:4}} style={{display:'inline-block',marginBottom:20}}>
            <div style={{width:180,height:180,borderRadius:'50%',overflow:'hidden',border:`4px solid ${acc}`,margin:'0 auto',boxShadow:`0 20px 60px ${p}30`}}>
              <img src="/images/couple_1.jpg" alt="Maya & Sam" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            </div>
          </motion.div>
          <p style={{fontSize:'0.75rem',fontWeight:600,letterSpacing:'0.25em',textTransform:'uppercase',color:acc,marginBottom:8}}>We're getting married 🌸</p>
          <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(3rem,9vw,6rem)',fontStyle:'italic',lineHeight:1.05,marginBottom:12,background:dark?`linear-gradient(135deg,${P.priD},${P.accD})`:`linear-gradient(135deg,${P.pri},${P.acc})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Maya & Sam</h1>
          <p style={{color:mut,fontSize:'1.1rem',marginBottom:8}}>July 14, 2026 · Garden of Serene, Portland</p>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginBottom:28}}>
            <div style={{width:40,height:2,background:`linear-gradient(to right,transparent,${p})`,borderRadius:99}}/>
            <Heart size={14} fill={acc} color={acc}/>
            <div style={{width:40,height:2,background:`linear-gradient(to left,transparent,${p})`,borderRadius:99}}/>
          </div>
          <div style={{display:'flex',justifyContent:'center',gap:8,flexWrap:'wrap'}}>
            {['Our Story','Events','Gallery','RSVP'].map(l=>(
              <a key={l} href={`#${l.toLowerCase().replace(' ','-')}`} style={{padding:'10px 20px',borderRadius:100,border:`1.5px solid ${p}`,color:p,textDecoration:'none',fontSize:'0.85rem',fontWeight:500,background:dark?'rgba(196,170,255,0.1)':'rgba(123,94,167,0.04)'}}>{l}</a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* COUNTDOWN */}
      <section style={{padding:'70px 24px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <Blob style={{width:500,height:200,background:dark?'rgba(240,168,192,0.05)':'rgba(240,168,192,0.09)',top:'50%',left:'50%',transform:'translate(-50%,-50%)',borderRadius:'40%'}}/>
        <p style={{fontFamily:"'DM Serif Display',serif",fontStyle:'italic',color:mut,marginBottom:28,fontSize:'1.05rem',position:'relative'}}>Our celebration begins in…</p>
        <div style={{display:'flex',justifyContent:'center',gap:14,flexWrap:'wrap',position:'relative'}}>
          {[['Days',cd.d,[p,acc]],['Hours',cd.h,[acc,mint]],['Mins',cd.m,[mint,p]],['Secs',cd.s,[p,acc]]].map(([l,v,grad])=>(
            <motion.div key={l} whileHover={{scale:1.06}} style={{background:card,border:`1.5px solid ${bdr}`,borderRadius:20,padding:'20px 18px',minWidth:88,textAlign:'center',boxShadow:`0 8px 30px ${grad[0]}18`,position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(to right,${grad[0]},${grad[1]})`,borderRadius:'20px 20px 0 0'}}/>
              <span style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.4rem',color:grad[0],display:'block',lineHeight:1}}>{String(v).padStart(2,'0')}</span>
              <span style={{fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.15em',color:mut,display:'block',marginTop:6}}>{l}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ABOUT US */}
      <section id="about" style={{padding:'80px 24px',position:'relative',overflow:'hidden'}}>
        <Blob style={{width:300,height:300,background:dark?'rgba(196,170,255,0.06)':'rgba(196,170,255,0.09)',top:0,right:-60,borderRadius:'60% 40% 60% 40%'}}/>
        <div style={{maxWidth:1000,margin:'0 auto',position:'relative',zIndex:1}}>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.2em',textTransform:'uppercase',color:acc,marginBottom:8,textAlign:'center'}}>Meet the Couple</p>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.5rem',fontStyle:'italic',color:txt,textAlign:'center'}}>About Us</h2>
          <PDiv dark={dark}/>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:28,marginTop:32}}>
            {[
              {name:'Maya Chen',role:'The Bride 🌸',img:'/images/couple_1.jpg',desc:'A landscape architect who turns empty lots into wildflower meadows. Maya believes every space deserves beauty — and she brought that gift to Sam\'s world from day one.',border:acc},
              {name:'Samuel Park',role:'The Groom 🌿',img:'/images/couple_2.jpg',desc:'A documentary filmmaker who chases honest moments. Sam has been quietly filming their love story for three years — "the greatest film I\'ll ever make," he says.',border:mint},
            ].map((person,i)=>(
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.15}}
                style={{background:card,border:`2px solid ${person.border}30`,borderRadius:24,overflow:'hidden',boxShadow:`0 8px 40px ${person.border}18`}}>
                <div style={{height:260,overflow:'hidden',position:'relative'}}>
                  <img src={person.img} alt={person.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  <div style={{position:'absolute',bottom:0,left:0,right:0,height:60,background:`linear-gradient(to top,${card},transparent)`}}/>
                </div>
                <div style={{padding:'20px',textAlign:'center'}}>
                  <h3 style={{fontFamily:"'DM Serif Display',serif",fontStyle:'italic',fontSize:'1.6rem',color:txt,marginBottom:4}}>{person.name}</h3>
                  <p style={{fontSize:'0.75rem',fontWeight:600,letterSpacing:'0.15em',textTransform:'uppercase',color:person.border,marginBottom:12}}>{person.role}</p>
                  <PDiv dark={dark}/>
                  <p style={{fontSize:'0.9rem',lineHeight:1.8,color:mut,fontStyle:'italic'}}>{person.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LOVE STORY */}
      <section id="our-story" style={{padding:'80px 24px',background:dark?'rgba(196,170,255,0.05)':P.bg,position:'relative',overflow:'hidden'}}>
        <Blob style={{width:400,height:400,background:dark?'rgba(75,191,176,0.06)':'rgba(75,191,176,0.08)',bottom:-100,right:-60,borderRadius:'30% 70% 70% 30% / 30% 30% 70% 70%'}}/>
        <div style={{maxWidth:800,margin:'0 auto',position:'relative',zIndex:1}}>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.2em',textTransform:'uppercase',color:mint,marginBottom:8,textAlign:'center'}}>How We Fell</p>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.5rem',fontStyle:'italic',color:txt,textAlign:'center'}}>Our Love Story</h2>
          <PDiv dark={dark}/>
          <div style={{marginTop:40,display:'grid',gap:20}}>
            {[
              {year:'2021 🏡',title:'Rooftop Garden Party',desc:'They met surrounded by fairy lights and lavender. Sam handed Maya a glass of elderflower lemonade. She smiled. He was done for.',img:'/images/couple_3.jpg',align:'left',bg:acc},
              {year:'2022 🌊',title:'The Coastal Weekend',desc:'Three days road-tripping up the Oregon coast. They discovered secret beaches, local donuts, and that they could talk about nothing for 8 hours straight.',img:'/images/couple_4.jpg',align:'right',bg:mint},
              {year:'2023 💐',title:'The Garden Proposal',desc:'Sam recreated their first meeting on their rooftop, complete with fairy lights, lavender, and a string quartet. He was so nervous he forgot the ring in the car.',img:'/images/couple_1.jpg',align:'left',bg:p},
              {year:'2026 🌸',title:'Forever Begins',desc:'Today, Maya and Sam say "I do" in the most beautiful garden they could find — still chasing beauty together, always.',img:'/images/hero3.jpg',align:'right',bg:acc},
            ].map((it,i)=>(
              <motion.div key={i} initial={{opacity:0,x:it.align==='left'?-30:30}} whileInView={{opacity:1,x:0}} viewport={{once:true}}
                style={{display:'flex',flexDirection:it.align==='right'?'row-reverse':'row',gap:20,alignItems:'center',flexWrap:'wrap'}}>
                <div style={{flex:'0 0 140px',borderRadius:it.align==='left'?'60% 40% 40% 60%':'40% 60% 60% 40%',overflow:'hidden',height:160,border:`3px solid ${it.bg}40`}}>
                  <img src={it.img} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                </div>
                <div style={{flex:1,minWidth:220,background:card,border:`1.5px solid ${bdr}`,borderRadius:20,padding:'20px',boxShadow:`0 4px 20px ${it.bg}15`}}>
                  <p style={{fontSize:'0.7rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.15em',color:it.bg,marginBottom:4}}>{it.year}</p>
                  <h4 style={{fontFamily:"'DM Serif Display',serif",fontStyle:'italic',fontSize:'1.2rem',color:txt,marginBottom:8}}>{it.title}</h4>
                  <p style={{fontSize:'0.9rem',color:mut,lineHeight:1.7}}>{it.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="timeline" style={{padding:'80px 24px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.2em',textTransform:'uppercase',color:acc,marginBottom:8}}>July 14, 2026</p>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.5rem',fontStyle:'italic',color:txt}}>Our Wedding Day</h2>
        <PDiv dark={dark}/>
        <div style={{maxWidth:600,margin:'28px auto 0',display:'flex',flexDirection:'column',gap:12}}>
          {[
            {t:'1:30 PM',e:'🌿',title:'Shuttle Departs',desc:'From Fairview Square to Garden of Serene',c:mint},
            {t:'2:00 PM',e:'🌸',title:'Guest Arrival',desc:'Welcome drinks & garden stroll',c:acc},
            {t:'3:00 PM',e:'💍',title:'Ceremony',desc:'Vows under the wisteria arch',c:p},
            {t:'4:30 PM',e:'📸',title:'Golden Hour',desc:'Couple portraits & garden exploration',c:mint},
            {t:'5:30 PM',e:'🥂',title:'Cocktail Hour',desc:'Garden bites & champagne',c:acc},
            {t:'7:00 PM',e:'🎉',title:'Dinner & Dancing',desc:'Feast, music & dancing all night',c:p},
          ].map((ev,i)=>(
            <motion.div key={i} initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.07}}
              style={{display:'flex',alignItems:'center',gap:16,background:card,border:`1.5px solid ${ev.c}30`,borderRadius:16,padding:'14px 20px',textAlign:'left',boxShadow:`0 4px 16px ${ev.c}12`}}>
              <div style={{width:48,height:48,borderRadius:14,background:`${ev.c}18`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',flexShrink:0,border:`1.5px solid ${ev.c}30`}}>{ev.e}</div>
              <div style={{flex:1}}>
                <p style={{fontSize:'0.65rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.15em',color:ev.c,marginBottom:2}}>{ev.t}</p>
                <h4 style={{fontFamily:"'DM Serif Display',serif",fontStyle:'italic',fontSize:'1rem',color:txt,marginBottom:2}}>{ev.title}</h4>
                <p style={{fontSize:'0.85rem',color:mut}}>{ev.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LOCATIONS */}
      <section id="locations" style={{padding:'80px 24px',background:dark?'rgba(196,170,255,0.05)':P.bg,position:'relative',overflow:'hidden'}}>
        <Blob style={{width:350,height:350,background:dark?'rgba(240,168,192,0.05)':'rgba(240,168,192,0.1)',top:-60,left:-60,borderRadius:'70% 30%'}}/>
        <div style={{maxWidth:1000,margin:'0 auto',position:'relative',zIndex:1}}>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.2em',textTransform:'uppercase',color:acc,marginBottom:8,textAlign:'center'}}>Where to Go</p>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.5rem',fontStyle:'italic',color:txt,textAlign:'center'}}>Event Locations</h2>
          <PDiv dark={dark}/>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:20,marginTop:28}}>
            {[
              {type:'Ceremony 💍',name:'Garden of Serene',address:'420 Bloom Road, Portland, OR 97201',time:'3:00 PM',note:'Outdoor garden ceremony',bg:p,maps:'https://maps.google.com/?q=Portland+OR'},
              {type:'Reception 🥂',name:'The Greenhouse Ballroom',address:'420 Bloom Road, Portland, OR 97201',time:'5:00 PM',note:'Indoor/outdoor reception venue',bg:acc,maps:'https://maps.google.com/?q=Portland+OR'},
              {type:'After Party 🎵',name:'The Lavender Rooftop',address:'18 Petal Street, Portland, OR 97202',time:'10:30 PM',note:'Rooftop bar & stargazing',bg:mint,maps:'https://maps.google.com/?q=Portland+OR'},
            ].map((loc,i)=>(
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}
                style={{background:card,border:`2px solid ${loc.bg}30`,borderRadius:24,padding:'28px 20px',textAlign:'center',boxShadow:`0 8px 30px ${loc.bg}18`,position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:4,background:`linear-gradient(to right,${loc.bg},${loc.bg}80)`}}/>
                <p style={{fontSize:'0.7rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.15em',color:loc.bg,marginBottom:8}}>{loc.type}</p>
                <h4 style={{fontFamily:"'DM Serif Display',serif",fontStyle:'italic',fontSize:'1.3rem',color:txt,marginBottom:6}}>{loc.name}</h4>
                <p style={{fontSize:'0.82rem',color:mut,marginBottom:4,display:'flex',alignItems:'center',justifyContent:'center',gap:5}}><MapPin size={12} color={loc.bg}/>{loc.address}</p>
                <p style={{fontFamily:"'DM Serif Display',serif",fontStyle:'italic',color:loc.bg,marginBottom:4,fontSize:'0.9rem'}}>{loc.time}</p>
                <p style={{fontSize:'0.8rem',color:mut,marginBottom:16}}>{loc.note}</p>
                <a href={loc.maps} target="_blank" rel="noopener noreferrer" style={{display:'inline-block',padding:'8px 20px',border:`1.5px solid ${loc.bg}`,borderRadius:100,fontSize:'0.78rem',fontWeight:600,color:loc.bg,textDecoration:'none',background:`${loc.bg}10`}}>Get Directions</a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" style={{padding:'80px 24px',textAlign:'center'}}>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.2em',textTransform:'uppercase',color:mint,marginBottom:8}}>Bloom Reel</p>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.5rem',fontStyle:'italic',color:txt}}>Our Gallery</h2>
        <PDiv dark={dark}/>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12,maxWidth:1000,margin:'28px auto 0'}}>
          {['/images/couple_1.jpg','/images/couple_2.jpg','/images/couple_3.jpg','/images/couple_4.jpg','/images/temp5.jpg','/images/hero3.jpg','/images/temp3.webp','/images/hero2.jpg'].map((img,i)=>(
            <motion.div key={i} whileHover={{scale:1.04,rotate:[-1,1,0,0][i%4]}} style={{borderRadius:[24,16,20,14,24,16,20,14][i],overflow:'hidden', aspectRatio:i%3===0?'3/4':'4/3', border:`3px solid ${[acc,p,mint,acc,p,mint,acc,p][i]}30`,boxShadow:`0 4px 20px ${[acc,p,mint][i%3]}18`}}>
              <img src={img} alt="" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BRIDAL PARTY */}
      <section id="party" style={{padding:'80px 24px',background:dark?'rgba(196,170,255,0.05)':P.bg,textAlign:'center',position:'relative',overflow:'hidden'}}>
        <Blob style={{width:300,height:300,background:dark?'rgba(240,168,192,0.05)':'rgba(240,168,192,0.1)',top:0,right:-40,borderRadius:'60% 40%'}}/>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.2em',textTransform:'uppercase',color:acc,marginBottom:8,position:'relative'}}>Our Beloved Circle</p>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.5rem',fontStyle:'italic',color:txt,position:'relative'}}>Bridesmaids & Groomsmen</h2>
        <PDiv dark={dark}/>
        {[
          {title:'Bridesmaids 🌸',ppl:[{n:'Lily',r:'Maid of Honor'},{n:'Jade',r:'Bridesmaid'},{n:'Chloe',r:'Bridesmaid'},{n:'Fern',r:'Flower Girl'}],c:acc},
          {title:'Groomsmen 🌿',ppl:[{n:'Ryan',r:'Best Man'},{n:'Ethan',r:'Groomsman'},{n:'Lucas',r:'Groomsman'},{n:'Owen',r:'Ring Bearer'}],c:mint},
        ].map((g,gi)=>(
          <div key={gi} style={{marginTop:gi===0?28:20,position:'relative'}}>
            <h3 style={{fontSize:'0.8rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.15em',color:g.c,marginBottom:20}}>{g.title}</h3>
            <div style={{display:'flex',gap:20,justifyContent:'center',flexWrap:'wrap'}}>
              {g.ppl.map((person,i)=>(
                <motion.div key={i} whileHover={{y:-8}} style={{textAlign:'center',width:120}}>
                  <div style={{width:92,height:92,borderRadius:'50%',overflow:'hidden',margin:'0 auto 10px',border:`3px solid ${g.c}`,background:bdr,boxShadow:`0 8px 20px ${g.c}30`}}>
                    <img src="/images/head1.jpg" alt={person.n} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  </div>
                  <p style={{fontFamily:"'DM Serif Display',serif",fontStyle:'italic',color:txt,fontWeight:600,fontSize:'1rem'}}>{person.n}</p>
                  <p style={{fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:g.c}}>{person.r}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* VIDEO */}
      <section style={{padding:'80px 24px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <Blob style={{width:400,height:200,background:dark?'rgba(196,170,255,0.06)':'rgba(196,170,255,0.1)',top:'50%',left:'50%',transform:'translate(-50%,-50%)',borderRadius:'40%'}}/>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.2em',textTransform:'uppercase',color:p,marginBottom:8,position:'relative'}}>A Little Preview</p>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.5rem',fontStyle:'italic',color:txt,marginBottom:28,position:'relative'}}>Our Story in Motion 🎬</h2>
        <div style={{maxWidth:800,margin:'0 auto',borderRadius:24,overflow:'hidden',border:`3px solid ${acc}30`,boxShadow:`0 16px 60px ${p}20`,position:'relative',background:'#000',paddingTop:'56.25%'}}>
          <iframe style={{position:'absolute',inset:0,width:'100%',height:'100%',border:'none'}} src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Maya & Sam" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>
        </div>
        <p style={{color:mut,marginTop:14,fontSize:'0.85rem',position:'relative',fontStyle:'italic'}}>Filmed by Bloom Studio · 2026</p>
      </section>

      {/* WISHES */}
      <Wishes dark={dark}/>
      {/* FAQ */}
      <FAQ dark={dark}/>

      {/* TELEGRAM */}
      <section style={{padding:'60px 24px',background:dark?'rgba(196,170,255,0.05)':P.bg,textAlign:'center',position:'relative',overflow:'hidden'}}>
        <Blob style={{width:300,height:300,background:dark?'rgba(240,168,192,0.05)':'rgba(240,168,192,0.1)',bottom:-80,right:-60,borderRadius:'70% 30% 30% 70%'}}/>
        <div style={{position:'relative',zIndex:1}}>
          <p style={{fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.2em',textTransform:'uppercase',color:acc,marginBottom:8}}>Stay Connected 💬</p>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2rem',fontStyle:'italic',color:txt,marginBottom:16}}>Chat With Us</h2>
          <p style={{color:mut,fontSize:'0.95rem',maxWidth:440,margin:'0 auto 24px'}}>Have a question or want to say hi? We're on Telegram! Send us a message and we'll reply with hearts. 💕</p>
          <a href="https://t.me/yeserge_leta1" target="_blank" rel="noopener noreferrer"
            style={{display:'inline-flex',alignItems:'center',gap:10,padding:'14px 28px',background:`linear-gradient(135deg,#0088cc,#229ED9)`,color:'white',borderRadius:100,fontSize:'0.9rem',fontWeight:600,textDecoration:'none',boxShadow:'0 8px 24px rgba(0,136,204,0.35)'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.68 7.93c-.12.56-.44.7-.88.43l-2.44-1.8-1.18 1.13c-.13.13-.24.24-.49.24l.17-2.49 4.49-4.06c.19-.17-.04-.27-.3-.1L7.69 14.6l-2.4-.75c-.52-.16-.53-.52.11-.77l9.38-3.62c.44-.15.82.11.86.34z"/></svg>
            Message Us on Telegram
          </a>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" style={{padding:'80px 24px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <Blob style={{width:500,height:400,background:dark?'rgba(196,170,255,0.07)':'rgba(196,170,255,0.12)',top:'50%',left:'50%',transform:'translate(-50%,-50%)',borderRadius:'60% 40%'}}/>
        <div style={{position:'relative',zIndex:1}}>
          <p style={{fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.2em',textTransform:'uppercase',color:acc,marginBottom:8}}>Join the Bloom 🌷</p>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.5rem',fontStyle:'italic',color:txt,marginBottom:8}}>Will You Be There?</h2>
          <p style={{color:mut,marginBottom:36,fontSize:'0.95rem'}}>Please RSVP by June 1, 2026</p>
          <form style={{maxWidth:460,margin:'0 auto',display:'flex',flexDirection:'column',gap:12}}
            onSubmit={e=>{e.preventDefault();const fd=new FormData(e.target);const msg=`🌸 RSVP — Maya & Sam\nName: ${fd.get('name')}\nEmail: ${fd.get('email')}\nAttendance: ${fd.get('att')}\nGuests: ${fd.get('guests')}\nSong: ${fd.get('song')}`;window.open(`https://t.me/yeserge_leta1?text=${encodeURIComponent(msg)}`,'_blank');e.target.reset();}}>
            {[['name','Your Name 🌸','text'],['email','Email Address','email'],['song','Your favourite song request 🎵','text']].map(([id,ph,tp])=>(
              <input key={id} name={id} type={tp} placeholder={ph} style={{padding:'13px 18px',background:card,border:`1.5px solid ${bdr}`,borderRadius:100,color:txt,fontFamily:"'DM Sans',sans-serif",fontSize:'0.9rem',outline:'none',textAlign:'center'}}/>
            ))}
            <select name="att" required style={{padding:'13px 18px',background:card,border:`1.5px solid ${bdr}`,borderRadius:100,color:txt,fontFamily:"'DM Sans',sans-serif",fontSize:'0.9rem',outline:'none',textAlign:'center'}}>
              <option value="">Will you attend?</option>
              <option>Joyfully Accepts 🌸</option>
              <option>Regretfully Declines</option>
            </select>
            <input name="guests" type="number" min="1" max="5" placeholder="Number of Guests" style={{padding:'13px 18px',background:card,border:`1.5px solid ${bdr}`,borderRadius:100,color:txt,fontFamily:"'DM Sans',sans-serif",fontSize:'0.9rem',outline:'none',textAlign:'center'}}/>
            <button type="submit" style={{padding:'16px',background:`linear-gradient(135deg,${p},${acc})`,color:'white',border:'none',borderRadius:100,fontFamily:"'DM Sans',sans-serif",fontSize:'0.95rem',fontWeight:600,cursor:'pointer',boxShadow:`0 8px 30px ${p}35`,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
              <Send size={15}/> Confirm Attendance 💐
            </button>
          </form>
        </div>
      </section>

      {/* QR CODE */}
      <section style={{padding:'80px 24px',background:dark?'rgba(196,170,255,0.05)':P.bg,textAlign:'center',position:'relative',overflow:'hidden'}}>
        <p style={{fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.2em',textTransform:'uppercase',color:acc,marginBottom:8}}>Your Entry Pass</p>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.2rem',fontStyle:'italic',color:txt,marginBottom:10}}>QR Code Entry 🌺</h2>
        <PDiv dark={dark}/>
        <p style={{color:mut,maxWidth:440,margin:'0 auto 28px',fontSize:'0.9rem',fontStyle:'italic'}}>Show this code at the garden gate. Your invitation is as unique as your love story!</p>
        <div style={{display:'inline-flex',flexDirection:'column',alignItems:'center',gap:16,padding:28,background:card,border:`2px solid ${acc}40`,borderRadius:28,boxShadow:`0 16px 60px ${p}20`}}>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://yesergeleta.com/entry?event=maya-sam-2026')}&bgcolor=ffffff&color=7B5EA7`} alt="QR Entry" style={{width:200,height:200,borderRadius:12,display:'block'}}/>
          <div style={{textAlign:'center'}}>
            <p style={{fontFamily:"'Satisfy',cursive",fontSize:'1.4rem',color:p}}>Maya & Sam</p>
            <p style={{fontSize:'0.72rem',fontWeight:600,letterSpacing:'0.15em',color:mut,textTransform:'uppercase'}}>July 14, 2026 · 3:00 PM</p>
            <p style={{fontSize:'0.7rem',color:acc,marginTop:2}}>Garden of Serene, Portland</p>
          </div>
        </div>
      </section>

      <footer style={{padding:'40px 24px',textAlign:'center',borderTop:`1px solid ${bdr}`}}>
        <p style={{fontFamily:"'Satisfy',cursive",fontSize:'2rem',color:p}}>Maya & Sam</p>
        <PDiv dark={dark}/>
        <p style={{fontSize:'0.72rem',color:mut,letterSpacing:'0.15em',textTransform:'uppercase'}}>July 14, 2026 · Liquid Bloom</p>
      </footer>

      <button onClick={()=>setD(!dark)} style={{position:'fixed',bottom:24,left:24,zIndex:100,width:44,height:44,borderRadius:100,background:`linear-gradient(135deg,${p},${acc})`,color:'white',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 4px 20px ${p}50`}}>
        {dark?<Sun size={18}/>:<Moon size={18}/>}
      </button>
      <MusicPlayer dark={dark}/>
    </div>
  );
}
