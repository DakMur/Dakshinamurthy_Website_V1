import { memo, type CSSProperties } from "react";
import biomedicalDisplay from "../../assets/landing/Technology/biomedical-display.png";
import drone from "../../assets/landing/Technology/drone.png";
import ecgMonitor from "../../assets/landing/Technology/ecg-monitor.png";
import laptop from "../../assets/landing/Technology/laptop.png";
import oscilloscope from "../../assets/landing/Technology/oscilloscope.png";
import roboticLeftArm from "../../assets/landing/Technology/robotic-left-arm.png";
import roboticRightArm from "../../assets/landing/Technology/robotic-right-arm.png";
import visionCamera from "../../assets/landing/Technology/vision-camera.png";
import visionDetector from "../../assets/landing/Technology/vision-detector.png";

type TraceVariant = "strong" | "soft";

function exhibitVars(src: string, delay: string, duration: string): CSSProperties {
  return {
    "--ltl-src": `url("${src}")`,
    "--ltl-trace-delay": delay,
    "--ltl-trace-duration": duration,
  } as CSSProperties;
}

function LtlGoldTrace({ variant = "strong" }: { variant?: TraceVariant }) {
  return (
    <div className={`ltl-trace ltl-trace-${variant}`}>
      <div className="ltl-trace-clip">
        <div className="ltl-trace-bloom" />
        <div className="ltl-trace-ring" />
      </div>
      <div className="ltl-trace-head-clip">
        <div className="ltl-trace-head-bloom" />
        <div className="ltl-trace-head" />
      </div>
    </div>
  );
}

function LtlCheckpoints() {
  return (
    <div className="ltl-checkpoints">
      <span className="ltl-cp ltl-cp-1" />
      <span className="ltl-cp ltl-cp-2" />
      <span className="ltl-cp ltl-cp-3" />
    </div>
  );
}

/**
 * Realistic Technology Ecosystem Layer
 *
 * Interactive cinematic hardware exhibition:
 *   UPPER-LEFT  → Drone (airborne hover, interactive gold tracer)
 *   MID-LEFT    → Vision detector screen (interactive screen with green/gold illumination)
 *   FAR LEFT    → Robotic arm (interactive bottom-left anchor with joint tracing)
 *   LOWER-LEFT  → Oscilloscope (grounded floor) + ECG monitor (grounded midground)
 *   LOWER-CTR   → AI laptop (grounded standalone below Explore with reflection sheen)
 *   MID-RIGHT   → Vision camera sensor (restrained optical sensor)
 *   UPPER-RIGHT → Biomedical signal analysis display (interactive screen with cyan/gold illumination)
 *   FAR RIGHT   → Robotic arm (interactive bottom-right anchor with joint tracing)
 *
 * Positioned absolute, pointer-events: none on root, pointer-events: auto on interactive items.
 */
