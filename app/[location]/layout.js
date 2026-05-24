// Metadata config for each supported beach.
// To add a new beach, add an entry here and in pages/api/brief/[location].js BEACHES.

const BEACH_META = {
  sandbridge: {
    name: "Sandbridge",
    region: "Virginia Beach",
  },
  duck: {
    name: "Duck",
    region: "Outer Banks, NC",
  },
  kittyhawk: {
  name: "Kitty Hawk",
  region: "Outer Banks, NC",
  },
};

export async function generateMetadata({ params }) {
  const beach = BEACH_META[params.location];

  if (!beach) {
    return {
      title: "Beach Week Brief",
      description: "A family beach-house fridge note, updated every morning.",
    };
  }

  return {
    title: `${beach.name} — Beach Week Brief`,
    description: `7-day beach-week planning sheet for ${beach.name}, ${beach.region}. Weather, tides, low-tide walks, swim caution, UV, and beach conditions.`,
    openGraph: {
      title: `${beach.name} — Beach Week Brief`,
      description: `A simple beach-week planning sheet for ${beach.name}, ${beach.region}. Weather, tides, and beach conditions updated every morning.`,
    },
  };
}

export default function BeachLayout({ children }) {
  return children;
}
