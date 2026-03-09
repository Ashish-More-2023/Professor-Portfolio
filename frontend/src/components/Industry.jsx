import React, { useEffect, useState } from "react";
import { apiCall, resolveImageUrl } from "../config/api";

function IndustryCard({ item }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 flex flex-col md:flex-row gap-6 items-center">
      <div className="w-28 h-28 md:w-32 md:h-32 shrink-0 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
        {item.companyLogo ? (
          <img
            src={resolveImageUrl(item.companyLogo)}
            alt={`${item.companyName} logo`}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
            }}
          />
        ) : (
          <span className="text-2xl font-bold text-gray-500">
            {item.companyName?.charAt(0) || "I"}
          </span>
        )}
      </div>

      <div className="w-full">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{item.companyName}</h2>
        <p className="mt-2 text-gray-700">
          <span className="font-semibold">Location:</span> {item.location}
        </p>
        <p className="mt-1 text-gray-700">
          <span className="font-semibold">Role:</span> {item.role}
        </p>
      </div>
    </div>
  );
}

function Industry() {
  const [industryData, setIndustryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiCall("/api/industry")
      .then((data) => {
        setIndustryData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching industry data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-slate-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading industry details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-slate-50 to-gray-100">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (industryData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-slate-50 to-gray-100">
        <div className="text-center">
          <p className="text-gray-600">No industry data available</p>
          <p className="text-sm text-gray-500 mt-2">Please add entries in the admin panel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-slate-50 to-gray-100 px-4 md:px-8 py-12 md:py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">Industry &amp; Consultancy</h1>
        <p className="text-lg text-gray-700 mt-2 mb-8">Industrial Associations</p>
        <div className="space-y-6">
          {industryData.map((item) => (
            <IndustryCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Industry;