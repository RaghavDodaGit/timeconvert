import React from 'react';
import { Clock } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="text-primary-600 dark:text-primary-400" size={24} />
            <span className="text-lg sm:text-xl font-bold text-primary-700 dark:text-primary-400">
              TimeConvert
            </span>
          </div>
          <nav>
            <ul className="flex space-x-4 text-sm sm:text-base">
              <li>
                <a 
                  href="#how-it-works" 
                  className="text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 transition"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  className="text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 transition"
                >
                  About
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;