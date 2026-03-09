import React, { useState, useEffect } from "react";
import { apiCall } from "../config/api";

function PublicationsSection({ publications }) {
  if (!publications || publications.length === 0) {
    return (
      <section className="space-y-8 mb-12">
        <h2 className="text-4xl font-bold text-blue-900">
          Publications <span className="text-xl font-semibold text-blue-800">(Selected, Recent)</span>
        </h2>
        <p className="text-gray-600">No publications available</p>
      </section>
    );
  }

  return (
    <section className="space-y-8 mb-12">
      <div>
        <h2 className="text-4xl font-bold text-blue-900">
          Publications <span className="text-xl font-semibold text-blue-800">(Selected, Recent)</span>
        </h2>
      </div>
      <div className="space-y-6">
        {publications.map(pub => (
          <article
            key={pub.id}
            className="flex gap-4 bg-white rounded-2xl border border-gray-100 p-6 shadow hover:shadow-lg transition-shadow duration-200"
          >
            <div className="w-1 rounded-full bg-blue-500 mt-1" aria-hidden="true" />
            <div className="flex-1 flex flex-col">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 leading-tight">
                {pub.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {pub.authors} • <span className="font-semibold">{pub.venue}</span>, <time dateTime={String(pub.year)}>{pub.year}</time>
              </p>
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="font-semibold text-gray-700">DOI</span>
                  <a
                    href={`https://doi.org/${pub.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                    aria-label={`Open DOI ${pub.doi}`}
                  >
                    {pub.doi}
                  </a>
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">Publisher:</span>{" "}
                  {pub.publisher}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BookCard({ book, refNumber }) {
  // Parse links if it's a JSON string
  let links = [];
  if (book.links) {
    try {
      links = JSON.parse(book.links);
    } catch (e) {
      // If not valid JSON, ignore
    }
  }

  return (
    <div className="relative flex flex-col items-start gap-2 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl border-2 border-indigo-200 shadow-lg p-6 w-full max-w-lg mx-auto h-full">
      {refNumber && (
        <span className="absolute top-2 right-3 text-lg font-bold text-indigo-400 opacity-70">[{refNumber}]</span>
      )}
      <h3 className="text-xl font-bold text-indigo-800 mb-1">{book.title}</h3>
      <p className="text-sm text-gray-700">
        <span className="font-semibold">Authors:</span> {book.authors}
      </p>
      {book.bookTitle && (
        <p className="text-sm text-blue-900 italic mb-1">{book.bookTitle}</p>
      )}
      <div className="flex flex-wrap gap-3 text-sm mt-2 items-center">
        {book.isbn && (
          <span className="text-gray-700 font-medium">ISBN: <span className="font-mono">{book.isbn}</span></span>
        )}
        {book.doi && (
          <span>
            DOI:{" "}
            <a href={`https://doi.org/${book.doi}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{book.doi}</a>
          </span>
        )}
        <span className="font-bold text-indigo-700">{book.publisher}</span>
        {book.year && <span className="text-gray-600">{book.year}</span>}
      </div>
      {links.length > 0 && (
        <div className="flex gap-4 mt-2 flex-wrap">
          {links.map((lk, i) => (
            <a
              key={i}
              href={lk.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 font-semibold underline hover:text-indigo-900"
            >
              {lk.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function BooksSection({ books, bookChapters }) {
  return (
    <section className="space-y-10">
      {books && books.length > 0 && (
        <>
          <h2 className="text-4xl font-bold text-indigo-900 mb-2">Books</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
            {books.map((book, idx) => (
              <BookCard key={book.id} book={book} refNumber={idx + 1} />
            ))}
          </div>
        </>
      )}
      
      {bookChapters && bookChapters.length > 0 && (
        <>
          <h2 className="text-3xl font-bold text-blue-900 mb-2 mt-12">Book Chapters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {bookChapters.map(chap => (
              <BookCard
                key={chap.id}
                book={chap}
                refNumber={chap.refNumber}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function PublicationsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiCall('/api/publications-page')
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching publications:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading publications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen py-12 px-4 md:px-12">
      <div className="max-w-5xl mx-auto">
        <PublicationsSection publications={data.publications} />
        <BooksSection books={data.books} bookChapters={data.bookChapters} />
      </div>
    </div>
  );
}

export default PublicationsPage;
