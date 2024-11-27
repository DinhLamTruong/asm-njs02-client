import { format } from 'date-fns';
import { useContext } from 'react';

import { AuthContext } from '../../context/AuthContext';

import Navbar from '../navbar/Navbar';
import Header from '../header/Header';
import MailList from '../mailList/MailList';
import Footer from '../footer/Footer';

import './Transactions.css';
import useFetch from '../../hooks/useFetch';
import { useEffect, useState } from 'react';

const Transactions = () => {
  const [dataTrs, setDataTrs] = useState([]);
  const { sendRequest: fetchTransactions } = useFetch();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const dataTrans = data => {
      setDataTrs(data);
    };
    fetchTransactions(
      {
        url: `http://localhost:5000/api/transactions/${user?.username}`,
      },
      dataTrans
    );
  }, [fetchTransactions, user?.username]);

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="tableContainer">
        <h2>Transactions</h2>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Hotel</th>
              <th>Room</th>
              <th>Date</th>
              <th>Price</th>
              <th>Payment Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dataTrs.map((item, i) => {
              const formattedDateStart = format(
                new Date(item.dateStart),
                'dd/MM/yyyy'
              );

              const formattedDateEnd = format(
                new Date(item.dateEnd),
                'dd/MM/yyyy'
              );
              const id = i < 10 ? '0' + (i + 1) : '' + (i + 1);

              return (
                <tr key={i}>
                  <td>{id}</td>
                  <td>{item.name}</td>
                  <td>{item.room.join(', ')}</td>
                  <td>
                    {formattedDateStart} - {formattedDateEnd}
                  </td>
                  <td>${item.price}</td>
                  <td>{item.payment}</td>
                  <td>
                    <button
                      className="statusBtn"
                      style={{ backgroundColor: '#f69685' }}
                    >
                      {item.status}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <MailList />
      <Footer />
    </div>
  );
};

export default Transactions;
