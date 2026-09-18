import { signalPulse } from "../data/monitoring";

function SignalPulse() {
  return (
    <div className="signal-pulse" aria-label="Live thermal signal activity">
      {signalPulse.map((height, index) => (
        <i
          key={index}
          style={{
            "--height": `${height}%`,
            animationDelay: `${index * 70}ms`,
          }}
        />
      ))}
      <span />
    </div>
  );
}

export default SignalPulse;
