// Achievement definitions and unlock logic

export const ACHIEVEMENTS = [
    {
        id: 'first_checkin',
        title: 'First Step',
        description: 'Logged your first mood check-in',
        icon: '🌱',
        check: (stats) => stats.totalMoodLogs >= 1,
    },
    {
        id: 'streak_3',
        title: 'Building Momentum',
        description: 'Maintained a 3-day streak',
        icon: '🔥',
        check: (stats) => stats.currentStreak >= 3,
    },
    {
        id: 'streak_7',
        title: 'One Week Strong',
        description: 'Maintained a 7-day streak',
        icon: '💪',
        check: (stats) => stats.currentStreak >= 7,
    },
    {
        id: 'streak_30',
        title: 'Monthly Warrior',
        description: 'Maintained a 30-day streak',
        icon: '🏆',
        check: (stats) => stats.currentStreak >= 30,
    },
    {
        id: 'journal_5',
        title: 'Reflective Mind',
        description: 'Written 5 journal entries',
        icon: '✍️',
        check: (stats) => stats.journalEntries >= 5,
    },
    {
        id: 'journal_20',
        title: 'Journaling Warrior',
        description: 'Written 20 journal entries',
        icon: '📖',
        check: (stats) => stats.journalEntries >= 20,
    },
    {
        id: 'sessions_all',
        title: 'Zen Master',
        description: 'Completed all session types',
        icon: '🧘',
        check: (stats) => stats.completedSessionTypes >= 3,
    },
    {
        id: 'night_owl',
        title: 'Night Owl',
        description: 'Logged mood after 10 PM',
        icon: '🦉',
        check: (stats) => stats.hasNightLog,
    },
    {
        id: 'early_bird',
        title: 'Early Bird',
        description: 'Logged mood before 7 AM',
        icon: '🌅',
        check: (stats) => stats.hasEarlyLog,
    },
    {
        id: 'calm_streak',
        title: 'Inner Peace',
        description: 'Felt calm 5 days in a row',
        icon: '☮️',
        check: (stats) => stats.calmStreak >= 5,
    },
    {
        id: 'music_lover',
        title: 'Soul Healer',
        description: 'Used the Music Station',
        icon: '🎵',
        check: (stats) => stats.usedMusic,
    },
    {
        id: 'data_explorer',
        title: 'Data Explorer',
        description: 'Visited Global Statistics',
        icon: '📊',
        check: (stats) => stats.visitedStats,
    },
];

export const getUnlockedAchievements = (stats) => {
    return ACHIEVEMENTS.filter(a => a.check(stats));
};

export const getLockedAchievements = (stats) => {
    return ACHIEVEMENTS.filter(a => !a.check(stats));
};

export const getAchievementProgress = (stats) => {
    const unlocked = getUnlockedAchievements(stats);
    return {
        unlocked: unlocked.length,
        total: ACHIEVEMENTS.length,
        percentage: Math.round((unlocked.length / ACHIEVEMENTS.length) * 100),
    };
};
