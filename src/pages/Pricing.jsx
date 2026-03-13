import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Building2, GraduationCap, ArrowRight, Shield, Users, BarChart3, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import styles from './Pricing.module.css';

const Pricing = () => {
    const [selectedTier, setSelectedTier] = useState(null);

    const tiers = [
        {
            id: 'free',
            name: 'Student',
            icon: GraduationCap,
            price: 'FREE',
            period: 'forever',
            tagline: 'Zero barriers. Full access.',
            color: '#3EBD93',
            features: [
                'Daily Mood Tracking',
                'Scream into the Void (Vent Space)',
                'MindEase Buddy (Hinglish AI Chat)',
                'Guided Breathing & Focus Sessions',
                'Journal & Sleep Tracker',
                'Personal Analytics & Achievements',
                'Global Mental Health Statistics',
                'Music Station (YouTube)',
                'Distraction Zone Games',
                '100% Offline · Privacy First',
            ],
            cta: 'Start Free',
            ctaPath: '/app/vent',
        },
        {
            id: 'campus',
            name: 'Campus Plan',
            icon: Building2,
            price: '₹2,500',
            period: '/dept/year',
            tagline: 'For the price of one office chair.',
            color: '#6366F1',
            popular: true,
            features: [
                'Everything in Student plan',
                'Departmental wellness dashboard',
                'Anonymous aggregate mood reports',
                'Guardian Insight for parents',
                'Priority support channel',
                'Campus-wide mental health pulse',
                'Custom branding for your institution',
                'Bulk onboarding & training',
                '100% student coverage guaranteed',
                'No per-student fees. Ever.',
            ],
            cta: 'Contact Us',
            ctaAction: () => setSelectedTier('campus'),
        },
        {
            id: 'premium',
            name: 'Premium',
            icon: Sparkles,
            price: '₹9',
            period: '/lifetime',
            tagline: 'Founding Member. Forever.',
            color: '#F59E0B',
            features: [
                'Everything in Student plan',
                'Spotify Library Integration',
                'Ad-free Healing Playlists',
                'Exclusive Sentient Soundscapes',
                'Early access to new features',
                'Founding Member badge',
            ],
            cta: 'Upgrade for ₹9',
            ctaPath: '/app/music',
        },
    ];

    return (
        <div className={styles.container}>
            {/* Hero */}
            <motion.div
                className={styles.hero}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className={styles.heroTitle}>
                    Mental Health Shouldn't Have a Paywall
                </h1>
                <p className={styles.heroSubtitle}>
                    Free for every student. Micro-priced for institutions.
                    Because healing shouldn't cost more than a cup of chai.
                </p>
            </motion.div>

            {/* Pricing Cards */}
            <div className={styles.grid}>
                {tiers.map((tier, i) => (
                    <motion.div
                        key={tier.id}
                        className={`${styles.card} ${tier.popular ? styles.popular : ''}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.15 }}
                        style={{ '--tier-color': tier.color }}
                    >
                        {tier.popular && (
                            <div className={styles.popularBadge}>
                                🔥 MOST IMPACTFUL
                            </div>
                        )}

                        <div className={styles.cardHeader}>
                            <tier.icon size={28} color={tier.color} />
                            <h3>{tier.name}</h3>
                        </div>

                        <div className={styles.priceRow}>
                            <span className={styles.price}>{tier.price}</span>
                            <span className={styles.period}>{tier.period}</span>
                        </div>

                        <p className={styles.tagline}>{tier.tagline}</p>

                        <ul className={styles.featureList}>
                            {tier.features.map((feat, j) => (
                                <li key={j}>
                                    <Check size={16} color={tier.color} />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>

                        {tier.ctaPath ? (
                            <Link to={tier.ctaPath} className={styles.ctaLink}>
                                <button
                                    className={styles.ctaBtn}
                                    style={{ background: tier.popular ? tier.color : 'transparent', color: tier.popular ? '#fff' : tier.color, border: `2px solid ${tier.color}` }}
                                >
                                    {tier.cta} <ArrowRight size={18} />
                                </button>
                            </Link>
                        ) : (
                            <button
                                className={styles.ctaBtn}
                                style={{ background: tier.popular ? tier.color : 'transparent', color: tier.popular ? '#fff' : tier.color, border: `2px solid ${tier.color}` }}
                                onClick={tier.ctaAction}
                            >
                                {tier.cta} <ArrowRight size={18} />
                            </button>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* B2B Value Prop */}
            <motion.div
                className={styles.b2bSection}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <h2>Why ₹2,500 per department?</h2>
                <div className={styles.valueGrid}>
                    <div className={styles.valueCard}>
                        <Users size={24} color="#6366F1" />
                        <h4>100% Coverage</h4>
                        <p>No per-student fees means every student gets access. No one is left behind.</p>
                    </div>
                    <div className={styles.valueCard}>
                        <BarChart3 size={24} color="#6366F1" />
                        <h4>Wellness Analytics</h4>
                        <p>Anonymous aggregate data helps departments identify systemic issues early.</p>
                    </div>
                    <div className={styles.valueCard}>
                        <Shield size={24} color="#6366F1" />
                        <h4>Zero Stigma</h4>
                        <p>We look like a study tool, not a therapy app. Students actually use it.</p>
                    </div>
                </div>
            </motion.div>

            {/* Comparison Table */}
            <motion.div
                className={styles.comparisonSection}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <h2>Phase 1: How We're Different</h2>
                <div className={styles.tableWrapper}>
                    <table className={styles.compTable}>
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th>The Giants (Clinical Apps)</th>
                                <th className={styles.highlight}>MindEase (Student Hub)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>First Interaction</td>
                                <td>Health Assessment / Survey</td>
                                <td className={styles.highlight}>Anonymized Venting / "Scream" 🗣️</td>
                            </tr>
                            <tr>
                                <td>Parental Role</td>
                                <td>Excluded or "Medical Advisor"</td>
                                <td className={styles.highlight}>Emotional "Weather Reporter" 🌡️</td>
                            </tr>
                            <tr>
                                <td>Tone of Voice</td>
                                <td>Formal / Professional</td>
                                <td className={styles.highlight}>Relatable / "Bhai-Didi" Style 🇮🇳</td>
                            </tr>
                            <tr>
                                <td>Goal</td>
                                <td>Clinical Recovery</td>
                                <td className={styles.highlight}>Emotional De-cluttering 💆</td>
                            </tr>
                            <tr>
                                <td>Barrier to Entry</td>
                                <td>High (Cost & Stigma)</td>
                                <td className={styles.highlight}>Zero (Social-first access) ✅</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Contact modal for Campus plan */}
            {selectedTier === 'campus' && (
                <div className={styles.contactOverlay} onClick={() => setSelectedTier(null)}>
                    <motion.div
                        className={styles.contactModal}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>🏛️ Campus Plan Inquiry</h3>
                        <p>Interested in bringing MindEase to your institution?</p>
                        <p className={styles.contactEmail}>
                            📧 Reach us at: <strong>campus@mindease.in</strong>
                        </p>
                        <p className={styles.contactNote}>
                            We'll set up a demo and have your department running in 48 hours.
                        </p>
                        <button className={styles.closeContact} onClick={() => setSelectedTier(null)}>
                            Close
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Pricing;
