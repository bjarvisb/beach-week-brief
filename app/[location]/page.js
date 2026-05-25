"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getDisplayName } from "../../lib/beaches";

/*
 * Beach Week Brief — Shared beach page
 *
 * DATA CONTRACT
 * The server-side generator produces brief.json.
 * React is a renderer only. It does not fetch APIs or decide dates.
 *
 * - location.briefDate: local date (America/New_York), e.g. "2026-05-23"
 * - location.generatedAt: ISO timestamp when the brief was generated
 * - location.timezone: "America/New_York"
 * - days: exactly 7 entries — briefDate + next 6 local dates
 * - each day may include sunrise/sunset (string, local time)
 * - surfHeight, ripRisk, uvIndex are today/tomorrow enrichment from NWS SRF
 * - waterTemp is a slow-changing value shown in Today's Detail only
 * - alerts are from NWS active alerts API, deduplicated before render
 */

// Brief data is fetched from /api/brief/[location] at runtime.
// See pages/api/brief/[location].js for the server-side generator.
// Beach configs live in lib/beaches.js — add new beaches there.

// ─── Interpretation ─────────────────────────────────────────────────────────
// Restrained. Helps families read the week. Does not pretend to know the plan.

const ALERT_RANK = [
  "Extreme Wind Warning", "Hurricane Warning", "Tornado Warning",
  "Severe Thunderstorm Warning", "Tropical Storm Warning",
  "Hurricane Watch", "Tornado Watch",
  "High Rip Current Risk", "Beach Hazards Statement",
  "Coastal Flood Warning", "Coastal Flood Advisory", "Coastal Flood Watch",
  "Severe Thunderstorm Watch", "Rip Current Statement", "Marine Weather Statement",
];

function dedupeAlerts(alerts) {
  if (!alerts?.length) return [];
  const sorted = [...alerts].sort((a, b) => {
    const ai = ALERT_RANK.indexOf(a.event), bi = ALERT_RANK.indexOf(b.event);
    return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
  });
  const top = sorted[0];
  if (top.event === "High Rip Current Risk") return [top];
  if (["Extreme", "Severe"].includes(top.severity)) return [top];
  const out = [top];
  for (let i = 1; i < sorted.length && out.length < 2; i++) {
    if (sorted[i].event === top.event) continue;
    if (sorted[i].event === "Beach Hazards Statement" &&
        top.event === "High Rip Current Risk") continue;
    out.push(sorted[i]);
  }
  return out;
}

function sentenceCase(ev) {
  const m = {
    "High Rip Current Risk": "High rip current risk",
    "Beach Hazards Statement": "Beach hazards statement",
    "Coastal Flood Warning": "Coastal flood warning",
    "Coastal Flood Advisory": "Coastal flood advisory",
    "Coastal Flood Watch": "Coastal flood watch",
    "Severe Thunderstorm Warning": "Severe thunderstorm warning",
    "Severe Thunderstorm Watch": "Severe thunderstorm watch",
    "Rip Current Statement": "Rip current statement",
    "Marine Weather Statement": "Marine weather statement",
  };
  return m[ev] || ev;
}
function alertSummary(desc) {
  if (!desc) return null;
  const whatMatch = desc.match(/\*\s*WHAT\.\.\.(.*?)(?:\*|$)/is);
  if (whatMatch) {
    return whatMatch[1].replace(/\.\.\./g, ". ").replace(/\s+/g, " ").trim();
  }
  const first = desc.split(/\.\s/)[0];
  return first ? first.trim().replace(/\.$/, "") + "." : null;
}
function beachRead(day) {
  const rain = day.rainChance || 0;
  const fc = day.shortForecast.toLowerCase();
  const warm = day.high >= 75, mild = day.high >= 68;
  if (rain >= 60) return "Rain likely";
  if (rain >= 40 && fc.includes("storm")) return "Storms possible";
  if (rain >= 30) return "Mixed";
  if (fc.includes("sunny") && warm) return "Good beach weather";
  if (fc.includes("sunny") && mild) return "Good morning";
  if (fc.includes("sunny")) return "Cool but clear";
  if (fc.includes("partly") && warm) return "Good morning";
  if (fc.includes("partly") && mild) return "Mixed";
  if (fc.includes("cloudy") && rain < 20 && mild) return "Mixed";
  if (fc.includes("cloudy") && rain < 20) return "Cool but clear";
  return mild ? "Mixed" : "Cool but clear";
}

function watchNote(day) {
  if (day.ripRisk === "High") return "High rip current risk";
  if (day.ripRisk === "Moderate") return "Moderate rip currents";
  const fc = day.shortForecast.toLowerCase();
  if ((day.rainChance || 0) >= 40 && fc.includes("storm")) return "Storms possible";
  if ((day.rainChance || 0) >= 60) return "Rain likely";
  const wm = day.wind?.match(/(\d+)/);
  if (wm && parseInt(wm[1]) >= 15) return "Windy";
  return null;
}

function timingNote(day) {
  const d = (day.detailedForecast || "").toLowerCase();
  if ((d.includes("after 3pm") || d.includes("after 4pm") || d.includes("this afternoon")) &&
      (d.includes("storm") || d.includes("shower"))) return "Storms later";
  if ((d.includes("before noon") || d.includes("before 11") || d.includes("this morning")) &&
      (d.includes("storm") || d.includes("shower"))) return "Better afternoon";
  if (d.includes("late") && (d.includes("shower") || d.includes("storm"))) return "Showers/storms late";
  return null;
}

// Low-tide walk: 60 min before to 90 min after a daytime low tide.
// Prefer morning. Skip overnight lows.
function tideWalk(tides) {
  if (!tides?.length) return null;
  const lows = tides.filter(t => {
    if (t.type !== "low") return false;
    const h = parseInt(t.time.split(":")[0]);
    return h >= 6 && h <= 19;
  });
  const pick = lows.find(t => parseInt(t.time.split(":")[0]) < 12) || lows[0];
  if (!pick) return null;
  const [hh, mm] = pick.time.split(":").map(Number);
  const c = hh * 60 + mm;
  return `${fm(c - 60)}\u2009–\u2009${fm(c + 90)}`;
}

function fm(m) {
  if (m < 0) m += 1440;
  let h = Math.floor(m / 60) % 24;
  const mn = m % 60;
  const ap = h >= 12 ? "pm" : "am";
  let d = h % 12; if (d === 0) d = 12;
  return `${d}:${String(mn).padStart(2, "0")}\u202F${ap}`;
}

function glance(days, localDate) {
  let easiest = null, eS = -Infinity, bestWalk = null;
  let flex = null, flexR = 0, caution = null;
  days.forEach((d, i) => {
    const rain = d.rainChance || 0;
    const fc = d.shortForecast.toLowerCase();
    const s = (fc.includes("sunny") ? 3 : fc.includes("partly") ? 1 : 0)
            + (d.high > 78 ? 2 : d.high > 70 ? 1 : 0) - rain * 0.06;
    if (s > eS) { eS = s; easiest = d; }
    if (rain > flexR) { flexR = rain; flex = d; }
    if (!bestWalk && rain < 30) { const w = tideWalk(d.tides); if (w) bestWalk = { day: d, w }; }
    if (i === 0 && d.ripRisk === "High") caution = d.date === localDate ? "High rip current risk today" : "High rip current risk " + d.dayOfWeek;
    if (i === 0 && d.ripRisk === "Moderate" && !caution) caution = d.date === localDate ? "Moderate rip currents today" : "Moderate rip currents " + d.dayOfWeek;
  });
  if (!bestWalk) for (const d of days) { const w = tideWalk(d.tides); if (w) { bestWalk = { day: d, w }; break; } }
  return { easiest, bestWalk, flex: flexR >= 40 ? flex : null, caution };
}

function uvText(idx) {
  if (!idx) return null;
  const u = idx.toLowerCase();
  if (u === "very high" || u === "extreme")
    return { level: idx, note: "Plan for sunscreen, shade, and breaks" };
  if (u === "high" || u === "moderate")
    return { level: idx, note: "Plan for sunscreen and shade" };
  return null;
}

function tideFmt(t) {
  const [h, m] = t.split(":");
  const hr = parseInt(h);
  const ap = hr >= 12 ? "pm" : "am";
  const d = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr;
  return `${d}:${m}\u202F${ap}`;
}

function sunFmt(s) {
  return s.toLowerCase().replace(" ", "\u202F");
}

