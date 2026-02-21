import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { flowerData } from '../data/flowers';
import '../index.css';

const BloomSelection = ({ selectedBlooms, setSelectedBlooms }) => {
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
    const minBlooms = 6;
    const maxBlooms = 15;

    const handleCategoryClick = (category) => {
        setActiveCategory(activeCategory?.id === category.id ? null : category);
        setActiveFlower(null); // Reset flower when changing category
    };

    const handleFlowerClick = (flower) => {
        if (totalBlooms >= maxBlooms) {
            showAlert(`You can only select up to ${maxBlooms} blooms.`);
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
                <h2 className="delay-1 animate-fade-in" style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.1rem', fontFamily: 'var(--font-mono)', letterSpacing: '2px', textTransform: 'uppercase' }}>Select Your Blooms</h2>

                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>

                    {/* Left Side: Categories & Selection */}
                    <div style={{ flex: '1 1 60%', minWidth: '300px' }}>
                        {activeCategory ? (
                            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', alignItems: 'flex-start' }}>
                                {/* Left Side: Active Category */}
                                <div style={{ flex: '1 1 50%' }}>
                                    <div className="animate-fade-in" style={{ marginBottom: '1.5rem' }}>
                                        <button
                                            onClick={() => handleCategoryClick(activeCategory)}
                                            style={{
                                                width: '100%',
                                                padding: '1.5rem',
                                                borderRadius: 'var(--radius-lg)',
                                                border: '2px solid',
                                                borderColor: 'var(--color-primary)',
                                                backgroundColor: 'white',
                                                boxShadow: 'var(--shadow-sm)',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                transition: 'var(--transition)'
                                            }}
                                            className="category-card"
                                        >
                                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{activeCategory.name}</h3>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                {activeCategory.flowers.slice(0, 3).map(f => f.name).join(', ')}...
                                            </div>
                                            <div className="custom-tooltip">{activeCategory.description}</div>
                                        </button>

                                        <div style={{
                                            marginTop: '1rem',
                                            padding: '1rem',
                                            backgroundColor: 'rgba(255,255,255,0.5)',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid rgba(0,0,0,0.05)',
                                            animation: 'fadeIn 0.3s ease'
                                        }}>
                                            <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Available Flowers:</h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {activeCategory.flowers.map(flower => (
                                                    <div key={flower.id}>
                                                        <button
                                                            onClick={() => handleFlowerClick(flower)}
                                                            style={{
                                                                width: '100%',
                                                                padding: '0.75rem 1rem',
                                                                borderRadius: 'var(--radius-sm)',
                                                                border: '1px solid',
                                                                borderColor: '#eee',
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
                                                            <span style={{ fontSize: '1.5rem', color: 'var(--color-primary)', display: 'flex' }}>+</span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Inactive Categories */}
                                <div style={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {flowerData.categories.filter(c => c.id !== activeCategory.id).map(category => (
                                        <div key={category.id} className="animate-fade-in">
                                            <button
                                                onClick={() => handleCategoryClick(category)}
                                                style={{
                                                    width: '100%',
                                                    padding: '1.5rem',
                                                    borderRadius: 'var(--radius-lg)',
                                                    border: '2px solid transparent',
                                                    backgroundColor: 'white',
                                                    boxShadow: 'var(--shadow-sm)',
                                                    textAlign: 'left',
                                                    transition: 'var(--transition)'
                                                }}
                                                className="category-card"
                                            >
                                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{category.name}</h3>
                                                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                    {category.flowers.slice(0, 3).map(f => f.name).join(', ')}...
                                                </div>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="categories-grid" style={{
                                columnWidth: '250px',
                                columnGap: '1.5rem',
                                marginBottom: '2rem'
                            }}>
                                {flowerData.categories.map((category, index) => (
                                    <div key={category.id} className={`delay-${(index % 4) + 1} animate-fade-in`} style={{ breakInside: 'avoid', pageBreakInside: 'avoid', marginBottom: '1.5rem' }}>
                                        <button
                                            onClick={() => handleCategoryClick(category)}
                                            style={{
                                                width: '100%',
                                                padding: '1.5rem',
                                                borderRadius: 'var(--radius-lg)',
                                                border: '2px solid transparent',
                                                backgroundColor: 'white',
                                                boxShadow: 'var(--shadow-sm)',
                                                textAlign: 'left',
                                                transition: 'var(--transition)'
                                            }}
                                            className="category-card"
                                        >
                                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{category.name}</h3>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                {category.flowers.slice(0, 3).map(f => f.name).join(', ')}...
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Side: Current Selection (Cart) */}
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

                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                                <button
                                    className="btn btn-outline"
                                    onClick={() => navigate('/')}
                                    style={{ flex: 1, padding: '0.75rem' }}
                                >
                                    <ArrowLeft size={18} /> Back
                                </button>
                                <button
                                    className={`btn ${totalBlooms >= minBlooms ? 'btn-primary' : 'btn-disabled'}`}
                                    onClick={handleContinue}
                                    style={{ flex: 1, padding: '0.75rem' }}
                                >
                                    Continue <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                </div >

            </div >

            <div style={{ flex: 1, minHeight: '1rem' }}></div>

            {/* Custom Alert Modal */}
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
