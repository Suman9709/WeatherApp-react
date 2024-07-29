import React, { useEffect, useRef, useState } from 'react'
import search_icon from '../assets/searchs.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import humidity_icon from '../assets/humidity.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon_ from '../assets/wind.png'

const Api_key = "b7c359cd1f92ed6d7ee8e52d508add9f";

const Weather = () => {
    const inputRef = useRef()

    const [weatherData, setWeatherData] = useState(false)
    const [backgroundColor, setBackgroundColor] = useState('cyan')
    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon

    }
    const search = async (city) => {
        if (!city || city === "") {
            alert("Enter a city name")
            return
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${Api_key}`;
            const res = await fetch(url);
            const data = await res.json();
            if (!res.ok) {
                alert("city not found")
                return;
            }
            console.log(data)
            const icon = allIcons[data.weather[0].icon] || clear_icon;

            const currentTime = new Date().getTime() / 1000;
            const sunrise = data.sys.sunrise;
            const sunset = data.sys.sunset;


            if (currentTime >= sunrise && currentTime <= sunset) {
                setBackgroundColor('cyan');
            } else {
                setBackgroundColor('#3d3980');
            }


            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon,
                description: data.weather[0].description,
            })
            inputRef.current.value = "";
        } catch (error) {
            setWeatherData(false);
            console.error("Error fetching data");
        }
    }

    useEffect(() => {
        // search()
    }, [weatherData])
    const handleSearch = (event) => {
        event.preventDefault();
        search(inputRef.current.value);
    }
    return (
        <div className='w-screen h-screen flex items-center justify-center bg-slate-600'>
            <div className=' w-[450px] h-[500px] p-4 shadow-xl items-center rounded-xl' style={{ backgroundColor: backgroundColor }}>
                <div className='flex gap-4 items-center justify-center w-[350px]'>
                    <form className='flex justify-start items-center p-4' onSubmit={handleSearch}>
                        {/* <input className='w-[250px] p-2 text-[1.5rem] rounded-lg text-3xl font-medium items-center' ref={inputRef} type="text" placeholder='Search' /> */}
                        <input className='w-[250px] p-2 text-[1.5rem] rounded-lg text-3xl font-medium items-center' ref={inputRef} type="text" placeholder='Search' />
                        <img className='items-center justify-center w-14 h-14  text-white font-bold cursor-pointer ' src={search_icon} alt="" onClick={() => search(inputRef.current.value)} />
                        {/* <SearchIcon className='align-middle w-14 h-14 text-white font-bold cursor-pointer' onClick={handleSearch} /> */}
                    </form>
                </div>
                {weatherData && (
                    <div className='mt-4'>
                        <div className='items-center flex flex-col text-white'>
                            <img className='w-[100px] h-[100px] items-center flex ' src={weatherData.icon} alt="" />
                            <p className='text-2xl font-bold mt-4'>{weatherData.temperature}°C</p>
                            <p className='text-2xl font-bold'>{weatherData.location}</p>
                        </div>



                        <div className='flex flex-col gap-4 p-4 text-white'>

                            <div className='items-center  flex flex-colm gap-2 p-2' >
                                <div className='flex flex-row gap-12 font-bold text-2xl'>
                                    <span>Description</span>
                                    <p>{weatherData.description}</p>

                                </div>
                            </div>
                            <div className='items-center  flex flex-colm gap-2 p-2' >
                                <img src={humidity_icon} alt="" />
                                <div className='flex flex-row gap-12 font-bold text-2xl'>
                                    <span>Humidity</span>
                                    <p>{weatherData.humidity}%</p>

                                </div>
                            </div>

                            <div className='items-center flex flex-colm gap-2  text-white'>
                                <img src={wind_icon_} alt="" />
                                <div className='flex flex-row font-bold text-2xl gap-5'>
                                    <span>Wind Speed</span>
                                    <p>{weatherData.windSpeed}km/hr</p>

                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
export default Weather
