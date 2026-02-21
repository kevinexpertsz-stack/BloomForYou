import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import BloomSelection from './pages/BloomSelection'
import BouquetCustomizer from './pages/BouquetCustomizer'
import WriteMessage from './pages/WriteMessage'
import FinalBouquet from './pages/FinalBouquet'
import './index.css'

const GlobalHeader = ({ theme, setTheme }) => {
  const location = useLocation();
  if (location.pathname === '/') return null; // Hide on Home page

  return (
    <header style={{
      paddingTop: '0.5rem',
      paddingBottom: '1.5rem',
      textAlign: 'center',
      zIndex: 100,
      position: 'relative'
    }}>
      <h1 style={{
        fontFamily: 'var(--font-title)',
        fontSize: '2.37rem',
        margin: 0,
        color: 'var(--color-primary)',
        opacity: 0.9,
        fontWeight: 'normal',
        letterSpacing: '1px',
        pointerEvents: 'none' // Ensures title doesn't capture clicks
      }}>
        BloomsForYou
      </h1>
    </header>
  );
};

function App() {
  const [selectedBlooms, setSelectedBlooms] = useState([]);
  const [bouquetArrangement, setBouquetArrangement] = useState([]);
  const [scenery, setScenery] = useState('bg3');
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [signoff, setSignoff] = useState('');
  const [sender, setSender] = useState('');
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleReset = () => {
    setSelectedBlooms([]);
    setBouquetArrangement([]);
    setScenery('bg3');
    setMessage('');
    setRecipient('');
    setSignoff('');
    setSender('');
  };

  return (
    <Router>
      <div className="app-container" style={{ position: 'relative', minHeight: '100vh' }}>
        {/* Global Background Overlay */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("/Background 1.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15, // Low opacity for transparent effect
          pointerEvents: 'none', // Ensure it doesn't block interactions
          zIndex: 0 // Place it behind everything else in the main container
        }} />
        <main className="main-content" style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <GlobalHeader theme={theme} setTheme={setTheme} />
          <Routes>
            <Route path="/" element={<Home theme={theme} setTheme={setTheme} />} />
            <Route
              path="/select"
              element={
                <BloomSelection
                  selectedBlooms={selectedBlooms}
                  setSelectedBlooms={setSelectedBlooms}
                  theme={theme}
                  setTheme={setTheme}
                />
              }
            />
            <Route
              path="/customize"
              element={
                <BouquetCustomizer
                  selectedBlooms={selectedBlooms}
                  bouquetArrangement={bouquetArrangement}
                  setBouquetArrangement={setBouquetArrangement}
                  scenery={scenery}
                  setScenery={setScenery}
                  theme={theme}
                  setTheme={setTheme}
                />
              }
            />
            <Route
              path="/message"
              element={
                <WriteMessage
                  message={message}
                  setMessage={setMessage}
                  recipient={recipient}
                  setRecipient={setRecipient}
                  signoff={signoff}
                  setSignoff={setSignoff}
                  sender={sender}
                  setSender={setSender}
                  theme={theme}
                  setTheme={setTheme}
                />
              }
            />
            <Route
              path="/final"
              element={
                <FinalBouquet
                  bouquetArrangement={bouquetArrangement}
                  scenery={scenery}
                  message={message}
                  recipient={recipient}
                  signoff={signoff}
                  sender={sender}
                  onReset={handleReset}
                  theme={theme}
                  setTheme={setTheme}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
