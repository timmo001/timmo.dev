"use client";
import { motion } from "motion/react";

export function TextFadeInUp({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.span>
  );
}

export function TextFadeInUpGrab({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <motion.span
      className="select-none"
      drag
      dragConstraints={{
        top: -10,
        left: -10,
        right: 10,
        bottom: 10,
      }}
      dragSnapToOrigin
      style={{ cursor: "grab" }}
      initial={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.5 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.span>
  );
}

export function TextTypewriter({
  text,
  className = "",
}: Readonly<{ text: string; className?: string }>) {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      x: 20,
      transition: {
        type: "spring" as const,
        damping: 12,
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
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
}

export function TextWave({
  text,
  className = "",
}: Readonly<{ text: string; className?: string }>) {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const child = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 8,
        stiffness: 200,
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
      {letters.map((letter, index) => (
        <motion.span
          variants={child}
          key={index}
          className="inline-block"
          whileHover={{
            y: -10,
            transition: { type: "spring", stiffness: 300 },
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
}

export function TextSlideInLeft({
  children,
  delay = 0,
}: Readonly<{ children: React.ReactNode; delay?: number }>) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 100,
      }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
}

export function TextSlideInRight({
  children,
  delay = 0,
}: Readonly<{ children: React.ReactNode; delay?: number }>) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 100,
      }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
}

export function TextGlow({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      whileHover={{
        textShadow: [
          "0 0 4px rgb(129 140 248)",
          "0 0 8px rgb(129 140 248)",
          "0 0 12px rgb(129 140 248)",
        ],
        transition: { duration: 0.3 },
      }}
    >
      {children}
    </motion.div>
  );
}
