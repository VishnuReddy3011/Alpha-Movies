import React, { useContext, useEffect, useRef, useState } from "react";
import Headroom from 'react-headroom';
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import './styles/navbar.css';
import { MovieContext } from "../MovieContextWrapper";
const NavBar = () => {
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();  // useNavigate hook

  // const [searchText, setSearchText] = useState();
  const {setSearchText} = useContext(MovieContext);
  const [temp, setTemp] = useState("");
  // https://api.themoviedb.org/3/search/tv?query=game%20of%20thrones&api_key=bba723222ce35673cae76bc15ffb91c1
  // https://api.themoviedb.org/3/search/movie?query=deadpool&api_key=bba723222ce35673cae76bc15ffb91c1


  const handleClickOutside = (event) => {
    if (
      inputRef.current && !inputRef.current.contains(event.target) &&
      buttonRef.current && !buttonRef.current.contains(event.target)
    ) {
      setIsActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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
          <Link to="/movies" onClick={() => setSearchText("")}> Movies </Link>
          {/* paina onclick rayu */}
          <Link to="/"> TV Series </Link>
          <Link to="/"> Top IMDB </Link>
          <Link to="/watchList"> Watch List </Link>
        </div>
        <div className="login">
          <div className="search-container">
            <button 
              className="flex gap-4 items-center"
              id="search-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsActive(true);
              }}
              ref={buttonRef}
            >
              <Link to='/movies'>
                <i 
                  className={`fa-sharp-duotone fa-solid fa-magnifying-glass text-base mt-1 search-icon ${isActive ? 'active' : 'not-active'}`}
                  onClick={(e) => {
                    if(!temp) {
                      e.preventDefault();
                    }
                    else {
                      setSearchText(temp);
                      setTemp("");
                    }
                  }}
                >
                </i>
              </Link>
              <span onClick={() => {
                setTimeout(() => inputRef.current.focus(), 500);
              }}>Search</span>
            </button> 
            <input 
              type="text" id="search-input-field" 
              placeholder="Search here..." 
              className={isActive ? 'active' : 'not-active'}
              ref={inputRef}
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === "Enter") {
                  if(!temp) {
                    e.preventDefault();
                  }
                  else {
                    setSearchText(temp);
                    setTemp("");
                    navigate('/movies'); // Navigate to /movies page
                    setIsActive(false);
                  }
                }
              }}
            />
          </div>
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