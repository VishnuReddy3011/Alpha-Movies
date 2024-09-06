import axios from 'axios';
import './styles/trailer.css';

import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Required for accessibility

const Trailer = ({ isOpen, onClose, movieId, isMovie }) => {
  const [trailerKey, setTrailerKey] = useState(null);
  
  const URL_PREFIX = "https://api.themoviedb.org/3/";
  const API_KEY = "bba723222ce35673cae76bc15ffb91c1";

  useEffect(() => {
    axios.get(`${URL_PREFIX}${isMovie ? 'movie' : 'tv'}/${movieId}/videos?api_key=${API_KEY}&language=en-US`)
        .then(response => {
            const trailers = response.data.results.filter(video => video.type === 'Trailer' && video.site === 'YouTube');
            setTrailerKey(() => trailers?.length > 0 ? trailers[0]?.key : null)
        })
        .catch(console.log);
  }, [movieId]);
  const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Makes the background 50% opaque
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Movie Trailer" style={customStyles} className="ReactModal__Content text-white">
      <button className='w-full flex justify-between m-3 text-white' onClick={onClose}>
        <span className='relative top-1 right-2 text-2xl'>Play Trailer</span>
        <i className="fa-sharp fa-solid fa-x mr-3  text-2xl"></i>
      </button>
      {trailerKey ? (
        <iframe
          width="100%"
          height="400px"
          src={`https://www.youtube.com/embed/${trailerKey}`}
          title="Movie Trailer"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <p>No trailer available</p>
      )}
    </Modal>
  );
};

export default Trailer;
