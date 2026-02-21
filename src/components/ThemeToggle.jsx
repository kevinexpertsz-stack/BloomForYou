import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';

const ThemeToggle = ({ theme, setTheme }) => {
    const location = useLocation();
    const isSharedLink = location.search.includes('data=');
    const [particles, setParticles] = useState([]);
    const intervalRef = useRef(null);
    let particleIdCounter = useRef(0);

    // Cleanup interval on unmount
    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    if (isSharedLink) return null;

    const themeSequence = ['default', 'sunflower', 'blueflower', 'orchid', 'alstromeria', 'ranuculus'];
    const themeImages = {
        'default': '/Main.png',
        'sunflower': '/Main 2.png',
        'blueflower': '/Main 3.png',
        'orchid': '/Main 4.png',
        'alstromeria': '/Main 5.png',
        'ranuculus': '/Main 6.png'
    };

    const currentImage = themeImages[theme] || themeImages['default'];

    const burstConfetti = () => {
        const newParticles = Array.from({ length: 25 }).map(() => ({
            id: particleIdCounter.current++,
            // Top screen spread (5% to 95% of screen width)
            left: 5 + Math.random() * 90,
            // Fall duration (2s to 4s)
            duration: 2 + Math.random() * 2,
            // Horizontal drift during fall (-50vw to +50vw)
            dx: (Math.random() - 0.5) * 100,
            // Random end rotation
            rotEnd: (Math.random() - 0.5) * 1080,
            // Slight stagger delay
            delay: Math.random() * 0.4
        }));
        setParticles(prev => [...prev, ...newParticles]);
    };

    const startConfetti = () => {
        burstConfetti();
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(burstConfetti, 800);
    };

    const stopConfetti = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const handleClick = () => {
        const currentIndex = themeSequence.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themeSequence.length;
        setTheme(themeSequence[nextIndex]);
    };

    return (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
                src={currentImage}
                alt="Toggle Theme"
                title="Click to change colors, hold for confetti!"
                onClick={handleClick}
                onContextMenu={(e) => e.preventDefault()}
                onPointerDown={startConfetti}
                onPointerUp={stopConfetti}
                onPointerLeave={stopConfetti}
                onPointerCancel={stopConfetti}
                style={{
                    width: '42px',
                    height: '42px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    zIndex: 10,
                    userSelect: 'none',
                    WebkitTouchCallout: 'none'
                }}
            />

            {/* Render active floating particles via Portal to cover full screen */}
            {typeof document !== 'undefined' && createPortal(
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 99999, overflow: 'hidden' }}>
                    {particles.map(p => (
                        <img
                            key={p.id}
                            src={currentImage}
                            className="flower-burst-particle"
                            onAnimationEnd={() => {
                                setParticles(prev => prev.filter(x => x.id !== p.id));
                            }}
                            style={{
                                width: '64px',
                                height: '64px',
                                position: 'absolute',
                                left: `${p.left}vw`,
                                top: '-80px', // start above screen
                                '--dx': p.dx,
                                '--duration': `${p.duration}s`,
                                '--delay': `${p.delay}s`,
                                '--rot-end': `${p.rotEnd}deg`,
                            }}
                        />
                    ))}
                </div>,
                document.body
            )}
        </div>
    );
};

export default ThemeToggle;

