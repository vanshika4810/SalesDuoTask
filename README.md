# SalesDuo Amazon Listing Optimizer

A full-stack implementation of the SalesDuo assignment.
This project scrapes Amazon product details, stores them in a database, and uses **Gemini AI** to generate optimized listings for better SEO and conversions.

## Tech Stack

**Frontend:**

- React (Vite)
- Tailwind CSS
- Axios
- Modern responsive UI

**Backend:**

- Node.js
- Express.js
- MySQL
- CORS for secure frontend–backend communication
- Gemini API (`@google/generative-ai`) for AI optimization
- Axios + Cheerio for Amazon product scraping

## Features

**Amazon Scraper** - Extracts product title, bullet points, and description using ASIN
**AI Optimization** - Uses Gemini to rewrite and enrich listings
**History Tracking** - Stores each optimized version in MySQL with timestamps
**Compare View** - Displays Original vs Optimized listings side-by-side
**Right Drawer History** - View past optimizations, switch between versions

---

## AI Prompt & Reasoning

The Gemini prompt was designed to create concise, keyword-rich, and persuasive listings while keeping the output frontend-friendly.

### **Prompt Used**

```js
You are an Amazon listing optimization expert.

ASIN: ${asin}

Original Product Data:
Title: ${original.title}
Bullets: ${original.bullets.join("\n")}
Description: ${original.description}

Please generate:
1. Optimized Title, make it keyword-rich and clear.
2. Concise bullet points highlighting benefits and features.
3. A persuasive product description (≤ 300 words).
4. 4–6 relevant keyword phrases for SEO.

Important guidelines:
- Do NOT use any emojis, special characters, or decorative symbols.
- Do NOT use markdown formatting (no **bold**, _italics_, or asterisks).
- Output clean plain text only.
- Return ONLY valid JSON with no extra commentary.

Return strictly in this format:
{
  "optimized_title": "...",
  "optimized_bullets": ["...", "...", "...", "...", "..."],
  "optimized_description": "...",
  "keywords": ["...", "...", "..."]
}
```

### **Reasoning**

The prompt was intentionally constrained to:

- Prevent markdown or emoji output (which breaks JSON parsing and frontend rendering)
- Ensure consistent structure for easy database storage
- Produce readable, keyword-optimized details suitable for Amazon listings
- Allow the frontend to directly render JSON fields without cleanup or rich-text conversion

---

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/vanshika4810/SalesDuoTask.git
cd SalesDuoTask
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in `/server`:

```
SERVER_PORT=5000
CLIENT_PORT=5173
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=salesduo
GEMINI_API_KEY="your_gemini_api_key"
```

Run the backend:

```bash
npm start
```

### MySQL Database Setup

Run the following commands inside your MySQL shell:

```sql
-- Create database
CREATE DATABASE salesduo;
USE salesduo;

-- Create products table
CREATE TABLE products (
  asin VARCHAR(50) PRIMARY KEY,
  title TEXT,
  bullet_points JSON,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create optimizations table
CREATE TABLE optimizations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  asin VARCHAR(50),
  optimized_title TEXT,
  optimized_bullets JSON,
  optimized_description TEXT,
  suggested_keywords JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (asin) REFERENCES products(asin)
);
```

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create a `.env` file in `/client`:

```
VITE_API_BASE_URL=http://localhost:5000
```

Run the frontend:

```bash
npm run dev
```

Access the app at [http://localhost:5173](http://localhost:5173).

---

## Example Flow

1. Enter an ASIN (e.g. `B07FDJMC9Q`)
2. Backend scrapes Amazon product details
3. User clicks **Optimize** → Gemini generates new listing
4. Both versions shown side-by-side
5. History Drawer allows switching between past optimizations

---

## Summary

The implementation balances functionality, scalability, and clarity, making it easy to extend (e.g. add authentication, export reports, or integrate with Amazon APIs in future versions).
