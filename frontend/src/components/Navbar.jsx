import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DefaultLogo from "../assets/iitg_logo.jpg";
import { apiCall, resolveImageUrl } from "../config/api";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState(DefaultLogo);

  useEffect(() => {
    apiCall('/api/site-settings')
      .then(data => {
        if (data && data.logoUrl) {
          setLogoUrl(data.logoUrl);
          console.log("Using custom logo URL:", data);
        }
      })
      .catch(err => {
        console.error('Failed to fetch site settings:', err);
        // Keep using default logo
      });
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/research", label: "Research" },
    { to: "/teaching", label: "Teaching" },
    { to: "/resume", label: "Resume" },
    { to: "/MID-lab", label: "MID Lab" },
    { to: "/publications", label: "Publications" },
    { to: "/patents", label: "Patents" },
    { to: "/outreach", label: "Outreach" },
    { to: "/computational-tools", label: "Computational Details" },
    { to: "/industry", label: "Industry" },
  ];

  return (
    <nav className="w-full px-4 md:px-8 py-4 flex items-center justify-between bg-white shadow-sm border-b border-gray-200 z-50 relative">
      <div className="flex items-center h-14 lg:h-20">
        <img
          src={resolveImageUrl(logoUrl)}
          alt="Logo"
          className="h-full w-auto max-w-[400px] object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DefaultLogo; // Fallback to default logo
          }}
        />
      </div>
      
      {/* Hamburger mobile menu button */}
      <button
        className="ml-auto lg:hidden p-2 text-gray-700 focus:outline-none"
        aria-label="Toggle Navigation"
        onClick={() => setMenuOpen((o) => !o)}
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {menuOpen ? (
            // X close icon
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            // Hamburger icon
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>
      
      {/* Desktop Nav */}
      <div className="hidden lg:flex gap-8 items-center">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
          >
            {link.label}
          </Link>
        ))}
      </div>
      
      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="absolute left-0 top-full w-full bg-white shadow-md border-b border-gray-200 block md:hidden z-50">
          <div className="flex flex-col py-4 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="py-2 px-8 text-gray-700 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
