import { type Language } from "~/types/github/language";
import { USERNAME } from "~/lib/github";

export default function GitHubTopLanguages({
  data,
}: {
  data: Array<Language>;
}) {
  return data.map((language: Language, idx: number) => (
    <a
      key={idx}
      className="inline-flex items-center rounded-full px-5 py-2 text-lg leading-5 font-medium transition-transform duration-300 ease-in-out hover:scale-110"
      href={`https://github.com/${USERNAME}?tab=repositories&language=${language.name.toLowerCase()}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: language.contrastColor,
        backgroundColor: language.color,
      }}
    >
      {language.name}
    </a>
  ));
}
