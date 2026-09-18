"use client";

import Link from "next/link";
import { FaRegClock } from "react-icons/fa";
import { useAudioDuration } from "../../lib/useAudioDuration";
import { formatDuration } from "../../lib/formatTime";

export default function SearchResultItem({ book, onClick }) {
  const duration = useAudioDuration(book.audioLink);

  return (
    <Link
      href={`/book/${book.id}`}
      className="searchbar__result"
      onClick={onClick}
    >
      <img
        src={book.imageLink}
        alt={book.title}
        className="searchbar__result-img"
      />
      <div className="searchbar__result-info">
        <p className="searchbar__result-title">{book.title}</p>
        <p className="searchbar__result-author">{book.author}</p>
        <p className="searchbar__result-duration">
          <FaRegClock /> {formatDuration(duration)}
        </p>
      </div>
    </Link>
  );
}