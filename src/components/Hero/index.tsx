import type { h } from "preact";

import Styles from "./styles.module.scss";

function Hero({ title }: { title?: string }): h.JSX.Element {
  return (
    <header class={Styles.hero}>
      <img
        class={Styles.heroimage}
        src="/assets/logo-square-wide-nobackground.png"
      />
      <div class={Styles.overlay}>
        <h1 class={Styles.title}>{title || "Aidan Timson (Timmo)"}</h1>
        <div class={Styles.roles}>
          {title ? (
            ""
          ) : (
            <>
              <span class={Styles.role}>
                Tinkerer <span class={Styles.invert}>Tinkerer</span>
              </span>
              &nbsp;
              <span class={Styles.role}>
                Developer <span class={Styles.invert}>Developer</span>
              </span>
              &nbsp;
              <span class={Styles.role}>
                All Round Nerd <span class={Styles.invert}>All Round Nerd</span>
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Hero;
