import type { h } from "preact";

import Styles from "./styles.module.scss";

export function Button({
  children,
}: {
  children: h.JSX.Element | Array<h.JSX.Element>;
}): h.JSX.Element {
  return <span className={Styles.button}>{children}</span>;
}
