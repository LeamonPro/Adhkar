import React, { useState } from 'react';
import { tasks } from './data/tasks';
import './index.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome'); // welcome, tasks, completion
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [counts, setCounts] = useState(() => {
    // Load counts from localStorage on initial render
    const savedData = localStorage.getItem('adhkar_progress');
    if (savedData) {
      try {
        const { savedCounts, date } = JSON.parse(savedData);
        const today = new Date().toLocaleDateString();
        // Reset if it's a new day
        if (date === today) {
          return savedCounts;
        }
      } catch {
        console.error("Failed to parse saved progress");
      }
    }
    return [];
  });

  // Save to localStorage whenever counts change (only if counts array is not empty)
  React.useEffect(() => {
    if (counts.length > 0) {
      const dataToSave = {
        savedCounts: counts,
        date: new Date().toLocaleDateString()
      };
      localStorage.setItem('adhkar_progress', JSON.stringify(dataToSave));
    }
  }, [counts]);

  const startApp = () => {
    setCurrentScreen('tasks');
    setCurrentTaskIndex(0);
    // Only reset counts if we don't have existing counts for today
    if (counts.length === 0) {
      setCounts(tasks.map(t => t.targetCounter));
    }
  };

  const handleCounterClick = () => {
    if (counts[currentTaskIndex] > 0) {
      const newCounts = [...counts];
      newCounts[currentTaskIndex] -= 1;
      setCounts(newCounts);
    }
  };

  const currentTask = tasks[currentTaskIndex];
  const isCompleted = counts.length > 0 && counts[currentTaskIndex] === 0;

  const nextTask = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(prev => prev + 1);
    } else {
      setCurrentScreen('completion');
    }
  };

  const prevTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(prev => prev - 1);
    }
  };

  const resetApp = () => {
    setCurrentScreen('welcome');
    setCurrentTaskIndex(0);
    setCounts([]);
  };

  const completedTasksCount = counts.filter(c => c === 0).length;

  return (
    <div className="app-container fade-in">
      {currentScreen === 'welcome' && (
        <div className="welcome-container fade-in" style={{ position: 'relative', height: '100%', paddingBottom: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <img 
              src={`${import.meta.env.BASE_URL}logo.png`} 
              alt="شعار زاد العشر" 
              style={{ width: '120px', height: '120px', marginBottom: '1.5rem', borderRadius: '25px', boxShadow: '0 10px 25px rgba(196, 154, 69, 0.2)' }} 
            />
            <h1 className="welcome-title">زاد العشر</h1>
            <p className="welcome-subtitle" style={{ textAlign: 'center' }}>
              مرحباً بك في تطبيق الأذكار والمهام اليومية. 
              <br /><br />
              <strong>نسخة مخصصة للعشر الأواخر من رمضان</strong>
              <br />
              خصّص وقتاً يسيراً لتنال أجراً عظيماً.
            </p>
            <button className="start-btn" onClick={startApp}>
              ابدأ الآن
            </button>
          </div>
          
          <div style={{ position: 'absolute', bottom: '1rem', left: '0', right: '0', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Developed by Leamon
          </div>
        </div>
      )}

      {currentScreen === 'tasks' && (
        <div className="fade-in" key={currentTaskIndex}>
          {/* Progress Bar */}
          <div className="progress-container">
            <span className="progress-text">المهمة {currentTaskIndex + 1} من {tasks.length}</span>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${((currentTaskIndex) / tasks.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="task-card">
            <h2 className="task-title">{currentTask.taskTitle}</h2>
            <div className="task-main-text">{currentTask.mainText}</div>
            
            {currentTask.options && currentTask.options.length > 0 && (
              <div className="task-options">
                {currentTask.options.map((opt, i) => (
                  <div key={i} className="task-option">{opt}</div>
                ))}
              </div>
            )}

            {currentTask.subText && (
              <div className="task-sub-text">{currentTask.subText}</div>
            )}

            <div className="counter-area">
              <div 
                className={`counter-circle ${isCompleted ? 'completed' : ''}`}
                onClick={handleCounterClick}
              >
                {isCompleted ? '✓' : counts[currentTaskIndex]}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '2rem', gap: '1rem' }}>
              <button 
                className="action-btn btn-primary"
                onClick={nextTask}
                style={{ flex: 1 }}
              >
                {currentTaskIndex === tasks.length - 1 ? 'إنهاء الأذكار' : 'التالي'}
              </button>

              <button 
                className="action-btn"
                onClick={prevTask}
                disabled={currentTaskIndex === 0}
                style={{ 
                  backgroundColor: currentTaskIndex === 0 ? '#d1d8d4' : 'var(--text-secondary)', 
                  color: currentTaskIndex === 0 ? '#8a9c90' : 'white',
                  flex: 1
                }}
              >
                السابق
              </button>
            </div>
          </div>
        </div>
      )}

      {currentScreen === 'completion' && (
        <div className="completion-container fade-in">
          <div className="check-icon">✓</div>
          <h2 className="completion-title">تقبل الله طاعتكم</h2>
          
          <div style={{
            background: 'var(--card-bg)',
            padding: '1.5rem',
            borderRadius: '15px',
            marginBottom: '2rem',
            border: '1px solid rgba(196, 154, 69, 0.3)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            width: '100%',
            maxWidth: '300px'
          }}>
            <h3 style={{ color: 'var(--accent)', fontSize: '1.3rem', marginBottom: '0.8rem' }}>النتيجة المنجزة</h3>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>
              أنجزت {completedTasksCount} من أصل {tasks.length} مهام
            </p>
          </div>

          <p className="completion-text">
            لقد أتممت جميع المهام والأذكار لهذا اليوم. 
            <br />
            نسأل الله أن يكتب لك الأجر ويتقبل منك.
            <br /><br />
            <strong>فضلاً وليس أمراً، لا تنسوا الدعاء لأبي بالشفاء.</strong>
          </p>
          <button className="start-btn" onClick={resetApp} style={{marginTop: '1rem'}}>
            العودة للبداية
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
