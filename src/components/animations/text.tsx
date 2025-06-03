"use client";
import { motion } from "framer-motion";

export function TextFadeInUp({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <motion.text
      initial={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.text>
  );
}

export function TextFadeInUpGrab({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <motion.text
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
    </motion.text>
  );
}
