import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { MovieContext } from '../../MovieContextWrapper';
import './styles/banner.css';
import { Link } from 'react-router-dom';
import Loader from '../../Loader/Loader';

const Banner = ({sliderRef}) => {
    const [movies, setMovies] = useState([]);
    const [bannerLoader, setBannerLoader] = useState(true);
    useEffect(() => {
        axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=bba723222ce35673cae76bc15ffb91c1&language=en-US&page=1`)
            .then(response => setMovies(response?.data?.results))
            .then(() => setBannerLoader(false));
    }, []);
    const settings = {
        dots: false,
        lazyLoad: 'ondemand',
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        autoplay: true,
    };
    return (
        <div>
            {
                bannerLoader ? 
                (
                    <div className="text-white text-4xl h-screen w-full flex justify-center items-center">
                        <Loader />
                    </div>
                ) 
                    : 
                (
                    <Slider {...settings} buttons={false} ref={sliderRef}>
                        {movies?.map(movie => <BannerSlide key={movie.id} movie = {movie}/>)}
                    </Slider>
                )
            }
        </div>
    )
}

export default Banner

function BannerSlide({movie}) {
    const [logo, setLogo] = useState();
    const [slideLoader, setSlideLoaer] = useState(true);
    const { watchList, addToWatchList, removeFromWatchList } = useContext(MovieContext);
    useEffect(() => {
        try {
            axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/images?api_key=bba723222ce35673cae76bc15ffb91c1&include_image_language=en`)
                .then(response => setLogo(response?.data?.logos[0]?.file_path))
                .then(() => setSlideLoaer(false))
                .catch(console.log);
        }
        catch(err) {
            console.log(err);
        }
    }, [])
    if(slideLoader) return <div className="text-white text-4xl h-screen w-full flex justify-center items-center"><Loader /></div>
    
    return (
        <div className='relative text-white h-screen'>
            <div className='absolute top-0 w-full h-full items-center banner-detail-overlay'></div>
            <img className='object-cover w-full' src={`https://image.tmdb.org/t/p/original/${movie["backdrop_path"]}`} alt={movie.title} />
  
            <div className='absolute bottom-28 left-24 w-[900px] flex flex-col gap-4'>
                {
                    logo ?
                        (<img className='drop-shadow-lg w-[400px] mb-10' src={`https://image.tmdb.org/t/p/original/${logo}`} alt={movie.title} />)
                        :
                        (<h1 className='text-3xl'>{movie.title}</h1>)
                }
                <div className='flex justify-start items-center gap-2 text-lg '>
                    <div className="info-container relative">
                        <div className='absolute w-max -top-11 left-1 info'>Info</div>
                        <Link to={`/movie/${movie.id}`} >
                            <div 
                                className="bg-white bg-opacity-40 drop-shadow text-white px-7 py-2 rounded-md hover:bg-opacity-60"
                                onClick={() => {
                                    localStorage.setItem("singleMovie", JSON.stringify(movie));
                                    localStorage.setItem("isMovie", "true");
                                }}
                            >
                                <i className="fas fa-info" />
                            </div>
                        </Link>
                    </div>
                    <div className='relative add-btn-container'>
                        <div className='absolute w-max -top-11 -left-10 msg'>{!watchList.has(movie.id) ? "Add to" : "Remove from"} watchlist</div>
                        {
                            !watchList.has(movie.id)
                                ?
                            (
                                <button 
                                    className="bg-white w-[60px] bg-opacity-40 drop-shadow text-white px-2 py-2 rounded-md hover:bg-opacity-60"
                                    onClick={()=> addToWatchList(movie, true)}
                                >
                                    <i className="fas fa-plus" />
                                </button>

                            )
                                :
                            (
                                <button 
                                    className="bg-white w-[60px] bg-opacity-40 drop-shadow text-white px-2 py-2 rounded-md hover:bg-opacity-60"
                                    onClick={()=> removeFromWatchList(movie)}
                                >
                                    <i className="fa-solid fa-check"></i>
                                </button>
                            )
                        }

                    </div>
                    {/* <button className='bg-white bg-opacity-40 drop-shadow text-white px-2 py-2 bebas-neue-regular rounded-md hover:bg-opacity-60'>
                        <i className="fa-sharp-duotone fa-solid fa-play"></i> <span> Play Trailer</span>
                    </button> */}
                </div>
                <div className='text-lg text-white'>
                    {movie.overview}
                </div>
            </div>

        </div>
    )
}