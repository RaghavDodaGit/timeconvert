import React from 'react';

interface AdBannerProps {
  position: 'top' | 'bottom' | 'middle' | 'sidebar';
}

const AdBanner: React.FC<AdBannerProps> = ({ position }) => {
  const getAdStyles = () => {
    switch (position) {
      case 'top':
        return 'h-16 sm:h-24 mb-6';
      case 'middle':
        return 'h-16 sm:h-24 my-8';
      case 'bottom':
        return 'h-16 sm:h-24 mt-8';
      case 'sidebar':
        return 'h-60 sm:h-80';
      default:
        return 'h-16 sm:h-24';
    }
  };

  return (
    <div 
      className={`bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center ad-container ${getAdStyles()}`}
      aria-label="Advertisement"
    >
      <p className="text-slate-500 dark:text-slate-400 text-sm">
        Advertisement Space
      </p>
    </div>
  );
};

export default AdBanner