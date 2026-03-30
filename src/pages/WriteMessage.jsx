import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Flower } from 'lucide-react';
import '../index.css';
import ThemeToggle from '../components/ThemeToggle';

const WriteMessage = ({ message, setMessage, recipient, setRecipient, signoff, setSignoff, sender, setSender, theme, setTheme }) => {
    const navigate = useNavigate();
    const [showMithilaPopup, setShowMithilaPopup] = useState(false);
    const hasShownPopup = useRef(false);

    useEffect(() => {
        if (/mithila/i.test(sender) && !hasShownPopup.current) {
            hasShownPopup.current = true;
            setShowMithilaPopup(true);
        }
    }, [sender]);

    return (
        <div className="page-container animate-fade-in" style={{ padding: '0.5rem 0', position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>

            {/* Decorative background flowers */}
            <div style={{ position: 'absolute', top: '10%', left: '5%', opacity: 0.2 }}><Flower size={48} color="var(--color-primary)" /></div>
            <div style={{ position: 'absolute', top: '20%', right: '10%', opacity: 0.2 }}><Flower size={32} color="var(--color-accent)" /></div>
            <div style={{ position: 'absolute', bottom: '30%', left: '15%', opacity: 0.2 }}><Flower size={64} color="var(--color-secondary)" /></div>
            <div style={{ position: 'absolute', bottom: '10%', right: '5%', opacity: 0.2 }}><Flower size={40} color="var(--color-primary)" /></div>

            {/* 🌸 Secret Easter Egg Popup */}
            {showMithilaPopup && (
                <div style={{
                    position: 'fixed', inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.35)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '1rem',
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #fff0f6 0%, #fce4f5 50%, #f3e8ff 100%)',
                        borderRadius: '28px',
                        boxShadow: '0 20px 60px rgba(205,180,219,0.5)',
                        padding: '2.5rem 2rem',
                        maxWidth: '320px',
                        width: '100%',
                        textAlign: 'center',
                        animation: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        {/* Floating hearts background */}
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

                        {/* Big heart */}
                        <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem', lineHeight: 1 }}>🩷</div>

                        {/* Message */}
                        <p style={{
                            fontFamily: 'var(--font-caveat)',
                            fontSize: '2rem',
                            color: '#b05080',
                            lineHeight: 1.3,
                            margin: '0 0 1.5rem',
                        }}>
                            Hey there my<br />cutie pie 🩷
                        </p>

                        {/* Close button */}
                        <button
                            onClick={() => setShowMithilaPopup(false)}
                            style={{
                                background: 'linear-gradient(135deg, #e8a0c8, #cdb4db)',
                                border: 'none',
                                borderRadius: '50px',
                                padding: '0.75rem 2rem',
                                color: 'white',
                                fontFamily: 'var(--font-main)',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                letterSpacing: '0.5px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 16px rgba(205,180,219,0.5)',
                                transition: 'transform 0.2s',
                            }}
                            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                        >
                            Yes I am 💕
                        </button>
                    </div>
                    <style>{`
                        @keyframes popIn {
                            from { opacity: 0; transform: scale(0.7); }
                            to   { opacity: 1; transform: scale(1); }
                        }
                        @keyframes floatHeart {
                            0%   { transform: translateY(0) scale(1);   opacity: 0.5; }
                            50%  { transform: translateY(-60px) scale(1.2); opacity: 0.8; }
                            100% { transform: translateY(-120px) scale(1); opacity: 0; }
                        }
                    `}</style>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', zIndex: 1, transform: 'scale(0.99)', transformOrigin: 'top center' }}>
                <div className="delay-1 animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', marginBottom: '2rem', zIndex: 1 }}>
                    <ThemeToggle theme={theme} setTheme={setTheme} />
                    <h2 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'var(--font-mono)', letterSpacing: '2px', textTransform: 'uppercase', zIndex: 1 }}>WRITE YOUR MESSAGE</h2>
                </div>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 1rem', width: '100%' }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '400px',
                        backgroundColor: 'white',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-md)',
                        padding: '2.5rem',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        {/* Card styling lines */}
                        <div style={{
                            position: 'absolute',
                            top: '20px', left: '20px', right: '20px', bottom: '20px',
                            border: '1px solid rgba(0,0,0,0.05)',
                            pointerEvents: 'none'
                        }}></div>

                        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '1rem', fontFamily: 'var(--font-caveat)', fontSize: '1.8rem', color: 'var(--color-primary)' }}>
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
                                minHeight: '250px',
                                border: 'none',
                                resize: 'none',
                                fontFamily: 'var(--font-caveat)',
                                fontSize: '1.6rem',
                                lineHeight: '1.6',
                                outline: 'none',
                                background: 'transparent'
                            }}
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '1rem', fontFamily: 'var(--font-caveat)', fontSize: '1.8rem', color: 'var(--color-primary)' }}>
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
                                    width: '250px',
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
                                    width: '250px',
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
