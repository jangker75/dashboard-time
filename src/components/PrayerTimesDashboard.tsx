import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const PrayerTimesDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);

  const prayerTimes = [
    { name: 'Imsak', time: '04:31' },
    { name: 'Subuh', time: '04:41' },
    { name: 'Dzuhur', time: '12:02' },
    { name: 'Ashar', time: '15:14' },
    { name: 'Maghrib', time: '18:03' },
    { name: 'Isya', time: '19:12' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentPrayerTime = () => {
    const currentHourMinute = currentTime.getHours() * 60 + currentTime.getMinutes();
    const prayerTimesInMinutes = prayerTimes.map(pt => {
      const [hours, minutes] = pt.time.split(':').map(Number);
      return hours * 60 + minutes;
    });

    const currentPrayerIndex = (() => {
      for (let i = prayerTimesInMinutes.length - 1; i >= 0; i--) {
        if (prayerTimesInMinutes[i] <= currentHourMinute) {
          return i;
        }
      }
      return -1;
    })();
    return currentPrayerIndex !== -1 ? prayerTimes[currentPrayerIndex] : null;
  };

  const currentPrayer = getCurrentPrayerTime();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-100 to-blue-300 text-gray-800'
    }`}>
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-200/50 dark:bg-gray-700/50"
      >
        {isDarkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-700" />}
      </button>
      
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Jadwal Solat Wilayah DKI JAKARTA</h1>
        <div className="text-6xl font-bold tracking-wider mb-4">
          {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        <div className="text-lg mb-6">
          {currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {prayerTimes.map((prayer) => (
            <div 
              key={prayer.name} 
              className={`p-4 rounded-lg transition-all duration-300 ${
                currentPrayer?.name === prayer.name 
                  ? 'bg-blue-500 text-white scale-105' 
                  : isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-white/50 hover:bg-blue-100'
              }`}
            >
              <div className="font-semibold">{prayer.name}</div>
              <div className="text-xl">{prayer.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrayerTimesDashboard;