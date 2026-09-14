import React, { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Configure marked defaults
marked.setOptions({
  gfm: true,
  breaks: true,
});

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const sanitizedHtml = useMemo(() => {
    if (!content) return "";

    try {
      // Parse markdown to HTML synchronously
      const rawHtml = marked.parse(content, { async: false }) as string;

      // Configure DOMPurify to automatically open links in a new tab safely
      const cleanHtml = DOMPurify.sanitize(rawHtml, {
        ADD_ATTR: ["target", "rel"],
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
