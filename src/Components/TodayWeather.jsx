import React, { useEffect } from 'react'
import axios from 'axios'

const TodayWeather = () => {

    const url = 'http://127.0.0.1:8000/weather'


    const getAPi = async() =>{
        try{
            const res = await axios.get(url);
            console.log(res.data)
           
            let temp = document.getElementById('temp') 
            temp.innerHTML = res.data.기온
            let hum = document.getElementById('hum') 
            hum.innerHTML = res.data.습도
            let pre = document.getElementById('pre') 
            pre.innerHTML = res.data.강수량
            let pre_type = document.getElementById('pre_type') 
            pre_type.innerHTML = res.data.강수형태



        } catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        getAPi();
    },[])




  return (
    <div>
        
        <h1>W</h1>
        TodayWeather



        <p>기온 : <div id='temp'></div></p>
        <p>습도 : <div id='hum'></div></p>
        <p>강수량 : <div id='pre'></div></p>
        <p>강수형태 : <div id='pre_type'></div></p>










    </div>






  )
}

export default TodayWeather