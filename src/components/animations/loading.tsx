"use client";
import { motion } from "framer-motion";

export function SpinnerLoader({
  size = 40,
  color = "#6366f1",
}: Readonly<{
  size?: number;
  color?: string;
}>) {
  return (
    <motion.div
      className="flex items-center justify-center"
      style={{
        width: size,
        height: size,
      }}
    >
      <motion.div
        className="rounded-full border-4 border-t-transparent"
        style={{
          width: size,
          height: size,
          borderColor: `${color}33`,
          borderTopColor: color,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </motion.div>
  );
}

export function PulseLoader({
  size = 12,
  color = "#6366f1",
}: Readonly<{
  size?: number;
  color?: string;
}>) {
  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

export function BouncingBalls({
  size = 16,
  color = "#6366f1",
}: Readonly<{
  size?: number;
  color?: string;
}>) {
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
          }}
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function WaveLoader({
  width = 40,
  height = 4,
  color = "#6366f1",
}: Readonly<{
  width?: number;
  height?: number;
  color?: string;
}>) {
  return (
    <div className="flex items-end space-x-1" style={{ height: 20 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{
            width: width / 5,
            backgroundColor: color,
          }}
          animate={{
            height: [height, height * 3, height],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonLoader({
  className = "",
}: Readonly<{
  className?: string;
}>) {
  return (
    <motion.div
      className={`bg-gray-300 rounded ${className}`}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}