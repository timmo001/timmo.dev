import React from "react";

export function SectionBlock({
  heading,
  children,
  headingClassName = "mb-3 text-2xl leading-snug font-bold tracking-tight text-white",
  paragraphClassName = "text-start text-xl leading-relaxed font-normal tracking-normal text-white",
}: {
  heading?: string;
  children: React.ReactNode;
  headingClassName?: string;
  paragraphClassName?: string;
}) {
  return (
    <>
      {heading && <h4 className={headingClassName}>{heading}</h4>}
      <p className={paragraphClassName}>{children}</p>
    </>
  );
}

export default SectionBlock;
