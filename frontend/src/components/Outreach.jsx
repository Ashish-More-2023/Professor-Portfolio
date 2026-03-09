import React, { useState, useEffect } from "react";
import { apiCall, resolveImageUrl } from "../config/api";

const OutreachCard = ({ outreach, index }) => {
  const isImageLeft = index % 2 === 0;

  return (
    <div className="mb-20">
      <div
        className={`flex flex-col ${
          isImageLeft ? "lg:flex-row" : "lg:flex-row-reverse"
        } gap-8 items-center`}
      >
        {/* Image Section */}
        <div className="w-full lg:w-1/2">
          <div className="relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
            {outreach.imageUrl ? (
              <img
                src={resolveImageUrl(outreach.imageUrl)}
                alt={outreach.title}
                className="w-full h-96 object-cover hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x600?text=Outreach+Activity';
                }}
              />
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <span className="text-6xl text-purple-400 font-bold">{outreach.title.charAt(0)}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {outreach.title}
            </h2>
            <p className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-line">
              {outreach.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function Outreach() {
  const [outreachData, setOutreachData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiCall('/api/outreach')
      .then(data => {
        setOutreachData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching outreach data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading outreach activities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (outreachData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
        <div className="text-center">
          <p className="text-gray-600">No outreach activities available</p>
          <p className="text-sm text-gray-500 mt-2">Please add outreach data in the admin panel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-full bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      

      {/* Outreach Activities */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        {outreachData.map((outreach, index) => (
          <OutreachCard key={outreach.id} outreach={outreach} index={index} />
        ))}
      </div>
    </div>
  );
}

export default Outreach;
