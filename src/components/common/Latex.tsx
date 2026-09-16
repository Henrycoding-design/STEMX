import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface LatexProps {
  content?: string;
  block?: boolean;
}

export function Latex({ content, block = false }: LatexProps) {
  const formula = content ?? "";
  if (!formula.trim()) return null;

  try {
    const html = katex.renderToString(formula.trim(), {
      displayMode: block,
      throwOnError: false,
      strict: false,
    });
    return <span className={block ? "block overflow-x-auto py-1" : "inline-block align-middle"} dangerouslySetInnerHTML={{ __html: html }} />;
  } catch {
    return <span className={block ? "block overflow-x-auto py-1" : "inline-block align-middle"}>{formula}</span>;
  }
}
