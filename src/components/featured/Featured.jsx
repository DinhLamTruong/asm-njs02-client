import { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import './featured.css';
import imgHn from '../../images/HaNoi.jpg';
import imgDn from '../../images/DaNang.jpg';
import imgHCM from '../../images/HCM.jpg';

const Featured = () => {
  const [data, setData] = useState([]);
  const { sendRequest: fetchCountByCity } = useFetch();

  useEffect(() => {
    const fetchData = data => {
      setData(data);
    };
    fetchCountByCity(
      {
        url: 'http://localhost:5000/api/hotels/countByCity?cities=Ha Noi,Da Nang,Ho Chi Minh',
      },
      fetchData
    );
  }, [fetchCountByCity]);

  return (
    <div className="featured">
      <>
        <div className="featuredItem">
          <img src={imgHn} alt="" className="featuredImg" />
          <div className="featuredTitles">
            <h1>Ha Noi</h1>
            <h2>{data[0]} properties</h2>
          </div>
        </div>
        <div className="featuredItem">
          <img src={imgDn} alt="" className="featuredImg" />
          <div className="featuredTitles">
            <h1>Da Nang</h1>
            <h2>{data[1]} properties</h2>
          </div>
        </div>
        <div className="featuredItem">
          <img src={imgHCM} alt="" className="featuredImg" />
          <div className="featuredTitles">
            <h1>Ho Chi Minh</h1>
            <h2>{data[2]} properties</h2>
          </div>
        </div>
      </>
    </div>
  );
};

export default Featured;
