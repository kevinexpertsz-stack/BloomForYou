import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { flowerData } from '../data/flowers';
import '../index.css';
import ThemeToggle from '../components/ThemeToggle';

const BloomSelection = ({ selectedBlooms, setSelectedBlooms, theme, setTheme }) => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeFlower, setActiveFlower] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [isAlertVisible, setIsAlertVisible] = useState(false);

    const showAlert = (message) => {
        setAlertMessage(message);
        setIsAlertVisible(true);
    };

    const totalBlooms = selectedBlooms.reduce((acc, current) => acc + current.quantity, 0);
    const minBlooms = 12;
    const maxBlooms = 20;

    const handleCategoryClick = (category) => {
        setActiveCategory(activeCategory?.id === category.id ? null : category);
        setActiveFlower(null);
    };

    const handleFlowerClick = (flower) => {
        if (totalBlooms >= maxBlooms) {
            return;
        }

        const existingIndex = selectedBlooms.findIndex(
            b => b.flower.id === flower.id
        );

        if (existingIndex >= 0) {
            const newBlooms = [...selectedBlooms];
            newBlooms[existingIndex].quantity += 1;
            setSelectedBlooms(newBlooms);
        } else {
            setSelectedBlooms([...selectedBlooms, { flower, quantity: 1, id: `${flower.id}-${Date.now()}` }]);
        }
    };

    const handleRemoveBloom = (bloomToRemove) => {
        const existingIndex = selectedBlooms.findIndex(
            b => b.flower.id === bloomToRemove.flower.id
        );

        if (existingIndex >= 0) {
            const newBlooms = [...selectedBlooms];
            if (newBlooms[existingIndex].quantity > 1) {
                newBlooms[existingIndex].quantity -= 1;
            } else {
                newBlooms.splice(existingIndex, 1);
            }
            setSelectedBlooms(newBlooms);
        }
    };

    const handleContinue = () => {
        if (totalBlooms < minBlooms) {
            showAlert(`Please select at least ${minBlooms} blooms to continue.`);
            return;
        }
        navigate('/customize');
    };

    return (
        <div className="page-container animate-fade-in" style={{ padding: '0.5rem 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <div className="delay-1 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '2rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
                        <ThemeToggle theme={theme} setTheme={setTheme} />
                        <h2 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'var(--font-mono)', letterSpacing: '2px', textTransform: 'uppercase' }}>Select Your Blooms</h2>
                    </div>
                    <div style={{
                        marginTop: '0.25rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.3rem 0.85rem',
                        borderRadius: '20px',
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        fontSize: '0.85rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: '600',
                        color: totalBlooms >= minBlooms ? 'var(--color-primary)' : 'var(--color-text)'
                    }}>
                        <span>💐</span>
                        <span>{totalBlooms} / {maxBlooms} blooms selected</span>
                        {totalBlooms < minBlooms ? (
                            <span style={{ color: '#e74c3c', fontWeight: '500' }}>({minBlooms - totalBlooms} more needed)</span>
                        ) : (
                            <span style={{ color: '#27ae60', fontWeight: '500' }}>✓ ready</span>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>

                    <div style={{ flex: '1 1 60%', minWidth: '300px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            {flowerData.categories.map((category) => {
                                const isActive = activeCategory?.id === category.id;
                                return (
                                    <div key={category.id} className="animate-fade-in" style={{ width: '100%' }}>
                                        <button
                                            onClick={() => handleCategoryClick(category)}
                                            style={{
                                                width: '100%',
                                                padding: '1.25rem 1.5rem',
                                                borderRadius: 'var(--radius-lg)',
                                                border: '2px solid',
                                                borderColor: isActive ? 'var(--color-primary)' : 'transparent',
                                                backgroundColor: 'white',
                                                boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                transition: 'var(--transition)'
                                            }}
                                            className="category-card"
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{category.name}</h3>
                                                <span style={{ fontSize: '1.2rem', color: 'var(--color-primary)', lineHeight: 1 }}>
                                                    {isActive ? '−' : '+'}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginTop: '0.4rem', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                {category.flowers.slice(0, 3).map(f => f.name).join(', ')}...
                                            </div>
                                            {isActive && (
                                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginTop: '0.5rem', lineHeight: '1.4' }}>
                                                    {category.description}
                                                </p>
                                            )}
                                        </button>

                                        {isActive && (
                                            <div style={{
                                                marginTop: '0.75rem',
                                                padding: '1rem',
                                                backgroundColor: 'rgba(255,255,255,0.65)',
                                                borderRadius: 'var(--radius-md)',
                                                border: '1px solid rgba(0,0,0,0.05)',
                                                animation: 'fadeIn 0.3s ease'
                                            }}>
                                                <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Available Flowers:</h4>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                    {category.flowers.map(flower => {
                                                        const selectedItem = selectedBlooms.find(b => b.flower.id === flower.id);
                                                        const selectedCount = selectedItem ? selectedItem.quantity : 0;

                                                        return (
                                                            <div key={flower.id}>
                                                                <button
                                                                    onClick={() => handleFlowerClick(flower)}
                                                                    style={{
                                                                        width: '100%',
                                                                        padding: '0.75rem 1rem',
                                                                        borderRadius: 'var(--radius-sm)',
                                                                        border: selectedCount > 0 ? '1.5px solid var(--color-primary)' : '1px solid #eee',
                                                                        backgroundColor: 'white',
                                                                        cursor: 'pointer',
                                                                        textAlign: 'left',
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        alignItems: 'center',
                                                                        transition: 'var(--transition)'
                                                                    }}
                                                                >
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#f0f0f0', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                                                            <img src={`/flowers/${flower.id}.png`} alt={flower.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.backgroundColor = 'var(--color-primary)'; }} />
                                                                        </div>
                                                                        <span style={{ fontWeight: '500' }}>{flower.name}</span>
                                                                    </div>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                        {selectedCount > 0 && (
                                                                            <span
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleRemoveBloom(selectedItem);
                                                                                }}
                                                                                title="Remove one"
                                                                                style={{
                                                                                    width: '24px',
                                                                                    height: '24px',
                                                                                    borderRadius: '50%',
                                                                                    backgroundColor: '#f5f5f5',
                                                                                    color: 'var(--color-text)',
                                                                                    display: 'inline-flex',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'center',
                                                                                    fontSize: '1rem',
                                                                                    fontWeight: 'bold',
                                                                                    lineHeight: 1,
                                                                                    border: '1px solid #ddd'
                                                                                }}
                                                                            >
                                                                                -
                                                                            </span>
                                                                        )}
                                                                        {selectedCount > 0 && (
                                                                            <span style={{
                                                                                fontFamily: 'var(--font-mono)',
                                                                                fontSize: '0.85rem',
                                                                                fontWeight: '600',
                                                                                backgroundColor: 'var(--color-primary)',
                                                                                color: 'white',
                                                                                padding: '0.2rem 0.55rem',
                                                                                borderRadius: '12px',
                                                                                lineHeight: 1
                                                                            }}>
                                                                                x{selectedCount}
                                                                            </span>
                                                                        )}
                                                                        <span style={{ fontSize: '1.5rem', color: 'var(--color-primary)', display: 'flex', lineHeight: 1 }}>+</span>
                                                                    </div>
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ flex: '1 1 30%', minWidth: '250px' }}>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '2rem',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow-md)',
                            position: 'sticky',
                            top: '2rem'
                        }}>
                            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem' }}>
                                Your Bouquet ({totalBlooms}/{maxBlooms})
                            </h3>

                            <div style={{ minHeight: '150px', maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
                                {selectedBlooms.length === 0 ? (
                                    <div style={{ color: 'var(--color-text-light)', fontStyle: 'italic', textAlign: 'center', paddingTop: '2rem' }}>
                                        No blooms selected yet.
                                    </div>
                                ) : (
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {selectedBlooms.map((bloom) => (
                                            <li key={bloom.id} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '0.5rem 0',
                                                borderBottom: '1px dashed #eee'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span style={{ fontWeight: '500', color: 'var(--color-primary)' }}>x{bloom.quantity}</span>
                                                    <span>{bloom.flower.name}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveBloom(bloom)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', display: 'flex', padding: '4px' }}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {totalBlooms < minBlooms && selectedBlooms.length > 0 && (
                                <p style={{ color: '#e74c3c', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>
                                    * Add {minBlooms - totalBlooms} more blooms
                                </p>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.6rem', flexWrap: 'wrap' }}>
                                <button
                                    className="btn btn-outline"
                                    onClick={() => navigate('/')}
                                    style={{ flex: '1 1 110px', minWidth: '95px', padding: '0.75rem 0.5rem', fontSize: '0.85rem' }}
                                >
                                    <ArrowLeft size={16} /> Back
                                </button>
                                <button
                                    className={`btn ${totalBlooms >= minBlooms ? 'btn-primary' : 'btn-disabled'}`}
                                    onClick={handleContinue}
                                    style={{ flex: '1 1 110px', minWidth: '95px', padding: '0.75rem 0.5rem', fontSize: '0.85rem' }}
                                >
                                    {totalBlooms < minBlooms ? `Add ${minBlooms - totalBlooms} more` : <>Continue <ArrowRight size={16} /></>}
                                </button>
                            </div>
                        </div>
                    </div>

                </div >

            </div >

            <div className="mobile-floating-bar" style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderTop: '1px solid rgba(0,0,0,0.08)',
                padding: '0.75rem 1rem max(env(safe-area-inset-bottom, 0px), 0.75rem) 1rem',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 999,
                boxShadow: '0 -4px 16px rgba(0,0,0,0.08)'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span>💐</span>
                        <span>{totalBlooms}/{maxBlooms} blooms</span>
                    </div>
                    {totalBlooms < minBlooms ? (
                        <span style={{ fontSize: '0.75rem', color: '#e74c3c' }}>Add {minBlooms - totalBlooms} more</span>
                    ) : (
                        <span style={{ fontSize: '0.75rem', color: '#4caf50' }}>Ready to customize!</span>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        className="btn btn-outline"
                        onClick={() => navigate('/')}
                        style={{ padding: '0.5rem 0.8rem', fontSize: '0.8rem' }}
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <button
                        className={`btn ${totalBlooms >= minBlooms ? 'btn-primary' : 'btn-disabled'}`}
                        onClick={handleContinue}
                        style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}
                    >
                        {totalBlooms < minBlooms ? `Add ${minBlooms - totalBlooms} more` : <>Continue <ArrowRight size={16} /></>}
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, minHeight: '1rem' }}></div>

            {isAlertVisible && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        backgroundColor: 'var(--color-bg)',
                        padding: '2.5rem',
                        borderRadius: 'var(--radius-lg)',
                        maxWidth: '400px',
                        width: '90%',
                        textAlign: 'center',
                        boxShadow: 'var(--shadow-lg)',
                        animation: 'fadeIn 0.3s ease',
                        borderTop: '6px solid var(--color-accent)'
                    }}>
                        <h3 style={{
                            color: 'var(--color-text)',
                            marginBottom: '1.5rem',
                            fontSize: '1.1rem',
                            lineHeight: '1.5',
                            fontWeight: '500'
                        }}>{alertMessage}</h3>
                        <button
                            onClick={() => setIsAlertVisible(false)}
                            style={{
                                padding: '0.75rem 2.5rem',
                                borderRadius: '50px',
                                border: 'none',
                                backgroundColor: 'var(--color-accent)',
                                color: '#fff',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-main)',
                                fontSize: '1rem',
                                boxShadow: 'var(--shadow-sm)',
                                transition: 'all 0.2s',
                                fontWeight: '500'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                e.currentTarget.style.filter = 'brightness(1.1)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                e.currentTarget.style.filter = 'brightness(1)';
                            }}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div >
    );
};

export default BloomSelection;
