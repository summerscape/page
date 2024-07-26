import React, { useState, useEffect } from 'react';

// 이미지 파일 import

import sunny from '../WeatherImg/sunny.png'; // 맑음
import cloudy from '../WeatherImg/cloudy.png'; // 구름 많음
import scloudy from '../WeatherImg/scloudy.png'; // 흐림

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL_SHORT = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';

const NX = '60'; // 단기예보용 x 좌표
const NY = '127'; // 단기예보용 y 좌표

const forecastTimes = ['0200', '0500', '0800', '1100', '1400', '1700', '2000', '2300'];

const getFormattedDate = (offset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

const getPreviousBaseTime = () => {
  const now = new Date();
  const hours = now.getHours();
  const currentTime = String(hours).padStart(2, '0') + String(Math.floor(now.getMinutes() / 30) * 10).padStart(2, '0');
  
  // 현재 시간보다 이전의 가장 가까운 base_time을 선택
  const previousTimes = forecastTimes.filter(time => parseInt(time) <= parseInt(currentTime));
  return previousTimes.length > 0 ? previousTimes[previousTimes.length - 1] : forecastTimes[0];
};

const TodayWeatherList = () => {
  const [todayWeather, setTodayWeather] = useState({});
  const [tomorrowWeather, setTomorrowWeather] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const formattedDate = getFormattedDate();
      const baseTime = getPreviousBaseTime();
      const shortTermUrl = `${BASE_URL_SHORT}?serviceKey=${API_KEY}&numOfRows=500&pageNo=1&dataType=JSON&base_date=${formattedDate}&base_time=${baseTime}&nx=${NX}&ny=${NY}`;
      
      try {
        const shortTermResponse = await fetch(shortTermUrl);
        if (!shortTermResponse.ok) {
          throw new Error(`HTTP error! Status: ${shortTermResponse.status}`);
        }

        const shortTermData = await shortTermResponse.json();
        const items = shortTermData.response?.body?.items?.item || [];

        const today = {};
        const tomorrow = {};

        items.forEach(item => {
          const fcstDate = item.fcstDate;
          const category = item.category;
          const value = item.fcstValue;

          if (fcstDate === formattedDate) {
            today[category] = value;
          } else if (fcstDate === getFormattedDate(1)) {
            tomorrow[category] = value;
          }
        });

        setTodayWeather(today);
        setTomorrowWeather(tomorrow);
      } catch (err) {
        console.error('단기예보 API 요청 중 오류 발생:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const getSkyImage = (skyCode) => {
    switch (skyCode) {
      case '1':
        return sunny; // 맑음
      case '3':
        return cloudy; // 구름 많음
      case '4':
        return scloudy; // 흐림
      default:
        return null; // 정보 없음
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div>
        <h2>오늘의 날씨</h2>
        <p>1시간 기온: {todayWeather?.TMP || '데이터 없음'}°C</p>
        <p>최저 기온: {todayWeather?.TMN || '데이터 없음'}°C</p>
        <p>최고 기온: {todayWeather?.TMX || '데이터 없음'}°C</p>
        <p>강수 확률: {todayWeather?.POP || '데이터 없음'}%</p>
        <p>습도: {todayWeather?.REH || '데이터 없음'}%</p>
        <p>
          하늘 상태:
          {todayWeather?.SKY === '1' ? '맑음' : todayWeather.SKY === '3' ? '구름 많음' : todayWeather.SKY === '4' ? '흐림' : '정보 없음'}
        </p>
        {todayWeather?.SKY && (
          <img src={getSkyImage(todayWeather.SKY)} alt="하늘 상태" style={{ width: '100px', height: '100px' }} />
        )}
      </div> 

      {/* <div>
        <h2>내일의 날씨</h2>
        <p>1시간 기온: {tomorrowWeather?.TMP || '데이터 없음'}°C</p>
        <p>최저 기온: {tomorrowWeather?.TMN || '데이터 없음'}°C</p>
        <p>최고 기온: {tomorrowWeather?.TMX || '데이터 없음'}°C</p>
        <p>강수 확률: {tomorrowWeather?.POP || '데이터 없음'}%</p>
        <p>습도: {tomorrowWeather?.REH || '데이터 없음'}%</p>
        <p>
          하늘 상태:
          {tomorrowWeather?.SKY === '1' ? '맑음' : tomorrowWeather.SKY === '3' ? '구름 많음' : tomorrowWeather.SKY === '4' ? '흐림' : '정보 없음'}
        </p>
        {tomorrowWeather?.SKY && (
          <img src={getSkyImage(tomorrowWeather.SKY)} alt="하늘 상태" style={{ width: '100px', height: '100px' }} />
        )}
      </div> */}


    </div>
  );
};

export default TodayWeatherList;
