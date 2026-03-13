import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { animate, stagger } from 'animejs';
import { ArrowRight, Shield, Heart, Zap } from 'lucide-react';
import Button from '../components/Button';
import useAnimeOnMount from '../hooks/useAnimeOnMount';
import styles from './LandingPage.module.css';
import logo from '../assets/logo.png';

const LandingPage = () => {
    // Staggered feature cards
    const featuresRef = useAnimeOnMount(`.${styles.featureCard}`, {
        staggerDelay: 150,
        duration: 700,
        translateY: 40,
        delay: 300,
    });

    // Staggered badges
    const badgesRef = useAnimeOnMount(`.${styles.badge}`, {
        staggerDelay: 120,
        duration: 500,
        translateY: 20,
        delay: 200,
    });

    // Animated stat counters
    const statsRef = useRef(null);
    const statsAnimated = useRef(false);

    useEffect(() => {
        if (!statsRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !statsAnimated.current) {
                        statsAnimated.current = true;
                        const statEls = statsRef.current.querySelectorAll('[data-stat-target]');
                        statEls.forEach((el) => {
                            const target = parseFloat(el.dataset.statTarget);
                            const suffix = el.dataset.statSuffix || '';
                            const decimals = el.dataset.statDecimals ? parseInt(el.dataset.statDecimals) : 0;
                            const obj = { value: 0 };
                            animate(obj, {
                                value: target,
                                duration: 1500,
                                easing: 'easeOutExpo',
                                onUpdate: () => {
                                    el.textContent = obj.value.toFixed(decimals) + suffix;
                                },
                            });
                        });
                    }
                });
            },
            { threshold: 0.3 }
        );
        observer.observe(statsRef.current);
        return () => observer.disconnect();
    }, []);
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.logo}>
                    <img src={logo} alt="MindEase" style={{ height: 50 }} />
                </div>
                <nav className={styles.headerNav}>
                    <Link to="/pricing">
                        <Button variant="outline">Pricing</Button>
                    </Link>
                    <Link to="/app/dashboard">
                        <Button>Get Started</Button>
                    </Link>
                </nav>
            </header>

            <main>
                <section className={styles.hero}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className={styles.title}
                    >
                        Find your balance,<br />one day at a time.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className={styles.subtitle}
                    >
                        A privacy-first mental wellness platform designed to help you track your mood, reduce stress, and stay focused.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Link to="/app/dashboard">
                            <Button size="large" className={styles.ctaBtn}>
                                Start Your Journey <ArrowRight size={20} style={{ marginLeft: 8 }} />
                            </Button>
                        </Link>
                    </motion.div>
                </section>

                <section className={styles.features} ref={featuresRef}>
                    <div className={styles.featureCard}>
                        <div className={styles.iconBg}><Heart size={24} color="#F5B7B1" /></div>
                        <h3>Mood Tracking</h3>
                        <p>Understand your emotional patterns with daily check-ins and insights.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.iconBg}><Zap size={24} color="#A9CCE3" /></div>
                        <h3>Wellness Sessions</h3>
                        <p>Access guided breathing, focus timers, and stretching exercises.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.iconBg}><Shield size={24} color="#A3E4D7" /></div>
                        <h3>Privacy First</h3>
                        <p>Your data never leaves your device. Everything is stored locally.</p>
                    </div>
                </section>

                <section className={styles.impact}>
                    <div className={styles.impactContent}>
                        <h2>Why It Matters</h2>
                        <p className={styles.impactSubtitle}>Mental health is a global crisis. The numbers speak for themselves.</p>

                        <div className={styles.statGrid} ref={statsRef}>
                            <div className={styles.statItem}>
                                <span className={styles.statValue} data-stat-target="9.2" data-stat-decimals="1">0</span>
                                <span className={styles.statLabel}>Global Suicide Rate<br />(per 100k)</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statValue} data-stat-target="12.4" data-stat-decimals="1">0</span>
                                <span className={styles.statLabel}>Europe Region<br />(Highest Rate)</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statValue} data-stat-target="40" data-stat-suffix="s" data-stat-decimals="0">0</span>
                                <span className={styles.statLabel}>One person dies by<br />suicide every 40 seconds</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.comparison}>
                    <h2>The MindEase Advantage</h2>
                    <p className={styles.slug}>Breaking the barriers of cost, complexity, and commitment.</p>

                    <div className={styles.tableWrapper}>
                        <table className={styles.compTable}>
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th className={styles.highlight}>MindEase</th>
                                    <th>Wysa</th>
                                    <th>Headspace</th>
                                    <th>Therapy</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Cost</td>
                                    <td className={styles.highlight}><strong>FREE</strong></td>
                                    <td>₹599/mo</td>
                                    <td>₹1,299/yr</td>
                                    <td>₹1,500+/session</td>
                                </tr>
                                <tr>
                                    <td>Time Commitment</td>
                                    <td className={styles.highlight}>5 min/day</td>
                                    <td>15-20 min</td>
                                    <td>20+ min</td>
                                    <td>60 min</td>
                                </tr>
                                <tr>
                                    <td>Appointments</td>
                                    <td className={styles.highlight}>None</td>
                                    <td>None</td>
                                    <td>None</td>
                                    <td>Required</td>
                                </tr>
                                <tr>
                                    <td>Privacy</td>
                                    <td className={styles.highlight}>Local Device</td>
                                    <td>Cloud</td>
                                    <td>Cloud</td>
                                    <td>Confidential</td>
                                </tr>
                                <tr>
                                    <td>Target</td>
                                    <td className={styles.highlight}>Students & Youth</td>
                                    <td>General</td>
                                    <td>General</td>
                                    <td>All</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className={styles.badges} ref={badgesRef}>
                        <div className={styles.badge}>✅ 5-minute Instant Relief</div>
                        <div className={styles.badge}>✅ No Sign-up Required</div>
                        <div className={styles.badge}>✅ Privacy First</div>
                    </div>
                </section>

                <section className={styles.privacy}>
                    <h2>Your Privacy Matters</h2>
                    <p>MindEase does not collect or transmit personal health data. All user inputs are stored locally in your browser (LocalStorage).</p>
                </section>
            </main>

            <footer className={styles.footer}>
                <p>&copy; {new Date().getFullYear()} MindEase. Built for wellness.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
