import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Loader from '../Loader/Loader';
import { MovieContext } from '../MovieContextWrapper';
import MovieCard from './home/MovieCard';
import Pagination from './home/Pagination';
const URL_PREFIX = "https://api.themoviedb.org/3/";
const API_KEY = "bba723222ce35673cae76bc15ffb91c1";

const SearchPageComponent = React.memo(({result}) => {
  const [finalResults, setFinalResults] = useState([]);
  const [movieResultsLoader, setMovieResultsLoader] = useState(true);
  const {watchList, addToWatchList, removeFromWatchList} = useContext(MovieContext);

  useEffect(() => {
    const fetchMoviesAndTV = async () => {
      try {
        const movieResponse = await axios.get(`${URL_PREFIX}search/movie?query=${result}&api_key=${API_KEY}`);
        const tvResponse = await axios.get(`${URL_PREFIX}search/tv?query=${result}&api_key=${API_KEY}`);
        
        const movieResults = movieResponse?.data?.results.map(movie => ({ ...movie, isMovie: true })) || [];
        const tvResults = tvResponse?.data?.results.map(tv => ({ ...tv, isMovie: false })) || [];
  
        const combinedResults = [...movieResults, ...tvResults];
        
        setFinalResults(combinedResults.sort((a, b) => b?.popularity - a?.popularity));
      } catch (error) {
        console.log(error);
      } finally {
        setMovieResultsLoader(false);
      }
    };
  
    fetchMoviesAndTV();
  }, [result]);
  

  if(movieResultsLoader) return <div className="text-white text-4xl h-screen w-screen flex justify-center items-center"><Loader /></div>
  return (
    <div>
      <div className='h-16 p-4 text-3xl mb-4 text-white drop-shadow'>{finalResults.length ? 'Search results' : 'No results available'} for: "{result}"</div>
      <div className='w-full flex flex-wrap gap-16 justify-start ml-9'>
        {
          finalResults.map(movie => {
            return (
                <MovieCard
                  movie={movie}
                  key={movie.id}
                  addToWatchList={addToWatchList}
                  removeFromWatchList={removeFromWatchList}
                  watchList={watchList}
                  isMovie={movie.isMovie}
                />
              );
          })
        }
      </div>
    </div>
  )
})
const MoviesPageComponent = React.memo(({type, flag}) => {
  const [typeMovies, setTypeMovies] = useState([]);
  const [typeLoader, setTypeLoader] = useState(true);
  const {watchList, addToWatchList, removeFromWatchList} = useContext(MovieContext);
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [type])
  useEffect(() => {
    const fetchMoviesAndTV = async () => {
      try {
        const movieResponse = await axios.get(`${URL_PREFIX}${flag ? "tv" : "movie"}/${type.toLowerCase().split(" ").join("_")}?api_key=${API_KEY}&language=en-US&page=${page}`);
        setTypeMovies(movieResponse?.data?.results);
      } catch (error) {
        console.log(error);
      } finally {
        setTypeLoader(false);
      }
    };
    fetchMoviesAndTV();
  }, [type, page, flag])

  const handleNext = useCallback(setPage => setPage(prev => prev+1), []);
	const handlePrevious = useCallback(setPage => setPage(prev => prev > 1 ? prev-1 : prev), []);
  if(typeLoader) return <div className="text-white text-4xl h-screen w-screen flex justify-center items-center"><Loader /></div>
  return (
    <div className='w-full'>
      <div className='h-16 p-4 text-3xl mb-4 ml-4 text-white drop-shadow flex items-center gap-2'>
        {type}
        <i className="fa-duotone fa-solid fa-angles-right text-2xl mt-[5px]"></i>
      </div>
      <div className='flex flex-wrap gap-16 justify-start ml-9'>
        {
          typeMovies.map(movie => {
            return (
                <MovieCard
                  movie={movie}
                  key={movie.id}
                  addToWatchList={addToWatchList}
                  removeFromWatchList={removeFromWatchList}
                  watchList={watchList}
                  isMovie={!flag}
                />
              );
          })
        }
      </div>
      <div className='w-full flex justify-center'>
        <Pagination
            pageNo={page}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            setPageNo={setPage}
          />
      </div>
    </div>
  )
})

const MoviesComp = React.memo(() => {
  const {searchText, movieType, isTV} = useContext(MovieContext);
  return (
    <div className='mb-10'>
      {
        searchText 
          ?
        <SearchPageComponent result={searchText}/>
          :
        <MoviesPageComponent type={movieType || "Popular"} flag={isTV}/>
      }
    </div>
  )
})

export default MoviesComp




