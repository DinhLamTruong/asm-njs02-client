import { useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

import './navbar.css';

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to={'/'} style={{ color: 'white', textDecoration: 'none' }}>
          <span className="logo">Booking Website</span>
        </Link>
        {user && (
          <div className="navItems">
            <span>{user.email}</span>
            <button
              className="navButton"
              onClick={() => navigate('/transactions')}
            >
              Transaction
            </button>
            <button className="navButton" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
        {!user && (
          <div className="navItems">
            <button
              className="navButton"
              onClick={() => navigate('/authentication?auth=signup')}
            >
              Sign Up
            </button>
            <button
              className="navButton"
              onClick={() => navigate('/authentication?auth=login')}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
