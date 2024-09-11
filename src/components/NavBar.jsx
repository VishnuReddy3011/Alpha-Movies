import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import Headroom from 'react-headroom';
import { Link, useNavigate } from "react-router-dom";
import { MovieContext } from "../MovieContextWrapper";
import Logo from "../assets/logo_with_glow.png";
import './styles/navbar.css';
const NavBar = () => {
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate(); 

  const {setSearchText, setMovieType, setIsTV} = useContext(MovieContext);
  const [temp, setTemp] = useState("");


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

  const handleType = useCallback((type, flag) => {
    setMovieType(type);
    setIsTV(flag);
  }, []);
  return (
    <Headroom>
      <div className="navbar">
        <div className="logo">
          <Link to="/">
            <img src={Logo} />
          </Link>
        </div>
        <div className="links relative">
          <Link to="/"> Home </Link>
          
          <div className="absolute top-[27px] left-24 h-[180px] flex flex-col items-center cursor-pointer" onClick={() => setSearchText("")}>
            <span
              onMouseEnter={e => {
                e.target.nextElementSibling.style.height = "100%";
              }}
              onMouseLeave={e => {
                e.target.nextElementSibling.style.height = "0";
              }}
            >Movies</span>
            <div 
              className="w-[130px] nav-ul" 
                style={{height: "0"}}
              onMouseEnter={e => {
                e.currentTarget.style.height = "100%";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.height = "0";
              }}
            >
              <ul className="w-full flex flex-col items-center">
                <Link to="/movies">
                  <li onClick={(e) => handleType("Popular", false)}>Popular</li>
                </Link>
                <Link to="/movies">
                  <li onClick={(e) => handleType("Now Playing", false)}>Now Playing</li>
                </Link>
                <Link to="/movies">
                  <li  onClick={(e) => handleType("Upcoming", false)}>Upcoming</li>
                </Link>
                <Link to="/movies">
                  <li onClick={(e) => handleType("Top rated", false)}>Top rated</li>
                </Link>
              </ul>
            </div>
          </div>
          <div className="absolute top-[27px] left-52 h-[180px] flex flex-col items-center cursor-pointer" onClick={() => setSearchText("")}>
            <span
              onMouseEnter={e => {
                e.target.nextElementSibling.style.height = "100%";
              }}
              onMouseLeave={e => {
                e.target.nextElementSibling.style.height = "0";
              }}
            >TV Shows</span>
            <div 
              className="w-[130px] nav-ul" 
                style={{height: "0"}}
              onMouseEnter={e => {
                e.currentTarget.style.height = "100%";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.height = "0";
              }}
            >
              <ul className="w-full flex flex-col items-center">
                <Link to="/movies">
                  <li onClick={(e) => handleType("Popular", true)}>Popular</li>
                </Link>
                <Link to="/movies">
                  <li onClick={(e) => handleType("Airing Today", true)}>Airing Today</li>
                </Link>
                <Link to="/movies">
                  <li  onClick={(e) => handleType("On The Air", true)}>On The Air</li>
                </Link>
                <Link to="/movies">
                  <li onClick={(e) => handleType("Top rated", true)}>Top rated</li>
                </Link>
              </ul>
            </div>
          </div>
          <div className="absolute top-[25px] left-[355px] w-max">
            <Link to="/watchList"> Watch List </Link>
          </div>
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
              <span onClick={() => {
                setTimeout(() => inputRef.current.focus(), 500);
              }}>Search</span>
            </button> 
            <div id="search-input-field" className={isActive ? 'active' : 'not-active'}>
              <input 
                type="text" 
                placeholder="Search movie..." 
                spellCheck={false}
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
                      navigate('/movies');
                      setIsActive(false);
                    }
                  }
                }}
              />
              <Link to='/movies'>
                <i 
                  className={`fa-sharp-duotone fa-solid fa-magnifying-glass text-base search-icon ${isActive ? 'active' : 'not-active'}`}
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
            </div>
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