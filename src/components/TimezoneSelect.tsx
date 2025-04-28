import React from 'react';
import Select from 'react-select';
import { formatInTimeZone } from 'date-fns-tz';
import { timezoneMapping, searchTimezones, TimezoneInfo } from '../data/timezoneData';

interface TimezoneSelectProps {
  value: string;
  onChange: (e: { value: string }) => void;
}

const TimezoneSelect: React.FC<TimezoneSelectProps> = ({ value, onChange }) => {
  const formatOptionLabel = (option: { value: string, label: string }) => {
    const info = timezoneMapping[option.value];
    if (!info) return option.label;

    const currentTime = formatInTimeZone(new Date(), option.value, 'h:mm a');
    return (
      <div className="flex justify-between items-center">
        <div>
          <span className="font-medium">{info.city}</span>
          <span className="text-slate-600 dark:text-slate-300">, {info.country}</span>
          <span className="text-slate-500 dark:text-slate-400"> ({info.abbreviation} {info.offset})</span>
        </div>
        <div className="text-primary-600 dark:text-primary-400 font-medium">
          {currentTime}
        </div>
      </div>
    );
  };

  const customStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: 'transparent',
      borderColor: 'rgb(203 213 225)',
      '&:hover': {
        borderColor: 'rgb(148 163 184)'
      }
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: 'rgb(255 255 255 / 0.9)',
      backdropFilter: 'blur(8px)',
      '.dark &': {
        backgroundColor: 'rgb(30 41 59 / 0.9)'
      }
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused 
        ? 'rgb(241 245 249 / 0.9)'
        : 'transparent',
      '.dark &': {
        backgroundColor: state.isFocused 
          ? 'rgb(51 65 85 / 0.9)'
          : 'transparent',
        color: 'rgb(226 232 240)',
        '&:hover': {
          backgroundColor: 'rgb(51 65 85 / 0.9)'
        }
      },
      '&:hover': {
        backgroundColor: 'rgb(241 245 249 / 0.9)'
      }
    }),
    input: (base: any) => ({
      ...base,
      color: 'rgb(15 23 42)',
      '.dark &': {
        color: 'rgb(226 232 240)'
      }
    }),
    singleValue: (base: any) => ({
      ...base,
      color: 'rgb(15 23 42)',
      '.dark &': {
        color: 'rgb(226 232 240)'
      }
    })
  };

  const options = Object.entries(timezoneMapping).map(([value, info]) => ({
    value,
    label: `${info.city}, ${info.country} (${info.abbreviation} ${info.offset})`
  }));

  return (
    <Select
      value={options.find(option => option.value === value)}
      onChange={onChange}
      options={options}
      styles={customStyles}
      className="react-select-container"
      classNamePrefix="react-select"
      isSearchable={true}
      formatOptionLabel={formatOptionLabel}
      filterOption={(option, input) => {
        if (!input) return true;
        const info = timezoneMapping[option.value];
        const searchTerm = input.toLowerCase().trim();
        
        // Check if the search term matches any part of the timezone info
        return (
          info.city.toLowerCase().includes(searchTerm) ||
          info.country.toLowerCase().includes(searchTerm) ||
          info.abbreviation.toLowerCase().includes(searchTerm) ||
          info.offset.toLowerCase().includes(searchTerm) ||
          info.value.toLowerCase().includes(searchTerm) ||
          option.label.toLowerCase().includes(searchTerm)
        );
      }}
    />
  );
};

export default TimezoneSelect;