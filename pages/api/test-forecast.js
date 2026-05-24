// /api/test-forecast
// Step 1: Verify NWS Forecast API works on Vercel for Sandbridge.
// Visit /api/test-forecast in your browser to see the result.

const LAT = 36.7458;
const LON = -75.9444;
const USER_AGENT = "(BeachWeekBrief, beachweekbrief.com)";

export default async function handler(req, res) {
  try {
    // Step 1: Resolve grid point
    const pointUrl = `https://api.weather.gov/points/${LAT},${LON}`;
    const pointRes = await fetch(pointUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/geo+json",
      },
    });

    if (!pointRes.ok) {
      return res.status(502).json({
        error: "NWS /points failed",
        status: pointRes.status,
        detail: await pointRes.text(),
      });
    }

    const pointData = await pointRes.json();
    const props = pointData.properties;

    const gridInfo = {
      office: props.gridId,
      gridX: props.gridX,
      gridY: props.gridY,
      forecastUrl: props.forecast,
      city: props.relativeLocation?.properties?.city,
      state: props.relativeLocation?.properties?.state,
    };

    // Step 2: Fetch 7-day forecast
    const forecastRes = await fetch(props.forecast, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/geo+json",
      },
    });

    if (!forecastRes.ok) {
      return res.status(502).json({
        error: "NWS forecast failed",
        status: forecastRes.status,
        gridInfo,
      });
    }

    const forecastData = await forecastRes.json();
    const periods = forecastData.properties?.periods || [];
    const dayPeriods = periods.filter((p) => p.isDaytime);

    // Normalize into our brief.json day format
    const days = dayPeriods.map((p) => {
      const rain = p.probabilityOfPrecipitation?.value;
      return {
        date: p.startTime.substring(0, 10),
        dayOfWeek: p.name,
        high: p.temperature,
        shortForecast: p.shortForecast,
        wind: `${p.windDirection} ${p.windSpeed}`,
        rainChance: rain != null ? rain : null,
        detailedForecast: p.detailedForecast,
      };
    });

    return res.status(200).json({
      source: "NWS Forecast API",
      status: "ok",
      testedAt: new Date().toISOString(),
      gridInfo,
      totalPeriods: periods.length,
      daytimePeriods: dayPeriods.length,
      days,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Unexpected error",
      message: err.message,
    });
  }
}
