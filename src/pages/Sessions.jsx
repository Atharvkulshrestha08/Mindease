import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Clock, Wind, BookOpen, Activity, ArrowLeft } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import FocusSession from '../components/sessions/FocusSession';
import BreathingSession from '../components/sessions/BreathingSession';
import StretchSession from '../components/sessions/StretchSession';
import MeditationSession from '../components/sessions/MeditationSession';
import styles from '../components/sessions/Sessions.module.css';

const Sessions = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const activeSession = searchParams.get('type');

    const handleBack = () => {
        setSearchParams({});
    };

    const startSession = (type) => {
        if (type === 'journaling') {
            navigate('/app/journal');
        } else {
            setSearchParams({ type });
        }
    };

    const renderActiveSession = () => {
        switch (activeSession) {
            case 'focus':
                return <FocusSession />;
            case 'breathing':
                return <BreathingSession />;
            case 'stretch':
                return <StretchSession />;
            case 'meditation':
                return <MeditationSession />;
            default:
                return null;
        }
    };

    if (activeSession) {
        return (
            <div className={styles.container}>
                <Button onClick={handleBack} variant="neutral" style={{ marginBottom: '1rem' }}>
                    <ArrowLeft size={20} />
                    <span style={{ marginLeft: 8 }}>Back to Sessions</span>
                </Button>
                <Card>
                    {renderActiveSession()}
                </Card>
            </div>
        );
    }

    const sessions = [
        { id: 'focus', title: 'Focus Mode', icon: Clock, description: '25-minute timer to boost productivity.' },
        { id: 'breathing', title: 'Breathing', icon: Wind, description: '4-4-6 technique to calm your nerves.' },
        { id: 'meditation', title: 'Meditation', icon: Activity, description: 'Guided meditations for inner peace.' },
        { id: 'journaling', title: 'Journaling', icon: BookOpen, description: 'Write down your thoughts and feelings.' },
        { id: 'stretch', title: 'Stretch', icon: Activity, description: 'Release tension with a quick routine.' },
    ];

    return (
        <div className={styles.container}>
            <h2 className={styles.pageTitle}>Wellness Sessions</h2>
            <div className={styles.grid}>
                {sessions.map((session) => (
                    <Card
                        key={session.id}
                        className={styles.sessionCard}
                        onClick={() => startSession(session.id)}
                        title={session.title}
                    >
                        <div className={styles.iconWrapper}>
                            <session.icon size={40} strokeWidth={1.5} color="var(--color-text-secondary)" />
                        </div>
                        <p className={styles.description}>{session.description}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Sessions;
