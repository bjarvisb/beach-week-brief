"use client";

/*
 * Beach Week Brief — Landing Page
 *
 * Purpose:
 * A simple homepage for beachweekbrief.com.
 * It explains the value quickly and sends people to a live brief.
 *
 * This is intentionally not a dashboard, map, app shell, or marketing site.
 */

import Link from "next/link";

const BEACHES = [
  { slug: "sandbridge", name: "Sandbridge", region: "Virginia Beach, VA" },
  { slug: "duck", name: "Duck", region: "Outer Banks, NC" },
];

export default function BeachWeekBriefLanding() {
  return (
    <main style={$page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        a { color: inherit; }
        .beach-row { text-decoration: none; display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; cursor: pointer; }
        .beach-row:hover { background: rgba(255,253,247,0.08); }
        @media (max-width: 680px) {
          .landing-sheet { padding: 30px 20px 24px !important; }
          .hero-title { font-size: 28px !important; max-width: 360px !important; }
        }
      `}</style>

      <section className="landing-sheet" style={$sheet}>
        <header style={$masthead}>
          <div style={$eyebrow}>Beach Week Brief</div>
          <h1 className="hero-title" style={$title}>A family beach-house fridge note, updated every morning.</h1>
          <p style={$lede}>
            Beach Week Brief turns vacation beach conditions into one calm planning sheet for your family.
          </p>
          <div style={$freshnessLine}>
            Rolling 7-day brief · Updated each morning
          </div>

          <div style={$beachBox}>
            {BEACHES.map((b, i) => (
              <Link
                key={b.slug}
                href={`/${b.slug}
