import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Movies from './home/Movies';

const GenreList = React.memo(() => {
	const {id} = useParams();
	
	const [genMovies, setGenMovies] = useState([]);
	const [genMvLoader, setGenMvLoader] = useState(true);
	const [genMvPage, setGenMvPage] = useState(1);

	const [genTv, setGenTv] = useState([]);
	const [genTvLoader, setGenTvLoader] = useState(true);
	const [genTvPage, setGenTvPage] = useState(1);

	const URL_PREFIX = "https://api.themoviedb.org/3/";
	const API_KEY = "bba723222ce35673cae76bc15ffb91c1";

	useEffect(() => {
		setGenMvLoader(true)
		axios.get(`${URL_PREFIX}discover/movie?api_key=${API_KEY}&language=en-US&page=${genMvPage}&sort_by=popularity.desc&with_genres=${id}`)
		.then(response => setGenMovies(response?.data?.results))
		.then(() => setGenMvLoader(false));
	}, [genMvPage, id]);

	useEffect(() => {
		setGenTvLoader(true);
		axios.get(`${URL_PREFIX}discover/tv?api_key=${API_KEY}&language=en-US&page=${genTvPage}&sort_by=popularity.desc&with_genres=${id}`)
		.then(response => setGenTv(response?.data?.results))
		.then(() => setGenTvLoader(false));
	}, [genTvPage, id]);

	const handleNext = useCallback(setPageNo => setPageNo(prev => prev+1), []);
	const handlePrevious = useCallback(setPageNo => setPageNo(prev => prev > 1 ? prev-1 : prev), []);

  return (
    <div className='text-white'>
			<div className="mvs">
				{genMovies.length > 0 &&
					<>
						<div className='h-16 p-4 text-3xl mb-4 ml-4 text-white drop-shadow flex items-center gap-2'>
							Genre results in Movies
							<i className="fa-duotone fa-solid fa-angles-right text-2xl mt-[5px]"></i>
						</div>
						<Movies 
							movies={genMovies}
							pageNo={genMvPage}
							handleNext={handleNext}
							handlePrevious={handlePrevious}
							setPageNo={setGenMvPage}
							isMovie={true}
							loader={genMvLoader}
						/>
					</>
				}
			</div>
			<div className="tvs">
				{genTv.length > 0 &&
					<>
						<div className='h-16 p-4 text-3xl mb-4 ml-4 text-white drop-shadow flex items-center gap-2'>
							Genre results in TV Shows
							<i className="fa-duotone fa-solid fa-angles-right text-2xl mt-[5px]"></i>
						</div>
						<Movies 
							movies={genTv}
							pageNo={genTvPage}
							handleNext={handleNext}
							handlePrevious={handlePrevious}
							setPageNo={setGenTvPage}
							isMovie={false}
							loader={genTvLoader}
						/>
					</>
				}
			</div>
    </div>
  )
});
export default GenreList
