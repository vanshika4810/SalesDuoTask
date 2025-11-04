import axios from "axios";
import * as cheerio from "cheerio";

export async function getAmazonProductDetails(asin) {
  const url = `https://www.amazon.in/dp/${asin}`;

  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    Referer: "https://www.amazon.com/",
    DNT: "1",
    Connection: "keep-alive",
  };

  try {
    console.log(`Fetching URL: ${url}`);
    const response = await axios.get(url, { headers });
    const $ = cheerio.load(response.data);

    const title = $("#productTitle").text().trim();

    const bulletPoints = [];
    $("#feature-bullets .a-list-item").each((i, el) => {
      const text = $(el).text().trim();
      if (text) bulletPoints.push(text);
    });

    const description = $("#productDescription p").text().trim();

    const productDetails = {
      asin,
      title: title || "Title not found",
      bullet_points: bulletPoints.length ? bulletPoints : ["Bullets not found"],
      description: description || "Description not found",
    };

    return productDetails;
  } catch (error) {
    console.error(`Error fetching ASIN ${asin}:`, error.message);
    return { error: "Failed to scrape product." };
  }
}
