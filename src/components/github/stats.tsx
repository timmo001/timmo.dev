import { type Stat as StatItem } from "~/types/github/stat";
import Stat from "~/components/stat";

export default function GitHubStats({ data }: { data: Array<StatItem> }) {
  return <>{data.map((stat: StatItem) => <Stat key={stat.key} data={stat} />)}</>;
}
