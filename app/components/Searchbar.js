"use client";

import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (search === "") {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      axios
        .get(
          `
                https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${search}`,
        )
        .then((resp) => {
          setResults(resp.data);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="searchbar__wrapper">
      <input
        className="searchbar__input"
        type="text"
        placeholder="Search for books"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <FaSearch className="searchbar__icon" />
    </div>
  );
}
