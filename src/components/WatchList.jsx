import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MovieContext } from "../MovieContextWrapper";
import './styles/watchList.css';

const TableRow = React.memo(({ movieObj, removeFromWatchList, isMovie, flag }) => {
  if (!flag) return null;
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
        <span onClick={() => removeFromWatchList(movieObj)}>Remove</span>
      </td>
    </tr>
  );
});

const WatchList = () => {
  const { watchList, removeFromWatchList } = useContext(MovieContext);
  const [text, setText] = useState("");
  const [debouncedText, setDebouncedText] = useState(text);

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
      <div className="header h-[100px] flex p-8 text-white">
        <input
          type="text"
          placeholder="Search watchlist..."
          id="watchlist-search-input"
          onChange={(e) => setText(e.target.value.toLowerCase())}
        />
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
        <tbody>{getTbody(watchList, removeFromWatchList, debouncedText)}</tbody>
      </table>
    </>
  );
};

export default WatchList;

function getTbody(watchList, removeFromWatchList, text) {
  const iterator = watchList[Symbol.iterator]();
  const res = [];
  for (const [_, [movieObj, isMovie]] of iterator) {
    res.push(
      <TableRow
        key={movieObj.id}
        movieObj={movieObj}
        removeFromWatchList={removeFromWatchList}
        isMovie={isMovie}
        flag={
          movieObj?.name?.toLowerCase().includes(text) ||
          movieObj?.title?.toLowerCase().includes(text)
        }
      />
    );
  }
  return res;
}
