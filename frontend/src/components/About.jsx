import React, { useState, useEffect } from "react";
import { apiCall } from "../config/api";

function About() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiCall('/api/about')
      .then(data => {
        setAboutData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching about data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!aboutData) return null;

  const displayTitle =
    String(aboutData.title || "").trim().toLowerCase() === "about"
      ? "Profile"
      : aboutData.title;

  return (
    <div className="min-w-full px-20 py-6">
      <h2 className="font-bold text-4xl pb-10">{displayTitle}</h2>
      <p>{aboutData.content}</p>
    </div>
  );
}

export default About;
