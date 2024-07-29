// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';


import sunny from '../WeatherImg/sunny.png'; // 맑음
import cloudy from '../WeatherImg/cloudy.png'; // 구름 많음
import scloudy from '../WeatherImg/scloudy.png'; // 흐림
import sonagi from '../WeatherImg/sonagi.png'; // 소나기
import rain from '../WeatherImg/rain.png'; // 비
import snow from '../WeatherImg/snow.png'; // 눈
import snowrain from '../WeatherImg/snowrain.png'; // 눈비



const TodayList = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
  const BASE_URL = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
  const SERVICE_KEY = decodeURIComponent(API_KEY); // Ensure your key is properly decoded

  const fetchWeatherData = async () => {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0].replace(/-/g, '');
    const hours = today.getHours();
    const baseTime = hours < 2 ? '2300' : `${String((Math.floor(hours / 3) - 1) * 3 + 2).padStart(2, '0')}00`;
   
   // 브라우저에서 요청받은 값을 넣어야댐
    const nx = 60; // Example grid x coordinate
    const ny = 127; // Example grid y coordinate

    try {
      const response = await axios.get(BASE_URL, {
        params: {
          serviceKey: SERVICE_KEY,
          numOfRows: 100,
          pageNo: 1,
          dataType: 'JSON',
          base_date: dateString,
          base_time: baseTime,
          nx,
          ny,
        },
      });

      if (response.data.response.body.items.item) {
        const items = response.data.response.body.items.item;

        console.log(items);

        // Grouping data by fcstTime
        const groupedData = items.reduce((acc, item) => {
          const { fcstTime, category, fcstValue } = item;
          if (!acc[fcstTime]) acc[fcstTime] = { fcstTime };
          acc[fcstTime][category] = fcstValue;
          return acc;
        }, {});

        // Convert grouped data object to array and slice the first 5 elements
        const filteredData = Object.values(groupedData).slice(0, 5);

        setWeatherData(filteredData);
        setLoading(false);
      } else {
        setError('No data found');
        setLoading(false);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
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
  const getSkyImage2 = (skyCode2) => {
    switch (skyCode2) {
      case '0':
        return sunny; // 맑음
      case '1':
        return rain; // 비
      case '2':
        return snowrain; // 눈/비
      case '3':
        return snow; // 눈
      case '4':
        return sonagi; // 소나기
      default:
        return null; // 정보 없음
    }
  };




  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>오늘의 날씨(시간별)</h1>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>시간</th>
            <th>기온 (°C)</th>
            <th>강수 확률 (%)</th>
            <th>습도 (%)</th>
            <th>강수 형태</th>
            <th>하늘 상태</th>
          </tr>
        </thead>
        <tbody>
            {weatherData.map((data, index) => (
            <tr key={index}>
                <td>{`${data.fcstTime.slice(0, 2)}:00`}</td>
                <td>{data.TMP || 'N/A'}°C</td>
                <td> {data.POP || 'N/A'}%</td>
                <td>{data.REH || 'N/A'}%</td>
                {/* <td>{data.PTY === '0' ? '없음' : 
                    data.PTY === '1' ? '비' : 
                    data.PTY === '2' ? '눈/비' :
                    data.PTY === '3' ? '눈' :
                    data.PTY === '4' ? '소나기' :
                    'N/A'}</td> */}
                  <td> {data?.PTY && (
                  <img src={getSkyImage2(data.PTY)} alt="하늘 상태" style={{ width: '50px', height: '50px' }} />
                    )}
                </td> 
                


                {/* <td>{data.SKY === '1' ? '맑음' : 
                    data.SKY === '3' ? '구름 많음' : 
                    data.SKY === '4' ? '흐림' : 
                    'N/A'}</td> */}
                <td> {data?.SKY && (
                  <img src={getSkyImage(data.SKY)} alt="하늘 상태" style={{ width: '50px', height: '50px' }} />
                    )}
                </td>    
            </tr>
            ))}
          
        </tbody>
      </table>



    </div>
  );
};

export default TodayList;
