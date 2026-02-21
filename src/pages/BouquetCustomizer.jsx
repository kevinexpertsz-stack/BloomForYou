import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Shuffle, Image as ImageIcon } from 'lucide-react';
import '../index.css';

const sceneries = [
    { id: 'bg2', name: 'Scene 02', bg: '#fcf6f0', bgImage: '/background/Scene 02.jpg' },
    { id: 'bg3', name: 'Scene 03', bg: '#f2e8e9', bgImage: '/background/Scene 03.jpg' },
    { id: 'bg5', name: 'Scene 05', bg: '#f7ecec', bgImage: '/background/Scene 05.jpg' },
    { id: 'bg6', name: 'Scene 06', bg: '#eceef7', bgImage: '/background/Scene 06.jpg' },
    { id: 'bg7', name: 'Scene 07', bg: '#f5f0e6', bgImage: '/background/Scene 07.jpg' },
    { id: 'bg8', name: 'Scene 08', bg: '#edece6', bgImage: '/background/Scene 08.jpg' },
    { id: 'bg9', name: 'Scene 09', bg: '#f9f6f2', bgImage: '/background/Scene 09.jpg' }
];

const BouquetCustomizer = ({ selectedBlooms, bouquetArrangement, setBouquetArrangement, scenery, setScenery }) => {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    // Track dragging state
    const [draggingId, setDraggingId] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // Sync individual blooms from selected quantities
    useEffect(() => {
        if (selectedBlooms.length === 0) {
            navigate('/select'); // Redirect if no blooms
            return;
        }

        setBouquetArrangement(prevArrangement => {
            const newArrangement = [...prevArrangement];
            let hasChanges = false;
            let nextZIndex = prevArrangement.length > 0 ? Math.max(...prevArrangement.map(b => b.z)) + 1 : 0;

            const selectedCounts = {};
            selectedBlooms.forEach(item => {
                selectedCounts[item.id] = item.quantity;
            });

            // Handle additions: Check if there are new quantities of a selected bloom
            selectedBlooms.forEach(item => {
                // Find how many of this exact item ID exist currently
                const existingForThisItem = prevArrangement.filter(b => b.uniqueId.startsWith(item.id + '-')).length;

                if (item.quantity > existingForThisItem) {
                    // Add missing flowers
                    for (let i = existingForThisItem; i < item.quantity; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const radius = Math.random() * 40 + 10;
                        newArrangement.push({
                            uniqueId: `${item.id}-${i}`,
                            flowerId: item.flower.id,
                            name: item.flower.name,
                            x: 60 + Math.cos(angle) * radius,
                            y: 110 + Math.sin(angle) * radius,
                            z: nextZIndex
                        });
                        nextZIndex++;
                        hasChanges = true;
                    }
                }
            });

            // Handle removals: Remove any flowers that were decremented from selection
            const filteredArrangement = newArrangement.filter(bloom => {
                const parts = bloom.uniqueId.split('-');
                // Assuming uniqueId format is `flowerId-timestamp-index`
                const indexPart = parseInt(parts.pop(), 10);
                const baseId = parts.join('-');

                if (!selectedCounts[baseId] || indexPart >= selectedCounts[baseId]) {
                    hasChanges = true;
                    return false; // exclude removed or out of bounds items
                }
                return true;
            });

            return hasChanges ? filteredArrangement : prevArrangement;
        });

    }, [selectedBlooms, navigate, setBouquetArrangement]);

    const handleRandomArrange = () => {
        const newArrangement = bouquetArrangement.map(bloom => {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 50;
            return {
                ...bloom,
                x: 60 + Math.cos(angle) * radius,
                y: 110 + Math.sin(angle) * radius,
                z: Math.floor(Math.random() * 20)
            };
        });
        setBouquetArrangement(newArrangement);
    };

    const handlePointerDown = (e, uniqueId, currentX, currentY) => {
        // Only trigger on left-click or touch
        if (e.button !== 0 && e.pointerType === 'mouse') return;

        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            // Calculate current visual scale from container width/height vs native 400/500
            const scaleX = rect.width / 400;
            const scaleY = rect.height / 500;
            const pointerX = (e.clientX - rect.left) / scaleX;
            const pointerY = (e.clientY - rect.top) / scaleY;
            setDragOffset({ x: pointerX - currentX, y: pointerY - currentY });
        }
        setDraggingId(uniqueId);

        // Bring to front naturally
        const maxZ = Math.max(...bouquetArrangement.map(b => b.z), 0);
        setBouquetArrangement(prev => prev.map(b =>
            b.uniqueId === uniqueId ? { ...b, z: maxZ + 1 } : b
        ));

        e.target.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (!draggingId || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const scaleX = rect.width / 400;
        const scaleY = rect.height / 500;
        const x = (e.clientX - rect.left) / scaleX - dragOffset.x;
        const y = (e.clientY - rect.top) / scaleY - dragOffset.y;

        setBouquetArrangement(prev => prev.map(bloom =>
            bloom.uniqueId === draggingId ? { ...bloom, x, y } : bloom
        ));
    };

    const handlePointerUp = (e) => {
        if (draggingId) {
            setDraggingId(null);
            if (e.target.hasPointerCapture(e.pointerId)) {
                e.target.releasePointerCapture(e.pointerId);
            }
        }
    };

    const selectedScenery = sceneries.find(s => s.id === scenery) || sceneries[0];

    const handleCycleScenery = () => {
        const currentIndex = sceneries.findIndex(s => s.id === scenery);
        const nextIndex = (currentIndex + 1) % sceneries.length;
        setScenery(sceneries[nextIndex].id);
    };

    // Removed getFlowerStyle as we're using images now

    return (
        <div className="page-container animate-fade-in" style={{ padding: '0.5rem 0', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', transform: 'scale(1.1)', transformOrigin: 'top center' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.1rem', fontFamily: 'var(--font-mono)', letterSpacing: '2px', textTransform: 'uppercase' }}>Customize Your Bouquet</h2>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', marginBottom: '1.5rem', flexWrap: 'wrap', width: '100%', maxWidth: '380px', margin: '0 auto 1.5rem auto' }}>
                    <button className="btn btn-outline" onClick={handleRandomArrange} style={{ flex: '1 1 140px' }}>
                        <Shuffle size={16} /> Random Arrangement
                    </button>

                    <button
                        className="btn btn-outline"
                        onClick={handleCycleScenery}
                        style={{ flex: '1 1 140px' }}
                    >
                        <ImageIcon size={16} /> Change Scenery
                    </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', flex: 1, marginBottom: '2rem' }}>
                    <div
                        ref={containerRef}
                        style={{
                            width: '100%',
                            maxWidth: '400px',
                            height: '500px',
                            overflow: 'hidden',
                            position: 'relative',
                            touchAction: 'none' // Prevents scrolling while dragging on mobile
                        }}
                    >
                        {/* Masked Scenery Layer */}
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: selectedScenery.bg,
                            backgroundImage: selectedScenery.bgImage ? `url("${selectedScenery.bgImage}")` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            transition: 'background-color 0.5s ease',
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

                        {bouquetArrangement.map(bloom => (
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
                                    opacity: draggingId === bloom.uniqueId ? 0.5 : 1,
                                    transform: draggingId === bloom.uniqueId ? 'scale(1.1)' : 'scale(1)',
                                    transition: draggingId === bloom.uniqueId ? 'none' : 'transform 0.2s',
                                    pointerEvents: 'none',
                                    userSelect: 'none'
                                }}
                            >
                                <div
                                    onPointerDown={(e) => handlePointerDown(e, bloom.uniqueId, bloom.x, bloom.y)}
                                    onPointerMove={handlePointerMove}
                                    onPointerUp={handlePointerUp}
                                    onPointerCancel={handlePointerUp}
                                    style={{
                                        position: 'absolute',
                                        top: '40px',
                                        left: '40px',
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                        pointerEvents: 'auto',
                                        cursor: draggingId === bloom.uniqueId ? 'grabbing' : 'grab',
                                        zIndex: 10,
                                        touchAction: 'none'
                                    }}
                                ></div>
                                <div style={{
                                    width: '180px',
                                    height: '180px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    <img src={`/flowers/${bloom.flowerId}.png`} alt={bloom.name} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.15))', pointerEvents: 'none', userSelect: 'none' }} draggable={false} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.backgroundColor = 'var(--color-primary)'; e.target.parentElement.style.borderRadius = '50%'; }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                    <button
                        className="btn btn-outline"
                        onClick={() => navigate('/select')}
                        style={{ width: '48%', padding: '0.75rem' }}
                    >
                        <ArrowLeft size={18} /> Back
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/message')}
                        style={{ width: '48%', padding: '0.75rem' }}
                    >
                        Continue <ArrowRight size={18} />
                    </button>
                </div>

            </div>

            <div style={{ flex: 1, minHeight: '1rem' }}></div>
        </div>
    );
};

export default BouquetCustomizer;
