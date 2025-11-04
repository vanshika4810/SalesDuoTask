import pool from "../db.js";
import { getAmazonProductDetails } from "../scraper/amazon-scraper.js";
import { generateOptimizedListing } from "../services/ai.js";

const getAllProducts = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM products ORDER BY created_at DESC"
  );
  res.json(rows);
};

// Fetch and save ASIN data
const fetchAndSaveASINData = async (req, res) => {
  const { asin } = req.body;
  if (!asin) return res.status(400).json({ message: "ASIN required" });

  try {
    const data = await getAmazonProductDetails(asin);
    if (data.error) return res.status(500).json(data);

    const db = await pool.getConnection();
    const [existing] = await db.query("SELECT id FROM products WHERE asin=?", [
      asin,
    ]);

    if (existing.length) {
      await db.query(
        "UPDATE products SET title=?, bullets=?, description=? WHERE asin=?",
        [data.title, JSON.stringify(data.bullet_points), data.description, asin]
      );
    } else {
      await db.query(
        "INSERT INTO products (asin, title, bullets, description) VALUES (?, ?, ?, ?)",
        [asin, data.title, JSON.stringify(data.bullet_points), data.description]
      );
    }

    db.release();
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch product details" });
  }
};

// Optimize details using Gemini AI
const optimizeDetailsUsingGeminiAI = async (req, res) => {
  const { asin } = req.body;
  if (!asin) return res.status(400).json({ message: "ASIN required" });

  try {
    const db = await pool.getConnection();
    const [rows] = await db.query("SELECT * FROM products WHERE asin=?", [
      asin,
    ]);
    let product;

    if (!rows.length) {
      console.log("ASIN not found, scraping now...");
      const scraped = await getAmazonProductDetails(asin);
      if (scraped.error) {
        db.release();
        return res.status(500).json({ message: "Failed to scrape ASIN" });
      }

      const [insert] = await db.query(
        "INSERT INTO products (asin, title, bullets, description) VALUES (?, ?, ?, ?)",
        [
          asin,
          scraped.title,
          JSON.stringify(scraped.bullet_points),
          scraped.description,
        ]
      );

      product = {
        id: insert.insertId,
        asin,
        title: scraped.title,
        bullets: JSON.stringify(scraped.bullet_points),
        description: scraped.description,
      };
    } else {
      product = rows[0];
    }

    const original = {
      title: product.title,
      bullets: JSON.parse(product.bullets || "[]"),
      description: product.description,
    };

    const aiResult = await generateOptimizedListing(original, asin);
    if (aiResult.error) throw new Error(aiResult.error);

    await db.query(
      `INSERT INTO optimizations (product_id, optimized_title, optimized_bullets, optimized_description, suggested_keywords)
       VALUES (?, ?, ?, ?, ?)`,
      [
        product.id,
        aiResult.optimized_title,
        JSON.stringify(aiResult.optimized_bullets),
        aiResult.optimized_description,
        JSON.stringify(aiResult.keywords),
      ]
    );

    db.release();
    res.json({ success: true, data: aiResult });
  } catch (err) {
    console.error("Error during optimization:", err);
    res.status(500).json({ message: "Optimization failed" });
  }
};

// Get optimization history for an ASIN
const getOptimizationHistoryForASIN = async (req, res) => {
  const { asin } = req.params;

  try {
    const db = await pool.getConnection();

    // Find the product ID first
    const [productRows] = await db.query(
      "SELECT id FROM products WHERE asin=?",
      [asin]
    );
    if (!productRows.length) {
      db.release();
      return res.status(404).json({ message: "ASIN not found" });
    }

    const productId = productRows[0].id;

    const [rows] = await db.query(
      `SELECT id, optimized_title, optimized_bullets, optimized_description, suggested_keywords, created_at
       FROM optimizations
       WHERE product_id=? ORDER BY created_at DESC`,
      [productId]
    );

    db.release();

    const history = rows.map((r) => ({
      ...r,
      optimized_bullets: JSON.parse(r.optimized_bullets || "[]"),
      suggested_keywords: JSON.parse(r.suggested_keywords || "[]"),
    }));

    res.json({ success: true, history });
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

export {
  getAllProducts,
  fetchAndSaveASINData,
  optimizeDetailsUsingGeminiAI,
  getOptimizationHistoryForASIN,
};
