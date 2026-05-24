// /api/test-alerts
// Step 3: Verify NWS Alerts API for Sandbridge.
// Visit /api/test-alerts in your browser to see the result.

const LAT = 36.7458;
const LON = -75.9444;
const USER_AGENT = "(BeachWeekBrief, beachweekbrief.com)";

export default async function handler(req, res) {
  try {
    const url = `https://api.weather.gov/alerts/active?point=${LAT},${LON}`;

    const alertRes = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/geo+json",
      },
    });

    if (!alertRes.ok) {
      return res.status(502).json({
        error: "NWS alerts failed",
        status: alertRes.status,
        detail: await alertRes.text(),
      });
    }

    const alertData = await alertRes.json();
    const features = alertData.features || [];

    const alerts = features.map((f) => {
      const p = f.properties;
      return {
        event: p.event,
        headline: p.headline,
        severity: p.severity,
        certainty: p.certainty,
        effective: p.effective,
        expires: p.expires,
        descriptionPreview: (p.description || "").substring(0, 200),
      };
    });

    return res.status(200).json({
      source: "NWS Alerts API",
      status: "ok",
      testedAt: new Date().toISOString(),
      point: `${LAT},${LON}`,
      totalAlerts: alerts.length,
      note: alerts.length === 0
        ? "No active alerts — this is normal on calm days."
        : undefined,
      alerts,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Unexpected error",
      message: err.message,
    });
  }
}
