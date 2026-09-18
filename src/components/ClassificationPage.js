import { useState } from "react";

const events = [
  {
    id: "AL-2841",
    title: "Narmada Refinery - Unit 04",
    className: "Industrial facility / Abnormal",
    tone: "coral",
    layers: [
      ["Source", "Industrial facility", 97, "mint"],
      ["Operating state", "Abnormal", 94, "coral"],
      ["Suspected incident", "Fire", 88, "coral"],
    ],
    summary: "Sudden onset with rising FRP across adjacent industrial pixels.",
    features: [
      ["FRP trend", "+68% / 4h", "coral"],
      ["Persistence", "2 detections / 30d", "amber"],
      ["Industrial context", "Refinery · 42m", "mint"],
      ["Spectral contrast", "ΔT 18.4 K", "coral"],
    ],
  },
  {
    id: "TH-105",
    title: "Mundra flare stack",
    className: "Flare / Normal / persistent",
    tone: "mint",
    layers: [
      ["Source", "Flare", 98, "mint"],
      ["Operating state", "Normal / persistent", 96, "mint"],
      ["Suspected incident", "Unknown", 91, "amber"],
    ],
    summary:
      "Recurring fixed-location heat with a stable operational signature.",
    features: [
      ["FRP trend", "Stable", "mint"],
      ["Persistence", "284d / 365d", "mint"],
      ["Industrial context", "Refinery · 18m", "mint"],
      ["Spectral contrast", "ΔT 9.8 K", "amber"],
    ],
  },
  {
    id: "AL-2839",
    title: "Kutch agricultural edge",
    className: "Agriculture / Elevated",
    tone: "amber",
    layers: [
      ["Source", "Agriculture", 86, "amber"],
      ["Operating state", "Elevated", 79, "amber"],
      ["Suspected incident", "Unknown", 68, "amber"],
    ],
    summary:
      "Seasonal activity outside industrial land cover with broad spread.",
    features: [
      ["FRP trend", "+12% / 4h", "amber"],
      ["Persistence", "3d / 90d", "amber"],
      ["Land cover", "Agriculture", "amber"],
      ["Spatial spread", "2.4 km", "amber"],
    ],
  },
];

const featureGroups = {
  "AL-2841": {
    "FIRMS raw + derived": [
      ["confidence", "94 / 100"], ["satellite / instrument", "NOAA-20 / VIIRS"],
      ["frp", "78.6 MW"], ["log_frp", "4.38"], ["frp_per_km2", "1.92"],
      ["bright_ti31 / ti4 / ti5", "351.8 / 333.4 / 329.1 K"], ["is_high_confidence", "YES"],
      ["scan / track", "0.76 / 0.64"],
    ],
    "Temporal recurrence + trend": [
      ["count_detections_7d / 30d / 365d", "4 / 7 / 7"], ["days_active_365d", "7 / 365"],
      ["time_since_last / first", "46 h / 182 d"], ["mean / max FRP last 5", "41.2 / 78.6 MW"],
      ["frp_trend_5", "+18.4 MW / step"], ["frp_zscore_current", "+2.7"],
      ["confidence_trend", "80% high"], ["month entropy", "0.42"],
    ],
    "OSM spatial context": [
      ["inside_industrial_polygon", "YES"], ["nearest industrial type", "Refinery"],
      ["distance industrial / power", "42 m / 1.8 km"], ["count industrial 1 km", "18"],
      ["distance residential / water", "1.2 km / 680 m"], ["landuse_majority_1km", "Industrial"],
    ],
    "Satellite patch + cluster": [
      ["mean / min / std NBR", "0.08 / -0.24 / 0.11"], ["delta_nbr", "-0.31"],
      ["mean NDVI / NDBI", "0.12 / 0.64"], ["mean / max BT patch", "338 / 371 K"],
      ["bt_contrast / hot pixels", "29 K / 14"], ["num hotspots / max FRP 1 km", "6 / 78.6 MW"],
      ["spatial spread / cluster area", "840 m / 0.41 km²"],
    ],
    "Rule flags": [["is_persistent_candidate", "NO"], ["is_sudden_onset", "YES"], ["is_industrial_context", "YES"], ["is_likely_flare", "NO"]],
  },
  "TH-105": {
    "FIRMS raw + derived": [["confidence", "91 / 100"], ["satellite / instrument", "Suomi-NPP / VIIRS"], ["frp", "16.8 MW"], ["log_frp", "2.88"], ["frp_per_km2", "0.92"], ["bright_ti31 / ti4 / ti5", "343.2 / 333.4 / 330.8 K"], ["is_high_confidence", "YES"], ["scan / track", "0.42 / 0.38"]],
    "Temporal recurrence + trend": [["count_detections_7d / 30d / 365d", "6 / 24 / 284"], ["days_active_365d", "284 / 365"], ["time_since_last / first", "8 h / 730 d"], ["mean / max FRP last 5", "15.8 / 18.2 MW"], ["frp_trend_5", "+0.2 MW / step"], ["frp_zscore_current", "0.4"], ["confidence_trend", "100% high"], ["month entropy", "0.96"]],
    "OSM spatial context": [["inside_industrial_polygon", "YES"], ["nearest industrial type", "Refinery / flare"], ["distance industrial / power", "18 m / 2.2 km"], ["count industrial 1 km", "24"], ["distance residential / water", "2.6 km / 940 m"], ["landuse_majority_1km", "Industrial"]],
    "Satellite patch + cluster": [["mean / min / std NBR", "0.14 / 0.02 / 0.04"], ["delta_nbr", "-0.03"], ["mean NDVI / NDBI", "0.09 / 0.71"], ["mean / max BT patch", "336 / 351 K"], ["bt_contrast / hot pixels", "12 K / 3"], ["num hotspots / max FRP 1 km", "2 / 18.2 MW"], ["spatial spread / cluster area", "120 m / 0.02 km²"]],
    "Rule flags": [["is_persistent_candidate", "YES"], ["is_sudden_onset", "NO"], ["is_industrial_context", "YES"], ["is_likely_flare", "YES"]],
  },
  "AL-2839": {
    "FIRMS raw + derived": [["confidence", "86 / 100"], ["satellite / instrument", "Terra / MODIS"], ["frp", "31.6 MW"], ["log_frp", "3.49"], ["frp_per_km2", "0.76"], ["bright_ti31 / ti4 / ti5", "346.5 / 331.1 / 326.8 K"], ["is_high_confidence", "YES"], ["scan / track", "0.68 / 0.72"]],
    "Temporal recurrence + trend": [["count_detections_7d / 30d / 365d", "3 / 8 / 19"], ["days_active_365d", "19 / 365"], ["time_since_last / first", "192 h / 94 d"], ["mean / max FRP last 5", "20.7 / 31.6 MW"], ["frp_trend_5", "+2.4 MW / step"], ["frp_zscore_current", "+1.1"], ["confidence_trend", "60% high"], ["month entropy", "0.38"]],
    "OSM spatial context": [["inside_industrial_polygon", "NO"], ["nearest industrial type", "None"], ["distance industrial / power", "3.8 km / 12.1 km"], ["count industrial 1 km", "0"], ["distance residential / water", "2.1 km / 4.6 km"], ["landuse_majority_1km", "Agricultural"]],
    "Satellite patch + cluster": [["mean / min / std NBR", "0.42 / 0.18 / 0.16"], ["delta_nbr", "-0.18"], ["mean NDVI / NDBI", "0.58 / 0.08"], ["mean / max BT patch", "329 / 354 K"], ["bt_contrast / hot pixels", "18 K / 9"], ["num hotspots / max FRP 1 km", "11 / 31.6 MW"], ["spatial spread / cluster area", "2.4 km / 2.8 km²"]],
    "Rule flags": [["is_persistent_candidate", "NO"], ["is_sudden_onset", "NO"], ["is_industrial_context", "NO"], ["is_likely_flare", "NO"]],
  },
};

