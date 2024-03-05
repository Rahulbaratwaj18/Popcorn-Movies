 import { useEffect,useRef } from "react";
 
 export default function SearchBox({ query, setQuery }) {
    const inputElement = useRef(null);
  
    useEffect(
      function () {
        if (document.activeElement === inputElement) return;
  
        function callback(e) {
          if (e.code === "Enter") {
            inputElement.current.focus();
            setQuery("");
          }
        }
  
        document.addEventListener("keydown", callback);
        return () => {
          document.addEventListener("keydown", callback);
        };
      },
      [setQuery]
    );
    return (
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={inputElement}
      />
    );
  }