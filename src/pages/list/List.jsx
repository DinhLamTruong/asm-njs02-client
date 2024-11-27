import { useLocation } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { DateRange } from 'react-date-range';

import './list.css';
import SearchItem from '../../components/searchItem/SearchItem';
import Navbar from '../../components/navbar/Navbar';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import { SearchContext } from '../../context/SearchContext';

const List = () => {
  const location = useLocation();
  const [datas, setDatas] = useState([]);
  const [destination, setDestination] = useState(location.state.destination);
  const [date, setDate] = useState(location.state.dates);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(location.state.options);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(9999);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { dispatch } = useContext(SearchContext);

  const handleOption = e => {
    const { name, value } = e.target;

    setOptions(prev => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const url = `http://localhost:5000/api/hotels/search?city=${destination}&min=${min}&max=${max}`;

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dates: date,
          opts: options,
        }),
      });
      if (!response.ok) throw new Error('Failed to fetch hotels');
      const data = await response.json();
      setDatas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [url]);

  const handleSearch = () => {
    dispatch({
      type: 'NEW_SEARCH',
      payload: { city: destination, dates: date, options },
    });
    fetchHotels();
  };

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Destination</label>
              <input
                placeholder={destination}
                type="text"
                onChange={e => setDestination(e.target.value)}
              />
            </div>
            <div className="lsItem">
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(
                date[0].startDate,
                'MM/dd/yyyy'
              )} to ${format(date[0].endDate, 'MM/dd/yyyy')}`}</span>
              {openDate && (
                <DateRange
                  onChange={item => setDate([item.selection])}
                  minDate={new Date()}
                  ranges={date}
                />
              )}
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Min price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    className="lsOptionInput"
                    onChange={e => setMin(e.target.value)}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    className="lsOptionInput"
                    onChange={e => setMax(e.target.value)}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    name="adult"
                    value={options.adult}
                    onChange={handleOption}
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.adult}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    name="children"
                    value={options.children}
                    onChange={handleOption}
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    placeholder={options.children}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    name="room"
                    value={options.room}
                    onChange={handleOption}
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.room}
                  />
                </div>
              </div>
            </div>
            <button onClick={handleSearch}>Search</button>
          </div>
          <div className="listResult">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : datas.length ? (
              datas.map((data, i) => (
                <div key={i}>
                  <SearchItem
                    id={data._id}
                    photo={data.photos.length > 0 && data.photos[0]}
                    data={data}
                  />
                </div>
              ))
            ) : (
              <p>No hotels found</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default List;
