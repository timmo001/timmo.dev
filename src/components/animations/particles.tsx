"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
}

export function FloatingParticles({
  count = 20,
  className = "",
}: Readonly<{
  count?: number;
  className?: string;
}>) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        duration: Math.random() * 10 + 10,
      });
    }
    setParticles(newParticles);
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-indigo-400"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, -10, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function StarField({
  count = 50,
  className = "",
}: Readonly<{
  count?: number;
  className?: string;
}>) {
  const [stars, setStars] = useState<Particle[]>([]);

  useEffect(() => {
    const newStars: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        duration: Math.random() * 3 + 2,
      });
    }
    setStars(newStars);
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [star.opacity, star.opacity * 0.3, star.opacity],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function GeometricShapes({
  count = 10,
  className = "",
}: Readonly<{
  count?: number;
  className?: string;
}>) {
  const [shapes, setShapes] = useState<Particle[]>([]);

  useEffect(() => {
    const newShapes: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newShapes.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 30 + 20,
        opacity: Math.random() * 0.1 + 0.05,
        duration: Math.random() * 20 + 15,
      });
    }
    setShapes(newShapes);
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {shapes.map((shape, index) => (
        <motion.div
          key={shape.id}
          className={`absolute border border-indigo-300 ${
            index % 3 === 0 ? "rounded-full" : index % 3 === 1 ? "rounded-lg" : ""
          }`}
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: shape.size,
            height: shape.size,
            opacity: shape.opacity,
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}