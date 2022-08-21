import type { h } from "preact";
import type { MarkdownInstance } from "astro";

import type { Post } from "../../types/post";
import Styles from "./styles.module.scss";

function PostPreview({ post }: MarkdownInstance<Post>): h.JSX.Element {
  const { frontmatter } = post;
  return (
    <div className={Styles.card}>
      <div
        className={Styles.titleCard}
        style={`background-image:url(${frontmatter.img}); background-size: ${
          frontmatter.imgSize || "cover"
        };`}
      >
        <h1 className={Styles.title}>{frontmatter.title}</h1>
      </div>
      <div className="pa3">
        <p className={`${Styles.desc} mt0 mb2`}>{frontmatter.description}</p>
        <div className={Styles.tags}>
          {frontmatter.tags.map((t: string) => (
            <div className={Styles.tag} data-tag={t}>
              {t}
            </div>
          ))}
        </div>
        <a
          className={Styles.link}
          href={frontmatter.url || post.url}
          target={frontmatter.url ? "_blank" : "_self"}
        >
          <span className={Styles.linkInner}>View</span>
        </a>
      </div>
    </div>
  );
}

export default PostPreview;
