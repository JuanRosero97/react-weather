import "./home.css"
import React, { useState, useEffect } from 'react';
import { IconContext } from "react-icons";

import { MdMyLocation, MdLocationPin,MdSearch} from "react-icons/md";
import { getInfoWeather,getInfoWeatherDays } from '../../services/apiweather.service';
import  moment  from "moment";

const date_weather = "Today - Wed, 19 Jan"

const Home = ()=>{
    
    const [city, setCity] = useState('Bogotá');
    const [prevcity, setPrevCity] = useState('Bogotá');
    const [units, setUnits] = useState('metric');
    const [weather, setWeather] = useState({});
    const [weatherDays, setWeatherDays] = useState([]);
    const [unitsObj, setUnitsObj] = useState([{
        name:"°C",
        value:"metric",
        class:"unit-item",
        active:true
    },{
        name:"°F",
        value:"imperial",
        class:"unit-item",
        active:false
    }]);

    useEffect(() => {
        async function fetchLoad() {
            try{
                const infoWeather =  await getInfoWeather(city,units);
                setWeather(infoWeather.data)
            }catch(e){
                console.log("🚀 ~ file: index.jsx ~ line 30 ~ fetchLoad ~ e", e)                
            }
        }
        fetchLoad ();
    },[setWeather,units,city])

    useEffect(() => {
        async function fetchLoadDays() {
            try{
                const infoWeatherDays =  (await getInfoWeatherDays(city,units)).data;
                let obj = []

                for (let i = 0; i < infoWeatherDays.list.length; i++){
                    if(i === 0 || i%8 === 0){ obj.push(infoWeatherDays.list[i])}
                }
                setWeatherDays(obj)
            }catch(e){
                console.log("🚀 ~ file: index.jsx ~ line 30 ~ fetchLoad ~ e", e)                
            }
        }
        fetchLoadDays ();
    },[setWeatherDays,units,city])
    
    const changeUnit = (option,index) => {       
        for (let e = 0; e < unitsObj.length; e++) {
            unitsObj[e].active = false;
        }
        unitsObj[index].active = true;
        setUnitsObj(unitsObj);
        setUnits(option);
    }


    const handleChangeCity = (e)=>{
        e.preventDefault();
        const { value } = e.target
        setPrevCity(value)
    }

    const changeCity = ()=>{
        if(prevcity){
            setCity(prevcity)
        }
    }

    return(
        <div className="container">
            <div className="row">
                <div className="col-3 col-s-3 local-place">
                    <div className="row location">
                        <div className="col-8 col-s-8">
                        <input
                            className='btn btn-search'
                            type="text"
                            id="city"
                            name="city"
                            defaultValue={city} onChange={(e) => handleChangeCity(e)}
                        />
                        </div>
                        <div className="col-4 col-s-4 align-content-center">
                            <button className='btn btn-locate' onClick={() => changeCity()}>
                                <IconContext.Provider value={{ className: "locate-svg-class-name" }}>
                                    <div> <MdSearch /></div>                                  
                                </IconContext.Provider>
                            </button>
                        </div>
                    </div>
                    <div className= "row container-icon-weather">
                        <div className= "col-12 col-s-12 icon-background-main"> </div>
                        <div className= "col-12 col-s-12 weather-icon"> 
                            <img src={weather?.weather?  `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`: ""} alt="weather-icon"/>
                        </div>
                    </div>

                    <div className= "row container-info-weather">
                        <div className= "col-12 col-s-12 temp-text"> 
                            {weather.main? Math.round(weather.main.temp):""}<span>{units === "metric" ? "°C" : "°F"}</span>
                        </div>
                        <div className= "col-12 col-s-12 time-weather-text"> {weather?.weather? weather.weather[0].main : ""}</div>
                        <div className= "col-12 col-s-12 date-city-weather-text"> Today - {moment().format("ddd, DD MMM")} </div>
                        <div className= "col-12 col-s-12 date-city-weather-text"> <MdLocationPin /> {city}, {weather.sys?.country} </div>
                    </div>

                </div>
                <div className="col-9 col-s-9 bloque2">
                    <div className="row">
                        <div className="col-12 col-s-12 units-block">
                            {unitsObj.map((unit, i) => (
                                <a key={(i)} onClick={() => changeUnit(unit.value,i)} className={unit.active? `${unit.class} active`: unit.class}>{unit.name}</a>                               
                            ))}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-s-12 data-days-content">
                            {   weatherDays?.map((day,i)=>(
                                    <div key={(i)} className="content-card">
                                        <div>
                                            <span>{i===0? 'Tomorrow':moment(day.dt_txt).format('ddd, DD MMM')}</span>
                                        </div>
                                        <div>
                                            <img src={day?.weather? `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`: ""} alt="weather-icon"/>
                                        </div>
                                        <div className="temp-content">
                                            <span className="temp-min">{day.main? Math.round(day.main.temp_min):""}<span>{units === "metric" ? "°C" : "°F"}</span></span>
                                            <span>{day.main? Math.round(day.main.temp_max):""}<span>{units === "metric" ? "°C" : "°F"}</span></span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-s-12 title-highlight">Today’s Hightlights</div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-s-12 data-days-content">
                            <div className="params-card">
                                <div><span className="title-pressure">Humidity</span></div>
                                <div><span className="pressure">{weather.main?.humidity}<span> %</span> </span></div>
                                <progress className="mt-10" id="humidity" max="100" value={weather.main?.humidity}>{weather.main?.humidity}</progress>
                            </div>

                            <div className="params-card">
                                <div><span className="title-pressure">Air Pressure</span></div>
                                <div className="mt-10"><span className="pressure">{weather.main?.pressure}<span> hPa</span> </span></div>
                            </div>
                        </div>
                    </div>
                    <div className="row center-elm">
                        <div className="creator">
                            <a href="https://juanrosero.netlify.app/" target="blank">Created by <span className="sign">Juan Rosero</span></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Home