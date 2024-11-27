import { useState, useEffect } from 'react';
import useFetch from '../../hooks/useFetch';

import './featuredProperties.css';

const FeaturedProperties = () => {
  const [data, setData] = useState([]);
  const { sendRequest: fetchHighestRating } = useFetch();

  useEffect(() => {
    const fetchData = data => {
      setData(data);
    };
    fetchHighestRating(
      {
        url: 'http://localhost:5000/api/hotels/highestRating',
      },
      fetchData
    );
  }, [fetchHighestRating]);

  return (
    <div className="fp">
      {data.map((item, i) => (
        <div className="fpItem" key={i}>
          <img src={item.photos[2]} alt="" className="fpImg" />
          <span className="fpName">
            <a href={`./hotels/${item._id}`} target="_blank" rel="noreferrer">
              {item.name}
            </a>
          </span>
          <span className="fpCity">{item.city}</span>
          <span className="fpPrice">Starting from ${item.cheapestPrice}</span>
          {/* <div className="fpRating">
            <button>8.9</button>
            <span>Excellent</span>
          </div> */}
        </div>
      ))}
    </div>
  );
};

export default FeaturedProperties;
