import React from "react";

interface Props {
  content: string;
}

export function BlogContent({ content }: Props) {
  // Parse markdown-like content into structured blocks
  const blocks = content.split(/\n\n+/);

  return (
    <div className="space-y-6 text-lg leading-relaxed text-foreground">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();

        // Level 2 Heading
        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={idx}
              className="mt-10 pt-4 font-serif text-2xl font-medium tracking-tight text-foreground md:text-3xl"
            >
              {trimmed.replace(/^##\s+/, "")}
            </h2>
          );
        }

        // Level 3 Heading
        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={idx}
              className="mt-8 font-serif text-xl font-medium tracking-tight text-foreground md:text-2xl"
            >
              {trimmed.replace(/^###\s+/, "")}
            </h3>
          );
        }

        // Blockquote (often Quran or Hadith)
        if (trimmed.startsWith("> ")) {
          const quoteLines = trimmed
            .split("\n")
            .map((l) => l.replace(/^>\s*/, ""))
            .join(" ");

          return (
            <blockquote
              key={idx}
              className="my-8 rounded-xl border-l-4 border-primary bg-secondary/40 p-6 font-serif text-xl italic leading-relaxed text-foreground"
            >
              {renderFormattedText(quoteLines)}
            </blockquote>
          );
        }

        // Bullet or Numbered List
        if (/^(\d+\.|-|\*)\s/.test(trimmed)) {
          const items = trimmed.split("\n").filter((l) => l.trim().length > 0);
          const isNumbered = /^\d+\.\s/.test(items[0]);

          if (isNumbered) {
            return (
              <ol key={idx} className="my-6 list-decimal space-y-3 pl-6 text-foreground">
                {items.map((item, itemIdx) => {
                  const cleaned = item.replace(/^\d+\.\s+/, "");
                  return <li key={itemIdx} className="leading-relaxed">{renderFormattedText(cleaned)}</li>;
                })}
              </ol>
            );
          }

          return (
            <ul key={idx} className="my-6 list-disc space-y-3 pl-6 text-foreground">
              {items.map((item, itemIdx) => {
                const cleaned = item.replace(/^(-|\*)\s+/, "");
                return <li key={itemIdx} className="leading-relaxed">{renderFormattedText(cleaned)}</li>;
              })}
            </ul>
          );
        }

        // Standard Paragraph
        return (
          <p key={idx} className="leading-relaxed text-foreground/90">
            {renderFormattedText(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Basic formatting helper for inline **bold** and *italic* and [link](url)
 */
function renderFormattedText(text: string): React.ReactNode {
  // Split by bold (**...**)
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i} className="italic text-foreground">{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

