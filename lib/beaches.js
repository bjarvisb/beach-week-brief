// lib/beaches.js
// ─── Single source of truth for all beach configurations ───────────────────
//
// Every file that needs beach data imports from here:
//   - pages/api/brief/[location].js  → API route (lat, lon, tideStation, etc.)
//   - app/[location]/page.js         → display name for loading/error states
//   - app/[location]/layout.js       → metadata (title, description, OG tags)
//   - app/page.js                    → landing page (grouped list)
//
// To add a new beach:
//   1. Source-test the beach (verify NWS grid, tide station, surf zone)
//   2. Add one entry to BEACHES below
//   3. It appears everywhere automatically
//
// To hide a beach from the landing page without removing it:
//   Set  showOnLanding: false

const BEACHES = {

  // ─── Delaware & Maryland ──────────────────────────────────────────────────

  lewes: {
    id: "lewes",
    name: "Lewes",
    region: "Cape Region, DE",
    group: "Delaware & Maryland",
    timezone: "America/New_York",
    lat: 38.7804,
    lon: -75.1308,
    tideStation: "8557380",
    surfZoneFile: "de/dez004",
    nwsOffice: "PHI",
    sourceLabels: {
      forecast: "NWS Mount Holly, NJ (PHI)",
      tides: "NOAA CO-OPS Station 8557380",
      surfZone: "Surf Zone Forecast DEZ004",
    },
    meta: {
      title: "Lewes — Beach Week Brief",
      description:
        "7-day beach-week planning sheet for Lewes, DE. Weather, tides, low-tide walks, swim caution, UV, and beach conditions.",
      ogDescription:
        "A simple beach-week planning sheet for Lewes, DE. Weather, tides, and beach conditions updated every morning.",
    },
    landingOrder: 1,
  },

  rehoboth: {
    id: "rehoboth",
    name: "Rehoboth",
    region: "Delaware Beaches, DE",
    group: "Delaware & Maryland",
    timezone: "America/New_York",
    lat: 38.7209,
    lon: -75.0760,
    tideStation: "8557863",
    surfZoneFile: "de/dez004",
    nwsOffice: "PHI",
    sourceLabels: {
      forecast: "NWS Mount Holly, NJ (PHI)",
      tides: "NOAA CO-OPS Station 8557863",
      surfZone: "Surf Zone Forecast DEZ004",
    },
    meta: {
      title: "Rehoboth — Beach Week Brief",
      description:
        "7-day beach-week planning sheet for Rehoboth Beach, DE. Weather, tides, low-tide walks, swim caution, UV, and beach conditions.",
      ogDescription:
        "A simple beach-week planning sheet for Rehoboth Beach, DE. Weather, tides, and beach conditions updated every morning.",
    },
    landingOrder: 2,
  },

  dewey: {
    id: "dewey",
    name: "Dewey",
    region: "Delaware Beaches, DE",
    group: "Delaware & Maryland",
    timezone: "America/New_York",
    lat: 38.6957,
    lon: -75.0752,
    tideStation: "8557863",
    surfZoneFile: "de/dez004",
    nwsOffice: "PHI",
    sourceLabels: {
      forecast: "NWS Mount Holly, NJ (PHI)",
      tides: "NOAA CO-OPS Station 8557863 (Rehoboth Beach)",
      surfZone: "Surf Zone Forecast DEZ004",
    },
    meta: {
      title: "Dewey — Beach Week Brief",
      description:
        "7-day beach-week planning sheet for Dewey Beach, DE. Weather, tides, low-tide walks, swim caution, UV, and beach conditions.",
      ogDescription:
        "A simple beach-week planning sheet for Dewey Beach, DE. Weather, tides, and beach conditions updated every morning.",
    },
    landingOrder: 3,
  },

  bethany: {
    id: "bethany",
    name: "Bethany",
    region: "Delaware Beaches, DE",
    group: "Delaware & Maryland",
    timezone: "America/New_York",
    lat: 38.5394,
    lon: -75.0553,
    tideStation: "8557863",
    surfZoneFile: "de/dez004",
    nwsOffice: "PHI",
    sourceLabels: {
      forecast: "NWS Mount Holly, NJ (PHI)",
      tides: "NOAA CO-OPS Station 8557863 (Rehoboth Beach)",
      surfZone: "Surf Zone Forecast DEZ004",
    },
    meta: {
      title: "Bethany — Beach Week Brief",
      description:
        "7-day beach-week planning sheet for Bethany Beach, DE. Weather, tides, low-tide walks, swim caution, UV, and beach conditions.",
      ogDescription:
        "A simple beach-week planning sheet for Bethany Beach, DE. Weather, tides, and beach conditions updated every morning.",
    },
    landingOrder: 4,
  },

  oceancity: {
    id: "oceancity",
    name: "Ocean City",
    region: "Worcester County, MD",
    group: "Delaware & Maryland",
    timezone: "America/New_York",
    lat: 38.3360,
    lon: -75.0850,
    tideStation: "8570283",
    surfZoneFile: "md/mdz025",
    nwsOffice: "AKQ",
    sourceLabels: {
      forecast: "NWS Wakefield, VA (AKQ)",
      tides: "NOAA CO-OPS Station 8570283 (Ocean City Inlet)",
      surfZone: "Surf Zone Forecast MDZ025",
    },
    meta: {
      title: "Ocean City — Beach Week Brief",
      description:
        "7-day beach-week planning sheet for Ocean City, MD. Weather, tides, low-tide walks, swim caution, UV, and beach conditions.",
      ogDescription:
        "A simple beach-week planning sheet for Ocean City, MD. Weather, tides, and beach conditions updated every morning.",
    },
    landingOrder: 5,
  },

  // ─── Virginia ─────────────────────────────────────────────────────────────

  virginiabeach: {
    id: "virginiabeach",
    name: "Virginia Beach",
    region: "Virginia Beach, VA",
    group: "Virginia",
    timezone: "America/New_York",
    lat: 36.8529,
    lon: -75.9780,
    tideStation: "8639168",
    surfZoneFile: "va/vaz098",
    nwsOffice: "AKQ",
    sourceLabels: {
      forecast: "NWS Wakefield, VA (AKQ)",
      tides: "NOAA CO-OPS Station 8639168",
      surfZone: "Surf Zone Forecast VAZ098",
    },
    meta: {
      title: "Virginia Beach — Beach Week Brief",
      description:
        "7-day beach-week planning sheet for Virginia Beach Oceanfront. Weather, tides, low-tide walks, swim caution, UV, and beach conditions.",
      ogDescription:
        "A simple beach-week planning sheet for Virginia Beach Oceanfront. Weather, tides, and beach conditions updated every morning.",
    },
    landingOrder: 0,
  },

  sandbridge: {
    id: "sandbridge",
    name: "Sandbridge",
    region: "Virginia Beach, VA",
    group: "Virginia",
    timezone: "America/New_York",
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
    meta: {
      title: "Sandbridge — Beach Week Brief",
      description:
        "7-day beach-week planning sheet for Sandbridge, Virginia Beach, VA. Weather, tides, low-tide walks, swim caution, UV, and beach conditions.",
      ogDescription:
        "A simple beach-week planning sheet for Sandbridge, Virginia Beach. Weather, tides, and beach conditions updated every morning.",
    },
    landingOrder: 1,
  },

  // ─── Outer Banks, NC ──────────────────────────────────────────────────────

  corolla: {
    id: "corolla",
    name: "Corolla",
    region: "Outer Banks, NC",
    group: "Outer Banks, NC",
    timezone: "America/New_York",
    lat: 36.3760,
    lon: -75.8310,
    tideStation: "8651370",
    surfZoneFile: "nc/ncz102",
    nwsOffice: "AKQ",
    sourceLabels: {
      forecast: "NWS Wakefield, VA (AKQ)",
      tides: "NOAA CO-OPS Station 8651370 (Duck Pier)",
      surfZone: "Surf Zone Forecast NCZ102",
    },
    meta: {
      title: "Corolla — Beach Week Brief",
      description:
        "7-day beach-week planning sheet for Corolla, Outer Banks, NC. Weather, tides, low-tide walks, swim caution, UV, and beach conditions.",
      ogDescription:
        "A simple beach-week planning sheet for Corolla, Outer Banks, NC. Weather, tides, and beach conditions updated every morning.",
    },
    landingOrder: 1,
  },

  duck: {
    id: "duck",
    name: "Duck",
    region: "Outer Banks, NC",
    group: "Outer Banks, NC",
    timezone: "America/New_York",
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
    meta: {
      title: "Duck — Beach Week Brief",
      description:
        "7-day beach-week planning sheet for Duck, Outer Banks, NC. Weather, tides, low-tide walks, swim caution, UV, and beach conditions.",
      ogDescription:
        "A simple beach-week planning sheet for Duck, Outer Banks, NC. Weather, tides, and beach conditions updated every morning.",
    },
    landingOrder: 2,
  },

  kittyhawk: {
    id: "kittyhawk",
    name: "Kitty Hawk",
    region: "Outer Banks, NC",
    group: "Outer Banks, NC",
    timezone: "America/New_York",
    lat: 36.0646,
    lon: -75.7057,
    tideStation: "8651370",
    surfZoneFile: "nc/ncz203",
    nwsOffice: "MHX",
    sourceLabels: {
      forecast: "NWS Newport/Morehead City, NC (MHX)",
      tides: "NOAA CO-OPS Station 8651370 (Duck Pier)",
      surfZone: "Surf Zone Forecast NCZ203",
    },
    meta: {
      title: "Kitty Hawk — Beach Week Brief",
      description:
        "7-day beach-week planning sheet for Kitty Hawk, Outer Banks, NC. Weather, tides, low-tide walks, swim caution, UV, and beach conditions.",
      ogDescription:
        "A simple beach-week planning sheet for Kitty Hawk, Outer Banks, NC. Weather, tides, and beach conditions updated every morning.",
    },
    landingOrder: 3,
  },

  killdevilhills: {
    id: "killdevilhills",
    name: "Kill Devil Hills",
    region: "Outer Banks, NC",
    group: "Outer Banks, NC",
    timezone: "America/New_York",
    lat: 36.0286,
    lon: -75.6757,
    tideStation: "8651370",
    surfZoneFile: "nc/ncz203",
    nwsOffice: "MHX",
    sourceLabels: {
      forecast: "NWS Newport/Morehead City, NC (MHX)",
      tides: "NOAA CO-OPS Station 8651370 (Duck Pier)",
      surfZone: "Surf Zone Forecast NCZ203",
    },
    meta: {
      title: "Kill Devil Hills — Beach Week Brief",
      description:
        "7-day beach-week planning sheet for Kill Devil Hills, Outer Banks, NC. Weather, tides, low-tide walks, swim caution, UV, and beach conditions.",
      ogDescription:
        "A simple beach-week planning sheet for Kill Devil Hills, Outer Banks, NC. Weather, tides, and beach conditions updated every morning.",
    },
    landingOrder: 4,
  },

  nagshead: {
    id: "nagshead",
    name: "Nags Head",
    region: "Outer Banks, NC",
    group: "Outer Banks, NC",
    timezone: "America/New_York",
    lat: 35.9577,
    lon: -75.6241,
    tideStation: "8651370",
    surfZoneFile: "nc/ncz203",
    nwsOffice: "MHX",
    sourceLabels: {
      forecast: "NWS Newport/Morehead City, NC (MHX)",
      tides: "NOAA CO-OPS Station 8651370 (Duck Pier)",
      surfZone: "Surf Zone Forecast NCZ203",
    },
    meta: {
      title: "Nags Head — Beach Week Brief",
      description:
        "7-day beach-week planning sheet for Nags Head, Outer Banks, NC. Weather, tides, low-tide walks, swim caution, UV, and beach conditions.",
      ogDescription:
        "A simple beach-week planning sheet for Nags Head, Outer Banks, NC. Weather, tides, and beach conditions updated every morning.",
    },
    landingOrder: 5,
  },

  // ─── Crystal Coast, NC ────────────────────────────────────────────────────

  emeraldisle: {
    id: "emeraldisle",
    name: "Emerald Isle",
    region: "Crystal Coast, NC",
    group: "Crystal Coast, NC",
    timezone: "America/New_York",
    lat: 34.6644,
    lon: -77.0292,
    tideStation: "8656483",
    surfZoneFile: "nc/ncz195",
    nwsOffice: "MHX",
    sourceLabels: {
      forecast: "NWS Newport/Morehead City, NC (MHX)",
      tides: "NOAA CO-OPS Station 8656483 (Beaufort)",
      surfZone: "Surf Zone Forecast NCZ195",
    },
    meta: {
      title: "Emerald Isle — Beach Week Brief",
      description:
        "7-day beach-week planning sheet for Emerald Isle, Crystal Coast, NC. Weather, tides, low-tide walks, swim caution, UV, and beach conditions.",
      ogDescription:
        "A simple beach-week planning sheet for Emerald Isle, Crystal Coast, NC. Weather, tides, and beach conditions updated every morning.",
    },
    landingOrder: 1,
  },

  atlanticbeach: {
    id: "atlanticbeach",
    name: "Atlantic Beach",
    region: "Crystal Coast, NC",
    group: "Crystal Coast, NC",
    timezone: "America/New_York",
    lat: 34.6983,
    lon: -76.7310,
    tideStation: "8656483",
    surfZoneFile: "nc/ncz195",
    nwsOffice: "MHX",
    sourceLabels: {
      forecast: "NWS Newport/Morehead City, NC (MHX)",
      tides: "NOAA CO-OPS Station 8656483 (Beaufort)",
      surfZone: "Surf Zone Forecast NCZ195",
    },
    meta: {
      title: "Atlantic Beach — Beach Week Brief",
      description:
        "7-day beach-week planning sheet for Atlantic Beach, Crystal Coast, NC. Weather, tides, low-tide walks, swim caution, UV, and beach conditions.",
      ogDescription:
        "A simple beach-week planning sheet for Atlantic Beach, Crystal Coast, NC. Weather, tides, and beach conditions updated every morning.",
    },
    landingOrder: 2,
  },

  // ─── Southern NC ──────────────────────────────────────────────────────────

  wrightsville: {
    id: "wrightsville",
    name: "Wrightsville",
    region: "Wilmington, NC",
    group: "Southern NC",
    timezone: "America/New_York",
    lat: 34.2084,
    lon: -77.7964,
    tideStation: "8658163",
    surfZoneFile: "nc/ncz108",
    nwsOffice: "ILM",
    sourceLabels: {
      forecast: "NWS Wilmington, NC (ILM)",
      tides: "NOAA CO-OPS Station 8658163",
      surfZone: "Surf Zone Forecast NCZ108",
    },
    meta: {
      title: "Wrightsville — Beach Week Brief",
      description:
        "7-day beach-week planning sheet for Wrightsville Beach, NC. Weather, tides, low-tide walks, swim caution, UV, and beach conditions.",
      ogDescription:
        "A simple beach-week planning sheet for Wrightsville Beach, NC. Weather, tides, and beach conditions updated every morning.",
    },
    landingOrder: 1,
  },

  carolina: {
    id: "carolina",
    name: "Carolina Beach",
    region: "Wilmington, NC",
    group: "Southern NC",
    timezone: "America/New_York",
    lat: 34.0522,
    lon: -77.8937,
    tideStation: "8658120",
    surfZoneFile: "nc/ncz108",
    nwsOffice: "ILM",
    sourceLabels: {
      forecast: "NWS Wilmington, NC (ILM)",
      tides: "NOAA CO-OPS Station 8658120",
      surfZone: "Surf Zone Forecast NCZ108",
    },
    meta: {
      title: "Carolina — Beach Week Brief",
      description:
        "7-day beach-week planning sheet for Carolina Beach, NC. Weather, tides, low-tide walks, swim caution, UV, and beach conditions.",
      ogDescription:
        "A simple beach-week planning sheet for Carolina Beach, NC. Weather, tides, and beach conditions updated every morning.",
    },
    landingOrder: 2,
  },

  // ─── South Carolina ───────────────────────────────────────────────────────

  myrtlebeach: {
    id: "myrtlebeach",
    name: "Myrtle Beach",
    region: "Grand Strand, SC",
    group: "South Carolina",
    timezone: "America/New_York",
    lat: 33.6891,
    lon: -78.8867,
    tideStation: "8661070",
    surfZoneFile: "sc/scz054",
    nwsOffice: "ILM",
    sourceLabels: {
      forecast: "NWS Wilmington, NC (ILM)",
      tides: "NOAA CO-OPS Station 8661070 (Springmaid Pier)",
      surfZone: "Surf Zone Forecast SCZ054",
    },
    meta: {
      title: "Myrtle Beach — Beach Week Brief",
      description:
        "7-day beach-week planning sheet for Myrtle Beach, SC. Weather, tides, low-tide walks, swim caution, UV, and beach conditions.",
      ogDescription:
        "A simple beach-week planning sheet for Myrtle Beach, SC. Weather, tides, and beach conditions updated every morning.",
    },
    landingOrder: 1,
  },

  folly: {
    id: "folly",
    name: "Folly",
    region: "Charleston, SC",
    group: "South Carolina",
    timezone: "America/New_York",
    lat: 32.6553,
    lon: -79.9405,
    tideStation: "8665530",
    surfZoneFile: "sc/scz150",
    nwsOffice: "CHS",
    sourceLabels: {
      forecast: "NWS Charleston, SC (CHS)",
      tides: "NOAA CO-OPS Station 8665530 (Charleston)",
      surfZone: "Surf Zone Forecast SCZ150",
    },
    meta: {
      title: "Folly Beach — Beach Week Brief",
      description:
        "7-day beach-week planning sheet for Folly Beach, Charleston, SC. Weather, tides, low-tide walks, swim caution, UV, and beach conditions.",
      ogDescription:
        "A simple beach-week planning sheet for Folly Beach, Charleston, SC. Weather, tides, and beach conditions updated every morning.",
    },
    landingOrder: 2,
  },

  hiltonhead: {
    id: "hiltonhead",
    name: "Hilton Head",
    region: "Hilton Head Island, SC",
    group: "South Carolina",
    timezone: "America/New_York",
    lat: 32.1490,
    lon: -80.7530,
    tideStation: "8669167",
    surfZoneFile: "sc/scz148",
    nwsOffice: "CHS",
    sourceLabels: {
      forecast: "NWS Charleston, SC (CHS)",
      tides: "NOAA CO-OPS Station 8669167",
      surfZone: "Surf Zone Forecast SCZ148",
    },
    meta: {
      title: "Hilton Head — Beach Week Brief",
      description:
        "7-day beach-week planning sheet for Hilton Head Island, SC. Weather, tides, low-tide walks, swim caution, UV, and beach conditions.",
      ogDescription:
        "A simple beach-week planning sheet for Hilton Head Island, SC. Weather, tides, and beach conditions updated every morning.",
    },
    landingOrder: 3,
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Get a beach config by slug. Returns undefined if not found. */
function getBeach(slug) {
  return BEACHES[slug] || undefined;
}

/** All valid beach slugs. */
function getAllSlugs() {
  return Object.keys(BEACHES);
}

/** Display name for loading/error states: "Kitty Hawk, Outer Banks, NC" */
function getDisplayName(slug) {
  const b = BEACHES[slug];
  return b ? `${b.name}, ${b.region}` : slug;
}

/**
 * Beaches grouped by region for the landing page.
 * Returns: [{ group: "Virginia", beaches: [{ slug, name }] }, ...]
 * Respects landingOrder for beach ordering within groups.
 * Skips beaches with showOnLanding: false.
 */
function getLandingGroups() {
  // Region ordering — controls which groups appear first
  const GROUP_ORDER = [
    "Delaware & Maryland",
    "Virginia",
    "Outer Banks, NC",
    "Crystal Coast, NC",
    "Southern NC",
    "South Carolina",
  ];

  const groupMap = {};

  for (const [slug, b] of Object.entries(BEACHES)) {
    if (b.showOnLanding === false) continue;
    const g = b.group;
    if (!groupMap[g]) groupMap[g] = [];
    groupMap[g].push({
      slug,
      name: b.name,
      order: b.landingOrder ?? 999,
    });
  }

  // Sort beaches within each group
  for (const arr of Object.values(groupMap)) {
    arr.sort((a, b) => a.order - b.order);
  }

  // Sort groups by GROUP_ORDER, unknowns at end
  const groups = Object.keys(groupMap).sort((a, b) => {
    const ai = GROUP_ORDER.indexOf(a);
    const bi = GROUP_ORDER.indexOf(b);
    return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
  });

  return groups.map((g) => ({
    group: g,
    beaches: groupMap[g],
  }));
}

export { BEACHES, getBeach, getAllSlugs, getDisplayName, getLandingGroups };
