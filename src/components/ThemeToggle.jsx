import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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

    const spawnParticle = () => {
        const id = particleIdCounter.current++;
        // Random horizontal spread (-100 to 100)
        const dx = (Math.random() - 0.5) * 200;
        // Random fall distance (100 to 300)
        const dy = 100 + Math.random() * 200;
        // Random rotation
        const rotEnd = (Math.random() - 0.5) * 720;

        setParticles(prev => [...prev, { id, dx, dy, rotEnd }]);
    };

    const startConfetti = () => {
        // Spawn one immediately, then start interval
        spawnParticle();
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(spawnParticle, 80);
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

            {/* Render active floating particles */}
            {particles.map(p => (
                <img
                    key={p.id}
                    src={currentImage}
                    className="flower-particle"
                    onAnimationEnd={() => {
                        setParticles(prev => prev.filter(x => x.id !== p.id));
                    }}
                    style={{
                        width: '24px',
                        height: '24px',
                        left: '50%',
                        top: '50%',
                        marginLeft: '-12px',
                        marginTop: '-12px',
                        '--dx': p.dx,
                        '--dy': p.dy,
                        '--rot-end': `${p.rotEnd}deg`,
                    }}
                />
            ))}
        </div>
    );
};

export default ThemeToggle;

