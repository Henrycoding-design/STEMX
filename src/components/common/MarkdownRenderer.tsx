import React, { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import katex from "katex";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Configure marked defaults
marked.setOptions({
  gfm: true,
  breaks: true,
});

function renderMathPlaceholders(content: string) {
  const renderedMath: string[] = [];
  const withPlaceholders = content
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, formula: string) => {
      const index = renderedMath.push(katex.renderToString(formula.trim(), {
        displayMode: true,
        throwOnError: false,
        strict: false,
      })) - 1;
      return `MATH_BLOCK_${index}_END`;
    })
    .replace(/\$([^$\n]+?)\$/g, (_, formula: string) => {
      const index = renderedMath.push(katex.renderToString(formula.trim(), {
        displayMode: false,
        throwOnError: false,
        strict: false,
      })) - 1;
      return `MATH_INLINE_${index}_END`;
    });

  return { withPlaceholders, renderedMath };
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const sanitizedHtml = useMemo(() => {
    if (!content) return "";

    try {
      const { withPlaceholders, renderedMath } = renderMathPlaceholders(content);
      // Parse markdown to HTML synchronously, restoring trusted KaTeX output afterward.
      const rawHtml = marked.parse(withPlaceholders, { async: false }) as string;

      // Configure DOMPurify to automatically open links in a new tab safely
      const cleanHtml = DOMPurify.sanitize(rawHtml, {
        ADD_ATTR: ["target", "rel"],
      }).replace(/MATH_(?:BLOCK|INLINE)_(\d+)_END/g, (placeholder, index: string) => {
        return renderedMath[Number(index)] ?? placeholder;
      });

      // Post-process links if needed to ensure target="_blank" and rel="noopener noreferrer"
      const parser = new DOMParser();
      const doc = parser.parseFromString(cleanHtml, "text/html");
      const links = doc.querySelectorAll("a");
      links.forEach((link) => {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      });

      return doc.body.innerHTML;
    } catch (err) {
      console.error("Error rendering markdown:", err);
      return DOMPurify.sanitize(content);
    }
  }, [content]);

  return (
    <div
      className={`markdown-content leading-relaxed break-words ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
