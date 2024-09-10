import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MovieContext } from "../MovieContextWrapper";
import './styles/watchList.css';

const TableRow = React.memo(({ movieObj, removeFromWatchList, isMovie, searchFlag, genreFlag }) => {
  if (!searchFlag || !genreFlag) return null;
  const { getGenres } = useContext(MovieContext);
  return (
    <tr key={movieObj.id} className="body">
      <td className="flex justify-start gap-2">
        <Link to={`/movie/${movieObj?.id}`}>
          <img
            src={`https://image.tmdb.org/t/p/original/${movieObj?.poster_path || movieObj?.background_path}`}
            alt={movieObj.title || movieObj.name}
            onClick={() => {
              localStorage.setItem("singleMovie", JSON.stringify(movieObj));
              localStorage.setItem("isMovie", JSON.stringify(isMovie));
            }}
          />
        </Link>
        <br />
        <div className="flex flex-col items-start text-start">
          <span className="font-bold">{movieObj.title || movieObj.name}</span>
          <p className="ellipsis w-[400px]">{movieObj?.overview}</p>
        </div>
      </td>
      <td>{movieObj.vote_average.toFixed(1)}</td>
      <td>{movieObj.popularity}</td>
      <td>{getGenres(movieObj.genre_ids || [])}</td>
      <td className="del">
        <span onClick={() => removeFromWatchList(movieObj)}>
          <i className="fa-solid fa-trash-can text-xl" style={{color: "#ff0000"}}></i>
        </span>
      </td>
    </tr>
  );
});

const WatchList = React.memo(() => {
  const { watchList, removeFromWatchList, genreids } = useContext(MovieContext);
  const [text, setText] = useState("");
  const [debouncedText, setDebouncedText] = useState(text);
  const [displayVal, setDisplayVal] = useState("0");
  const [genreVal, setGenreVal] = useState(null);
  const ulRef = useRef(null);

  const handleClick = (e) => {
    const ulElement = ulRef.current;
    if (ulElement) {
      const childNodes = ulElement.childNodes;
      for (let i = 0; i < childNodes.length; i++) {
        if(childNodes[i] === e.target.parentNode) {
          childNodes[i].style.color = "red";
        }
        else {
          childNodes[i].style.color = "white";
        }
      }
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedText(text);
    }, 500); // Debounce time in ms

    // Cleanup timeout if the effect is called again
    return () => {
      clearTimeout(handler);
    };
  }, [text]); // Only run the effect when `text` changes

  const [sortVal, setSortVal] = useState("0");
  const [sortOpt, setSortOpt] = useState("Default");
  const [titleOrder, setTitleOrder] = useState(true);
  const [imdbOrder, setImdbOrder] = useState(false);
  const [popuOrder, setPopuOrder] = useState(true); 

  return (
    <>
      <input
        className="mx-4 my-6"
        type="text"
        placeholder="Search watchlist..."
        id="watchlist-search-input"
        onChange={(e) => setText(e.target.value.toLowerCase())}
      />
      <div className="absolute top-[98px] right-[300px] text-white w-[700px] h-[390px] flex flex-col items-end">
        <div 
          className="flex gap-2 items-center hoverDiv cursor-pointer"
          onMouseEnter={() => setDisplayVal("100%")}
          onMouseLeave={() => setDisplayVal("0")}
        >
          <span>Genre</span>
          <i className="fa-solid fa-angle-down mt-1"></i>
        </div>
        <div
          className="w-full ulTag flex pl-12 my-[20px]"
          style={{height: `${displayVal}`}}
          onMouseEnter={() => setDisplayVal("100%")}
          onMouseLeave={() => setDisplayVal("0")}
        >
          <ul 
            className="ul-Spl"
            ref={ulRef}
            onClick={handleClick}
          >
            <li><span style={{color: "gold"}} onClick={() => setGenreVal(null)}>All</span></li>
            {getGenreOptions(genreids, setGenreVal)}
          </ul>
        </div>
      </div>
      <div className="text-white absolute top-[88px] right-[100px] p-[10px] h-[220px] flex flex-col items-end">
        <div 
          className="flex justify-center items-center hoverDiv gap-2 cursor-pointer"
          onMouseEnter={() => setSortVal("100%")}
          onMouseLeave={() => setSortVal("0")}
        >
          <span>Sort by : {sortOpt}</span>
          <i className="fa-solid fa-angle-down mt-1"></i>
        </div>
        <div 
          className="w-[120px] ulTag flex my-[20px]"
          style={{height: `${sortVal}`}}
          onMouseEnter={() => setSortVal("100%")}
          onMouseLeave={() => setSortVal("0")}
        >
          <ul 
            className="cursor-pointer sort-ulTag"
            onClick={e => {
              const children = e.currentTarget.childNodes;
              for(let i = 0; i < children.length; i++) {
                if(i == 0) {
                  children[i].style.color = "gold";
                }
                else {
                  children[i].style.color = "white";
                }
              }
              let prevOpt = sortOpt;
              let sortText = e.target.textContent || e.target.parentNode.firstChild.textContent;
              let parent = e.target.parentNode;
              if(sortText === "Title") {
                if(prevOpt === sortText) {
                  setTitleOrder(prev => !prev);
                }
              }
              else if(sortText === "IMDB") {
                if(prevOpt === sortText) {
                  setImdbOrder(prev => !prev);
                }
              }
              else if(sortText === "Popularity") {
                if(prevOpt === sortText) {
                  setPopuOrder(prev => !prev);
                }
              }
              setSortOpt(sortText);
              parent.style.color = "red";
            }}
          >
            <li style={{color: "gold"}}>Default</li>
            <li>
              <span>Title</span>
              {
                titleOrder
                  ?
                <i className="fa-solid fa-arrow-up ml-1"></i>
                  :
                <i className="fa-solid fa-arrow-down ml-1"></i>
              }
            </li>
            <li>
              <span>IMDB</span>
              {
                imdbOrder
                  ?
                <i className="fa-solid fa-arrow-up ml-1"></i>
                  :
                <i className="fa-solid fa-arrow-down ml-1"></i>
              }
            </li>
            <li>
              <span>Popularity</span>
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
        <tbody>{getTbody(watchList, removeFromWatchList, debouncedText, genreVal, genreids, sortOpt, titleOrder, imdbOrder)}</tbody>
      </table>
    </>
  );
});

