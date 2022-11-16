import axios from "axios";

export const getInfoWeather = async (nameCity, units) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_WEATHER_URL}/weather?q=${nameCity}&units=${units}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const getInfoWeatherDays = async (nameCity, units) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_WEATHER_URL}/forecast?q=${nameCity}&units=${units}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    throw error.response.data;
  }
};
