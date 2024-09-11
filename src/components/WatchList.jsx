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
  const [popuOrder, setPopuOrder] = useState(true); 

  useEffect(() => {
    setWatchList(() => {
      const savedWatchList = JSON.parse(localStorage.getItem('watchList'));
      return !isEmpty(savedWatchList) ? new Map(savedWatchList) : new Map();
    })
  }, [])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedText(text);
    }, 500); // Debounce time in ms

    // Cleanup timeout if the effect is called again
    return () => {
      clearTimeout(handler);
    };
  }, [text]); // Only run the effect when `text` changes

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
    // console.log(e.currentTarget);
    const ulChildren = e.currentTarget.children;
    // console.log(ulChildren);
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

  const getTbody = () => {
    // watchlist sort methods
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
        if(popuOrder) {
          return b[1][0].popularity - a[1][0].popularity
        }
        return a[1][0].popularity - b[1][0].popularity;
      })
      watchList = new Map(newWatchList);
    }
    // console.log(sortOpt);
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
      <div className="absolute top-[98px] text-white right-[300px] w-[700px] h-[395px] flex flex-col items-end">
        <div 
          className="flex gap-2 items-center hoverDiv cursor-pointer"
          onMouseEnter={(e) => {
            e.currentTarget.nextElementSibling.style.height = "100%";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.nextElementSibling.style.height = "0";
          }}
        >
          <span>Genre</span>
          <i className="fa-solid fa-angle-down mt-1"></i>
        </div>
        <div
          className="w-full ulTag pl-12 my-[20px]"
          style={{height: "0"}}
          onMouseEnter={(e) => {
            e.currentTarget.style.height = "100%";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.height = "0";
          }}
        >
          <ul className="ul-Spl" onClick={handleGenre}>
            <li key="all"><span style={{color: "gold"}} onClick={() => setGenreVal(null)}>All</span></li>
            {getGenreOptions(genreids, setGenreVal)}
          </ul>
        </div>
      </div>
      <div className="text-white absolute top-[88px] right-[100px] p-[10px] h-[220px] flex flex-col items-end">
        <div 
          className="flex justify-center items-center hoverDiv gap-2 cursor-pointer"
          onMouseEnter={(e) => {
            e.currentTarget.nextElementSibling.style.height = "100%";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.nextElementSibling.style.height = "0";
          }}
        >
          <span>Sort by : {sortOpt}</span>
          <i className="fa-solid fa-angle-down mt-1"></i>
        </div>
        <div 
          className="w-[120px] ulTag my-[20px]"
          style={{height: "0"}}
          onMouseEnter={(e) => {
            e.currentTarget.style.height = "100%";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.height = "0";
          }}
        >
          <ul 
            className="cursor-pointer sort-ulTag -mx-3 w-full"
            onClick={handleSort}
          >
            <li style={{color: "gold"}} onClick={() => setSortOpt("Default")}>Default</li>
            <li
              onClick={() => {
                if(sortOpt === "Title") {
                  setTitleOrder(!titleOrder);
                }
                else {
                  setSortOpt("Title");
                }
              }}
              className="flex justify-between items-center"
            >
              Title
              {
                titleOrder
                  ?
                <i className="fa-solid fa-arrow-up ml-1"></i>
                  :
                <i className="fa-solid fa-arrow-down ml-1"></i>
              }
            </li>
            <li
              onClick={() => {
                if(sortOpt === "IMDB") {
                  setImdbOrder(!imdbOrder);
                }
                else {
                  setSortOpt("IMDB");
                }
              }}
              className="flex justify-between items-center"
            >
              IMDB
              {
                imdbOrder
                  ?
                <i className="fa-solid fa-arrow-up ml-1"></i>
                  :
                <i className="fa-solid fa-arrow-down ml-1"></i>
              }
            </li>
            <li
              onClick={() => {
                if(sortOpt === "Popularity") {
                  setPopuOrder(!popuOrder);
                }
                else {
                  setSortOpt("Popularity");
                }
              }}
              className="flex justify-between items-center"
            >
              Popularity
              {
                popuOrder
                  ?
                <i className="fa-solid fa-arrow-up ml-1"></i>
                  :
                <i className="fa-solid fa-arrow-down ml-1"></i>
              }
            </li>
          </ul>
        </div>
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