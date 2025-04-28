import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { timezones } from './timezones';
import { unCountries } from './countries';

export interface TimezoneInfo {
  value: string;
  city: string;
  country: string;
  abbreviation: string;
  offset: string;
  fullName: string;
  alternateNames: string[];
}

// Common timezone abbreviations and their mappings
const timezoneAbbreviations: Record<string, string[]> = {
  'IST': ['Asia/Kolkata'],
  'EST': ['America/New_York'],
  'EDT': ['America/New_York'],
  'CST': ['America/Chicago'],
  'CDT': ['America/Chicago'],
  'PST': ['America/Los_Angeles'],
  'PDT': ['America/Los_Angeles'],
  'GMT': ['Europe/London'],
  'UTC': ['Europe/London'],
  'BST': ['Europe/London'],
  'CET': ['Europe/Paris'],
  'CEST': ['Europe/Paris'],
  'JST': ['Asia/Tokyo'],
  'AEST': ['Australia/Sydney'],
  'AEDT': ['Australia/Sydney'],
  'ACST': ['Australia/Adelaide'],
  'ACDT': ['Australia/Adelaide'],
  'AWST': ['Australia/Perth'],
  'MST': ['America/Denver'],
  'MDT': ['America/Denver'],
  'NZST': ['Pacific/Auckland'],
  'NZDT': ['Pacific/Auckland'],
  'HKT': ['Asia/Hong_Kong'],
  'SGT': ['Asia/Singapore'],
  'PKT': ['Asia/Karachi'],
  'BDT': ['Asia/Dhaka'],
  'ICT': ['Asia/Bangkok'],
  'WIB': ['Asia/Jakarta'],
  'KST': ['Asia/Seoul']
};

// Additional major cities for countries
const additionalCities: Record<string, Record<string, string[]>> = {
  'India': {
    'Asia/Kolkata': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Surat']
  },
  'United States': {
    'America/New_York': ['Boston', 'Philadelphia', 'Miami', 'Atlanta', 'Washington DC', 'Baltimore', 'Pittsburgh', 'Buffalo', 'Richmond'],
    'America/Chicago': ['Houston', 'Dallas', 'New Orleans', 'Minneapolis', 'Milwaukee', 'St Louis', 'Kansas City', 'Nashville', 'Memphis'],
    'America/Denver': ['Phoenix', 'Salt Lake City', 'Las Vegas', 'Albuquerque', 'Colorado Springs', 'Boise'],
    'America/Los_Angeles': ['San Francisco', 'Seattle', 'Portland', 'San Diego', 'Sacramento', 'Las Vegas', 'San Jose', 'Oakland']
  },
  'United Kingdom': {
    'Europe/London': ['Manchester', 'Birmingham', 'Liverpool', 'Edinburgh', 'Glasgow', 'Leeds', 'Sheffield', 'Bristol', 'Cardiff', 'Belfast', 'Newcastle', 'Nottingham']
  },
  'Australia': {
    'Australia/Sydney': ['Newcastle', 'Wollongong', 'Central Coast', 'Canberra'],
    'Australia/Melbourne': ['Geelong', 'Ballarat', 'Bendigo', 'Shepparton'],
    'Australia/Brisbane': ['Gold Coast', 'Sunshine Coast', 'Townsville', 'Cairns', 'Toowoomba'],
    'Australia/Perth': ['Fremantle', 'Mandurah', 'Rockingham', 'Bunbury']
  },
  'Canada': {
    'America/Toronto': ['Ottawa', 'Hamilton', 'London', 'Kingston', 'Windsor', 'Mississauga', 'Brampton'],
    'America/Vancouver': ['Victoria', 'Surrey', 'Burnaby', 'Richmond', 'Abbotsford'],
    'America/Edmonton': ['Calgary', 'Red Deer', 'Lethbridge', 'Fort McMurray', 'Medicine Hat'],
    'America/Montreal': ['Quebec City', 'Laval', 'Gatineau', 'Sherbrooke', 'Trois-Rivieres']
  },
  'China': {
    'Asia/Shanghai': ['Beijing', 'Guangzhou', 'Shenzhen', 'Tianjin', 'Chengdu', 'Nanjing', 'Wuhan', 'Xian', 'Hangzhou']
  },
  'Japan': {
    'Asia/Tokyo': ['Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kyoto', 'Kawasaki']
  },
  'Germany': {
    'Europe/Berlin': ['Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Dusseldorf', 'Dresden', 'Leipzig']
  },
  'France': {
    'Europe/Paris': ['Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Bordeaux', 'Lille']
  }
};

