import { useState } from "react";

const sourceRows = [
  [
    "NASA FIRMS / VIIRS",
    "Thermal anomalies, FRP, confidence",
    "Live",
    "4 min ago",
    "mint",
  ],
  [
    "OpenStreetMap + GIS",
    "Industrial zones, facilities, assets",
    "Synced",
    "2 hr ago",
    "blue",
  ],
  [
    "Sentinel-2 imagery",
    "Multispectral scene confirmation",
    "Healthy",
    "18 min ago",
    "amber",
  ],
  [
    "Landsat thermal archive",
    "Historical land surface temperature",
    "Healthy",
    "Yesterday",
    "mint",
  ],
];

export function AnalyticsPage() {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [activeMix, setActiveMix] = useState(null);
  const mix = [
    { name: "Industrial fire", value: "12%", count: "46", tone: "coral" },
    { name: "Persistent source", value: "31%", count: "119", tone: "mint" },
    { name: "Other / natural", value: "57%", count: "219", tone: "amber" },
  ];
  const trendPoints = [
    ["01 AUG", 42, 31], ["05 AUG", 57, 44], ["08 AUG", 46, 36],
    ["12 AUG", 73, 56], ["15 AUG", 59, 42], ["18 AUG", 71, 61],
    ["22 AUG", 63, 50], ["26 AUG", 88, 73], ["30 AUG", 82, 77],
  ];
  const updateHover = (event) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const position = Math.max(0, Math.min(0.999, (event.clientX - left) / width));
    setHoveredPoint(Math.round(position * (trendPoints.length - 1)));
  };
  return (
    <section className="mission-page">
      <div className="mission-heading">
        <div>
          <p className="eyebrow">AI DECISION INTELLIGENCE</p>
          <h2>Classification performance</h2>
          <span>
            How the model separates industrial incidents from persistent and
            natural heat.
          </span>
        </div>
        <button className="date-button">Last 30 days ▾</button>
      </div>
      <div className="classification-grid">
        <article className="class-chart card">
          <div className="card-head">
            <div>
              <p>EVENT SEGREGATION</p>
              <h3>Thermal source mix</h3>
            </div>
            <span className="chart-total">100%</span>
          </div>
          <div className={"donut " + (activeMix ? `mix-${activeMix.tone}` : "") }>
            <div>
              <strong>{activeMix ? activeMix.count : "384"}</strong>
              <small>{activeMix ? activeMix.name : "events reviewed"}</small>
            </div>
          </div>
          <div className="class-legend">
            {mix.map((item) => (
              <button
                className={activeMix?.tone === item.tone ? "active" : ""}
                onMouseEnter={() => setActiveMix(item)}
                onMouseLeave={() => setActiveMix(null)}
                onFocus={() => setActiveMix(item)}
                onBlur={() => setActiveMix(null)}
                onClick={() => setActiveMix(activeMix?.tone === item.tone ? null : item)}
                key={item.tone}
              >
                <i className={item.tone} /> {item.name} <b>{item.value}</b>
              </button>
            ))}
          </div>
        </article>
        <article className="model-card card">
          <div className="card-head">
            <div>
              <p>MODEL QUALITY</p>
              <h3>Detection confidence</h3>
            </div>
            <span className="model-badge">v2.4.1</span>
          </div>
          <div className="quality-score">
            <strong>91.8</strong>
            <span>/ 100</span>
          </div>
          <div className="quality-bar">
            <i />
          </div>
          <div className="quality-stats">
            <span>
              <b>94.2%</b> precision
            </span>
            <span>
              <b>88.7%</b> recall
            </span>
            <span>
              <b>0.91</b> F1 score
            </span>
          </div>
          <div className="model-note">
            <i /> Retrained 3 days ago with 1,240 reviewed events
          </div>
          <div className="model-live"><i /> LIVE TELEMETRY</div>
        </article>
      </div>
      <div className="trend-card card">
        <div className="card-head">
          <div>
            <p>ANOMALY ACTIVITY</p>
            <h3>Signal volume and model response</h3>
          </div>
          <div className="trend-key">
            <span>
              <i className="coral" /> Detected anomalies
            </span>
            <span>
              <i className="mint" /> Confirmed events
            </span>
          </div>
        </div>
        <div className="trend-graph" onMouseMove={updateHover} onMouseLeave={() => setHoveredPoint(null)}>
          <div className="graph-grid" />
          <svg viewBox="0 0 900 190" preserveAspectRatio="none">
            <defs>
              <linearGradient id="anomalyFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ff6653" stopOpacity=".22" />
                <stop offset="100%" stopColor="#ff6653" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              className="area-path"
              d="M0 150 C70 145 90 105 150 119 S220 168 280 108 S350 95 420 112 S500 63 550 91 S640 102 700 55 S790 76 900 35 V190 H0Z"
            />
            <path
              className="line-path coral-line"
              d="M0 150 C70 145 90 105 150 119 S220 168 280 108 S350 95 420 112 S500 63 550 91 S640 102 700 55 S790 76 900 35"
            />
            <path
              className="line-path mint-line"
              d="M0 168 C70 158 90 133 150 144 S220 170 280 137 S350 122 420 142 S500 88 550 119 S640 127 700 91 S790 105 900 69"
            />
          </svg>
          {hoveredPoint !== null && (
            <div className="graph-inspector" style={{ left: `${(hoveredPoint / (trendPoints.length - 1)) * 100}%` }}>
              <i />
              <div>
                <b>{trendPoints[hoveredPoint][0]}</b>
                <span><em className="coral" /> {trendPoints[hoveredPoint][1]} anomalies</span>
                <span><em className="mint" /> {trendPoints[hoveredPoint][2]} confirmed</span>
              </div>
            </div>
          )}
          <div className="graph-labels">
            <span>01 AUG</span>
            <span>08 AUG</span>
            <span>15 AUG</span>
            <span>22 AUG</span>
            <span>30 AUG</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DataSourcesPage() {
  return (
    <section className="mission-page">
      <div className="mission-heading">
        <div>
          <p className="eyebrow">INGESTION CONTROL</p>
          <h2>Data sources</h2>
          <span>
            Monitor the health and freshness of every layer behind the
            intelligence engine.
          </span>
        </div>
        <button className="sync-button">↻ Sync all sources</button>
      </div>
      <div className="source-summary">
        <div className="source-summary-item">
          <span className="source-icon">◉</span>
          <div>
            <b>4 / 4</b>
            <small>Sources healthy</small>
          </div>
        </div>
        <div className="source-summary-item">
          <span className="source-icon amber-icon">⌁</span>
          <div>
            <b>2,847</b>
            <small>Signals ingested today</small>
          </div>
        </div>
        <div className="source-summary-item">
          <span className="source-icon blue-icon">◇</span>
          <div>
            <b>98.6%</b>
            <small>Pipeline availability</small>
          </div>
        </div>
      </div>
      <div className="sources-table card">
        <div className="source-table-head">
          <span>CONNECTED SOURCE</span>
          <span>DATA PAYLOAD</span>
          <span>STATUS</span>
          <span>LAST UPDATE</span>
        </div>
        {sourceRows.map((row) => (
          <div className="source-row" key={row[0]}>
            <div className="source-name">
              <span className={"source-symbol " + row[4]}>◈</span>
              <b>{row[0]}</b>
            </div>
            <span className="source-payload">{row[1]}</span>
            <span className={"source-status " + row[4]}>
              <i /> {row[2]}
            </span>
            <span className="source-time">{row[3]}</span>
            <button className="source-more">···</button>
          </div>
        ))}
      </div>
      <div className="ingest-foot">
        <span>
          <i /> Automatic refresh enabled
        </span>
        <span>
          Retention window <b>24 months</b>
        </span>
        <span>
          Storage <b>PostGIS / object store</b>
        </span>
      </div>
    </section>
  );
}
