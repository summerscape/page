import React from 'react'
import ClothAPI from './Components/ClothAPI'

import Header from './Components/Header'
import TodayWeatherList from './Components/TodayWetherList'
import GeolocationExample from './Components/GeolocationExample'
import TodayList from './Components/TodayList'


import './Cloth.css'


const Cloth = () => {
  return (
    <div>
      <h1>Cloth Component</h1>

      <Header />
      <hr />

      <div className="flex-container">
        <TodayWeatherList />
        <TodayList />
      </div>
      <hr />
      <ClothAPI />
      <hr />
      <GeolocationExample />
    </div>
  )
}

export default Cloth