// Helper function to get timezone abbreviation and offset
const getTimezoneInfo = (timezone: string): { abbreviation: string; offset: string } => {
  try {
    const date = new Date();
    const abbreviation = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short'
    }).formatToParts(date).find(part => part.type === 'timeZoneName')?.value || '';

    const offset = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'longOffset'
    }).formatToParts(date).find(part => part.type === 'timeZoneName')?.value || '';

    return { abbreviation, offset };
  } catch (e) {
    return { abbreviation: '', offset: '' };
  }
};

// Find country for a timezone
const findCountryForTimezone = (timezone: string): string => {
  for (const [country, zones] of Object.entries(unCountries)) {
    if (zones.includes(timezone)) {
      return country;
    }
  }
  return timezone.split('/')[0];
};

// Helper function to get the main city from a timezone
const getCityFromTimezone = (timezone: string): string => {
  const parts = timezone.split('/');
  return parts[parts.length - 1].replace(/_/g, ' ');
};

// Generate timezone mapping for all IANA timezones
export const timezoneMapping: Record<string, TimezoneInfo> = timezones.reduce((acc, timezone) => {
  const { abbreviation, offset } = getTimezoneInfo(timezone);
  const country = findCountryForTimezone(timezone);
  const city = getCityFromTimezone(timezone);
  
  // Get additional cities for this timezone
  const additionalNames: string[] = [];
  if (additionalCities[country]?.[timezone]) {
    additionalNames.push(...additionalCities[country][timezone]);
  }

  acc[timezone] = {
    value: timezone,
    city,
    country,
    abbreviation,
    offset,
    fullName: `${city} Time`,
    alternateNames: [...additionalNames]
  };

  return acc;
}, {} as Record<string, TimezoneInfo>);

// Helper function to get timezone by abbreviation
export const getTimezonesByAbbreviation = (abbr: string): string[] => {
  return timezoneAbbreviations[abbr.toUpperCase()] || [];
};

export const getTimezoneLabel = (timezone: string): string => {
  const info = timezoneMapping[timezone];
  if (!info) return timezone;

  const currentTime = formatInTimeZone(new Date(), timezone, 'h:mm a');
  return `${info.city}, ${info.country} (${info.abbreviation} ${info.offset}) ${currentTime}`;
};

export const searchTimezones = (inputValue: string): TimezoneInfo[] => {
  const searchTerm = inputValue.toLowerCase().trim();
  if (!searchTerm) return [];

  const results = new Set<TimezoneInfo>();
  
  // Search by timezone abbreviation first
  const abbr = searchTerm.toUpperCase();
  if (timezoneAbbreviations[abbr]) {
    timezoneAbbreviations[abbr].forEach(tz => {
      if (timezoneMapping[tz]) {
        results.add(timezoneMapping[tz]);
      }
    });
  }

  // Search through all timezone information
  Object.values(timezoneMapping).forEach(tz => {
    // Check main city name
    if (tz.city.toLowerCase().includes(searchTerm)) {
      results.add(tz);
    }
    
    // Check alternate city names
    if (tz.alternateNames.some(name => name.toLowerCase().includes(searchTerm))) {
      results.add(tz);
    }
    
    // Check country name
    if (tz.country.toLowerCase().includes(searchTerm)) {
      results.add(tz);
    }
    
    // Check abbreviation
    if (tz.abbreviation.toLowerCase().includes(searchTerm)) {
      results.add(tz);
    }
    
    // Check offset
    if (tz.offset.toLowerCase().includes(searchTerm)) {
      results.add(tz);
    }
  });

  return Array.from(results)
    .sort((a, b) => {
      // Prioritize exact matches
      const aExact = a.city.toLowerCase() === searchTerm || 
                    a.abbreviation.toLowerCase() === searchTerm;
      const bExact = b.city.toLowerCase() === searchTerm || 
                    b.abbreviation.toLowerCase() === searchTerm;
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      return a.city.localeCompare(b.city);
    })
    .slice(0, 10);
};