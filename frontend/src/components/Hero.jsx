import React, { useState, useEffect } from "react";
import SubHero from "./SubHero";
import { apiCall, resolveImageUrl } from "../config/api";


function Hero() {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    apiCall('/api/hero')
      .then(data => {
        setHeroData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching hero data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }


  if (!heroData || !heroData.name) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
        <div className="text-center">
          <p className="text-gray-600">No profile data available</p>
          <p className="text-sm text-gray-500 mt-2">Please add data in the admin panel</p>
        </div>
      </div>
    );
  }


  // Split comma-separated departments
  const departmentsList = heroData.departments 
    ? heroData.departments.split(',').map(d => d.trim()).filter(d => d.length > 0)
    : [];


  return (
    <div className="min-w-full bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      {/* Hero Section - Positioned more to the right (25% from right) */}
      <div className="w-full flex flex-col lg:flex-row items-center lg:items-center justify-center py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-0">
        
        {/* Container to position content more right - 75% width (25% from right) */}
        <div className="w-full lg:w-[75%] flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-16 lg:pl-32">
          
          {/* Profile Image */}
          <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-2xl ring-4 ring-gray-100 ring-offset-4 ring-offset-slate-200 flex-shrink-0">
            {heroData.profileImage ? (
              <img
                src={resolveImageUrl(heroData.profileImage)}
                alt={heroData.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400?text=Profile+Image';
                }}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400 text-4xl md:text-5xl">{heroData.name.charAt(0)}</span>
              </div>
            )}
          </div>
          
          {/* Content Section */}
          <div className="flex-1 max-w-2xl text-center lg:text-left px-4 lg:px-0">
            <p className="text-lg sm:text-xl font-bold uppercase tracking-wide mb-2 bg-linear-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              Profile
            </p>
            
            {/* Name */}
            <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl pb-4 md:pb-6 text-transparent bg-gradient-to-r from-gray-800 to-slate-900 bg-clip-text">
              {heroData.name}
            </h1>
            
            {/* Designation & Departments */}
            <div className="py-3 flex flex-col sm:flex-row items-center lg:items-stretch gap-3 sm:gap-4 mb-4">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide self-center">
                {heroData.designation}
              </p>
              
              {departmentsList.length > 0 && (
                <>
                  <div className="hidden sm:block w-px bg-slate-400 self-stretch"></div>
                  <div className="flex flex-col gap-1">
                    {departmentsList.map((dept, idx) => (
                      <h3 key={idx} className="text-sm md:text-base font-semibold text-gray-800">
                        {dept}
                      </h3>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Contact Info - Row 1 */}
            <div className="py-3 space-y-2 text-sm md:text-base">
              {heroData.office && (
                <p className="text-gray-700">
                  <span className="font-semibold text-gray-900">Office:</span> {heroData.office}
                </p>
              )}
              {heroData.email && (
                <p className="text-gray-700">
                  <span className="font-semibold text-gray-900">Email:</span>{" "}
                  <a
                    href={`mailto:${heroData.email}`}
                    className="text-slate-700 hover:text-slate-900 hover:underline break-all"
                  >
                    {heroData.email}
                  </a>
                </p>
              )}
            </div>
            
            {/* Contact Info - Row 2 */}
            <div className="py-3 space-y-2 text-sm md:text-base">
              {heroData.phone && (
                <p className="text-gray-700">
                  <span className="font-semibold text-gray-900">Phone:</span> {heroData.phone}
                </p>
              )}
              {heroData.fax && (
                <p className="text-gray-700">
                  <span className="font-semibold text-gray-900">Fax:</span> {heroData.fax}
                </p>
              )}
              {heroData.websiteUrl && (
                <p className="text-gray-700">
                  <span className="font-semibold text-gray-900">URL:</span>{" "}
                  <a
                    href={heroData.websiteUrl.startsWith('http') ? heroData.websiteUrl : `https://${heroData.websiteUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-700 hover:text-slate-900 hover:underline break-all"
                  >
                    {heroData.websiteUrl}
                  </a>
                </p>
              )}
            </div>
            
            {/* Research Areas */}
            {heroData.researchAreas && (
              <div className="mt-4 py-4 bg-gradient-to-r from-slate-100 to-gray-100 rounded-lg px-4 md:px-6 border border-slate-200">
                <p className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
                  Research Areas
                </p>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  {heroData.researchAreas}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <SubHero />
    </div>
  );
}


export default Hero;
