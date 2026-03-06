import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCw, Download, Printer } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import styles from './Flashcards.module.css';

const Flashcards = () => {
    const [inputText, setInputText] = useState('');
    const [cards, setCards] = useState([]);

    const generateCards = () => {
        if (!inputText.trim()) return;

        // Simple parser
        // 1. Split by double newline (paragraphs)
        const blocks = inputText.split(/\n\s*\n/);

        const newCards = blocks.map((block, index) => {
            // Try to find a delimiter
            let front = '';
            let back = '';

            if (block.includes(' - ')) {
                [front, back] = block.split(' - ');
            } else if (block.includes('?')) {
                const parts = block.split('?');
                front = parts[0] + '?';
                back = parts.slice(1).join('?');
            } else {
                // Just split by first newline
                const lines = block.split('\n');
                front = lines[0];
                back = lines.slice(1).join('\n');
            }

            if (!back.trim()) {
                // If no back, maybe just whole text is front?
                back = '...';
            }

            return { id: Date.now() + index, front: front.trim(), back: back.trim(), isFlipped: false };
        });

        setCards(newCards);
    };

    const handleFlip = (id) => {
        setCards(cards.map(c => c.id === id ? { ...c, isFlipped: !c.isFlipped } : c));
    };

    const downloadJSON = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cards));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "mind_ease_flashcards.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.pageTitle}>Smart Flashcards</h2>

            <div className={styles.inputSection}>
                <Card>
                    <textarea
                        className={styles.textarea}
                        placeholder="Paste your notes here... (Separate cards by empty lines. Use ' - ' or '?' to separate front/back automatically)"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                    <div className={styles.actions}>
                        <Button onClick={generateCards} disabled={!inputText.trim()}>
                            <RotateCw size={18} />
                            <span style={{ marginLeft: 8 }}>Generate Flashcards</span>
                        </Button>
                    </div>
                </Card>
            </div>

            {cards.length > 0 && (
                <div className={styles.resultsSection}>
                    <div className={styles.resultsHeader}>
                        <h3>Generated Cards ({cards.length})</h3>
                        <div className={styles.exportActions}>
                            <button onClick={downloadJSON} className={styles.iconBtn} title="Download JSON"><Download size={20} /></button>
                            <button onClick={handlePrint} className={styles.iconBtn} title="Print"><Printer size={20} /></button>
                        </div>
                    </div>

                    <div className={styles.grid}>
                        {cards.map((card) => (
                            <div key={card.id} className={styles.cardWrapper} onClick={() => handleFlip(card.id)}>
                                <motion.div
                                    className={styles.cardInner}
                                    initial={false}
                                    animate={{ rotateY: card.isFlipped ? 180 : 0 }}
                                    transition={{ duration: 0.6, animationDirection: "normal" }}
                                >
                                    <div className={styles.cardFront}>
                                        <div className={styles.cardContent}>{card.front}</div>
                                        <div className={styles.cardHint}>Click to flip</div>
                                    </div>
                                    <div className={styles.cardBack}>
                                        <div className={styles.cardContent}>{card.back}</div>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Flashcards;