export default WatchList;

function getTbody(watchList, removeFromWatchList, text, genreVal, genreids, sortOpt, titleOrder, imdbOrder) { // useCallback
  // watchList = new Map([...watchList.entries()].sort((a, b) => a[1][0].vote_average.toFixed(1) - b[1][0].vote_average.toFixed(1)))
  if(sortOpt !== "Default") {
    if(sortOpt === "Title") {
      watchList = new Map(
        [...watchList.entries()].sort(
          (a, b) => {
            let title1 = (a[1][0].title || a[1][0].name);
            let title2 = (b[1][0].title || b[1][0].name);            
            if(titleOrder) {
              return title1.localeCompare(title2);
            }
            return title2.localeCompare(title1);
          }
        )
      )
    }
    else if(sortOpt === "IMDB") {
      watchList = new Map([...watchList.entries()].sort((a, b) => {
        if(imdbOrder) {
          return b[1][0].vote_average.toFixed(1) - a[1][0].vote_average.toFixed(1)
        }
        return a[1][0].vote_average.toFixed(1) - b[1][0].vote_average.toFixed(1);
      }));
    }
  }
  const iterator = watchList[Symbol.iterator]();
  const res = [];
  for (const [_, [movieObj, isMovie]] of iterator) {
    const searchFlag = useMemo(() => movieObj?.name?.toLowerCase().includes(text) || movieObj?.title?.toLowerCase().includes(text), [text, movieObj]);
    const genreFlag = useMemo(() => genreVal === null || movieObj?.genre_ids?.some(id => genreids[id] === genreVal), [genreVal, genreids, movieObj]);

    res.push(
      <TableRow
        key={movieObj.id}
        movieObj={movieObj}
        removeFromWatchList={removeFromWatchList}
        isMovie={isMovie}
        searchFlag={searchFlag}
        genreFlag={genreFlag}

      />
    );
  }
  return res;
}

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