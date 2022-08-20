import type { h } from "preact";

import Styles from "./styles.module.scss";

function Footer(): h.JSX.Element {
  return (
    <footer className={Styles.footer}>
      &copy; {new Date().getFullYear()} Aidan Timson
      <br />
      <br />
      <small className={Styles.byline}>
        Built and designed by Aidan Timson
        <br />
        <br />
        Source avaliable on{" "}
        <a href="https://github.com/timmo001/timmo-site" target="_blank">
          GitHub
        </a>
      </small>
    </footer>
  );
}
export default Footer;
