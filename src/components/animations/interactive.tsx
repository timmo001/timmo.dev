"use client";
import { motion } from "motion/react";

export function HoverScale({
  children,
  scale = 1.05,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  scale?: number;
  className?: string;
}>) {
  return (
    <motion.div
      className={className}
      whileHover={{
        scale,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
}

export function HoverRotate({
  children,
  rotation = 5,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  rotation?: number;
  className?: string;
}>) {
  return (
    <motion.div
      className={className}
      whileHover={{
        rotate: rotation,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
    >
      {children}
    </motion.div>
  );
}

export function HoverLift({
  children,
  lift = -10,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  lift?: number;
  className?: string;
}>) {
  return (
    <motion.div
      className={className}
      whileHover={{
        y: lift,
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
    >
      {children}
    </motion.div>
  );
}

export function ClickPulse({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <motion.div
      className={className}
      whileTap={{
        scale: [1, 1.2, 1],
        transition: { duration: 0.3 },
      }}
    >
      {children}
    </motion.div>
  );
}

export function HoverGlow({
  children,
  glowColor = "rgb(129 140 248)",
  className = "",
}: Readonly<{
  children: React.ReactNode;
  glowColor?: string;
  className?: string;
}>) {
  return (
    <motion.div
      className={className}
      whileHover={{
        boxShadow: [
          `0 0 0px ${glowColor}`,
          `0 0 10px ${glowColor}`,
          `0 0 20px ${glowColor}`,
        ],
        transition: { duration: 0.3 },
      }}
    >
      {children}
    </motion.div>
  );
}

export function MagneticHover({
  children,
  strength = 20,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  strength?: number;
  className?: string;
}>) {
  return (
    <motion.div
      className={className}
      whileHover={{
        scale: 1.05,
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        e.currentTarget.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translate(0px, 0px) scale(1)";
      }}
      style={{ transition: "transform 0.3s ease" }}
    >
      {children}
    </motion.div>
  );
}

export function ShakeOnHover({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <motion.div
      className={className}
      whileHover={{
        x: [0, -2, 2, -2, 2, 0],
        transition: { duration: 0.4 },
      }}
    >
      {children}
    </motion.div>
  );
}

export function BounceOnClick({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <motion.div
      className={className}
      whileTap={{
        y: [0, -10, 0],
        transition: {
          type: "spring",
          stiffness: 500,
          damping: 10,
          duration: 0.3,
        },
      }}
    >
      {children}
    </motion.div>
  );
}
