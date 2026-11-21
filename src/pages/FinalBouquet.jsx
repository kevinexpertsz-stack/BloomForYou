import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Link as LinkIcon } from 'lucide-react';
import '../index.css';
import ThemeToggle from '../components/ThemeToggle';

const sceneries = {
    bg2:  { name: 'Scene 02', bg: '#fcf6f0', bgImage: '/background/Scene 02.jpg' },
    bg3:  { name: 'Scene 03', bg: '#f2e8e9', bgImage: '/background/Scene 03.jpg' },
    bg5:  { name: 'Scene 05', bg: '#f7ecec', bgImage: '/background/Scene 05.jpg' },
    bg6:  { name: 'Scene 06', bg: '#eceef7', bgImage: '/background/Scene 06.jpg' },
    bg7:  { name: 'Scene 07', bg: '#f5f0e6', bgImage: '/background/Scene 07.jpg' },
    bg8:  { name: 'Scene 08', bg: '#edece6', bgImage: '/background/Scene 08.jpg' },
    bg9:  { name: 'Scene 09', bg: '#f9f6f2', bgImage: '/background/Scene 09.jpg' },
    bg10: { name: 'Scene 10', bg: '#f5f5f0', bgImage: '/background/Scene 10.jpg' },
    bg11: { name: 'Scene 11', bg: '#f0f5f5', bgImage: '/background/Scene 11.jpg' },
    bg12: { name: 'Scene 12', bg: '#f5f0f5', bgImage: '/background/Scene 12.jpg' },
    bg13: { name: 'Scene 13', bg: '#f5f5ec', bgImage: '/background/Scene 13.jpg' },
    bg14: { name: 'Scene 14', bg: '#ecf0f5', bgImage: '/background/Scene 14.jpg' },
    bg15: { name: 'Scene 15', bg: '#f5ecec', bgImage: '/background/Scene 15.jpg' },
};

const FinalBouquet = ({ bouquetArrangement, scenery, message, recipient, signoff, sender, onReset, theme, setTheme }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [loadedData, setLoadedData] = useState(null);

    const queryParams = new URLSearchParams(location.search);
    const gistParam = queryParams.get('g');
    const sharedDataParam = queryParams.get('data');
    const isSharedView = !!(gistParam || sharedDataParam);

    let displayArrangement = loadedData ? loadedData.bouquetArrangement : bouquetArrangement;
    let displayScenery = loadedData ? loadedData.scenery : scenery;
    let displayMessage = loadedData ? loadedData.message : message;
    let displayRecipient = loadedData ? loadedData.recipient : recipient;
    let displaySignoff = loadedData ? loadedData.signoff : signoff;
    let displaySender = loadedData ? loadedData.sender : sender;

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

    useEffect(() => {
        if (!sharedDataParam || gistParam) return;
        try {
            const normalizedBase64 = sharedDataParam.replace(/ /g, '+');
            const raw = JSON.parse(decodeURIComponent(escape(atob(normalizedBase64))));
            
            const expanded = {
                bouquetArrangement: (raw.b || raw.bouquetArrangement || []).map((bloom, i) => ({
                    uniqueId: bloom.u || bloom.uniqueId || `${bloom.f || 'rose'}-${i}`,
                    flowerId: bloom.f || bloom.flowerId || '1-Rose',
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
    }, [sharedDataParam, gistParam]);

    const selectedScenery = sceneries[displayScenery] || sceneries['bg3'];

    const handleCopyLink = async () => {
        setSharing(true);
        const compact = {
            b: displayArrangement.map(bloom => ({
                f: bloom.flowerId,
                x: Math.round(bloom.x), y: Math.round(bloom.y), z: Math.round(bloom.z)
            })),
            s: displayScenery, m: displayMessage,
            r: displayRecipient, sg: displaySignoff,
            sn: displaySender, t: theme
        };

        const base64 = btoa(unescape(encodeURIComponent(JSON.stringify(compact))));
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const prodOrigin = 'https://bloomforyou.vercel.app';
        const targetOrigin = isLocal ? prodOrigin : window.location.origin;
        const longUrl = `${targetOrigin}/final?data=${encodeURIComponent(base64)}`;

        let shareUrl = longUrl;

        try {
            const res = await fetch('/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: longUrl })
            });
            if (res.ok) {
                const json = await res.json();
                if (json.branded && json.branded.startsWith('http')) {
                    shareUrl = json.branded;
                } else if (json.short && json.short.startsWith('http')) {
                    shareUrl = json.short;
                }
            }
        } catch (_) {}

        const copyToClipboard = async (text) => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                try {
                    await navigator.clipboard.writeText(text);
                    return true;
                } catch (_) {}
            }
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;';
            document.body.appendChild(ta);
            const selection = window.getSelection();
            const range = document.createRange();
            ta.contentEditable = 'true';
            ta.readOnly = false;
            range.selectNodeContents(ta);
            selection.removeAllRanges();
            selection.addRange(range);
            ta.setSelectionRange(0, 999999);
            const success = document.execCommand('copy');
            document.body.removeChild(ta);
            return success;
        };

        await copyToClipboard(shareUrl);

        setSharing(false);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="page-container animate-fade-in" style={{ padding: '0.5rem 0', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div className="delay-1 animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', marginBottom: 'clamp(1rem, 2.5vh, 2rem)' }}>
                    <ThemeToggle theme={theme} setTheme={setTheme} />
                    <h2 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'var(--font-mono)', letterSpacing: '2px', textTransform: 'uppercase' }}>Fresh Blooms Just For You!</h2>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(1.5rem, 3vw, 3rem)', justifyContent: 'center', width: '100%', maxWidth: '960px', marginBottom: '2.5rem' }}>

                    <div style={{
                        width: '100%',
                        maxWidth: '430px',
                        aspectRatio: '4 / 5',
                        maxHeight: '70vh',
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: 'var(--shadow-lg)',
                        borderRadius: 'var(--radius-lg)'
                    }}>
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
                                    left: `${(bloom.x / 400) * 100}%`,
                                    top: `${(bloom.y / 500) * 100}%`,
                                    zIndex: bloom.z,
                                    width: `${(180 / 400) * 100}%`,
                                    height: `${(180 / 500) * 100}%`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <div style={{
                                    width: '100%',
                                    height: '100%',
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

                    <div style={{ flex: '1 1 300px', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow-md)',
                            padding: 'clamp(1.25rem, 4vw, 2.5rem)',
                            position: 'relative',
                            minHeight: '280px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '1rem', fontFamily: 'var(--font-caveat)', fontSize: '1.8rem', color: 'var(--color-accent)' }}>
                                <span style={{ marginRight: '0.4rem' }}>Dear</span>
                                <span>{displayRecipient || <span style={{ opacity: 0.6 }}>Beloved ,</span>}</span>
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

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '1rem', fontFamily: 'var(--font-caveat)', fontSize: '1.8rem', color: 'var(--color-accent)' }}>
                                <p style={{ margin: 0 }}>{displaySignoff || <span style={{ opacity: 0.6 }}>Always ,</span>}</p>
                                <p style={{ margin: 0 }}>{displaySender || <span style={{ opacity: 0.6 }}>Secret Admirer</span>}</p>
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
                                {sharing ? 'Creating link...' : copied ? <><Check size={18} /> Copied!</> : <><LinkIcon size={18} /> Copy Link</>}
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
                                MAKE YOUR OWN BOUQUET!
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinalBouquet;
