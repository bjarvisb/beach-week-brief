"use client";

/*
 * Beach Week Brief — Landing Page
 *
 * Purpose:
 * A simple homepage for beachweekbrief.com.
 * It explains the value quickly and sends people to the live Sandbridge brief.
 *
 * This is intentionally not a dashboard, map, app shell, or marketing site.
 */

import Link from "next/link";

export default function BeachWeekBriefLanding() {
  return (
    <main style={$page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        a { color: inherit; }
        @media (max-width: 680px) {
          .landing-sheet { padding: 30px 20px 24px !important; }
          .hero-title { font-size: 31px !important; max-width: 360px !important; }
          .hero-actions { align-items: stretch !important; }
          .primary-button { width: 100%; text-align: center; }
          .help-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section className="landing-sheet" style={$sheet}>
        <header style={$masthead}>
          <div style={$eyebrow}>Beach Week Brief</div>
          <h1 className="hero-title" style={$title}>A family beach-house fridge note, updated every morning.</h1>
          <p style={$lede}>
            Before you pack the car, and each morning once you arrive,<br />
            Beach Week Brief turns vacation beach conditions into one calm planning sheet for your family.
          </p>
          <div style={$freshnessBox}>
            <span style={$freshnessKicker}>Rolling 7-day brief</span>
            <span style={$freshnessText}>Updated each morning with today + the next six days.</span>
          </div>

          <div className="hero-actions" style={$heroActions}>
            <Link className="primary-button" href="/sandbridge" style={$primaryButton}>
              Open the Sandbridge brief
            </Link>
            <p style={$actionNote}>Available now for Sandbridge, Virginia Beach.</p>
          </div>
        </header>

        <section style={$sourceBox}>
          <h2 style={$sourceHead}>Built from public data. Written for families.</h2>
          <p style={$sourceText}>
            Beach Week Brief turns official weather, tide, beach-condition, and advisory data into a
            plain-English planning sheet, not another weather app.
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

const C = {
  pageBg: "#eeeeea",
  paper: "#fffdf7",
  ink: "#202020",
  mid: "#55514a",
  lt: "#7a746b",
  rule: "#d6d2c8",
  accent: "#2f5963",
  caution: "#9a5b16",
  warn: "#b42318",
};

const bask = "'Libre Baskerville', Georgia, serif";
const serif = "'Source Serif 4', Georgia, serif";

const $page = {
  minHeight: "100vh",
  backgroundColor: C.pageBg,
  display: "flex",
  justifyContent: "center",
  padding: "24px 12px 48px",
  fontFamily: serif,
  color: C.ink,
  WebkitFontSmoothing: "antialiased",
};

const $sheet = {
  width: "100%",
  maxWidth: 760,
  backgroundColor: C.paper,
  padding: "46px 42px 32px",
};

const $masthead = {
  textAlign: "center",
  maxWidth: 660,
  margin: "0 auto",
};

const $eyebrow = {
  fontSize: 12,
  color: C.accent,
  letterSpacing: "0.9px",
  textTransform: "uppercase",
  fontWeight: 700,
  marginBottom: 12,
};

const $title = {
  fontFamily: bask,
  fontSize: "clamp(32px, 5vw, 46px)",
  lineHeight: 1.14,
  letterSpacing: "-0.55px",
  margin: "0 auto",
  maxWidth: 620,
  fontWeight: 700,
  textWrap: "balance",
};

const $lede = {
  fontSize: "clamp(16px, 2.2vw, 19px)",
  lineHeight: 1.5,
  color: C.mid,
  margin: "20px auto 0",
  maxWidth: 610,
};

const $freshnessBox = {
  display: "inline-flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 3,
  borderTop: `1.5px solid ${C.accent}`,
  borderBottom: `1px solid ${C.rule}`,
  padding: "10px 18px 9px",
  margin: "18px auto 0",
};

const $freshnessKicker = {
  fontFamily: serif,
  fontSize: 11.5,
  color: C.accent,
  letterSpacing: "0.55px",
  textTransform: "uppercase",
  fontWeight: 600,
};

const $freshnessText = {
  fontSize: 15,
  color: C.ink,
  fontWeight: 500,
};

const $heroActions = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 10,
  marginTop: 26,
};

const $primaryButton = {
  display: "inline-block",
  color: C.paper,
  backgroundColor: C.accent,
  textDecoration: "none",
  fontSize: 15,
  fontWeight: 700,
  padding: "11px 16px",
};

const $actionNote = {
  fontSize: 13,
  color: C.lt,
  margin: 0,
};

const $sourceBox = {
  borderTop: `1px solid ${C.rule}`,
  padding: "26px 0 0",
  margin: "34px 0 26px",
};

const $sourceHead = {
  fontFamily: serif,
  fontSize: 17,
  fontWeight: 600,
  lineHeight: 1.25,
  margin: "0 0 5px",
};

const $sourceText = {
  fontSize: 14.5,
  color: C.mid,
  lineHeight: 1.45,
  margin: 0,
  maxWidth: 640,
};

const $footer = {
  textAlign: "center",
};

const $footerRule = {
  height: 1,
  backgroundColor: C.rule,
  marginBottom: 10,
};

const $footerText = {
  fontSize: 11,
  color: C.lt,
  fontStyle: "italic",
  lineHeight: 1.45,
  margin: 0,
};
