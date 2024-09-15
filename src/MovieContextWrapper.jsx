import React, { useCallback, useState } from "react";

// 1. create context object
export const MovieContext = React.createContext();

const MovieContextWrapper = ({ children }) => {
    const isEmpty = useCallback(obj => {
        for(const _ in obj) return false;
        return true;
    }, [])
    const [watchList, setWatchList] = useState(() => {
        const savedWatchList = JSON.parse(localStorage.getItem('watchList'));
        return !isEmpty(savedWatchList) ? new Map(savedWatchList) : new Map();
    });
    
    const addToWatchList = useCallback((movie, isMovie) => {
        setWatchList(prevState => {
            const updatedWatchList = [[movie.id, [movie, isMovie]], ...prevState.entries()];
            localStorage.setItem("watchList", JSON.stringify(updatedWatchList));
            return new Map(updatedWatchList);
        });
    }, []);

    const removeFromWatchList = useCallback((movie) => {
        setWatchList(prevState => {
            const updatedWatchList = new Map(prevState);
            updatedWatchList.delete(movie.id);
            localStorage.setItem("watchList", JSON.stringify(Array.from(updatedWatchList.entries())));
            return updatedWatchList;
        });
    }, []);
    const genreids = {
        28: "Action",
        12: "Adventure",
        16: "Animation",
        35: "Comedy",
        80: "Crime",
        99: "Documentary",
        18: "Drama",
        10751: "Family",
        14: "Fantasy",
        36: "History",
        27: "Horror",
        10402: "Music",
        9648: "Mystery",
        10749: "Romance",
        878: "Sci-Fi",
        10770: "TV",
        53: "Thriller",
        10752: "War",
        37: "Western",
        10759: "Action & Adventure",
        10762: "Kids",
        10763: "News",
        10764: "Reality",
        10765: "Sci-Fi & Fantasy",
        10766: "Soap",
        10767: "Talk",
        10768: "War & Politics",
    };

    const countries = 
        [
            { id: 'AR', name: 'Argentina' },
            { id: 'AU', name: 'Australia' },
            { id: 'AT', name: 'Austria' },
            { id: 'BE', name: 'Belgium' },
            { id: 'BR', name: 'Brazil' },
            { id: 'CA', name: 'Canada' },
            { id: 'CN', name: 'China' },
            { id: 'CZ', name: 'Czech Republic' },
            { id: 'DK', name: 'Denmark' },
            { id: 'FI', name: 'Finland' },
            { id: 'FR', name: 'France' },
            { id: 'DE', name: 'Germany' },
            { id: 'HK', name: 'Hong Kong' },
            { id: 'HU', name: 'Hungary' },
            { id: 'IN', name: 'India' },
            { id: 'IE', name: 'Ireland' },
            { id: 'IL', name: 'Israel' },
            { id: 'IT', name: 'Italy' },
            { id: 'JP', name: 'Japan' },
            { id: 'LU', name: 'Luxembourg' },
            { id: 'MX', name: 'Mexico' },
            { id: 'NL', name: 'Netherlands' },
            { id: 'NZ', name: 'New Zealand' },
            { id: 'NO', name: 'Norway' },
            { id: 'PL', name: 'Poland' },
            { id: 'RO', name: 'Romania' },
            { id: 'RU', name: 'Russia' },
            { id: 'ZA', name: 'South Africa' },
            { id: 'KR', name: 'South Korea' },
            { id: 'ES', name: 'Spain' },
            { id: 'SE', name: 'Sweden' },
            { id: 'CH', name: 'Switzerland' },
            { id: 'TW', name: 'Taiwan' },
            { id: 'TH', name: 'Thailand' },
            { id: 'GB', name: 'United Kingdom' },
            { id: 'US', name: 'United States of America' }
        ]
      
    function getGenres(arr) {
        let genres = "", i = 0;
        while (i < arr.length - 1) {
            genres += genreids[arr[i]] + ", ";
            i++;
        }
        genres += genreids[arr[i]];
        return genres;
    }
    const [searchText, setSearchText] = useState("");
    const [movieType, setMovieType] = useState("");
    const [isTV, setIsTV] = useState(false);
    

    // 2. create a provider where you will add state and function information
    return (
        <MovieContext.Provider
            value={
                    { 
                        watchList, 
                        setWatchList, 
                        addToWatchList, 
                        removeFromWatchList, 
                        getGenres,
                        searchText, 
                        setSearchText,
                        genreids,
                        isEmpty,
                        movieType, 
                        setMovieType,
                        isTV,
                        setIsTV,
                        countries
                    }
                }
        >
            {children}
        </MovieContext.Provider>
    );
};

export default MovieContextWrapper;