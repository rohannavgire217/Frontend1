import { useEffect, useState } from "react";

const scenarios = [
  { id: "flare", name: "Refinery flare", zone: "Industrial refinery", type: "Persistent industrial thermal source", confidence: 96, priority: "NORMAL OPERATION", tone: "mint", history: "Repeated at the same coordinate across six observations.", context: ["Industrial zone", "Flare stack 18 m", "Stable FRP"], note: "Same anomaly + recurring fixed location = persistent source." },
  { id: "storage", name: "Storage tank", zone: "Industrial storage area", type: "Potential abnormal industrial event", confidence: 91, priority: "HIGH PRIORITY", tone: "coral", history: "No previous anomaly; new heat source beside storage assets.", context: ["Industrial zone", "Tank farm 12 m", "Rapid onset"], note: "Same anomaly + new industrial location = abnormal event." },
  { id: "forest", name: "Forest edge", zone: "Vegetation / forest", type: "Potential forest / natural fire", confidence: 89, priority: "SPREAD RISK", tone: "amber", history: "New anomaly with an expanding local footprint.", context: ["Forest cover", "No industrial POI", "Spatial spread"], note: "Same anomaly + forest context = natural-fire response." },
  { id: "farm", name: "Crop field", zone: "Agricultural land", type: "Potential agricultural burning", confidence: 84, priority: "REVIEW", tone: "amber", history: "Recurring seasonal activity over cultivated land.", context: ["Agricultural cover", "No industrial POI", "Seasonal recurrence"], note: "Same anomaly + seasonal farmland pattern = agricultural burning." },
];

export default function ScenarioLab() {
  const [scenario, setScenario] = useState(scenarios[0]);
  const [step, setStep] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);
  useEffect(() => {
    if (!isSimulating || step >= 6) {
      if (step >= 6) setIsSimulating(false);
      return undefined;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 900);
    return () => window.clearTimeout(timer);
  }, [isSimulating, step]);
  const activate = (item) => {
    setScenario(item);
    setStep(1);
    setIsSimulating(false);
  };
  const toggleSimulation = () => {
    if (step >= 6) setStep(1);
    setIsSimulating((current) => !current);
  };
  return <section className="scenario-lab mission-page">
    <div className="mission-heading">
      <div><p className="eyebrow">PS 162 / PHYSICAL ANALOGUE DEMO</p><h2>Same anomaly. Different meaning.</h2><span>Move one identical simulated thermal signal between contexts to show why spatial history matters.</span></div>
      <span className="lab-live"><i /> DEMO READY</span>
    </div>
    <div className="lab-grid">
      <section className="scenario-board card">
        <div className="card-head"><div><p>MINI EARTH / CONTEXT MAP</p><h3>{scenario.zone}</h3></div><span className={"scenario-priority " + scenario.tone}>{scenario.priority}</span></div>
        <div className={"mini-earth " + scenario.id}>
          <span className="map-zone forest-zone">FOREST</span><span className="map-zone farm-zone">FARM</span><span className="map-zone industry-zone">INDUSTRY</span><span className="map-zone storage-zone">STORAGE</span>
          <div className={"anomaly-point " + scenario.tone}><i /><b /></div>
          {scenario.id === "storage" && step > 1 && <><div className="expansion e1" /><div className="expansion e2" /></>}
          {scenario.id === "forest" && step > 1 && <><div className="expansion e1" /><div className="expansion e2" /><div className="expansion e3" /></>}
          <div className="camera-readout">CAMERA / ANOMALY x:438 y:291</div>
        </div>
        <p className="analogue-note"><b>Demo principle:</b> the light stays identical; only location and observation history change.</p>
      </section>
      <section className="scenario-result card">
        <p className="eyebrow">CONTEXTUAL CLASSIFICATION</p><div className="result-title"><span className={scenario.tone}>✦</span><div><small>THERMAL ANOMALY DETECTED</small><h3>{scenario.type}</h3></div><b>{scenario.confidence}<small>%</small></b></div>
        <div className="context-chips">{scenario.context.map((item) => <span key={item}>{item}</span>)}</div>
        <div className="observation-timeline"><div><b>Observation history</b><span>{scenario.history}</span></div><ol>{[1,2,3,4,5,6].map((item) => <li className={item <= step || scenario.id === "flare" || scenario.id === "farm" ? "seen" : ""} key={item}><i />T{item}</li>)}</ol></div>
        <div className="result-explanation"><i />{scenario.note}</div>
        <button className={"simulate-button " + (isSimulating ? "is-running" : "")} onClick={toggleSimulation}>
          {isSimulating ? "Pause simulation" : step >= 6 ? "Replay simulation" : "Simulate observations"}
          <span>{isSimulating ? "Ⅱ" : "→"}</span>
        </button>
      </section>
    </div>
    <section className="scenario-picker"><p className="eyebrow">CHOOSE WHERE THE SAME ANOMALY APPEARS</p><div>{scenarios.map((item) => <button className={scenario.id === item.id ? "selected" : ""} onClick={() => activate(item)} key={item.id}><i className={item.tone} /><b>{item.name}</b><span>{item.zone}</span></button>)}</div></section>
  </section>;
}
