"use Client";
import axios from "axios";
import React, { useContext, createContext, useState, useEffect } from "react";
import defaultStates from "../utils/defaultStates";

import { debounce } from "lodash";
import { toast } from "sonner";

const GlobalContext = createContext();
const GlobalContextUpdate = createContext();

export const GlobalContextProvider = ({ children }) => {
 const [forecast, setForecast] = useState({});
 const [geoCodedList, setGeoCodedList] = useState(defaultStates);
 const [inputValue, setInputValue] = useState("");

 const [activeCityCoords, setActiveCityCoords] = useState([
  12.0022, 8.5920
 ]);

 const [airQuality, setAirQuality] = useState({});
 const [fiveDayForecast, setFiveDayForecast] = useState({});
 const [uvIndex, seUvIndex] = useState({});

 const fetchForecast = async (lat, lon) => {
  try {
   const promise = axios.get(`api/weather?lat=${lat}&lon=${lon}`);
   const throwError = () => { throw new Error("Something went wrong") }
   console.log("Fetching Forecast...")
   const forecastToast = toast.promise(promise, {
    loading: "Fetching Forecast",
    success: (res) => {
     setForecast(res.data);
     toast.success("Successfully fetched Forecast", {
      id: forecastToast
     })
     toast.dismiss(forecastToast);
    },
    error: throwError
   })

  } catch (error) {
   console.log("Error fetching forecast data: ", error.message);
  }
 };

 // Air Quality
 const fetchAirQuality = async (lat, lon) => {
  try {
   const res = await axios.get(`api/pollution?lat=${lat}&lon=${lon}`);
   setAirQuality(res.data);
  } catch (error) {
   console.log("Error fetching air quality data: ", error.message);
  }
 };

 // five day forecast
 const fetchFiveDayForecast = async (lat, lon) => {
  try {
   const res = await axios.get(`api/fiveday?lat=${lat}&lon=${lon}`);

   setFiveDayForecast(res.data);
  } catch (error) {
   console.log("Error fetching five day forecast data: ", error.message);
  }
 };

 //geocoded list
 const fetchGeoCodedList = async (search) => {
  try {
   setGeoCodedList({ loading: true });
   const res = await axios.get(`/api/geocoded?search=${search}`);
   console.log(res.data)
   setGeoCodedList(res.data);
  } catch (error) {
   console.log("Error fetching geocoded list: ", error.message);
  }
 };

 //fetch uv data
 const fetchUvIndex = async (lat, lon) => {
  try {
   const res = await axios.get(`/api/uv?lat=${lat}&lon=${lon}`);

   seUvIndex(res.data);
  } catch (error) {
   console.error("Error fetching the forecast:", error);
  }
 };

 // handle input
 const handleInput = (e) => {
  setInputValue(e.target.value);

  if (e.target.value === "") {
   setGeoCodedList(defaultStates);
  }
 };

 // debounce function
 useEffect(() => {
  const debouncedFetch = debounce((search) => {
   fetchGeoCodedList(search);
  }, 500);

  if (inputValue) {
   debouncedFetch(inputValue);
  }

  // cleanup
  return () => debouncedFetch.cancel();
 }, [inputValue]);

 useEffect(() => {
  fetchForecast(activeCityCoords[0], activeCityCoords[1]);
  fetchAirQuality(activeCityCoords[0], activeCityCoords[1]);
  fetchFiveDayForecast(activeCityCoords[0], activeCityCoords[1]);
  fetchUvIndex(activeCityCoords[0], activeCityCoords[1]);
 }, [activeCityCoords]);

 return (
  <GlobalContext.Provider
   value={{
    forecast,
    airQuality,
    fiveDayForecast,
    uvIndex,
    geoCodedList,
    inputValue,
    handleInput,
    setActiveCityCoords,
   }}
  >
   <GlobalContextUpdate.Provider
    value={{
     setActiveCityCoords,
    }}
   >
    {children}
   </GlobalContextUpdate.Provider>
  </GlobalContext.Provider>
 );
};

export const useGlobalContext = () => useContext(GlobalContext);
export const useGlobalContextUpdate = () => useContext(GlobalContextUpdate);
