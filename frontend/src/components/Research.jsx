import React, { useState, useEffect } from "react";
import { apiCall, resolveImageUrl } from "../config/api";

const trimText = (value = "") => String(value).trim();
const normalizeDescription = (value = "") =>
  String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/\n\s*\n+/g, "\n")
    .trim();


const ResearchCard = ({ research, index }) => {
  const isImageLeft = index % 2 === 0;


  return (
    <div className="mb-20">
      <div
        className={`flex flex-col ${
          isImageLeft ? "lg:flex-row" : "lg:flex-row-reverse"
        } gap-8 items-center`}
      >
        <div className="w-full lg:w-1/2">
          <div className="relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
            {research.imageUrl ? (
              <img
                src={resolveImageUrl(research.imageUrl)}
                alt={research.title}
                className="w-full h-96 object-cover hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x600?text=Research+Image';
                }}
              />
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                <span className="text-4xl text-emerald-600 font-bold">{research.title.charAt(0)}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        </div>


        <div className="w-full lg:w-1/2 space-y-4">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              {research.title}
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg m-0 text-justify">
              {normalizeDescription(research.description)}
            </p>
          </div>


          {research.publications && research.publications.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800 border-b-2 border-emerald-600 pb-2 inline-block">
                Publications
              </h3>
              <ul className="space-y-4 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-transparent">
                {research.publications.map((pub) => (
                  <li
                    key={pub.id}
                    className="bg-gray-50 p-4 rounded-lg border-l-4 border-emerald-600 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {pub.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">{trimText(pub.authors)}</p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">{trimText(pub.journal)}</span> (
                      {pub.year}) • DOI: {trimText(pub.doi)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


function Research() {
  const [researchData, setResearchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    apiCall('/api/research')
      .then(data => {
        setResearchData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching research data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{trimText("Loading research areas...")}</p>
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
        <div className="text-center">
          <p className="text-red-600">{trimText(`Error: ${error}`)}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }


  if (researchData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
        <div className="text-center">
          <p className="text-gray-600">{trimText("No research areas available")}</p>
          <p className="text-sm text-gray-500 mt-2">{trimText("Please add research data in the admin panel")}</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-w-full bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 pb-0">
      <div className="max-w-7xl mx-auto px-8 pt-16 pb-16">
        {researchData.map((research, index) => (
          <ResearchCard key={research.id} research={research} index={index} />
        ))}
      </div>
    </div>
  );
}


export default Research;
