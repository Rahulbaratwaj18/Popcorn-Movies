 import { useState } from "react";

 import Movie from "./Movie";
 
 export default function MovieList({ movies, onSelectMovie }) {
    const [isOpen1, setIsOpen1] = useState(true);
  
    return (
      <div className="box">
        <button
          className="btn-toggle"
          onClick={() => setIsOpen1((open) => !open)}
        >
          {isOpen1 ? "–" : "+"}
        </button>
        {isOpen1 && (
          <ul className="list list-movies">
            {movies?.map((movie) => (
              <Movie
                movie={movie}
                key={movie.imdbID}
                onSelectMovie={onSelectMovie}
              />
            ))}
          </ul>
        )}
      </div>
    );
  }