import React from 'react';
import styles from './Sessions.module.css';

const StretchSession = () => {
    return (
        <div className={styles.sessionContainer}>
            <h3 className={styles.sessionTitle}>3-Minute Stretch</h3>
            <div className={styles.stepList}>
                <div className={styles.step}>
                    <h4>1. Neck Rolls</h4>
                    <p>Gently roll your neck from side to side. (1 min)</p>
                </div>
                <div className={styles.step}>
                    <h4>2. Shoulder Shrugs</h4>
                    <p>Lift shoulders to ears, then drop them. (1 min)</p>
                </div>
                <div className={styles.step}>
                    <h4>3. Wrist Release</h4>
                    <p>Extend arms and gently pull fingers back. (1 min)</p>
                </div>
            </div>
        </div>
    );
};

export default StretchSession;
