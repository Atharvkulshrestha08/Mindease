// Data export utilities for user data backup

export const exportToJSON = () => {
    const data = {
        exportDate: new Date().toISOString(),
        moodLogs: JSON.parse(localStorage.getItem('moodLogs') || '[]'),
        journalEntries: JSON.parse(localStorage.getItem('journalEntries') || '[]'),
        user: JSON.parse(localStorage.getItem('mindease_user') || 'null'),
        unlockedAchievements: JSON.parse(localStorage.getItem('unlockedAchievements') || '[]'),
        sleepLogs: JSON.parse(localStorage.getItem('sleepLogs') || '[]'),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindease_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

export const exportToCSV = () => {
    const moodLogs = JSON.parse(localStorage.getItem('moodLogs') || '[]');
    const journalEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');

    let csv = 'Type,Date,Content,Extra\n';

    moodLogs.forEach(log => {
        csv += `Mood,"${log.date}","${log.mood}",""\n`;
    });

    journalEntries.forEach(entry => {
        const content = entry.content.replace(/"/g, '""');
        const prompt = (entry.prompt || '').replace(/"/g, '""');
        csv += `Journal,"${entry.date}","${content}","${prompt}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindease_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
};

export const importFromJSON = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.moodLogs) localStorage.setItem('moodLogs', JSON.stringify(data.moodLogs));
                if (data.journalEntries) localStorage.setItem('journalEntries', JSON.stringify(data.journalEntries));
                if (data.user) localStorage.setItem('mindease_user', JSON.stringify(data.user));
                if (data.sleepLogs) localStorage.setItem('sleepLogs', JSON.stringify(data.sleepLogs));
                resolve(data);
            } catch (err) {
                reject(err);
            }
        };
        reader.readAsText(file);
    });
};
