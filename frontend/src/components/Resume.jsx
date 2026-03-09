import React, { useState, useEffect } from "react";
import { apiCall, resolveImageUrl } from "../config/api";
import CVFile from "../assets/CV_VIBIN.pdf";

const SectionHeading = ({ children }) => (
  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700 mt-8 md:mt-10 mb-3 md:mb-4">{children}</h2>
);

const Resume = () => {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiCall('/api/resume')
      .then(data => {
        setResumeData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching resume data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!resumeData || !resumeData.profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-600">No resume data available</p>
          <p className="text-sm text-gray-500 mt-2">Please add resume data in the admin panel</p>
        </div>
      </div>
    );
  }

  const { profile, education, positions, researchInterests, awards, editorials, patents, selectedPublications } = resumeData;

  return (
    <div className="w-full flex justify-center bg-white min-h-screen">
      <div className="max-w-4xl mx-auto py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8">
        
        {/* Hero Section - Responsive */}
        <div className="flex flex-col sm:flex-row items-center justify-center sm:items-start gap-6 sm:gap-8 md:gap-10 mb-8 md:mb-10 pb-6 md:pb-8 border-b border-gray-200">
          
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg border-4 border-green-300 bg-white">
              {profile.profileImage ? (
                <img 
                  src={resolveImageUrl(profile.profileImage)} 
                  alt={profile.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/200?text=Profile';
                  }}
                />
              ) : (
                <span className="text-2xl sm:text-3xl text-green-700 font-bold flex items-center justify-center h-full">
                  {profile.name.charAt(0)}
                </span>
              )}
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 mb-2">
              {profile.name}
            </h1>
            <p className="text-base sm:text-lg font-medium text-gray-700 mb-3">{profile.title}</p>
            
            {/* Departments */}
            {profile.departments && (
              <div className="mb-4">
                {profile.departments.split(',').map((d, i) => (
                  <p key={i} className="text-sm sm:text-base font-medium text-blue-800 leading-relaxed">
                    {d.trim()}
                  </p>
                ))}
              </div>
            )}
            
            {/* Contact Info */}
            <div className="space-y-1 text-sm sm:text-base text-gray-700">
              <p>
                <span className="font-semibold">Email:</span>{" "}
                <a href={`mailto:${profile.email}`} className="text-blue-600 hover:underline break-all">
                  {profile.email}
                </a>
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {profile.phone}
              </p>
              {profile.websiteUrl && (
                <p>
                  <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Faculty Page →
                  </a>
                </p>
              )}
              <p>
                <a
                  href={CVFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1 rounded-md transition-colors"
                >
                  CV
                </a>
              </p>
            </div>
            
            {/* Download Button */}
            {profile.resumePDF && (
              <div className="mt-4 sm:mt-6">
                <a 
                  href={profile.resumePDF} 
                  download 
                  className="inline-block bg-green-700 hover:bg-green-800 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Download Resume PDF
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Education */}
        {education && education.length > 0 && (
          <div className="mb-8 md:mb-10">
            <SectionHeading>Education</SectionHeading>
            <ul className="ml-4 sm:ml-6 md:ml-8 list-disc space-y-2 text-sm sm:text-base text-gray-800">
              {education.map((e) => (
                <li key={e.id}>
                  <span className="font-semibold">{e.degree}</span>, {e.field}, {e.institution}{" "}
                  <span className="text-gray-600">({e.year})</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Positions */}
        {positions && positions.length > 0 && (
          <div className="mb-8 md:mb-10">
            <SectionHeading>Positions & Employment</SectionHeading>
            <ul className="ml-4 sm:ml-6 md:ml-8 list-disc space-y-2 text-sm sm:text-base text-gray-800">
              {positions.map((exp) => (
                <li key={exp.id}>
                  <span className="font-semibold">{exp.title}</span>, {exp.place}{" "}
                  <span className="text-gray-600">({exp.years})</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Research Interests */}
        {researchInterests && researchInterests.length > 0 && (
          <div className="mb-8 md:mb-10">
            <SectionHeading>Research Interests</SectionHeading>
            <ul className="ml-4 sm:ml-6 md:ml-8 list-disc space-y-1 text-sm sm:text-base text-gray-800">
              {researchInterests.map((interest) => (
                <li key={interest.id}>{interest.interest}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Awards */}
        {awards && awards.length > 0 && (
          <div className="mb-8 md:mb-10">
            <SectionHeading>Awards & Achievements</SectionHeading>
            <ul className="ml-4 sm:ml-6 md:ml-8 list-disc space-y-2 text-sm sm:text-base text-gray-800">
              {awards.map((award) => (
                <li key={award.id}>{award.title}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Editorial Board */}
        {editorials && editorials.length > 0 && (
          <div className="mb-8 md:mb-10">
            <SectionHeading>Editorial Board Membership</SectionHeading>
            <div className="space-y-4 sm:space-y-5">
              {editorials.map((e, idx) => (
                <div key={e.id}>
                  <p className="text-sm sm:text-base text-gray-800">
                    {idx + 1}. Editorial Board Member, <span className="font-semibold">{e.journalTitle}</span>. {e.since}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 ml-2 sm:ml-4">
                    Publisher: <span className="font-medium">{e.publisher}</span>, Impact Factor: <span className="font-medium">{e.impactFactor}</span>
                  </p>
                  {e.journalImage && (
                    <img 
                      src={resolveImageUrl(e.journalImage)} 
                      alt={e.journalTitle} 
                      className="w-40 sm:w-48 h-16 sm:h-20 object-contain mt-2 ml-2 sm:ml-4"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Patents */}
        {patents && patents.length > 0 && (
          <div className="mb-8 md:mb-10">
            <SectionHeading>Patents</SectionHeading>
            <ul className="ml-4 sm:ml-6 md:ml-8 list-disc space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-800">
              {patents.map((pat) => (
                <li key={pat.id}>
                  <p className="font-semibold">{pat.title}</p>
                  <p className="text-xs sm:text-sm text-gray-700 mt-1">{pat.inventors}</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Patent No: <span className="font-mono">{pat.patentNo}</span>, Status: {pat.status}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Selected Publications */}
        {selectedPublications && selectedPublications.length > 0 && (
          <div className="mb-8 md:mb-10">
            <SectionHeading>Publications</SectionHeading>
            <div className="space-y-6 sm:space-y-8">
              {selectedPublications.map(pub => (
                <div key={pub.id} className="border-l-4 border-blue-500 pl-3 sm:pl-4 md:pl-5">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    {pub.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 mb-2">
                    {pub.authors}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">
                    <span className="font-semibold">{pub.venue}</span>, {pub.year}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:gap-6 gap-2 text-xs sm:text-sm text-gray-700">
                    <p>
                      <span className="font-semibold">DOI:</span>{" "}
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {pub.doi}
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold">Publisher:</span> {pub.publisher}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resume;
