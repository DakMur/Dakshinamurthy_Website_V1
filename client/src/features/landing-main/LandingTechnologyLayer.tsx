import { memo } from "react";
import biomedicalDisplay from "../../assets/landing/Technology/biomedical-display.webp";
import drone from "../../assets/landing/Technology/drone-display.webp";
import laptop from "../../assets/landing/Technology/laptop-display.webp";
import oscilloscope from "../../assets/landing/Technology/oscilloscope-display.webp";
import roboticLeftArm from "../../assets/landing/Technology/robotic-left-arm.webp";
import roboticRightArm from "../../assets/landing/Technology/robotic-right-arm.webp";
import visionDetector from "../../assets/landing/Technology/vision-detector-display.webp";

/**
 * Technology ecosystem layer — remaining assets share the drone /
 * Shankaracharya ethereal stack (aura, radial fade, grade, float).
 */
const LandingTechnologyLayer = memo(function LandingTechnologyLayer() {
  return (
    <div className="ltl-root" aria-hidden="true">

      <svg className="ltl-links" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path className="ltl-link ltl-link-1" pathLength="100" d="M20 84 C 26 79, 31 75, 37 73" />
        <path className="ltl-link ltl-link-2" pathLength="100" d="M85 31 C 87 39, 86 47, 83 53" />
      </svg>

      {/* ── UPPER-LEFT: Drone ── */}
      <div className="ltl-item ltl-drone-wrap" aria-hidden="true">
        <div className="ltl-drone-aura" />
        <div className="ltl-drone-ether">
          <img src={drone} className="ltl-img ltl-drone" alt="" width={640} height={360} draggable={false} fetchPriority="low" decoding="async" />
        </div>
      </div>

      {/* ── LEFT-MIDDLE: Vision Detector ── */}
      <div className="ltl-item ltl-visdet-wrap" aria-hidden="true">
        <div className="ltl-drone-aura" />
        <div className="ltl-drone-ether">
          <img src={visionDetector} className="ltl-img ltl-visdet" alt="" width={640} height={426} draggable={false} fetchPriority="low" decoding="async" />
        </div>
      </div>

      {/* ── FAR LEFT: Industrial Robotic Arm ── */}
      <div className="ltl-item ltl-left-arm-wrap" aria-hidden="true">
        <div className="ltl-drone-aura" />
        <div className="ltl-drone-ether">
          <img src={roboticRightArm} className="ltl-img ltl-left-arm" alt="" width={1175} height={1338} draggable={false} fetchPriority="low" decoding="async" />
        </div>
      </div>

      {/* ── LOWER-LEFT FLOOR: Oscilloscope ── */}
      <div className="ltl-item ltl-scope-wrap" aria-hidden="true">
        <div className="ltl-drone-aura" />
        <div className="ltl-drone-ether">
          <img src={oscilloscope} className="ltl-img ltl-scope" alt="" width={640} height={426} draggable={false} fetchPriority="low" decoding="async" />
        </div>
      </div>

      {/* ── LOWER-CENTER-RIGHT: AI Engineering Laptop ── */}
      <div className="ltl-item ltl-laptop-wrap" aria-hidden="true">
        <div className="ltl-drone-aura" />
        <div className="ltl-drone-ether">
          <img src={laptop} className="ltl-img ltl-laptop" alt="" width={640} height={426} draggable={false} fetchPriority="low" decoding="async" />
        </div>
      </div>

      {/* ── UPPER-RIGHT: Biomedical Display ── */}
      <div className="ltl-item ltl-biomedical-wrap" aria-hidden="true">
        <div className="ltl-drone-aura" />
        <div className="ltl-drone-ether">
          <img src={biomedicalDisplay} className="ltl-img ltl-biomedical" alt="" width={1520} height={1035} draggable={false} fetchPriority="low" decoding="async" />
        </div>
      </div>

      {/* ── FAR RIGHT: Industrial Robotic Arm ── */}
      <div className="ltl-item ltl-right-arm-wrap" aria-hidden="true">
        <div className="ltl-drone-aura" />
        <div className="ltl-drone-ether">
          <img src={roboticLeftArm} className="ltl-img ltl-right-arm" alt="" width={1175} height={1338} draggable={false} fetchPriority="low" decoding="async" />
        </div>
      </div>

    </div>
  );
});

export default LandingTechnologyLayer;
