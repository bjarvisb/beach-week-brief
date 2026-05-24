export const metadata = {
  title: "Beach Week Brief",
  description:
    "A simple beach-week planning sheet for families. Weather, tides, low-tide walks, swim caution, UV, and beach conditions — updated every morning.",
  openGraph: {
    title: "Beach Week Brief",
    description:
      "The beach-house fridge note, updated every morning. Weather, tides, and beach conditions in one calm planning sheet.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:wght@400;500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          margin: 0,
          backgroundColor: "#eeeeea",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {children}
      </body>
    </html>
  );
}