const LandingTechnologyLayer = memo(function LandingTechnologyLayer() {
  return (
    <div className="ltl-root" aria-hidden="true">

      <svg className="ltl-links" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path className="ltl-link ltl-link-1" pathLength="100" d="M20 84 C 26 79, 31 75, 37 73" />
        <path className="ltl-link ltl-link-2" pathLength="100" d="M85 31 C 87 39, 86 47, 83 53" />
      </svg>

      {/* ── UPPER-LEFT: Drone (Airborne, below logos) ── */}
      <div className="ltl-item ltl-drone-wrap ltl-interactive ltl-interactive-drone" tabIndex={-1} style={exhibitVars(drone, "4.5s", "9s")}>
        <LtlGoldTrace />
        <LtlCheckpoints />
        <div className="ltl-status-beacon ltl-beacon-drone" />
        <img src={drone} className="ltl-img ltl-drone ltl-left-grade" alt="" draggable={false} loading="eager" decoding="async" />
      </div>

      {/* ── LEFT-MIDDLE: Vision Detector Screen ── */}
      <div className="ltl-item ltl-visdet-wrap ltl-interactive ltl-interactive-visdet" tabIndex={-1} style={exhibitVars(visionDetector, "2s", "8.2s")}>
        <LtlGoldTrace />
        <LtlCheckpoints />
        <div className="ltl-scan" />
        <span className="ltl-tag">VISION</span>
        <div className="ltl-status-beacon ltl-beacon-visdet" />
        <div className="ltl-shadow ltl-shadow-screen" />
        <div className="ltl-screen-glow ltl-glow-green" />
        <img src={visionDetector} className="ltl-img ltl-visdet ltl-left-grade" alt="" draggable={false} loading="eager" decoding="async" />
      </div>

      {/* ── FAR LEFT: Industrial Robotic Arm (Bottom-Left Corner Anchor) ── */}
      <div className="ltl-item ltl-left-arm-wrap ltl-interactive ltl-interactive-arm-left" tabIndex={-1} style={exhibitVars(roboticRightArm, "0s", "8s")}>
        <LtlGoldTrace />
        <LtlCheckpoints />
        <div className="ltl-status-beacon ltl-beacon-arm-left" />
        <div className="ltl-floor-reflection ltl-refl-arm" />
        <div className="ltl-shadow ltl-shadow-arm" />
        <img src={roboticRightArm} className="ltl-img ltl-left-arm ltl-left-grade" alt="" draggable={false} loading="eager" decoding="async" />
      </div>

      {/* ── LOWER-LEFT FLOOR: Oscilloscope ── */}
      <div className="ltl-item ltl-scope-wrap ltl-interactive ltl-interactive-scope" tabIndex={-1} style={exhibitVars(oscilloscope, "1s", "7.6s")}>
        <LtlGoldTrace />
        <LtlCheckpoints />
        <div className="ltl-scan" />
        <div className="ltl-status-beacon ltl-beacon-scope" />
        <div className="ltl-floor-reflection ltl-refl-scope" />
        <div className="ltl-shadow ltl-shadow-scope" />
        <div className="ltl-screen-glow ltl-glow-scope" />
        <img src={oscilloscope} className="ltl-img ltl-scope ltl-left-grade" alt="" draggable={false} loading="eager" decoding="async" />
      </div>

      {/* ── LOWER-LEFT ELEVATED: ECG Monitor ── */}
      <div className="ltl-item ltl-ecg-wrap ltl-interactive ltl-interactive-ecg" tabIndex={-1} style={exhibitVars(ecgMonitor, "2.8s", "7.8s")}>
        <LtlGoldTrace />
        <LtlCheckpoints />
        <div className="ltl-status-beacon ltl-beacon-ecg" />
        <div className="ltl-floor-reflection ltl-refl-ecg" />
        <div className="ltl-shadow ltl-shadow-screen" />
        <div className="ltl-screen-glow ltl-glow-cyan" />
        <img src={ecgMonitor} className="ltl-img ltl-ecg ltl-left-grade" alt="" draggable={false} loading="eager" decoding="async" />
      </div>

      {/* ── LOWER-CENTER-RIGHT: AI Engineering Laptop ── */}
      <div className="ltl-item ltl-laptop-wrap ltl-interactive ltl-interactive-laptop" tabIndex={-1} style={exhibitVars(laptop, "3s", "7.5s")}>
        <LtlGoldTrace />
        <LtlCheckpoints />
        <div className="ltl-scan" />
        <span className="ltl-tag">AI SYSTEM</span>
        <div className="ltl-status-beacon ltl-beacon-laptop" />
        <div className="ltl-floor-reflection ltl-refl-laptop" />
        <div className="ltl-shadow ltl-shadow-laptop" />
        <div className="ltl-screen-glow ltl-glow-ai" />
        <img src={laptop} className="ltl-img ltl-laptop ltl-center-grade" alt="" draggable={false} loading="eager" decoding="async" />
      </div>

      {/* ── RIGHT-MIDDLE: Vision Camera Sensor ── */}
      <div className="ltl-item ltl-cam-wrap" tabIndex={-1} style={exhibitVars(visionCamera, "5s", "10s")}>
        <LtlGoldTrace variant="soft" />
        <div className="ltl-shadow ltl-shadow-small" />
        <img src={visionCamera} className="ltl-img ltl-cam ltl-right-grade" alt="" draggable={false} loading="eager" decoding="async" />
      </div>

      {/* ── UPPER-RIGHT: Biomedical Display ── */}
      <div className="ltl-item ltl-biomedical-wrap ltl-interactive ltl-interactive-biomedical" tabIndex={-1} style={exhibitVars(biomedicalDisplay, "3.8s", "8.4s")}>
        <LtlGoldTrace />
        <LtlCheckpoints />
        <div className="ltl-scan" />
        <span className="ltl-tag">BIOMED</span>
        <div className="ltl-status-beacon ltl-beacon-biomedical" />
        <div className="ltl-shadow ltl-shadow-screen" />
        <div className="ltl-screen-glow ltl-glow-cyan" />
        <img src={biomedicalDisplay} className="ltl-img ltl-biomedical ltl-right-grade" alt="" draggable={false} loading="eager" decoding="async" />
      </div>

      {/* ── FAR RIGHT: Industrial Robotic Arm (Bottom-Right Anchor) ── */}
      <div className="ltl-item ltl-right-arm-wrap ltl-interactive ltl-interactive-arm-right" tabIndex={-1} style={exhibitVars(roboticLeftArm, "1.5s", "8.5s")}>
        <LtlGoldTrace />
        <LtlCheckpoints />
        <div className="ltl-status-beacon ltl-beacon-arm-right" />
        <div className="ltl-floor-reflection ltl-refl-arm" />
        <div className="ltl-shadow ltl-shadow-arm" />
        <img src={roboticLeftArm} className="ltl-img ltl-right-arm ltl-right-grade" alt="" draggable={false} loading="eager" decoding="async" />
      </div>

    </div>
  );
});

export default LandingTechnologyLayer;
