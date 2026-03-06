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
import ScrollToTop from './components/ScrollToTop';
import ConsentModal from './components/ConsentModal';

function App() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('dataConsent');
    if (consent === null) {
      setShowConsent(true);
    }
  }, []);

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
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/app" element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="mood" element={<Mood />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="journal" element={<Journal />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="statistics" element={<GlobalStatistics />} />
          <Route path="music" element={<MusicStation />} />
          <Route path="distractions" element={<DistractionZone />} />

          <Route path="resources" element={<Resources />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
