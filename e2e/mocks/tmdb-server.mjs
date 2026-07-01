import { createServer } from "node:http";

/**
 * Minimal mock of the TMDB v3 API, just enough for the PeliGo e2e suite.
 *
 * The app points at this via TMDB_BASE_URL=http://127.0.0.1:<port>/3
 * Responses mimic the raw TMDB shapes consumed by src/lib/tmdb.ts.
 */

const PORT = Number(process.env.E2E_MOCK_PORT || 8790);

// ---------- Providers (raw TMDB shape) ----------

const PROVIDERS = {
  netflix: {
    provider_id: 8,
    provider_name: "Netflix",
    logo_path: "/netflix.jpg",
    display_priority: 1,
  },
  mubi: {
    provider_id: 11,
    provider_name: "Mubi",
    logo_path: "/mubi.jpg",
    display_priority: 1,
  },
  disney: {
    provider_id: 337,
    provider_name: "Disney Plus",
    logo_path: "/disney.jpg",
    display_priority: 1,
  },
};

function arProviders(flatrate) {
  return {
    link: "https://www.themoviedb.org/movie/x/watch?locale=AR",
    flatrate: flatrate.map((p) => PROVIDERS[p]),
  };
}

// ---------- Title catalog ----------

/**
 * id -> { type, raw }
 * raw is the base TMDB object; watch/providers/credits/similar appended on detail.
 */
const CATALOG = {
  1001: {
    type: "movie",
    providerKeys: ["netflix"],
    raw: {
      id: 1001,
      title: "Netflix Movie",
      original_title: "Netflix Original Movie",
      overview: "A test movie available on Netflix.",
      poster_path: "/p1001.jpg",
      backdrop_path: "/b1001.jpg",
      release_date: "2025-01-10",
      vote_average: 8.2,
      vote_count: 1200,
      popularity: 300,
      genre_ids: [18, 53],
      runtime: 121,
    },
  },
  1002: {
    type: "movie",
    providerKeys: ["mubi"],
    raw: {
      id: 1002,
      title: "Mubi Movie",
      original_title: "Mubi Original Movie",
      overview: "A test movie available only on Mubi.",
      poster_path: "/p1002.jpg",
      backdrop_path: "/b1002.jpg",
      release_date: "2025-02-15",
      vote_average: 7.1,
      vote_count: 320,
      popularity: 150,
      genre_ids: [18],
      runtime: 99,
    },
  },
  2001: {
    type: "tv",
    providerKeys: ["disney"],
    raw: {
      id: 2001,
      name: "Disney Series",
      original_name: "Disney Original Series",
      overview: "A test series available on Disney+.",
      poster_path: "/p2001.jpg",
      backdrop_path: "/b2001.jpg",
      first_air_date: "2025-03-01",
      vote_average: 7.8,
      vote_count: 540,
      popularity: 200,
      genre_ids: [10765],
      number_of_seasons: 2,
    },
  },
};

function discoverResults(type) {
  return Object.values(CATALOG)
    .filter((entry) => entry.type === type)
    .map((entry) => ({ ...entry.raw, media_type: type }));
}

function watchProvidersResponse(id) {
  const entry = CATALOG[id];
  if (!entry) return { id: Number(id), results: {} };
  return {
    id: Number(id),
    results: { AR: arProviders(entry.providerKeys) },
  };
}

function detailResponse(id) {
  const entry = CATALOG[id];
  if (!entry) return null;
  return {
    ...entry.raw,
    genres: (entry.raw.genre_ids || []).map((gid) => ({ id: gid, name: "Genre" })),
    credits: {
      cast: [
        { name: "Actress One", character: "Character", profile_path: null, order: 0 },
        { name: "Actor Two", character: "Character", profile_path: null, order: 1 },
      ],
      crew: [{ name: "Test Director", job: "Director" }],
    },
    "watch/providers": { results: { AR: arProviders(entry.providerKeys) } },
    similar: { results: [] },
  };
}

// ---------- Routing ----------

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
    "Access-Control-Allow-Origin": "*",
  });
  res.end(payload);
}

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const path = url.pathname;

  if (path === "/health") {
    return json(res, 200, { ok: true });
  }

  // Strip the /3 TMDB version prefix.
  const tmdbPath = path.startsWith("/3/") ? path.slice(2) : path;

  // /discover/movie | /discover/tv
  let m = tmdbPath.match(/^\/discover\/(movie|tv)$/);
  if (m) {
    return json(res, 200, {
      page: 1,
      results: discoverResults(m[1]),
      total_pages: 1,
      total_results: discoverResults(m[1]).length,
    });
  }

  // /movie/{id}/watch/providers | /tv/{id}/watch/providers
  m = tmdbPath.match(/^\/(movie|tv)\/(\d+)\/watch\/providers$/);
  if (m) {
    return json(res, 200, watchProvidersResponse(m[2]));
  }

  // /movie/{id}/similar | /tv/{id}/similar
  m = tmdbPath.match(/^\/(movie|tv)\/(\d+)\/similar$/);
  if (m) {
    return json(res, 200, { page: 1, results: [], total_pages: 1, total_results: 0 });
  }

  // /movie/{id} | /tv/{id}  (detail, with append_to_response)
  m = tmdbPath.match(/^\/(movie|tv)\/(\d+)$/);
  if (m) {
    const detail = detailResponse(m[2]);
    if (!detail) return json(res, 404, { status_message: "Not found" });
    return json(res, 200, detail);
  }

  // /search/multi
  if (tmdbPath === "/search/multi") {
    const query = (url.searchParams.get("query") || "").toLowerCase();
    const results = Object.values(CATALOG)
      .map((entry) => ({ ...entry.raw, media_type: entry.type }))
      .filter((r) => {
        const t = (r.title || r.name || "").toLowerCase();
        return query === "" || t.includes(query);
      });
    return json(res, 200, {
      page: 1,
      results,
      total_pages: 1,
      total_results: results.length,
    });
  }

  // Fallback: empty results so the app degrades gracefully instead of erroring.
  return json(res, 200, { results: [] });
});

server.listen(PORT, "127.0.0.1", () => {
  // eslint-disable-next-line no-console
  console.log(`[mock-tmdb] listening on http://127.0.0.1:${PORT}`);
});
