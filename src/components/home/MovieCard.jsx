import React from "react";
import './styles/movieCard.css';
import { Link } from "react-router-dom";

const MovieCard = React.memo(
  ({ movie, addToWatchList, watchList, removeFromWatchList, isMovie }) => {
    return (
      <Link to={`/movie/${movie?.id}`}>
        <div
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie["poster_path"]})`,
          }}
          className="h-[40vh] md:w-[200px] bg-center bg-cover rounded-xl hover:scale-110 duration-300 hover:cursor-pointer movie-card"
          onClick={(e) => {
            if(!e.target.classList.contains("watch-list-add")) {
              localStorage.setItem("singleMovie", JSON.stringify(movie));
              localStorage.setItem("isMovie", JSON.stringify(isMovie));
            }
          }}
          onMouseEnter={e => {
            e.currentTarget.style.zIndex = "1";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.zIndex = "0";
          }}
        >
          <div className="absolute h-full w-full rounded-xl selection flex flex-col justify-between items-end ">
            {!watchList.has(movie.id) ? (
              <div
                className="watch-list-add m-4 flex justify-center h-8 w-8 items-center rounded-lg bg-gray-900/60"
                onClick={(e) => {
                  e.preventDefault();
                  // console.log(isMovie);
                  addToWatchList(movie, isMovie);
                }}
              >
                <i className="fa-sharp fa-solid fa-plus text-white watch-list-add"></i>
              </div>
            ) : (
              <div
                className="watch-list m-4 flex justify-center h-8 w-8 items-center rounded-lg bg-gray-900/60"
                onClick={(e) => {
                  e.preventDefault();
                  removeFromWatchList(movie);
                }}
              >
                <i className="fa-solid fa-check text-white"></i>
              </div>
            )}
            <div className="text-white w-full text-center text-xl p-2 bg-gray-900/70 rounded-b-xl title">
              {movie.title || movie.name}
            </div>
          </div>
        </div>
      </Link>
    );
  },
  (prevProps, nextProps) => prevProps.watchList.has(prevProps.movie.id) === nextProps.watchList.has(nextProps.movie.id)
);

export default MovieCard;