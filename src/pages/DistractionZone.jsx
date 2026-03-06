import React, { useState, useEffect } from 'react';
import { Smile, Gamepad2, RefreshCw, Zap, Tv } from 'lucide-react';
import styles from './DistractionZone.module.css';
import Button from '../components/Button';

// JOKES DATA
const jokes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "What do you call a fake noodle? An impasta!",
    "Why did the bicycle fall over? Because it was two-tired!",
    "What do you call a bear with no teeth? A gummy bear!",
    "Why don't eggs tell jokes? They'd crack each other up!",
    "What's orange and sounds like a parrot? A carrot!",
    "Why did the math book look sad? Because it had too many problems!",
];

// MEMORY GAME ICONS
const cardIcons = ['🌟', '🍎', '🚀', '🐱', '🌈', '🍕', '⚽', '🎸'];

const DistractionZone = () => {
    // JOKE STATE
    const [currentJoke, setCurrentJoke] = useState(jokes[0]);

    const handleNewJoke = () => {
        const randomIndex = Math.floor(Math.random() * jokes.length);
        setCurrentJoke(jokes[randomIndex]);
    };

    // GAME STATE
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);

    const initializeGame = () => {
        const shuffled = [...cardIcons, ...cardIcons]
            .sort(() => Math.random() - 0.5)
            .map((icon, index) => ({ id: index, icon }));
        setCards(shuffled);
        setFlipped([]);
        setMatched([]);
        setMoves(0);
    };

    useEffect(() => {
        initializeGame();
    }, []);

    const handleCardClick = (id) => {
        if (flipped.length === 2 || matched.includes(id) || flipped.includes(id)) return;

        const newFlipped = [...flipped, id];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            const firstCard = cards.find(c => c.id === newFlipped[0]);
            const secondCard = cards.find(c => c.id === newFlipped[1]);

            if (firstCard.icon === secondCard.icon) {
                setMatched([...matched, newFlipped[0], newFlipped[1]]);
                setFlipped([]);
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Distraction Zone</h1>
                <p className={styles.subtitle}>Take a break. Reset your mind.</p>
            </div>

            {/* NOSTALGIA SECTION - TOM & JERRY */}
            <div className={styles.videoSection}>
                <div className={styles.videoSectionTitle}>
                    <Tv size={28} color="#FF6B6B" />
                    Nostalgic Comfort
                </div>
                <div className={styles.videoGrid}>
                    <div className={styles.videoWrapper}>
                        <iframe
                            className={styles.iframe}
                            src="https://www.youtube.com/embed/_GE6zf_hH48"
                            title="Tom & Jerry 1"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                    <div className={styles.videoWrapper}>
                        <iframe
                            className={styles.iframe}
                            src="https://www.youtube.com/embed/pEl3-0GHyoQ"
                            title="Tom & Jerry 2"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>

            <div className={styles.distractionGrid}>
                {/* JOKES SECTION */}
                <div className={styles.card}>
                    <div className={styles.sectionTitle}>
                        <Smile size={32} color="#FFD700" style={{ marginBottom: '1rem' }} />
                        <h3>Instant Cheer-Up</h3>
                    </div>
                    <div className={styles.jokeText}>
                        "{currentJoke}"
                    </div>
                    <Button onClick={handleNewJoke}>
                        <RefreshCw size={18} style={{ marginRight: '8px' }} />
                        New Joke
                    </Button>
                </div>

                {/* MEMORY GAME SECTION */}
                <div className={styles.card}>
                    <div className={styles.sectionTitle}>
                        <Gamepad2 size={32} color="#4ECDC4" style={{ marginBottom: '1rem' }} />
                        <h3>Memory Focus</h3>
                    </div>
                    <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Moves: {moves}</p>

                    <div className={styles.gameBoard}>
                        {cards.map((card) => (
                            <div
                                key={card.id}
                                className={`${styles.cardItem} ${flipped.includes(card.id) || matched.includes(card.id) ? styles.active : ''
                                    } ${matched.includes(card.id) ? styles.matched : ''}`}
                                onClick={() => handleCardClick(card.id)}
                            >
                                {(flipped.includes(card.id) || matched.includes(card.id)) ? card.icon : '?'}
                            </div>
                        ))}
                    </div>

                    {matched.length === cards.length && cards.length > 0 && (
                        <div className={styles.winMessage}>
                            You Won! 🎉 <span onClick={initializeGame} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Play Again</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DistractionZone;
