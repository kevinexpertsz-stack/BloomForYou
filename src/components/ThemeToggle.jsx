import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const ThemeToggle = ({ theme, setTheme }) => {
    const location = useLocation();
    const isSharedLink = location.search.includes('data=') || location.search.includes('g=');
    if (isSharedLink) return null;

    const [isPopping, setIsPopping] = useState(false);

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

    const handleClick = () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(25);
        }
        setIsPopping(true);
        setTimeout(() => setIsPopping(false), 500);

        const currentIndex = themeSequence.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themeSequence.length;
        setTheme(themeSequence[nextIndex]);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
                src={currentImage}
                alt="Toggle Theme"
                title="Click to change colors!"
                onClick={handleClick}
                onContextMenu={(e) => e.preventDefault()}
                style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))',
                    cursor: 'pointer',
                    transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.2s ease',
                    transform: isPopping ? 'rotate(360deg) scale(1.2)' : 'rotate(0deg) scale(1)',
                    zIndex: 10,
                    userSelect: 'none',
                    WebkitTouchCallout: 'none'
                }}
            />
        </div>
    );
};

export default ThemeToggle;

