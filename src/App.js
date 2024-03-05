import { useEffect, useState } from "react";

import Main from "./Components/Main";

import Navbar from "./Components/Navbar";

import SearchBox from "./Components/SearchBox";

import SearchItems from "./Components/SearchItems";

import Loader from "./Components/Loader";

import MovieList from "./Components/MovieList";

import ErrorMessage from "./Components/Error";

import MovieDetails from "./Components/MovieDetails";

import WatchedList from "./Components/WatchedList";

const key = "a412bc37";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue) || "";
  });

  function handleSelectedMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  useEffect(
    function () {
      const controller = new AbortController();
      async function fecthMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?i=tt3896198&apikey=${key}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok) throw new Error("Fecthing movies failed");

          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie Not found");

          setMovies(data.Search);
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      handleCloseMovie();
      fecthMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <Navbar>
        <SearchBox query={query} setQuery={setQuery} />
        {movies && (
          <SearchItems length={movies.length === 0 ? "0" : movies.length} />
        )}
      </Navbar>
      <Main>
        {isLoading && <Loader />}

        {!isLoading && !error && (
          <MovieList movies={movies} onSelectMovie={handleSelectedMovie} />
        )}

        {error && <ErrorMessage message={error} />}
        {selectedId ? (
          <MovieDetails
            selectedId={selectedId}
            onCloseMovie={handleCloseMovie}
            onAddWatched={handleAddWatchedMovie}
            watched={watched}
          />
        ) : (
          <WatchedList
            watched={watched}
            onDeleteWatched={handleDeleteWatched}
          />
        )}
      </Main>
    </>
  );
}
