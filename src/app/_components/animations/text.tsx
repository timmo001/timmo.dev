"use client";
import { motion } from "framer-motion";

export function TextGrab({
  children,
}: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return (
    <motion.text
      drag
      dragConstraints={{
        top: -10,
        left: -10,
        right: 10,
        bottom: 10,
      }}
      dragSnapToOrigin
      style={{ cursor: "grab" }}
    >
      {children}
    </motion.text>
  );
}
