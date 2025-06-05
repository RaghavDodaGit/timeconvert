import React, { useState, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { formatInTimeZone, zonedTimeToUtc, getTimezoneOffset } from 'date-fns-tz';
import { Clock, ArrowRight, Copy, RefreshCw, Save } from 'lucide-react';
import TimezoneSearchInput from './TimezoneSearchInput';
import { timezones } from '../data/timezones';

const TimeConverter: React.FC = () => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const [fromTimezone, setFromTimezone] = useState('America/New_York');
  const [toTimezone, setToTimezone] = useState('Europe/London');
  const [inputTime, setInputTime] = useState('');
  const [inputDate, setInputDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [convertedTime, setConvertedTime] = useState('');
  const [convertedDate, setConvertedDate] = useState('');
  const [currentSourceTime, setCurrentSourceTime] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [isUsingCurrentTime, setIsUsingCurrentTime] = useState(true);

  // Update only the current time display
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const sourceTime = formatInTimeZone(now, fromTimezone, 'HH:mm');
      setCurrentSourceTime(sourceTime);
      
      // Only update input time and date if using current time
      if (isUsingCurrentTime) {
        setInputTime(sourceTime);
        setInputDate(formatInTimeZone(now, fromTimezone, 'yyyy-MM-dd'));
      }
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(interval);
  }, [fromTimezone, isUsingCurrentTime]);

  // Initial setup
  useEffect(() => {
    const now = new Date();
    const sourceTime = formatInTimeZone(now, fromTimezone, 'HH:mm');
    setInputTime(sourceTime);
    setInputDate(formatInTimeZone(now, fromTimezone, 'yyyy-MM-dd'));
  }, []);

  useEffect(() => {
    if (!inputTime || !inputDate) return;
    
    try {
      const [hours, minutes] = inputTime.split(':').map(Number);
      const [year, month, day] = inputDate.split('-').map(Number);
      
      // Create a date object with the input date and time
      const date = new Date(year, month - 1, day, hours, minutes);
      
      // Convert the date to UTC in the source timezone
      const utcDate = zonedTimeToUtc(date, fromTimezone);
      
      // Format in target timezone
      const convertedDateTime = formatInTimeZone(utcDate, toTimezone, "yyyy-MM-dd'T'HH:mm");
      const [convertedDateStr, convertedTimeStr] = convertedDateTime.split('T');
      
      setConvertedTime(convertedTimeStr);
      setConvertedDate(convertedDateStr);
    } catch (error) {
      console.error('Error converting time:', error);
      setConvertedTime('--:--');
      setConvertedDate('----/--/--');
    }
  }, [fromTimezone, toTimezone, inputTime, inputDate]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('timeconvert-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const handleFromTimezoneChange = (value: string) => {
    setFromTimezone(value);
    if (isUsingCurrentTime) {
      const now = new Date();
      setInputTime(formatInTimeZone(now, value, 'HH:mm'));
      setInputDate(formatInTimeZone(now, value, 'yyyy-MM-dd'));
    }
  };

  const handleToTimezoneChange = (value: string) => {
    setToTimezone(value);
  };

  const handleTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUsingCurrentTime(false);
    setInputTime(e.target.value);
  };

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUsingCurrentTime(false);
    setInputDate(e.target.value);
  };

  const saveFavorite = () => {
    const pair = `${fromTimezone}|${toTimezone}`;
    if (!favorites.includes(pair)) {
      const newFavorites = [...favorites, pair];
      setFavorites(newFavorites);
      localStorage.setItem('timeconvert-favorites', JSON.stringify(newFavorites));
    }
  };

  const loadFavorite = (pair: string) => {
    const [from, to] = pair.split('|');
    setFromTimezone(from);
    setToTimezone(to);
  };

  const removeFavorite = (pair: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = favorites.filter(fav => fav !== pair);
    setFavorites(newFavorites);
    localStorage.setItem('timeconvert-favorites', JSON.stringify(newFavorites));
  };

  const copyToClipboard = () => {
    const textToCopy = `${inputTime} ${inputDate} in ${fromTimezone} is ${convertedTime} ${convertedDate} in ${toTimezone}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const setCurrentTime = () => {
    const now = new Date();
    setInputTime(formatInTimeZone(now, fromTimezone, 'HH:mm'));
    setInputDate(formatInTimeZone(now, fromTimezone, 'yyyy-MM-dd'));
    setIsUsingCurrentTime(true);
  };

  const formatTimezone = (tz: string) => {
    const parts = tz.split('/');
    const location = parts[parts.length - 1].replace(/_/g, ' ');
    return location;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Current time in {formatTimezone(fromTimezone)}: <strong>{currentSourceTime}</strong>
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            From Timezone
          </label>
          <TimezoneSearchInput
            value={fromTimezone}
            onChange={handleFromTimezoneChange}
            placeholder="Search by city, country, or timezone..."
          />
        </div>
        
        <div className="flex justify-center items-center h-full pt-6">
          <ArrowRight className="text-slate-400" />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            To Timezone
          </label>
          <TimezoneSearchInput
            value={toTimezone}
            onChange={handleToTimezoneChange}
            placeholder="Search by city, country, or timezone..."
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Date & Time in {formatTimezone(fromTimezone)}
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={inputDate}
              onChange={handleDateInput}
              className="input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
            />
            <input
              type="time"
              value={inputTime}
              onChange={handleTimeInput}
              className="input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
            />
            <button 
              onClick={setCurrentTime}
              className="btn btn-outline p-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
              title="Set to current time"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Date & Time in {formatTimezone(toTimezone)}
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={convertedDate}
              readOnly
              className="input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
            />
            <input
              type="time"
              value={convertedTime}
              readOnly
              className="input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
            />
            <button 
              onClick={copyToClipboard}
              className={`btn ${copied ? 'btn-primary' : 'btn-outline'} p-2 ${!copied && 'bg-white/50 dark:bg-slate-800/50'} backdrop-blur-sm`}
              title="Copy result"
            >
              <Copy size={18} />
            </button>
          </div>
          {copied && <span className="text-xs text-green-600 dark:text-green-400 animate-fade-in">Copied!</span>}
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button 
          onClick={saveFavorite}
          className="btn btn-outline flex items-center text-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
        >
          <Save size={16} className="mr-1" />
          Save as favorite
        </button>
      </div>
      
      {favorites.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">Your Favorites</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {favorites.map((pair) => {
              const [from, to] = pair.split('|');
              return (
                <div 
                  key={pair}
                  onClick={() => loadFavorite(pair)}
                  className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-3 rounded-lg cursor-pointer hover:bg-white/60 dark:hover:bg-slate-700/60 transition-colors flex justify-between items-center"
                >
                  <span className="text-sm">
                    {formatTimezone(from)} → {formatTimezone(to)}
                  </span>
                  <button 
                    className="text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400"
                    onClick={(e) => removeFavorite(pair, e)}
                    title="Remove favorite"
                  >
                    &times;
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <section id="how-it-works" className="mt-12 p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">How It Works</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          TimeConvert makes it easy to convert times between different timezones:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-slate-600 dark:text-slate-300">
          <li>Select your source timezone in the "From Timezone" dropdown</li>
          <li>Select your target timezone in the "To Timezone" dropdown</li>
          <li>Enter the date and time you want to convert, or use the current time</li>
          <li>The converted date and time appears instantly</li>
          <li>Save your favorite timezone pairs for quick access later</li>
        </ol>
      </section>
    </div>
  );
};

export default TimeConverter;