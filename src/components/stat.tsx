import {
  BookmarkCheck,
  BookMarked,
  GitBranchPlus,
  GitPullRequestArrow,
  Handshake,
  Star,
  Target,
  Users,
} from "lucide-react";
import { type ReactElement, useMemo } from "react";
import { motion } from "framer-motion";

import { type Stat as StatItem } from "~/types/github/stat";

const iconProps = {
  className: "h-32 w-32",
};

const iconMap: Record<string, ReactElement> = {
  repositories: <BookMarked {...iconProps} />,
  followers: <Users {...iconProps} />,
  watching: <BookmarkCheck {...iconProps} />,
  starredRepositories: <Star {...iconProps} />,
  contributions: <GitBranchPlus {...iconProps} />,
  issues: <Target {...iconProps} />,
  pullRequests: <GitPullRequestArrow {...iconProps} />,
  reviews: <Handshake {...iconProps} />,
};

export default function Stat({ data }: { data: StatItem }) {
  const icon = useMemo<ReactElement>(
    () => iconMap[data.key] ?? <div />,
    [data.key],
  );

  return (
    <motion.a
      className="grid grid-cols-1 justify-items-center fill-white cursor-pointer"
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{
        scale: 1.1,
        y: -5,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}
      >
        {icon}
      </motion.div>
      <motion.h3 
        className="mt-2 text-3xl font-light"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        viewport={{ once: true }}
      >
        {data.title}
      </motion.h3>
      <motion.span 
        className="text-3xl font-medium"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.3, type: "spring" }}
        viewport={{ once: true }}
      >
        {data.value}
      </motion.span>
      {data.secondaryValue ? (
        <motion.span 
          className="text-base font-normal"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          viewport={{ once: true }}
        >
          {data.secondaryValue}
        </motion.span>
      ) : (
        <div
          style={{
            height: "24px",
          }}
        />
      )}
    </motion.a>
  );
}
