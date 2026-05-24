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

var BEACHES = [
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
          <h1 className="hero-title" style={$title}>A family beach-house fridge note, <br />updated every morning.</h1>
          <p style={$lede}>
            Beach Week Brief turns vacation beach conditions into one calm planning sheet for your family.
          </p>
          <div style={$freshnessLine}>
            Rolling 7-day brief &middot; Updated each morning
          </div>

          <div style={$beachBox}>
            {BEACHES.map(function(b, i) {
              var isLast = i === BEACHES.length - 1;
              return (
                <Link
                  key={b.slug}
                  href={"/" + b.slug}
                  className="beach-row"
                  style={isLast ? {} : { borderBottom: "1px solid rgba(255,253,247,0.15)" }}
                >
                  <div>
                    <span style={$beachName}>{b.name}</span>
                    <span style={$beachRegion}>{b.region}</span>
                  </div>
                  <span style={$beachArrow}>&rarr;</span>
                </Link>
              );
            })}
          </div>
        </header>

        <section style={$sourceBox}>
          <p style={$sourceHead}>Built from public data. Written for families.</p>
          <p style={$sourceText}>
            Official weather, tide, surf, and advisory data turned into one plain-English planning sheet.
          </p>
        </section>

        <footer style={$footer}>
          <div style={$footerRule} />
          <p style={$footerText}>
            For planning only. Always check official conditions before entering the water.
          </p>
        </footer>
      </section>
    </main>
  );
}

var C = {
  pageBg: "#eeeeea",
  paper: "#fffdf7",
  ink: "#202020",
  mid: "#55514a",
  lt: "#7a746b",
  rule: "#d6d2c8",
  accent: "#2f5963",
};

var bask = "'Libre Baskerville', Georgia, serif";
var serif = "'Source Serif 4', Georgia, serif";

var $page = {
  minHeight: "100vh",
  backgroundColor: C.pageBg,
  display: "flex",
  justifyContent: "center",
  padding: "24px 12px 48px",
  fontFamily: serif,
  color: C.ink,
  WebkitFontSmoothing: "antialiased",
};

var $sheet = {
  width: "100%",
  maxWidth: 760,
  backgroundColor: C.paper,
  padding: "46px 42px 32px",
};

var $masthead = {
  textAlign: "center",
  maxWidth: 660,
  margin: "0 auto",
};

var $eyebrow = {
  fontSize: 12,
  color: C.accent,
  letterSpacing: "1.2px",
  textTransform: "uppercase",
  fontWeight: 600,
  marginBottom: 10,
};

var $title = {
  fontFamily: bask,
  fontSize: 24,
  lineHeight: 1.25,
  letterSpacing: "-0.3px",
  margin: "0 auto",
  maxWidth: 620,
  fontWeight: 700,
};

var $lede = {
  fontSize: 14,
  lineHeight: 1.6,
  color: C.mid,
  margin: "14px auto 0",
  maxWidth: 420,
};

var $freshnessLine = {
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.8px",
  fontWeight: 600,
  color: C.lt,
  margin: "24px 0 8px",
};

var $beachBox = {
  background: C.accent,
  borderRadius: 6,
  overflow: "hidden",
  margin: "0 auto 24px",
  maxWidth: 440,
  textAlign: "left",
};

var $beachName = {
  fontSize: 15,
  fontWeight: 600,
  color: C.paper,
};

var $beachRegion = {
  fontSize: 14,
  color: "rgba(255,253,247,0.8)",
  marginLeft: 10,
};

var $beachArrow = {
  color: "rgba(255,253,247,0.5)",
  fontSize: 16,
};

var $sourceBox = {
  textAlign: "center",
  margin: "0 0 28px",
};

var $sourceHead = {
  fontSize: 14,
  fontWeight: 600,
  color: C.mid,
  lineHeight: 1.6,
  margin: "0 auto",
  maxWidth: 420,
};

var $sourceText = {
  fontSize: 14,
  color: C.lt,
  lineHeight: 1.6,
  margin: "6px auto 0",
  maxWidth: 420,
};

var $footer = {
  textAlign: "center",
};

var $footerRule = {
  height: 1,
  backgroundColor: C.rule,
  marginBottom: 10,
};

var $footerText = {
  fontSize: 12,
  color: C.lt,
  fontStyle: "italic",
  lineHeight: 1.45,
  margin: 0,
};
