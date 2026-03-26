import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import AuthPortal from './components/AuthPortal';
import SubjectList from './components/SubjectList';
import SubjectForm from './components/SubjectForm';
import OverallStats from './components/OverallStats';
import TimetableEditor from './components/TimetableEditor';
import LeaveAnalysis from './components/LeaveAnalysis';
import ShareSync from './components/ShareSync'; // Collaborative Hub v20.0

const EMPTY_SCHEDULE = {
  Monday: { slot1: [], slot2: [], slot3: [] },
  Tuesday: { slot1: [], slot2: [], slot3: [] },
  Wednesday: { slot1: [], slot2: [], slot3: [] },
  Thursday: { slot1: [], slot2: [], slot3: [] },
  Friday: { slot1: [], slot2: [], slot3: [] },
  Saturday: { slot1: [], slot2: [], slot3: [] }
};

const Navigation = ({ user, handleLogout, theme, toggleTheme }) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-white/50 dark:border-slate-800 h-[56px] flex items-center px-4 md:px-8 transition-colors duration-500">
      <div className="max-w-[1700px] mx-auto w-full flex justify-between items-center">
        <div className="flex items-center gap-4 lg:gap-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-blue-600 flex items-center justify-center text-white font-black italic text-base shadow-lg shadow-slate-900/10 transition-transform hover:scale-105">C</div>
            <div className="hidden sm:flex flex-col leading-none">
              <h1 className="text-lg font-black tracking-tighter uppercase italic dark:text-white">Chutti<span className="text-blue-600">Pro</span></h1>
              <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest mt-0.5">MMIT Academic Controller</span>
            </div>
          </div>
          <nav className="flex items-center gap-1 bg-slate-100/30 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-100/50 dark:border-slate-700">
            <Link to="/" className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${isDashboard ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>Dashboard</Link>
            <Link to="/timetable" className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${!isDashboard ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>Timetable</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4 lg:gap-8">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
          >
            {theme === 'light' ? (
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            ) : (
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
            )}
          </button>

          <div className="hidden lg:flex items-center gap-2">
            <span className="text-[7px] font-black uppercase text-slate-400 tracking-widest">Stud:</span>
            <span className="text-[10px] font-black uppercase tracking-tighter italic border-b border-blue-600/30 dark:text-slate-300">{user.username} <span className="text-blue-500 opacity-50 ml-1">@MMIT</span></span>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-1.5 border border-slate-100 dark:border-slate-800 rounded-lg text-[7px] font-black uppercase tracking-widest text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 transition-all active:scale-95 leading-none"
          >
            Exit
          </button>
        </div>
      </div>
    </header>
  );
};

