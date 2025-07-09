import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        VideoStream
      </Link>
      
      <ul className="navbar-nav">
        <li><Link to="/">Home</Link></li>
        
        {isAuthenticated ? (
          <>
            <li><Link to="/upload">Upload</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li>
              <span>Welcome, {user?.username}</span>
            </li>
            <li>
              <button onClick={handleLogout} className="btn">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
