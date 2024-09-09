import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
// import Movies from '';
const Movies = React.lazy(() => import("./Movies"));

const MoviesAll = React.memo(() => {
	const [trendingMovies, setTrendingMovies] = useState([]);
	const [trendingPageNo, setTrendingPageNo] = useState(() =>  JSON.parse(localStorage.getItem("trendingPageNo")) || 1);
	const [trendingLoader, setTrendingLoader] = useState(true);

	const [popularMovies, setPopularMovies] = useState([]);
	const [popularPageNo, setPopularPageNo] = useState(() =>  JSON.parse(localStorage.getItem("popularPageNo")) || 1);
	const [popularLoader, setPopularLoader] = useState(true);
	
	const [popularTVseries, setPopularTVseries] = useState([]);
	const [tvSeriesPageNo, setTvSeriesPageNo] = useState(() =>  JSON.parse(localStorage.getItem("tvSeriesPageNo")) || 1);
	const [tvLoader, setTVloader] = useState(true);

	const URL_PREFIX = "https://api.themoviedb.org/3/";
	const API_KEY = "bba723222ce35673cae76bc15ffb91c1";
	useEffect(() => {
		axios
			.get(`${URL_PREFIX}trending/movie/day?api_key=${API_KEY}&language=en-US&page=${trendingPageNo}`)
			.then(response => setTrendingMovies(response?.data?.results))
			.then(() => setTrendingLoader(false));		
	}, [trendingPageNo]);
	useEffect(() => {
		axios
			.get(`${URL_PREFIX}movie/popular?api_key=${API_KEY}&language=en-US&page=${popularPageNo}`)
			.then(response => setPopularMovies(response?.data?.results))
			.then(() => setPopularLoader(false));	
	}, [popularPageNo]);
	useEffect(() => {
		axios
			.get(`${URL_PREFIX}discover/tv?api_key=${API_KEY}&include_null_first_air_dates=false&language=en-US&page=${tvSeriesPageNo}&sort_by=popularity.desc`)
			.then(response => setPopularTVseries(response?.data?.results))
			.then(() => setTVloader(false));	
	}, [tvSeriesPageNo]);

	useEffect(() => localStorage.setItem("trendingPageNo", JSON.stringify(trendingPageNo)), [trendingPageNo]);
	useEffect(() => localStorage.setItem("popularPageNo", JSON.stringify(popularPageNo)), [popularPageNo]);
	useEffect(() => localStorage.setItem("tvSeriesPageNo", JSON.stringify(tvSeriesPageNo)), [tvSeriesPageNo]);

	const handleNext = useCallback(setPageNo => setPageNo(prev => prev+1), []);
	const handlePrevious = useCallback(setPageNo => setPageNo(prev => prev > 1 ? prev-1 : prev), []);
	
  return (
    <div>
      <Movies 
			movies={trendingMovies} 
			pageNo={trendingPageNo} 
			handleNext={handleNext} 
			handlePrevious={handlePrevious} 
			setPageNo={setTrendingPageNo}
			loader={trendingLoader}
			isMovie={true}
			title="Trending Movies"
		/>
      <Movies 
			movies={popularMovies} 
			pageNo={popularPageNo} 
			handleNext={handleNext} 
			handlePrevious={handlePrevious} 
			setPageNo={setPopularPageNo}
			loader={popularLoader}
			isMovie={true}
			title="Popular Movies"
		/>
      <Movies 
			movies={popularTVseries} 
			pageNo={tvSeriesPageNo} 
			handleNext={handleNext} 
			handlePrevious={handlePrevious} 
			setPageNo={setTvSeriesPageNo}
			loader={tvLoader}
			isMovie={false}
			title="Popular TV Series"
		/>
    </div>
  )
});

export default MoviesAll
