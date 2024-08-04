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
import { ReactElement, useMemo } from "react";

import { Stat as StatItem } from "~/types/github/stat";

const iconMap: Record<string, ReactElement> = {
  repositories: <BookMarked />,
  followers: <Users />,
  watching: <BookmarkCheck />,
  starredRepositories: <Star />,
  contributions: <GitBranchPlus />,
  issues: <Target />,
  pullRequests: <GitPullRequestArrow />,
  reviews: <Handshake />,
};

export default function Stat({ data }: { data: StatItem }) {
  const icon = useMemo<ReactElement>(
    () => iconMap[data.key] || <div />,
    [data.key],
  );

  return (
    <a
      className="grid grid-cols-1 justify-items-center"
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
      <h3 className="mt-2 text-2xl font-light">{data.title}</h3>
      <span className="text-2xl font-medium">{data.value}</span>
      {data.secondaryValue ? (
        <span className="text-sm font-normal">{data.secondaryValue}</span>
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
