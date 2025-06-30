"use client";
import React from "react";
import { motion } from "motion/react";

export function FadeInContainer({
  children,
  delay = 0,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}>) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut",
      }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
}

export function SlideInContainer({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  className?: string;
}>) {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { x: 0, y: 50 };
      case "down":
        return { x: 0, y: -50 };
      case "left":
        return { x: 50, y: 0 };
      case "right":
        return { x: -50, y: 0 };
      default:
        return { x: 0, y: 50 };
    }
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...getInitialPosition() }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: 0.7,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
}

export function ScaleInContainer({
  children,
  delay = 0,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}>) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}>) {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div key={index} variants={item}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

export function FloatingContainer({
  children,
  intensity = 10,
  duration = 3,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  intensity?: number;
  duration?: number;
  className?: string;
}>) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      animate={{
        y: [0, -intensity, 0],
        transition: {
          duration,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RotateInContainer({
  children,
  delay = 0,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}>) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
      whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
}
