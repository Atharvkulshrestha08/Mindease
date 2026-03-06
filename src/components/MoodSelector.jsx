import React from 'react';
import { Smile, Frown, Meh, Activity, AlertCircle } from 'lucide-react';
import styles from './MoodSelector.module.css';
import clsx from 'clsx';

const moodOptions = [
    { value: 'calm', label: 'Calm', icon: Smile, color: '#A3E4D7' },
    { value: 'focused', label: 'Focused', icon: Activity, color: '#A9CCE3' },
    { value: 'neutral', label: 'Neutral', icon: Meh, color: '#D7DBDD' },
    { value: 'overwhelmed', label: 'Overwhelmed', icon: AlertCircle, color: '#F9E79F' },
    { value: 'stressed', label: 'Stressed', icon: Frown, color: '#F5B7B1' },
];

const MoodSelector = ({ selectedMood, onSelect }) => {
    return (
        <div className={styles.container}>
            {moodOptions.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onSelect(option.value)}
                    className={clsx(styles.moodBtn, selectedMood === option.value && styles.selected)}
                    style={{ '--hover-color': option.color }}
                >
                    <option.icon size={28} />
                    <span>{option.label}</span>
                </button>
            ))}
        </div>
    );
};

export default MoodSelector;
