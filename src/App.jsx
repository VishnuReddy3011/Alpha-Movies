import React, { Suspense } from 'react';
import { Route, Routes } from "react-router-dom";
import './App.css';
import Loader from './Loader/Loader';
import MovieContextWrapper from "./MovieContextWrapper";
import GenreList from './components/GenreList';
import Home from './components/Home';
import MoviePage from './components/MoviePage';
import MoviesComp from './components/MoviesComp';
import NavBar from './components/NavBar';
import SearchList from './components/SearchList';
import WatchList from './components/WatchList';


const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <MovieContextWrapper>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watchList" element={<WatchList />} />
          <Route path="/search" element={<SearchList />} />
          <Route path="/movies" element={<MoviesComp />} />
          <Route path="/movie/:id" element={<MoviePage />} />
          <Route path="/genre/:id" element={<GenreList />} />
        </Routes>
      </MovieContextWrapper>
    </Suspense>
  )
}

export default App
