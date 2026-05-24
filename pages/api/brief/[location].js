// /api/brief/[location].js
// Combined brief generator for Beach Week Brief.
// Fetches NWS forecast, NOAA tides, NWS alerts, and NWS surf zone forecast.
// Returns a normalized brief.json that the React page renders.
//
// All dates and times are Eastern (America/New_York).
//
// Usage: /api/brief/sandbridge
// Later: /api/brief/obx-north (just add config)

const USER_AGENT = "(BeachWeekBrief, beachweekbrief.com)";
const TIMEZONE = "America/New_York";

// ─── Beach configurations ───────────────────────────────────────────────────
// To add a new beach, add an entry here. The fetch logic is the same for all.

const BEACHES = {
  sandbridge: {
    id: "sandbridge",
    name: "Sandbridge",
    region: "Virginia Beach, VA",
    lat: 36.7458,
    lon: -75.9444,
    tideStation: "8639428",
    surfZoneFile: "va/vaz098",
    nwsOffice: "AKQ",
    sourceLabels: {
      forecast: "NWS Wakefield, VA (AKQ)",
      tides: "NOAA CO-OPS Station 8639428",
      surfZone: "Surf Zone Forecast VAZ098",
    },
  },
  duck: {
    id: "duck",
    name: "Duck",
    region: "Outer Banks, NC",
    lat: 36.1696,
    lon: -75.7552,
    tideStation: "8651370",
    surfZoneFile: "nc/ncz203",
    nwsOffice: "MHX",
    sourceLabels: {
      forecast: "NWS Newport/Morehead City, NC (MHX)",
      tides: "NOAA CO-OPS Station 8651370",
      surfZone: "Surf Zone Forecast NCZ203",
    },
  },
};

// ─── Timezone helper ────────────────────────────────────────────────────────
// Returns the current date string in Eastern time as YYYY-MM-DD

function easternDateStr(date) {
  return date.toLocaleDateString("en-CA", { timeZone: TIMEZONE });
}

function easternDateForNoaa(date) {
  // NOAA wants YYYYMMDD
  return easternDateStr(date).replace(/-/g, "");
}

// ─── Handler ────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  const { location } = req.query;
  const config = BEACHES[location];

  if (!config) {
    return res.status(404).json({
      error: "Unknown location",
      available: Object.keys(BEACHES),
    });
  }

  const now = new Date();
  const localDate = easternDateStr(now);

  // Fetch all sources in parallel
  const [forecastResult, tidesResult, alertsResult, surfResult] =
    await Promise.all([
      fetchForecast(config),
      fetchTides(config, now),
      fetchAlerts(config),
      fetchSurf(config),
    ]);

  // Merge into brief.json
  const days = [];
  for (const day of forecastResult.days) {
    const dateTides = tidesResult.tidesByDate[day.date] || [];

    // Surf data: only attach to today (index 0)
    const dayIndex = forecastResult.days.indexOf(day);
    const surfFields =
      dayIndex === 0 && surfResult.parsed ? surfResult.parsed : {};

    days.push({
      date: day.date,
      dayOfWeek: day.dayOfWeek,
      high: day.high,
      shortForecast: day.shortForecast,
      detailedForecast: day.detailedForecast,
      wind: day.wind,
      rainChance: day.rainChance,
      sunrise: null,
      sunset: null,
      tides: dateTides.length > 0 ? dateTides : null,
      surfHeight: surfFields.surfHeight || null,
      ripRisk: surfFields.ripRisk || null,
      uvIndex: surfFields.uvIndex || null,
    });
  }

  // briefDate = first day in the forecast (may be tomorrow if today's daytime is over)
  // localDate = actual current calendar date in Eastern time
  const briefDate = days.length > 0 ? days[0].date : localDate;

  const brief = {
    location: {
      id: config.id,
      name: config.name,
      region: config.region,
      timezone: TIMEZONE,
      localDate,
      briefDate,
      generatedAt: now.toISOString(),
    },
    sourceLabels: config.sourceLabels,
    sourceStatus: {
      forecast: forecastResult.status,
      tides: tidesResult.status,
      alerts: alertsResult.status,
      surfZone: surfResult.status,
    },
    waterTemp: surfResult.parsed?.waterTemp || null,
    days,
    alerts: alertsResult.alerts,
  };

  // Cache for 30 minutes, stale-while-revalidate for 60
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=1800, stale-while-revalidate=3600"
  );

  return res.status(200).json(brief);
}

// ─── NWS Forecast ───────────────────────────────────────────────────────────

