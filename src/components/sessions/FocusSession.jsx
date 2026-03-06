import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import Button from '../Button';
import styles from './Sessions.module.css';

const FocusSession = () => {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        setIsActive(false);
                        clearInterval(interval);
                        // Optional: Play sound
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                } else {
                    setSeconds(seconds - 1);
                }
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds, minutes]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setMinutes(25);
        setSeconds(0);
    };

    return (
        <div className={styles.sessionContainer}>
            <h3 className={styles.sessionTitle}>Focus Mode</h3>
            <div className={styles.timerDisplay}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className={styles.controls}>
                <Button onClick={toggleTimer} variant="primary">
                    {isActive ? <Pause size={20} /> : <Play size={20} />}
                    <span style={{ marginLeft: 8 }}>{isActive ? 'Pause' : 'Start'}</span>
                </Button>
                <Button onClick={resetTimer} variant="neutral">
                    <RotateCcw size={20} />
                </Button>
            </div>
            <div className={styles.adjustments}>
                <button onClick={() => setMinutes(25)} className={styles.adjustBtn}>25m</button>
                <button onClick={() => setMinutes(50)} className={styles.adjustBtn}>50m</button>
            </div>
        </div>
    );
};

export default FocusSession;
