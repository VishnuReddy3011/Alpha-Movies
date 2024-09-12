import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Loader from '../Loader/Loader';
import { MovieContext } from '../MovieContextWrapper';
import Movies from './home/Movies';
const URL_PREFIX = "https://api.themoviedb.org/3/";
const API_KEY = "bba723222ce35673cae76bc15ffb91c1";

const SearchList = React.memo(() => {
  const [finalResults, setFinalResults] = useState([]);
  const [movieResultsLoader, setMovieResultsLoader] = useState(true);
  const {searchText} = useContext(MovieContext);

  useEffect(() => {
    const fetchMoviesAndTV = async () => {
      try {
        const movieResponse = await axios.get(`${URL_PREFIX}search/movie?query=${searchText}&api_key=${API_KEY}`);
        const tvResponse = await axios.get(`${URL_PREFIX}search/tv?query=${searchText}&api_key=${API_KEY}`);
        
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
  }, [searchText]);
  

  if(movieResultsLoader) return <div className="text-white text-4xl h-screen w-screen flex justify-center items-center"><Loader /></div>
  return (
    <div>
      <div className='h-16 p-4 text-3xl mb-4 text-white drop-shadow'>{finalResults.length ? 'Search results' : 'No results available'} for: "{searchText}"</div>
      <Movies movies={finalResults}/>
    </div>
  )
})

export default SearchList;