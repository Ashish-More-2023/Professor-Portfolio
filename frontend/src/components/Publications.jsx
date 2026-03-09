import React, { useState, useEffect } from "react";
import { apiCall } from "../config/api";

function Publications() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiCall('/api/publications')
      .then(data => {
        setPublications(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching publications:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading publications...</div>;

  return (
    <section className="space-y-4 mb-10">
      <div>
        <h2 className="text-4xl font-bold text-gray-900">
          Publications <span className="text-xl font-semibold text-gray-700">(Selected, Recent)</span>
        </h2>
      </div>

      <div className="space-y-6">
        {publications.map((pub) => (
          <article
            key={pub.id}
            className="flex gap-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-200 h-full"
          >
            <div
              className="w-1 rounded-full bg-blue-500 mt-1"
              aria-hidden="true"
            />

            <div className="flex-1 flex flex-col">
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 leading-tight">
                {pub.title}
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                {pub.authors} • <span className="font-semibold">{pub.venue}</span>,{" "}
                <time dateTime={String(pub.year)}>{pub.year}</time>
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

export default Publications;
