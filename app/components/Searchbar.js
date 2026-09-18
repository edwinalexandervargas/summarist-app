"use client";

import { FaSearch, FaTimes } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import SearchResultItem from "./SearchResultItem";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (search === "") {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      axios
        .get(
          `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${search}`,
        )
        .then((resp) => {
          setResults(resp.data);
          setIsOpen(true);
        })
        .catch((err) => {
          console.log("Error searching books:", err.message);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleResultClick() {
    setSearch("");
    setResults([]);
    setIsOpen(false);
  }

  function handleClear() {
    setSearch("");
    setResults([]);
    setIsOpen(false);
  }

  return (
    <div className="searchbar__wrapper" ref={wrapperRef}>
      <input
        className="searchbar__input"
        type="text"
        placeholder="Search for books"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => search && results.length > 0 && setIsOpen(true)}
      />
      {search ? (
        <button
          className="searchbar__clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <FaTimes />
        </button>
      ) : (
        <FaSearch className="searchbar__icon" />
      )}

      {isOpen && (
        <div className="searchbar__results">
          {results.length === 0 ? (
            <div className="searchbar__no-results">No books found</div>
          ) : (
            results.map((book) => (
              <SearchResultItem
                key={book.id}
                book={book}
                onClick={handleResultClick}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}