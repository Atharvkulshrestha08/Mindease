import React, { useState, useEffect } from 'react';
import { Gamepad2, RefreshCw, Dice1, Tv, Dices } from 'lucide-react';
import styles from './DistractionZone.module.css';
import Button from '../components/Button';

// MEMORY GAME ICONS
const cardIcons = ['🌟', '🍎', '🚀', '🐱', '🌈', '🍕', '⚽', '🎸'];

// ═══════ SNAKES & LADDERS ═══════
const BOARD_SIZE = 36; // 6x6 board
const snakes = { 32: 10, 27: 5, 21: 3, 17: 7, 34: 22 };
const ladders = { 2: 15, 8: 26, 13: 25, 20: 33, 29: 35 };

const SnakesAndLadders = () => {
    const [playerPos, setPlayerPos] = useState(0);
    const [botPos, setBotPos] = useState(0);
    const [diceValue, setDiceValue] = useState(null);
    const [turn, setTurn] = useState('player'); // 'player' | 'bot'
    const [message, setMessage] = useState('Your turn — roll the dice! 🎲');
    const [rolling, setRolling] = useState(false);
    const [winner, setWinner] = useState(null);

    const movePlayer = (currentPos, roll, isBot) => {
        let newPos = currentPos + roll;
        const name = isBot ? 'Bot' : 'You';

        if (newPos > BOARD_SIZE) {
            setMessage(`${name} need${isBot ? 's' : ''} exact roll! Stayed at ${currentPos} 🎯`);
            return currentPos;
        }
        if (newPos === BOARD_SIZE) {
            setMessage(isBot ? '🤖 Bot wins! Better luck next time!' : '🎉 You WON! Amazing!');
            setWinner(isBot ? 'bot' : 'player');
            return newPos;
        }
        if (snakes[newPos]) {
            setMessage(`🐍 ${name} hit a snake at ${newPos}! Down to ${snakes[newPos]}`);
            newPos = snakes[newPos];
        } else if (ladders[newPos]) {
            setMessage(`🪜 ${name} found a ladder at ${newPos}! Up to ${ladders[newPos]}`);
            newPos = ladders[newPos];
        } else {
            setMessage(`${name} moved to ${newPos} ${isBot ? '🤖' : '✨'}`);
        }
        return newPos;
    };

    const rollDice = () => {
        if (rolling || winner || turn !== 'player') return;
        setRolling(true);
        const roll = Math.floor(Math.random() * 6) + 1;
        setDiceValue(roll);

        setTimeout(() => {
            setPlayerPos(prev => {
                const newPos = movePlayer(prev, roll, false);
                setRolling(false);
                if (newPos !== BOARD_SIZE) {
                    setTurn('bot');
                }
                return newPos;
            });
        }, 400);
    };

    // Bot auto-rolls after player's turn
    useEffect(() => {
        if (turn !== 'bot' || winner) return;
        const timer = setTimeout(() => {
            setRolling(true);
            const roll = Math.floor(Math.random() * 6) + 1;
            setDiceValue(roll);
            setMessage(`🤖 Bot rolled a ${roll}...`);

            setTimeout(() => {
                setBotPos(prev => {
                    const newPos = movePlayer(prev, roll, true);
                    setRolling(false);
                    if (newPos !== BOARD_SIZE) {
                        setTurn('player');
                        setTimeout(() => setMessage('Your turn — roll the dice! 🎲'), 800);
                    }
                    return newPos;
                });
            }, 500);
        }, 1000);
        return () => clearTimeout(timer);
    }, [turn, winner]);

    const resetGame = () => {
        setPlayerPos(0);
        setBotPos(0);
        setDiceValue(null);
        setTurn('player');
        setMessage('Your turn — roll the dice! 🎲');
        setRolling(false);
        setWinner(null);
    };

    // Render 6x6 board
    const renderBoard = () => {
        const cells = [];
        for (let row = 0; row < 6; row++) {
            const rowCells = [];
            for (let col = 0; col < 6; col++) {
                const cellNum = row % 2 === 0
                    ? BOARD_SIZE - row * 6 - col
                    : BOARD_SIZE - row * 6 - (5 - col);

                const isPlayer = playerPos === cellNum && cellNum > 0;
                const isBot = botPos === cellNum && cellNum > 0;
                const isSnake = snakes[cellNum];
                const isLadder = ladders[cellNum];

                let cellClass = styles.boardCell;
                if (isPlayer) cellClass += ` ${styles.playerCell}`;
                if (isBot && !isPlayer) cellClass += ` ${styles.botCell}`;
                if (isSnake) cellClass += ` ${styles.snakeCell}`;
                if (isLadder) cellClass += ` ${styles.ladderCell}`;

                rowCells.push(
                    <div key={cellNum} className={cellClass}>
                        <span className={styles.cellNum}>{cellNum}</span>
                        {isPlayer && <span className={styles.playerToken}>🧑</span>}
                        {isBot && <span className={styles.botToken}>🤖</span>}
                        {!isPlayer && !isBot && isSnake && <span className={styles.cellIcon}>🐍</span>}
                        {!isPlayer && !isBot && isLadder && <span className={styles.cellIcon}>🪜</span>}
                    </div>
                );
            }
            cells.push(<div key={row} className={styles.boardRow}>{rowCells}</div>);
        }
        return cells;
    };

    const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

    return (
        <div className={styles.card}>
            <div className={styles.sectionTitle}>
                <Dices size={32} color="#7C3AED" style={{ marginBottom: '1rem' }} />
                <h3>Snakes & Ladders</h3>
            </div>

            <div className={styles.turnIndicator}>
                <span className={turn === 'player' ? styles.turnActive : ''}>🧑 You</span>
                <span>vs</span>
                <span className={turn === 'bot' ? styles.turnActive : ''}>🤖 Bot</span>
            </div>

            <div className={styles.snlBoard}>{renderBoard()}</div>

            <div className={styles.snlControls}>
                <div className={styles.diceDisplay}>
                    {diceValue ? (
                        <span className={`${styles.diceValue} ${rolling ? styles.diceRolling : ''}`}>
                            {diceEmojis[diceValue - 1]}
                        </span>
                    ) : (
                        <span className={styles.diceValue}>🎲</span>
                    )}
                </div>
                <p className={styles.snlMessage}>{message}</p>
                <div className={styles.snlActions}>
                    <Button onClick={rollDice} disabled={rolling || !!winner || turn !== 'player'}>
                        {rolling ? 'Rolling...' : turn === 'bot' ? "Bot's turn..." : 'Roll Dice 🎲'}
                    </Button>
                    <button className={styles.resetBtn} onClick={resetGame}>
                        <RefreshCw size={16} /> Reset
                    </button>
                </div>
            </div>
        </div>
    );
};


const DistractionZone = () => {
    // MEMORY GAME STATE
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
                {/* SNAKES & LADDERS */}
                <SnakesAndLadders />

                {/* MEMORY GAME SECTION */}
                <div className={styles.card}>
                    <div className={styles.sectionTitle}>
                        <Gamepad2 size={32} color="#10B981" style={{ marginBottom: '1rem' }} />
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
