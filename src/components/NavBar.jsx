import React, { useContext, useEffect, useRef, useState } from "react";
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

  const {setSearchText} = useContext(MovieContext);
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

  return (
    <Headroom>
      <div className="navbar">
        <div className="logo">
          <Link to="/">
            <img src={Logo} />
          </Link>
        </div>
        <div className="links">
          <Link to="/"> Movies </Link>
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