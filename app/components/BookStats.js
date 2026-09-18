"use client";

import { FaStar, FaRegClock } from "react-icons/fa";
import { formatDuration } from "../../lib/formatTime";
import { useAudioDuration } from "../../lib/useAudioDuration";

export default function BookStats({ book }) {
  const duration = useAudioDuration(book.audioLink);

  return (
    <div className="book-card__stats">
      <span className="book-card__stat">
        <FaRegClock /> {formatDuration(duration)}
      </span>
      <span className="book-card__stat">
        <FaStar /> {book.averageRating}
      </span>
    </div>
  );
}