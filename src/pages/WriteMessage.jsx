import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Flower } from 'lucide-react';
import '../index.css';
import ThemeToggle from '../components/ThemeToggle';

const HEART_FLOWERS = [
    { x: 0,   y: -17, flower: '1-Rose' },
    { x: 5,   y: -20, flower: '1-Peony' },
    { x: 10,  y: -19, flower: '2-Lily' },
    { x: 14,  y: -15, flower: '1-Rose' },
    { x: 17,  y: -9,  flower: '1-Peony' },
    { x: 18,  y: -2,  flower: '2-Lily' },
    { x: 16,  y: 6,   flower: '1-Rose' },
    { x: 12,  y: 13,  flower: '1-Peony' },
    { x: 7,   y: 18,  flower: '2-Lily' },
    { x: 2,   y: 22,  flower: '1-Rose' },
    { x: 0,   y: 24,  flower: '1-Peony' },
    { x: -2,  y: 22,  flower: '1-Rose' },
    { x: -7,  y: 18,  flower: '2-Lily' },
    { x: -12, y: 13,  flower: '1-Peony' },
    { x: -16, y: 6,   flower: '1-Rose' },
    { x: -18, y: -2,  flower: '2-Lily' },
    { x: -17, y: -9,  flower: '1-Peony' },
    { x: -14, y: -15, flower: '1-Rose' },
    { x: -10, y: -19, flower: '2-Lily' },
    { x: -5,  y: -20, flower: '1-Peony' },
];

