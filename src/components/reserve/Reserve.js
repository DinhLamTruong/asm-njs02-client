import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateRange } from 'react-date-range';
// import useFetch from '../../hooks/useFetch';
import { AuthContext } from '../../context/AuthContext';

// import { format } from 'date-fns';

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

import './Reserve.css';

const Reserve = ({ nameHotel, idHotel, rooms: listRoomOfHotel }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [date, setDate] = useState([
    { startDate: new Date(), endDate: new Date(), key: 'selection' },
  ]);
  const [roomStates, setRoomStates] = useState({}); // { roomNumber: { checked: false, disabled: false } }
  const [selectedRooms, setSelectedRooms] = useState([]); // [{ roomId, roomNumber, price }]
  const [payMethod, setPayMethod] = useState(null);

  // Lấy danh sách ngày từ startDate đến endDate
  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const date = new Date(start.getTime());

    const dates = [];
    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }
    return dates;
  };

  const alldates = getDatesInRange(date[0].startDate, date[0].endDate);

  let totalBill = 0;

  // Xử lý khi thay đổi ngày
  const handleDateChange = selectedDate => {
    const newDates = getDatesInRange(
      selectedDate.selection.startDate,
      selectedDate.selection.endDate
    );

    setDate([selectedDate.selection]);

    // Cập nhật trạng thái phòng
    const newRoomStates = {};
    listRoomOfHotel.forEach(room => {
      room.roomNumbers.forEach(room => {
        const isAvailable = !room.unavailableDates.some(unavailableDate =>
          newDates.includes(new Date(unavailableDate).getTime())
        );
        newRoomStates[room._id] = {
          checked: roomStates[room._id]?.checked && isAvailable, // Bỏ chọn nếu không khả dụng
          disabled: !isAvailable,
        };
      });
    });
    setRoomStates(newRoomStates);

    // Xóa các phòng không khả dụng
    const updatedRooms = selectedRooms.filter(({ roomNumberId }) => {
      const room = listRoomOfHotel.find(r =>
        r.roomNumbers.some(room => room._id === roomNumberId)
      );

      const selectedRoom = room?.roomNumbers.find(
        rn => rn._id === roomNumberId
      );
      return (
        selectedRoom &&
        !selectedRoom.unavailableDates.some(unavailableDate =>
          newDates.includes(new Date(unavailableDate).getTime())
        )
      );
    });

    setSelectedRooms(updatedRooms);
  };

  // Xử lý chọn/deselect phòng
  const handleRoomToggle = ({ _id, e, number, price }) => {
    const checked = e.target.checked;

    // Cập nhật trạng thái `roomStates`
    setRoomStates(prev => ({
      ...prev,
      [_id]: {
        ...prev[_id],
        checked,
      },
    }));

    // Cập nhật `selectedRooms`
    if (checked) {
      setSelectedRooms(prev => [
        ...prev,
        { roomNumberId: _id, roomNumber: number, price },
      ]);
    } else {
      setSelectedRooms(prev => prev.filter(room => room.roomNumberId !== _id));
    }
  };

  // Tính tổng hóa đơn
  if (selectedRooms.length > 0) {
    totalBill = selectedRooms.reduce(
      (total, { price }) => total + price * (alldates.length - 1),
      0
    );
  }

  // Gửi yêu cầu đặt phòng
  const handleReserve = async () => {
    if (date[0].startDate.getTime() === date[0].endDate.getTime())
      return alert('Select Dates!');
    if (selectedRooms.length === 0) return alert('Select Rooms!');
    if (!payMethod || payMethod === 'select pay method')
      return alert('Select Pay Method!');

    const roomUpdates = selectedRooms.map(({ roomNumberId }) => ({
      roomNumberId,
      dates: alldates,
    }));

    try {
      // Cập nhật trạng thái phòng
      await Promise.all(
        roomUpdates.map(({ roomNumberId, dates }) =>
          fetch(`http://localhost:5000/api/rooms/update-room/${roomNumberId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dates }),
          })
        )
      );

      // Tạo transaction mới
      await fetch(`http://localhost:5000/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionData: {
            user: user.username,
            hotel: idHotel,
            name: nameHotel,
            room: selectedRooms.map(r => r.roomNumber),
            dateStart: alldates[0],
            dateEnd: alldates[alldates.length - 1],
            price: totalBill,
            payment: payMethod,
            status: 'Booked',
          },
        }),
      });

      navigate('/transactions');
    } catch (error) {
      console.error('Error reserving rooms:', error);
    }
  };
  return (
    <>
      <div className="reserveContainer">
        <div className="reserveWrapper">
          <div className="dates">
            <h2 style={{ margin: '10px 0' }}>Dates</h2>
            <DateRange
              editableDateInputs={true}
              // onChange={item => handleSelectsDate(item)}
              onChange={item => handleDateChange(item)}
              moveRangeOnFirstSelection={false}
              ranges={date}
              minDate={new Date()}
            />
          </div>
          <div className="reserveInfo">
            <h2>Reserve Info</h2>
            <div className="reserveInput">
              <label>Your Full Name:</label>
              <input
                type="text"
                defaultValue={user?.fullName}
                placeholder="Full Name"
              />
            </div>
            <div className="reserveInput">
              <label>Your Email:</label>
              <input
                type="email"
                defaultValue={user?.email}
                placeholder="Email"
              />
            </div>
            <div className="reserveInput">
              <label>Your Phone Number:</label>
              <input
                type="phone"
                defaultValue={user?.phoneNumber}
                placeholder="Phone Number"
              />
            </div>
            <div className="reserveInput">
              <label>Your Identity Card Number:</label>
              <input type="text" placeholder="Card Number" />
            </div>
          </div>
        </div>
      </div>
      <h2 style={{ width: '100%', maxWidth: '1024px', margin: '20px 0' }}>
        Select Rooms
      </h2>
      <div className="selectRooms">
        {listRoomOfHotel.map((room, i) => (
          <div className="selectContainer" key={i}>
            <div className="roomContent">
              <h4>{room?.title}</h4>
              <p>{room?.desc}</p>
              <span>
                Max people: <b>{room?.maxPeople}</b>
              </span>
              <div>
                <b>${room?.price}</b>
              </div>
            </div>
            {room.roomNumbers.map(({ _id, number, unavailableDates }) => (
              <div className="rselectRoom" key={_id}>
                <div className="roomCheck">
                  <label>{number}</label>
                  <input
                    id={_id}
                    type="checkbox"
                    value={_id}
                    checked={roomStates[_id]?.checked || false}
                    disabled={roomStates[_id]?.disabled || false}
                    onChange={e =>
                      handleRoomToggle({
                        _id,
                        e,
                        number,
                        room,
                        price: room.price,
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="reserveFooter">
        <p>total bill: ${totalBill}</p>
        <div>
          <select onChange={e => setPayMethod(e.target.value)}>
            <option>select pay method</option>
            <option>Cash</option>
            <option>Credit Card</option>
          </select>
          <button onClick={handleReserve}>reserve now</button>
        </div>
      </div>
    </>
  );
};

export default Reserve;
