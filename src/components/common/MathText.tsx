import React from "react";

interface MathTextProps {
  text: string;
  className?: string;
}

const SUBSCRIPT_PATTERN = /([\p{L}][\p{L}\d]*)_(?:\{([^}]+)\}|([\p{L}\d]+))/gu;

export function drawMathText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
  const font = ctx.font;
  const textAlign = ctx.textAlign;
  const fontSize = Number(font.match(/([\d.]+)px/)?.[1] ?? 12);
  const subscriptFont = font.replace(/[\d.]+px/, `${fontSize * 0.7}px`);
  const segments: Array<{ text: string; subscript?: string }> = [];
  let lastIndex = 0;
  let totalWidth = 0;

  for (const match of text.matchAll(SUBSCRIPT_PATTERN)) {
    const index = match.index ?? 0;
    const [notation, symbol, groupedSubscript, simpleSubscript] = match;
    const subscript = groupedSubscript ?? simpleSubscript;
    if (index > lastIndex) segments.push({ text: text.slice(lastIndex, index) });
    segments.push({ text: symbol, subscript });
    lastIndex = index + notation.length;
  }
  if (lastIndex < text.length) segments.push({ text: text.slice(lastIndex) });

  ctx.font = font;
  for (const segment of segments) {
    totalWidth += ctx.measureText(segment.text).width;
    if (segment.subscript) {
      ctx.font = subscriptFont;
      totalWidth += ctx.measureText(segment.subscript).width;
      ctx.font = font;
    }
  }

  let cursorX = x;
  if (textAlign === "center") cursorX -= totalWidth / 2;
  else if (textAlign === "right" || textAlign === "end") cursorX -= totalWidth;
  ctx.textAlign = "left";

  for (const segment of segments) {
    ctx.font = font;
    ctx.fillText(segment.text, cursorX, y);
    cursorX += ctx.measureText(segment.text).width;
    if (segment.subscript) {
      ctx.font = subscriptFont;
      ctx.fillText(segment.subscript, cursorX, y + fontSize * 0.25);
      cursorX += ctx.measureText(segment.subscript).width;
    }
  }

  ctx.font = font;
  ctx.textAlign = textAlign;
}

/** Renders plain-text physics notation such as H_max with a typographic subscript. */
export default function MathText({ text, className }: MathTextProps) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(SUBSCRIPT_PATTERN)) {
    const index = match.index ?? 0;
    const [notation, symbol, groupedSubscript, simpleSubscript] = match;
    const subscript = groupedSubscript ?? simpleSubscript;

    if (index > lastIndex) parts.push(text.slice(lastIndex, index));
    parts.push(
      <React.Fragment key={`${index}-${notation}`}>
        {symbol}<sub className="text-[0.7em]">{subscript}</sub>
      </React.Fragment>,
    );
    lastIndex = index + notation.length;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return <span className={className}>{parts.length ? parts : text}</span>;
}
