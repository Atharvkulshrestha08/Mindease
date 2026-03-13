// Generates personalized daily wellness plans based on mood history

const plans = {
    stressed: {
        morning: { activity: 'Deep Breathing', duration: '5 min', path: '/app/sessions?type=breathing', icon: '🌬️' },
        afternoon: { activity: 'Journal Your Thoughts', duration: '10 min', path: '/app/journal', icon: '📝' },
        evening: { activity: 'Relaxing Soundscape', duration: '15 min', path: '/app/music', icon: '🎵' },
    },
    overwhelmed: {
        morning: { activity: 'Gentle Stretch', duration: '5 min', path: '/app/sessions?type=stretch', icon: '🧘' },
        afternoon: { activity: 'Distraction Break', duration: '10 min', path: '/app/distractions', icon: '🎮' },
        evening: { activity: 'Gratitude Journaling', duration: '10 min', path: '/app/journal', icon: '🙏' },
    },
    neutral: {
        morning: { activity: 'Mood Check-in', duration: '2 min', path: '/app/mood', icon: '😊' },
        afternoon: { activity: 'Focus Session', duration: '25 min', path: '/app/sessions?type=focus', icon: '🎯' },
        evening: { activity: 'Review Flashcards', duration: '10 min', path: '/app/flashcards', icon: '📚' },
    },
    focused: {
        morning: { activity: 'Quick Stretch', duration: '3 min', path: '/app/sessions?type=stretch', icon: '💪' },
        afternoon: { activity: 'Deep Focus Timer', duration: '25 min', path: '/app/sessions?type=focus', icon: '⚡' },
        evening: { activity: 'Celebrate with Music', duration: '10 min', path: '/app/music', icon: '🎶' },
    },
    calm: {
        morning: { activity: 'Gratitude Reflection', duration: '5 min', path: '/app/journal', icon: '🌸' },
        afternoon: { activity: 'Explore Global Data', duration: '10 min', path: '/app/statistics', icon: '🌍' },
        evening: { activity: 'Soothing Melodies', duration: '15 min', path: '/app/music', icon: '🌙' },
    },
};

export const getDailyPlan = (recentMood) => {
    const mood = recentMood || 'neutral';
    return plans[mood] || plans.neutral;
};

export const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
};

export const getCurrentActivity = (recentMood) => {
    const plan = getDailyPlan(recentMood);
    const timeOfDay = getTimeOfDay();
    return plan[timeOfDay];
};
