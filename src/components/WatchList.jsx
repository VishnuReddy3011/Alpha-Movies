import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { MovieContext } from "../MovieContextWrapper";
import './styles/watchList.css';

const WatchList = () => {
  const {watchList, removeFromWatchList} = useContext(MovieContext);
  return (
    <>
      <div className="header h-[100px] flex p-8 text-white">
        <input 
          type="text" 
          placeholder="Search watchlist..." 
          id="watchlist-search-input"
        />
      </div>
      <table className="watch-list mb-10">
        <thead>
          <tr className="head">
            <th style={{width: "40%"}}>Name</th>
            <th>IMDB</th>
            <th style={{width: "15%"}}>Popularity</th>
            <th style={{width: "25%"}}>Genre</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            getTbody(watchList, removeFromWatchList)
          }
        </tbody>
      </table>
    </>
  );
};

export default WatchList;

function getTbody(watchList, removeFromWatchList) {
  const {getGenres} = useContext(MovieContext);
  const res = [];
  for(const [id, [movieObj, isMovie]] of watchList.entries()) {
    res.push(
      <tr key={id} className="body">
        <td className="flex flex-col items-center">
          <Link to={`/movie/${movieObj?.id}`}>
            <img
              src={`https://image.tmdb.org/t/p/original/${movieObj.backdrop_path}`}
              alt={movieObj.title || movieObj.name}
              onClick={() => {
                localStorage.setItem("singleMovie", JSON.stringify(movieObj));
                localStorage.setItem("isMovie", JSON.stringify(isMovie));
              }}
            />
          </Link>
          <br />
          <span>{movieObj.title  || movieObj.name}</span>
        </td>
        <td>{movieObj.vote_average.toFixed(1)}</td>
        <td>{movieObj.popularity}</td>
        <td>{getGenres(movieObj.genre_ids)}</td>
        <td className="del">
          <span onClick={() => removeFromWatchList(movieObj)}>Remove</span>
        </td>
      </tr>
    )
  }
  return res;
}