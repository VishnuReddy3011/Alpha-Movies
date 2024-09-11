import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../Loader/Loader';
import { MovieContext } from '../MovieContextWrapper';
import Trailer from './Trailer';
import './styles/moviePage.css';
const MoviePage = React.memo(() => {
	const movie = JSON.parse(localStorage.getItem("singleMovie")) || {};
	const {id} = useParams();
	const {watchList, addToWatchList, removeFromWatchList, getGenres} = useContext(MovieContext);
	const [movieInfo, setMovieInfo] = useState();
	const [crewInfo, setCrewInfo] = useState();
	const URL_PREFIX = "https://api.themoviedb.org/3/";
	const API_KEY = "bba723222ce35673cae76bc15ffb91c1";
	const [pageLoader, setPageLoader] = useState(true);
	const [isMovie, setIsMovie] = useState((JSON.parse(localStorage.getItem("isMovie"))));
	useEffect(() => {
		axios.get(`${URL_PREFIX}${isMovie ? 'movie' : 'tv'}/${movie.id}?api_key=${API_KEY}&language=en-US&append_to_response=credits`)
			.then(response => setMovieInfo(response?.data))
			.then(() => setPageLoader(false));
	}, [id])

	useEffect(() => {
		window.scrollTo(0, 0)
		document.title += " | " + movie.title || movie.name || movie.original_name || "Title";
		document.title += " (" + (movie?.release_date?.substr(0,4) || (movie?.first_air_date?.substr(0,4) + '-' + (movieInfo?.last_air_date?.substr(0,4) || "") || "Year")) + ")";
		return () => document.title = "Alpha Movies";
	}, [])
	useEffect(() => {
		for(let i = 0; i < movieInfo?.credits?.crew?.length; i++) {
			let obj = movieInfo?.credits?.crew[i];
			if(obj?.job === "Director") {
				setCrewInfo({
					director: obj?.name
				});
				break;
			}
		}
		let castStr = "";
		for(let i = 0; i < 5 && i < movieInfo?.credits?.cast?.length; i++) {
			let obj = movieInfo?.credits?.cast[i];
			castStr += obj?.name;
			if(i < 4 && i < movieInfo?.credits?.cast?.length - 1) {
				castStr += ",  ";
			}
		}
		let creatorsStr = "";
		for(let i = 0; i < 3 && i < movieInfo?.created_by?.length; i++) {
			let obj = movieInfo?.created_by[i];
			creatorsStr += obj?.name;
			if(i < 2 && i < movieInfo?.created_by.length - 1) {
				creatorsStr += ",  ";
			}
		}
		
		setCrewInfo(prev => ({...prev, cast: castStr, creators: creatorsStr}));
	}, [movieInfo]);
	const getRuntime = min => {
		if(!min) return min;
		const hours = parseInt(min/60);
		const mins = min%60
		return hours ? `${hours}h ${mins}m` : `${mins}m`
	}
	const [isModalOpen, setIsModalOpen] = useState(false);
  return (
	<>
		<div className='relative text-white movie-page'>
				<img 
					className='opacity-20'
					src={`https://image.tmdb.org/t/p/original/${movie?.backdrop_path}`} 
					alt="" 
				/>
				<div className='absolute h-full w-full top-0 flex'>
					<div className="flex-1">
						<img
							className='w-[304px] m-10 rounded-xl'
							src={`https://image.tmdb.org/t/p/original/${movie?.poster_path}`} 
							alt="" 
						/>
					</div>
					{
						pageLoader 
							?
						(
							<div className="text-white text-4xl absolute top-52 left-[650px] flex justify-center items-center"><Loader /></div>
						)
							:
						(
							<div className="mt-10 mr-10 flex flex-col gap-4 flex-4 max-w-[900px]">
								<div>
									<a href={movieInfo?.homepage} target='_blank' className="text-4xl font-bold title">
										{(movie?.title || movie?.name || movie?.original_name || "Title") + " "} 
										<span className='year opacity-80'>
											({movie?.release_date?.substr(0,4) || (movie?.first_air_date?.substr(0,4) + '-' + (movieInfo?.last_air_date?.substr(0,4) || "") || "Year")})
										</span>
									</a>
									<ul 
										style={{ listStyleType: 'disc', margin: "0px" }}
										className='flex gap-6 opacity-80 small-txt'
									>
										<li>{new Date(movie?.release_date || movie?.first_air_date).toString().substring(3, 15) || "N/A"} ({movieInfo?.origin_country[0]})</li>
										<li>{getGenres(movie?.genre_ids)}</li>
										<li>
											{
												getRuntime(movieInfo?.runtime) 
													|| 
												(movieInfo?.number_of_seasons && (movieInfo?.number_of_seasons + "S " + movieInfo?.number_of_episodes + "E"))
												 	||
												("N/A")
											}
										</li>
									</ul>
								</div>
								<div className='flex gap-4 items-center'>
									<div className='text-3xl'>
										<i className="fa-solid fa-star" style={{color: "#FFD43B"}}></i> 
										{" " + (movie?.vote_average !== 0 ? movie?.vote_average.toFixed(1) + "/10" : "N/A") }
									</div>
									{
										!watchList.has(movie?.id) 
											?
										(
											<button 
												className='w-[40px] h-[40px] flex justify-center items-center rounded-full add-watch-list'
												onClick={() => addToWatchList(movie, isMovie)}
											>
												<i className="fa-solid fa-bookmark"></i>
											</button>
										)
											:
										(
											<button 
												className='w-[40px] h-[40px] flex justify-center items-center rounded-full add-watch-list'
												onClick={() => removeFromWatchList(movie)}
											>
												{/* #63E6BE */}
												<i className="fa-solid fa-bookmark" style={{color: "gold"}}></i>
											</button>
										)
									}
									<button 
										className='flex items-center gap-2 text-sm hover:opacity-50'
										onClick={() => setIsModalOpen(true)}
									>
										<i className="fa-solid fa-play"></i>
										<span className='over font-semibold'>Play Trailer</span>
									</button>

								</div>
								<div className='italic opacity-80'>{movieInfo?.tagline}</div>
								<div className='text-xl font-semibold over'>Overview</div>
								<div className='w-[900px] -mt-2'>{movie?.overview}</div>
								<div>
									<span className='over font-bold' style={{ whiteSpace: 'pre' }}>
										
										{
											crewInfo?.director ? "Director:  " : "Creators: "
										}
									</span>
									<span className='text-purple-50' style={{ whiteSpace: 'pre' }}>
										{crewInfo?.director ? (crewInfo?.director || "N/A") : (crewInfo?.creators || "N/A")}
									</span>
								</div>
								<div className='-mt-4'>
									<span className='over font-bold'>
										Top cast:
									</span> 
									<span className='text-purple-50' style={{ whiteSpace: 'pre' }}>
										{'  ' + crewInfo?.cast}</span>
									</div>
							</div>
						)
					}


				</div>
		</div>
		<Trailer
			isOpen={isModalOpen}
			onClose={() => setIsModalOpen(false)}
			movieId={movie.id}
			isMovie={isMovie}
		/>
	</>
  )
})

export default MoviePage
