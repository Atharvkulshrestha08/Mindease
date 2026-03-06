import React from 'react';
import { Globe, Shield, PhoneCall } from 'lucide-react';
import Card from '../components/Card';
import styles from './Resources.module.css';

const resources = [
    { country: 'United States', name: '988 Suicide & Crisis Lifeline', number: '988', desc: '24/7, free and confidential support.' },
    { country: 'United Kingdom', name: 'Samaritans', number: '116 123', desc: 'Whatever you\'re going through, a Samaritan will face it with you.' },
    { country: 'India', name: 'AASRA', number: '91-9820466726', desc: '24x7 Helpline.' },
    { country: 'Australia', name: 'Lifeline', number: '13 11 14', desc: 'Crisis support and suicide prevention.' },
    { country: 'Global', name: 'Find A Helpline', number: 'findahelpline.com', desc: 'Directory of international helplines.', isLink: true },
];

const Resources = () => {
    return (
        <div className={styles.container}>
            <h2 className={styles.pageTitle}>Emergency Resources</h2>
            <Card className={styles.introCard}>
                <Shield size={32} color="var(--color-accent)" style={{ marginBottom: '1rem' }} />
                <h3>You are not alone.</h3>
                <p>If you or someone you know is in immediate danger, please call your local emergency services (911, 999, 112) immediately.</p>
            </Card>

            <div className={styles.grid}>
                {resources.map((res) => (
                    <Card key={res.name} className={styles.resourceCard}>
                        <div className={styles.countryBadge}>{res.country}</div>
                        <h4 className={styles.resourceName}>{res.name}</h4>
                        <p className={styles.resourceDesc}>{res.desc}</p>
                        {res.isLink ? (
                            <a href={`https://${res.number}`} target="_blank" rel="noopener noreferrer" className={styles.callBtn}>
                                <Globe size={18} />
                                <span>Visit Website</span>
                            </a>
                        ) : (
                            <a href={`tel:${res.number}`} className={styles.callBtn}>
                                <PhoneCall size={18} />
                                <span>{res.number}</span>
                            </a>
                        )}
                    </Card>
                ))}
            </div>

            <p className={styles.disclaimer}>
                MindEase is a wellness tool and not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
        </div>
    );
};

export default Resources;
