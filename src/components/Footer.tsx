import React from 'react';
import { Clock, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-6">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Clock className="text-primary-600 dark:text-primary-400 mr-2" size={20} />
            <span className="text-lg font-bold text-primary-700 dark:text-primary-400">
              TimeConvert
            </span>
          </div>
          
          <section id="about" className="text-center md:text-right">
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
              A simple, elegant timezone conversion tool
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              © {currentYear} TimeConvert. All rights reserved.
            </p>
          </section>
        </div>
      </div>
    </footer>
  );
};

export default Footer;