const WriteMessage = ({ message, setMessage, recipient, setRecipient, signoff, setSignoff, sender, setSender, theme, setTheme }) => {
    const navigate = useNavigate();
    const [showMithilaPopup, setShowMithilaPopup] = useState(false);
    const [closingPopup, setClosingPopup] = useState(false);
    const hasShownPopup = useRef(false);

    const handleCloseMithila = () => {
        setClosingPopup(true);
        setTimeout(() => {
            setShowMithilaPopup(false);
            setClosingPopup(false);
        }, 600);
    };

    useEffect(() => {
        if (/mithila/i.test(sender)) {
            if (!hasShownPopup.current) {
                hasShownPopup.current = true;
                setShowMithilaPopup(true);
            }
        } else {
            hasShownPopup.current = false;
        }
    }, [sender]);

    return (
        <div className="page-container animate-fade-in" style={{ padding: '0.5rem 0', position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>

            <div style={{ position: 'absolute', top: '10%', left: '5%', opacity: 0.2 }}><Flower size={48} color="var(--color-primary)" /></div>
            <div style={{ position: 'absolute', top: '20%', right: '10%', opacity: 0.2 }}><Flower size={32} color="var(--color-accent)" /></div>
            <div style={{ position: 'absolute', bottom: '30%', left: '15%', opacity: 0.2 }}><Flower size={64} color="var(--color-secondary)" /></div>
            <div style={{ position: 'absolute', bottom: '10%', right: '5%', opacity: 0.2 }}><Flower size={40} color="var(--color-primary)" /></div>

            {showMithilaPopup && (
                <div style={{
                    position: 'fixed', inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.35)',
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '1rem',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {HEART_FLOWERS.map((hf, i) => (
                            <div
                                key={i}
                                style={{
                                    position: 'absolute',
                                    left: `calc(50% + ${hf.x} * clamp(7.5px, 2.1vw, 11px) - clamp(34px, 6.5vw, 48px))`,
                                    top: `calc(50% + ${hf.y} * clamp(7.5px, 2.1vh, 11px) - clamp(34px, 6.5vw, 48px))`,
                                    width: 'clamp(68px, 13vw, 96px)',
                                    height: 'clamp(68px, 13vw, 96px)',
                                    zIndex: 10003,
                                    filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.18))',
                                    animation: closingPopup
                                        ? 'flowerHeartBurst 0.6s ease forwards'
                                        : `flowerHeartPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.035}s both`,
                                }}
                            >
                                <img
                                    src={`/flowers/${hf.flower}.png`}
                                    alt="Heart Flower"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            </div>
                        ))}
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg, #fff0f6 0%, #fce4f5 50%, #f3e8ff 100%)',
                        borderRadius: '28px',
                        boxShadow: '0 20px 60px rgba(205,180,219,0.6)',
                        padding: '2.5rem 2rem',
                        maxWidth: '300px',
                        width: '100%',
                        textAlign: 'center',
                        animation: closingPopup
                            ? 'heartBurst 0.6s ease forwards'
                            : 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                        position: 'relative',
                        zIndex: 10002,
                        overflow: 'hidden',
                    }}>
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                            {['10%', '30%', '55%', '75%', '90%'].map((left, i) => (
                                <span key={i} style={{
                                    position: 'absolute',
                                    bottom: '-10px',
                                    left,
                                    fontSize: `${1 + i * 0.3}rem`,
                                    animation: `floatHeart ${2 + i * 0.5}s ease-in-out infinite`,
                                    animationDelay: `${i * 0.4}s`,
                                    opacity: 0.5,
                                }}>🩷</span>
                            ))}
                        </div>

                        <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem', lineHeight: 1 }}>🩷</div>

                        <p style={{
                            fontFamily: 'var(--font-caveat)',
                            fontSize: '2rem',
                            color: '#b05080',
                            lineHeight: 1.3,
                            margin: '0 0 1.5rem',
                        }}>
                            Hey there<br />cutie pie 🩷
                        </p>

                        <button
                            onClick={handleCloseMithila}
                            style={{
                                background: 'linear-gradient(135deg, #e8a0c8, #cdb4db)',
                                border: 'none',
                                borderRadius: '50px',
                                padding: '0.75rem 2rem',
                                color: 'white',
                                fontFamily: 'var(--font-main)',
                                fontWeight: 600,
                                fontSize: '1.6rem',
                                cursor: 'pointer',
                                boxShadow: '0 4px 16px rgba(205,180,219,0.5)',
                                transition: 'transform 0.2s',
                                lineHeight: 1,
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            🥰❤️
                        </button>
                    </div>
                    <style>{`
                        @keyframes popIn {
                            from { opacity: 0; transform: scale(0.7); }
                            to   { opacity: 1; transform: scale(1); }
                        }
                        @keyframes heartBurst {
                            0%   { transform: scale(1);    opacity: 1; }
                            30%  { transform: scale(1.18); opacity: 1; }
                            60%  { transform: scale(0.92); opacity: 0.7; }
                            100% { transform: scale(1.4);  opacity: 0; }
                        }
                        @keyframes floatHeart {
                            0%   { transform: translateY(0) scale(1);   opacity: 0.5; }
                            50%  { transform: translateY(-60px) scale(1.2); opacity: 0.8; }
                            100% { transform: translateY(-120px) scale(1); opacity: 0; }
                        }
                        @keyframes flowerHeartPop {
                            0% {
                                opacity: 0;
                                transform: scale(0) rotate(-30deg);
                            }
                            70% {
                                opacity: 1;
                                transform: scale(1.25) rotate(10deg);
                            }
                            100% {
                                opacity: 1;
                                transform: scale(1) rotate(0deg);
                            }
                        }
                        @keyframes flowerHeartBurst {
                            0% {
                                opacity: 1;
                                transform: scale(1);
                            }
                            40% {
                                opacity: 1;
                                transform: scale(1.3);
                            }
                            100% {
                                opacity: 0;
                                transform: scale(1.6) translateY(-20px);
                            }
                        }
                    `}</style>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', zIndex: 1, transform: 'scale(0.99)', transformOrigin: 'top center' }}>
                <div className="delay-1 animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', marginBottom: '1.5rem', zIndex: 1 }}>
                    <ThemeToggle theme={theme} setTheme={setTheme} />
                    <h2 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'var(--font-mono)', letterSpacing: '2px', textTransform: 'uppercase', zIndex: 1, color: 'var(--color-text)' }}>WRITE YOUR MESSAGE</h2>
                </div>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 0.5rem', width: '100%' }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '440px',
                        backgroundColor: 'white',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-md)',
                        padding: 'clamp(1.25rem, 4vw, 2.5rem)',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '15px', left: '15px', right: '15px', bottom: '15px',
                            border: '1px solid rgba(0,0,0,0.05)',
                            pointerEvents: 'none'
                        }}></div>

                        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '1rem', fontFamily: 'var(--font-caveat)', fontSize: '1.8rem', color: 'var(--color-accent)' }}>
                            <span style={{ marginRight: '0.4rem' }}>Dear</span>
                            <input
                                type="text"
                                value={recipient}
                                onChange={e => setRecipient(e.target.value)}
                                placeholder="Beloved ,"
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    background: 'transparent',
                                    fontFamily: 'inherit',
                                    fontSize: 'inherit',
                                    color: 'inherit',
                                    width: '100%',
                                }}
                            />
                        </div>

                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="I could fill a thousand of these digital cards and still not have enough space to say everything. But the most important thing you need to know is..."
                            style={{
                                width: '100%',
                                minHeight: '220px',
                                border: 'none',
                                resize: 'none',
                                fontFamily: 'var(--font-caveat)',
                                fontSize: '1.6rem',
                                lineHeight: '1.6',
                                outline: 'none',
                                background: 'transparent'
                            }}
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '1rem', fontFamily: 'var(--font-caveat)', fontSize: '1.8rem', color: 'var(--color-accent)' }}>
                            <input
                                type="text"
                                value={signoff}
                                onChange={e => setSignoff(e.target.value)}
                                placeholder="Always ,"
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    background: 'transparent',
                                    fontFamily: 'inherit',
                                    fontSize: 'inherit',
                                    color: 'inherit',
                                    textAlign: 'right',
                                    width: 'min(100%, 250px)',
                                }}
                            />
                            <input
                                type="text"
                                value={sender}
                                onChange={e => setSender(e.target.value)}
                                placeholder="Secret Admirer"
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    background: 'transparent',
                                    fontFamily: 'inherit',
                                    fontSize: 'inherit',
                                    color: 'inherit',
                                    textAlign: 'right',
                                    width: 'min(100%, 250px)',
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '600px', margin: '2rem auto 0', width: '100%', zIndex: 1 }}>
                    <button
                        className="btn btn-outline"
                        onClick={() => navigate('/customize')}
                        style={{ width: '48%', padding: '0.75rem' }}
                    >
                        <ArrowLeft size={18} /> Back
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/final')}
                        style={{ width: '48%', padding: '0.75rem' }}
                    >
                        Share <ArrowRight size={18} />
                    </button>
                </div>

                <div style={{ flex: 1, minHeight: '1rem' }}></div>
            </div>

            <div style={{ flex: 1, minHeight: '1rem' }}></div>
        </div>
    );
};

export default WriteMessage;
