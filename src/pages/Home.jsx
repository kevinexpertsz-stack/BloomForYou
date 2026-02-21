import { useNavigate } from 'react-router-dom';
import { Flower } from 'lucide-react';
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
        <div className="home-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <div className="logo-container" style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                    <img
                        src={themeImages[theme] || themeImages['default']}
                        alt="BloomsForYou Logo"
                        onClick={() => {
                            const currentIndex = themeSequence.indexOf(theme);
                            const nextIndex = (currentIndex + 1) % themeSequence.length;
                            setTheme(themeSequence[nextIndex]);
                        }}
                        style={{
                            width: 'clamp(100px, 25vw, 150px)',
                            height: 'clamp(100px, 25vw, 150px)',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.05))',
                            cursor: 'pointer',
                            transition: 'var(--transition)'
                        }}
                    />
                </div>

                <h1 className="delay-1 animate-fade-in" style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(2.5rem, 12vw, 4.2rem)', marginBottom: '0.5rem', letterSpacing: '1px', color: 'var(--color-text)', fontWeight: 'normal', whiteSpace: 'nowrap' }}>
                    BloomsForYou
                </h1>

                <p className="delay-2 animate-fade-in" style={{ fontSize: '0.85rem', marginBottom: '3rem', color: 'var(--color-text)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', lineHeight: '1.6', textTransform: 'uppercase' }}>
                    Forever Flowers<br />Just For You
                </p>

                <button
                    className="btn btn-primary delay-3 animate-fade-in"
                    onClick={() => navigate('/select')}
                    style={{
                        padding: '1.1rem 2rem',
                        fontSize: '1rem',
                        marginBottom: '3rem',
                        width: '80%',
                        maxWidth: '300px'
                    }}
                >
                    Pick Your Blooms
                </button>
            </div>

            <footer className="delay-4 animate-fade-in" style={{ textAlign: 'center', color: 'var(--color-text-light)', fontSize: '0.8rem', marginTop: 'auto', fontFamily: 'var(--font-ndot)', letterSpacing: '1px' }}>
                <p style={{ marginBottom: '0.6rem' }}>
                    Created using <a href="https://antigravity.google/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Anti_Gravity</a> & <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Vercel</a>
                </p>
                <div>
                    <span>Made by <a href="https://www.instagram.com/cubickevin?igsh=MWc3dHlhc3d0ODMzaA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>@cubickevin</a></span>
                </div>
            </footer>
        </div>
    );
};

export default Home;
