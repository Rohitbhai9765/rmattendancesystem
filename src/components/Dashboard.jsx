import { useState } from 'react';
import AttendanceTable from './AttendanceTable';
import StatisticsPanel from './StatisticsPanel';
import ViewerPanel from './ViewerPanel';
import LoginModal from './LoginModal';
import logo from '../assets/logo.png';
import { subjects } from '../data/subjects';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('viewer'); // 'viewer', 'stats', 'mark'
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [activeSubjectId, setActiveSubjectId] = useState(subjects[0].id);

  const activeSubject = subjects.find(s => s.id === activeSubjectId) || subjects[0];

  const handleLogin = (token) => {
    setIsAdmin(true);
    setShowLogin(false);
    setActiveTab('mark');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setActiveTab('viewer');
  };

  if (showLogin) {
    return (
      <div className="app-container">
        <header className="header" style={{ position: 'relative' }}>
          <img src={logo} alt="COEP Civil 27" className="portal-logo" />
          <h1>Attendance System</h1>
          <p>{activeSubject.title}</p>
        </header>
        <LoginModal onLogin={handleLogin} />
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button className="btn btn-outline" onClick={() => setShowLogin(false)}>Back to Viewer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header" style={{ position: 'relative' }}>
        <img src={logo} alt="COEP Civil 27" className="portal-logo" />
        <div className="admin-btn-container">
          {isAdmin ? (
            <button className="btn btn-outline" onClick={handleLogout}>Log Out</button>
          ) : (
            <button className="btn btn-outline" onClick={() => setShowLogin(true)}>Admin Login</button>
          )}
        </div>
        <h1>Attendance System</h1>
        
        <div style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
          <select 
            value={activeSubjectId} 
            onChange={(e) => setActiveSubjectId(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem', maxWidth: '100%' }}
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>
        
        <p style={{ marginTop: '0.25rem', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '500' }}>
          Professor: {activeSubject.professor}
        </p>
      </header>
      
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'viewer' ? 'active' : ''}`}
          onClick={() => setActiveTab('viewer')}
        >
          Daily Records
        </button>
        <button 
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
        {isAdmin && (
          <button 
            className={`tab-btn ${activeTab === 'mark' ? 'active' : ''}`}
            onClick={() => setActiveTab('mark')}
          >
            Mark Attendance (Admin)
          </button>
        )}
      </div>

      <main>
        {activeTab === 'viewer' && <ViewerPanel activeSubject={activeSubject} />}
        {activeTab === 'stats' && <StatisticsPanel activeSubject={activeSubject} />}
        {activeTab === 'mark' && isAdmin && <AttendanceTable activeSubject={activeSubject} />}
      </main>
    </div>
  );
}
