import React, { useCallback, useContext, useEffect, useState } from "react";
import { MovieContext } from "../MovieContextWrapper";
import TableRow from "./TableRow";
import './styles/watchList.css';


const WatchList = React.memo(() => {
  let { watchList, setWatchList ,removeFromWatchList, genreids, isEmpty } = useContext(MovieContext);
  const [text, setText] = useState("");
  const [debouncedText, setDebouncedText] = useState(text);
  const [genreVal, setGenreVal] = useState(null);
  const [sortOpt, setSortOpt] = useState("Default");
  const [titleOrder, setTitleOrder] = useState(true);
  const [imdbOrder, setImdbOrder] = useState(false);
  const [popuOrder, setPopuOrder] = useState(false); 

  useEffect(() => {
    setWatchList(() => {
      const savedWatchList = JSON.parse(localStorage.getItem('watchList'));
      return !isEmpty(savedWatchList) ? new Map(savedWatchList) : new Map();
    })
  }, [])

  useEffect(() => {
		window.scrollTo(0, 0)
    document.title += " | Watchlist";
		return () => document.title = "Alpha Movies";
	}, [])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedText(text);
    }, 500); 

    return () => {
      clearTimeout(handler);
    };
  }, [text]); 

  const handleGenre = useCallback(e => {
    const ulChildren = e.currentTarget.children;
    for(let i = 1; i < ulChildren.length; i++) {
      ulChildren[i].firstChild.style.color = "white";
    }
    if(e.target.parentNode !== ulChildren[0]) {
      e.target.style.color = "red";
    }
  }, [])

  const handleSort = useCallback(e => {
    const ulChildren = e.currentTarget.children;
    const text = e.target.textContent || e.target.parentNode.textContent
    for(let i = 1; i < ulChildren.length; i++) {
      if(text === ulChildren[i].textContent) {
        ulChildren[i].style.color = "red";
      }
      else {
        ulChildren[i].style.color = "white";
      }
    }
  }, []);

  const handleSortClick = (callback, text) => sortOpt === text ? callback(prev => !prev) : setSortOpt(text);

  const getTbody = () => {
    if(watchList.size === 0) {
      return;
    }
    if(sortOpt === "Title") {
      const newWatchList = [...watchList.entries()];
      newWatchList.sort((a, b) => {
        let title1 = (a[1][0].title || a[1][0].name);
        let title2 = (b[1][0].title || b[1][0].name);            
        if(titleOrder) {
          return title1.localeCompare(title2);
        }
        return title2.localeCompare(title1);
      })
      watchList = new Map(newWatchList);
    }
    else if(sortOpt === "IMDB") {
      const newWatchList = [...watchList.entries()];
      newWatchList.sort((a, b) => {
        if(!imdbOrder) {
          return b[1][0].vote_average.toFixed(1) - a[1][0].vote_average.toFixed(1);
        }
        return a[1][0].vote_average.toFixed(1) - b[1][0].vote_average.toFixed(1);
      })
      watchList = new Map(newWatchList);
    }
    else if(sortOpt === "Popularity") {
      const newWatchList = [...watchList.entries()];
      newWatchList.sort((a, b) => {
        if(!popuOrder) {
          return b[1][0].popularity - a[1][0].popularity
        }
        return a[1][0].popularity - b[1][0].popularity;
      })
      watchList = new Map(newWatchList);
    }
    const iterator = watchList[Symbol.iterator]();
    const res = [];
    for (const [_, [movieObj, isMovie]] of iterator) {
      res.push(
        <TableRow
          key={movieObj.id}
          movieObj={movieObj}
          removeFromWatchList={removeFromWatchList}
          isMovie={isMovie}
          searchFlag={
            movieObj?.name?.toLowerCase().includes(debouncedText) ||
            movieObj?.title?.toLowerCase().includes(debouncedText)
          }
          genreFlag={
            genreVal === null || movieObj?.genre_ids?.some(id => genreids[id] === genreVal)
          }
        />
      );
    }
    return res;
  };

  return (
    <>
      <input
        className="mx-4 my-6"
        type="text"
        placeholder="Search watchlist..."
        id="watchlist-search-input"
        onChange={(e) => setText(e.target.value.toLowerCase())}
      />
      <div className="absolute top-[98px] text-white w-[100px] right-[300px] flex flex-col items-end">
        <div 
          className="flex gap-2 items-center hoverDiv cursor-pointer"
          onMouseEnter={(e) => {
            e.currentTarget.nextElementSibling.style.height = "298px";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.nextElementSibling.style.height = "0";
          }}
        >
          <span>Genre</span>
          <i className="fa-solid fa-angle-down mt-1"></i>
        </div>
        <ul 
          className="ul-Spl ulTag" 
          style={{height: "0"}}
          onMouseEnter={(e) => {
            e.currentTarget.style.height = "298px";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.height = "0";
          }}
          onClick={handleGenre}
        >
          <li key="all"><span style={{color: "gold"}} onClick={() => setGenreVal(null)}>All</span></li>
          {getGenreOptions(genreids, setGenreVal)}
        </ul>

      </div>
      <div className="text-white absolute top-[88px] right-[100px] p-[10px] flex flex-col items-end">
        <div 
          className="flex justify-center items-center hoverDiv gap-2 cursor-pointer"
          onMouseEnter={(e) => {
            e.currentTarget.nextElementSibling.style.height = "135px";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.nextElementSibling.style.height = "0";
          }}
        >
          <span>Sort by : {sortOpt}</span>
          <i className="fa-solid fa-angle-down mt-1"></i>
        </div>
        <ul 
          className="sort-ulTag ulTag my-[20px]"
          onClick={handleSort}
          style={{height: "0"}}
          onMouseEnter={(e) => {
            e.currentTarget.style.height = "135px";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.height = "0";
          }}
        >
          <li style={{color: "gold"}} onClick={() => setSortOpt("Default")}>Default</li>
          <li onClick={() => handleSortClick(setTitleOrder, "Title")}>
            Title
            <i className={`fa-solid fa-arrow-${titleOrder ? "up" : "down"}`}></i>
          </li>
          <li onClick={() => handleSortClick(setImdbOrder, "IMDB")}>
            IMDB
            <i className={`fa-solid fa-arrow-${imdbOrder ? "up" : "down"}`}></i>
          </li>
          <li onClick={() => handleSortClick(setPopuOrder, "Popularity")}>
            Popularity
            <i className={`fa-solid fa-arrow-${popuOrder ? "up" : "down"}`}></i>
          </li>
        </ul>
      </div>


      <table className="watch-list mb-10 -mt-5">
        <thead>
          <tr className="head">
            <th style={{ width: "50%" }}>Name</th>
            <th>IMDB</th>
            <th style={{ width: "15%" }}>Popularity</th>
            <th style={{ width: "35%" }}>Genre</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{getTbody()}</tbody>
      </table>
    </>
  );
});

export default WatchList;


function getGenreOptions(genreids, setGenreVal) { // useCallback
  const res = [];
  for(const key in genreids) {
    res.push (
      <li key={key}>
        <span
          onClick={() => setGenreVal(genreids[key])}
        >
          {genreids[key]}
        </span>
      </li>
    )
  }
  return res;
}