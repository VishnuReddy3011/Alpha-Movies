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
  const [genreSet, setGenreSet] = useState(new Set());
  const {setSearchText, setMovieType, setIsTV, genreids, countries} = useContext(MovieContext);
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
    setSearchText("");
  }, []);

  const getCheckBoxes = useCallback(() => {
    const res = [];
    for(const key in genreids) {
      res.push (
        <li key={key} className="g-box">
          <input 
            type="checkbox" 
            id={key} 
            value={key} 
            name={key}
            onChange={e => {
              if(e.target.checked) {
                setGenreSet(prev => {
                  const st = new Set(prev);
                  st.add(e.target.value);
                  return st;
                })
              }
              else {
                setGenreSet(prev => {
                  const st = new Set(prev);
                  st.delete(e.target.value);
                  return st;
                })
              }
            }} 
          />
          <label htmlFor={key} className="cursor-pointer">
            {genreids[key]}
          </label>
        </li>
      )
    }
    return res;
  }, [])

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
          <div className="absolute top-[27px] left-24 flex flex-col items-center">
            <span
              className="cursor-pointer"
              onMouseEnter={e => {
                e.target.nextElementSibling.style.height = "150px";
              }}
              onMouseLeave={e => {
                e.target.nextElementSibling.style.height = "0";
              }}
            >Movies</span>

            <ul 
              className="w-[130px] nav-ul"
              style={{height: "0"}}
              onMouseEnter={e => {
                e.currentTarget.style.height = "150px";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.height = "0";
              }}
            >
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
          <div className="absolute top-[27px] left-52 flex flex-col items-center">
            <span
              className="cursor-pointer"
              onMouseEnter={e => {
                e.target.nextElementSibling.style.height = "150px";
              }}
              onMouseLeave={e => {
                e.target.nextElementSibling.style.height = "0";
              }}
            >TV Shows</span>

            <ul 
              className="w-[130px] nav-ul" 
              style={{height: "0"}}
              onMouseEnter={e => {
                e.currentTarget.style.height = "150px";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.height = "0";
              }}
            >
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
          <div className="absolute top-[25px] left-[608px] w-max">
            <Link to="/watchList"> Watch List </Link>
          </div>
          <div className="absolute top-[27px] text-white w-[100px] left-[340px] flex flex-col items-center">
            <div 
              className="flex gap-2 items-center cursor-pointer"
              onMouseEnter={(e) => {
                e.currentTarget.nextElementSibling.style.height = "340px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.nextElementSibling.style.height = "0";
              }}
            >
              <span>Genre</span>
              <i className="fa-solid fa-angle-down mt-1"></i>
            </div>
            <ul 
              className="ul-Spl ulTag genre-cbs" 
              style={{height: "0"}}
              onMouseEnter={(e) => {
                e.currentTarget.style.height = "340px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.height = "0";
              }}
            >
              {getCheckBoxes()}
              <li className="g-box srch">
                <Link to={`/genre/${[...genreSet].join('|')}`} onClick={e => {
                  if(genreSet.size === 0) {
                    e.preventDefault();
                  }
                }}>Search</Link>
              </li>
              <li className="g-box">hjhj</li>
            </ul>
          </div>
          <div className="absolute top-[27px] text-white w-[100px] left-[470px] flex flex-col items-center">
            <div 
              className="flex gap-2 items-center cursor-pointer"
              onMouseEnter={(e) => {
                e.currentTarget.nextElementSibling.style.height = "420px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.nextElementSibling.style.height = "0";
              }}
            >
              <span>Country</span>
              <i className="fa-solid fa-angle-down mt-1"></i>
            </div>
            <ul
              className="ul-Spl ulTag genre-cbs"
              style={{height: "0"}}
              onMouseEnter={(e) => {
                e.currentTarget.style.height = "420px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.height = "0";
              }}
            >
              {countries.map(item => {
                return (
                  <Link to={`/country/${item.id}`} key={item.id}>
                    <li className="cursor-pointer">{item.name}</li>
                  </Link>
                )
              })}
              <li>kdsjh</li>
            </ul>
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
                      navigate('/search');
                      setIsActive(false);
                    }
                  }
                }}
              />
              <Link to='/search'>
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
