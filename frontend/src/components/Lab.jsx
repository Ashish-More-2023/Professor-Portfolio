import React, { useState, useEffect } from "react";
import { apiCall, resolveImageUrl } from "../config/api";


function SimpleStudentCard({ student }) {
  return (
    <div className="w-64 h-32 flex flex-col items-center justify-center bg-blue-50 rounded-xl shadow border-2 border-blue-200">
      <h3 className="text-lg font-bold text-blue-900">{student.name}</h3>
      <p className="text-md text-blue-700">{student.branch}</p>
    </div>
  );
}

function SimpleCarousel({ images }) {
  const [current, setCurrent] = useState(0);
  const size = images.length;

  const goNext = () => setCurrent((prev) => (prev + 1) % size);
  const goPrev = () => setCurrent((prev) => (prev - 1 + size) % size);

  useEffect(() => {
    if (size <= 1) return; // Don't auto-rotate if only 1 image
    
    const interval = setInterval(goNext, 4000);
    return () => clearInterval(interval);
  }, [current, size]); // Add current to dependencies

  if (size === 0) return null;

  return (
    <div className="w-full relative">
      <div className="flex items-center justify-center relative">
        {size > 1 && (
          <button
            onClick={goPrev}
            aria-label="Previous"
            className="text-gray-600 hover:text-blue-600 p-2 rounded-full bg-white shadow-md absolute left-2 z-10 top-1/2 -translate-y-1/2"
          >
            <svg width={28} height={28} fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M17 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        <div className="mx-auto w-[31rem] md:w-[38rem] h-[23rem] md:h-[27rem] rounded-2xl overflow-hidden flex items-center bg-white shadow border border-blue-200 relative">
          <img
            key={current} // Add key to force re-render
            src={images[current]}
            alt={`Carousel image ${current + 1}`}
            className="object-contain w-full h-full animate-fadeIn"
          />
        </div>
        
        {size > 1 && (
          <button
            onClick={goNext}
            aria-label="Next"
            className="text-gray-600 hover:text-blue-600 p-2 rounded-full bg-white shadow-md absolute right-2 z-10 top-1/2 -translate-y-1/2"
          >
            <svg width={28} height={28} fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M11 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="flex justify-center mt-3 space-x-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full border transition-all duration-300 ${
              current === idx ? "bg-blue-500 border-blue-500 scale-125" : "bg-gray-200 border-gray-300"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-in-out;
        }
      `}</style>
    </div>
  );
}


const PISection = ({ pi, images }) => (
  <section className="flex flex-col md:flex-row py-16 gap-10 items-center">
    {/* PI Profile */}
    <div className="flex flex-col items-center md:items-start w-full md:w-1/2 space-y-4">
      <img
        src={resolveImageUrl(pi.photo)}
        alt={pi.name}
        className="w-36 h-36 rounded-full border-4 border-purple-200 shadow-lg object-cover"
      />
      <h2 className="text-3xl font-bold text-indigo-900">{pi.name}</h2>
      <p className="font-semibold text-lg text-blue-700">{pi.title}</p>
      <p className="text-gray-700">{pi.description}</p>
      <div className="flex gap-5 text-blue-800 mt-2">
        <a href={`mailto:${pi.email}`} className="hover:underline">{pi.email}</a>
        <span>•</span>
        <a href={pi.url} className="hover:underline" target="_blank" rel="noopener noreferrer">Profile</a>
      </div>
    </div>
    {/* Carousel */}
    <div className="w-full md:w-1/2 flex items-center justify-center py-6">
      <SimpleCarousel images={images} />
    </div>
  </section>
);

const ProjectSection = ({ projects }) => (
  <div className="space-y-20">
    {projects.map((project, index) => {
      const isImageLeft = index % 2 === 0;
      const keywords = project.keywords ? project.keywords.split(',').map(k => k.trim()) : [];
      return (
        <div
          key={project.id}
          className={`flex flex-col md:flex-row ${isImageLeft ? "" : "md:flex-row-reverse"} gap-10 items-center`}
        >
          <div className="w-full md:w-1/2">
            <img
              src={resolveImageUrl(project.imageUrl)}
              alt={project.title}
              className="w-full h-72 object-cover rounded-2xl shadow-lg"
            />
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <h3 className="text-2xl font-bold text-blue-900">{project.title}</h3>
            <p className="text-gray-700 text-lg">{project.objective}</p>
            <div className="flex gap-2 flex-wrap">
              {keywords.map((kw, ki) => (
                <span key={ki} className="inline-block bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-semibold">{kw}</span>
              ))}
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

function PhdStudentCard({ student }) {
  return (
    <div className="w-72">
      <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-blue-200 bg-white">
        <div className="h-64 w-full bg-slate-200">
          <img
            src={resolveImageUrl(student.photo) || "/images/students/placeholder.jpg"}
            alt={student.name}
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>
      <div className="mt-3 px-2">
        <h3 className="text-2xl font-bold text-blue-900 mb-1">{student.name}</h3>
        {student.title && (
          <p className="text-md font-semibold text-blue-700 mb-0.5">{student.title}</p>
        )}
        {student.field && (
          <p className="text-gray-700">{student.field}</p>
        )}
        {student.presentPosition && (
          <p className="text-gray-600 mt-2 text-sm">{student.presentPosition}</p>
        )}
        {student.note && (
          <p className="text-gray-500 mt-1 text-xs">{student.note}</p>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, accentColor }) {
  const accent = accentColor === "blue"
    ? "text-blue-700"
    : accentColor === "purple"
      ? "text-purple-700"
      : "text-gray-800";
  return (
    <div className="mb-10">
      <h2 className={`text-3xl md:text-4xl font-bold ${accent}`}>{title}</h2>
      {subtitle && <p className="text-lg text-gray-600 mt-2">{subtitle}</p>}
    </div>
  );
}


function Lab() {
  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiCall('/api/lab')
      .then(data => {
        setLab(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <span className="text-blue-800 font-bold text-xl animate-pulse">Loading MID Lab...</span>
      </div>
    );
  }
  
  if (error || !lab) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="text-center">
          <span className="text-red-600">Error: {error || 'No data found'}</span>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 block mx-auto"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    profile,
    carouselImages,
    projects,
    currentPhdStudents,
    graduatedPhdStudents,
    mtechStudents,
    btechStudents
  } = lab;

  // Add safety checks
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="text-center">
          <p className="text-gray-600">No lab profile data available</p>
          <p className="text-sm text-gray-500 mt-2">Please add lab profile in the admin panel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-full bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-20 px-8">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold mb-4 border border-white/20">
            MID Lab @ IIT Guwahati
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Molecular Interactions & Design Laboratory
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl leading-relaxed">
            Pioneering research in network medicine, drug delivery systems, and bio-nanotechnology to advance healthcare and therapeutic solutions.
          </p>
        </div>
      </div>
      
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
        {/* PI + Carousel section */}
        <PISection
          pi={profile}
          images={carouselImages && carouselImages.length > 0 ? carouselImages.map(img => resolveImageUrl(img.imageUrl)) : []}
        />
        
        {/* Projects Section */}
        {projects && projects.length > 0 && (
          <section className="mb-20">
            <SectionHeader
              title="Research Projects"
              subtitle="Cutting-edge research initiatives driving innovation in molecular medicine"
              accentColor="blue"
            />
            <ProjectSection projects={projects} />
          </section>
        )}
        
        {/* PhD Students */}
        <section>
          <div className="mb-8">
            <SectionHeader
              title="PhD Students"
              subtitle="Meet our researchers"
              accentColor="purple"
            />
          </div>
          
          {/* Current PhD Students */}
          {currentPhdStudents && currentPhdStudents.length > 0 && (
            <div className="mb-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {currentPhdStudents.map((student, idx) => (
                  <PhdStudentCard student={student} key={idx} />
                ))}
              </div>
            </div>
          )}
          
          {/* Graduated PhD Students */}
          {graduatedPhdStudents && graduatedPhdStudents.length > 0 && (
            <>
              <div className="mb-12">
                <SectionHeader
                  title="MID Hall of Fame"
                  subtitle="Meet our accomplished alumni"
                  accentColor="purple"
                />
              </div>
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {graduatedPhdStudents.map((student, idx) => (
                    <PhdStudentCard student={student} key={idx} />
                  ))}
                </div>
              </div>
            </>
          )}
          
          {/* MTech Students */}
          {mtechStudents && mtechStudents.length > 0 && (
            <div className="mt-12 mb-12">
              <h3 className="text-2xl font-bold text-blue-800 mb-6">MTech Students</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
                {mtechStudents.map((student, idx) => (
                  <SimpleStudentCard student={student} key={idx} />
                ))}
              </div>
            </div>
          )}
          
          {/* BTech Students */}
          {btechStudents && btechStudents.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-blue-800 mb-6">BTech Students</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
                {btechStudents.map((student, idx) => (
                  <SimpleStudentCard student={student} key={idx} />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Lab;

