// Dynamic metadata for each beach page.
// Beach configs live in lib/beaches.js — add new beaches there.

import { getBeach } from "../../lib/beaches";

export async function generateMetadata({ params }) {
  const beach = getBeach(params.location);

  if (!beach) {
    return {
      title: "Beach Week Brief",
      description: "A family beach-house fridge note, updated every morning.",
    };
  }

  return {
    title: beach.meta.title,
    description: beach.meta.description,
    openGraph: {
      title: beach.meta.title,
      description: beach.meta.ogDescription,
    },
  };
}

export default function BeachLayout({ children }) {
  return children;
}
