import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Loader from '../Loader/Loader';
import { MovieContext } from '../MovieContextWrapper';
import Movies from './home/Movies';
const URL_PREFIX = "https://api.themoviedb.org/3/";
const API_KEY = "bba723222ce35673cae76bc15ffb91c1";

const MoviesComp = React.memo(() => {
  const { movieType, isTV} = useContext(MovieContext);
  const [typeMovies, setTypeMovies] = useState([]);
  const [typeLoader, setTypeLoader] = useState(true);
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [movieType])
  useEffect(() => {
    const fetchMoviesAndTV = async () => {
      try {
        const movieResponse = await axios.get(`${URL_PREFIX}${isTV ? "tv" : "movie"}/${movieType.toLowerCase().split(" ").join("_") || "popular"}?api_key=${API_KEY}&sort_by=popularity.desc&language=en-US&page=${page}`);
        const upRes = await axios.get(`${URL_PREFIX}discover/movie?api_key=${API_KEY}&primary_release_date.gte=${new Date().toISOString().substring(0,10)}&sort_by=popularity.desc&language=en-US&page=${page}`);
        if(movieType === "Upcoming") {
          // console.log(upRes.data.results);
          setTypeMovies(upRes?.data?.results);
        }
        else {
          setTypeMovies(movieResponse?.data?.results);
        }
        
      } catch (error) {
        console.log(error);
      } finally {
        setTypeLoader(false);
      }
    };
    fetchMoviesAndTV();
  }, [movieType, page, isTV])

  if(movieType === "Upcoming") {
    console.log(typeMovies);
  }

  const handleNext = useCallback(setPage => setPage(prev => prev+1), []);
	const handlePrevious = useCallback(setPage => setPage(prev => prev > 1 ? prev-1 : prev), []);
  if(typeLoader) return <div className="text-white text-4xl h-screen w-screen flex justify-center items-center"><Loader /></div>
  return (
    <div className='w-full mb-10'>
      <div className='h-16 p-4 text-3xl mb-4 ml-4 text-white drop-shadow flex items-center gap-2'>
        {movieType || "Popular"}
        <i className="fa-duotone fa-solid fa-angles-right text-2xl mt-[5px]"></i>
      </div>
      <Movies 
        movies={typeMovies} 
        pageNo={page} 
        handleNext={handleNext} 
        handlePrevious={handlePrevious} 
        setPageNo={setPage}
        isMovie={!isTV}
      />
    </div>
  )
})

export default MoviesComp
