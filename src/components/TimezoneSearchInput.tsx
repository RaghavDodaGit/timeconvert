import React, { useState, useEffect, useRef } from 'react';
import { timezoneMapping, searchTimezones } from '../data/timezoneData';
import { formatInTimeZone } from 'date-fns-tz';

interface TimezoneSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface Suggestion {
  value: string;
  label: string;
  sublabel?: string;
  currentTime: string;
  offset: string;
}

const TimezoneSearchInput: React.FC<TimezoneSearchInputProps> = ({ value, onChange, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value && timezoneMapping[value]) {
      const info = timezoneMapping[value];
      setSearchTerm(`${info.city} (${info.abbreviation})`);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setSearchTerm(input);
    
    const searchResults = searchTimezones(input);
    const now = new Date();
    
    const suggestions = searchResults.map(info => ({
      value: info.value,
      label: `${info.city} (${info.abbreviation})`,
      sublabel: info.country,
      currentTime: formatInTimeZone(now, info.value, 'HH:mm'),
      offset: info.offset
    }));
    
    setSuggestions(suggestions);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSearchTerm(suggestion.label);
    onChange(suggestion.value);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 max-h-[300px] overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.value}-${index}`}
              className="px-4 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{suggestion.label}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {suggestion.sublabel}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {suggestion.offset}
                  </div>
                </div>
                <div className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                  {suggestion.currentTime}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimezoneSearchInput;