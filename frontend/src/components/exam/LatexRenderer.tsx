import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface LatexRendererProps {
  content: string;
  className?: string;
}

/**
 * Renders text with LaTeX equations.
 * Supports:
 * - Inline math: $x^2 + y^2 = z^2$
 * - Display math: $$\int_0^1 x^2 dx$$
 */
export default function LatexRenderer({ content, className = '' }: LatexRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Process the content to render LaTeX
      const processedContent = processLatex(content);
      containerRef.current.innerHTML = processedContent;
    } catch (error) {
      console.error('LaTeX rendering error:', error);
      containerRef.current.textContent = content;
    }
  }, [content]);

  return <div ref={containerRef} className={`latex-content ${className}`} />;
}

/**
 * Process LaTeX in text content
 * Handles both inline ($...$) and display ($$...$$) math
 */
function processLatex(text: string): string {
  let result = text;
  
  // Process display math first ($$...$$)
  result = result.replace(/\$\$([\s\S]+?)\$\$/g, (match, math) => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: true,
        throwOnError: false,
        output: 'html',
      });
    } catch (e) {
      return `<span class="text-red-600">Error: ${match}</span>`;
    }
  });

  // Process inline math ($...$)
  result = result.replace(/\$([^\$]+?)\$/g, (match, math) => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: false,
        throwOnError: false,
        output: 'html',
      });
    } catch (e) {
      return `<span class="text-red-600">Error: ${match}</span>`;
    }
  });

  // Convert line breaks to <br>
  result = result.replace(/\n/g, '<br>');

  return result;
}

/**
 * Hook to check if content contains LaTeX
 */
export function hasLatex(text: string): boolean {
  return /\$.*?\$/.test(text) || /\$\$.*?\$\$/.test(text);
}
