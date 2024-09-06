import React, { useEffect, useRef } from 'react';
import Banner from './home/Banner';
import './styles/home.css';
import MoviesAll from './home/MoviesAll';

const Home = () => {
  // const sliderRef = useRef(null);
  // const carouselRef = useRef(null);
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const carouselTop = carouselRef.current.getBoundingClientRect().top;
  //     const carouselBottom = carouselRef.current.getBoundingClientRect().bottom;
  //     const windowHeight = window.innerHeight;

  //     if (carouselTop < windowHeight && carouselBottom > 0) {
  //       // Carousel is in view, resume autoplay
  //       sliderRef.current.slickPlay();
  //     } else {
  //       // Carousel is out of view, pause autoplay
  //       sliderRef.current.slickPause();
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);
  return (
    <div className='home relative'>
      <Banner />
      <MoviesAll />
    </div>
  )
}

export default Home
