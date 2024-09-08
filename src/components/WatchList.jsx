import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MovieContext } from "../MovieContextWrapper";
import './styles/watchList.css';

const TableRow = React.memo(({ movieObj, removeFromWatchList, isMovie, searchFlag, genreFlag }) => {
  if (!searchFlag || !genreFlag) return null;
  const { getGenres } = useContext(MovieContext);
  return (
    <tr key={movieObj.id} className="body">
      <td className="flex flex-col items-center">
        <Link to={`/movie/${movieObj?.id}`}>
          <img
            src={`https://image.tmdb.org/t/p/original/${movieObj?.backdrop_path || movieObj?.poster_path}`}
            alt={movieObj.title || movieObj.name}
            onClick={() => {
              localStorage.setItem("singleMovie", JSON.stringify(movieObj));
              localStorage.setItem("isMovie", JSON.stringify(isMovie));
            }}
          />
        </Link>
        <br />
        <span>{movieObj.title || movieObj.name}</span>
      </td>
      <td>{movieObj.vote_average.toFixed(1)}</td>
      <td>{movieObj.popularity}</td>
      <td>{getGenres(movieObj.genre_ids)}</td>
      <td className="del">
        <span className="btn-ani" onClick={() => removeFromWatchList(movieObj)}>Remove</span>
      </td>
    </tr>
  );
});

const WatchList = () => {
  const { watchList, removeFromWatchList, genreids } = useContext(MovieContext);
  const [text, setText] = useState("");
  const [debouncedText, setDebouncedText] = useState(text);
  const [displayVal, setDisplayVal] = useState("0");
  const [genreVal, setGenreVal] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedText(text);
    }, 500); // Debounce time in ms

    // Cleanup timeout if the effect is called again
    return () => {
      clearTimeout(handler);
    };
  }, [text]); // Only run the effect when `text` changes

  return (
    <>
      <input
        className="mx-4 my-6"
        type="text"
        placeholder="Search watchlist..."
        id="watchlist-search-input"
        onChange={(e) => setText(e.target.value.toLowerCase())}
      />
      <div className="absolute top-24 text-white right-[300px] w-[500px] h-[360px] flex flex-col items-end">
        <div 
          className="flex gap-2 items-center hoverDiv m-2 cursor-pointer"
          onMouseEnter={() => setDisplayVal("100%")}
          onMouseLeave={() => setDisplayVal("0")}
        >
          <span>Genre</span>
          <i className="fa-solid fa-angle-down mt-1"></i>
        </div>
        <div
          className="w-full ulTag flex items-center justify-center"
          style={{height: `${displayVal}`}}
          onMouseEnter={() => setDisplayVal("100%")}
          onMouseLeave={() => setDisplayVal("0")}
        >
          <ul>
            <li><span onClick={() => setGenreVal(null)}>All</span></li>
            {getGenreOptions(watchList, genreids, setGenreVal)}
          </ul>
        </div>
      </div>
      <table className="watch-list mb-10 -mt-5">
        <thead>
          <tr className="head">
            <th style={{ width: "40%" }}>Name</th>
            <th>IMDB</th>
            <th style={{ width: "15%" }}>Popularity</th>
            <th style={{ width: "25%" }}>Genre</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{getTbody(watchList, removeFromWatchList, debouncedText, genreVal, genreids)}</tbody>
      </table>
    </>
  );
};

export default WatchList;

function getTbody(watchList, removeFromWatchList, text, genreVal, genreids) { // useCallback
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
          movieObj?.name?.toLowerCase().includes(text) ||
          movieObj?.title?.toLowerCase().includes(text)
        }
        genreFlag={
          genreVal === null || movieObj?.genre_ids?.some(id => genreids[id] === genreVal)
        }

      />
    );
  }
  return res;
}

function getGenreOptions(watchList, genreids, setGenreVal) { // useCallback
  const iterator = watchList[Symbol.iterator]();
  const genreSet = new Set();
  for (const [_, [movieObj, isMovie]] of iterator) {
    for (const id of movieObj?.genre_ids) {
      genreSet.add(genreids[id]);
    }
  }
  return [...genreSet].map((item, idx) => {
    return (
      <li key={idx}>
        <span
          onClick={() => setGenreVal(item)}
        >
          {item}
        </span>
      </li>
    )
  })
}