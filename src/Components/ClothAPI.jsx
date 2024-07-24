import React, { useEffect, useState } from 'react'
import axios from 'axios'


const ClothAPI = () => {

    const [clothList, setClothList] = useState([]);
  
    const url = 'http://127.0.0.1:8000/code'

    const getAPi = async() =>{
        try{
            const res = await axios.get(url);
            console.log(res.data)
            setClothList(res.data.Casual)
        } catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        getAPi();
    },[])
    

  return (



    <div>
       옷

    <table>
        <thead>
        <tr>
            <td></td>

        </tr>


        </thead>

        <tbody>
            {clothList.상의}
            {clothList.하의}
            {clothList.신발}
            {clothList.악세사리}

    

        </tbody>




    </table>




    </div>
  )
}

export default ClothAPI