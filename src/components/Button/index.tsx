import type { h } from "preact";

import Styles from "./styles.module.scss";

function Button({
  children,
}: {
  children: h.JSX.Element | Array<h.JSX.Element> | string;
}): h.JSX.Element {
  return <span className={Styles.button}>{children}</span>;
}

export default Button;
