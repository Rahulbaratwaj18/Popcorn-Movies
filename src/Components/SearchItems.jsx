export default function SearchItems({ length }) {
    return (
      <p className="num-results">
        Found <strong>{length}</strong> results
      </p>
    );
  }