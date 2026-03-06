import React, { useState, useRef } from 'react';
import { Music, Upload, Headphones, Disc, Youtube, Zap } from 'lucide-react';
import styles from './MusicStation.module.css';
import Button from '../components/Button';
import PremiumModal from '../components/PremiumModal';

const MusicStation = () => {
    const [localMusic, setLocalMusic] = useState(null);
    const [fileName, setFileName] = useState('');
    const [isPremium, setIsPremium] = useState(localStorage.getItem('isPremium') === 'true');
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setLocalMusic(url);
            setFileName(file.name);
        }
    };

    const handleUpgrade = () => {
        localStorage.setItem('isPremium', 'true');
        setIsPremium(true);
        setShowPremiumModal(false);
    };

    const playlists = [
        { id: '1ZYbU82GVz4', title: 'Soothing Piano' },
        { id: 'bP9gMpl1gyQ', title: 'Relaxing Nature Sounds' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Soul Melodies</h1>
                <p className={styles.subtitle}>Curated sounds to heal your mind and spirit.</p>
                {!isPremium && (
                    <Button
                        className={styles.premiumBanner}
                        onClick={() => setShowPremiumModal(true)}
                    >
                        <Zap size={16} fill="currentColor" />
                        Unlock Spotify Premium for ₹9
                    </Button>
                )}
            </div>

            <div className={styles.mainGrid}>
                {/* LEFT SIDE: Original Layout */}
                <div className={styles.leftColumn}>
                    {/* YouTube Section */}
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>
                            <Youtube size={24} color="#FF0000" />
                            Healing Soundscapes
                        </div>
                        <div className={styles.videoList}>
                            {playlists.map((video) => (
                                <div key={video.id} className={styles.videoItem}>
                                    <iframe
                                        className={styles.iframe}
                                        src={`https://www.youtube.com/embed/${video.id}`}
                                        title={video.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Local Upload Section */}
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>
                            <Upload size={24} color="var(--color-accent)" />
                            Your Personal Haven
                        </div>

                        <div
                            className={styles.uploadArea}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                accept="audio/*"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className={styles.uploadInput}
                            />
                            <div className={styles.uploadLabel}>
                                <Disc size={32} />
                                <span>Upload your favorite track</span>
                            </div>
                        </div>

                        {localMusic && (
                            <div className={styles.nowPlaying}>
                                <Disc size={32} color="var(--color-accent)" className={styles.vinyl} />
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <div style={{ fontWeight: 600 }}>{fileName}</div>
                                    <audio controls src={localMusic} className={styles.audioPlayer} autoPlay />
                                </div>
                            </div>
                        )}

                        {/* SPOTIFY BOX: Underneath Upload */}
                        <div className={styles.spotifyBox}>
                            <div className={styles.sectionTitle}>
                                <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png" alt="Spotify" style={{ height: 20 }} />
                                <span>Spotify Library</span>
                            </div>

                            {isPremium ? (
                                <div className={styles.spotifyPlayer}>
                                    <iframe
                                        style={{ borderRadius: '12px' }}
                                        src="https://open.spotify.com/embed/playlist/37i9dQZF1DWZqd5YICuS9s"
                                        width="100%"
                                        height="152"
                                        frameBorder="0"
                                        allowFullScreen=""
                                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                        loading="lazy"
                                    ></iframe>
                                </div>
                            ) : (
                                <div className={styles.spotifyLockedWrapper}>
                                    <div className={styles.spotifyLockedContent}>
                                        {/* Small Lock Icon */}
                                        <div className={styles.lockBadge}>
                                            <Zap size={14} fill="currentColor" />
                                            <span>LOCKED</span>
                                        </div>
                                        <p>Sync your soul's playlist with Spotify Integration</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className={styles.unlockBtn}
                                        onClick={() => setShowPremiumModal(true)}
                                    >
                                        Unlock for ₹9
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <PremiumModal
                isOpen={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
                onUpgrade={handleUpgrade}
            />
        </div>
    );
};

export default MusicStation;
