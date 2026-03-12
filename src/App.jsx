import React, { useState } from 'react';
import { tasks } from './data/tasks';
import './index.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome'); // welcome, tasks, completion
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [count, setCount] = useState(0);

  const startApp = () => {
    setCurrentScreen('tasks');
    setCurrentTaskIndex(0);
    setCount(tasks[0].targetCounter);
  };

  const handleCounterClick = () => {
    if (count > 0) {
      setCount(prev => prev - 1);
    }
  };

  const currentTask = tasks[currentTaskIndex];
  const isCompleted = count === 0;

  const nextTask = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(prev => prev + 1);
      setCount(tasks[currentTaskIndex + 1].targetCounter);
    } else {
      setCurrentScreen('completion');
    }
  };

  const resetApp = () => {
    setCurrentScreen('welcome');
    setCurrentTaskIndex(0);
    setCount(0);
  };

  return (
    <div className="app-container fade-in">
      {currentScreen === 'welcome' && (
        <div className="welcome-container fade-in" style={{ position: 'relative', height: '100%', paddingBottom: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <img 
              src="/logo.png" 
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
                {isCompleted ? '✓' : count}
              </div>

              <button 
                className={`action-btn btn-primary`}
                onClick={nextTask}
                disabled={!isCompleted}
              >
                {currentTask.buttonText}
              </button>
            </div>
          </div>
        </div>
      )}

      {currentScreen === 'completion' && (
        <div className="completion-container fade-in">
          <div className="check-icon">✓</div>
          <h2 className="completion-title">تقبل الله طاعتكم</h2>
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
