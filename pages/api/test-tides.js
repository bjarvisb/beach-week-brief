// /api/test-tides
// Step 2: Verify NOAA CO-OPS Tide Predictions for Sandbridge.
// Visit /api/test-tides in your browser to see the result.

const TIDE_STATION = "8639428"; // Sandbridge, VA

export default async function handler(req, res) {
  try {
    const today = new Date();
    const begin = today.toISOString().slice(0, 10).replace(/-/g, "");
    const end = new Date(today);
    end.setDate(end.getDate() + 7);
    const endStr = end.toISOString().slice(0, 10).replace(/-/g, "");

    const url =
      `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter` +
      `?begin_date=${begin}&end_date=${endStr}` +
      `&station=${TIDE_STATION}` +
      `&product=predictions&datum=MLLW&interval=hilo` +
      `&units=english&time_zone=lst_ldt&format=json` +
      `&application=BeachWeekBrief`;

    const tideRes = await fetch(url);

    if (!tideRes.ok) {
      return res.status(502).json({
        error: "NOAA tides failed",
        status: tideRes.status,
        detail: await tideRes.text(),
      });
    }

    const tideData = await tideRes.json();

    if (tideData.error) {
      return res.status(502).json({
        error: "NOAA returned error",
        detail: tideData.error,
      });
    }

    const predictions = tideData.predictions || [];

    // Group by date
    const tidesByDate = {};
    for (const p of predictions) {
      const dateKey = p.t.substring(0, 10);
      if (!tidesByDate[dateKey]) tidesByDate[dateKey] = [];
      tidesByDate[dateKey].push({
        type: p.type === "H" ? "high" : "low",
        time: p.t.substring(11),
        height: parseFloat(p.v),
      });
    }

    return res.status(200).json({
      source: "NOAA CO-OPS Tide Predictions",
      station: TIDE_STATION,
      stationName: "Sandbridge, VA",
      status: "ok",
      testedAt: new Date().toISOString(),
      dateRange: `${begin} – ${endStr}`,
      totalPredictions: predictions.length,
      sampleRaw: predictions.length > 0 ? predictions[0] : null,
      tidesByDate,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Unexpected error",
      message: err.message,
    });
  }
}
