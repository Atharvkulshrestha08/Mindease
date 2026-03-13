import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Mood from './pages/Mood';
import Sessions from './pages/Sessions';
import Journal from './pages/Journal';
import Resources from './pages/Resources';
import LandingPage from './pages/LandingPage';
import Flashcards from './pages/Flashcards';
import GlobalStatistics from './pages/GlobalStatistics';
import MusicStation from './pages/MusicStation';
import DistractionZone from './pages/DistractionZone';
import Chatbot from './pages/Chatbot';
import SleepTracker from './pages/SleepTracker';
import Analytics from './pages/Analytics';
import VentSpace from './pages/VentSpace';
import GuardianDashboard from './pages/GuardianDashboard';
import Pricing from './pages/Pricing';
import ScrollToTop from './components/ScrollToTop';
import ConsentModal from './components/ConsentModal';
import OnboardingModal from './components/OnboardingModal';
import SOSButton from './components/SOSButton';
import { useUser } from './context/UserContext';
import { useTheme } from './context/ThemeContext';

function App() {
  const [showConsent, setShowConsent] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { isOnboarded } = useUser();
  const { setMoodTheme } = useTheme();

  useEffect(() => {
    const consent = localStorage.getItem('dataConsent');
    if (consent === null) {
      setShowConsent(true);
    }
  }, []);

  // Show onboarding after consent is handled, if user hasn't onboarded
  useEffect(() => {
    if (!showConsent && !isOnboarded) {
      setShowOnboarding(true);
    }
  }, [showConsent, isOnboarded]);

  // Sync mood theme with latest mood log
  useEffect(() => {
    const moodLogs = JSON.parse(localStorage.getItem('moodLogs') || '[]');
    if (moodLogs.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const todayLog = moodLogs.find(l => l.date === today);
      if (todayLog) {
        setMoodTheme(todayLog.mood);
      }
    }
  }, [setMoodTheme]);

  const handleConsent = (choice) => {
    localStorage.setItem('dataConsent', choice);
    setShowConsent(false);
  };

  return (
    <Router>
      <ScrollToTop />
      <ConsentModal
        isOpen={showConsent}
        onAccept={() => handleConsent('accepted')}
        onDecline={() => handleConsent('declined')}
      />
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<Pricing />} />

        <Route path="/app" element={<MainLayout />}>
          <Route path="vent" element={<VentSpace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="mood" element={<Mood />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="journal" element={<Journal />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="statistics" element={<GlobalStatistics />} />
          <Route path="music" element={<MusicStation />} />
          <Route path="distractions" element={<DistractionZone />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="sleep" element={<SleepTracker />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="guardian" element={<GuardianDashboard />} />
          <Route path="resources" element={<Resources />} />
        </Route>
      </Routes>
      {/* SOS button visible on all /app routes */}
      <SOSButton />
    </Router>
  );
}

export default App;
