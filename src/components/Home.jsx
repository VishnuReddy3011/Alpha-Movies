import React, { useEffect, useRef } from 'react';
import Banner from './home/Banner';
import './styles/home.css';
// import MoviesAll from '';
const MoviesAll = React.lazy(() => import("./home/MoviesAll"));

const Home = () => {
  return (
    <div className='home relative'>
      <Banner />
      <MoviesAll />
    </div>
  )
}

export default Home
