import React, { useContext, useEffect } from 'react';
import Slider from 'react-slick';
import { myContext } from '../Context';

const OffersSlider = ({ offers }) => {
    const{ setOffers}=useContext(myContext)
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  useEffect(() => {
    fetch('http://localhost:5000/api/offers')
      .then(response => response.json())
      .then(data => setOffers(data))
      .catch(error => console.error('Error fetching offers:', error));
  }, []);
//   useEffect(() => {
//     const fetchOffers = async () => {
//       try {
//         const response = await axios.get('/api/offers'); // Adjust the endpoint
//         setOffers(response.data);
//       } catch (error) {
//         console.error('Error fetching offers:', error);
//       }
//     };

//     fetchOffers();
//   }, []);

  return (
    <div className="slider">
    {offers.map((offer, index) => (
      <div key={index} className="slide">
        <img src={offer.image} alt={offer.title} />
        <h3>{offer.title}</h3>
        <p>{offer.description}</p>
      </div>
    ))}
    </div>
  );
};

export default OffersSlider;
