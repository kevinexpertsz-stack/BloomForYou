import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Home = ({ theme, setTheme }) => {
    const navigate = useNavigate();
    const [isPopping, setIsPopping] = useState(false);
    const [petals, setPetals] = useState([]);

    const themeSequence = ['default', 'sunflower', 'blueflower', 'orchid', 'alstromeria', 'ranuculus'];
    const themeImages = {
        'default': '/Main.png',
        'sunflower': '/Main 2.png',
        'blueflower': '/Main 3.png',
        'orchid': '/Main 4.png',
        'alstromeria': '/Main 5.png',
        'ranuculus': '/Main 6.png'
    };

    const themeDetails = {
        'default': { name: 'Lavender Dream', emoji: '🪻' },
        'sunflower': { name: 'Sunny Sunflower', emoji: '🌻' },
        'blueflower': { name: 'Ocean Bluebell', emoji: '🩵' },
        'orchid': { name: 'Royal Orchid', emoji: '🌺' },
        'alstromeria': { name: 'Blushing Blossom', emoji: '🌸' },
        'ranuculus': { name: 'Peach Ranunculus', emoji: '🌷' }
    };

    const handleThemeChange = () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(25);
        }
        const currentIndex = themeSequence.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themeSequence.length;
        const nextTheme = themeSequence[nextIndex];
        setTheme(nextTheme);

        setIsPopping(true);
        setTimeout(() => setIsPopping(false), 550);

        const burstEmojis = [
            themeDetails[nextTheme]?.emoji || '🌸',
            '✨',
            '🌸',
            themeDetails[nextTheme]?.emoji || '✨',
            '✨',
            '🌸'
        ];
        const newPetals = burstEmojis.map((emoji, i) => {
            const angle = (i * (360 / burstEmojis.length) + (Math.random() * 24 - 12)) * (Math.PI / 180);
            const distance = 55 + Math.random() * 30;
            return {
                id: Date.now() + i,
                emoji,
                tx: Math.round(Math.cos(angle) * distance),
                ty: Math.round(Math.sin(angle) * distance),
                scale: +(0.8 + Math.random() * 0.4).toFixed(2)
            };
        });
        setPetals(newPetals);
        setTimeout(() => setPetals([]), 750);
    };

    return (
        <div
            className="home-page animate-fade-in"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                minHeight: '100dvh',
                padding: 'env(safe-area-inset-top, 1rem) 1rem env(safe-area-inset-bottom, 1rem)',
                boxSizing: 'border-box',
            }}
        >
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                width: '100%',
                gap: 'clamp(0.6rem, 2.5vh, 1.4rem)',
            }}>
                <div className="logo-container" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                            src={themeImages[theme] || themeImages['default']}
                            alt="BloomsForYou Logo"
                            onClick={handleThemeChange}
                            style={{
                                width: 'clamp(90px, 20vw, 140px)',
                                height: 'clamp(90px, 20vw, 140px)',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.07))',
                                cursor: 'pointer',
                                transition: 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                transform: isPopping ? 'rotate(360deg) scale(1.18)' : 'rotate(0deg) scale(1)',
                                animation: isPopping ? 'none' : 'gentleFloat 4s ease-in-out infinite',
                                display: 'block',
                                userSelect: 'none',
                                WebkitTouchCallout: 'none'
                            }}
                            onMouseEnter={(e) => {
                                if (!isPopping) e.currentTarget.style.transform = 'scale(1.08) rotate(5deg)';
                            }}
                            onMouseLeave={(e) => {
                                if (!isPopping) e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                            }}
                        />
                        {petals.map(p => (
                            <span
                                key={p.id}
                                style={{
                                    position: 'absolute',
                                    pointerEvents: 'none',
                                    fontSize: '1.25rem',
                                    left: '50%',
                                    top: '50%',
                                    marginLeft: '-10px',
                                    marginTop: '-10px',
                                    '--tx': `${p.tx}px`,
                                    '--ty': `${p.ty}px`,
                                    '--scale': p.scale,
                                    animation: 'burstPetal 0.75s cubic-bezier(0.25, 0.8, 0.25, 1) forwards',
                                    zIndex: 20,
                                    userSelect: 'none'
                                }}
                            >
                                {p.emoji}
                            </span>
                        ))}
                    </div>

                    <button
                        onClick={handleThemeChange}
                        style={{
                            marginTop: '0.45rem',
                            background: 'rgba(255, 255, 255, 0.88)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                            borderRadius: '20px',
                            padding: '0.35rem 0.9rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            userSelect: 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                        }}
                    >
                        <span style={{ fontSize: '1rem', lineHeight: 1 }}>{themeDetails[theme]?.emoji || '🌸'}</span>
                        <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.78rem',
                            fontWeight: '600',
                            color: 'var(--color-text)',
                            letterSpacing: '0.5px'
                        }}>
                            {themeDetails[theme]?.name || 'Theme'}
                        </span>
                        <span style={{
                            fontSize: '0.72rem',
                            color: 'var(--color-primary)',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: '500'
                        }}>
                            · tap to change ✨
                        </span>
                    </button>
                </div>

                <h1
                    className="delay-1 animate-fade-in"
                    style={{
                        fontFamily: 'var(--font-title)',
                        fontSize: 'clamp(2.2rem, 10vw, 4rem)',
                        letterSpacing: '1px',
                        color: 'var(--color-text)',
                        fontWeight: 'normal',
                        whiteSpace: 'nowrap',
                        margin: 0,
                    }}
                >
                    BloomsForYou
                </h1>

                <p
                    className="delay-2 animate-fade-in"
                    style={{
                        fontSize: 'clamp(0.7rem, 2.2vw, 0.9rem)',
                        color: 'var(--color-text)',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '1px',
                        lineHeight: '1.7',
                        textTransform: 'uppercase',
                        margin: 0,
                    }}
                >
                    Forever Flowers<br />Just For You
                </p>

                <button
                    className="btn btn-primary delay-3 animate-fade-in"
                    onClick={() => navigate('/select')}
                    style={{
                        padding: 'clamp(0.85rem, 2.5vh, 1.2rem) 2rem',
                        fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
                        width: 'min(80%, 300px)',
                        marginTop: 'clamp(0.4rem, 1.5vh, 0.8rem)',
                    }}
                >
                    Pick Your Blooms
                </button>
            </div>

            <footer
                className="delay-4 animate-fade-in"
                style={{
                    textAlign: 'center',
                    color: 'var(--color-text)',
                    opacity: 0.85,
                    fontSize: 'clamp(0.65rem, 1.8vw, 0.8rem)',
                    fontFamily: 'var(--font-ndot)',
                    letterSpacing: '1px',
                    paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0.5rem)',
                    lineHeight: 2,
                }}
            >
                <p style={{ textTransform: 'uppercase', margin: 0 }}>
                    Deployed on{' '}
                    <a
                        href="https://vercel.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
                    >Vercel</a>
                </p>
                <p style={{ textTransform: 'uppercase', margin: 0 }}>
                    Made by{' '}
                    <a
                        href="https://www.instagram.com/cubickevin?igsh=MWc3dHlhc3d0ODMzaA%3D%3D&utm_source=qr"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
                    >CUBICKEVIN</a>
                </p>
            </footer>
        </div>
    );
};

export default Home;
