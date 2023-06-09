import React, { useState, useEffect } from 'react'
import axios from './axios';
import Youtube from 'react-youtube';
import movieTrailer from 'movie-trailer';
import './Row.css';


const base_url = "https://image.tmdb.org/t/p/original/";

function Row({title, fetchUrl, isLargeRow}) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    // runs when any row loads
    useEffect( () => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl]);

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
          autoplay: 1,
        }
    } 

    const handleClick = (movie) => {
        // console.table(movie?.title)
        if (trailerUrl) {
          setTrailerUrl('');
        } else {
          movieTrailer(movie?.title || "")
            .then(url => {
              const urlParams = new URLSearchParams(new URL(url).search);
              setTrailerUrl(urlParams.get('v'));
            }).catch(error => console.log(error));
        }
    }

    return (
        <div className="row">
            <h2 className="row_heading">{title}</h2>
            <div className="row_posters">
                {movies.map(movie => (
                    <img key = {movie.id}
                    onClick={() => handleClick(movie)}
                    className={`row_poster ${isLargeRow && "row_poster_large"}`}
                    src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} 
                    alt={movie.name}/>
                ))}
            </div>
            <div style={{ padding: "40px" }}>
                {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
            </div>
        </div>
    );
}
export default Row;