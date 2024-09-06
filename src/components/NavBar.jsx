import React from "react";
import Headroom from 'react-headroom';
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import './styles/navbar.css';
const NavBar = () => {
  return (
    <Headroom>
      <div className="navbar">
        <div className="logo">
          <Link to="/">
            <img src={Logo} />
          </Link>
        </div>
        <div className="links">
          <Link to="/"> Home </Link>
          <div className="dropdown">
              <span> Genre </span>
              <i className="fa-solid fa-angle-down mt-1"></i>
          </div>
          <div className="dropdown">
              <span> Country </span>
              <i className="fa-solid fa-angle-down mt-1"></i>
          </div>
          <Link to="/movies"> Movies </Link>
          <Link to="/"> TV Series </Link>
          <Link to="/"> Top IMDB </Link>
          <Link to="/watchList"> Watch List </Link>
        </div>
        <div className="login">
          <Link className="log">
            <i className="fa-regular fa-user text-sm mt-1"></i>
            <span>Login</span>
          </Link>
        </div>
      </div>
    </Headroom>
  );
};

export default NavBar;