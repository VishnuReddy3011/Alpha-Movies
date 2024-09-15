import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Movies from './home/Movies';

const CountryList = React.memo(() => {
  const {id} = useParams();
  
  const [conMovies, setConMovies] = useState([]);
  const [conMvLoader, setConMvLoader] = useState(true);
  const [conMvPage, setConMvPage] = useState(1);

  const [conTv, setConTv] = useState([]);
  const [conTvLoader, setConTvLoader] = useState(true);
  const [conTvPage, setConTvPage] = useState(1);

  const URL_PREFIX = "https://api.themoviedb.org/3/";
  const API_KEY = "bba723222ce35673cae76bc15ffb91c1";

  useEffect(() => {
    setConMvLoader(true)
    axios.get(`${URL_PREFIX}discover/movie?api_key=${API_KEY}&language=en-US&page=${conMvPage}&sort_by=popularity.desc&with_origin_country=${id}`)
    .then(response => setConMovies(response?.data?.results))
    .then(() => setConMvLoader(false));
  }, [conMvPage, id]);

  useEffect(() => {
    setConTvLoader(true);
    axios.get(`${URL_PREFIX}discover/tv?api_key=${API_KEY}&language=en-US&page=${conTvPage}&sort_by=popularity.desc&with_origin_country=${id}`)
    .then(response => setConTv(response?.data?.results))
    .then(() => setConTvLoader(false));
  }, [conTvPage, id]);

  const handleNext = useCallback(setPageNo => setPageNo(prev => prev+1), []);
  const handlePrevious = useCallback(setPageNo => setPageNo(prev => prev > 1 ? prev-1 : prev), []);

  return (
    <div className='text-white'>
      <div className="mvs">
        {conMovies.length > 0 &&
          <>
            <div className='h-16 p-4 text-3xl mb-4 ml-4 text-white drop-shadow flex items-center gap-2'>
              Country results in Movies
              <i className="fa-duotone fa-solid fa-angles-right text-2xl mt-[5px]"></i>
            </div>
            <Movies 
              movies={conMovies}
              pageNo={conMvPage}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
              setPageNo={setConMvPage}
              isMovie={true}
              loader={conMvLoader}
            />
          </>
        }
      </div>
      <div className="tvs">
        {conTv.length > 0 &&
          <>
            <div className='h-16 p-4 text-3xl mb-4 ml-4 text-white drop-shadow flex items-center gap-2'>
              Country results in TV Shows
              <i className="fa-duotone fa-solid fa-angles-right text-2xl mt-[5px]"></i>
            </div>
            <Movies 
              movies={conTv}
              pageNo={conTvPage}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
              setPageNo={setConTvPage}
              isMovie={false}
              loader={conTvLoader}
            />
          </>
        }
      </div>
    </div>
  )
});

export default CountryList
