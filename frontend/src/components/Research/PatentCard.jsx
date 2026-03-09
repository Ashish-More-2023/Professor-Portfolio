import React from "react";

const trimText = (value = "") => String(value).trim();

function PatentCard({ item, index, categoryType }) {
  // Different styles based on category
  const isInternational = categoryType === "International Patent";
  const isTool = categoryType === "Computational Tools/Web servers";

  const cardStyles = isInternational
    ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"
    : isTool
    ? "bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200"
    : "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200";

  const accentColor = isInternational
    ? "bg-gradient-to-r from-amber-500 to-orange-600"
    : isTool
    ? "bg-gradient-to-r from-cyan-500 to-blue-600"
    : "bg-gradient-to-r from-emerald-500 to-teal-600";

  const badgeColor = isInternational
    ? "bg-amber-100 text-amber-700 border-amber-300"
    : isTool
    ? "bg-cyan-100 text-cyan-700 border-cyan-300"
    : "bg-emerald-100 text-emerald-700 border-emerald-300";

  return (
    <div
      className={`group relative ${cardStyles} rounded-2xl p-6 border-2 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] overflow-hidden`}
    >
      {/* Decorative gradient orb */}
      <div
        className={`absolute -top-10 -right-10 w-32 h-32 ${accentColor} rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500`}
      ></div>

      {/* Accent bar */}
      <div
        className={`absolute left-0 top-0 w-1 h-full ${accentColor} rounded-r-full`}
      ></div>

      <div className="relative z-10">
        {/* Status badge */}
        {item.status && (
          <div className="flex items-center justify-between mb-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${badgeColor} border`}
            >
              {trimText(item.status)}
            </span>
            {isInternational && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-300">
                🌍 International
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
          {trimText(item.title || item.name)}
        </h3>

        {/* Inventors or Description */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
            {isTool ? "Description" : "Inventors"}
          </p>
          <p className="text-gray-700 leading-relaxed text-sm">
            {trimText(item.inventors || item.description)}
          </p>
        </div>

        {/* Patent details */}
        <div className="space-y-2 pt-4 border-t border-gray-200">
          {item.patentNo && (
            <div className="flex items-start gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-24">
                Patent No:
              </span>
              <span className="text-sm font-mono text-gray-800 font-medium">
                {trimText(item.patentNo)}
              </span>
            </div>
          )}

          {item.date && (
            <div className="flex items-start gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-24">
                Date:
              </span>
              <span className="text-sm text-gray-800">{trimText(item.date)}</span>
            </div>
          )}

          {item.reference && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Reference
              </p>
              <p className="text-xs text-gray-600 leading-relaxed italic">
                {trimText(item.reference)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatentCard;