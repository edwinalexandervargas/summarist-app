"use client";

import { FaSearch, FaTimes } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import SearchResultItem from "./SearchResultItem";
import Skeleton from "./Skeleton";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (search === "") {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

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
        })
        .finally(() => {
          setIsLoading(false);
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
    setIsLoading(false);
  }

  function renderSkeletonResults() {
    return Array.from({ length: 4 }).map((_, i) => (
      <div className="searchbar__result searchbar__result--skeleton" key={i}>
        <Skeleton width="40px" height="58px" borderRadius="4px" />
        <div className="searchbar__result-skeleton-text">
          <Skeleton width="160px" height="14px" />
          <Skeleton width="100px" height="12px" />
          <Skeleton width="70px" height="12px" />
        </div>
      </div>
    ));
  }

  return (
    <div className="searchbar__wrapper" ref={wrapperRef}>
      <input
        className="searchbar__input"
        type="text"
        placeholder="Search for books"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => search && (results.length > 0 || isLoading) && setIsOpen(true)}
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
          {isLoading ? (
            renderSkeletonResults()
          ) : results.length === 0 ? (
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