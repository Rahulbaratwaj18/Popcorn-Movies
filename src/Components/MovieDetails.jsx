import { useState, useEffect } from "react";
import Loader from "./Loader";

import StarRating from "./StarRating";

const key = "a412bc37";

export default function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const [userRating, setUserRating] = useState("");

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  const {
    Title: title,
    Actors: actors,
    Director: director,
    Plot: plot,
    Poster: poster,
    imdbRating,
    Year: year,
    Language: language,
    Runtime: runtime,
    Released: released,
    Genre: genre,
  } = movie;

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "Popcorn Movies";
      };
    },
    [title]
  );

  function handleAdd() {
    const newMovie = {
      imdbID: selectedId,
      title,
      poster,
      year,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    onAddWatched(newMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onCloseMovie();
        }
      }
      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onCloseMovie]
  );

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
        );

        const data = await res.json();

        setMovie(data);
      }
      getMovieDetails();
      setIsLoading(false);
    },
    [selectedId]
  );
  return (
    <div className="box">
      <div className="details">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <header>
              <button className="btn-back" onClick={onCloseMovie}>
                &larr;
              </button>
              <img src={poster} alt="Movie Poster" />
              <div className="details-overview">
                <h2>{title}</h2>
                <p>
                  {released} &bull; {runtime} {language}
                </p>
                <p>
                  <span>⭐</span>
                  {imdbRating}
                </p>
              </div>
            </header>
            <section>
              {!isWatched ? (
                <>
                  <div className="rating">
                    <StarRating
                      maxRating={10}
                      size={24}
                      onSetRating={setUserRating}
                    />
                    {userRating > 0 && (
                      <button className="btn-add" onClick={handleAdd}>
                        +Add to List
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="rating">
                  <p>You already watched and rated this movie</p>
                </div>
              )}

              <p>{plot}</p>
              <p>Genre: {genre}</p>
              <p>Actors : {actors}</p>
              <p>Director : {director}</p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
