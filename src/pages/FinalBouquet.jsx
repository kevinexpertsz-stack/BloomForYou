import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Link as LinkIcon, Check } from 'lucide-react';
import '../index.css';
import ThemeToggle from '../components/ThemeToggle';

const sceneries = {
    'bg2': { bg: '#fcf6f0', bgImage: '/background/Scene 02.jpg' },
    'bg3': { bg: '#f2e8e9', bgImage: '/background/Scene 03.jpg' },
    'bg5': { bg: '#f7ecec', bgImage: '/background/Scene 05.jpg' },
    'bg6': { bg: '#eceef7', bgImage: '/background/Scene 06.jpg' },
    'bg7': { bg: '#f5f0e6', bgImage: '/background/Scene 07.jpg' },
    'bg8': { bg: '#edece6', bgImage: '/background/Scene 08.jpg' },
    'bg9': { bg: '#f9f6f2', bgImage: '/background/Scene 09.jpg' }
};

const FinalBouquet = ({ bouquetArrangement, scenery, message, recipient, signoff, sender, onReset, theme, setTheme }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [copied, setCopied] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [loadedData, setLoadedData] = useState(null);

    // Parse URL parameters
    const queryParams = new URLSearchParams(location.search);
    const gistParam = queryParams.get('g');
    const sharedDataParam = queryParams.get('data'); // legacy fallback
    const isSharedView = !!(gistParam || sharedDataParam);

    let displayArrangement = loadedData ? loadedData.bouquetArrangement : bouquetArrangement;
    let displayScenery = loadedData ? loadedData.scenery : scenery;
    let displayMessage = loadedData ? loadedData.message : message;
    let displayRecipient = loadedData ? loadedData.recipient : recipient;
    let displaySignoff = loadedData ? loadedData.signoff : signoff;
    let displaySender = loadedData ? loadedData.sender : sender;

    // Load from GitHub Gist if ?g= param present
    useEffect(() => {
        if (!gistParam) return;
        fetch(`https://api.github.com/gists/${gistParam}`)
            .then(r => r.json())
            .then(gist => {
                const raw = JSON.parse(gist.files['bouquet.json'].content);
                const expanded = {
                    bouquetArrangement: (raw.b || []).map(bloom => ({
                        uniqueId: bloom.u, flowerId: bloom.f,
                        x: bloom.x, y: bloom.y, z: bloom.z
                    })),
                    scenery: raw.s || 'bg3',
                    message: raw.m || '',
                    recipient: raw.r || '',
                    signoff: raw.sg || '',
                    sender: raw.sn || ''
                };
                setLoadedData(expanded);
                if (raw.t && setTheme) setTheme(raw.t);
            })
            .catch(e => console.error('Failed to load shared bouquet', e));
    }, [gistParam]);

    // Legacy fallback: load from ?data= base64 param
    useEffect(() => {
        if (!sharedDataParam || gistParam) return;
        try {
            const raw = JSON.parse(decodeURIComponent(escape(atob(sharedDataParam))));
            const expanded = {
                bouquetArrangement: (raw.b || raw.bouquetArrangement || []).map(bloom => ({
                    uniqueId: bloom.u || bloom.uniqueId,
                    flowerId: bloom.f || bloom.flowerId,
                    x: bloom.x, y: bloom.y, z: bloom.z
                })),
                scenery: raw.s || raw.scenery || 'bg3',
                message: raw.m || raw.message || '',
                recipient: raw.r || raw.recipient || '',
                signoff: raw.sg || raw.signoff || '',
                sender: raw.sn || raw.sender || ''
            };
            setLoadedData(expanded);
            const t = raw.t || raw.theme;
            if (t && setTheme) setTheme(t);
        } catch (e) { console.error('Failed to parse shared data', e); }
    }, [sharedDataParam]);

    const selectedScenery = sceneries[displayScenery] || sceneries['bg3'];

    const handleCopyLink = async () => {
        setSharing(true);
        const compact = {
            b: displayArrangement.map(bloom => ({
                u: bloom.uniqueId, f: bloom.flowerId,
                x: Math.round(bloom.x), y: Math.round(bloom.y), z: Math.round(bloom.z)
            })),
            s: displayScenery, m: displayMessage,
            r: displayRecipient, sg: displaySignoff,
            sn: displaySender, t: theme
        };

        // Build compact base64 URL (guaranteed fallback)
        const base64 = btoa(unescape(encodeURIComponent(JSON.stringify(compact))));
        const longUrl = `${window.location.origin}/final?data=${base64}`;

        let shareUrl = longUrl;

        // Call Vercel serverless proxy → is.gd (server-side, no CORS issues)
        try {
            const res = await fetch('/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: longUrl })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.short) shareUrl = data.short;
            }
        } catch (e) { /* proxy failed, use longUrl */ }

        try {
            await navigator.clipboard.writeText(shareUrl);
        } catch (e) {
            window.prompt('Copy this link:', shareUrl);
        }

        setSharing(false);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };


    // Removed getFlowerStyle - using images

    return (
        <div className="page-container animate-fade-in" style={{ padding: '0.5rem 0', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div className="delay-1 animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', marginBottom: '4rem' }}>
                    <ThemeToggle theme={theme} setTheme={setTheme} />
                    <h2 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'var(--font-mono)', letterSpacing: '2px', textTransform: 'uppercase' }}>Fresh Blooms Just For You!</h2>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'center', width: '100%', maxWidth: '1000px', transform: 'scale(1.05)', transformOrigin: 'top center', marginBottom: '5rem' }}>

                    {/* Bouquet Display (Read-Only) */}
                    <div style={{
                        width: '100%',
                        maxWidth: '400px',
                        height: '500px',
                        overflow: 'hidden',
                        position: 'relative',
                    }}>
                        {/* Masked Scenery Layer */}
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: selectedScenery.bg,
                            backgroundImage: selectedScenery.bgImage ? `url("${selectedScenery.bgImage}")` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
                            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
                            zIndex: -1
                        }} />

                        {/* Bouquet Wrapper Graphic */}
                        <img
                            src="/background/Bouquet.png"
                            alt="Bouquet Wrapper"
                            style={{
                                position: 'absolute',
                                bottom: '0',
                                left: '0',
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                objectPosition: 'bottom center',
                                zIndex: 0,
                                pointerEvents: 'none',
                                userSelect: 'none'
                            }}
                        />

                        {displayArrangement.map(bloom => (
                            <div
                                key={bloom.uniqueId}
                                style={{
                                    position: 'absolute',
                                    left: `${bloom.x}px`,
                                    top: `${bloom.y}px`,
                                    zIndex: bloom.z,
                                    width: '180px',
                                    height: '180px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <div style={{
                                    width: '180px',
                                    height: '180px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    <img src={`/flowers/${bloom.flowerId}.png`} alt={bloom.name} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.15))', pointerEvents: 'none' }} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.backgroundColor = 'var(--color-primary)'; e.target.parentElement.style.borderRadius = '50%'; }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message Card */}
                    <div style={{ flex: '1 1 300px', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow-md)',
                            padding: '2.5rem',
                            position: 'relative',
                            minHeight: '300px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '1rem', fontFamily: 'var(--font-caveat)', fontSize: '1.8rem', color: 'var(--color-primary)' }}>
                                <span style={{ marginRight: '0.4rem' }}>Dear</span>
                                <span>{displayRecipient || <span style={{ opacity: 0.6 }}>[Beloved] ,</span>}</span>
                            </div>

                            <div style={{
                                fontFamily: 'var(--font-caveat)',
                                fontSize: '1.6rem',
                                lineHeight: '1.6',
                                whiteSpace: 'pre-wrap',
                                color: 'var(--color-text)',
                                minHeight: '100px'
                            }}>
                                {displayMessage || <span style={{ opacity: 0.6 }}>I could fill a thousand of these digital cards and still not have enough space to say everything. But the most important thing you need to know is...</span>}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '1rem', fontFamily: 'var(--font-caveat)', fontSize: '1.8rem', color: 'var(--color-primary)' }}>
                                <p style={{ margin: 0 }}>{displaySignoff || <span style={{ opacity: 0.6 }}>[Always] ,</span>}</p>
                                <p style={{ margin: 0 }}>{displaySender || <span style={{ opacity: 0.6 }}>[Secret Admirer]</span>}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                            {!isSharedView && (
                                <button
                                    className="btn btn-outline"
                                    onClick={() => navigate('/message')}
                                    style={{ flex: 1, padding: '0.75rem' }}
                                >
                                    <ArrowLeft size={18} /> Back
                                </button>
                            )}
                            <button
                                className={`btn ${copied ? 'btn-outline' : 'btn-primary'}`}
                                onClick={handleCopyLink}
                                disabled={sharing}
                                style={{ flex: 1, padding: '0.75rem', backgroundColor: copied ? '#4caf50' : '', color: copied ? 'white' : '', borderColor: copied ? '#4caf50' : '' }}
                            >
                                {sharing ? '⏳ Creating link...' : copied ? <><Check size={18} /> Copied!</> : <><LinkIcon size={18} /> Copy Link</>}
                            </button>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--color-text-light)', fontSize: '0.75rem', fontFamily: 'var(--font-ndot)', letterSpacing: '1px' }}>
                            <p>Made with BloomsForYou,</p>
                            <p>an app by <a href="https://www.instagram.com/cubickevin?igsh=MWc3dHlhc3d0ODMzaA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>@cubickevin</a></p>
                            <button
                                onClick={() => {
                                    if (onReset && !sharedDataParam) onReset();
                                    navigate('/');
                                }}
                                style={{
                                    background: 'none', border: 'none',
                                    color: 'var(--color-primary)',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    marginTop: '0.5rem',
                                    fontWeight: '500',
                                    fontFamily: 'inherit',
                                    letterSpacing: 'inherit'
                                }}
                            >
                                Make your own bouquet!
                            </button>
                        </div>
                    </div>

                </div>

                <div style={{ flex: 1, minHeight: '1rem' }}></div>
            </div>
        </div>
    );
};

export default FinalBouquet;
