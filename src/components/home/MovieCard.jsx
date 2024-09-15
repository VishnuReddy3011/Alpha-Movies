import React from "react";
import './styles/movieCard.css';
import { Link } from "react-router-dom";

const MovieCard = React.memo(
  ({ movie, addToWatchList, watchList, removeFromWatchList, isMovie }) => {
    return (
      <Link to={`/movie/${movie?.id}-${(movie.title || movie.name).replaceAll(/\s/g,'-')}`}>
        <div
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.poster_path || movie.backdrop_path})`,
          }}
          className="bg-center bg-cover rounded-xl hover:scale-110 duration-300 cursor-pointer movie-card"
          onClick={(e) => {
            if(!e.target.classList.contains("watch-list-add")) {
              localStorage.setItem("singleMovie", JSON.stringify(movie));
              localStorage.setItem("isMovie", JSON.stringify(isMovie));
            }
          }}
        >
          <div className="absolute h-full w-full rounded-xl selection flex flex-col justify-between items-end ">
            {!watchList.has(movie.id) ? (
              <div
                className="watch-list m-[10%] flex justify-center h-[15%] w-[20%] items-center rounded-lg bg-gray-900/60"
                onClick={(e) => {
                  e.preventDefault();
                  addToWatchList(movie, isMovie);
                }}
              >
                <i className="fa-sharp fa-solid fa-plus text-white watch-list-add"></i>
              </div>
            ) : (
              <div
                className="watch-list m-[10%] flex justify-center h-[15%] w-[20%] items-center rounded-lg bg-gray-900/60"
                onClick={(e) => {
                  e.preventDefault();
                  removeFromWatchList(movie);
                }}
              >
                <i className="fa-solid fa-check text-white watch-list-add"></i>
              </div>
            )}
            {/* <div className="text-white w-full text-center p-2 bg-gray-900/70 rounded-b-xl title">
              {movie.title || movie.name}
            </div> */}
          </div>
        </div>
      </Link>
    );
  },
  (prevProps, nextProps) => prevProps.watchList.has(prevProps.movie.id) === nextProps.watchList.has(nextProps.movie.id)
);

export default MovieCard;