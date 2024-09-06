import React from 'react';
import { Route, Routes } from "react-router-dom";
import './App.css';
import MovieContextWrapper from "./MovieContextWrapper";
import Home from './components/Home';
import MoviePage from './components/MoviePage';
import MoviesComp from './components/MoviesComp';
import NavBar from './components/NavBar';
import WatchList from './components/WatchList';


const App = () => {
  return (
    <MovieContextWrapper>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watchList" element={<WatchList />} />
        <Route path="/movies" element={<MoviesComp />} />
        <Route path="/movie/:id" element={<MoviePage />} />
      </Routes>
    </MovieContextWrapper>
  )
}

export default App
