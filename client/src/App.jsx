import React, { useState } from "react";
import axios from "axios";
import CompareView from "./components/CompareView";
import HistoryDrawer from "./components/HistoryDrawer";

export default function App() {
  const [asin, setAsin] = useState("");
  const [product, setProduct] = useState(null);
  const [optimized, setOptimized] = useState(null);
  const [optimizedMeta, setOptimizedMeta] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const API = `${import.meta.env.VITE_API_BASE_URL}/api/asin`;

  async function fetchProduct() {
    if (!asin) return alert("Enter ASIN");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/fetch`, { asin });
      const p = res.data.data;
      setProduct(p);
      setOptimized(null);
      setOptimizedMeta(null);

      // fetch history
      const historyRes = await axios
        .get(`${API}/${asin}/history`)
        .catch(() => ({ data: { success: false } }));
      if (historyRes.data.success) {
        setHistory(historyRes.data.history || []);
        if (historyRes.data.history && historyRes.data.history.length > 0) {
          setOptimized(historyRes.data.history[0]);
          setOptimizedMeta({
            created_at: historyRes.data.history[0].created_at,
          });
        }
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch product");
    } finally {
      setLoading(false);
    }
  }

  async function optimizeProduct() {
    if (!asin) return;
    setOptimizing(true);
    try {
      const res = await axios.post(`${API}/optimize`, { asin });
      const aiData = res.data.data;
      const historyRes = await axios.get(`${API}/${asin}/history`);
      if (historyRes.data.success) {
        setHistory(historyRes.data.history || []);
        if (historyRes.data.history.length > 0) {
          setOptimized(historyRes.data.history[0]);
          setOptimizedMeta({
            created_at: historyRes.data.history[0].created_at,
          });
        } else {
          setOptimized(aiData);
          setOptimizedMeta({ created_at: new Date().toISOString() });
        }
      }
    } catch (err) {
      console.error(err);
      alert("Optimization failed");
    } finally {
      setOptimizing(false);
    }
  }

  function handleSelectHistory(item) {
    setOptimized({
      optimized_title: item.optimized_title,
      optimized_bullets: item.optimized_bullets,
      optimized_description: item.optimized_description,
      suggested_keywords: item.suggested_keywords,
    });
    setOptimizedMeta({ created_at: item.created_at });
    setDrawerOpen(false);
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Amazon Listing Optimizer
          </h1>

          <div className="flex items-center gap-3">
            <input
              className="px-3 py-2 rounded-md border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Enter ASIN (e.g. B0C7SMBLZ2)"
              value={asin}
              onChange={(e) => setAsin(e.target.value)}
            />
            <button
              onClick={fetchProduct}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white shadow"
              disabled={loading}
            >
              {loading ? "Fetching..." : "Fetch Product"}
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              className="px-4 py-2 rounded-md border border-gray-200 bg-white"
            >
              View History
            </button>
            <button
              onClick={optimizeProduct}
              className="px-4 py-2 rounded-md bg-emerald-600 text-white"
              disabled={optimizing || !product}
            >
              {optimizing ? "Optimizing..." : "Optimize"}
            </button>
          </div>
        </header>

        {!product && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <p className="text-gray-600">
              No product loaded. Enter an ASIN above and click{" "}
              <span className="font-semibold">Fetch Product</span>.
            </p>
          </div>
        )}

        {product && (
          <>
            <CompareView
              original={product}
              optimized={optimized}
              optimizedMeta={optimizedMeta}
            />
          </>
        )}
      </div>

      <HistoryDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        history={history}
        onSelect={handleSelectHistory}
      />
    </div>
  );
}
