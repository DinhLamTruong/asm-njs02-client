import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';

import './hotel.css';
import Navbar from '../../components/navbar/Navbar';
import Header from '../../components/header/Header';
import MailList from '../../components/mailList/MailList';
import Footer from '../../components/footer/Footer';
import useFetch from '../../hooks/useFetch';
import Reserve from '../../components/reserve/Reserve';
// import { SearchContext } from '../../context/SearchContext';
import { AuthContext } from '../../context/AuthContext';

const Hotel = () => {
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openReserve, setOpenReserve] = useState(false);
  const [data, setData] = useState();
  const [dataRooms, setDataRooms] = useState([]);
  const { sendRequest: fetchDetailHotel } = useFetch();
  const { user } = useContext(AuthContext);

  const handleOpen = i => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = direction => {
    let newSlideNumber;

    if (direction === 'l') {
      newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

  // const { dates, options } = useContext(SearchContext);

  // const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  // const dayDifference = (date1, date2) => {
  //   const timeDiff = Math.abs(date2?.getTime() - date1?.getTime());
  //   return Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
  // };
  const { id } = useParams();

  useEffect(() => {
    const fetchData = data => {
      setData(data);
    };
    fetchDetailHotel(
      {
        url: `http://localhost:5000/api/hotels/find/${id}`,
      },
      fetchData
    );
  }, [fetchDetailHotel, id]);

  const handleReserve = () => {
    const fetchDataRooms = data => {
      setDataRooms(data);
    };
    fetchDetailHotel(
      {
        url: `http://localhost:5000/api/hotels/hotel-rooms/${id}`,
      },
      fetchDataRooms
    );

    setOpenReserve(true);
  };

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="hotelContainer">
        {open && (
          <div className="slider">
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="close"
              onClick={() => setOpen(false)}
            />
            <FontAwesomeIcon
              icon={faCircleArrowLeft}
              className="arrow"
              onClick={() => handleMove('l')}
            />
            <div className="sliderWrapper">
              <img
                src={data?.photos[slideNumber]}
                alt=""
                className="sliderImg"
              />
            </div>
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              className="arrow"
              onClick={() => handleMove('r')}
            />
          </div>
        )}
        <div className="hotelWrapper">
          <h1 className="hotelTitle">{data?.name}</h1>
          <div className="hotelAddress">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>{data?.address}</span>
          </div>
          <span className="hotelDistance">
            Excellent location – {data?.distance}m from center
          </span>
          <span className="hotelPriceHighlight">
            Book a stay over ${data?.cheapestPrice} at this property and get a
            free airport taxi
          </span>
          <div className="hotelImages">
            {data &&
              data.photos.map((photo, i) => (
                <div className="hotelImgWrapper" key={i}>
                  <img
                    onClick={() => handleOpen(i)}
                    src={photo}
                    alt=""
                    className="hotelImg"
                  />
                </div>
              ))}
          </div>
          <div className="hotelDetails">
            <div className="hotelDetailsTexts">
              <h1 className="hotelTitle">Stay in the heart of City</h1>
              <p className="hotelDesc">{data?.desc}</p>
            </div>
            <div className="hotelDetailsPrice">
              <h2>
                <b>${data?.cheapestPrice}</b> (1 nights)
              </h2>
              <button
                className="btnReserve"
                onClick={handleReserve}
                disabled={!user}
              >
                Reserve or Book Now!
              </button>
            </div>
          </div>
        </div>
        {openReserve && (
          <Reserve
            nameHotel={data?.name}
            idHotel={data?._id}
            rooms={dataRooms}
          />
        )}

        <MailList />
        <Footer />
      </div>
    </div>
  );
};

export default Hotel;
