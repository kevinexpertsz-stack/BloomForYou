import { useNavigate } from 'react-router-dom';
import '../index.css';

const Home = ({ theme, setTheme }) => {
    const navigate = useNavigate();

    const themeSequence = ['default', 'sunflower', 'blueflower', 'orchid', 'alstromeria', 'ranuculus'];
    const themeImages = {
        'default': '/Main.png',
        'sunflower': '/Main 2.png',
        'blueflower': '/Main 3.png',
        'orchid': '/Main 4.png',
        'alstromeria': '/Main 5.png',
        'ranuculus': '/Main 6.png'
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
                /* Fill the full visible viewport on every device, incl. iOS Safari */
                minHeight: '100dvh',
                padding: 'env(safe-area-inset-top, 1rem) 1rem env(safe-area-inset-bottom, 1rem)',
                boxSizing: 'border-box',
            }}
        >
            {/* Centre block — grows to fill available space */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                width: '100%',
                gap: 'clamp(0.6rem, 2.5vh, 1.4rem)',
            }}>

                {/* Logo */}
                <div className="logo-container">
                    <img
                        src={themeImages[theme] || themeImages['default']}
                        alt="BloomsForYou Logo"
                        onClick={() => {
                            const currentIndex = themeSequence.indexOf(theme);
                            const nextIndex = (currentIndex + 1) % themeSequence.length;
                            setTheme(themeSequence[nextIndex]);
                        }}
                        style={{
                            width: 'clamp(90px, 20vw, 140px)',
                            height: 'clamp(90px, 20vw, 140px)',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.07))',
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                            display: 'block',
                        }}
                    />
                </div>

                {/* Title */}
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

                {/* Tagline */}
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

                {/* CTA Button */}
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

            {/* Footer — anchored to bottom */}
            <footer
                className="delay-4 animate-fade-in"
                style={{
                    textAlign: 'center',
                    color: 'var(--color-text-light)',
                    fontSize: 'clamp(0.6rem, 1.8vw, 0.75rem)',
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
                    >CUBICKIEVN</a>
                </p>
            </footer>
        </div>
    );
};

export default Home;
