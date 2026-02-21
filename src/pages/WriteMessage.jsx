import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Flower } from 'lucide-react';
import '../index.css';

const WriteMessage = ({ message, setMessage, recipient, setRecipient, signoff, setSignoff, sender, setSender }) => {
    const navigate = useNavigate();

    return (
        <div className="page-container animate-fade-in" style={{ padding: '0.5rem 0', position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>

            {/* Decorative background flowers */}
            <div style={{ position: 'absolute', top: '10%', left: '5%', opacity: 0.2 }}><Flower size={48} color="var(--color-primary)" /></div>
            <div style={{ position: 'absolute', top: '20%', right: '10%', opacity: 0.2 }}><Flower size={32} color="var(--color-accent)" /></div>
            <div style={{ position: 'absolute', bottom: '30%', left: '15%', opacity: 0.2 }}><Flower size={64} color="var(--color-secondary)" /></div>
            <div style={{ position: 'absolute', bottom: '10%', right: '5%', opacity: 0.2 }}><Flower size={40} color="var(--color-primary)" /></div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', zIndex: 1, transform: 'scale(1.1)', transformOrigin: 'top center' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.1rem', fontFamily: 'var(--font-mono)', letterSpacing: '2px', textTransform: 'uppercase', zIndex: 1 }}>WRITE YOUR MESSAGE</h2>

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
                                placeholder="[Beloved] ,"
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
                                placeholder="[Always] ,"
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
                                placeholder="[Secret Admirer]"
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
