import React, { useState, useEffect } from 'react';
import { Clock, Moon, Sun } from 'lucide-react';
import Header from './components/Header';
import TimeConverter from './components/TimeConverter';
import Footer from './components/Footer';
import AdBanner from './components/AdBanner';

function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{
          backgroundImage: isDarkMode 
            ? 'url("https://images.pexels.com/photos/2422/sky-earth-galaxy-universe.jpg?auto=compress&cs=tinysrgb&w=1920")'
            : 'url("https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?auto=compress&cs=tinysrgb&w=1920")'
        }}
      />
      <div className="min-h-screen flex flex-col relative z-10 backdrop-blur-sm bg-gradient-to-br from-white/95 to-white/80 dark:from-slate-900/95 dark:to-slate-900/80">
        <Header />
        
        <main className="flex-grow w-full py-6 sm:py-10 px-4">
          {/* Theme toggle button */}
          <div className="flex justify-end mb-4 max-w-7xl mx-auto w-full">
            <button 
              onClick={toggleDarkMode}
              className="btn btn-outline p-2 backdrop-blur-md bg-white/50 dark:bg-slate-800/50"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Top ad banner */}
          <div className="max-w-7xl mx-auto w-full">
            <AdBanner position="top" />
          </div>
          
          {/* Main content */}
          <div className="card my-6 animate-fade-in bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-800/80 dark:to-slate-800/60 backdrop-blur-md border border-white/20 dark:border-slate-700/20 max-w-7xl mx-auto">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 dark:from-primary-500/5 dark:to-secondary-500/5 pointer-events-none"></div>
              <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-primary-700 dark:text-primary-400">
                <Clock className="inline-block mr-2 mb-1" size={28} />
                TimeConvert
              </h1>
              <p className="text-center text-slate-600 dark:text-slate-300 mb-8">
                Convert times easily between any timezone in the world
              </p>
              
              <TimeConverter />
            </div>
          </div>
          
          {/* Additional ad spaces */}
          <div className="max-w-7xl mx-auto w-full space-y-8">
            <AdBanner position="middle" />
            <AdBanner position="sidebar" />
            <AdBanner position="bottom" />
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}

export default App;