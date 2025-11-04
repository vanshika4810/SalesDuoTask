import React from "react";

export default function HistoryDrawer({ open, onClose, history, onSelect }) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 transition-opacity ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl transform transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 60 }}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Optimization History</h3>
            <button className="text-sm text-gray-500" onClick={onClose}>
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-sm text-gray-500">No past optimizations.</p>
            ) : (
              <ul className="space-y-3">
                {history.map((h) => (
                  <li key={h.id}>
                    <button
                      onClick={() => onSelect(h)}
                      className="w-full text-left p-3 rounded-lg border border-gray-100 hover:bg-gray-50 flex items-start justify-between"
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-800">
                          {new Date(h.created_at).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {h.optimized_title?.slice(0, 70) || "No title"}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 ml-3"></div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-4">
            <button
              onClick={onClose}
              className="w-full py-2 rounded-md bg-indigo-600 text-white"
            >
              Done
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
