import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

let mermaidId = 0;

export default function MermaidChart({ chart, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.initialize({ startOnLoad: false });
      // Use a unique key for the SVG, but don't try to match it to a DOM element
      const uniqueKey = `mermaid-svg-${++mermaidId}`;
      mermaid.render(uniqueKey, chart).then(({ svg }) => {
        ref.current.innerHTML = svg;
      });
    }
  }, [chart]);

  return <div ref={ref} className={className} />;
}