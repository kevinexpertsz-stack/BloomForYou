import { useLocation } from 'react-router-dom';

const ThemeToggle = ({ theme, setTheme }) => {
    const location = useLocation();
    const isSharedLink = location.search.includes('data=');
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

    return (
        <img
            src={themeImages[theme] || themeImages['default']}
            alt="Toggle Theme"
            title="Click to modify colors!"
            onClick={() => {
                const currentIndex = themeSequence.indexOf(theme);
                const nextIndex = (currentIndex + 1) % themeSequence.length;
                setTheme(themeSequence[nextIndex]);
            }}
            style={{
                width: '30px',
                height: '30px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))',
                cursor: 'pointer',
                transition: 'var(--transition)'
            }}
        />
    );
};

export default ThemeToggle;
