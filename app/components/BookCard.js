import Link from "next/link";
import { FaStar, FaRegClock } from "react-icons/fa";
import { formatDuration } from "../../lib/formatTime";

export default function BookCard({ book }) {
  return (
    <Link href={`/book/${book.id}`} className="book-card">
      <figure className="book-card__image--wrapper">
        <img src={book.imageLink} alt={book.title} />
      </figure>
      <h3 className="book-card__title">{book.title}</h3>
      <p className="book-card__author">{book.author}</p>
      <p className="book-card__subtitle">{book.subTitle}</p>
      <div className="book-card__stats">
        <span className="book-card__stat">
          <FaRegClock /> {formatDuration(book.duration)}
        </span>
        <span className="book-card__stat">
          <FaStar /> {book.averageRating}
        </span>
      </div>
    </Link>
  );
}