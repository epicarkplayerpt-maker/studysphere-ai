import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Outfit, sans-serif',
});

// Suppress global throwing of parser errors to avoid triggering developer overlays
(mermaid as any).parseError = () => {};

interface MermaidRendererProps {
  chart: string;
}

/**
 * Robust cleaner to sanitize Mermaid diagram definitions.
 * Fixes unquoted brackets, parentheses in labels, and missing diagram headers.
 */
function cleanMermaidChart(rawChart: string): string {
  let cleaned = rawChart.trim();

  // Strip wrapping markdown ticks if present
  cleaned = cleaned.replace(/^```mermaid\s*/i, '');
  cleaned = cleaned.replace(/```$/, '');
  cleaned = cleaned.trim();

  // Direct check for common diagram type definitions
  const hasHeader = /^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram-v2|stateDiagram|erDiagram|gantt|pie|gitGraph|mindmap|journey|c4Diagram)/i.test(cleaned);
  if (!hasHeader) {
    cleaned = 'graph TD\n' + cleaned;
  }

  const lines = cleaned.split('\n');
  const processedLines = lines.map(line => {
    let newLine = line;
    
    // Find node shapes like ID[Label content] and wrap content in quotes if it has punctuation and isn't quoted
    const bracketMatch = newLine.match(/(\b\w+)\s*\[([^"\[\]\n]+)\]/);
    if (bracketMatch) {
      const id = bracketMatch[1];
      const label = bracketMatch[2].trim();
      const needsQuotes = /[\(\)\,\:\.\-\/\'\`\{\}\#]/g.test(label);
      if (needsQuotes && !label.startsWith('"') && !label.endsWith('"')) {
        newLine = newLine.replace(`${id}[${bracketMatch[2]}]`, `${id}["${label}"]`);
      }
    }

    // Find node shapes like ID(Label content)
    const parenMatch = newLine.match(/(\b\w+)\s*\(([^"\(\)\n]+)\)/);
    if (parenMatch) {
      const id = parenMatch[1];
      const label = parenMatch[2].trim();
      const needsQuotes = /[\(\)\,\:\.\-\/\'\`\{\}\#]/g.test(label);
      if (needsQuotes && !label.startsWith('"') && !label.endsWith('"')) {
        newLine = newLine.replace(`${id}(${parenMatch[2]})`, `${id}("${label}")`);
      }
    }

    // Find node shapes like ID{Label content}
    const braceMatch = newLine.match(/(\b\w+)\s*\{([^"\{\}\n]+)\}/);
    if (braceMatch) {
      const id = braceMatch[1];
      const label = braceMatch[2].trim();
      const needsQuotes = /[\(\)\,\:\.\-\/\'\`\{\}\#]/g.test(label);
      if (needsQuotes && !label.startsWith('"') && !label.endsWith('"')) {
        newLine = newLine.replace(`${id}{${braceMatch[2]}}`, `${id}{"${label}"}`);
      }
    }

    return newLine;
  });

  return processedLines.join('\n');
}

export const MermaidRenderer: React.FC<MermaidRendererProps> = ({ chart }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [containerHeight, setContainerHeight] = useState<number | string>('auto');

  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      try {
        setError(null);
        const cleanedChart = cleanMermaidChart(chart);

        // 1. Syntax check before render.
        // During AI streaming, the syntax will frequently be incomplete and invalid.
        // We catch this quietly so that we don't throw uncaught exceptions or glitch the screen.
        try {
          await mermaid.parse(cleanedChart);
        } catch (parseErr) {
          // Keep displaying the previously rendered SVG while streaming/typing.
          // Do not write error to screen yet unless we are completely finished and have no SVG.
          return;
        }

        const uniqueId = `mermaid-${Math.floor(Math.random() * 1000000)}`;
        
        // 2. Render diagram
        const { svg: renderedSvg } = await mermaid.render(uniqueId, cleanedChart);
        
        if (isMounted) {
          setSvg(renderedSvg);
          setError(null);
        }
      } catch (err: any) {
        console.error('Mermaid Render Error:', err);
        if (isMounted && !svg) {
          setError('Failed to render diagram syntax cleanly.');
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  // Adjust container height dynamically based on SVG contents
  useEffect(() => {
    if (!svg || !elementRef.current) return;
    
    const element = elementRef.current;
    
    const measureHeight = () => {
      const svgElement = element.querySelector('svg');
      if (svgElement) {
        const rect = svgElement.getBoundingClientRect();
        if (rect.height > 0) {
          setContainerHeight(rect.height + 48); // add padding (p-6 is 24px top + 24px bottom = 48px)
        }
      }
    };

    // Run initial measure
    measureHeight();

    const observer = new ResizeObserver(() => {
      measureHeight();
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [svg]);

  if (error) {
    return (
      <div className="bg-red-950/20 border border-red-900/35 text-red-400 p-4 rounded-lg text-xs font-mono my-2 select-text">
        <p className="font-bold mb-1">⚠️ Diagram Syntax Fallback:</p>
        <pre className="overflow-x-auto whitespace-pre-wrap leading-normal">{chart.trim()}</pre>
      </div>
    );
  }

  return (
    <div 
      ref={elementRef}
      style={{
        height: svg ? containerHeight : '120px',
        transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className="flex justify-center items-center bg-input/40 p-6 border border-border rounded-xl overflow-hidden my-4 shadow-inner min-h-[120px]"
      dangerouslySetInnerHTML={{ __html: svg || '<span class="text-xs text-muted animate-pulse">Generating mind map...</span>' }}
    />
  );
};
