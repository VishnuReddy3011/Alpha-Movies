import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { MovieContext } from "../MovieContextWrapper";

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
          <div className="flex flex-col items-start gap-2 text-start">
            <span className="font-bold">{movieObj.title || movieObj.name}</span>
            <p className="ellipsis w-[400px]">{movieObj?.overview}</p>
          </div>
        </td>
        <td>{movieObj.vote_average.toFixed(1)}</td>
        <td>{movieObj.popularity}</td>
        <td>{getGenres(movieObj.genre_ids)}</td>
        <td className="del">
          <span onClick={() => removeFromWatchList(movieObj)}>
            <i className="fa-solid fa-trash-can text-xl" style={{color: "#ff0000"}}></i>
          </span>
        </td>
      </tr>
    );
  });

export default TableRow;