async function fetchForecast(config) {
  try {
    const pointUrl = `https://api.weather.gov/points/${config.lat},${config.lon}`;
    const pointRes = await fetch(pointUrl, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/geo+json" },
    });
    if (!pointRes.ok) return { status: "failed", days: [] };

    const pointData = await pointRes.json();
    const forecastUrl = pointData.properties.forecast;

    const forecastRes = await fetch(forecastUrl, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/geo+json" },
    });
    if (!forecastRes.ok) return { status: "failed", days: [] };

    const forecastData = await forecastRes.json();
    const periods = forecastData.properties?.periods || [];
    const dayPeriods = periods.filter((p) => p.isDaytime);

    const days = dayPeriods.map((p) => {
      const rain = p.probabilityOfPrecipitation?.value;
      // NWS startTime includes timezone offset, e.g. "2026-05-24T06:00:00-04:00"
      // Extract the date portion — this is already in local time
      return {
        date: p.startTime.substring(0, 10),
        dayOfWeek: p.name,
        high: p.temperature,
        shortForecast: p.shortForecast,
        detailedForecast: p.detailedForecast,
        wind: `${p.windDirection} ${p.windSpeed}`,
        rainChance: rain != null ? rain : null,
      };
    });

    return { status: "ok", days };
  } catch (err) {
    return { status: "failed", days: [] };
  }
}

// ─── NOAA Tides ─────────────────────────────────────────────────────────────

async function fetchTides(config, now) {
  try {
    // Use Eastern time for date range so tides match the local day
    const begin = easternDateForNoaa(now);
    const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const end = easternDateForNoaa(endDate);

    const url =
      `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter` +
      `?begin_date=${begin}&end_date=${end}` +
      `&station=${config.tideStation}` +
      `&product=predictions&datum=MLLW&interval=hilo` +
      `&units=english&time_zone=lst_ldt&format=json` +
      `&application=BeachWeekBrief`;

    const tideRes = await fetch(url);
    if (!tideRes.ok) return { status: "failed", tidesByDate: {} };

    const tideData = await tideRes.json();
    if (tideData.error) return { status: "failed", tidesByDate: {} };

    const predictions = tideData.predictions || [];
    const tidesByDate = {};
    for (const p of predictions) {
      // NOAA lst_ldt returns local time: "2026-05-24 09:11"
      const dateKey = p.t.substring(0, 10);
      if (!tidesByDate[dateKey]) tidesByDate[dateKey] = [];
      tidesByDate[dateKey].push({
        type: p.type === "H" ? "high" : "low",
        time: p.t.substring(11),
        height: parseFloat(p.v),
      });
    }

    return { status: "ok", tidesByDate };
  } catch (err) {
    return { status: "failed", tidesByDate: {} };
  }
}

// ─── NWS Alerts ─────────────────────────────────────────────────────────────

async function fetchAlerts(config) {
  try {
    const url = `https://api.weather.gov/alerts/active?point=${config.lat},${config.lon}`;
    const alertRes = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/geo+json" },
    });
    if (!alertRes.ok) return { status: "failed", alerts: [] };

    const alertData = await alertRes.json();
    const features = alertData.features || [];

    const alerts = features.map((f) => {
      const p = f.properties;
      return {
  event: p.event,
  headline: p.headline,
  description: p.description || null,
  instruction: p.instruction || null,
  severity: p.severity,
  certainty: p.certainty,
  effective: p.effective,
  expires: p.expires,
};
    });

    return { status: "ok", alerts };
  } catch (err) {
    return { status: "failed", alerts: [] };
  }
}

// ─── NWS Surf Zone Forecast ─────────────────────────────────────────────────

async function fetchSurf(config) {
  try {
    const textUrl = `https://tgftp.nws.noaa.gov/data/forecasts/marine/surf_zone/${config.surfZoneFile}.txt`;
    const textRes = await fetch(textUrl, {
      headers: { "User-Agent": USER_AGENT },
    });

    let surfText = null;

    if (textRes.ok) {
      surfText = await textRes.text();
    } else {
      // Fallback: NWS products API
      const listUrl = `https://api.weather.gov/products/types/SRF/locations/${config.nwsOffice}`;
      const listRes = await fetch(listUrl, {
        headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
      });
      if (listRes.ok) {
        const listData = await listRes.json();
        const products = listData["@graph"] || [];
        if (products.length > 0) {
          const prodUrl = `https://api.weather.gov/products/${products[0].id}`;
          const prodRes = await fetch(prodUrl, {
            headers: {
              "User-Agent": USER_AGENT,
              Accept: "application/json",
            },
          });
          if (prodRes.ok) {
            const prodData = await prodRes.json();
            surfText = prodData.productText || null;
          }
        }
      }
    }

    if (!surfText) return { status: "unavailable", parsed: null };

    const parsed = {};
    const rip = surfText.match(/Rip Current Risk\*?\.+\s*(\w+)/i);
    if (rip) parsed.ripRisk = rip[1];

    const surf = surfText.match(/Surf Height\.+\s*(.+?)(?:\.|$)/im);
    if (surf) parsed.surfHeight = surf[1].trim();

    const uvMatch = surfText.match(/UV Index\*{0,2}\.+\s*(\w[\w\s]*\w)/i);
    if (uvMatch) parsed.uvIndex = uvMatch[1].trim();

    const water = surfText.match(/Water Temperature\.+\s*(.+?)(?:\.|$)/im);
    if (water) parsed.waterTemp = water[1].trim();

    return { status: "ok", parsed };
  } catch (err) {
    return { status: "unavailable", parsed: null };
  }
}
