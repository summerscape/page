import React, { useState, useEffect } from 'react';

const GeolocationExample = () => {
  const [location, setLocation] = useState('Fetching location...');
  const [converted, setConverted] = useState('Converted Coordinates will appear here.');
  const [error, setError] = useState(null);  // 상태 변수 이름


  useEffect(() => {
    // 브라우저가 Geolocation API를 지원하는지 확인
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
        enableHighAccuracy: true
      });
    } else {
      setLocation('Geolocation is not supported by your browser.');
    }
  }, []);

  const handleSuccess = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLocation(`Latitude: ${latitude}, Longitude: ${longitude}`);
    
    // LCC DFS 좌표계로 변환
    const result = dfs_xy_conv("toXY", latitude, longitude);
    setConverted(`X: ${result.x}, Y: ${result.y}`);
    console.log(result.x, result.y);
   
  };


  const handleError = () => {
    setLocation('Unable to retrieve your location.');
  };

  // LCC DFS 좌표변환을 위한 기초 자료
  const RE = 6371.00877; // 지구 반경(km)
  const GRID = 5.0; // 격자 간격(km)
  const SLAT1 = 30.0; // 투영 위도1(degree)
  const SLAT2 = 60.0; // 투영 위도2(degree)
  const OLON = 126.0; // 기준점 경도(degree)
  const OLAT = 38.0; // 기준점 위도(degree)
  const XO = 43; // 기준점 X좌표(GRID)
  const YO = 136; // 기준점 Y좌표(GRID)

  function dfs_xy_conv(code, v1, v2) {
    const DEGRAD = Math.PI / 180.0;
    const RADDEG = 180.0 / Math.PI;

    const re = RE / GRID;
    const slat1 = SLAT1 * DEGRAD;
    const slat2 = SLAT2 * DEGRAD;
    const olon = OLON * DEGRAD;
    const olat = OLAT * DEGRAD;

    let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);
    const rs = {};
    
    if (code === "toXY") {
      rs['lat'] = v1;
      rs['lng'] = v2;
      let ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
      ra = re * sf / Math.pow(ra, sn);
      let theta = v2 * DEGRAD - olon;
      if (theta > Math.PI) theta -= 2.0 * Math.PI;
      if (theta < -Math.PI) theta += 2.0 * Math.PI;
      theta *= sn;
      rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
      rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    } else {
      rs['x'] = v1;
      rs['y'] = v2;
      const xn = v1 - XO;
      const yn = ro - v2 + YO;
      let ra = Math.sqrt(xn * xn + yn * yn);
      if (sn < 0.0) ra = -ra;
      let alat = Math.pow((re * sf / ra), (1.0 / sn));
      alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

      let theta;
      if (Math.abs(xn) <= 0.0) {
        theta = 0.0;
      } else {
        if (Math.abs(yn) <= 0.0) {
          theta = Math.PI * 0.5;
          if (xn < 0.0) theta = -theta;
        } else {
          theta = Math.atan2(xn, yn);
        }
      }
      const alon = theta / sn + olon;
      rs['lat'] = alat * RADDEG;
      rs['lng'] = alon * RADDEG;
    }
    return rs;
  }

  return (
    <div>
      <h1>Your Location</h1>
      <p>{location}</p>
      <p>{converted}</p>
    
    <p></p>
    </div>
  );
};

export default GeolocationExample;
