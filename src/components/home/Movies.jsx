import React, { useContext } from "react";
import { MovieContext } from "../../MovieContextWrapper";
import MovieCard from "./MovieCard";
import Pagination from "./Pagination";
import Loader from "../../Loader/Loader";


const Movies = React.memo(({movies, pageNo, handleNext, handlePrevious, setPageNo, title, isMovie, loader}) => {
  const { watchList, addToWatchList, removeFromWatchList } = useContext(MovieContext);
  return (
    <div>
      {title && (<div className="text-white text-3xl font-bold text-center m-5 my-10">{title}</div>)}
      {
        loader ? (<div className="text-white text-4xl h-[600px] w-full flex justify-center items-center"><Loader /></div>)
          :
        (<div className="flex flex-wrap gap-16 justify-start ml-9">
          {
            movies.map((movieObj) => {
              return (
                <MovieCard
                  movie={movieObj}
                  key={movieObj.id}
                  addToWatchList={addToWatchList}
                  removeFromWatchList={removeFromWatchList}
                  watchList={watchList}
                  isMovie={isMovie !== undefined ? isMovie : movieObj?.isMovie}
                />
              );
            })
          }
        </div>)
      }
      {
        pageNo
          &&
        (
          <Pagination
            pageNo={pageNo}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            setPageNo={setPageNo}
          />
        )
      }
    </div>
  );
});

export default Movies;