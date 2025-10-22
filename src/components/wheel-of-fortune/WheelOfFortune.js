'use client';

import { useState, useEffect, useRef } from 'react';
import Wheel from './Wheel';
import CenterButton from './CenterButton';
import Pointer from './Pointer';
import Fish from './Fish';

export default function WheelOfFortune({ isSpinning, result, onReset, onWheelClick }) {
  const [showFish, setShowFish] = useState(false);
  const [fishSwimming, setFishSwimming] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [fishTopPx, setFishTopPx] = useState(null);
  const isClickable = !isSpinning;

  // rAF-based spinning
  const rafIdRef = useRef(null);
  const lastTimeRef = useRef(0);
  const rotationRef = useRef(0);
  const wheelRef = useRef(null);

  useEffect(() => {
    if (!isSpinning) return;

    const rect = wheelRef.current?.getBoundingClientRect();
    if (rect) {
      setFishTopPx(rect.top + rect.height / 2);
    } else {
      setFishTopPx(window.innerHeight / 2);
    }

    const fishDurationMs = 1600;
    const reachFraction = 0.5;
    const accelMs = 600;
    const constSpinMs = 2600;
    const decelMs = 2200;
    const omega = 360 * (1.2 + Math.random() * 0.3);

    setShowFish(true);
    setFishSwimming(true);

    const spinStartTimer = setTimeout(() => {
      startSpin(omega, accelMs, constSpinMs, decelMs);
    }, fishDurationMs * reachFraction);

    const fishHideTimer = setTimeout(() => {
      setFishSwimming(false);
      setShowFish(false);
    }, fishDurationMs);

    return () => {
      clearTimeout(spinStartTimer);
      clearTimeout(fishHideTimer);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isSpinning]);

  function startSpin(omegaDegPerSec, accelMs, constMs, decelMs) {
    const accelStart = performance.now();
    lastTimeRef.current = accelStart;

    function accelStep(now) {
      const elapsed = now - accelStart;
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      const f = Math.min(1, elapsed / accelMs);
      const easeInCubic = (t) => t * t * t;
      const speed = omegaDegPerSec * easeInCubic(f);
      rotationRef.current = rotationRef.current + speed * dt;
      setWheelRotation(rotationRef.current);
      if (elapsed < accelMs) {
        rafIdRef.current = requestAnimationFrame(accelStep);
      } else {
        startConstant(now, constMs, omegaDegPerSec, decelMs);
      }
    }
    rafIdRef.current = requestAnimationFrame(accelStep);
  }

  function startConstant(startNow, constMs, omegaDegPerSec, decelMs) {
    lastTimeRef.current = startNow;
    function step(now) {
      const elapsed = now - startNow;
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      rotationRef.current = rotationRef.current + omegaDegPerSec * dt;
      setWheelRotation(rotationRef.current);
      if (elapsed < constMs) {
        rafIdRef.current = requestAnimationFrame(step);
      } else {
        startDecel(now, decelMs, omegaDegPerSec);
      }
    }
    rafIdRef.current = requestAnimationFrame(step);
  }

  function startDecel(startNow, decelMs, omegaStart) {
    const angleStart = rotationRef.current;
    const angleDelta = 0.5 * omegaStart * (decelMs / 1000);
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    function step(now) {
      const t = Math.min(1, (now - startNow) / decelMs);
      const angle = angleStart + angleDelta * easeOutCubic(t);
      rotationRef.current = angle;
      setWheelRotation(angle);
      if (t < 1) {
        rafIdRef.current = requestAnimationFrame(step);
      }
    }
    rafIdRef.current = requestAnimationFrame(step);
  }

  useEffect(() => {
    if (result) {
      setTimeout(() => {
        setFishSwimming(false);
        setShowFish(false);
      }, 1000);
    }
  }, [result]);

  return (
    <div className="wheel-container">
      <div
        className={`wheel-of-fortune ${isClickable ? 'clickable' : ''}`}
        ref={wheelRef}
      >
        <Wheel rotation={wheelRotation}>
          <CenterButton isClickable={isClickable} onClick={onWheelClick} />
        </Wheel>
        <Pointer />
      </div>

      <Fish
        show={showFish}
        swimming={fishSwimming}
        fishTopPx={fishTopPx}
        onEnd={() => { setShowFish(false); setFishSwimming(false); }}
      />

    </div>
  );
}



