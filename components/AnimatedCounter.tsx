"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: string;
  duration?: number;
}

export default function AnimatedCounter({ value, duration = 1.8 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState("0");

  // استخراج الرقم والرمز (مثل + أو % أو X)
  const numericMatch = value.match(/[\d.]+/);
  const targetNumber = numericMatch ? parseFloat(numericMatch[0]) : 0;
  const isDecimal = value.includes(".");
  const suffix = value.replace(/[\d.]+/, "");

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const updateCounter = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

      // دالة تسارع وتباطؤ سلسة (Ease-out Cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = easeOut * targetNumber;

      if (isDecimal) {
        setDisplayValue(current.toFixed(1) + suffix);
      } else {
        setDisplayValue(Math.floor(current) + suffix);
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrame = requestAnimationFrame(updateCounter);

    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, targetNumber, duration, isDecimal, suffix, value]);

  return <span ref={ref}>{displayValue}</span>;
}
