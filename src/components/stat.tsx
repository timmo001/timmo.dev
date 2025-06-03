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
    <a
      className="grid grid-cols-1 justify-items-center fill-white transition-transform duration-300 ease-in-out hover:scale-110"
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
      <h3 className="mt-2 text-3xl font-light">{data.title}</h3>
      <span className="text-3xl font-medium">{data.value}</span>
      {data.secondaryValue ? (
        <span className="text-base font-normal">{data.secondaryValue}</span>
      ) : (
        <div
          style={{
            height: "24px",
          }}
        />
      )}
    </a>
  );
}