function ClassificationPage({ onNavigate }) {
  const [selected, setSelected] = useState(events[0]);
  const [featurePage, setFeaturePage] = useState("FIRMS raw + derived");
  const featurePageLabels = {
    "FIRMS raw + derived": "FIRMS hotspot",
    "Temporal recurrence + trend": "Temporal behavior",
    "OSM spatial context": "OSM context",
    "Satellite patch + cluster": "Satellite patch",
    "Rule flags": "Decision rules",
  };
  const openFeaturePage = () => {
    setFeaturePage("FIRMS raw + derived");
    window.requestAnimationFrame(() => {
      document.querySelector(".feature-telemetry")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  };
  return (
    <section className="classification-page">
      <div className="classification-hero">
        <div>
          <p className="eyebrow">AI CLASSIFICATION ENGINE</p>
          <h2>Explain every thermal signal.</h2>
          <span>
            FIRMS, satellite, and OSM evidence fused into one operational
            decision.
          </span>
        </div>
        <div className="engine-status">
          <i /> Model online <small>v2.4.1 · 91.8% confidence</small>
        </div>
      </div>
      <div className="classification-workspace">
        <div className="event-selector card">
          <div className="card-head">
            <div>
              <p>INCOMING EVENTS</p>
              <h3>Choose a signal to inspect</h3>
            </div>
            <span className="selector-count">3 reviewed</span>
          </div>
          {events.map((event) => (
            <button
              className={
                "event-option " + (event.id === selected.id ? "selected" : "")
              }
              onClick={() => setSelected(event)}
              key={event.id}
            >
              <i className={event.tone} />
              <div>
                <b>{event.title}</b>
                <span>
                  {event.id} · {event.className}
                </span>
              </div>
              <strong>{event.layers[1][2]}%</strong>
            </button>
          ))}
        </div>
        <div className="decision-panel card">
          <div className="card-head">
            <div>
              <p>EXPLAINABLE DECISION</p>
              <h3>{selected.id}</h3>
            </div>
            <em className={selected.tone}>{selected.layers[1][1]}</em>
          </div>
          <div className="decision-summary">
            <span className={"decision-symbol " + selected.tone}>✦</span>
            <div>
              <h4>{selected.title}</h4>
              <p>{selected.summary}</p>
            </div>
            <strong>{selected.layers[1][2]}<small>% state</small></strong>
          </div>
          <div className="taxonomy-grid">
            {selected.layers.map(([layer, value, confidence, tone]) => (
              <div className="taxonomy-cell" key={layer}>
                <span>{layer}</span>
                <b className={tone}>{value}</b>
                <small>{confidence}% confidence</small>
              </div>
            ))}
          </div>
          <div className="feature-telemetry">
            <div className="feature-telemetry-head">
              <span>CLASSIFICATION FEATURE PAGES</span>
              <small>{Object.values(featureGroups[selected.id]).flat().length} signals fused</small>
            </div>
            <nav className="feature-page-tabs" aria-label="Classification feature pages">
              {Object.keys(featureGroups[selected.id]).map((group) => (
                <button
                  className={featurePage === group ? "active" : ""}
                  onClick={() => setFeaturePage(group)}
                  key={group}
                >
                  {featurePageLabels[group]}
                </button>
              ))}
            </nav>
            <div className="feature-page-content">
              <div className="feature-page-title">
                <h4>{featurePageLabels[featurePage]}</h4>
                <span>{featureGroups[selected.id][featurePage].length} features</span>
              </div>
              <div className="feature-groups">
                <section>
                  <div>
                    {featureGroups[selected.id][featurePage].map(([label, value]) => (
                      <span key={label}><small>{label}</small><b>{value}</b></span>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
          <div className="confidence confidence-large">
            <span>Layer confidence</span>
            <div><i style={{ width: `${selected.layers[1][2]}%` }} /></div>
            <b>{selected.layers[1][2]}%</b>
          </div>
        </div>
      </div>
      <section className="classification-visual card">
        <div className="card-head">
          <div>
            <p>GRAPHICAL CLASSIFICATION FLOW</p>
            <h3>Signal to decision</h3>
          </div>
          <span className="visual-live"><i /> LIVE MODEL</span>
        </div>
        <div className="classification-flow">
          <div className="flow-inputs">
            <div><i className="mint" /> NASA FIRMS <small>FRP + confidence</small></div>
            <div><i className="blue" /> Satellite image <small>spectral signature</small></div>
            <div><i className="amber" /> GIS / OSM <small>land-use context</small></div>
          </div>
          <div className="flow-engine">
            <span className="engine-orbit orbit-one" />
            <span className="engine-orbit orbit-two" />
            <b>AI</b><small>fusion engine</small>
          </div>
          <div className="flow-results">
            {selected.layers.map(([layer, value, confidence, tone]) => (
              <div className={tone} key={layer}><i /> {layer}: {value} <b>{confidence}%</b></div>
            ))}
          </div>
        </div>
      </section>
      <div className="classification-logic">
        <div className="logic-heading">
          <p className="eyebrow">HOW THE MODEL DECIDES</p>
          <h3>Three evidence layers, one inspectable decision.</h3>
        </div>
        <div className="logic-grid">
          <article>
            <span className="logic-number">01</span>
            <div>
              <b>Source identity</b>
              <p>
                Persistent thermal entities, OSM infrastructure evidence, and
                optional radiometric decomposition identify what the site is.
              </p>
            </div>
          </article>
          <article>
            <span className="logic-number">02</span>
            <div>
              <b>Operating state</b>
              <p>
                Anomaly-against-self detection compares each site with its own
                normalized history, not a fixed threshold.
              </p>
            </div>
          </article>
          <article>
            <span className="logic-number">03</span>
            <div>
              <b>Incident and trust</b>
              <p>
                Incident suspicion, exposure priority, drift, and SHAP reasons
                remain explainable and may legitimately be Unknown.
              </p>
            </div>
          </article>
        </div>
      </div>
      <div className="class-output">
        <span className="output-label">MODEL OUTPUT</span>
        <span className="output-line" />
        <b>{selected.layers.map((layer) => layer[1]).join(" · ")}</b>
        <span className="output-arrow">→</span>
        <span className="output-action">
          {selected.layers[2][1] === "Unknown"
            ? "Keep under observation"
            : "Escalate to safety team"}
        </span>
      </div>
      <section className="deliverables-section">
        <div className="logic-heading">
          <p className="eyebrow">EXPECTED SOLUTION / DELIVERABLES</p>
          <h3>Operational intelligence from detection to map overlay.</h3>
        </div>
        <div className="deliverables-grid">
          <button className="deliverable-card" onClick={openFeaturePage}>
            <span className="deliverable-number">01</span>
            <div>
              <b>Fire classification and segregation</b>
              <p>
                Separates source, operating state, and suspected incident type
                using thermal, temporal, and OSM evidence.
              </p>
            </div>
          </button>
          <button className="deliverable-card" onClick={() => onNavigate?.("Live map")}>
            <span className="deliverable-number">02</span>
            <div>
              <b>GIS storage and map overlays</b>
              <p>
                Stores persistent thermal entities with layer confidence,
                exposure priority, drift, and explainable map overlays.
              </p>
            </div>
          </button>
        </div>
      </section>
    </section>
  );
}

export default ClassificationPage;
