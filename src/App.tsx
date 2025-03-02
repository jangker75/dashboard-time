import React, { useState } from 'react'
import './App.css'

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
  const urlJadwal = "https://api.myquran.com/v2/sholat/jadwal/1301/"
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const year = time.getFullYear();
  const listSolat = ["imsak", "subuh", "dzuhur", "ashar", "maghrib", "isya"]
  const padZero = (time: number) => {
    return (time < 10) ? `0${time}` : time;
  }
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      settime(new Date());
      setBlink(!blink);
      checkTimeSolat()
      console.log(isTimeSolat);
      
    }, 1000);
    return () => clearInterval(intervalId);
  }, [blink]);
  React.useEffect(() => {
    getJadwalAzan()
  }, [])

  const getJadwalAzan = async () => {
    const dd = new Date()

    const response = await fetch(urlJadwal + year + "/" + padZero(dd.getMonth() + 1) + "/" + padZero(dd.getDate()));
    const data = await response.json();
    const tmpdate = data.data.jadwal.tanggal
    setDate(tmpdate)
    const tmpcity = data.data.daerah
    setCity(tmpcity)
    const tmpjadwal: Jadwal = data.data.jadwal as Jadwal
    setJadwal(tmpjadwal)
  }
  const checkTimeSolat = () => {
    if (jadwal) {
      for (const [key, value] of Object.entries(jadwal)) {
        const startHour = parseInt(value.split(":")[0]);
        const startMinute = parseInt(value.split(":")[1]);
        const nowTimeInMinutes = hours * 60 + minutes;
        const startTimeInMinutes = startHour * 60 + startMinute;
        const endTimeInMinutes = startHour * 60 + startMinute + 5;
        if (nowTimeInMinutes >= startTimeInMinutes && nowTimeInMinutes <= endTimeInMinutes) {
          setIsTimeSolat(true)
          setSolatNow(key)
          return
        } else {
          setIsTimeSolat(false)
          setSolatNow("")
        }
      }
    }
  }
  function capitalize(s: string)
  {
      return s && String(s[0]).toUpperCase() + String(s).slice(1);
  }
  const BlinkComponent = () => {
    return (
      <span className={`text-white ${blink ? 'opacity-40' : 'opacity-100'}`}>:</span>
    )
  }
  const ItemSolat = (title: string, time?: string) => {
    return (
      <div className='flex flex-row text-2xl'>
        <p className='w-20'>{capitalize(title)}</p>
        <p className='mx-5'>:</p>
        <p>{time}</p>
      </div>
    )
  }
  return (
    <>
      <div className='h-screen bg-black'>
        <div className='absolute top-5 left-5 text-white'>
          <p className='text-3xl'>Jadwal Solat Wilayah <span className='text-4xl'>{city}</span></p>
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
          <p className='text-5xl text-blue-200'>
            {date}
          </p>
          <p className='text-9xl text-white font-bold'>
            {padZero(hours)}<BlinkComponent />{padZero(minutes)}<BlinkComponent />{padZero(seconds)}
          </p>
          {
            isTimeSolat &&
            <p className='text-6xl mt-4 animation-color-transition'>
              Waktu solat {capitalize(solatNow)} telah tiba
            </p>
          }
        </div>
      </div>
    </>
  )
}

export default App
