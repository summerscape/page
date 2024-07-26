import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClothItem = ({ title, value, imgPath }) => {
  // console.log(`Image path for ${title}:`, imgPath); // Log the image path to verify

  return (
    <div>
      <strong>{title}:</strong> {value}
      <div>
        <img src={imgPath} alt={value} style={{ width: '100px', height: '100px' }} onError={(e) => { e.target.src = 'img/placeholder.png'; }} />
      </div>
    </div>
  );
};

const ClothList = ({ clothes, style}) => (
  <>
    <ClothItem title="상의" value={clothes.상의} imgPath={`/img/clothes/${style.toLowerCase()}/${clothes.상의}.png`} />
    <ClothItem title="하의" value={clothes.하의} imgPath={`/img/clothes/${style.toLowerCase()}/${clothes.하의}.png`} />
    <ClothItem title="신발" value={clothes.신발} imgPath={`img/clothes/${style.toLowerCase()}/${clothes.신발}.png`} />
    <ClothItem title="악세서리" value={clothes.악세서리} imgPath={`/img/clothes/${style.toLowerCase()}/${clothes.악세서리}.png`} />
  </>
);



const ClothAPI = () => {
  const [clothesData, setClothesData] = useState({
    Casual: {},
    Formal: {},
    Sporty: {}
  });
  const [selectedStyle, setSelectedStyle] = useState(null);

  useEffect(() => {
    const fetchClothes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/code');
        console.log(response.data);
        setClothesData(response.data);
      } catch (error) {
        console.error('Failed to fetch clothes data:', error);
      }
    };

    fetchClothes();
  }, []);

  const handleStyleClick = (style) => {
    setSelectedStyle(style);
  };

  return (
    <div>
      <h2>옷</h2>
      <div>
        <button onClick={() => handleStyleClick('Casual')}>Casual</button>
        <button onClick={() => handleStyleClick('Formal')}>Formal</button>
        <button onClick={() => handleStyleClick('Sporty')}>Sporty</button>
      </div>
      {selectedStyle && (
        <div>
          <h3>{selectedStyle} Style</h3>
          <ClothList clothes={clothesData[selectedStyle]} style={selectedStyle} />
        </div>
      )}
    </div>
  );
};

export default ClothAPI;