const AppContent = ({ token, user, handleLogout }) => {
  const [subjects, setSubjects] = useState([]);
  const [timetable, setTimetable] = useState(EMPTY_SCHEDULE);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (token) fetchUserData();
  }, [token]);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const config = { headers: { 'x-auth-token': token } };
      const [subjResp, ttResp] = await Promise.all([
        axios.get('http://localhost:5000/api/subjects', config),
        axios.get('http://localhost:5000/api/timetable', config)
      ]);
      setSubjects(subjResp.data);
      setTimetable(ttResp.data || EMPTY_SCHEDULE);
    } catch (err) {
      console.error('Data Sync Failure', err);
      if (err.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async (newSub) => {
    try {
      const config = { headers: { 'x-auth-token': token } };
      const resp = await axios.post('http://localhost:5000/api/subjects', newSub, config);
      setSubjects(prev => [...prev, resp.data]);
    } catch (err) {
      console.error('Write Conflict', err);
    }
  };

  const handleRemoveSubject = async (id) => {
    try {
      const config = { headers: { 'x-auth-token': token } };
      await axios.delete(`http://localhost:5000/api/subjects/${id}`, config);
      setSubjects(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error('Deletion Fault', err);
    }
  };

  const handleUpdateSubject = async (updated) => {
    try {
      const config = { headers: { 'x-auth-token': token } };
      const resp = await axios.put(`http://localhost:5000/api/subjects/${updated._id}`, updated, config);
      setSubjects(prev => prev.map(s => s._id === updated._id ? resp.data : s));
    } catch (err) {
      console.error('Update Fault', err);
    }
  };

  const handleQuickAction = async (id, type) => {
    const sub = subjects.find(s => s._id === id);
    if (!sub) return;

    const weight = 1;
    let updated = { ...sub };
    if (type === 'present') {
      updated.attended += weight;
      updated.total += weight;
    } else if (type === 'absent') {
      updated.total += weight;
    } else if (type === 'undo-present') {
      updated.attended = Math.max(0, updated.attended - weight);
      updated.total = Math.max(0, updated.total - weight);
    } else if (type === 'undo-absent') {
      updated.total = Math.max(0, updated.total - weight);
    }

    handleUpdateSubject(updated);
  };

  const handleSaveTimetable = async (newTT) => {
    try {
      const config = { headers: { 'x-auth-token': token } };
      await axios.post('http://localhost:5000/api/timetable', { schedule: newTT }, config);
      setTimetable(newTT);
    } catch (err) {
      console.error('Schedule Sync Fault', err);
    }
  };

  const handleImportStrategy = async (cleanSubjects, newTT) => {
    try {
      const config = { headers: { 'x-auth-token': token } };

      // 1. Clear current subjects (Optional, but cleaner for a fresh sync)
      // For now, we just append or let user handle duplicates.
      // But typically, a sync "sets up" the app.

      // 2. Add all subjects in parallel
      const addPromises = cleanSubjects.map(sub =>
        axios.post('http://localhost:5000/api/subjects', sub, config)
      );
      const responses = await Promise.all(addPromises);
      setSubjects(prev => [...prev, ...responses.map(r => r.data)]);

      // 3. Save Timetable
      await handleSaveTimetable(newTT);

      window.location.reload(); // Quick reset to ensure clean matrix view
    } catch (err) {
      console.error('Migration Strategy Failure', err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfdfe] dark:bg-slate-950">
      <div className="w-8 h-8 border-t-2 border-slate-900 dark:border-blue-600 rounded-full animate-spin"></div>
      <p className="text-[7px] font-black uppercase tracking-[1em] text-slate-400 mt-6 italic">MMIT Operational Sync...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950 pb-40 overflow-x-hidden font-sans text-slate-800 dark:text-slate-100 leading-tight transition-colors duration-500">
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.1),transparent)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(30,58,138,0.3),transparent)]"></div>

      <Navigation user={user} handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />

      <main className="max-w-[1700px] mx-auto px-4 md:px-8 mt-6 lg:mt-10 space-y-10 relative z-10">
        <Routes>
          <Route path="/" element={
            <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700">
              <OverallStats subjects={subjects} />

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase italic tracking-widest shrink-0">Daily Bunk Plan (MMIT)</h2>
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-slate-100 dark:from-slate-800 to-transparent"></div>
                </div>
                <LeaveAnalysis subjects={subjects} timetable={timetable} />
              </section>

              <ShareSync
                subjects={subjects}
                timetable={timetable}
                onImport={handleImportStrategy}
              />

              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase italic tracking-widest shrink-0">Student Attendance Tracker</h2>
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-slate-100 dark:from-slate-800 to-transparent"></div>
                </div>
                <SubjectForm onAdd={handleAddSubject} />
                <SubjectList
                  subjects={subjects}
                  onRemove={handleRemoveSubject}
                  onUpdate={handleUpdateSubject}
                  onQuickAction={handleQuickAction}
                />
              </section>
            </div>
          } />

          <Route path="/timetable" element={
            <div className="space-y-10 animate-in fade-in duration-700">
              <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-800 rounded-2xl p-1 shadow-sm">
                <TimetableEditor subjects={subjects} timetable={timetable} onSave={handleSaveTimetable} />
              </section>
            </div>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="mt-48 text-center opacity-30 select-none pb-24 cursor-default transition-opacity hover:opacity-100 duration-1000">
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 blur-xl bg-blue-600/20 rounded-full animate-pulse"></div>
          <div className="relative px-6 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full flex items-center gap-4">
            <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black">M</div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase text-slate-900 dark:text-white leading-none">MMIT MMIT COLLEGE ARCHIVE</p>
              <p className="text-[7px] font-black text-slate-400 uppercase mt-1 leading-none">Marathwada Mitra Mandal's Institute of Technology • Pune</p>
            </div>
          </div>
        </div>
        <p className="text-[7px] font-black uppercase tracking-[1em] text-slate-400 italic mb-2">Chutti Pro v19.0 Night-Ops</p>
        <p className="text-[6px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Designed specifically for MMIT high-performance students</p>
      </footer>
    </div>
  );
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('x-auth-token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const handleAuthSuccess = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('x-auth-token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  if (!token) return <AuthPortal onAuthSuccess={handleAuthSuccess} />;

  return (
    <Router>
      <AppContent token={token} user={user} handleLogout={handleLogout} />
    </Router>
  );
};

export default App;
