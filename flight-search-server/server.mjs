import http from "node:http";
import { searchSources } from "./sources/index.mjs";

const port = Number(process.env.PORT || 8787);

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
  });
  res.end(payload);
}

function normalizeQuery(input) {
  const from = String(input.from || "").trim().toUpperCase();
  const to = String(input.to || "").trim().toUpperCase();
  const departure = String(input.departure || "").trim();
  const returnDate = String(input.returnDate || "").trim();
  const travelers = Math.max(1, Math.min(9, Number(input.travelers || 1)));
  const cabin = String(input.cabin || "Economy").trim();

  if (!/^[A-Z]{3}$/.test(from) || !/^[A-Z]{3}$/.test(to)) {
    throw new Error("from and to must be 3-letter IATA airport codes");
  }
  if (!departure) throw new Error("departure is required");
  if (from === to) throw new Error("from and to cannot be the same airport");

  return { from, to, departure, returnDate, travelers, cabin };
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type",
    });
    return res.end();
  }

  if (req.method === "GET" && req.url === "/health") {
    return json(res, 200, {
      ok: true,
      service: "ticketdepart-flight-search-server",
      version: "0.2.0",
      faresDisplayed: false,
    });
  }

  if (req.method !== "POST" || req.url !== "/search") {
    return json(res, 404, { error: "Not found" });
  }

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {};
    const query = normalizeQuery(body);
    const result = await searchSources(query);

    return json(res, 200, {
      query,
      generatedAt: new Date().toISOString(),
      faresDisplayed: false,
      outbound: result.outbound,
      inbound: result.inbound,
      sourceStatus: result.sourceStatus,
    });
  } catch (error) {
    return json(res, 400, {
      error: error instanceof Error ? error.message : "Flight search failed",
    });
  }
});

server.listen(port, () => {
  console.log("TicketDepart flight search server listening on port " + port);
});
