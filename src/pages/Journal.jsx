import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Zap } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import useLocalStorage from '../hooks/useLocalStorage';
import styles from './Journal.module.css';

const prompts = [
    "What is currently causing tension?",
    "What is within your control?",
    "What is one constructive step today?"
];

const Journal = () => {
    const [entries, setEntries] = useLocalStorage('journalEntries', []);
    const [content, setContent] = useState('');
    const [activePrompt, setActivePrompt] = useState(null);

    const [reframedThought, setReframedThought] = useState(null);

    const reframeRules = [
        { pattern: /never|always|nothing|everything/i, advice: "Try to avoid 'all-or-nothing' thinking. Is there a middle ground?" },
        { pattern: /should|must|ought/i, advice: "Consider replacing 'should' with 'it would be nice if'. Reduce the pressure." },
        { pattern: /fail|worst|horrible|terrible/i, advice: "This sounds like catastrophizing. What's a more balanced perspective?" },
        { pattern: /my fault|i'm to blame/i, advice: "Is there anything else that contributed to this situation? Be kind to yourself." }
    ];

    const handleReframe = () => {
        const rule = reframeRules.find(r => r.pattern.test(content));
        if (rule) {
            setReframedThought(rule.advice);
        } else {
            setReframedThought("Think about one small thing you can control right now. How does that change your perspective?");
        }
    };

    const handleSave = () => {
        if (!content.trim()) return;
        const newEntry = {
            id: Date.now(),
            date: new Date().toISOString(),
            content,
            prompt: activePrompt,
            reframe: reframedThought
        };
        setEntries([newEntry, ...entries]);
        setContent('');
        setActivePrompt(null);
        setReframedThought(null);
    };

    const handleDelete = (id) => {
        setEntries(entries.filter(e => e.id !== id));
    };

    const usePrompt = (prompt) => {
        setActivePrompt(prompt);
        // Optional: Prepend prompt to content? Or just display it as context.
        // Let's display it as a header for the current entry.
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.pageTitle}>Journal</h2>

            <div className={styles.editorSection}>
                <Card>
                    {activePrompt && <div className={styles.activePrompt}>{activePrompt}</div>}
                    {!activePrompt && (
                        <div className={styles.promptsList}>
                            <p className={styles.promptsLabel}>Need a spark?</p>
                            <div className={styles.chips}>
                                {prompts.map((p) => (
                                    <button key={p} onClick={() => usePrompt(p)} className={styles.chip}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <textarea
                        className={styles.textarea}
                        placeholder="Write your thoughts here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <div className={styles.actions}>
                        <Button onClick={handleSave} disabled={!content.trim()}>
                            <Save size={18} />
                            <span style={{ marginLeft: 8 }}>Save Entry</span>
                        </Button>
                        <Button variant="outline" onClick={handleReframe} disabled={!content.trim()}>
                            <Zap size={18} />
                            <span style={{ marginLeft: 8 }}>AI Reframe (CBT)</span>
                        </Button>
                        {activePrompt && (
                            <Button variant="neutral" onClick={() => setActivePrompt(null)}>
                                Clear Prompt
                            </Button>
                        )}
                    </div>

                    {reframedThought && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={styles.reframeBox}
                        >
                            <div style={{ fontWeight: 700, marginBottom: 4 }}>💡 Cognitive Reframing</div>
                            <p>{reframedThought}</p>
                        </motion.div>
                    )}
                </Card>
            </div>

            <div className={styles.historySection}>
                <h3 className={styles.historyTitle}>Past Entries</h3>
                <div className={styles.entriesList}>
                    {entries.length === 0 && <p className={styles.emptyText}>No journal entries yet.</p>}
                    {entries.map((entry) => (
                        <Card key={entry.id} className={styles.entryCard}>
                            <div className={styles.entryHeader}>
                                <span className={styles.entryDate}>
                                    {new Date(entry.date).toLocaleDateString()} at {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <button onClick={() => handleDelete(entry.id)} className={styles.deleteBtn} title="Delete">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            {entry.prompt && <div className={styles.entryPrompt}>{entry.prompt}</div>}
                            <p className={styles.entryContent}>{entry.content}</p>
                            {entry.reframe && (
                                <div className={styles.savedReframe}>
                                    <strong>Reflection:</strong> {entry.reframe}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Journal;
