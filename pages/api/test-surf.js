// /api/test-surf
// Step 4: Verify NWS Surf Zone Forecast for Sandbridge / Virginia Beach.
// Visit /api/test-surf in your browser to see the result.

const USER_AGENT = "(BeachWeekBrief, beachweekbrief.com)";

export default async function handler(req, res) {
  try {
    // Try the direct text file first
    const textUrl =
      "https://tgftp.nws.noaa.gov/data/forecasts/marine/surf_zone/va/vaz098.txt";
    let surfText = null;
    let sourceUsed = null;

    const textRes = await fetch(textUrl, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (textRes.ok) {
      surfText = await textRes.text();
      sourceUsed = "tgftp.nws.noaa.gov (direct text)";
    } else {
      // Fallback: NWS products API
      const listUrl =
        "https://api.weather.gov/products/types/SRF/locations/AKQ";
      const listRes = await fetch(listUrl, {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "application/json",
        },
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
            sourceUsed = "api.weather.gov products API (fallback)";
          }
        }
      }
    }

    if (!surfText) {
      return res.status(200).json({
        source: "NWS Surf Zone Forecast",
        status: "unavailable",
        testedAt: new Date().toISOString(),
        note: "Could not retrieve surf zone text from either source. This may be normal outside beach season.",
      });
    }

    // Parse key fields from the structured today section
    const parsed = {};

    const rip = surfText.match(/Rip Current Risk\*?\.+\s*(\w+)/i);
    if (rip) parsed.ripRisk = rip[1];

    const surf = surfText.match(/Surf Height\.+\s*(.+?)(?:\.|$)/im);
    if (surf) parsed.surfHeight = surf[1].trim();

    const uvMatch = surfText.match(/UV Index\*{0,2}\.+\s*(\w[\w\s]*\w)/i);
    if (uvMatch) parsed.uvIndex = uvMatch[1].trim();

    const water = surfText.match(/Water Temperature\.+\s*(.+?)(?:\.|$)/im);
    if (water) parsed.waterTemp = water[1].trim();

    return res.status(200).json({
      source: "NWS Surf Zone Forecast",
      zone: "VAZ098 (Virginia Beach / Sandbridge)",
      status: "ok",
      sourceUsed,
      testedAt: new Date().toISOString(),
      textLength: surfText.length,
      parsed,
      fieldsFound: Object.keys(parsed),
      fieldsMissing: ["ripRisk", "surfHeight", "uvIndex", "waterTemp"].filter(
        (k) => !parsed[k]
      ),
      textPreview: surfText.substring(0, 500),
    });
  } catch (err) {
    return res.status(500).json({
      error: "Unexpected error",
      message: err.message,
    });
  }
}
