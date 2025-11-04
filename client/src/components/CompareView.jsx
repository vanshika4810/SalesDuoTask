import React from "react";

export default function CompareView({ original, optimized, optimizedMeta }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Original */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Original Listing</h3>
          <span className="text-xs text-gray-500">ASIN: {original?.asin}</span>
        </div>

        <h4 className="text-md font-medium text-slate-700">
          {original?.title}
        </h4>

        <div className="mt-4">
          <h5 className="text-sm font-medium text-gray-600 mb-2">Bullets</h5>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
            {(original?.bullet_points || []).map((b, i) => (
              <li key={i} className="leading-tight">
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <h5 className="text-sm font-medium text-gray-600 mb-2">
            Description
          </h5>
          <p className="text-sm text-slate-700 leading-relaxed">
            {original?.description}
          </p>
        </div>
      </div>

      {/* Optimized */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Optimized Listing</h3>
          {optimizedMeta ? (
            <span className="text-xs text-gray-500">
              {new Date(optimizedMeta.created_at).toLocaleString()}
            </span>
          ) : (
            <span className="text-xs text-gray-400">No optimization yet</span>
          )}
        </div>

        {optimized ? (
          <>
            <h4 className="text-md font-medium text-slate-700">
              {optimized.optimized_title}
            </h4>

            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-600 mb-2">
                Rewritten Bullets
              </h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                {(optimized.optimized_bullets || []).map((b, i) => (
                  <li key={i} className="leading-tight">
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-600 mb-2">
                Enhanced Description
              </h5>
              <p className="text-sm text-slate-700 leading-relaxed">
                {optimized.optimized_description}
              </p>
            </div>

            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-600 mb-3">
                Keywords
              </h5>
              <div className="flex flex-wrap gap-2">
                {(optimized.suggested_keywords || []).map((k, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-600">
            No optimized version selected.
          </div>
        )}
      </div>
    </div>
  );
}
