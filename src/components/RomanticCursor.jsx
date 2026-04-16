import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RomanticCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [particles, setParticles] = useState([]);
  const [bursts, setBursts] = useState([]);
  
  const lastPos = useRef({ x: 0, y: 0 });
  const lastSpawnTime = useRef(0);
  const particleId = useRef(0);
  const burstId = useRef(0);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      setMousePos({ x, y });

      // Check distance for velocity-based spawning
      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const now = Date.now();

      // Only spawn if movement > 10px and at least 60ms passed
      if (distance > 10 && now - lastSpawnTime.current > 60) {
        const id = particleId.current++;
        const newParticle = {
          id,
          x,
          y,
          scale: Math.random() * (1.2 - 0.8) + 0.8,
          offsetX: (Math.random() - 0.5) * 8, // ±4px
          delay: Math.random() * 0.05, // 0-50ms random delay
        };

        setParticles((prev) => [...prev.slice(-7), newParticle]); // Max 8 active
        lastPos.current = { x, y };
        lastSpawnTime.current = now;
      }

      // Context awareness: Check if hovering interactive elements
      const target = e.target;
      const isInteractive = target.closest('button, a, input, select, textarea, [role="button"]');
      setIsHovering(!!isInteractive);
    };

    const handleClick = (e) => {
      const { clientX: x, clientY: y } = e;
      const id = burstId.current++;
      
      // Spawn 5 sparkle particles for the radial burst
      const newBurst = Array.from({ length: 6 }).map((_, i) => ({
        id: `${id}-${i}`,
        x,
        y,
        angle: (i * 60) + (Math.random() * 20 - 10), // Evenly distributed with slight randomness
        distance: Math.random() * (25 - 10) + 10, // 10px-25px
      }));

      setBursts((prev) => [...prev, ...newBurst]);
      
      // Cleanup burst after 400ms
      setTimeout(() => {
        setBursts((prev) => prev.filter(b => !b.id.startsWith(`${id}-`)));
      }, 450);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  // Cleanup particles over time
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => prev.slice(1));
    }, 800);
    return () => clearInterval(interval);
  }, [particles.length]);

  if (window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
      {/* Main Cursor Ring */}
      <motion.div
        animate={{
          x: mousePos.x - (isHovering ? 20 : 15),
          y: mousePos.y - (isHovering ? 20 : 15),
          scale: isHovering ? 1.5 : 1,
          borderColor: isHovering ? '#FF69B4' : '#D4AF37',
          backgroundColor: isHovering ? 'rgba(255, 105, 180, 0.1)' : 'rgba(212, 175, 55, 0.05)',
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 250, mass: 0.5 }}
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          border: '2px solid',
          boxShadow: isHovering ? '0 0 15px rgba(255, 105, 180, 0.5)' : '0 0 10px rgba(212, 175, 55, 0.3)',
        }}
      />

      {/* Trail Particles */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.6, scale: p.scale * 1.5, x: p.x + p.offsetX, y: p.y }}
            animate={{ 
              opacity: 0, 
              scale: 0.3, 
              y: p.y - 20, // Upward drift
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              width: 6,
              height: 6,
              background: '#D4AF37',
              borderRadius: '50%',
              filter: 'blur(1px)',
              boxShadow: '0 0 5px #D4AF37',
            }}
          >
             <svg viewBox="0 0 24 24" fill="#D4AF37" style={{ width: '100%', height: '100%' }}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
             </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Click Burst Sparkles */}
      {bursts.map((b) => (
        <motion.div
          key={b.id}
          initial={{ x: b.x, y: b.y, opacity: 1, scale: 1, rotate: 0 }}
          animate={{
            x: b.x + Math.cos(b.angle * Math.PI / 180) * b.distance,
            y: b.y + Math.sin(b.angle * Math.PI / 180) * b.distance,
            opacity: 0,
            scale: 0.5,
            rotate: 180,
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: 10,
            height: 10,
            color: '#FFD700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: 'drop-shadow(0 0 2px gold)',
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default RomanticCursor;
