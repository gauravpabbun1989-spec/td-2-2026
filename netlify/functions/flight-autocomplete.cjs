exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const q = String(event.queryStringParameters?.q || "").trim();

  if (!q) {
    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Missing q" }),
    };
  }

  const apiKey = process.env.SERPAPI_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "SerpApi is not configured" }),
    };
  }

  const params = new URLSearchParams({
    engine: "google_flights_autocomplete",
    q,
    api_key: apiKey,
  });

  try {
    const response = await fetch(
      `https://serpapi.com/search.json?${params.toString()}`
    );

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: {
        "content-type": "application/json",
        "cache-control": "public, max-age=300",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "SerpApi request failed" }),
    };
  }
};
