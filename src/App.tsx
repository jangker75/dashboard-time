import React, { useState } from 'react'
import './App.css'
import { Moon, Sun } from 'lucide-react';
interface Jadwal {
  imsak: string,
  subuh: string,
  dzuhur: string,
  ashar: string,
  maghrib: string,
  isya: string,
}
function App() {
  const [time, settime] = useState(new Date())
  const [blink, setBlink] = useState(true);
  const [date, setDate] = useState("")
  const [city, setCity] = useState("")
  const [jadwal, setJadwal] = useState<Jadwal | null>(null)
  const [isTimeSolat, setIsTimeSolat] = useState(false)
  const [solatNow, setSolatNow] = useState("")
  const [solatNext, setSolatNext] = useState("")
  const [timecountdown, setTimecountdown] = useState("")
  const urlJadwal = "https://api.myquran.com/v2/sholat/jadwal/1301/"
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const year = time.getFullYear();
  const listSolat = ["imsak", "subuh", "dzuhur", "ashar", "maghrib", "isya"]
  const [isDarkMode, setIsDarkMode] = useState(true);
  const padZero = (time: number) => {
    return (time < 10) ? `0${time}` : time;
  }
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      settime(new Date());
      setBlink(!blink);
      checkTimeSolat()
      countdownsolat()
    }, 1000);
    return () => clearInterval(intervalId);
  }, [blink]);
  React.useEffect(() => {
    getJadwalAzan()
  }, [])
  React.useEffect(() => {
    (isDarkMode) ? document.documentElement.classList.toggle('dark') : document.documentElement.classList.remove('dark')

  }, [isDarkMode])

  const getJadwalAzan = async () => {
    const dd = new Date()
    const url = `${urlJadwal}${year}/${padZero(dd.getMonth() + 1)}/${padZero(dd.getDate())}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setDate(data.data.jadwal.tanggal);
      setCity(data.data.daerah);
      setJadwal(data.data.jadwal as Jadwal);
    } catch (error) {
      console.error(error);
    }
  }
  const checkTimeSolat = () => {
    if (jadwal) {
      const nowTimeInMinutes = hours * 60 + minutes;
      const jedanotifsolat = 5;

      for (const [key, value] of Object.entries(jadwal)) {
        const [startHour, startMinute] = value.split(":").map(Number);
        const startTimeInMinutes = startHour * 60 + startMinute;
        const endTimeInMinutes = startHour * 60 + startMinute + jedanotifsolat;

        if (nowTimeInMinutes >= startTimeInMinutes && nowTimeInMinutes <= endTimeInMinutes) {
          setIsTimeSolat(true)
          setSolatNow(key)
          return
        }
        setIsTimeSolat(false)
        setSolatNow("")
      }
    }
  }
  const countdownsolat = () => {
    // const dummy = "13:55"
    if (jadwal) {
      const aa: Jadwal = { ...jadwal }
      // aa.ashar = dummy
      // console.log("aa", aa);
      const notifselisih = 5 * 60
      const nowTimeInSeconds = hours * 3600 + (minutes * 60) + seconds;
      for (const [key, value] of Object.entries(aa)) {
        const [startHour, startMinute] = value.split(":").map(Number);
        const startTimeInSeconds = startHour * 3600 + (startMinute * 60);
        const selisih = startTimeInSeconds - nowTimeInSeconds
        if (selisih > 0 && selisih <= notifselisih) {
          setTimecountdown(convertDetikKeJam(selisih))
          setSolatNext(key)
          return
        }
        setTimecountdown("")
        setSolatNext("")
      }
    }
  }
  function capitalize(s: string) {
    return s && String(s[0]).toUpperCase() + String(s).slice(1);
  }
  const BlinkComponent = () => {
    return (
      <span className={`${blink ? 'opacity-40' : 'opacity-100'}`}>:</span>
    )
  }
  const ItemSolat = (title: string, time?: string) => {
    return (
      <div className='flex flex-row text-2xl'>
        <p className={`w-24 md:w-20 ${isDarkMode ? "" : ""}`}>{capitalize(title)}</p>
        <p className='mx-5'>:</p>
        <p className='text-2xl font-bold'>{time}</p>
      </div>
    )
  }
  function convertDetikKeJam(detik: number) {
    // const jam = Math.floor(detik / 3600);
    const menit = Math.floor((detik % 3600) / 60);
    const detikSisa = detik % 60;

    return `${menit.toString().padStart(2, '0')}:${detikSisa.toString().padStart(2, '0')}`;
  }
  return (
    <>
      <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 zain-regular ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-100 to-blue-300 text-gray-800'
        }`}>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-200/50 dark:bg-gray-700/50 hover:cursor-pointer"
        >
          {isDarkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-700" />}
        </button>
        <div className='absolute top-5 left-5'>
          <p className='text-3xl zain-regular'>Jadwal Solat Wilayah <span className='text-4xl zain-bold'>{city}</span></p>
          {
            listSolat.map((item, index) => {
              return (
                <div key={index}>
                  {/* @ts-ignore */}
                  {ItemSolat(item, jadwal && jadwal?.[item as keyof Jadwal])}
                </div>
              )
            })
          }

        </div>
        <div className='flex justify-center items-center h-full flex-col'>
          <p className='text-4xl md:text-5xl'>
            {date}
          </p>
          <p className='text-6xl md:text-9xl zain-bold'>
            {padZero(hours)}<BlinkComponent />{padZero(minutes)}<BlinkComponent />{padZero(seconds)}
          </p>
          {
            isTimeSolat &&
            <p className='text-4xl md:text-6xl text-center mt-4 animation-color-transition'>
              Waktu solat {capitalize(solatNow)} telah tiba
            </p>
          }
          {
            timecountdown &&
            <p className='text-4xl md:text-6xl text-center mt-4 animation-color-transition'>
              Waktu menuju solat<br />{capitalize(solatNext)} {timecountdown}
            </p>
          }
        </div>
      </div>
    </>
  )
}

export default App
