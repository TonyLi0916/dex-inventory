const https = require("https");
require("dotenv").config();

const cache = {
  token: null,
  tokenExpiresAt: null,
  prices: new Map(),
};

class EbayApiError extends Error {
  constructor(message, statusCode, ebayError) {
    super(message);
    this.name = "EbayApiError";
    this.statusCode = statusCode;
    this.ebayError = ebayError;
  }
}

function getBaseUrl() {
  const env = process.env.EBAY_ENVIRONMENT || "PRODUCTION";
  return env === "SANDBOX" ? "api.sandbox.ebay.com" : "api.ebay.com";
}

async function getAccessToken() {
  if (
    cache.token &&
    cache.tokenExpiresAt &&
    Date.now() < cache.tokenExpiresAt
  ) {
    console.log("Using cached eBay OAuth token");
    return cache.token;
  }

  console.log("Fetching new eBay OAuth token...");

  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "EBAY_CLIENT_ID and EBAY_CLIENT_SECRET must be set in .env",
    );
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );

  const postData =
    "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope";

  const options = {
    hostname: getBaseUrl(),
    path: "/identity/v1/oauth2/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          const response = JSON.parse(data);
          cache.token = response.access_token;
          cache.tokenExpiresAt =
            Date.now() + (response.expires_in - 300) * 1000;
          console.log("eBay OAuth token fetched successfully");
          resolve(cache.token);
        } else {
          reject(
            new EbayApiError(
              "Failed to get eBay OAuth token",
              res.statusCode,
              JSON.parse(data),
            ),
          );
        }
      });
    });

    req.on("error", (error) => {
      reject(new Error(`OAuth request failed: ${error.message}`));
    });

    req.write(postData);
    req.end();
  });
}

async function searchItems(searchQuery) {
  // Check cache first
  const cachedData = getCachedPrice(searchQuery);
  if (cachedData) {
    console.log(`Using cached price data for: ${searchQuery}`);
    return cachedData;
  }

  console.log(`Searching eBay for: ${searchQuery}`);

  const token = await getAccessToken();

  const params = new URLSearchParams({
    q: searchQuery,
    filter: "buyingOptions:{FIXED_PRICE},deliveryCountry:US",
    sort: "price",
    limit: "200",
  });

  const options = {
    hostname: getBaseUrl(),
    path: `/buy/browse/v1/item_summary/search?${params.toString()}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
      Accept: "application/json",
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          const response = JSON.parse(data);

          if (!response.itemSummaries || response.itemSummaries.length === 0) {
            console.log(`No results found for: ${searchQuery}`);
            resolve(null);
            return;
          }

          const priceData = calculatePriceStats(response.itemSummaries);

          if (priceData) {
            setCachedPrice(searchQuery, priceData);
            console.log(
              `Found ${priceData.sampleSize} listings for: ${searchQuery}`,
            );
          }

          resolve(priceData);
        } else if (res.statusCode === 401) {
          cache.token = null;
          cache.tokenExpiresAt = null;
          reject(
            new EbayApiError(
              "OAuth token expired",
              res.statusCode,
              JSON.parse(data),
            ),
          );
        } else if (res.statusCode === 429) {
          reject(
            new EbayApiError(
              "eBay API rate limit exceeded. Please wait a few minutes and try again.",
              res.statusCode,
              JSON.parse(data),
            ),
          );
        } else {
          reject(
            new EbayApiError(
              "eBay API request failed",
              res.statusCode,
              JSON.parse(data),
            ),
          );
        }
      });
    });

    req.on("error", (error) => {
      reject(new Error(`eBay search request failed: ${error.message}`));
    });

    req.end();
  });
}

function calculatePriceStats(items) {
  const prices = items
    .filter((item) => item.price && item.price.value)
    .map((item) => parseFloat(item.price.value));

  if (prices.length === 0) {
    return null;
  }

  const sum = prices.reduce((acc, price) => acc + price, 0);
  const averagePrice = sum / prices.length;
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return {
    averagePrice: parseFloat(averagePrice.toFixed(2)),
    minPrice: parseFloat(minPrice.toFixed(2)),
    maxPrice: parseFloat(maxPrice.toFixed(2)),
    sampleSize: prices.length,
    lastUpdated: new Date().toISOString(),
  };
}

function getCachedPrice(searchQuery) {
  const cached = cache.prices.get(searchQuery);

  if (!cached) {
    return null;
  }

  const cacheAgeHours = (Date.now() - cached.cachedAt) / (1000 * 60 * 60);
  const maxAge = parseInt(process.env.EBAY_CACHE_DURATION_HOURS) || 24;

  if (cacheAgeHours > maxAge) {
    cache.prices.delete(searchQuery);
    return null;
  }

  return cached.data;
}

function setCachedPrice(searchQuery, priceData) {
  cache.prices.set(searchQuery, {
    data: priceData,
    cachedAt: Date.now(),
  });

  if (cache.prices.size > 1000) {
    const entries = Array.from(cache.prices.entries());
    const sorted = entries.sort((a, b) => a[1].cachedAt - b[1].cachedAt);
    const toDelete = sorted.slice(0, 100);
    toDelete.forEach(([key]) => cache.prices.delete(key));
    console.log(
      "Price cache size reduced from",
      entries.length,
      "to",
      cache.prices.size,
    );
  }
}

function buildCardSearchQuery(card) {
  const parts = [
    "Pokemon",
    card.name,
    card.set_name || "",
    card.condition && card.condition !== "Damaged" ? card.condition : "",
  ].filter(Boolean);

  return parts.join(" ");
}

function buildSealedSearchQuery(product) {
  const type = product.product_type !== "Other" ? product.product_type : "";
  return ["Pokemon", product.product_name, type, "Sealed"]
    .filter(Boolean)
    .join(" ");
}

module.exports = {
  getAccessToken,
  searchItems,
  calculatePriceStats,
  buildCardSearchQuery,
  buildSealedSearchQuery,
  EbayApiError,
};