function briefDateFmt(ds) {
  return new Date(ds + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

function shortDate(ds) {
  return new Date(ds + "T12:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function genTimeFmt(iso) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", timeZone: "America/New_York",
  });
}

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 540px)");
    setM(mq.matches);
    const h = (e) => setM(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return m;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function BeachWeekBrief() {
  const { location } = useParams();
  const [b, setB] = useState(null);
  const [error, setError] = useState(null);
  const mob = useIsMobile();

  useEffect(() => {
    fetch(`/api/brief/${location}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load brief");
        return res.json();
      })
      .then((data) => setB(data))
      .catch((err) => setError(err.message));
  }, [location]);

  const displayName = getDisplayName(location);

  // Loading state
  if (!b && !error) {
    return (
      <div style={$page}>
        <div style={{ ...$sheet, padding: mob ? "26px 18px 22px" : "36px 34px 28px" }}>
          <header>
            <h1 style={{ ...$title, fontSize: mob ? 22 : 26 }}>Beach Week Brief</h1>
            <div style={$sub}>{displayName}</div>
            <div style={$rule} />
            <div style={{ ...$date, justifyContent: "center" }}>
              <span style={$upd}>Loading current conditions...</span>
            </div>
          </header>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={$page}>
        <div style={{ ...$sheet, padding: mob ? "26px 18px 22px" : "36px 34px 28px" }}>
          <header>
            <h1 style={{ ...$title, fontSize: mob ? 22 : 26 }}>Beach Week Brief</h1>
            <div style={$sub}>{displayName}</div>
            <div style={$rule} />
            <div style={{ ...$date, justifyContent: "center" }}>
              <span>Conditions temporarily unavailable. Please try again shortly.</span>
            </div>
          </header>
        </div>
      </div>
    );
  }

  const today = b.days[0];
  const localDate = b.location.localDate;
  const isActuallyToday = today?.date === localDate;
  const g = glance(b.days, localDate);
  const alerts = dedupeAlerts(b.alerts);
  const uv = uvText(today?.uvIndex);
  const hasSurf = today?.surfHeight || today?.ripRisk;

  return (
    <div style={$page}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={{ ...$sheet, padding: mob ? "26px 18px 22px" : "36px 34px 28px" }}>

        {/* ── 1. Masthead ── */}
        <header>
          <h1 style={{ ...$title, fontSize: mob ? 22 : 26 }}>Beach Week Brief</h1>
          <div style={$sub}>{b.location.name}, {b.location.region}</div>
          <div style={$rule} />
          <div style={$date}>
            <span>{briefDateFmt(b.location.localDate)}</span>
            <span style={$upd}>Updated {genTimeFmt(b.location.generatedAt)}</span>
          </div>
        </header>

        {/* ── 2. Advisory ── */}
        {alerts.length > 0 && (
          <div style={$adv}>
            <span style={$advLbl}>Active advisory</span>
            <span style={$advBody}>
              {alerts.map((a, i) => (
  <span key={i} style={{ display: "block", marginBottom: i < alerts.length - 1 ? 6 : 0 }}>
    {sentenceCase(a.event)}
    {a.expires && (
      <span style={$advUntil}>
        {" "}until {new Date(a.expires).toLocaleTimeString("en-US", {
          hour: "numeric", minute: "2-digit", timeZone: "America/New_York",
        })}
      </span>
    )}
    {a.description && alertSummary(a.description) && (
      <span style={{ display: "block", fontSize: 12.5, color: C.mid, marginTop: 2, fontWeight: 400 }}>
        {alertSummary(a.description)}
      </span>
    )}
  </span>
))}
            </span>
          </div>
        )}

        {/* ── 3. Week at a Glance ── */}
        <Sec title="Week at a Glance">
          <div style={$gl}>
            {g.easiest && (
              <GR label="Most promising weather"
                val={`${g.easiest.dayOfWeek} — ${g.easiest.high}°, ${g.easiest.shortForecast.toLowerCase()}`} />
            )}
            {g.bestWalk && (
              <GR label="Best low-tide walk"
                val={`${g.bestWalk.day.dayOfWeek}, ${g.bestWalk.w}`} />
            )}
            {g.flex && (
              <GR label="Keep flexible"
                val={`${g.flex.dayOfWeek} — ${g.flex.rainChance}% rain`} />
            )}
            {g.caution && <GR label="Swim caution" val={g.caution} warn />}
          </div>
        </Sec>

        {/* ── 4. 7-Day Planning Sheet ── */}
        <Sec title="7-Day Planning Sheet">
          {mob ? <Cards days={b.days} alerts={alerts} localDate={localDate} /> : <Table days={b.days} alerts={alerts} localDate={localDate} />}
        </Sec>

        {/* ── 5. Today's Detail ── */}
        <Sec title={isActuallyToday ? `Today — ${today.dayOfWeek}, ${shortDate(today.date)}` : `Next beach day — ${today.dayOfWeek}, ${shortDate(today.date)}`}>
          <div style={{ ...$tCols, gridTemplateColumns: mob ? "1fr" : "1fr 1fr" }}>

            {(hasSurf || uv) && (
              <Block head="Beach Conditions">
                {today.surfHeight && <DL l="Surf" v={today.surfHeight} />}
                {today.ripRisk && <DL l="Rip current" v={`${today.ripRisk} risk`}
                  warn={today.ripRisk === "High"} />}
                {uv && <DL l="UV" v={`${uv.level} — ${uv.note}`} />}
                {b.waterTemp && <DL l="Water" v={b.waterTemp} />}
              </Block>
            )}

            {today.tides?.length > 0 && (
              <Block head="Tides">
                {today.tides.map((t, i) => (
                  <div key={i} style={$tRow}>
                    <span style={$tType}>{t.type === "high" ? "High" : "Low"}</span>
                    <span style={$tTime}>{tideFmt(t.time)}</span>
                    <span style={$tHt}>{t.height.toFixed(1)} ft</span>
                  </div>
                ))}
              </Block>
            )}

            <Block head="Weather">
              <DL l="High" v={`${today.high}°F`} />
              <DL l="Wind" v={today.wind} />
              <DL l="Sky" v={today.shortForecast} />
              {today.rainChance != null && today.rainChance > 0 && (
                <DL l="Rain" v={`${today.rainChance}%`} />
              )}
              {timingNote(today) && (
                <div style={$timingLine}>{timingNote(today)}</div>
              )}
            </Block>

            {(today.sunrise || today.sunset) && (
              <Block head="Sun">
                {today.sunrise && <DL l="Sunrise" v={sunFmt(today.sunrise)} />}
                {today.sunset && <DL l="Sunset" v={sunFmt(today.sunset)} />}
              </Block>
            )}
          </div>
        </Sec>

        {/* ── 6. Footer ── */}
        <footer style={$foot}>
          <div style={$footR} />
          <p style={$footSrc}>
            {b.sourceLabels ? `${b.sourceLabels.forecast} · ${b.sourceLabels.tides} · ${b.sourceLabels.surfZone}` : "NWS · NOAA CO-OPS · Surf Zone Forecast"}
          </p>
          <p style={$footSafe}>For planning only. Check conditions before entering the water.</p>
        </footer>
      </div>
    </div>
  );
}

// ─── Desktop table ──────────────────────────────────────────────────────────

function Table({ days, alerts, localDate }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={$tbl}>
        <thead>
          <tr>
            <TH w="16%">Day</TH>
            <TH w="22%">Outlook</TH>
            <TH w="26%">Weather</TH>
            <TH w="19%">Low-tide walk</TH>
            <TH w="17%">Watch</TH>
          </tr>
        </thead>
        <tbody>
          {days.map((d, i) => {
            const isFirst = i === 0;
            const t0 = d.date === localDate;
            const rd = beachRead(d);
            const wt = watchNote(d);
            const wk = tideWalk(d.tides);
            const tn = timingNote(d);
            return (
              <tr key={d.date} style={{
                ...$tr,
                backgroundColor: isFirst ? "rgba(0,0,0,0.022)" : "transparent",
              }}>
                <td style={$td}>
                  <span style={$dayN}>{t0 ? "Today" : d.dayOfWeek}</span>
                  <span style={$dayD}>{shortDate(d.date)}</span>
                </td>
                <td style={$td}>
                  <span style={{ ...$rdLbl, color: rdCol(rd) }}>{rd}</span>
                  {tn && <span style={$tn}>{tn}</span>}
                </td>
                <td style={$td}>
                  <span style={$wx}>{d.high}° {d.shortForecast.toLowerCase()}</span>
                </td>
                <td style={$td}>
                  {wk && <span style={$twCell}>{wk}</span>}
                </td>
                <td style={$td}>
                  {wt && <span style={$wtCell}>{wt}</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function TH({ w, children }) {
  return <th style={{ ...$th, width: w }}>{children}</th>;
}

// ─── Mobile cards ───────────────────────────────────────────────────────────

function Cards({ days, alerts, localDate }) {
  return (
    <div>
      {days.map((d, i) => {
        const isFirst = i === 0;
            const t0 = d.date === localDate;
        const rd = beachRead(d);
        const wt = watchNote(d);
        const wk = tideWalk(d.tides);
        const tn = timingNote(d);
        return (
          <div key={d.date} style={{
            ...$card,
            backgroundColor: isFirst ? "rgba(0,0,0,0.022)" : "transparent",
          }}>
            <div style={$cTop}>
              <div>
                <span style={$cDay}>{t0 ? "Today" : d.dayOfWeek}</span>
                <span style={$cDate}> · {shortDate(d.date)}</span>
              </div>
              <span style={{ ...$cRead, color: rdCol(rd) }}>{rd}</span>
            </div>
            <div style={$cBody}>
              <span style={$cWx}>{d.high}° {d.shortForecast.toLowerCase()}</span>
              {wk && <span style={$cTide}>Low-tide walk: {wk}</span>}
              {tn && <span style={$cTn}>{tn}</span>}
              {wt && <span style={$cWt}>{wt}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Shared pieces ──────────────────────────────────────────────────────────

function Sec({ title, children }) {
  return (
    <section style={$sec}>
      <h2 style={$secH}>{title}</h2>
      {children}
    </section>
  );
}

function Block({ head, children }) {
  return (
    <div style={$blk}>
      <h3 style={$blkH}>{head}</h3>
      <div style={$lines}>{children}</div>
    </div>
  );
}

function GR({ label, val, warn }) {
  return (
    <div style={$gRow}>
      <span style={$gLbl}>{label}</span>
      <span style={{ ...$gVal, color: warn ? C.warn : C.ink }}>{val}</span>
    </div>
  );
}

function DL({ l, v, warn }) {
  return (
    <div style={$dLine}>
      <span style={$dLbl}>{l}</span>
      <span style={{
        ...$dVal,
        color: warn ? C.warn : C.ink,
        fontWeight: warn ? 600 : 400,
      }}>{v}</span>
    </div>
  );
}

function rdCol(r) {
  if (r === "Rain likely" || r === "Storms possible") return C.caution;
  return C.ink;
}

// ─── Palette ────────────────────────────────────────────────────────────────
// Utility paper: less cream, less sepia, more crisp printed sheet.
// Accent used only on location line and header rule accent stripe.
// Caution/warn only for actual caution information.

const C = {
  pageBg:  "#eeeeea",
  paper:   "#fffdf7",
  ink:     "#202020",
  mid:     "#55514a",
  lt:      "#7a746b",
  rule:    "#d6d2c8",
  accent:  "#2f5963",
  caution: "#9a5b16",
  warn:    "#b42318",
};

// ─── Styles ─────────────────────────────────────────────────────────────────

const bask = "'Libre Baskerville', Georgia, serif";
const serif = "'Source Serif 4', Georgia, serif";
const mono = "'IBM Plex Mono', monospace";

const $page = {
  minHeight: "100vh", backgroundColor: C.pageBg, display: "flex",
  justifyContent: "center", padding: "20px 10px 40px",
  fontFamily: serif, color: C.ink, WebkitFontSmoothing: "antialiased",
};
const $sheet = {
  width: "100%", maxWidth: 660, backgroundColor: C.paper,
};

// Masthead
const $title = { fontFamily: bask, fontWeight: 700, letterSpacing: "-0.3px", textAlign: "center", lineHeight: 1.15 };
const $sub = { textAlign: "center", fontSize: 13, color: C.accent, marginTop: 3, letterSpacing: "0.6px", textTransform: "uppercase", fontWeight: 600 };
const $rule = { height: 2, backgroundColor: C.ink, margin: "12px 0 7px" };
const $date = { display: "flex", justifyContent: "space-between", fontSize: 12, color: C.lt, flexWrap: "wrap", gap: 4, marginBottom: 22 };
const $upd = { fontStyle: "italic" };

// Advisory
const $adv = { borderLeft: `2.5px solid ${C.caution}`, padding: "10px 14px", marginBottom: 22, backgroundColor: "rgba(154,91,22,0.04)", lineHeight: 1.5, display: "flex", flexDirection: "column", gap: 3 };
const $advLbl = { fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: C.caution };
const $advBody = { fontSize: 14, color: "#6b4310", fontWeight: 500 };
const $advUntil = { fontWeight: 400, color: C.caution };

// Sections
const $sec = { marginBottom: 24 };
const $secH = { fontFamily: bask, fontSize: 15, fontWeight: 700, letterSpacing: "-0.2px", paddingBottom: 5, borderBottom: `1.5px solid ${C.ink}`, marginBottom: 10 };

// Glance
const $gl = { display: "flex", flexDirection: "column" };
const $gRow = { display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 14, lineHeight: 1.5, padding: "6px 0", borderBottom: `1px dotted ${C.rule}`, gap: 12 };
const $gLbl = { color: C.mid, fontSize: 13, flexShrink: 0 };
const $gVal = { textAlign: "right" };

// Table
const $tbl = { width: "100%", borderCollapse: "collapse", fontSize: 13.5, lineHeight: 1.45 };
const $th = { textAlign: "left", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: C.mid, padding: "0 6px 5px", borderBottom: `1.5px solid ${C.ink}`, whiteSpace: "nowrap" };
const $tr = { borderBottom: `1px solid ${C.rule}` };
const $td = { padding: "9px 6px", verticalAlign: "top" };
const $dayN = { display: "block", fontWeight: 600, fontSize: 14 };
const $dayD = { display: "block", fontSize: 11, color: C.lt, marginTop: 1 };
const $rdLbl = { fontSize: 13.5, fontWeight: 600, display: "block", lineHeight: 1.35 };
const $tn = { display: "block", fontSize: 11.5, color: C.mid, fontStyle: "italic", marginTop: 2 };
const $wx = { fontSize: 12.5, color: C.mid, lineHeight: 1.4 };
const $twCell = { fontSize: 12, fontFamily: mono, color: C.mid, lineHeight: 1.4 };
const $wtCell = { fontSize: 12, color: C.warn, fontWeight: 500, lineHeight: 1.4 };

// Cards
const $card = { padding: "11px 2px", borderBottom: `1px solid ${C.rule}` };
const $cTop = { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 };
const $cDay = { fontWeight: 600, fontSize: 14.5 };
const $cDate = { fontSize: 12, color: C.lt };
const $cRead = { fontSize: 14, fontWeight: 600, textAlign: "right", flexShrink: 0 };
const $cBody = { display: "flex", flexDirection: "column", gap: 3 };
const $cWx = { fontSize: 13, color: C.mid };
const $cTide = { fontSize: 12.5, fontFamily: mono, color: C.mid };
const $cTn = { fontSize: 12, color: C.mid, fontStyle: "italic" };
const $cWt = { fontSize: 12.5, color: C.warn, fontWeight: 500 };

// Today
const $tCols = { display: "grid", gap: "14px 22px" };
const $blk = { marginBottom: 2 };
const $blkH = { fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", color: C.mid, marginBottom: 7 };
const $lines = { display: "flex", flexDirection: "column" };
const $dLine = { display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 13.5, padding: "4px 0", borderBottom: `1px dotted ${C.rule}` };
const $dLbl = { color: C.mid, fontSize: 12.5, flexShrink: 0, marginRight: 8 };
const $dVal = { textAlign: "right", fontFamily: mono, fontSize: 12.5 };
const $timingLine = { fontSize: 12, color: C.mid, fontStyle: "italic", padding: "5px 0 0" };
const $tRow = { display: "flex", alignItems: "baseline", fontSize: 13.5, padding: "4px 0", borderBottom: `1px dotted ${C.rule}` };
const $tType = { width: 34, color: C.mid, fontSize: 12.5, flexShrink: 0 };
const $tTime = { fontFamily: mono, fontSize: 12.5, width: 78, flexShrink: 0 };
const $tHt = { fontFamily: mono, fontSize: 11.5, color: C.lt };

// Footer
const $foot = { marginTop: 6 };
const $footR = { height: 1.5, backgroundColor: C.ink, marginBottom: 10 };
const $footSrc = { fontSize: 10.5, color: C.lt, textAlign: "center", lineHeight: 1.5 };
const $footSafe = { fontSize: 10, color: C.lt, textAlign: "center", fontStyle: "italic", marginTop: 3 };
