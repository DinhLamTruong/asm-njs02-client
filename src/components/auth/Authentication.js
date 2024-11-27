import { useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import { AuthContext } from '../../context/AuthContext';
import './Authentication.css';

function Authentication() {
  const [enteredValue, setEnteredValue] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phoneNumber: '',
  });
  const [err, setErr] = useState(null);
  const [inputEdit, setInputEdit] = useState(false);

  const [searchParams] = useSearchParams();
  const auth = searchParams.get('auth');
  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext);

  const handleChange = e => {
    setInputEdit(false);
    setErr(null);
    setEnteredValue(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  let formValid = false;

  const emptyKeys = Object.keys(enteredValue).some(
    key => enteredValue[key] === ''
  );

  if (!emptyKeys) {
    formValid = true;
  }

  const valueLogin =
    enteredValue.username === '' || enteredValue.password === '';

  const handleLogin = () => {
    setInputEdit(true);
  
    const url = 'http://localhost:5000/api/auth/login';
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: enteredValue.username,
        password: enteredValue.password,
      }),
    })
      .then(res => {
        const resData = res.json();
        if (res.status === 404) {
          return setErr('User not found!');
        } else if (res.status === 400) {
          return setErr('Wrong username or password!');
        } else {
          return resData;
        }
      })
      .then(user => {
        dispatch({
          type: 'LOGIN',
          payload: user.details,
        });
        navigate('/');
      })
      .catch(err => console.log(err));
  };
  const handleSignUp = () => {
    setInputEdit(true);
    if (!formValid) return;
    const url = 'http://localhost:5000/api/users/register';

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enteredValue),
    })
      .then(res => {
        if (res.status === 409) {
          return setErr('Username early exist!');
        }

        if (res.ok) {
          navigate('/authentication?auth=login');
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <>
      <Navbar />
      <div className="authentication">
        <div className="authContainer">
          <h1>{auth === 'login' ? 'Login' : 'Sign Up'}</h1>
          <input
            id="username"
            type="text"
            onChange={handleChange}
            value={enteredValue.username}
            placeholder="username"
          />
          <input
            id="password"
            type="password"
            onChange={handleChange}
            value={enteredValue.password}
            placeholder="password"
          />
          {auth === 'login' && inputEdit && err && (
            <span style={{ color: 'red' }}>{err}</span>
          )}

          {auth === 'signup' && (
            <>
              <input
                id="fullName"
                type="text"
                onChange={handleChange}
                value={enteredValue.fullName}
                placeholder="fullname"
              />

              <input
                id="email"
                type="email"
                onChange={handleChange}
                value={enteredValue.email}
                placeholder="email"
              />

              <input
                id="phoneNumber"
                type="text"
                onChange={handleChange}
                value={enteredValue.phoneNumber}
                placeholder="phone"
              />
              {inputEdit && err && <span style={{ color: 'red' }}>{err}</span>}
            </>
          )}

          {auth === 'login' && (
            <button onClick={handleLogin} disabled={valueLogin}>
              Login
            </button>
          )}
          {auth === 'signup' && (
            <button onClick={handleSignUp} disabled={emptyKeys}>
              Create Account
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Authentication;
