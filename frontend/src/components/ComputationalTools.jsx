import React, { useState, useEffect } from "react";
import { apiCall, resolveImageUrl } from "../config/api";

const trimText = (value = "") => String(value).trim();

function ToolCard({ tool, rightImage = false }) {
  return (
    <div
      className={`flex flex-col md:flex-row ${
        rightImage ? "md:flex-row-reverse" : ""
      } items-center gap-6 bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300 p-6 mb-8`}
    >
      {/* Image */}
      <div className="flex-shrink-0 w-full md:w-60 lg:w-72 flex items-center justify-center">
        {tool.imageUrl ? (
          <img
            src={resolveImageUrl(tool.imageUrl)}
            alt={tool.title}
            className="w-48 h-48 object-contain rounded-xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
              e.target.parentElement.innerHTML = `<div class="w-48 h-48 rounded-xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow flex items-center justify-center text-5xl font-bold text-blue-600">${tool.title.charAt(0)}</div>`;
            }}
          />
        ) : (
          <div className="w-48 h-48 rounded-xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow flex items-center justify-center text-5xl font-bold text-blue-600">
            {tool.title.charAt(0)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-xl md:text-2xl font-bold text-blue-800 mb-2">
          {tool.url ? (
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 hover:underline"
            >
              {tool.title} →
            </a>
          ) : (
            tool.title
          )}
        </h3>
        <p className="text-gray-700 text-sm md:text-md mb-2">
          {trimText(tool.description)}
        </p>
        <p className="text-xs md:text-sm text-gray-600">
          <span className="font-semibold">Reference:</span>{" "}
          {trimText(tool.reference)}
        </p>
      </div>
    </div>
  );
}

function ComputationalToolsPage() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiCall("/api/computational-tools")
      .then((data) => {
        setTools(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching computational tools:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {trimText("Loading computational details...")}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <p className="text-red-600">{trimText(`Error: ${error}`)}</p>
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

  if (tools.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <p className="text-gray-600">
            {trimText("No computational details available")}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {trimText("Please add tools in the admin panel")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen py-12 px-4 md:px-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-2">
            Computational Details / Web Servers
          </h1>
          <p className="text-base md:text-lg text-gray-700">
            {trimText(
              "Selected computational details, bioinformatics web servers, and their benchmark references from our group.",
            )}
          </p>
        </header>
        <section>
          {tools.map((tool, idx) => (
            <ToolCard tool={tool} rightImage={idx % 2 === 1} key={tool.id} />
          ))}
        </section>
      </div>
    </div>
  );
}

export default ComputationalToolsPage;
